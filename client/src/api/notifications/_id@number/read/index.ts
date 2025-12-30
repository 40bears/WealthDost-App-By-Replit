import type { DefineMethods } from "aspida";
import type { Notification } from "../..";

export type Methods = DefineMethods<{
  patch: {
    resBody: Notification;
  };
}>;
