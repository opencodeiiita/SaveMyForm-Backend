// import handler (controller) functions to route them
import { greet } from '../controllers/auth.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import verifyMiddleware from '../middlewares/verify.middleware.js';
import {
  getVerificationLink,
  updateUser,
  updatePassword,
  verifySecret,
  getUser,
  dashboard,
} from '../controllers/user.controller.js';

import { Router } from 'express';

const router = Router();

// All routes configured here
router.get('/', greet);
router.get('/raiseverification', authMiddleware, getVerificationLink);
router.get('/verify/:secret', verifySecret);
router.patch('/update', verifyMiddleware, updateUser);
router.patch('/updatepassword', authMiddleware, updatePassword);
router.get('/dashboard', verifyMiddleware, dashboard);
router.get('/self', authMiddleware, getUser);

export default router;
