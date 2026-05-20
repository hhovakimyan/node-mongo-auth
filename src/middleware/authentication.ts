import type { Request, Response, NextFunction } from 'express';

import AuthenticationService from '#services/AuthenticationService';

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

    const authUserId = AuthenticationService.validateAndGetUserId(authToken);
    if (!authUserId) {
        res.status(401).send();
        return;
    }

    const isBlacklisted = await AuthenticationService.isAccessTokenBlacklisted(authToken);
    if (isBlacklisted) {
        res.status(401).send();
        return;
    }

    req.authUserId = authUserId;
    req.authToken = authToken;

    next();
};
