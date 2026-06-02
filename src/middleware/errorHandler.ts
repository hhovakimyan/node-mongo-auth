import type { NextFunction, Request, Response } from 'express';
import { MulterError } from 'multer';

export const errorHandler = async (
    err: Error,
    _req: Request,
    res: Response,
    _next: NextFunction,
) => {
    if (err instanceof MulterError || err.message === 'invalid_file_format') {
        res.status(400).json({ message: err.message });
    } else {
        res.status(500).json({ message: err.message });
    }
};
