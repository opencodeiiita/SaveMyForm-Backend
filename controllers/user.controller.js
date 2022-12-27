import { sendVerificationLink } from '../utils/mailer.js';
import { getJwt } from '../utils/password.js';
import { response_200 } from '../utils/responseCodes.js';

export function getVerificationLink(req,res){
    if(req.user.verified) return;
    const payload = {
        name : req.user.name,
        email : req.user.email,
        id : req.user._id,
        ip : req.ip
    }

    const token = getJwt(payload,'300s')
    sendVerificationLink(payload.email,token,payload.ip)
    return response_200(res,'Verification mail sent')
}