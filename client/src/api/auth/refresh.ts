import type { DefineMethods } from "aspida";

export type Methods = DefineMethods<{
    post: {
        reqBody: {
            refreshToken: string;
        };
        resBody: {
            accessToken: string;
            refreshToken: string;
        };
    }
}>
