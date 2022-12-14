import { Schema, model } from 'mongoose';

const formSubmissionSchema = new Schema({}, { timestamps: true });

const FormSubmission = model('formSubmission', formSubmissionSchema);

export default FormSubmission;
