import { sendVerificationLink } from '../utils/mailer.js';
import { getJwt, hash_password } from '../utils/password.js';
import { response_200,response_400 } from '../utils/responseCodes.js';
import verifycaptcha from '../utils/recaptcha.js';
import validator from 'validator';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

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
    if(!(req.body.name && req.body.email && req.body.password)) return response_400(res,'All required fields not present')
    if(req.user.passwordHash!==''){
        if(!verifycaptcha(req.body.recaptcha_token)) return response_400(res,'Captcha not verified')
        const password = await hash_password(req.body.password)
        if(password!==req.user.passwordHash) return response_400(res,'Wrong Password')
        if(req.body.email!==req.user.email){
            if(!validator.isEmail(req.body.email)) return response_400(res,'Invalid email id')
            req.user.email = req.body.email
            req.user.verified = false
        }
        if(req.body.name!==req.user.name) req.user.name = req.body.name
        const updatedUser = await req.user.save()
        return response_200(res,'User info updated',{
            name:updatedUser.name,
            email:updatedUser.email
        })
    }
    else{
        return response_400(res,'You will need to create a password before changing these settings')
    }
}

export async function updatePassword(req,res){
    if(!(req.body.oldPassword && req.body.newPassword)) return response_400(res,'All request parameters not provided')
    if(!verifycaptcha(req.body.recaptcha_token)) return response_400(res,'Captcha not verified')
    if(req.user.passwordHash!==''){
        const password = await hash_password(req.body.oldPassword)
        if(password!==req.user.passwordHash) return response_400(res,'Wrong Password')
        if(req.body.newPassword.length<6) return response_400(res,'New password length too short')
        req.user.passwordHash = await hash_password(req.body.newPassword)
        await req.user.save();
        return response_200(res,'Password updated')
    }
    else{
        return response_400(res,'You will need to create a password before changing these settings')
    }
}

export async function verifySecret(req, res) {
    try {
        // extract JWT secret from params
        const secret = req.params.secret;

        // verify the secret
        const { payload } = jwt.verify(secret, process.env.SECRET); // will throw err is token is invalid or expired

        const userMongoId = payload.id;

        // extract user info from DB
        const user = await User.findById(userMongoId);

        if (!user) {
            // user is not present in DB
            throw new Error();
        }

        // marking the user as verified
        user.verified = true;
        await user.save();

        response_200(res, "User verified");
    }
    catch (err) {
        console.log(err);
        response_400(res, "Request is invalid")
    }
}

export async function getUser(req,res){
    return response_200(res,'User data',{
        name: req.user.name,
        email: req.user.email,
        verified: req.user.verified
    })
}

export async function dashboard(req, res) {
    try {
      const user = req.user;
      user = user
        .populate({
          path: 'projects',
          options: { sort: { createdAt: -1 } },
          select: 'id name forms allowed_origins createdAt',
        })
        .aggregate([
          { $addFields: { project_count: { $count: '$projects' } } },
          { $addFields: { form_count: { $count: '$forms' } } },
        ])
        .select('name email verified project_count projects');
  
      return response_200(
        res,
        'Sent required user data to dashboard',
        user.select('name email verified project_count projects'),
      );
    } catch (err) {
      console.log(err);
    }
}