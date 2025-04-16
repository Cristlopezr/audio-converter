import { Router } from 'express';
import { FileController } from './controller';
import { handleMiddlewareError } from '../../infrastructure/middlewares/handle-error.middleware';
import { FfmpegAdapter } from '../../infrastructure/adapters/ffmpeg.adapter';
import { ConvertAudioUseCase } from '../../application/use-cases/convert-audio.use-case';
import { CutAudioUseCase } from '../../application/use-cases/cut-audio.use-case';
import { AudioRepositoryImpl } from '../../infrastructure/repositories/audio.repository.impl';
import { AudioDatasourceImpl } from '../../infrastructure/datasources/audio.datasource.impl';
import { upload } from '../../config/multer';
import { UploadAudioUseCase } from '../../application/use-cases/upload-audio.use-case';
import { FileSystemService } from '../../infrastructure/services/file-system.service.impl';

const audioProcessor = new FfmpegAdapter();
const audioDatasource = new AudioDatasourceImpl();
const fileSystemService = new FileSystemService();
const audioRepository = new AudioRepositoryImpl(audioDatasource);
const convertAudioUseCase = new ConvertAudioUseCase(audioProcessor, fileSystemService, audioRepository);
const cutAudioUseCase = new CutAudioUseCase(audioProcessor, fileSystemService, audioRepository);
const uploadAudioUseCase = new UploadAudioUseCase(audioProcessor, audioRepository);

export class FileRoutes {
    static get routes(): Router {
        const router = Router();

        const fileController = new FileController(convertAudioUseCase, uploadAudioUseCase, cutAudioUseCase);

        router.post('/upload', upload.single('file'), handleMiddlewareError, fileController.uploadFile);
        router.post('/convert', fileController.convertFileToNewFormat);
        router.post('/cutAudio', fileController.cutAudio);

        return router;
    }
}
