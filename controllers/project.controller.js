import Project from '../models/project.model.js';
import verifycaptcha from '../utils/recaptcha.js';
import { response_200,response_201,response_400,response_500 } from '../utils/responseCodes.js';

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

export async function projectDashboard(req,res){
    const project = await Project.findById(req.params.id)
    if(!project) return response_400(res,'No project with this id')
    let allow = project.collaborators.includes(req.user._id)
    if(!allow && project.owner!==req.user._id) return response_400(res,'You cannot access this project')
    try{
        project.is_owner = false
        if(project.owner === req.user._id) project.is_owner = true
        project.populate('owner','name email').exec((err,owner)=>{
            if(err) throw new Error()
            project.owner = owner
        })
        project.populate('collaborators','name email').exec((err,collabs)=>{
            if(err) throw new Error()
            project.collaborators = collabs
        })
        project.form_count = project.forms.length
        project = project.populate('forms','name submissions createdAt').aggregate()
        .project({
            _id: 0,
            name: 1,
            is_owner: 1,
            owner: 1,
            collaborators: 1,
            hasRecaptcha: 1,
            recaptchaKey: 1,
            recaptchaSecret: 1,
            allowedOrigins: 1,
            forms:{
                $map: {
                    input: '$forms',
                    as: 'forms',
                    in: {
                        name: '$$forms.name',
                        createdAt: '$$forms.createdAt',
                        submissions: '$$forms.submissions'
                    }
                }
            }
        })
        for(let i=0 ; i<project.forms.length ; i++){
            project.forms[i] = project.forms[i].populate({
                path: 'submissions',
                options: { sort: { createdAt: -1 } },
                select: 'createdAt',
            }).aggregate()
            .project({
                name: 1,
                createdAt: 1,
                submission_count: { $count : '$submissions'},
                submissions:{
                    $map: {
                        input: '$submissions',
                        as: 'submissions',
                        in: {
                            createdAt: '$$submissions.createdAt'
                        }
                    }
                },
                last_submission: { $arrayElemAt : [submissions , 0]}.createdAt,
                submissions: 0
            })
        }
        return response_200(res,'Project Dashboard',project)
    }
    catch(error){
        return response_500(res,'Server error',error)
    }
}