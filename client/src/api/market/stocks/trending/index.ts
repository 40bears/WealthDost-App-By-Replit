import type { DefineMethods } from "aspida";

export interface TrendingStock {
  symbol: string;
  name: string;
  currentPrice: number;
  changePercent: number;
  exchange: string;
}

export interface TrendingStocksResponse {
  stocks: TrendingStock[];
  lastUpdated: string;
  count: number;
}

export type Methods = DefineMethods<{
  get: {
    resBody: TrendingStocksResponse;
  }
}>
