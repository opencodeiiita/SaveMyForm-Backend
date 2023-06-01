import { model, Schema } from 'mongoose';

const invitedCollaboratorsSchema = new Schema({
    invitedCollaborator:{
        type: Schema.Types.ObjectId,
        ref: 'user' 
    },
    status:{
        type:String,
        default:"invited"
    }
}, { timestamps: true });

const InvitedCollaborator = model('invitedCollaborator', invitedCollaboratorsSchema);

export default InvitedCollaborator;
