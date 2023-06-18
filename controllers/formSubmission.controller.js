import { prisma } from '../config/sql.config.js';
import { dcryptString } from '../utils/password.js';
import { validateSchema } from '../utils/ajvValidator.js';
import {
  response_200,
  response_201,
  response_400,
  response_401,
  response_500,
} from '../utils/responseCodes.js';
import Form from '../models/form.model.js';
export async function createFormSubmission(req, res) {
  try {
    const encryptedStr = req.query.formRef;
    const decryptedStr = await dcryptString(encryptedStr);
    const { formId, submisssionLinkGeneratedAt } = JSON.parse(decryptedStr);
    const form = await Form.findOne({ formId: formId });
    if (!form) return response_400(res, 'Form not found');
    if (form.submisssionLinkGeneratedAt !== submisssionLinkGeneratedAt)
      return response_400(res, 'Link expired');
    const schema = form.schema;
    const submissionData = req.body.data;
    const isValid = validateSchema(schema, submissionData);
    if (!isValid) return response_400(res, 'Invalid data');
    const submission = await prisma.formSubmission.create({
      data: {
        formId: formId,
        data: submissionData,
      },
    });
    return response_201(res, submission);
  } catch (err) {
    return response_500(res, err);
  }
}
