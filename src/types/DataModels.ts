import type {RegisterUserParams} from "#types/Controllers";

export type UserProps = Omit<RegisterUserParams, "passwordConfirm">;