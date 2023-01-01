// import handler (controller) functions to route them
import {
  logIn,
  greet,
  signUp,
  authGoogle,
  getGoogleAuthUrl,
} from '../controllers/auth.controller.js';

import { Router } from 'express';
const router = Router();

// All routes configured here
router.get('/', greet);
router.post('/login', logIn);
router.post('/signup', signUp);
router.post('/auth/google', authGoogle);
router.get('/auth/google', getGoogleAuthUrl);

export default router;
