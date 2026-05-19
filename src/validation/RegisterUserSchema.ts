import * as yup from 'yup';

import type { RegisterUserParams } from '#types/Controllers';

export const registerUserSchema: yup.ObjectSchema<RegisterUserParams> = yup.object({
    firstName: yup.string().required('Firstname is required'),
    lastName: yup.string().required('Lastname is required'),
    email: yup.string().required('Email is required').email('Invalid email format'),
    password: yup
        .string()
        .required('Password is required')
        .min(8, 'Password must be at least 8 characters'),
    passwordConfirm: yup
        .string()
        .oneOf([yup.ref('password')], 'Passwords must match')
        .required('Confirm password field is required'),
});
