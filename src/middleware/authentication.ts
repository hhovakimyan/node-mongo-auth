import type { Request, Response, NextFunction } from 'express';
import jwt, { type JwtPayload } from 'jsonwebtoken';

import RedisClient from '#integrations/Redis/RedisClient';

export const auth = async (req: Request, res: Response, next: NextFunction) => {
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

    let decoded: JwtPayload | null;
    try {
        decoded = jwt.verify(authToken, process.env.JWT_SECRET) as JwtPayload;
    } catch (_error) {
        res.status(401).send();
        return;
    }

    // Check if auth token is in blacklist
    const isBlacklisted = (await RedisClient.getClient()?.get(authToken)) !== null;
    if (isBlacklisted) {
        res.status(401).send();
        return;
    }

    req.authUserId = decoded.data;
    req.authToken = authToken;

    next();
};
