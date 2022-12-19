import { Schema, model } from 'mongoose';

const formSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    id: {
        type: String,
        required: true
    },
    project: {
        type: Schema.Types.ObjectId,
        ref: 'project',
        required: true
    },
    schema: {
        type: Schema.Types.Mixed,
        required: true
    },
    hasFileField: {
        type: Boolean,
        default: false
    },
    submissions: [{
        type: Schema.Types.ObjectId,
        ref:'formSubmission'
    }],
    hasRecaptchaVerification: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const Form = model('form', formSchema);

export default Form;
