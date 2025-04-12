import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { audioMimeTypes } from '../domain/constants/audio-mime-types';

export const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const id = uuidv4();

        (file as any).fileId = id;

        cb(null, `${id}-${file.originalname}`);
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
