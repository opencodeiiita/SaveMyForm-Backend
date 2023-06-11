import Project from '../models/project.model.js';
import User from '../models/user.model.js';
import Form from '../models/form.model.js';
import Collaborators from '../models/invitedCollaborators.model.js';
import verifycaptcha from '../utils/recaptcha.js';
import { sendCollabInvitationLink } from '../utils/mailer.js';
import { getJwt, hash_password } from '../utils/password.js';
import {
  response_200,
  response_201,
  response_400,
  response_401,
  response_500,
} from '../utils/responseCodes.js';
import { generateRandomString } from '../utils/generateRandomString.js';

export async function createProject(req, res) {
  if (!verifycaptcha(req.body.recaptcha_token))
    return response_400(res, 'Captcha not verified');
  if (!req.body.name) return response_400(res, 'Project name is required');
  const user = await User.findById(req.user._id);
  if (user.projects.length >= 5) {
    return response_400(res, 'Maximum number of 5 projects reached for this user.');
  }
  const newProject = Project({
    name: req.body.name,
    owner: req.user._id,
    projectId: generateRandomString(16),
  });
  // if (req.body.allowedOrigins)
  newProject.allowedOrigins = req.body?.allowedOrigins;
  // if (req.body.reCaptchaKey)
  newProject.reCaptchaKey = req.body?.reCaptchaKey;
  // if (req.body.reCaptchaSecret)
  newProject.reCaptchaSecret = req.body?.reCaptchaSecret;
  // if (req.body.hasRecaptcha)
  newProject.allowRecaptcha = req.body?.hasRecaptcha;

  console.log(newProject);
  //number of origins of project greater than 3 not allowed
  if (newProject.allowedOrigins.length > 3) {
    return response_400(res, 'Number of allowed origins cannot be greater than 3');
  }
  //number of collaborators of the project greater than 5 not allowed
  if (req.body.collaborators.length > 5) {
    return response_400(res, 'Number of collaborators cannot be greater than 5');
  }

  try {
    await newProject.save();
    req.user.projects.push(newProject._id);
    await req.user.save();

    return response_201(res, 'Project created', {
      name: newProject.name,
      id: newProject.projectId,
    });
  } catch (error) {
    return response_500(res, 'Server error', error);
  }
}

export async function deleteProject(req, res) {
  if (!verifycaptcha(req.body.recaptcha_token))
    return response_400(res, 'Captcha not verified');
  const id = req.params.id;
  console.log(req.body);
  const password = await hash_password(req.body.password);
  const project = await Project.findOne({ projectId: id });
  if (String(project.owner) !== String(req.user.id))
    return response_400(res, 'The user is not the owner of project.');
  if (password !== req.user.passwordHash)
    return response_400(res, 'Wrong Password');
  req.user.projects = req.user.projects.filter((p) => p !== project._id);
  await req.user.save();
  await Project.deleteOne({ projectId: project.projectId });
  response_200(res, 'The project has been succesfully deleted.');
}

export async function updateProject(req, res) {
  try {
    if (!verifycaptcha(req.body.recaptcha_token)) {
      return response_400(res, 'Captcha not verified');
    }

    const projectId = req.params.projectId;
    const { ownerId } = await Project.findOne(
      { projectId: projectId },
      '-_id owner',
    );

    if (req.user.id !== ownerId) {
      // current user is not the owner of the project
      response_401('The user is not the owner of project.');
    }

    const password = await hash_password(req.body.password);
    if (password !== req.user.passwordHash) {
      return response_400(res, 'Wrong Password');
    }

    // creating the updatedProject object
    const updatedProject = {};
    if (req.body.name) {
      updatedProject.name = req.body.name;
    }
    if (req.body.hasRecaptcha) {
      updatedProject.allowRecaptcha = req.body.hasRecaptcha;
    }
    if (req.body.reCaptchaKey) {
      updatedProject.reCaptchaKey = req.body.reCaptchaKey;
    }
    if (req.body.reCaptchaSecret) {
      updatedProject.reCaptchaSecret = req.body.reCaptchaSecret;
    }
    if (req.body.allowedOrigins) {
      if (req.body.allowedOrigins.length > 3) {
        return response_400(res, 'Number of allowed origins cannot be greater than 3');
      }
      updatedProject.allowedOrigins = req.body.allowedOrigins;
    }
  
    if (req.body.collaborators) {
      if (req.body.collaborators.length > 5) {
        return response_400(res, 'Number of collaborators cannot be greater than 5');
      }
      inviteCollaborators(
        req.body.collaborators,
        projectId,
        req.body.name,
        req.user.name,
        req.user.email,
      );
    }


    // updating the project details in DB
    const finalProject = await Project.findOneAndUpdate(
      { projectId: projectId },
      updatedProject,
      { returnDocument: 'after', select: '-_id -forms' },
    )
      .populate({ path: 'owner', select: '-_id name email' })
      .populate({ path: 'collaborators', select: '-_id name email' });

    finalProject.is_owner = req.user.id === finalProject.owner;

    response_200(res, 'Project updated', finalProject);
  } catch (err) {
    response_500('Something went wrong, please try again.');
  }
}

export async function projectDashboard(req, res) {
  let project = await Project.findOne({ projectId: req.params.id });
  if (!project) return response_400(res, 'No project with this id');
  let allow = project.collaborators.includes(req.user._id);
  if (!allow && String(project.owner) !== String(req.user._id))
    return response_400(res, 'You cannot access this project');

  try {
    project = await Project.findOne({ projectId: req.params.id })
      .populate('forms', 'formId name submissions createdAt updatedAt -_id')
      .populate('owner', 'name email')
      .populate('collaborators', 'name email -_id')
      .select('-_id -createdAt -updatedAt -__v');
    project = project.toJSON();
    project.is_owner = String(project.owner._id) === String(req.user._id);
    delete project.owner._id;
    project.allowRecaptcha = project.hasRecaptcha;
    project.id = project.projectId;
    delete project.projectId;
    delete project.hasRecaptcha;
    project.form_count = project?.forms?.length;
    project.forms.forEach((form) => {
      form.submission_count = form?.submissions?.length;
      form.last_updated = form.updatedAt;
      form.date_created = form.createdAt;
      form.id = form.formId;
      delete form.formId;
      delete form.updatedAt;
      delete form.createdAt;
    });
    return response_200(res, 'Project Dashboard', project);
  } catch (error) {
    console.log(error);
    return response_500(res, 'Server error', error);
  }
}

export async function updateCollaborator(req, res) {
     try {
      let project=await Project.findById(req.params.projectId).populate('owner', 'name email')
      let is_owner = String(project.owner._id) === String(req.user._id);
      if(!is_owner){
        response_401('The user is not the owner of project.');
      }else{
        //storing emails we got in an array
        const emails=req.body.collaborators;

        // finding all collaborators with projectId
        const projectCollaborators=await Collaborators.find({projectId:req.params.projectId});

        //store emails of every collaborator in an array
        const collaboratorsEmails=await projectCollaborators.map((projectCollaborator)=>(projectCollaborator.email))

        //iterating on every email we got
        emails.forEach(async (email)=>{
          //check this email is present in array of collaborators list of this project
          const isPresent= collaboratorsEmails.includes(email);
          if(!isPresent){

            //Invite new Collaborator with this email

            // creating collaborator in db
            await Collaborators.create({
              email:email,
              projectId:req.params.projectId,
              status:'Invited'
            });
          }
        })

        //checking if any removed collaborators and deleting
        collaboratorsEmails.forEach(async (collaboratorEmail)=>{
          const isPresent= emails.includes(collaboratorEmail);
          if(!isPresent){
            await Collaborators.findOneAndDelete({
              email:collaboratorEmail,
              projectId:req.params.projectId
            })
          }
        })

      }
     } catch (error) {
      console.log(error);
      return response_500(res, 'Server error', error);
     }
}

function inviteCollaborators(
  email,
  projectId,
  projectName,
  userName,
  userEmail,
) {
  const obj = {
    projectId,
    collaborators: email.join(';'),
  };
  const secret = getJwt(obj);
  sendCollabInvitationLink(email, secret, projectName, userName, userEmail);
}
