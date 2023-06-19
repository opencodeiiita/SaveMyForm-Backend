import { greet } from '../controllers/auth.controller.js';
import verifiedMiddleware from '../middlewares/verify.middleware.js';
import { Router } from 'express';
import { createFormSubmission } from '../controllers/formSubmission.controller.js';
const router = Router();
router.post('/submit', createFormSubmission);
export default router;
