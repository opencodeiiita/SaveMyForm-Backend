import { Schema, model } from 'mongoose';

const formSubmissionSchema = new Schema({

    id : String,
    form : Form,
    data : Object,
    file : File,
    
}, { timestamps: true });

const FormSubmission = model('formSubmission',formSubmissionSchema);

export default FormSubmission;

