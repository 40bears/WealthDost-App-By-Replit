import { useEffect, useRef, useState } from "react";
import appConfig from "@/config/app";
import type { Notification } from "@/api/notifications";

interface UseNotificationSSEOptions {
  enabled?: boolean;
  onNotification?: (notification: Notification) => void;
}

export const useNotificationSSE = (options: UseNotificationSSEOptions = {}) => {
  const { enabled = true, onNotification } = options;
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 5;
  const baseReconnectDelay = 1000;

  useEffect(() => {
    if (!enabled) {
      cleanup();
      return;
    }

    const connect = () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
          setError("No access token found");
          return;
        }

        const url = new URL(`${appConfig.apiUrl}/notifications/sse`);
        url.searchParams.set("token", accessToken);

        const eventSource = new EventSource(url.toString());
        eventSourceRef.current = eventSource;

        eventSource.onopen = () => {
          setIsConnected(true);
          setError(null);
          reconnectAttemptsRef.current = 0;
        };

        eventSource.onmessage = (event) => {
          try {
            const notification: Notification = JSON.parse(event.data);
            onNotification?.(notification);
          } catch (err) {
            console.error("Failed to parse notification:", err);
          }
        };

        eventSource.onerror = () => {
          setIsConnected(false);
          eventSource.close();

          if (reconnectAttemptsRef.current < maxReconnectAttempts) {
            const delay =
              baseReconnectDelay * Math.pow(2, reconnectAttemptsRef.current);
            reconnectAttemptsRef.current += 1;

            reconnectTimeoutRef.current = setTimeout(() => {
              connect();
            }, delay);
          } else {
            setError("Failed to connect to notification stream");
          }
        };
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to connect to SSE"
        );
      }
    };

    const cleanup = () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
      setIsConnected(false);
      reconnectAttemptsRef.current = 0;
    };

    connect();

    return cleanup;
  }, [enabled, onNotification]);

  return {
    isConnected,
    error,
  };
};
