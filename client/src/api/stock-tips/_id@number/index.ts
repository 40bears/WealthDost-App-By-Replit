import type { DefineMethods } from "aspida";
import type { StockTip, UpdateStockTipInput } from "@/types";

export type Methods = DefineMethods<{
  get: {
    resBody: StockTip;
  }
  patch: {
    reqBody: UpdateStockTipInput;
    resBody: StockTip;
  }
  delete: {
    resBody: void;
  }
}>
