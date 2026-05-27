import type { AwilixContainer } from 'awilix';

import type { DiCradle } from '#bootstrap/di';

declare global {
    namespace Express {
        interface Request {
            authUserId: string;
            authToken: string;
            container: AwilixContainer<DiCradle>;
        }
    }
}
