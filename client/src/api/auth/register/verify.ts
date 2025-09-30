import type { DefineMethods } from "aspida";
import { UserRegistrationDriver } from ".";

export interface VerifyUserRegistration {
    driver: UserRegistrationDriver,
    pendingId: string,
    code: string,
}


export type Methods = DefineMethods<{
    post: {
        reqBody: VerifyUserRegistration;
    }
}>