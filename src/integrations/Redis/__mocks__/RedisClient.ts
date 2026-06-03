import { jest } from '@jest/globals';

const mockRedisClient = {
    get: jest.fn().mockResolvedValue(null),
    set: jest.fn().mockResolvedValue('OK'),
};

const redisClientMock = {
    init: jest.fn().mockResolvedValue(undefined),
    connect: jest.fn().mockResolvedValue(undefined),
    getClient: jest.fn().mockReturnValue(mockRedisClient),
};

export { mockRedisClient, redisClientMock as RedisClient };
