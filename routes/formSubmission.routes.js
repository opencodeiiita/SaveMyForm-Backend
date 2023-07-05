import { greet } from '../controllers/auth.controller.js';
import verifiedMiddleware from '../middlewares/verify.middleware.js';
import { Router } from 'express';
import { createFormSubmission } from '../controllers/formSubmission.controller.js';
import upload from '../config/multer.config.js';

const router = Router();
router.post('/submit', upload.any(), createFormSubmission);
export default router;
