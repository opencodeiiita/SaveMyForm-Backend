import { Schema, model } from 'mongoose';

function generate(len) {
  const characters = 'abcdefghijklmnopqrstuvwxyz';
  let result = ' ';
  const charactersLength = characters.length;
  for (let i = 0; i < len; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

const formSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    formId: {
      type: String,
      required: true,
      default: generate(16),
    },
    project: {
      type: Schema.Types.ObjectId,
      ref: 'project',
      required: true,
    },
    schema: {
      type: Object,
      required: false,
    },
    hasFileField: {
      type: Boolean,
      default: false,
    },
    submissions: [
      {
        type: Schema.Types.ObjectId,
        ref: 'formSubmission',
      },
    ],
    hasRecaptchaVerification: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

const Form = model('form', formSchema);

export default Form;
