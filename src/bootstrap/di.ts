import { asClass, asValue, createContainer } from 'awilix';

import UserRepository from '#repositories/UserRepository';
import createUserRepositoryFactory from '#repositories/UserRepositoryFactory';
import AuthenticationService from '#services/AuthenticationService';

export interface DiCradle {
    authenticationService: AuthenticationService;
    userRepository: UserRepository;
}

const createDiContainer = async () => {
    const diContainer = createContainer<DiCradle>({
        injectionMode: 'CLASSIC',
    });

    const userRepository = await createUserRepositoryFactory();
    diContainer.register({
        authenticationService: asClass(AuthenticationService),
        userRepository: asValue(userRepository),
    });

    return diContainer;
};

export default createDiContainer;
