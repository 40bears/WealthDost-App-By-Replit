import type { DefineMethods } from "aspida";
import type { TribeRule } from "../index";

export interface UpdateRuleRequest {
  content: string;
}

export type Methods = DefineMethods<{
  patch: {
    reqBody: UpdateRuleRequest;
    resBody: TribeRule;
  };
  delete: {
    status: 204;
  };
}>;
