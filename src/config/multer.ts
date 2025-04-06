import { NextFunction, Request, Response } from 'express';
import multer from 'multer';

export const audioMimeTypes = [
    'audio/mpeg', // .mp3
    'audio/wav', // .wav
    'audio/x-wav', // también .wav
    'audio/ogg', // .ogg
    'audio/mp4', // .m4a
    'audio/x-aac', // .aac
    'audio/flac', // .flac
    'audio/webm', // .webm
];

export const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

export const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        if (audioMimeTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('File type not supported.'));
        }
    },
});

export const handleMulterMiddlewareError = (err: any, req: Request, res: Response, next: NextFunction) => {
    if (err) {
        res.status(400).json({ error: err.message });
        return;
    }
    next();
};
