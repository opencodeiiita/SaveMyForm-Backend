// import handler (controller) functions to route them
import { greet } from '../controllers/auth.controller.js';
import { createProject, deleteProject, projectDashboard, updateProject ,AddCollaborator,removeCollaborator} from '../controllers/project.controller.js';
import verifiedMiddleware from '../middlewares/verify.middleware.js';

import { Router } from 'express';
const router = Router();

// All routes configured here
router.get('/', greet);
router.post("/new", verifiedMiddleware, createProject);
router.get("/dashboard/:id", verifiedMiddleware, projectDashboard);
router.patch("/update/:projectId", verifiedMiddleware, updateProject);
router.delete("/delete/:id", verifiedMiddleware, deleteProject)
router.post("/addcollaborator", AddCollaborator)
router.post("/removecollaborator", removeCollaborator)

export default router;