// el orquestador de rutas
import { Router } from 'express';
import taskRoutes from './routes/taskRoutes.js';
import authRoutes from './routes/authRoutes.js';
//import fileRoutes from './routes/fileRoutes.js';

const router = Router();

router.use("/auth", authRoutes);
router.use('/tasks', taskRoutes);
//router.use('/files', fileRoutes);

export default router;