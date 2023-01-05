import { response_200, response_400 } from '../utils/responseCodes.js';
import verifycaptcha from '../utils/recaptcha.js';
import { hash_password } from '../utils/password.js';
import Form from '../models/form.model.js';

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
