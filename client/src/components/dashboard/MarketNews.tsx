import { useState, useEffect, MutableRefObject, useRef, useCallback } from 'react';
import { ListFilter, ExternalLink } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Format date to relative time or date string
function formatNewsDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) {
    return `${diffMins}m ago`;
  } else if (diffHours < 24) {
    return `${diffHours}h ago`;
  } else if (diffDays < 7) {
    return `${diffDays}d ago`;
  } else {
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  }
}

type Category = 'trending' | 'breaking' | 'foreign';

const categoryMap: Record<string, Category> = {
  'hot-pursuit': 'trending',
  'trending': 'trending',
  'breaking': 'breaking',
  'foreign-market': 'foreign',
};

interface MarketNewsProps {
  refetchRef?: MutableRefObject<(() => void) | null>;
}

export function MarketNews({ refetchRef }: MarketNewsProps) {
  const [selectedFilter, setSelectedFilter] = useState('hot-pursuit');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Map filter to API category
  const apiCategory = categoryMap[selectedFilter];

  // Fetch news from API
  const { data: newsData, isLoading, refetch } = useQuery({
    queryKey: ['market-news', apiCategory],
    queryFn: async () => {
      const response = await apiClient.market.news.$get({
        query: { category: apiCategory }
      });
      return response;
    },
    refetchInterval: 300000, // Refetch every 5 minutes
  });

  // Expose refetch function to parent
  useEffect(() => {
    if (refetchRef) {
      refetchRef.current = refetch;
    }
  }, [refetch, refetchRef]);

  const news = newsData?.news || [];

  // Scroll to specific index (only call this explicitly, not in effect)
  const scrollToIndex = useCallback((index: number) => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const cardWidth = container.scrollWidth / news.length;
      container.scrollTo({
        left: cardWidth * index,
        behavior: 'smooth'
      });
    }
  }, [news.length]);

  // Auto-advance swiper every 5 seconds
  useEffect(() => {
    if (news.length <= 1) return;

    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % news.length;
      setCurrentIndex(nextIndex);
      setExpandedIndex(null);
      scrollToIndex(nextIndex);
    }, 5000);

    return () => clearInterval(interval);
  }, [news.length, currentIndex, scrollToIndex]);

  // Reset to first news when category changes
  useEffect(() => {
    setCurrentIndex(0);
    setExpandedIndex(null);
    // Scroll to first item when category changes
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
    }
  }, [selectedFilter]);

  // Handle scroll to update current index (for manual swipes)
  const handleScroll = useCallback(() => {
    if (scrollContainerRef.current && news.length > 0) {
      const container = scrollContainerRef.current;
      const cardWidth = container.scrollWidth / news.length;
      const newIndex = Math.round(container.scrollLeft / cardWidth);
      if (newIndex !== currentIndex && newIndex >= 0 && newIndex < news.length) {
        setCurrentIndex(newIndex);
        setExpandedIndex(null);
      }
    }
  }, [currentIndex, news.length]);

  const currentNews = news[currentIndex];

  if (isLoading) {
    return (
      <div className="bg-transparent">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold text-gray-900">Market News</h2>
        </div>
        <div className="bg-white rounded-lg p-[9px] border border-gray-100 shadow-sm">
          <p className="text-sm text-gray-500">Loading news...</p>
        </div>
      </div>
    );
  }

  if (!currentNews) {
    return (
      <div className="bg-transparent">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold text-gray-900">Market News</h2>
        </div>
        <div className="bg-white rounded-lg p-[9px] border border-gray-100 shadow-sm">
          <p className="text-sm text-gray-500">No news available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-transparent">
      {/* Header Row */}
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-base font-semibold text-gray-900">Market News</h2>
        <div className="flex items-center gap-2">
          <ListFilter className="h-4 w-4 text-gray-500" />
          <Select value={selectedFilter} onValueChange={setSelectedFilter}>
            <SelectTrigger className="w-auto h-8 border-none shadow-none [&>svg]:hidden px-0 focus:ring-0 focus:ring-offset-0 bg-transparent hover:bg-transparent">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              <SelectItem value="hot-pursuit">Hot pursuit</SelectItem>
              <SelectItem value="trending">Trending</SelectItem>
              <SelectItem value="breaking">Breaking News</SelectItem>
              <SelectItem value="foreign-market">Foreign market</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* News Card with Swiper */}
      <div className="relative">
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          {news.map((newsItem, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-[70%] snap-start"
            >
              <div
                className="bg-white rounded-2xl px-3 py-3 shadow-md h-full cursor-pointer active:scale-[0.98] transition-transform"
                onClick={() => {
                  if (newsItem.url) {
                    window.open(newsItem.url, '_blank', 'noopener,noreferrer');
                  }
                }}
              >
                <div className="flex flex-col">
                  {/* Source and Date */}
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-medium text-blue-600">
                      {newsItem.source || 'News'}
                    </span>
                    <div className="flex items-center gap-1">
                      <span className="text-[11px] text-gray-400">
                        {newsItem.publishedAt ? formatNewsDate(newsItem.publishedAt) : ''}
                      </span>
                      {newsItem.url && <ExternalLink className="h-3 w-3 text-gray-400" />}
                    </div>
                  </div>

                  {/* Title */}
                  <div className="mb-2">
                    <p className={`text-[14px] font-medium leading-tight ${expandedIndex === index ? '' : 'line-clamp-2'}`} style={{
                      fontFamily: 'SF Pro, -apple-system, BlinkMacSystemFont, sans-serif',
                      color: '#1F2937'
                    }}>
                      {newsItem.title}
                    </p>
                  </div>

                  {/* Separator line */}
                  <div className="h-px bg-gray-200 mb-2"></div>

                  {/* Description with Read More */}
                  <div className="mb-1">
                    <p className={`text-[13px] text-gray-600 leading-relaxed ${expandedIndex === index ? '' : 'line-clamp-2'}`} style={{
                      fontFamily: 'SF Pro, -apple-system, BlinkMacSystemFont, sans-serif'
                    }}>
                      {newsItem.description}
                    </p>
                    {expandedIndex !== index && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpandedIndex(index);
                        }}
                        className="text-blue-600 hover:text-blue-700 font-medium transition-colors text-[13px] mt-1"
                      >
                        Read More
                      </button>
                    )}
                    {expandedIndex === index && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpandedIndex(null);
                        }}
                        className="text-blue-600 hover:text-blue-700 font-medium transition-colors text-[13px] mt-1"
                      >
                        Show Less
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Progress indicator dots */}
        {news.length > 1 && (
          <div className="flex justify-center gap-1.5 mt-2">
            {news.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentIndex(index);
                  setExpandedIndex(null);
                  scrollToIndex(index);
                }}
                className={`h-1.5 rounded-full transition-all ${
                  index === currentIndex
                    ? 'w-6 bg-blue-600'
                    : 'w-1.5 bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to news ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}