import Project from '../models/project.model.js';
// import User from "../models/user.model.js";
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
  const password = await hash_password(req.body.password);
  const project = await Project.findById(id);
  if (project.owner !== req.user.id)
    return response_400(res, 'The user is not the owner of project.');
  if (password !== req.user.passwordHash)
    return response_400(res, 'Wrong Password');
  Project.deleteOne({ projectId: project.projectId });
  response_200(res, 'The project has been succesfully deleted.');
}

export async function updateProject(req, res) {
  try {
    if (!verifycaptcha(req.body.recaptcha_token)) {
      return response_400(res, 'Captcha not verified');
    }

    const projectId = req.params.projectId;
    const { ownerId } = await Project.findById(projectId, '-_id owner');

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
      updatedProject.allowedOrigins = req.body.allowedOrigins;
    }
    if (req.body.collaborators) {
      updatedProject.collaborators = req.body.collaborators;
    }

    // updating the project details in DB
    const finalProject = await Project.findByIdAndUpdate(
      projectId,
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
  const project = await Project.findById(req.params.id);
  if (!project) return response_400(res, 'No project with this id');
  let allow = project.collaborators.includes(req.user._id);
  if (!allow && project.owner !== req.user._id)
    return response_400(res, 'You cannot access this project');
  try {
    project = project
      .populate('forms', 'name submissions createdAt updatedAt')
      .populate('owner', 'name email')
      .populate('collaborators', 'name email')
      .aggregate()
      .project({
        _id: 0,
        name: 1,
        owner: 1,
        collaborators: 1,
        hasRecaptcha: 1,
        recaptchaKey: 1,
        recaptchaSecret: 1,
        allowedOrigins: 1,
        is_owner: { $eq: ['$$owner._id', req.user._id] },
        form_count: { $count: '$forms' },
        forms: {
          $map: {
            input: '$forms',
            as: 'forms',
            in: {
              name: '$$forms.name',
              createdAt: '$$forms.createdAt',
              submission_count: { $count: '$$forms.submissions' },
              last_updated: '$$forms.updatedAt',
              submissions: 0,
            },
          },
        },
      });
    return response_200(res, 'Project Dashboard', project);
  } catch (error) {
    return response_500(res, 'Server error', error);
  }
}
