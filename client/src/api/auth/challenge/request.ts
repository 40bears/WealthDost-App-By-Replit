import type { DefineMethods } from "aspida";

export type ChallengeRequestDriver = 'totp' | 'oauth' | 'magic-link'

export interface InitChallengeRequest {
    driver: ChallengeRequestDriver,
    email?: string,
    phone?: string,
}

export type Methods = DefineMethods<{
    post: {
        reqBody: InitChallengeRequest;
    }
}>