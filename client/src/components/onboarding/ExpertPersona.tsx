import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState } from "react";

type Props = {
  value: string;
  onChange: (value: string) => void;
  onBack: () => void;
  onNext: () => void;
  progress: number;
};

export function ExpertPersona({ value, onChange, onBack, onNext, progress }: Props) {
  const [showError, setShowError] = useState(false);
  return (
    <div className="px-4 py-6 flex flex-col w-full">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="icon" onClick={onBack} className="text-gray-500">
          <span className="material-icons">arrow_back</span>
        </Button>
        <h2 className="text-xl font-semibold ml-2">Your Expert Approach</h2>
      </div>
      <Progress value={progress} className="h-1 mb-6" />
      <div className="bg-gray-50 p-4 rounded-xl mb-6">
        <h3 className="font-semibold mb-2">How do you approach investment research?</h3>
        <p className="text-sm text-gray-600 mb-4">This helps us match you with the right audience.</p>
        <RadioGroup value={value} onValueChange={onChange} className="space-y-4">
          <div className="flex items-start p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
            <RadioGroupItem value="owl" id="owl" className="mt-0.5 mr-3" />
            <Label htmlFor="owl" className="flex-1 cursor-pointer">
              <div className="font-medium">🦉 The Wise Owl</div>
              <p className="text-sm text-gray-600">Focus on long-term fundamentals, value investing, and comprehensive research. Less concerned with short-term fluctuations.</p>
              <div className="mt-2 inline-block bg-blue-100 text-blue-800 text-sm py-1 px-2 rounded">Long-Term Value Expert</div>
            </Label>
          </div>
          <div className="flex items-start p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
            <RadioGroupItem value="fox" id="fox" className="mt-0.5 mr-3" />
            <Label htmlFor="fox" className="flex-1 cursor-pointer">
              <div className="font-medium">🦊 The Strategic Fox</div>
              <p className="text-sm text-gray-600">Balance fundamental analysis with technical indicators. Adapt strategies based on market conditions.</p>
              <div className="mt-2 inline-block bg-yellow-100 text-yellow-800 text-sm py-1 px-2 rounded">Balanced Approach Expert</div>
            </Label>
          </div>
          <div className="flex items-start p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
            <RadioGroupItem value="shark" id="shark" className="mt-0.5 mr-3" />
            <Label htmlFor="shark" className="flex-1 cursor-pointer">
              <div className="font-medium">🦈 The Bold Shark</div>
              <p className="text-sm text-gray-600">Focus on high-growth opportunities, emerging trends, and contrarian strategies. Comfortable with volatility and higher risk.</p>
              <div className="mt-2 inline-block bg-red-100 text-red-800 text-sm py-1 px-2 rounded">Growth & Trading Expert</div>
            </Label>
          </div>
        </RadioGroup>
      </div>
      {showError && !value && (
        <p className="text-xs text-red-600 mb-4">Select an expert persona to continue</p>
      )}
      <div className="mt-auto pt-6 pb-6 safe-area-bottom">
        <Button onClick={() => { if (!value) { setShowError(true); return; } onNext(); }} className="w-full">Create Expert Profile</Button>
      </div>
    </div>
  );
}
