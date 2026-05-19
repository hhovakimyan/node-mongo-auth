declare namespace Express {
    interface Request {
        authUserId: string;
        authToken: string;
    }
}
