import type { DefineMethods } from "aspida";
import type { StockTip } from "@/types";

export type Methods = DefineMethods<{
  get: {
    resBody: StockTip[];
  }
}>
