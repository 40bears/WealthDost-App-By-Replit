import { useNotifications } from "@/hooks/useNotifications";
import { NotificationItem } from "@/components/notifications/NotificationItem";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PullToRefresh } from "@/components/common/PullToRefresh";
import { cn } from "@/lib/utils";

const NotificationList = () => {
  const {
    notifications,
    loading,
    error,
    hasMore,
    total,
    loadMore,
    refresh,
    markAsRead,
    sseConnected,
  } = useNotifications();

  const handleNotificationClick = (id: number) => {
    markAsRead(id);
  };

  // Wrapper for pull-to-refresh that returns a Promise
  const handleRefresh = async () => {
    refresh();
    // Add a small delay to ensure refresh completes
    await new Promise(resolve => setTimeout(resolve, 500));
  };

  if (loading && notifications.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-2xl mx-auto">
          <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 p-4 z-10 shadow-sm">
            <h1 className="text-xl font-bold text-gray-900">Notifications</h1>
          </div>
          <div className="flex flex-col p-4 space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-start gap-4 p-4 bg-white rounded-lg border border-gray-100">
                <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
                  <div className="h-3 bg-gray-100 rounded animate-pulse w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col">
      <div className="max-w-2xl mx-auto w-full flex flex-col flex-1">
        <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 p-4 z-10 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-md">
              <span className="material-icons text-white text-[20px]">notifications</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Notifications</h1>
              {sseConnected && (
                <div className="flex items-center gap-1.5 text-xs text-green-600 mt-0.5">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                  <span className="font-medium">Live updates</span>
                </div>
              )}
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={refresh}
            disabled={loading}
            className="hover:bg-gray-100 rounded-lg"
          >
            <span className={cn("material-icons text-[20px]", loading && "animate-spin")}>
              refresh
            </span>
          </Button>
        </div>

        <PullToRefresh
          onRefresh={handleRefresh}
          className="flex-1 min-h-0"
        >
          <div>
            {error && (
              <Alert variant="destructive" className="m-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {notifications.length === 0 && !loading ? (
          <div className="flex flex-col items-center justify-center p-16 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-50 rounded-full flex items-center justify-center mb-6 shadow-inner">
              <span className="material-icons text-5xl text-gray-400">
                notifications_none
              </span>
            </div>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              No notifications yet
            </h2>
            <p className="text-sm text-gray-500 max-w-xs">
              When you get notifications, they'll show up here. Stay tuned!
            </p>
          </div>
        ) : (
          <>
            <div className="bg-white">
              {notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={handleNotificationClick}
                />
              ))}
            </div>

            {hasMore && (
              <div className="p-4 bg-gradient-to-b from-white to-gray-50">
                <Button
                  variant="outline"
                  onClick={loadMore}
                  disabled={loading}
                  className="w-full h-12 border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 rounded-xl font-semibold"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="material-icons animate-spin text-[20px]">
                        refresh
                      </span>
                      Loading more...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <span className="material-icons text-[20px]">expand_more</span>
                      Load more ({total - notifications.length} remaining)
                    </span>
                  )}
                </Button>
              </div>
            )}
          </>
        )}
          </div>
        </PullToRefresh>
      </div>
    </div>
  );
};

export default NotificationList;