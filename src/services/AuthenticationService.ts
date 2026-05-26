import bcrypt from 'bcrypt';
import jwt, { type JwtPayload } from 'jsonwebtoken';

import RedisClient from '#integrations/Redis/RedisClient';

class AuthenticationService {
    static readonly accessTokenExpTime: number = 21600;
    static readonly passwordHashSaltRounds: number = 10;

    public static async hashPassword(plainTextPassword: string) {
        return await bcrypt.hash(plainTextPassword, AuthenticationService.passwordHashSaltRounds);
    }

    public static async verifyPassword(plainTextPassword: string, hashedPassword: string) {
        const result = await bcrypt.compare(plainTextPassword, hashedPassword);
        return result;
    }

    public static createAccessToken(userId: string) {
        return jwt.sign({ data: userId }, process.env.JWT_SECRET, {
            expiresIn: AuthenticationService.accessTokenExpTime,
        });
    }

    public static validateAndGetUserId(accessToken: string): string | null {
        try {
            const jwtPayload = jwt.verify(accessToken, process.env.JWT_SECRET) as JwtPayload;
            return jwtPayload.data as number;
        } catch (_error) {
            return null;
        }
    }

    public static async isAccessTokenBlacklisted(accessToken: string) {
        return (await RedisClient.getClient()?.get(accessToken)) !== null;
    }

    public static invalidateToken(accessToken: string) {
        RedisClient.getClient()?.set(accessToken, '', {
            EX: AuthenticationService.accessTokenExpTime,
        });
    }
}

export default AuthenticationService;
