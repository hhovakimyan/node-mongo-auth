import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const auth = (req: Request, res: Response, next: NextFunction) => {
    if (req.path === '/auth/login' || req.path === '/auth/register') {
        next();

        return;
    }

    const authHeader = req.header('Authorization');
    if (!authHeader) {
        res.status(401).send();

        return;
    }

    const authToken = authHeader.replace('Bearer ', '');

    try {
        jwt.verify(authToken, process.env.JWT_SECRET);

        next();
    } catch (error) {
        res.status(401).send();
    }
};
