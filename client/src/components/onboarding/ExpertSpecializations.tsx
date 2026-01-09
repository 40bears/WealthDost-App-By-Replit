import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";

type Props = {
  selected: string[];
  onChange: (value: string, checked: boolean) => void;
  onBack: () => void;
  onNext: () => void;
  progress: number;
};

export function ExpertSpecializations({ selected, onChange, onBack, onNext, progress }: Props) {
  const [showError, setShowError] = useState(false);
  const [otherText, setOtherText] = useState("");
  const items = [
    { key: 'stocks', title: '📈 Stock Market & Equity Research', desc: 'Stock analysis, valuations, and market strategies' },
    { key: 'crypto', title: '🚀 Crypto & Web3', desc: 'Blockchain technology, DeFi, and token economics' },
    { key: 'privateequity', title: '🏦 Private Equity & Venture Capital', desc: 'Deal sourcing, due diligence, and portfolio management' },
    { key: 'macro', title: '🌍 Macroeconomics & Global Markets', desc: 'Economic analysis, geopolitics, and policy impacts' },
    { key: 'wealth', title: '💰 Wealth Planning & Financial Advisory', desc: 'Comprehensive financial planning and advisory services' },
    { key: 'realestate', title: '🏠 Real Estate & Alternative Investments', desc: 'Property markets, REITs, and non-traditional assets' },
    { key: 'other', title: '📝 Other - Please specify', desc: 'Specify your specialization area' },
  ];

  const isDisabled = (key: string) => selected.length >= 3 && !selected.includes(key);

  const handleNext = () => {
    if (selected.length === 0) {
      setShowError(true);
      return;
    }
    onNext();
  };

  const handleSelectAll = () => {
    // Select first 3 items if none selected
    const toSelect = items.slice(0, 3);
    toSelect.forEach(item => {
      if (!selected.includes(item.key)) {
        onChange(item.key, true);
      }
    });
  };

  const handleClearAll = () => {
    items.forEach(item => {
      if (selected.includes(item.key)) {
        onChange(item.key, false);
      }
    });
  };

  return (
    <div className="px-4 py-4 flex flex-col w-full h-screen overflow-auto">
      <div className="flex items-center mb-4">
        <Button variant="ghost" size="icon" onClick={onBack} className="text-gray-500">
          <span className="material-icons">arrow_back</span>
        </Button>
        <h2 className="text-lg font-semibold ml-2">Your Specialization</h2>
      </div>
      <Progress value={progress} className="h-1 mb-4" />
      <div className="flex items-center justify-between mb-4 gap-2">
        <p className="text-gray-600 text-sm flex-shrink">Select specializations (up to 3):</p>
        <div className="flex gap-2 flex-shrink-0">
          <button type="button" onClick={handleSelectAll} className="text-xs text-primary hover:underline">Select All</button>
          <span className="text-gray-300">|</span>
          <button type="button" onClick={handleClearAll} className="text-xs text-primary hover:underline">Clear All</button>
        </div>
      </div>
      <div className="space-y-2 mb-4 flex-1">
        {items.map(item => (
          <div key={item.key}>
            <div className="flex items-start p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
              <Checkbox id={item.key} checked={selected.includes(item.key)} onCheckedChange={(c) => onChange(item.key, !!c)} className="mr-2 mt-0.5" disabled={isDisabled(item.key)} />
              <Label htmlFor={item.key} className="flex-1 cursor-pointer">
                <span className="font-medium text-gray-800">{item.title}</span>
                <p className="text-sm text-gray-700">{item.desc}</p>
              </Label>
            </div>
            {/* Show input field if "Other" is selected */}
            {item.key === 'other' && selected.includes('other') && (
              <div className="mt-2 ml-6">
                <input
                  type="text"
                  value={otherText}
                  onChange={(e) => setOtherText(e.target.value)}
                  placeholder="Please specify your specialization"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            )}
          </div>
        ))}
      </div>
      {showError && selected.length === 0 && (
        <p className="text-xs text-red-600 mb-2">Select at least one specialization</p>
      )}
      <div className="mt-auto flex space-x-3 pb-6 safe-area-bottom">
        <Button variant="outline" onClick={onBack} className="flex-1">Back</Button>
        <Button onClick={handleNext} className="flex-1">Next</Button>
      </div>
    </div>
  );
}
