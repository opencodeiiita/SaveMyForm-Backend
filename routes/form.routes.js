// import handler (controller) functions to route them
import { greet } from '../controllers/auth.controller.js';
import verifiedMiddleware from '../middlewares/verify.middleware.js';
import { Router } from 'express';
import { createForm,deleteForm } from '../controllers/form.controller.js';
const router = Router();

// All routes configured here
router.get('/', greet);
router.post('/new/:projectId', verifiedMiddleware, createForm);
router.delete('/', verifiedMiddleware, deleteForm)
export default router;
