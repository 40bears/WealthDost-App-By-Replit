import { Button } from "@/components/ui/button";
import { useState, useMemo } from "react";
import { useMasterHashtags } from "@/hooks/graphql/useHashtags";

type Props = {
  selected: string[];
  onChange: (value: string, checked: boolean) => void;
  onBack: () => void;
  onNext: () => void;
  onSkipToDashboard: () => void;
  progress: number;
};

export function InvestorTopics({ selected, onChange, onBack, onNext, onSkipToDashboard, progress }: Props) {
  const [showError, setShowError] = useState(false);
  const { data } = useMasterHashtags();

  // Fallback to hardcoded tags if query fails or is loading
  const fallbackTags = [
    '#ValueInvestor', '#GrowthInvestor', '#DividendInvestor', '#SwingTrader',
    '#LongTermInvestor', '#ESGInvestor', '#DayTrader', '#CryptoInvestor',
    '#TechStocks', '#BlueChip', '#SmallCap', '#MidCap', '#LargeCap',
    '#MomentumTrading', '#Contrarian', '#IndexFunds', '#OptionsTrading',
    '#RealEstate', '#Commodities', '#Forex', '#PennyStocks', '#International',
    '#SectorRotation', '#IncomeInvesting'
  ];

  const tags = useMemo(() => {
    if (data?.masterHashtags && data.masterHashtags.length > 0) {
      // Add # prefix to tags from API if not already present
      return data.masterHashtags.map((hashtag: { tag: string }) =>
        hashtag.tag.startsWith('#') ? hashtag.tag : `#${hashtag.tag}`
      );
    }
    return fallbackTags;
  }, [data]);

  const toggleTag = (tag: string) => {
    const isSelected = selected.includes(tag);
    onChange(tag, !isSelected);
  };

  const handleSelectAll = () => {
    tags.forEach((tag: string) => {
      if (!selected.includes(tag)) {
        onChange(tag, true);
      }
    });
  };

  const handleClearAll = () => {
    tags.forEach((tag: string) => {
      if (selected.includes(tag)) {
        onChange(tag, false);
      }
    });
  };

  return (
    <div className="px-4 py-4 flex flex-col w-full h-screen overflow-auto">
      <div className="flex items-center mb-4">
        <Button variant="ghost" size="icon" onClick={onBack} className="text-gray-500">
          <span className="material-icons">arrow_back</span>
        </Button>
        <h2 className="text-lg font-semibold ml-2">Topics you might be interested in</h2>
      </div>
      <div className="h-1 bg-gray-200 rounded mb-4">
        <div className="h-1 bg-primary rounded" style={{ width: `${progress}%` }}></div>
      </div>
      <div className="flex items-center justify-between mb-4 gap-2">
        <p className="text-gray-600 text-sm flex-shrink">Select tags:</p>
        <div className="flex gap-2 flex-shrink-0">
          <button type="button" onClick={handleSelectAll} className="text-xs text-primary hover:underline">Select All</button>
          <span className="text-gray-300">|</span>
          <button type="button" onClick={handleClearAll} className="text-xs text-primary hover:underline">Clear All</button>
        </div>
      </div>
      <div className="flex flex-wrap gap-3 mb-4 flex-1">
        {tags.map((tag: string) => (
          <button
            key={tag}
            onClick={() => toggleTag(tag)}
            className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
              selected.includes(tag)
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>
      <div className="text-center text-sm text-gray-500 mb-4">
        {selected.length} {selected.length === 1 ? 'tag' : 'tags'} selected
      </div>
      {showError && selected.length < 3 && (
        <p className="text-xs text-red-600 mb-2">Select at least 3 tags</p>
      )}
      <div className="mt-auto pb-6 safe-area-bottom">
        <Button onClick={onSkipToDashboard} className="w-full mb-3 bg-[#E2E8F0] text-gray-700 hover:bg-[#E2E8F0]/80">Skip to dashboard</Button>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={onBack} className="flex-1">Back</Button>
          <Button onClick={() => { if (selected.length < 3) { setShowError(true); return; } onNext(); }} className="flex-1">Next</Button>
        </div>
      </div>
    </div>
  );
}