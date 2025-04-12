import { Request, Response } from 'express';
import { fileTypeFromFile } from 'file-type';
import fs from 'fs/promises';
import path from 'path';
import { ConvertAudioUseCase } from '../../domain/use-cases/convert-audio.use-case';
import { audioMimeTypes } from '../../domain/constants/audio-mime-types';
import { FfmpegAdapter } from '../../infrastructure/adapters/ffmpeg.adapter';
import { CutAudioUseCase } from '../../domain/use-cases/cut-audio.use-case';

const audioProcessor = new FfmpegAdapter();
const convertAudioUseCase = new ConvertAudioUseCase(audioProcessor);
const cutAudioUseCase = new CutAudioUseCase(audioProcessor);

export class FileController {
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

        res.status(200).json({
            originalName: req.file.originalname,
            id: req.file.filename.split('-')[0],
            size: req.file.size,
            ext: fileType.ext,
            mime: fileType.mime,
        });
    };

    public convertFileToNewFormat = async (req: Request, res: Response) => {
        const { newFormat, originalName, id, size, ext, mime } = req.body;
        
        const filePath = path.join(__dirname, '..', '..', '..', 'uploads', `${id}-${originalName}`);

        const fileExists = await this.checkIfFileExists(filePath);

        if (!fileExists) {
            res.status(400).json({
                error: `File doesn't exists`,
            });
        }

        if (!newFormat) {
            await this.deleteFile(filePath);
            res.status(400).json({
                error: 'Format to convert is required',
            });
            return;
        }

        const originalNameWithOutExt = path.basename(originalName, ext);

        const saveFolderPath = path.join(__dirname, '..', '..', '..', 'conversions', id);
        await fs.mkdir(saveFolderPath, { recursive: true });

        convertAudioUseCase.execute({
            convertTo: newFormat,
            onEnd: async () => {
                await this.deleteFile(filePath);
                res.status(200).json({
                    message: 'File converted successfully',
                });
            },
            onError: async (error: any) => {
                console.log({ error });
                await this.deleteFile(filePath);
                res.status(500).json({
                    error: 'Something went wrong',
                });
            },
            output: `${saveFolderPath}/${originalNameWithOutExt}${newFormat}`,
            input: filePath,
        });
    };

    public cutAudio = async (req: Request, res: Response) => {
        const { startTime, duration, originalName, id, size, ext } = req.body;

        const filePath = path.join(__dirname, '..', '..', '..', 'uploads', `${id}-${originalName}`);

        const fileExists = await this.checkIfFileExists(filePath);

        if (!fileExists) {
            res.status(400).json({
                error: `File doesn't exists`,
            });
            return;
        }

        const saveFolderPath = path.join(__dirname, '..', '..', '..', 'conversions', id);
        await fs.mkdir(saveFolderPath, { recursive: true });

        cutAudioUseCase.execute({
            startTime,
            duration,
            onEnd: async () => {
                await this.deleteFile(filePath);
                res.status(200).json({
                    message: 'Audio has been successfully cut.',
                });
            },
            onError: async (error: any) => {
                console.log({ error });
                await this.deleteFile(filePath);
                res.status(500).json({
                    error: 'Something went wrong',
                });
            },
            output: `${saveFolderPath}/${originalName}`,
            input: filePath,
        });
    };

    private checkIfFileExists = async (filePath: string): Promise<boolean> => {
        try {
            await fs.access(filePath, fs.constants.F_OK);
            return true;
        } catch (err: any) {
            console.log(err);
            return false;
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
