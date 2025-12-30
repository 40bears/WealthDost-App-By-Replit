import { cn } from "@/lib/utils";
import { useNavigate } from "@tanstack/react-router";
import type { Notification, NotificationType, EntityType } from "@/api/notifications";

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: number) => void;
}

const getNotificationIcon = (type: NotificationType): string => {
  const iconMap: Record<NotificationType, string> = {
    LIKE: "favorite",
    COMMENT: "chat_bubble",
    FOLLOW: "person_add",
    NEW_POST: "article",
    MENTION: "alternate_email",
    TRIBE_INVITE: "group_add",
    ACHIEVEMENT: "emoji_events",
    SYSTEM: "info",
  };
  return iconMap[type] || "notifications";
};

const getNotificationColor = (type: NotificationType): string => {
  const colorMap: Record<NotificationType, string> = {
    LIKE: "text-red-500",
    COMMENT: "text-blue-500",
    FOLLOW: "text-green-500",
    NEW_POST: "text-purple-500",
    MENTION: "text-yellow-600",
    TRIBE_INVITE: "text-indigo-500",
    ACHIEVEMENT: "text-amber-500",
    SYSTEM: "text-gray-500",
  };
  return colorMap[type] || "text-gray-500";
};

const getNavigationPath = (entityType: EntityType, entityUuid: string | null): string | null => {
  if (!entityUuid) return null;

  const pathMap: Record<EntityType, string> = {
    POST: `/posts/${entityUuid}`,
    COMMENT: `/posts/${entityUuid}`, // Comments belong to posts
    TRIBE: `/tribe/${entityUuid}`,
    STOCK_TIP: `/stock-tips/${entityUuid}`,
    USER: `/user/${entityUuid}`,
  };

  return pathMap[entityType] || null;
};

const formatTimeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;

  return date.toLocaleDateString();
};

export const NotificationItem = ({ notification, onMarkAsRead }: NotificationItemProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    // Mark as read
    onMarkAsRead(notification.id);

    // Navigate to the appropriate page
    const path = getNavigationPath(notification.entityType, notification.entityUuid);
    if (path) {
      navigate({ to: path });
    }
  };

  return (
    <div
      onClick={handleClick}
      className={cn(
        "flex items-start gap-4 p-4 border-b border-gray-100 cursor-pointer transition-all duration-200",
        "hover:bg-gradient-to-r hover:from-gray-50 hover:to-transparent active:scale-[0.99]",
        !notification.isRead && "bg-gradient-to-r from-blue-50/80 to-transparent border-l-4 border-l-blue-500"
      )}
    >
      {/* Icon with background circle */}
      <div
        className={cn(
          "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center",
          "bg-gradient-to-br shadow-sm",
          notification.type === "LIKE" && "from-red-100 to-red-50",
          notification.type === "COMMENT" && "from-blue-100 to-blue-50",
          notification.type === "FOLLOW" && "from-green-100 to-green-50",
          notification.type === "NEW_POST" && "from-purple-100 to-purple-50",
          notification.type === "MENTION" && "from-yellow-100 to-yellow-50",
          notification.type === "TRIBE_INVITE" && "from-indigo-100 to-indigo-50",
          notification.type === "ACHIEVEMENT" && "from-amber-100 to-amber-50",
          notification.type === "SYSTEM" && "from-gray-100 to-gray-50"
        )}
      >
        <span className={cn("material-icons text-[20px]", getNotificationColor(notification.type))}>
          {getNotificationIcon(notification.type)}
        </span>
      </div>

      <div className="flex-1 min-w-0">
        <p
          className={cn(
            "text-sm text-gray-800 leading-relaxed",
            !notification.isRead && "font-semibold text-gray-900"
          )}
        >
          {notification.message}
        </p>

        <div className="flex items-center gap-2 mt-1.5">
          <p className="text-xs text-gray-500">
            {formatTimeAgo(notification.createdAt)}
          </p>
          {notification.actor && (
            <>
              <span className="text-gray-300">•</span>
              <p className="text-xs text-gray-600 font-medium truncate">
                {notification.actor.fullName || notification.actor.username}
              </p>
            </>
          )}
        </div>
      </div>

      {!notification.isRead && (
        <div className="flex-shrink-0 w-2.5 h-2.5 bg-blue-500 rounded-full mt-2 shadow-sm" />
      )}
    </div>
  );
};
