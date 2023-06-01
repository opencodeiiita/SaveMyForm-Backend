import { Schema, model } from 'mongoose';


const projectSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        projectId: {
            type: String,
            required: true,
            // default: generate(16) 
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: 'user'
        },
        collaborators: {
            type: [Schema.Types.ObjectId],
            ref: 'user'
        },
        forms: {
            type: [Schema.Types.ObjectId],
            ref: 'form'
        },
        allowedOrigins: [{ type: String }],
        reCaptchaKey: String,
        reCaptchaSecret: String,
        allowRecaptcha: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    });

const Project = model('project', projectSchema);

export default Project;
