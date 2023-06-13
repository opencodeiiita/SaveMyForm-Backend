// import handler (controller) functions to route them
import { greet } from '../controllers/auth.controller.js';
import verifiedMiddleware from '../middlewares/verify.middleware.js';
import { Router } from 'express';
import {
  createForm,
  deleteForm,
  updateForm,
  getForm,
} from '../controllers/form.controller.js';
import { createFormSubmission } from '../controllers/formSubmission.controller.js';
const router = Router();

// All routes configured here
router.get('/', greet);
router.post('/new/:projectId', verifiedMiddleware, createForm);
router.patch('/update/:id', verifiedMiddleware, updateForm);
router.delete('/', verifiedMiddleware, deleteForm);
router.get('/:formId', getForm);
router.post('/main/submit/:encryptedStr', createFormSubmission);
export default router;
