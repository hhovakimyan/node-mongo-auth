import type { Request, Response, NextFunction } from 'express';

export const auth = async (req: Request, res: Response, next: NextFunction) => {
    const { authenticationService } = req.container.cradle;

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

    const authUserId = authenticationService.validateAndGetUserId(authToken);
    if (!authUserId) {
        res.status(401).send();
        return;
    }

    const isBlacklisted = await authenticationService.isAccessTokenBlacklisted(authToken);
    if (isBlacklisted) {
        res.status(401).send();
        return;
    }

    req.authUserId = authUserId;
    req.authToken = authToken;

    next();
};
