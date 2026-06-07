import {Router} from 'express'
import { requireAuth } from '../middlewares/requireAuth.js'
import { upload } from '../middlewares/upload.js'
import { uploadFile, downloadFile, deleteFile } from '../controllers/fileController.js'

const router = Router();
router.use(requireAuth);

router.post('/tasks/:taskId/files', upload.single('file'), uploadFile);
router.get('/files/:fileId', downloadFile);
router.delete('/files/:fileId', deleteFile);

export default router;