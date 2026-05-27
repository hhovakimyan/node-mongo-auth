import bcrypt from 'bcrypt';
import jwt, { type JwtPayload } from 'jsonwebtoken';

import RedisClient from '#integrations/Redis/RedisClient';

class AuthenticationService {
    static readonly accessTokenExpTime: number = 21600;
    static readonly passwordHashSaltRounds: number = 10;

    public async hashPassword(plainTextPassword: string) {
        return await bcrypt.hash(plainTextPassword, AuthenticationService.passwordHashSaltRounds);
    }

    public async verifyPassword(plainTextPassword: string, hashedPassword: string) {
        return await bcrypt.compare(plainTextPassword, hashedPassword);
    }

    public createAccessToken(userId: string) {
        return jwt.sign({ data: userId }, process.env.JWT_SECRET, {
            expiresIn: AuthenticationService.accessTokenExpTime,
        });
    }

    public validateAndGetUserId(accessToken: string): string | null {
        try {
            const jwtPayload = jwt.verify(accessToken, process.env.JWT_SECRET) as JwtPayload;
            return jwtPayload.data as string;
        } catch (_error) {
            return null;
        }
    }

    public async isAccessTokenBlacklisted(accessToken: string) {
        return (await RedisClient.getClient()?.get(accessToken)) !== null;
    }

    public invalidateToken(accessToken: string) {
        RedisClient.getClient()?.set(accessToken, '', {
            EX: AuthenticationService.accessTokenExpTime,
        });
    }
}

export default AuthenticationService;
