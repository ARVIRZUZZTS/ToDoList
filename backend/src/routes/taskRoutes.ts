// enrutador de las tasks
import { Router } from 'express';
import { requireAuth } from '../middlewares/requireAuth.js';
import { getTasks, createTask, updateTaskStatus, deleteTask } from '../controllers/taskController.js';

const router = Router();

router.use(requireAuth);

router.get('/', getTasks);
router.post('/', createTask);
router.patch('/:id/status', updateTaskStatus);
router.delete('/:id', deleteTask);

export default router;