import type { DefineMethods } from "aspida";

export interface FileUploadResponse {
  id: number;
  uuid: string;
  originalName: string;
  storedName: string;
  extension: string;
  mimeType: string;
  size: number;
  bucket: string;
  path: string;
  publicUrl: string;
  createdAt: string;
  updatedAt: string;
}

export type Methods = DefineMethods<{
  post: {
    reqFormat: FormData;
    resBody: FileUploadResponse;
  }
}>
