import React, { ReactNode } from 'react';
import { usePullToRefresh, PullToRefreshOptions } from '@/hooks/usePullToRefresh';
import { Loader2 } from 'lucide-react';

interface PullToRefreshProps extends Omit<PullToRefreshOptions, 'onRefresh'> {
  children: ReactNode;
  onRefresh: () => Promise<void>;
  className?: string;
}

export const PullToRefresh: React.FC<PullToRefreshProps> = ({
  children,
  onRefresh,
  threshold = 80,
  maxPullDistance = 120,
  resistance = 2.5,
  enabled = true,
  className = '',
}) => {
  const {
    pullDistance,
    isRefreshing,
    scrollContainerRef,
    isPullActive,
    isThresholdReached,
  } = usePullToRefresh({
    onRefresh,
    threshold,
    maxPullDistance,
    resistance,
    enabled,
  });

  // Calculate opacity and rotation based on pull distance
  const spinnerOpacity = Math.min(pullDistance / threshold, 1);
  const spinnerRotation = (pullDistance / threshold) * 360;

  return (
    <div
      ref={scrollContainerRef}
      className={`relative overflow-y-auto ${className}`}
      style={{
        WebkitOverflowScrolling: 'touch',
      }}
    >
      {/* Pull-to-refresh indicator */}
      <div
        className="absolute left-0 right-0 top-0 z-50 flex items-center justify-center transition-opacity duration-200"
        style={{
          height: `${pullDistance}px`,
          opacity: isPullActive ? 1 : 0,
        }}
      >
        <div
          className="flex items-center justify-center"
          style={{
            transform: `translateY(${Math.max(0, pullDistance - 40)}px)`,
            transition: isPullActive && !isRefreshing ? 'none' : 'transform 300ms ease-out',
          }}
        >
          <Loader2
            className={`h-6 w-6 text-primary ${
              isRefreshing || isThresholdReached ? 'animate-spin' : ''
            }`}
            style={{
              opacity: spinnerOpacity,
              transform: isRefreshing ? 'rotate(0deg)' : `rotate(${spinnerRotation}deg)`,
              transition: isRefreshing ? 'none' : 'transform 100ms linear',
            }}
          />
        </div>
      </div>

      {/* Content wrapper */}
      <div
        style={{
          transform: `translateY(${pullDistance}px)`,
          transition: isPullActive && !isRefreshing ? 'none' : 'transform 300ms ease-out',
        }}
      >
        {children}
      </div>
    </div>
  );
};
