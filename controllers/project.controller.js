import Project from '../models/project.model.js';
import verifycaptcha from '../utils/recaptcha.js';
import { response_201,response_400,response_500 } from '../utils/responseCodes.js';

export async function createProject(req,res){
    if(!verifycaptcha(req.body.recaptcha_token)) return response_400(res,'Captcha not verified')
    if(!req.body.name) return response_400(res,'Project name is required')
    const newProject = Project({
        name: req.body.name,
        owner: req.user._id,
    })
    if(req.body.collaborators) newProject.collaborators = req.body.collaborators
    if(req.body.allowedOrigins) newProject.allowedOrigins = req.body.allowedOrigins
    if(req.body.reCaptchaKey) newProject.reCaptchaKey = req.body.reCaptchaKey
    if(req.body.reCaptchaSecret) newProject.reCaptchaSecret = req.body.reCaptchaSecret
    if(req.body.hasRecaptcha) newProject.allowRecaptcha = req.body.hasRecaptcha
    try{
        await newProject.save()
        return response_201(res,'Project created',{
            name: newProject.name,
            id: newProject.id
        })
    }
    catch(error){
        return response_500(res,'Server error',error)
    }
} 