import { Router } from 'express';
import { FileController } from './controller';
import { handleMiddlewareError } from '../../infrastructure/middlewares/handle-error.middleware';
import { FfmpegAdapter } from '../../infrastructure/adapters/ffmpeg.adapter';
import { ConvertAudio } from '../../application/use-cases/convert-audio.use-case';
import { TrimAudio } from '../../application/use-cases/trim-audio.use-case';
import { AudioRepositoryImpl } from '../../infrastructure/repositories/audio.repository.impl';
import { AudioDatasourceImpl } from '../../infrastructure/datasources/audio.datasource.impl';
import { upload } from '../../config/multer';
import { UploadAudio } from '../../application/use-cases/upload-audio.use-case';
import { FileSystemServiceImpl } from '../../infrastructure/services/file-system.service.impl';
import { FileCheckerServiceImpl } from '../../infrastructure/adapters/file-checker.adapter';
import { validateFile } from '../../infrastructure/middlewares/validate-file.middleware';
import { DeleteFile } from '../../application/use-cases/delete-file.use-case';

const audioProcessor = new FfmpegAdapter();
const audioDatasource = new AudioDatasourceImpl();
const fileSystemService = new FileSystemServiceImpl();
const fileCheckerService = new FileCheckerServiceImpl();
const audioRepository = new AudioRepositoryImpl(audioDatasource);
const deleteFileUseCase = new DeleteFile(fileSystemService);
const convertAudioUseCase = new ConvertAudio(audioProcessor, fileSystemService, audioRepository);
const trimAudioUseCase = new TrimAudio(audioProcessor, fileSystemService, audioRepository);
const uploadAudioUseCase = new UploadAudio(audioProcessor, fileSystemService, fileCheckerService, audioRepository);

export class FileRoutes {
    static get routes(): Router {
        const router = Router();

        const fileController = new FileController(
            convertAudioUseCase,
            uploadAudioUseCase,
            trimAudioUseCase,
            deleteFileUseCase
        );

        router.post('/upload', upload.single('file'), handleMiddlewareError, validateFile, fileController.uploadFile);
        router.post('/convert', fileController.convertFileToNewFormat);
        router.post('/trim', fileController.trimAudio);

        return router;
    }
}
