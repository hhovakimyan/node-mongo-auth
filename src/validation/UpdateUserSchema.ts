import * as yup from 'yup';
import type {UpdateUserParams} from '#types/Controllers';
import {registerUserSchema} from '#validation/RegisterUserSchema';

export const updateUserSchema: yup.ObjectSchema<UpdateUserParams> = registerUserSchema
    .pick(['firstName', 'lastName'])
    .partial()
    .test('at-least-one-field', 'At least one field must be provided to update', (value) =>
        Object.values(value).some((v) => v !== undefined)
    );
