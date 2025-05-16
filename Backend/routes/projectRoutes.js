import express from 'express';
import { 
  createProject, 
  getUserProjects, 
  getProjectById,
  updateProject,
  inviteUserToProject,
  removeUserFromProject,
  deleteProject
} from '../controllers/projectController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Debug middleware
const debugAuth = (req, res, next) => {
  console.log('Auth Debug - Headers:', req.headers);
  console.log('Auth Debug - User:', req.user);
  next();
};

// All routes need authentication
router.use(authenticateToken);
router.use(debugAuth); // Add debug middleware

// Project CRUD routes
router.post('/', createProject);
router.get('/', getUserProjects);
router.get('/:projectId', getProjectById);
router.put('/:projectId', updateProject);
router.delete('/:projectId', deleteProject);

// Project member management
router.post('/:projectId/invite', inviteUserToProject);
router.delete('/:projectId/members/:userId', removeUserFromProject);

export default router;
