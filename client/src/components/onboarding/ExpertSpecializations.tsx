import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";

type Props = {
  selected: string[];
  onChange: (value: string, checked: boolean) => void;
  onBack: () => void;
  onNext: () => void;
  progress: number;
};

export function ExpertSpecializations({ selected, onChange, onBack, onNext, progress }: Props) {
  const isDisabled = (key: string) => selected.length >= 3 && !selected.includes(key);
  return (
    <div className="px-4 py-4 flex flex-col w-full h-screen overflow-auto">
      <div className="flex items-center mb-4">
        <Button variant="ghost" size="icon" onClick={onBack} className="text-gray-500">
          <span className="material-icons">arrow_back</span>
        </Button>
        <h2 className="text-lg font-semibold ml-2">Your Specialization</h2>
      </div>
      <Progress value={progress} className="h-1 mb-4" />
      <p className="text-gray-600 mb-4 text-sm">Select your investment specializations (up to 3):</p>
      <div className="space-y-2 mb-4 flex-1">
        {[
          { key: 'stocks', title: '📈 Stock Market & Equity Research', desc: 'Stock analysis, valuations, and market strategies' },
          { key: 'crypto', title: '🚀 Crypto & Web3', desc: 'Blockchain technology, DeFi, and token economics' },
          { key: 'privateequity', title: '🏦 Private Equity & Venture Capital', desc: 'Deal sourcing, due diligence, and portfolio management' },
          { key: 'macro', title: '🌍 Macroeconomics & Global Markets', desc: 'Economic analysis, geopolitics, and policy impacts' },
          { key: 'wealth', title: '💰 Wealth Planning & Financial Advisory', desc: 'Comprehensive financial planning and advisory services' },
          { key: 'realestate', title: '🏠 Real Estate & Alternative Investments', desc: 'Property markets, REITs, and non-traditional assets' },
        ].map(item => (
          <div key={item.key} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
            <Checkbox id={item.key} checked={selected.includes(item.key)} onCheckedChange={(c) => onChange(item.key, !!c)} className="mr-2" disabled={isDisabled(item.key)} />
            <Label htmlFor={item.key} className="flex-1 cursor-pointer">
              <span className="font-medium text-gray-800">{item.title}</span>
              <p className="text-sm text-gray-700">{item.desc}</p>
            </Label>
          </div>
        ))}
      </div>
      <div className="mt-auto flex space-x-3 pb-6 safe-area-bottom">
        <Button variant="outline" onClick={onBack} className="flex-1">Back</Button>
        <Button onClick={onNext} className="flex-1" disabled={selected.length === 0}>Next</Button>
      </div>
    </div>
  );
}

