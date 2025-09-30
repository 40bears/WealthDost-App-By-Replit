import type { DefineMethods } from "aspida";

export type UserRegistrationDriver = 'totp' | 'oauth' | 'magic-link'

export interface InitRegisterUser {
    email?: string,
    phone?: string,
}


export type Methods = DefineMethods<{
    post: {
        query: {
            driver: UserRegistrationDriver
        },
        reqBody: InitRegisterUser;
    }
}>