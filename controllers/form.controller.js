import {
  response_200,
  response_201,
  response_400,
  response_401,
  response_500,
} from '../utils/responseCodes.js';
import verifycaptcha from '../utils/recaptcha.js';
import { hash_password, encryptString } from '../utils/password.js';
import Form from '../models/form.model.js';
import Project from '../models/project.model.js';
import { generateRandomString } from '../utils/generateRandomString.js';
import { prisma } from '../config/sql.config.js';
export async function updateForm(req, res) {
  const id = req.params.id;

  const {
    name,
    hasRecaptcha,
    hasFileField,
    schema,
    password,
    recaptcha_token,
  } = req.body;

  if (
    !name ||
    !hasRecaptcha ||
    !hasFileField ||
    !schema ||
    !password ||
    !recaptcha_token
  ) {
    response_400(res, 'Fields missing for updation');
  }

  if (!verifycaptcha(recaptcha_token))
    return response_400(res, 'Captcha not verified');
  password = await hash_password(password);
  let form = await Form.findById(id);

  form = form
    .populate({
      path: 'project',
      select: 'owner',
    })
    .populate({
      path: 'project.owner',
      select: '_id name email passwordHash',
    });

  if (password !== form.project.owner.passwordHash)
    response_400(res, 'User is not the owner');

  form = await form.updateOne({
    name: name,
    hasRecaptchaVerification: hasRecaptcha,
    hasFileField: hasFileField,
    schema: schema,
  });

  form = await form.project({
    formId: 1,
    name: 1,
    hasRecaptchaVerification: 1,
    is_owner: { $eq: [req.user._id, '$$$project.owner._id'] },
    owner: {
      name: '$$$project.owner.name',
      email: '$$$project.owner.email',
    },
  });
  response_200(res, 'form sucessfully updated', form);
}

export async function createForm(req, res) {
  if (!verifycaptcha(req.body.recaptcha_token))
    return response_400(res, 'Captcha not verified');
  if (
    !req.body.name ||
    !req.body.schema ||
    req.body.hasFileField === undefined ||
    req.body.hasRecaptcha === undefined
    // req.body.submissions === undefined
  )
    return response_400(res, 'All request parameters not present');
  if (req.body.name === '')
    return response_400(res, 'Name cannot be an empty string');
  const projectId = req.params.projectId;
  const project = await Project.findOne({ projectId });
  console.log(project);
  if (!project) return response_400(res, 'No project found with this id');

  //Mongoose object id cannot be equated directly so i converted them into string and checked that.
  if (String(req.user._id) !== String(project.owner))
    return response_400(res, 'Only the owner can create new form');
  //If the project has 5 forms already then we cannot create a new form.
  if (project.forms.length == 5) {
    return response_400(
      res,
      'Number of forms in this project has already reached max limit of 5.',
    );
  }
  try {
    let formId = generateRandomString(16);
    let submisssionLinkGeneratedAt = Date.now();
    const { hostUrl } = req.body;
    let encryptedStr = encryptString(
      JSON.stringify({
        formId,
        submisssionLinkGeneratedAt,
      }),
    );
    let url = `${hostUrl}/main/submit?formRef=${encryptedStr}`;
    let newForm = await Form.create({
      name: req.body.name,
      project: project._id,
      schema: req.body.schema,
      hasFileField: req.body.hasFileField,
      hasRecaptchaVerification: req.body.hasRecaptcha,
      formId: formId,
      submisssionLinkGeneratedAt,
    });
    console.log(newForm);
    Project.findByIdAndUpdate(
      project._id,
      { forms: [...project.forms, newForm._id] },
      function (error) {
        if (error) {
          return response_500(res, 'Database Error', error);
        }
      },
    );
    return response_201(res, 'New form created', {
      name: newForm.name,
      id: newForm.formId,
      submisssionUrl: url,
    });
  } catch (error) {
    console.log(error);
    return response_500(res, 'Server Error', error);
  }
}
export async function getForm(req, res) {
  try {
    const { formId } = req.params;
    const form = await Form.aggregate([
      {
        $match: {
          formId: formId,
        },
      },
      {
        $lookup: {
          from: 'projects',
          localField: 'project',
          foreignField: '_id',
          as: 'project',
        },
      },
      {
        $unwind: '$project',
      },
      {
        $lookup: {
          from: 'users',
          localField: 'project.owner',
          foreignField: '_id',
          as: 'project.owner',
        },
      },
      {
        $unwind: '$project.owner',
      },
      {
        $addFields: {
          is_owner: { $eq: [req.user._id, '$project.owner._id'] },
          owner: {
            name: '$project.owner.name',
            email: '$project.owner.email',
          },
        },
      },
      {
        $project: {
          formId: 1,
          name: 1,
          is_owner: 1,
          owner: 1,
          hasRecaptchaVerification: 1,
          hasFileField: 1,
          submisssionLinkGeneratedAt: 1,
          'project.name': 1,
        },
      },
    ]);
    if (!form) return response_400(res, 'Form not found');
    const formSubmissions = await prisma.formSubmission.findMany({
      where: {
        formId: formId,
      },
    });
    form.submission = formSubmissions;
    console.log(form);
    return response_200(res, 'OK', form);
  } catch (error) {
    console.log(error);
    return response_500(res, 'Server Error', error);
  }
}
export async function deleteForm(req, res) {
  try {
    const id = req.body.id;
    const form = await Form.findById(id)
      .populate({
        path: 'project',
        select: 'owner',
      })
      .populate({
        path: 'project.owner',
        select: '_id name email passwordHash',
      });
    if (!form) {
      return res.status(400).json({ msg: 'Form not found' });
    }
    const isOwner = req.user._id === form.project.owner._id;
    if (!isOwner) {
      return res.status(401).json({ msg: 'Unauthorized' });
    }
    const password = req.body.password;
    password = await hash_password(password); // Assuming the password is provided in the request body
    if (password !== form.project.owner.passwordHash) {
      return res.status(400).json({ msg: 'User is not the owner' });
    }
    await form.deleteOne();
    res.status(200).json({ data: form, msg: 'Form deleted successfully' });
  } catch (error) {
    res.status(500).json({ msg: 'An error occurred while deleting the form' });
  }
}

export async function generateSubmissionLink(req, res) {
  try {
    const { formId } = req.params;
    const { hostUrl } = req.query;
    let submissionLinkGeneratedAt = Date.now();
    let encryptedStr = await encryptString(
      JSON.stringify({ formId, submissionLinkGeneratedAt }),
    );
    let form = await Form.findOneAndUpdate(
      { formId: formId },
      { submissionLinkGeneratedAt },
    );
    let url = `${hostUrl}/main/submit/?formRef=${encryptedStr}`;
    return response_200(res, 'OK', { submissionUrl: url });
  } catch (error) {
    return response_500(res, 'Server Error', error);
  }
}
