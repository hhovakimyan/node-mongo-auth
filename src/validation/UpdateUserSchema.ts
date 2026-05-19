import * as yup from 'yup';

import type { UpdateUserParams } from '#types/Controllers';
import { registerUserSchema } from '#validation/RegisterUserSchema';

const userUpdateFields = ['firstName', 'lastName'] as const;

export const updateUserSchema: yup.ObjectSchema<UpdateUserParams> = registerUserSchema
    .pick(userUpdateFields)
    .partial()
    .test('correct-field', 'Incorrect field provided for update', (value) =>
        Object.keys(value).every((key) =>
            (userUpdateFields as ReadonlyArray<string>).includes(key),
        ),
    )
    .test('at-least-one-field', 'At least one field must be provided to update', (value) =>
        Object.values(value).some((v) => v !== undefined),
    );
