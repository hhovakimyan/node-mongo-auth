import type { UserSchemaProps } from '#dbSchemas/User';

export type RegisterUserParams = Omit<UserSchemaProps, '_id' | 'avatar'> & {
    passwordConfirm: string;
};

export type UpdateUserParams = Partial<Pick<UserSchemaProps, 'lastName' | 'firstName'>>;

export type LoginUserParams = Pick<UserSchemaProps, 'email' | 'password'>;
