import type { DefineMethods } from "aspida";

export interface TribeRule {
  id: number;
  tribeId: number;
  content: string;
  displayOrder: number;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRuleRequest {
  content: string;
}

export interface ReorderRulesRequest {
  rules: Array<{
    id: number;
    displayOrder: number;
  }>;
}

export type Methods = DefineMethods<{
  get: {
    resBody: TribeRule[];
  };
  post: {
    reqBody: CreateRuleRequest;
    resBody: TribeRule;
  };
}>;
