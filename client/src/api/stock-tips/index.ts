import type { DefineMethods } from "aspida";
import type { CreateStockTipInput, StockTip } from "@/types";

export type Methods = DefineMethods<{
  get: {
    resBody: StockTip[];
  }
  post: {
    reqBody: CreateStockTipInput;
    resBody: StockTip;
  }
}>
