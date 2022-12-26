import { sendVerificationLink } from '../utils/mailer';
import { getJwt } from '../utils/password';

export async function getVerificationLink(req,res){
    const payload = {
        name : req.user.name,
        email : req.user.email,
        id : req.user._id,
        ip : req.socket.remoteAddress
    }

    const token = getJwt(payload,'300s')
    sendVerificationLink(payload.email,token,payload.ip)
}