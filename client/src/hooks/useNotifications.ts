import { useState, useCallback, useEffect } from "react";
import { apiClient } from "@/lib/api";
import { useNotificationSSE } from "./useNotificationSSE";
import type { Notification } from "@/api/notifications";

interface UseNotificationsOptions {
  limit?: number;
  enableSSE?: boolean;
}

export const useNotifications = (options: UseNotificationsOptions = {}) => {
  const { limit = 20, enableSSE = true } = options;

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [nextOffset, setNextOffset] = useState(0);
  const [total, setTotal] = useState(0);

  const fetchNotifications = useCallback(
    async (offset: number = 0) => {
      try {
        setLoading(true);
        setError(null);

        const response = await apiClient.notifications.get({
          query: { limit, offset },
        });

        // Handle both array response and object response
        const notificationsData = Array.isArray(response.body)
          ? response.body
          : response.body.notifications || [];

        if (offset === 0) {
          setNotifications(notificationsData);
        } else {
          setNotifications((prev) => [...prev, ...notificationsData]);
        }

        // Calculate pagination info
        const fetchedCount = notificationsData.length;
        const hasMoreData = fetchedCount === limit;

        setHasMore(hasMoreData);
        setNextOffset(offset + fetchedCount);
        setTotal((prev) => offset === 0 ? fetchedCount : prev + fetchedCount);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch notifications");
      } finally {
        setLoading(false);
      }
    },
    [limit]
  );

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      fetchNotifications(nextOffset);
    }
  }, [loading, hasMore, nextOffset, fetchNotifications]);

  const refresh = useCallback(() => {
    fetchNotifications(0);
  }, [fetchNotifications]);

  const handleNewNotification = useCallback((notification: Notification) => {
    setNotifications((prev) => {
      const exists = prev.some((n) => n.id === notification.id);
      if (exists) {
        return prev;
      }
      return [notification, ...prev];
    });
    setTotal((prev) => prev + 1);
  }, []);

  const markAsRead = useCallback(async (notificationId: number) => {
    try {
      await apiClient.notifications._id(notificationId).patch();

      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notificationId ? { ...n, isRead: true } : n
        )
      );
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  }, []);

  const { isConnected: sseConnected, error: sseError } = useNotificationSSE({
    enabled: enableSSE,
    onNotification: handleNewNotification,
  });

  useEffect(() => {
    fetchNotifications(0);
  }, [fetchNotifications]);

  return {
    notifications,
    loading,
    error: error || sseError,
    hasMore,
    total,
    loadMore,
    refresh,
    markAsRead,
    sseConnected,
  };
};
