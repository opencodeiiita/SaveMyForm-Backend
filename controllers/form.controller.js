import {
  response_200,
  response_201,
  response_400,
  response_401,
  response_500,
} from '../utils/responseCodes.js';
import { verifycaptcha } from '../utils/recaptcha.js';
import { hash_password, encryptString } from '../utils/password.js';
import Form from '../models/form.model.js';
import Project from '../models/project.model.js';
import { generateRandomString } from '../utils/generateRandomString.js';
import { prisma } from '../config/sql.config.js';
import mongoose from 'mongoose';

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
    hasRecaptcha === undefined ||
    hasFileField === undefined ||
    !schema ||
    !password ||
    !recaptcha_token
  ) {
    return response_400(res, 'Fields missing for updation');
  }

  if (!verifycaptcha(recaptcha_token))
    return response_400(res, 'Captcha not verified');

  const passwordHash = await hash_password(password);
  let form = await Form.aggregate([
    {
      $match: {
        formId: id,
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
      $project: {
        name: 1,
        hasRecaptchaVerification: 1,
        hasFileField: 1,
        schema: 1,
        project: {
          owner: {
            name: 1,
            email: 1,
            passwordHash: 1,
          },
        },
      },
    },
    {
      $match: {
        'project.owner.passwordHash': passwordHash,
      },
    },
    {
      $project: {
        name: 1,
        hasRecaptchaVerification: 1,
        hasFileField: 1,
        schema: 1,
      },
    },
  ]);

  if (!form) return response_400(res, 'User is not the owner');

  const updatedForm = await Form.findOneAndUpdate(
    { formId: id },
    {
      name: name,
      hasRecaptchaVerification: hasRecaptcha,
      hasFileField: hasFileField,
      schema: schema,
    },
    { new: true },
  ).select(
    'formId name hasRecaptchaVerification hasFileField schema submisssionLinkGeneratedAt',
  );

  let submisssionLinkGeneratedAt = updatedForm.submisssionLinkGeneratedAt;
  const { hostUrl } = req.body;
  let encryptedStr = encryptString(
    JSON.stringify({
      formId: id,
      submisssionLinkGeneratedAt,
    }),
  );
  let url = `${hostUrl}/main/submit?formRef=${encryptedStr}`;
  response_200(res, 'form sucessfully updated', {
    ...updatedForm,
    submissionLink: url,
  });
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
    let form = await Form.aggregate([
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
          schema: 1,
          hasRecaptchaVerification: 1,
          hasFileField: 1,
          submisssionLinkGeneratedAt: 1,
          'project.name': 1,
        },
      },
    ]);
    form = form[0];
    if (!form) return response_400(res, 'Form not found');
    return response_200(res, 'OK', form);
  } catch (error) {
    console.log(error);
    return response_500(res, 'Server Error', error);
  }
}

export async function getFormSubmissions(req, res) {
  try {
    const { formId } = req.params;
    const { limit, skip } = req.query;
    const submissionCountPromise = prisma.formSubmission.count({
      where: {
        formId: formId,
      },
    });
    const formSubmissionsPromise = prisma.formSubmission.findMany({
      take: parseInt(limit),
      skip: parseInt(skip),
      where: {
        formId: formId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        data: true,
        createdAt: true,
      },
    });
    let [submissionCount, formSubmissions] = await Promise.all([
      submissionCountPromise,
      formSubmissionsPromise,
    ]);
    return response_200(res, 'OK', {
      submissions: formSubmissions,
      totalSubmissions: submissionCount,
    });
  } catch (error) {
    console.log(error);
    return response_500(res, 'Server Error', error);
  }
}

export async function deleteForm(req, res) {
  try {
    const { formId } = req.params;
    const password = req.body.password;

    const [form] = await Form.aggregate([
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
        $project: {
          formId: 1,
          name: 1,
          'project.owner': 1,
        },
      },
    ]);

    if (!form) {
      return response_400(res, 'Form not found');
    }
    const isOwner = req.user._id.equals(form.project.owner._id);
    if (!isOwner) {
      return response_401(res, 'Unauthorized');
    }

    const hash = await hash_password(password);
    const isPasswordValid = hash === form.project.owner.passwordHash;

    if (!isPasswordValid) {
      return response_400(res, 'Invalid password');
    }

    await Form.deleteOne({ formId });
    await prisma.formSubmission.deleteMany({
      where: {
        formId: formId,
      },
    });
    return response_200(res, 'Form deleted successfully');
  } catch (error) {
    console.log(error);
    return response_500(res, 'Server Error', error);
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
export async function generateCSV(req, res) {
  try {
    const { formId } = req.params;
    const formSubmissions = await prisma.formSubmission.findMany({
      where: {
        formId: formId,
      },
      select: {
        data: true,
      },
    });
    let csv = 'data:text/csv;charset=utf-8,';
    csv += Object.keys(formSubmissions[0].data).join(',') + '\n';
    formSubmissions.forEach((submission) => {
      csv += Object.values(submission.data).join(',') + '\n';
    });
    let encodeUri = encodeURI(csv);
    return response_200(res, 'OK', { encodeUri });
  } catch (error) {
    return response_500(res, 'Server Error', error);
  }
}
