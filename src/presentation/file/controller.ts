import { Request, Response } from 'express';
import { fileTypeFromFile } from 'file-type';
import fs from 'fs/promises';
import path from 'path';
import { ConvertAudioUseCase } from '../../application/use-cases/convert-audio.use-case';
import { audioMimeTypes } from '../../domain/constants/audio-mime-types';
import { CutAudioUseCase } from '../../application/use-cases/cut-audio.use-case';
import { UploadAudioUseCase } from '../../application/use-cases/upload-audio.use-case';
import { AudioDto } from '../dtos/audio.dto';

export class FileController {
    constructor(private convertAudioUseCase: ConvertAudioUseCase, private uploadAudioUseCase: UploadAudioUseCase, private cutAudioUseCase: CutAudioUseCase) {}

    public uploadFile = async (req: Request, res: Response) => {
        if (!req.file) {
            res.status(400).json(`Audio file is required.`);
            return;
        }
        const fileType = await fileTypeFromFile(req.file.path);

        if (!fileType) {
            await this.deleteFile(req.file.path);
            res.status(400).json(`No match for file type.`);
            return;
        }

        if (!audioMimeTypes.includes(fileType.mime.split(';')[0])) {
            await this.deleteFile(req.file.path);
            res.status(400).json(`File type not supported.`);
            return;
        }

        const originalNameWithOutExt = path.basename(req.file.originalname, fileType.ext).replace(/\.$/, '');

        try {
            const newAudio = {
                id: (req.file as any).fileId as string,
                originalName: req.file.originalname,
                originalNameWithOutExt: originalNameWithOutExt,
                mimetype: fileType.mime,
                type: 'ORIGINAL',
            };

            const savedAudio = await this.uploadAudioUseCase.execute({ ...newAudio, filePath: req.file.path });

            const audio = AudioDto.fromEntity(savedAudio);

            res.status(200).json(audio);
        } catch (error) {
            console.log(error);
            this.deleteFile(req.file.path);
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

    private deleteFile = async (filePath: string): Promise<boolean> => {
        try {
            await fs.unlink(filePath);
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    };
}
