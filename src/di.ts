import { asClass, asValue, createContainer } from 'awilix';

import createUserRepositoryFactory from '#repositories/UserRepositoryFactory';
import AuthenticationService from '#services/AuthenticationService';

const createDiContainer = async () => {
    const diContainer = createContainer({
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
