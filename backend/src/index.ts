// el orquestador de rutas
import { Router } from 'express';
import taskRoutes from './routes/taskRoutes.js';
import authRoutes from './routes/authRoutes.js';
import refreshRoutes from './routes/refreshRoutes.js';
import logoutRoutes from './routes/logoutRoutes.js'
import sessionRoutes from './routes/sessionRoutes.js';
import googleAuthRoutes from './routes/googleAuthRoutes.js';
import fileRoutes from './routes/fileRoutes.js';

const router = Router();

router.use("/auth", authRoutes);
router.use('/auth/refresh', refreshRoutes);
router.use('/auth/logout', logoutRoutes);
router.use('/auth', googleAuthRoutes);
router.use('/auth', sessionRoutes);
router.use('/tasks', taskRoutes);
router.use('/', fileRoutes);

export default router;