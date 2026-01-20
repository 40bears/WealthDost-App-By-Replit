import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";

type Props = {
  selected: string[];
  onChange: (value: string, checked: boolean) => void;
  onBack: () => void;
  onNext: () => void;
  onSkipToDashboard: () => void;
  progress: number;
};

export function InvestorContentPreferences({ selected, onChange, onBack, onNext, onSkipToDashboard, progress }: Props) {
  const [showError, setShowError] = useState(false);
  const [isOtherSelected, setIsOtherSelected] = useState(false);
  const [otherText, setOtherText] = useState('');

  const handleOtherCheck = (checked: boolean) => {
    setIsOtherSelected(checked);
    if (!checked) {
      setOtherText('');
    }
  };

  const handleNext = () => {
    if (selected.length === 0 && !isOtherSelected) {
      setShowError(true);
      return;
    }
    // Add otherText to interests if provided
    if (isOtherSelected && otherText.trim()) {
      onChange(otherText.trim(), true);
    }
    onNext();
  };
  const items = [
    { key: 'stocks', title: '📈 Stock Market', desc: 'Learn how stocks move and why companies matter' },
    { key: 'macro', title: '🌍 Macroeconomics', desc: 'How the economy, rates and global events affect you' },
    { key: 'wealth', title: '🛡️ Wealth Planning & Insurance', desc: 'Plan goals, stay protected and reduce money stress' },
    { key: 'taxation', title: '📋 Taxation & Compliance', desc: 'Understand taxes and avoid costly mistakes' },
    { key: 'private', title: '🏢 Private Markets', desc: 'Startups, private investments and how deals work' },
    { key: 'crypto', title: '🚀 Crypto & Web3', desc: 'Crypto basics, trends and real risks' },
    { key: 'personal', title: '💰 Personal Finance', desc: 'Save better, spend smarter and build habits', optional: true },
  ];

  const handleSelectAll = () => {
    items.forEach(item => {
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
        <h2 className="text-lg font-semibold ml-2">Pick your money interests</h2>
      </div>
      <Progress value={progress} className="h-1 mb-4" />
      <div className="flex items-center justify-between mb-4">
        <p className="text-gray-600 text-sm">Select topics you're interested in:</p>
        <div className="flex gap-2">
          <button type="button" onClick={handleSelectAll} className="text-xs text-primary hover:underline">Select All</button>
          <span className="text-gray-300">|</span>
          <button type="button" onClick={handleClearAll} className="text-xs text-primary hover:underline">Clear All</button>
        </div>
      </div>
      <div className="space-y-2 mb-4 flex-1">
        {items.map(item => (
          <div key={item.key} className="flex items-start p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
            <Checkbox id={item.key} checked={selected.includes(item.key)} onCheckedChange={(c) => onChange(item.key, !!c)} className="mr-2 mt-0.5" />
            <Label htmlFor={item.key} className="flex-1 cursor-pointer">
              <span className="font-medium text-gray-800">{item.title}</span>
              <p className="text-sm text-gray-700">{item.desc}</p>
            </Label>
          </div>
        ))}
        {/* Other option with text box */}
        <div className="flex flex-col p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
          <div className="flex items-start">
            <Checkbox id="other" checked={isOtherSelected} onCheckedChange={(c) => handleOtherCheck(!!c)} className="mr-2 mt-0.5" />
            <Label htmlFor="other" className="flex-1 cursor-pointer">
              <span className="font-medium text-gray-800">✨ Other</span>
            </Label>
          </div>
          {isOtherSelected && (
            <Input
              placeholder="Tell us what interests you..."
              value={otherText}
              onChange={(e) => setOtherText(e.target.value)}
              className="mt-2 w-full"
            />
          )}
        </div>
      </div>
      {showError && selected.length === 0 && (
        <p className="text-xs text-red-600 mb-2">Select at least one topic</p>
      )}
      <div className="mt-auto pb-6 safe-area-bottom">
        <Button onClick={onSkipToDashboard} className="w-full mb-3 bg-[#E2E8F0] text-gray-700 hover:bg-[#E2E8F0]/80">Skip to dashboard</Button>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={onBack} className="flex-1">Back</Button>
          <Button onClick={handleNext} className="flex-1">Next</Button>
        </div>
      </div>
    </div>
  );
}
