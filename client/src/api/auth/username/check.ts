import type { DefineMethods } from "aspida";

export interface CheckUsernameBody {
  username: string;
}

export interface CheckUsernameResponse {
  available: boolean;
  suggestion?: string;
}

export type Methods = DefineMethods<{
  post: {
    reqBody: CheckUsernameBody;
    resBody: CheckUsernameResponse;
  };
}>;

