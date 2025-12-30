import { useState, useRef, useCallback, useEffect } from 'react';

export interface PullToRefreshOptions {
  onRefresh: () => Promise<void>;
  threshold?: number;
  maxPullDistance?: number;
  resistance?: number;
  enabled?: boolean;
}

export const usePullToRefresh = ({
  onRefresh,
  threshold = 80,
  maxPullDistance = 120,
  resistance = 2.5,
  enabled = true,
}: PullToRefreshOptions) => {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [canPull, setCanPull] = useState(false);

  const touchStartY = useRef(0);
  const touchCurrentY = useRef(0);
  const isPulling = useRef(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (!enabled || isRefreshing) return;

    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    // Only allow pull-to-refresh when at the top of the scroll container
    const isAtTop = scrollContainer.scrollTop === 0;

    if (isAtTop) {
      touchStartY.current = e.touches[0].clientY;
      setCanPull(true);
    } else {
      setCanPull(false);
    }
  }, [enabled, isRefreshing]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!enabled || !canPull || isRefreshing) return;

    touchCurrentY.current = e.touches[0].clientY;
    const deltaY = touchCurrentY.current - touchStartY.current;

    // Only pull down (positive deltaY)
    if (deltaY > 0) {
      isPulling.current = true;

      // Apply resistance to create a natural feel
      const resistedDistance = Math.min(
        deltaY / resistance,
        maxPullDistance
      );

      setPullDistance(resistedDistance);

      // Prevent default scroll behavior when pulling
      if (resistedDistance > 10) {
        e.preventDefault();
      }
    }
  }, [enabled, canPull, isRefreshing, resistance, maxPullDistance]);

  const handleTouchEnd = useCallback(async () => {
    if (!enabled || !isPulling.current || isRefreshing) {
      setPullDistance(0);
      isPulling.current = false;
      setCanPull(false);
      return;
    }

    isPulling.current = false;
    setCanPull(false);

    // Trigger refresh if pulled beyond threshold
    if (pullDistance >= threshold) {
      setIsRefreshing(true);
      setPullDistance(threshold); // Lock at threshold during refresh

      try {
        await onRefresh();
      } catch (error) {
        console.error('Pull to refresh error:', error);
      } finally {
        setIsRefreshing(false);
        setPullDistance(0);
      }
    } else {
      // Animate back to 0 if not pulled enough
      setPullDistance(0);
    }
  }, [enabled, pullDistance, threshold, onRefresh, isRefreshing]);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer || !enabled) return;

    // Add passive: false to be able to preventDefault
    scrollContainer.addEventListener('touchstart', handleTouchStart, { passive: false });
    scrollContainer.addEventListener('touchmove', handleTouchMove, { passive: false });
    scrollContainer.addEventListener('touchend', handleTouchEnd);

    return () => {
      scrollContainer.removeEventListener('touchstart', handleTouchStart);
      scrollContainer.removeEventListener('touchmove', handleTouchMove);
      scrollContainer.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd, enabled]);

  return {
    pullDistance,
    isRefreshing,
    scrollContainerRef,
    isPullActive: pullDistance > 0 || isRefreshing,
    isThresholdReached: pullDistance >= threshold,
  };
};
