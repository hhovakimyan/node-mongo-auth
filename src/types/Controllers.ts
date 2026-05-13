import type { UserProps } from '#types/DataModels';

export type RegisterUserParams = Omit<UserProps, '_id'> & {
    passwordConfirm: string;
};

export type UpdateUserParams = Partial<Omit<UserProps, '_id' | 'password' | 'email'>>;
