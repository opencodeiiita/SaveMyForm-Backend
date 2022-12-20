// import handler (controller) functions to route them
import { logIn, greet } from '../controllers/auth.controller.js';

import { Router } from 'express';
const router = Router();

// All routes configured here
router.get('/', greet);
router.post('/login', logIn)

export default router;
