import { useState, useCallback, useEffect } from "react";
import { apiClient } from "@/lib/api";
import { useNotificationSSE } from "./useNotificationSSE";

export const useNotificationCount = () => {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchCount = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiClient.notifications["unread-count"].get();
      setCount(response.body.count);
    } catch (err) {
      console.error("Failed to fetch unread count:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleNewNotification = useCallback(() => {
    setCount((prev) => prev + 1);
  }, []);

  useNotificationSSE({
    enabled: true,
    onNotification: handleNewNotification,
  });

  useEffect(() => {
    fetchCount();
  }, [fetchCount]);

  return {
    count,
    loading,
    refresh: fetchCount,
  };
};
