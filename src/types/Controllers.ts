import type { UserSchemaProps } from '#dbSchemas/User';

export type RegisterUserParams = Omit<UserSchemaProps, '_id'> & {
    passwordConfirm: string;
};

export type UpdateUserParams = Partial<Omit<UserSchemaProps, '_id' | 'password' | 'email'>>;

export type LoginUserParams = Pick<UserSchemaProps, 'email' | 'password'>;
