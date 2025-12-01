import type { DefineMethods } from "aspida";

export interface StockSearchResult {
  symbol: string;
  name: string;
  currentPrice: number;
  changePercent: number;
  exchange: string;
}

export interface StockSearchResponse {
  stocks: StockSearchResult[];
  query: string;
  totalCount: number;
  returnedCount: number;
  lastUpdated: string;
}

export type Methods = DefineMethods<{
  get: {
    query: {
      q: string;
    };
    resBody: StockSearchResponse;
  }
}>