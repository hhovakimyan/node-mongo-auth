import type { UserSchemaProps } from '#dbSchemas/User';

export type RegisterUserParams = Omit<UserSchemaProps, '_id' | 'avatar'> & {
    passwordConfirm: string;
};

export type UpdateUserParams = Partial<
    Omit<UserSchemaProps, '_id' | 'password' | 'email' | 'avatar'>
>;

export type LoginUserParams = Pick<UserSchemaProps, 'email' | 'password'>;
