declare global {
    namespace NodeJS {
        interface ProcessEnv {
            MONGO_CONNECTION_STRING: string;
            MONGO_DB_NAME: string;
            JWT_SECRET: string;
            EXPRESS_PORT: number;
        }
    }
}

export {};
