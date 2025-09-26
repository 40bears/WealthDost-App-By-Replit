import type { DefineMethods } from "aspida";

export type UserRegistrationDriver = 'totp' | 'oauth' | 'magic-link'

export interface UserRegistrationDetails {
    email: string,
    username: string,
    first_name: string,
    last_name: string,
    password: string,
    confirm_password: string
}


export type Methods = DefineMethods<{
    post: {
        query: {
            driver: UserRegistrationDriver
        },
        reqBody: UserRegistrationDetails;
    }
}>