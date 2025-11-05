import type { DefineMethods } from "aspida";
import type { CreateTribeInput, CreateTribeResponse, Tribe } from "@/types";

export type Methods = DefineMethods<{
    get: {
        resBody: Tribe[];
    }
    post: {
        reqBody: CreateTribeInput;
        resBody: CreateTribeResponse;
    }
}>
