import express, { NextFunction, Request, Response } from 'express';
import path from 'path';
import { convertTo } from './helpers/convertTo';
import multer from 'multer';
import { fileTypeFromFile } from 'file-type';
import fs from 'fs/promises';
import { deleteFile } from './helpers/deleteFile';

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

const uploadFile = async (req: Request, res: Response) => {
    if (!req.file) {
        res.status(400).json(`Audio file is required.`);
        return;
    }
    const fileType = await fileTypeFromFile(req.file.path);

    if (!fileType) {
        await deleteFile(req.file.path);
        res.status(400).json(`No match for file type.`);
        return;
    }

    if (!audioMimeTypes.includes(fileType.mime)) {
        await deleteFile(req.file.path);
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
    uploadFile
);

const convertToNewFormat = async (req: Request, res: Response) => {
    const { newFormat, originalName, id, size, ext, mime } = req.body;
    //!Validar todo, que vengan las propiedades necesarias

    const filePath = path.resolve(`${__dirname}/../uploads/${id}-${originalName}`);

    try {
        await fs.access(filePath, fs.constants.F_OK);
    } catch (err) {
        res.status(400).json({
            error: `File doesn't exists`,
        });
    }

    if (!newFormat) {
        await deleteFile(filePath);
        res.status(400).json({
            error: 'Format to convert is required',
        });
        return;
    }

    const originalNameWithOutExt = path.basename(originalName, ext);

    const saveFolderPath = path.resolve(`${__dirname}/../convertions/${id}`);
    await fs.mkdir(saveFolderPath, { recursive: true });

    convertTo({
        convertTo: newFormat,
        onEnd: async () => {
            await deleteFile(filePath);
            res.status(200).json({
                message: 'File converted successfully',
            });
        },
        onError: async (error: any) => {
            console.log({ error });
            await deleteFile(filePath);
            res.status(500).json({
                error: 'Something went wrong',
            });
        },
        output: `${saveFolderPath}/${originalNameWithOutExt}${newFormat}`,
        input: filePath,
    });
};

app.post('/api/convert', convertToNewFormat);

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
