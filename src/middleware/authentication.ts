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
        const decoded = jwt.verify(authToken, process.env.JWT_SECRET);

        req.authUserId = decoded.data;

        next();
    } catch (error) {
        res.status(401).send();
    }
};
