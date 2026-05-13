import type { UserSchemaProps } from '#dbSchemas/User';

export type CreateUserProps = Omit<UserSchemaProps, '_id'>;
