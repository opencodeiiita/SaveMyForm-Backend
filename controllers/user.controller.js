import { sendVerificationLink } from '../utils/mailer.js';
import { getJwt, hash_password } from '../utils/password.js';
import { response_200,response_400 } from '../utils/responseCodes.js';

export function getVerificationLink(req,res){
    if(req.user.verified) return response_400(res,'The user is already verified')
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

export async function updateUser(req,res){
    if(!(req.body.name && req.body.email && req.body.oldPassword)) return response_400(res,'All required fields not present')
    if(req.user.passwordHash!==''){
        const password = await hash_password(req.body.oldPassword)
        if(password!=req.user.passwordHash) return response_400(res,'Wrong Password')
    }
    if(req.body.newPassword && req.body.newPassword!==''){
        if(req.body.newPassword.length<6)
            return response_400(res,'Password length too short')
        const password = await hash_password(req.body.newPassword)   
        req.user.passwordHash = password
    }
    if(req.body.name!==req.user.name) req.user.name = req.body.name
    if(req.body.email!==req.user.email){
        req.user.email = req.body.email
        req.user.verified = false
    }
    const updatedUser = await req.user.save()
    return response_200(res,'User info updated',{
        name:updatedUser.name,
        email:updatedUser.email
    })
}