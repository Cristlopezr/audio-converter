import { NextFunction, Request, Response } from 'express';

export const validateFile = (req: Request, res: Response, next: NextFunction) => {
    if (!req.file) {
        res.status(400).json(`Audio file is required.`);
        return;
    }
    next();
};
