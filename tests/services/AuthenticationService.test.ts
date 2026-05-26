import { jest } from '@jest/globals';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import RedisClient from '#integrations/Redis/RedisClient';
import AuthenticationService from '#services/AuthenticationService';

test('hashPassword works correctly', async () => {
    const bcrypSpy = jest.spyOn(bcrypt, 'hash');

    const result = await AuthenticationService.hashPassword('somepassword');
    expect(result).toBe('hashed_password');

    expect(bcrypSpy).toBeCalledTimes(1);
});

test('verifyPassword returns true', async () => {
    const bcrypSpy = jest.spyOn(bcrypt, 'compare');

    const result = await AuthenticationService.verifyPassword('somepassword', 'hashedpassword');
    expect(result).toBe(true);

    expect(bcrypSpy).toBeCalledTimes(1);
});

test('verifyPassword returns false', async () => {
    const bcrypSpy = jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

    const result = await AuthenticationService.verifyPassword('somepassword', 'hashedpassword');
    expect(result).toBe(false);

    expect(bcrypSpy).toBeCalledTimes(1);
});

test('createAccessToken works correct', () => {
    const jestSpy = jest.spyOn(jwt, 'sign');
    jestSpy.mockReturnValue('somejwt');

    const result = AuthenticationService.createAccessToken('6a05c3f518d80eb79379a732');

    expect(result).toBe('somejwt');
    expect(jestSpy).toBeCalledWith({ data: '6a05c3f518d80eb79379a732' }, 'my_secret', {
        expiresIn: 21600,
    });
});

test('validateAndGetUserId returns null when access token is invalid', () => {
    const jwtVerifySpy = jest.spyOn(jwt, 'verify');
    jwtVerifySpy.mockImplementation(() => {
        throw new Error('Invalid token');
    });

    const result = AuthenticationService.validateAndGetUserId('somejwt');
    expect(result).toBe(null);
});

test('validateAndGetUserId returns access token when access token is valid', () => {
    const jwtVerifySpy = jest.spyOn(jwt, 'verify');
    jwtVerifySpy.mockReturnValue({ data: '6a05c3f518d80eb79379a732' });

    const result = AuthenticationService.validateAndGetUserId('somejwt');
    expect(result).toBe('6a05c3f518d80eb79379a732');
});

test('isAccessTokenBlacklisted returns false', async () => {
    const redisClientSpy = jest
        .spyOn(RedisClient, 'getClient')
        .mockReturnValue({ get: jest.fn().mockReturnValue(null) });

    const result = await AuthenticationService.isAccessTokenBlacklisted('sometoken');
    expect(result).toBe(false);

    expect(redisClientSpy).toBeCalledTimes(1);
});

test('isAccessTokenBlacklisted returns true', async () => {
    const redisClientSpy = jest
        .spyOn(RedisClient, 'getClient')
        .mockReturnValue({ get: jest.fn().mockReturnValue('sometoken') });

    const result = await AuthenticationService.isAccessTokenBlacklisted('sometoken');
    expect(result).toBe(true);

    expect(redisClientSpy).toBeCalledTimes(1);
});

test('invalidateToken works correct', () => {
    const redisClientSpy = jest
        .spyOn(RedisClient, 'getClient')
        .mockReturnValue({ set: jest.fn().mockResolvedValue('Ok') });

    AuthenticationService.invalidateToken('sometoken');

    expect(redisClientSpy).toBeCalledTimes(1);
});
