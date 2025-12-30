import type { DefineMethods } from "aspida";
import type { UnreadCountResponse } from "..";

export type Methods = DefineMethods<{
  get: {
    resBody: UnreadCountResponse;
  };
}>;
