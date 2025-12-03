import { useState, useEffect } from 'react';
import { ListFilter } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type Category = 'trending' | 'breaking' | 'foreign';

const categoryMap: Record<string, Category> = {
  'hot-pursuit': 'trending',
  'trending': 'trending',
  'breaking': 'breaking',
  'foreign-market': 'foreign',
};

export function MarketNews() {
  const [selectedFilter, setSelectedFilter] = useState('hot-pursuit');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);

  // Map filter to API category
  const apiCategory = categoryMap[selectedFilter];

  // Fetch news from API
  const { data: newsData, isLoading } = useQuery({
    queryKey: ['market-news', apiCategory],
    queryFn: async () => {
      const response = await apiClient.market.news.$get({
        query: { category: apiCategory }
      });
      return response;
    },
    refetchInterval: 300000, // Refetch every 5 minutes
  });

  const news = newsData?.news || [];

  // Auto-advance swiper every 5 seconds
  useEffect(() => {
    if (news.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % news.length);
      setIsExpanded(false); // Reset expansion when changing news
    }, 5000);

    return () => clearInterval(interval);
  }, [news.length]);

  // Reset to first news when category changes
  useEffect(() => {
    setCurrentIndex(0);
    setIsExpanded(false);
  }, [selectedFilter]);

  const currentNews = news[currentIndex];
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

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

  const displayContent = isExpanded
    ? currentNews.description
    : truncateText(currentNews.title, 100);

  return (
    <div className="bg-transparent">
      {/* Header Row */}
      <div className="flex items-center justify-between mb-3">
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
        <div className="bg-white rounded-lg p-[9px] border border-gray-100 shadow-sm">
          <div className="flex items-start justify-between gap-2 mb-2">
            <p className="text-sm text-gray-700 leading-relaxed flex-1">
              {displayContent}
              {!isExpanded && currentNews.description.length > 100 && (
                <button
                  onClick={() => setIsExpanded(true)}
                  className="ml-1 text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  (Read More)
                </button>
              )}
              {isExpanded && (
                <button
                  onClick={() => setIsExpanded(false)}
                  className="ml-1 text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  Show Less
                </button>
              )}
            </p>
          </div>

          {/* Progress indicator dots */}
          {news.length > 1 && (
            <div className="flex justify-center gap-1.5 mt-2">
              {news.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentIndex(index);
                    setIsExpanded(false);
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
    </div>
  );
}