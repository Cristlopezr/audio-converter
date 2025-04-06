import { Router } from 'express';
import { handleMulterMiddlewareError, upload } from '../../config/multer';
import { FileController } from './controller';

export class FileRoutes {
    static get routes(): Router {
        const router = Router();

        const fileController = new FileController();

        router.post('/upload', upload.single('file'), handleMulterMiddlewareError, fileController.uploadFile);
        router.post('/convert', fileController.convertFileToNewFormat);

        return router;
    }
}
