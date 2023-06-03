import { model, Schema } from 'mongoose';

const invitedCollaboratorsSchema = new Schema({
    email:{
        type: String,
        required:true 
    },
    userId:{
        type: Schema.Types.ObjectId ,
        ref: 'user',
        null:true,
        default:null
    },
    projectId:{
        type: Schema.Types.ObjectId ,
        ref: 'project',
        required:true,
    },
    status:{
        type:String,
        required:true,
        enum:['Invited','Rejected','Accepted']
    }
}, { timestamps: true });

const InvitedCollaborator = model('Collaborators', invitedCollaboratorsSchema);

export default InvitedCollaborator;
