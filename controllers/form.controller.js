import {
  response_200,
  response_201,
  response_400,
  response_401,
  response_500,
} from '../utils/responseCodes.js';
import verifycaptcha from '../utils/recaptcha.js';
import { hash_password } from '../utils/password.js';
import Form from '../models/form.model.js';
import Project from '../models/project.model.js';
import { generateRandomString } from '../utils/generateRandomString.js';

export async function updateForm(req, res) {
  const id = req.params.id;
  const request = req.body;
  if (
    !(
      'name' in request ||
      'hasRecaptcha' in request ||
      'hasFileField' in request ||
      'schema' in request ||
      'password' in request ||
      'recaptcha_token' in request
    )
  ) {
    response_400(res, 'Fields missing for updation');
  }
  let { name, hasRecaptcha, hasFileField, schema, password, recaptcha_token } =
    request;
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
  if (!project) return response_400(res, 'No project found with this id');

  //Mongoose object id cannot be equated directly so i converted them into string and checked that.
  if (String(req.user._id) !== String(project.owner))
    return response_400(res, 'Only the owner can create new form');
  try {
    let newForm = await Form.create({
      name: req.body.name,
      project: project._id,
      schema: req.body.schema,
      hasFileField: req.body.hasFileField,
      hasRecaptchaVerification: req.body.hasRecaptcha,
      submissions: [],
      formId: generateRandomString(16),
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
    });
  } catch (error) {
    console.log(error);
    return response_500(res, 'Server Error', error);
  }
}

//This is currently not working as intended since we don't have routes for formSubmission
//and as a result we cannot sort or check it for now.
//So I have written the function but can't verify if it works or not for now.
export async function dashboard(req, res) {
  const id = req.params.id;
  let form = await Form.findById(id);
  form = Form.findOne({ formId: id })
    .populate({
      path: 'project',
      select: 'owner collaborators',
    })
    .populate({
      path: 'project.owner',
      select: '_id name email',
    });

  if (
    req.user._id !== form.project.owner._id &&
    !(req.user._id in form.project.collaborators)
  )
    response_401(res, 'UnAuthorised');

  const sort = {};
  if (req.query.sort) {
    const parts = req.query.sort.split(':');
    sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
  }
  let perpage = parseInt(req.query.perpage);
  let page = parseInt(req.query.page);

  let submissions = Form.findOne({ formId: id });
  let total_pages = submissions.submissions.length / perpage;
  total_pages = Math.ceil(total_pages);

  if (page < 0 || page > total_pages) {
    response_400(res, 'invalid page number');
  }
  form = await Form.findOne({ formId: id })
    .populate({
      path: 'project',
      select: 'owner collaborators',
    })
    .populate({
      path: 'project.owner',
      select: '_id name email',
    })
    .populate({
      path: 'submissions',
      select: 'id data file createdAt',
      perDocumentLimit: perpage,
      options: {
        limit: parseInt(perpage),
        skip: page * perpage,
        sort,
      },
    })
    .select('formId name project hasRecaptcha submissions');
  form = form.toJSON();
  form.id = form.formId;
  delete form.formId;
  form.owner = form.project.owner;
  form.submissions = {
    total: form.submissions.length,
    data: form.submissions,
    page: page,
    perpage: perpage,
    has_next_page: page < total_pages,
    total_pages: total_pages,
    has_prev_pages: page > 0,
  };
}
