import { Schema, model } from 'mongoose';

function generate(length){
    const characters = "qwertyuiopasdfghjklzxcvbnm1234567890";
    let result = '';
    const reqlength = characters.length;
    for(let i=0;i<length;i++){
        result += characters.charAt(Math.floor(Math.random() * reqlength));
    }

    return result;
}

const formSubmissionSchema = new Schema({

    formSubmissionId : {
        type : String,
        require : true,
        default : generate(16)
    },
    form : {
        type : Schema.Types.ObjectId,
        ref : 'form'
    },
    data : Object,
    file : {
        type : Schema.Types.ObjectId,
    },
    
}, { timestamps: true });

const FormSubmission = model('formSubmission',formSubmissionSchema);

export default FormSubmission;

