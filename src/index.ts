import express, { NextFunction, Request, Response } from 'express';
import path from 'path';
import { convertTo } from './helpers/convertTo';
import multer from 'multer';
import { fileTypeFromFile } from 'file-type';
import fs from 'node:fs';

const app = express();

const audioMimeTypes = [
    'audio/mpeg', // .mp3
    'audio/wav', // .wav
    'audio/x-wav', // también .wav
    'audio/ogg', // .ogg
    'audio/mp4', // .m4a
    'audio/x-aac', // .aac
    'audio/flac', // .flac
    'audio/webm', // .webm
];

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        if (audioMimeTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('File type not supported.'));
        }
    },
});

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
    res.json({
        messagge: '1',
        dirname: `${__dirname}/../convertions`,
    });
});

app.post(
    '/api/upload',
    upload.single('file'),
    (err: any, req: Request, res: Response, next: NextFunction) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        next();
    },
    async (req: Request, res: Response) => {
        const { newExtention } = req.body;

        if (!req.file) {
            res.status(400).json(`Audio file is required.`);
            return;
        }
        const fileType = await fileTypeFromFile(req.file.path);

        if (!fileType) {
            fs.unlinkSync(req.file.path);
            res.status(400).json(`No match for file type.`);
            return;
        }

        if (!audioMimeTypes.includes(fileType.mime)) {
            fs.unlinkSync(req.file.path);
            res.status(400).json(`File type not supported.`);
            return;
        }

        if (!newExtention) {
            fs.unlinkSync(req.file!.path);
            res.status(400).json({
                error: 'Format to convert is required',
            });
            return;
        }

        const uploadTime = req.file.filename.split('-')[0];

        const originalNameWithOutExtension = path.basename(req.file.originalname, fileType.ext);

        const saveFolderPath = path.resolve(`${__dirname}/../convertions/${uploadTime}`);

        fs.mkdirSync(saveFolderPath, { recursive: true });

        convertTo({
            convertTo: newExtention,
            onEnd: () => {
                fs.unlinkSync(req.file!.path);
                res.status(200).json({
                    message: 'File converted successfuly',
                });
            },
            onError: (error: any) => {
                console.log({ error });
                fs.unlinkSync(req.file!.path);
                res.status(500).json({
                    error: 'Something went wrong',
                });
            },
            output: `${saveFolderPath}/${originalNameWithOutExtension}${newExtention}`,
            input: req.file.path,
        });
    }
);

/* ffmpeg.ffprobe('./convertions/cabeza-de-pajaro-con-sus-chistes.mp3', (err:any, metadata:any) => {
    if (err) {
        console.log({ err });
        return;
    }

    const format = metadata.format;
    console.log(`Formato detectado: ${format.format_name}`);
}); */

app.listen(3000, () => {
    console.log('App running');
});
