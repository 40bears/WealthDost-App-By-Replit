import type { DefineMethods } from "aspida";
import type { Tribe } from "@/types";

export type Methods = DefineMethods<{
  get: {
    resBody: Tribe;
  }
}>
