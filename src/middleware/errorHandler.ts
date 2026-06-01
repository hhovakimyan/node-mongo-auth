import type { NextFunction, Request, Response } from 'express';
import { MulterError } from 'multer';

export const errorHandler = async (err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof MulterError) {
        res.status(400).json({ message: err.message });
    } else {
        res.status(500).json({ message: err.message });
    }
};
