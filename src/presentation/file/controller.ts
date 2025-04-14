import { Request, Response } from 'express';
import { fileTypeFromFile } from 'file-type';
import fs from 'fs/promises';
import path from 'path';
import { ConvertAudioUseCase } from '../../domain/use-cases/convert-audio.use-case';
import { audioMimeTypes } from '../../domain/constants/audio-mime-types';
import { FfmpegAdapter } from '../../infrastructure/adapters/ffmpeg.adapter';
import { CutAudioUseCase } from '../../domain/use-cases/cut-audio.use-case';
import { prisma } from '../../lib/prisma-client';
import { supportedFormats } from '../../domain/constants/formats';
import ffmpeg from 'fluent-ffmpeg';
import { v4 as uuidv4 } from 'uuid';

const audioProcessor = new FfmpegAdapter();
const convertAudioUseCase = new ConvertAudioUseCase(audioProcessor);
const cutAudioUseCase = new CutAudioUseCase(audioProcessor);

const audioExtensionToMimeTypeMap: Record<string, string> = {
    mp3: 'audio/mpeg',
    wav: 'audio/wav',
    ogg: 'audio/ogg',
    m4a: 'audio/mp4',
    aac: 'audio/x-aac',
    flac: 'audio/flac',
    webm: 'audio/webm',
};
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

        const originalNameWithOutExt = path.basename(req.file.originalname, fileType.ext).replace(/\.$/, '');

        try {
            const { format, format_long_name, duration, size, bit_rate } = await audioProcessor.checkAudioMetadata(req.file.path);

            const newAudio = {
                id: (req.file as any).fileId,
                originalName: req.file.originalname,
                originalNameWithOutExt: originalNameWithOutExt,
                ext: format,
                mimetype: fileType.mime,
                extLongName: format_long_name,
                duration,
                size,
                bitRate: bit_rate,
            };

            await prisma.audio.create({
                data: {
                    ...newAudio,
                    type: 'ORIGINAL',
                },
            });

            res.status(200).json(newAudio);
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
            const foundAudio = await prisma.audio.findFirst({
                where: {
                    id,
                },
            });

            if (!foundAudio) {
                res.status(400).json({
                    message: 'Audio not found',
                });
                return;
            }

            const filePath = path.join(__dirname, '..', '..', '..', 'uploads', `${id}-${foundAudio.originalName}`);

            const fileExists = await this.checkIfFileExists(filePath);

            if (!fileExists) {
                res.status(400).json({
                    error: `File doesn't exists`,
                });
            }

            if (!supportedFormats.includes(format)) {
                await this.deleteFile(filePath);
                res.status(400).json({
                    error: 'Format not supported',
                });
                return;
            }

            const newAudioId = uuidv4();

            const saveFolderPath = path.join(__dirname, '..', '..', '..', 'conversions', foundAudio.id, newAudioId);
            await fs.mkdir(saveFolderPath, { recursive: true });

            const outputPath = `${saveFolderPath}/${foundAudio.originalNameWithOutExt}.${format}`;

            convertAudioUseCase.execute({
                convertTo: format,
                onEnd: async () => {
                    try {
                        const metadata = await audioProcessor.checkAudioMetadata(outputPath);

                        await prisma.audio.create({
                            data: {
                                id: newAudioId,
                                ext: metadata.format,
                                mimetype: audioExtensionToMimeTypeMap[metadata.format],
                                originalName: `${foundAudio.originalNameWithOutExt}.${metadata.format}`,
                                originalNameWithOutExt: foundAudio.originalNameWithOutExt,
                                size: metadata.size,
                                type: 'CONVERTED',
                                originalId: foundAudio.id,
                                extLongName: metadata.format_long_name,
                                duration: metadata.duration,
                                bitRate: metadata.bit_rate,
                            },
                        });

                        res.status(200).json({
                            message: 'File converted successfully',
                        });
                    } catch (error) {
                        console.log(error);
                        res.status(200).json({
                            message: 'File converted successfully',
                        });
                    }
                },
                onError: async (error: any) => {
                    console.log({ error });
                    res.status(500).json({
                        error: 'Something went wrong converting the audio',
                    });
                },
                output: outputPath,
                input: filePath,
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
            const foundAudio = await prisma.audio.findFirst({
                where: {
                    id,
                },
            });

            if (!foundAudio) {
                res.status(400).json({
                    message: 'Audio not found',
                });
                return;
            }

            const filePath = path.join(__dirname, '..', '..', '..', 'uploads', `${id}-${foundAudio.originalName}`);

            const fileExists = await this.checkIfFileExists(filePath);

            if (!fileExists) {
                res.status(400).json({
                    error: `File doesn't exists`,
                });
                return;
            }

            const newAudioId = uuidv4();
            const saveFolderPath = path.join(__dirname, '..', '..', '..', 'conversions', foundAudio.id, newAudioId);
            await fs.mkdir(saveFolderPath, { recursive: true });

            const outputPath = `${saveFolderPath}/${foundAudio.originalName}`;

            cutAudioUseCase.execute({
                startTime,
                duration: duration || foundAudio.duration,
                onEnd: async () => {
                    try {
                        const metadata = await audioProcessor.checkAudioMetadata(outputPath);

                        await prisma.audio.create({
                            data: {
                                id: newAudioId,
                                ext: metadata.format,
                                mimetype: audioExtensionToMimeTypeMap[metadata.format],
                                originalName: `${foundAudio.originalName}`,
                                originalNameWithOutExt: foundAudio.originalNameWithOutExt,
                                size: metadata.size,
                                type: 'TRIMMED',
                                originalId: foundAudio.id,
                                extLongName: metadata.format_long_name,
                                duration: metadata.duration,
                                bitRate: metadata.bit_rate,
                            },
                        });

                        res.status(200).json({
                            message: 'File converted successfully',
                        });
                    } catch (error) {
                        console.log(error);
                        res.status(200).json({
                            message: 'File converted successfully',
                        });
                    }
                },
                onError: async (error: any) => {
                    console.log({ error });
                    res.status(500).json({
                        error: 'Something went wrong',
                    });
                },
                output: outputPath,
                input: filePath,
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: 'Something went wrong',
            });
        }
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
