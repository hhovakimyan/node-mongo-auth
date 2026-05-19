import * as yup from 'yup';

import type { LoginUserParams } from '#types/Controllers';
import { registerUserSchema } from '#validation/RegisterUserSchema';

const loginFields = ['email', 'password'] as const;

export const loginUserSchema: yup.ObjectSchema<LoginUserParams> =
    registerUserSchema.pick(loginFields);
