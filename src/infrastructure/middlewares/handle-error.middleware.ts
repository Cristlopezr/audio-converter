import { NextFunction, Request, Response } from 'express';

export const handleMiddlewareError = (err: any, req: Request, res: Response, next: NextFunction) => {
    const statusCode = err.status || 400;

    if (err) {
        res.status(statusCode).json({ error: err.message });
        return;
    }
    next();
};
