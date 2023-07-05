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
import { createFile } from '../utils/fileUpload.js';
import { verifySubmissionRecaptcha } from '../utils/recaptcha.js';

export async function createFormSubmission(req, res) {
  try {
    
    const grcToken = req.body['grc-token'];
    const encryptedStr = req.query.formRef;
    const decryptedStr = dcryptString(encryptedStr);
    const { formId, submisssionLinkGeneratedAt } = JSON.parse(decryptedStr);

    const form = await Form.findOne({ formId: formId }).populate('project');
    if (!form) return response_400(res, 'Form not found');

    
    let incomingTime = new Date(form.submisssionLinkGeneratedAt).getTime();
    if (incomingTime !== submisssionLinkGeneratedAt)
      return response_400(res, 'Link expired');

  
    if (form.project.allowRecaptcha) {
      if (!grcToken) return response_401(res, 'Recaptcha token not found');
      const recaptcha = await verifySubmissionRecaptcha(
        grcToken,
        form.project.recaptchaSecretKey,
      );
      if (!recaptcha) return response_401(res, 'Recaptcha verification failed');
    }


    const allowedOrigins = form.project.allowedOrigins;
    if (allowedOrigins.length > 0) {
      const origin = req.headers.origin;
      if (!allowedOrigins.includes(origin))
        return response_401(res, 'Origin not allowed');
    }

    const schema = form.schema;
    const submissionData = req.body;

    if (form.hasFileField) {
      if (req.files.length > 1) {
        return response_400(res, 'Too many files');
      }

      if (req.files.length === 1) {
        let fieldName = req.files[0].fieldname;
        submissionData[fieldName] = fieldName;
      }
    }

    const isValid = validateSchema(schema, submissionData);
    if (!isValid) return response_400(res, 'Invalid data');

    if (form.hasFileField) {
      const fileUrl = (await createFile(req.files[0])).url;
      if (!fileUrl) return response_500(res, 'File upload failed');
      submissionData[req.files[0].fieldname] = fileUrl;
    }

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
