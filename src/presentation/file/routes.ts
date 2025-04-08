import { Router } from 'express';
import { FileController } from './controller';
import { UploadAudioUseCase } from '../../domain/use-cases/upload-audio.use-case';
import { handleMiddlewareError } from '../../infrastructure/middlewares/handle-error.middleware';
import { MulterAdapter } from '../../infrastructure/adapters/multer.adapter';

const fileUpload = new MulterAdapter();
const uploadAudioUseCase = new UploadAudioUseCase(fileUpload);

export class FileRoutes {
    static get routes(): Router {
        const router = Router();

        const fileController = new FileController();

        router.post('/upload', uploadAudioUseCase.execute('file'), handleMiddlewareError, fileController.uploadFile);
        router.post('/convert', fileController.convertFileToNewFormat);
        router.post('/cutAudio', fileController.cutAudio);

        return router;
    }
}
