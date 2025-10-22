import { useState } from 'react';
import { ListFilter } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface NewsItem {
  id: string;
  content: string;
}

const mockNews: NewsItem = {
  id: '1',
  content: 'This Metro City Records 15,100 Home Sales in Q2 2025, Capturing 16% of India\'s Housing Demand...',
};

export function MarketNews() {
  const [selectedCategory, setSelectedCategory] = useState('hot-pursuit');
  const [isExpanded, setIsExpanded] = useState(false);

  const fullContent = 'This Metro City Records 15,100 Home Sales in Q2 2025, Capturing 16% of India\'s Housing Demand. The real estate market continues to show strong growth with increasing buyer interest across major metropolitan areas. Industry experts predict sustained momentum through the remainder of the year.';
  
  const displayContent = isExpanded ? fullContent : mockNews.content;

  return (
    <div className="bg-transparent">
      {/* Header Row */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-semibold text-gray-900">Market News</h2>
        <div className="flex items-center gap-2">
          <ListFilter className="h-4 w-4 text-gray-500" />
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
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

      {/* News Card */}
      <div className="bg-white rounded-lg p-[9px] border border-gray-100 shadow-sm">
        <p className="text-sm text-gray-700 leading-relaxed">
          {displayContent}
          {!isExpanded && (
            <button
              onClick={() => setIsExpanded(true)}
              className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
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
    </div>
  );
}