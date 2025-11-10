import type { DefineMethods } from "aspida";

export interface FeedbackInput {
  name: string;
  email: string;
  subject: string;
  message: string;
  fileId?: number;
}

export interface FeedbackResponse {
  uuid: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  fileId: number | null;
  createdAt: string;
}

export type Methods = DefineMethods<{
  post: {
    reqBody: FeedbackInput;
    resBody: FeedbackResponse;
  }
}>
