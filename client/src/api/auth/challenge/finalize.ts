import type { DefineMethods } from "aspida";
import { ChallengeRequestDriver } from "./request";

export interface FinalizeUserRegistration {
    driver: ChallengeRequestDriver,
    pendingId: string,
    email?: string,
    username: string,
    first_name: string,
    last_name: string,
    password: string,
    confirm_password: string,
    additional: Record<string, any>,
}


export type Methods = DefineMethods<{
    post: {
        reqBody: FinalizeUserRegistration;
    }
}>