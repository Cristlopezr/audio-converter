import { Request, Response } from 'express';
import { ConvertAudioUseCase } from '../../application/use-cases/convert-audio.use-case';
import { CutAudioUseCase } from '../../application/use-cases/cut-audio.use-case';
import { UploadAudioUseCase } from '../../application/use-cases/upload-audio.use-case';
import { AudioDto } from '../dtos/audio.dto';

export class FileController {
    constructor(private convertAudioUseCase: ConvertAudioUseCase, private uploadAudioUseCase: UploadAudioUseCase, private cutAudioUseCase: CutAudioUseCase) {}

    public uploadFile = async (req: Request, res: Response) => {
        try {
            const newAudio = {
                id: (req.file as any).fileId as string,
                originalName: req.file!.originalname,
                type: 'ORIGINAL',
            };

            const savedAudio = await this.uploadAudioUseCase.execute({ ...newAudio, filePath: req.file!.path });

            const audio = AudioDto.fromEntity(savedAudio);

            res.status(200).json(audio);
        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: 'Something went wrong.',
            });
        }
    };

    public convertFileToNewFormat = async (req: Request, res: Response) => {
        const { format, id } = req.body;

        try {
            const convertedAudio = await this.convertAudioUseCase.execute(id, format);

            const audio = AudioDto.fromEntity(convertedAudio);
            res.status(200).json({
                audio,
                message: 'File converted successfully',
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: 'Something went wrong',
            });
        }
    };

    public cutAudio = async (req: Request, res: Response) => {
        const { startTime, duration, id } = req.body;

        try {
            const trimmedAudio = await this.cutAudioUseCase.execute(id, startTime, duration);
            const audio = AudioDto.fromEntity(trimmedAudio);
            res.status(200).json({
                audio,
                message: 'File trimmed successfully',
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: 'Something went wrong',
            });
        }
    };
}
