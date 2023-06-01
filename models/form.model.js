import { Schema, model } from 'mongoose';

const formSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    formId: {
      type: String,
      required: true,
      // default: generate(16),
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
    // submissions: [
    //   {
    //     type: Schema.Types.ObjectId,
    //     ref: 'formSubmission',
    //   },
    // ],
    submission : [
      {
        type : String,
      }
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
