import type { DefineMethods } from "aspida";

export interface NewsArticle {
  title: string;
  description: string;
  url: string;
  imageUrl: string;
  publishedAt: string;
  source: string;
}

export interface NewsResponse {
  category: 'trending' | 'breaking' | 'foreign';
  news: NewsArticle[];
  count: number;
}

export type Methods = DefineMethods<{
  get: {
    query?: {
      category?: 'trending' | 'breaking' | 'foreign';
    };
    resBody: NewsResponse;
  }
}>
