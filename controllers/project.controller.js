import Project from '../models/project.model.js';
import User from "../models/user.model";
import verifycaptcha from '../utils/recaptcha.js';
import {
  response_200,
  response_201,
  response_400,
  response_401,
  response_500,
} from '../utils/responseCodes.js';

export async function createProject(req, res) {
  if (!verifycaptcha(req.body.recaptcha_token))
    return response_400(res, 'Captcha not verified');
  if (!req.body.name) return response_400(res, 'Project name is required');
  const newProject = Project({
    name: req.body.name,
    owner: req.user._id,
  });
  if (req.body.collaborators) newProject.collaborators = req.body.collaborators;
  if (req.body.allowedOrigins)
    newProject.allowedOrigins = req.body.allowedOrigins;
  if (req.body.reCaptchaKey) newProject.reCaptchaKey = req.body.reCaptchaKey;
  if (req.body.reCaptchaSecret)
    newProject.reCaptchaSecret = req.body.reCaptchaSecret;
  if (req.body.hasRecaptcha) newProject.allowRecaptcha = req.body.hasRecaptcha;
  try {
    await newProject.save();
    return response_201(res, 'Project created', {
      name: newProject.name,
      id: newProject.id,
    });
  } catch (error) {
    return response_500(res, 'Server error', error);
  }
}

export async function deleteProject(req, res) {
  if (!verifycaptcha(req.body.recaptcha_token))
    return response_400(res, 'Captcha not verified');
  const id = req.params.id;
  const password = await hash_password(req.body.password);
  const project = await Project.findById(id);
  if (project.owner !== req.user.id)
    return response_400(res, 'The user is not the owner of project.');
  if (password !== req.user.passwordHash)
    return response_400(res, 'Wrong Password');
  Project.deleteOne({ id: project.id });
  response_200(res, 'The project has been succesfully deleted.');
}

export async function updateProject(req, res) {
  try {
    if (!verifycaptcha(req.body.recaptcha_token)) {
      return response_400(res, 'Captcha not verified');
    }

    const projectId = req.params.projectId;
    const initialProject = await Project.findById(projectId);

    if (req.user.id !== initialProject.owner) {
      // current user is not the owner of the project
      response_401('The user is not the owner of project.')
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
      updatedProject.allowedOrigins = req.body.allowedOrigins;
    }
    if (req.body.collaborators) {
      updatedProject.collaborators = collaboratorsDetail;
    }

    // updating the project details in DB
    const finalProject = await Project.findByIdAndUpdate(projectId, updatedProject, { returnDocument: "after" });

    // sending back the updated project details
    const ownerDetails = await User.findById(finalProject.owner, "name email");
    const collaboratorsDetail = await Promise.all(finalProject.collaborators.map(async collaboratorId => {
      const collaboratorDetail = await User.findById(collaboratorId, "name email");
      return {
        name: collaboratorDetail.name,
        email: collaboratorDetail.email
      }
    }))
    response_200(res, "Project upodated", {
      name: finalProject.name,
      is_owner: req.user.id === finalProject.owner,
      owner: { name: ownerDetails.name, email: ownerDetails.email },
      collaborators: collaboratorsDetail,
      hasRecaptcha: finalProject.allowRecaptcha,
      recaptchaKey: finalProject.reCaptchaKey,
      recaptchaSecret: finalProject.reCaptchaSecret,
      allowedOrigins: finalProject.allowedOrigins
    });
  }
  catch (err) {
    response_500("Something went wrong, please try again.");
  }
}