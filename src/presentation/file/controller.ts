import { Request, Response } from 'express';
import { ConvertAudioUseCase } from '../../application/use-cases/convert-audio.use-case';
import { TrimAudioUseCase } from '../../application/use-cases/trim-audio.use-case';
import { UploadAudioUseCase } from '../../application/use-cases/upload-audio.use-case';
import { AudioDto } from '../dtos/res/audio.dto';
import { DeleteFileUseCase } from '../../application/use-cases/delete-file.use-case';
import { CustomError } from '../../domain/errors/custom-error';
import { ConvertAudioDto } from '../dtos/req/convert-audio.dto';
import { TrimAudioDto } from '../dtos/req/trim-audio.dto';

export class FileController {
    constructor(
        private convertAudioUseCase: ConvertAudioUseCase,
        private uploadAudioUseCase: UploadAudioUseCase,
        private trimAudioUseCase: TrimAudioUseCase,
        private deleteFileUseCase: DeleteFileUseCase
    ) {}

    private handleError = async (error: unknown, res: Response, filePath?: string) => {
        if (error instanceof CustomError) {
            if (error.message === 'File type not supported.') {
                await this.deleteFileUseCase.execute(filePath!);
            }
            return res.status(error.statusCode).json({
                error: error.message,
            });
        }
        return res.status(500).json({
            error: 'Something went wrong.',
        });
    };

    public uploadFile = async (req: Request, res: Response) => {
        try {
            const newAudio = {
                id: (req.file as any).fileId as string,
                originalName: req.file!.originalname,
                type: 'ORIGINAL',
            };
            const savedAudio = await this.uploadAudioUseCase.execute(
                newAudio.id,
                newAudio.originalName,
                req.file!.path,
                'ORIGINAL'
            );
            const audio = AudioDto.fromEntity(savedAudio);

            res.status(200).json(audio);
        } catch (error) {
            this.handleError(error, res, req.file!.path);
        }
    };

    public convertFileToNewFormat = async (req: Request, res: Response) => {
        const { format, id } = req.body;

        const [error, convertAudioDto] = ConvertAudioDto.create({ id, format });

        if (error) {
            res.status(400).json({ error });
            return;
        }

        try {
            const convertedAudio = await this.convertAudioUseCase.execute(convertAudioDto!.id, convertAudioDto!.format);

            const audio = AudioDto.fromEntity(convertedAudio);
            res.status(200).json({
                audio,
                message: 'File converted successfully',
            });
        } catch (error) {
            this.handleError(error, res);
        }
    };

    public trimAudio = async (req: Request, res: Response) => {
        const { startTime, duration, id } = req.body;

        const [error, trimAudioDto] = TrimAudioDto.create({ startTime, duration, id });

        if (error) {
            res.status(400).json({ error });
            return;
        }

        try {
            const trimmedAudio = await this.trimAudioUseCase.execute(
                trimAudioDto!.id,
                trimAudioDto!.startTime,
                trimAudioDto!.duration
            );
            const audio = AudioDto.fromEntity(trimmedAudio);
            res.status(200).json({
                audio,
                message: 'File trimmed successfully',
            });
        } catch (error) {
            this.handleError(error, res);
        }
    };
}
