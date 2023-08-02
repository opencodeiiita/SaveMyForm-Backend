// import handler (controller) functions to route them
import { greet } from '../controllers/auth.controller.js';
import verifiedMiddleware from '../middlewares/verify.middleware.js';
import { Router } from 'express';
import {
  createForm,
  deleteForm,
  updateForm,
  getForm,
  getFormSubmissions,
  generateCSV,
  generateSubmissionLink,
} from '../controllers/form.controller.js';
const router = Router();

// All routes configured here
router.get('/', greet);
router.post('/new/:projectId', verifiedMiddleware, createForm);
router.patch('/update/:id', verifiedMiddleware, updateForm);
router.delete('/:formId', verifiedMiddleware, deleteForm);
router.get('/dashboard/:formId', verifiedMiddleware, getForm);
router.get('/submissions/:formId', verifiedMiddleware, getFormSubmissions);
router.get('/csv/:formId', verifiedMiddleware, generateCSV);
router.get('/submissionLink', verifiedMiddleware, generateSubmissionLink);
export default router;
