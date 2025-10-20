import type { DefineMethods } from "aspida";
import { ChallengeRequestDriver } from "./request";

export interface VerifyChallengeRequest {
    driver: ChallengeRequestDriver,
    pendingId: string,
    code: string,
}


export type Methods = DefineMethods<{
    post: {
        reqBody: VerifyChallengeRequest;
    }
}>