// import handler (controller) functions to route them
import { greet } from '../controllers/auth.controller.js';
import { verifySecret } from '../controllers/user.controller.js';

import { Router } from 'express';
const router = Router();

// All routes configured here
router.get('/', greet);
router.get('/verify/:secret', verifySecret);

export default router;
