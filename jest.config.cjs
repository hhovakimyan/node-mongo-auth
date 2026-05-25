module.exports = {
    extensionsToTreatAsEsm: ['.ts'],
    testEnvironment: 'node',
    testMatch: ['**/tests/**/*.test.ts'],
    transform: {
        '^.+\\.ts?$': ['ts-jest', { useESM: true }],
    },
    moduleNameMapper: {
        '^#controllers/(.*)$': '<rootDir>/src/controllers/$1',
        '^#middleware/(.*)$': '<rootDir>/src/middleware/$1',
        '^#repositories/(.*)$': '<rootDir>/src/repositories/$1',
        '^#types/(.*)$': '<rootDir>/src/types/$1',
        '^#validation/(.*)$': '<rootDir>/src/validation/$1',
        '^#integrations/(.*)$': '<rootDir>/src/integrations/$1',
        '^#dbSchemas/(.*)$': '<rootDir>/src/dbSchemas/$1',
        '^#routes/(.*)$': '<rootDir>/src/routes/$1',
        '^#services/(.*)$': '<rootDir>/src/services/$1',
    },
};
