import type { DefineMethods } from "aspida";

export type NotificationType =
  | "LIKE"
  | "COMMENT"
  | "FOLLOW"
  | "NEW_POST"
  | "MENTION"
  | "TRIBE_INVITE"
  | "ACHIEVEMENT"
  | "SYSTEM";

export type EntityType = "POST" | "COMMENT" | "TRIBE" | "STOCK_TIP" | "USER";

export interface NotificationActor {
  uuid: string;
  username: string;
  fullName: string;
}

export interface Notification {
  id: number;
  type: NotificationType;
  entityType: EntityType;
  entityUuid: string | null;
  message: string;
  isRead: boolean;
  createdAt: string;
  actor?: NotificationActor;
  metadata?: Record<string, any>;
}

export interface NotificationsResponse {
  notifications: Notification[];
  total: number;
  hasMore: boolean;
  nextOffset: number;
}

export interface UnreadCountResponse {
  count: number;
}

export type Methods = DefineMethods<{
  get: {
    query?: {
      limit?: number;
      offset?: number;
    };
    resBody: NotificationsResponse;
  };
}>;
