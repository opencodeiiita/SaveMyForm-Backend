// import handler (controller) functions to route them
import { greet } from '../controllers/auth.controller.js';

import { Router } from 'express';
import authMiddleware from '../middlewares/auth.middleware.js';
import { dashboard } from '../controllers/user.controller.js';
const router = Router();

// All routes configured here
router.get('/', greet);
router.get('/dashboard', authMiddleware , dashboard);

export default router;
