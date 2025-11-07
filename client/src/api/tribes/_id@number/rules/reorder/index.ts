import type { DefineMethods } from "aspida";
import type { TribeRule, ReorderRulesRequest } from "../index";

export type Methods = DefineMethods<{
  put: {
    reqBody: ReorderRulesRequest;
    resBody: TribeRule[];
  };
}>;
