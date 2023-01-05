import { response_200,response_201, response_400,response_500 } from '../utils/responseCodes.js';
import verifycaptcha from '../utils/recaptcha.js';
import { hash_password } from '../utils/password.js';
import Form from '../models/form.model.js';
import Project from '../models/project.model.js';
import { Schema } from 'mongoose';

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
    id: 1,
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

export async function createForm(req,res){
    if(!verifycaptcha(req.body.recaptcha_token)) return response_400(res,'Captcha not verified')
    if((!req.body.name || !req.body.schema || req.body.hasFileField===undefined || req.body.hasRecaptcha===undefined)) return response_400(res,'All request parameters not present')
    if(req.body.name==='') return response_400(res,'Name cannot be an empty string')
    const projectId = req.params.projectId
    const project = await Project.findById(projectId)
    if(!project) return response_400(res,'No project found with this id')
    if(req.user._id!==project.owner) return response_400(res,'Only the owner can create new form')
    try{
        const newForm = Form({
            name: req.body.name,
            project: Schema.Types.ObjectId(projectId),
            schema: Schema.Types.Mixed(req.body.schema),
            hasFileField: req.body.hasFileField,
            hasRecaptchaVerification: req.body.hasRecaptcha
        })
        await newForm.save()
        return response_201(res,'New form created',{
            name: newForm.name,
            id: newForm.id
        })
    }
    catch(error){
        return response_500(res,'Server Error',error)
    }
}