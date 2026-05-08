export type UserProps = {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
};

export type ListUserProps = Omit<UserProps, 'password'>;

export type CreateUserProps = Omit<UserProps, '_id'>;