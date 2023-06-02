import { model, Schema } from 'mongoose';

const invitedCollaboratorsSchema = new Schema({
    email:{
        type: String,
        required:true 
    },
    username:{
        type:String
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

const InvitedCollaborator = model('invitedCollaborator', invitedCollaboratorsSchema);

export default InvitedCollaborator;
