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

export function InvestorContentPreferences({ selected, onChange, onBack, onNext, progress }: Props) {
  const [showError, setShowError] = useState(false);
  const items = [
    { key: 'stocks', title: '📈 Stock Market', desc: 'Equities, indices, and market analysis' },
    { key: 'crypto', title: '🚀 Crypto & Web3', desc: 'Blockchain and digital assets' },
    { key: 'realestate', title: '🏠 Real Estate', desc: 'Property markets and REITs' },
    { key: 'macro', title: '🌍 Macroeconomics', desc: 'Global trends and policy impacts' },
    { key: 'personal', title: '💰 Personal Finance', desc: 'Budgeting, saving, and wealth planning' },
  ];
  return (
    <div className="px-4 py-4 flex flex-col w-full h-screen overflow-auto">
      <div className="flex items-center mb-4">
        <Button variant="ghost" size="icon" onClick={onBack} className="text-gray-500">
          <span className="material-icons">arrow_back</span>
        </Button>
        <h2 className="text-lg font-semibold ml-2">Content Preferences</h2>
      </div>
      <Progress value={progress} className="h-1 mb-4" />
      <p className="text-gray-600 mb-4 text-sm">Select topics you're interested in:</p>
      <div className="space-y-2 mb-4 flex-1">
        {items.map(item => (
          <div key={item.key} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
            <Checkbox id={item.key} checked={selected.includes(item.key)} onCheckedChange={(c) => onChange(item.key, !!c)} className="mr-2" />
            <Label htmlFor={item.key} className="flex-1 cursor-pointer">
              <span className="font-medium text-gray-800">{item.title}</span>
              <p className="text-sm text-gray-700">{item.desc}</p>
            </Label>
          </div>
        ))}
      </div>
      {showError && selected.length === 0 && (
        <p className="text-xs text-red-600 mb-2">Select at least one topic</p>
      )}
      <div className="mt-auto flex space-x-3 pb-6 safe-area-bottom">
        <Button variant="outline" onClick={onBack} className="flex-1">Back</Button>
        <Button onClick={() => { if (selected.length === 0) { setShowError(true); return; } onNext(); }} className="flex-1">Next</Button>
      </div>
    </div>
  );
}
