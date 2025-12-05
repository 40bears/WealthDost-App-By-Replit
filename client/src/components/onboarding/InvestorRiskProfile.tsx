import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

type Props = {
  value: string;
  onChange: (value: string) => void;
  onBack: () => void;
  onNext: () => void;
  onSkipToDashboard: () => void;
  progress: number;
};

export function InvestorRiskProfile({ value, onChange, onBack, onNext, onSkipToDashboard, progress }: Props) {
  return (
    <div className="px-4 py-4 flex flex-col w-full h-screen overflow-auto">
      <div className="flex items-center mb-4">
        <Button variant="ghost" size="icon" onClick={onBack} className="text-gray-500">
          <span className="material-icons">arrow_back</span>
        </Button>
        <h2 className="text-lg font-semibold ml-2">Risk Profile Assessment</h2>
      </div>
      <div className="h-1 bg-gray-200 rounded mb-6">
        <div className="h-1 bg-primary rounded" style={{ width: `${progress}%` }}></div>
      </div>
      <div className="mb-6">
        <h3 className="font-semibold text-base mb-2">How do you react to market volatility & what's your return target?</h3>
        <p className="text-sm text-gray-500">This helps us understand your investment style and risk tolerance.</p>
        <RadioGroup value={value} onValueChange={onChange} className="space-y-4 mt-6">
          <div className="flex items-start p-4 bg-white border border-gray-200 rounded-xl hover:border-gray-300 cursor-pointer transition-all">
            <RadioGroupItem value="low" id="low" className="mt-1 mr-3" />
            <Label htmlFor="low" className="flex-1 cursor-pointer">
              <div className="font-medium text-base mb-1">📉 Sell immediately to avoid losses</div>
              <p className="text-sm text-gray-600 mb-3">I prefer stability and low risk investments</p>
              <div className="bg-green-50 text-green-700 text-xs py-1.5 px-3 rounded inline-flex items-center font-medium">
                <span className="material-icons text-xs mr-1">trending_up</span>
                5-8% Return Target (Safe & Steady)
              </div>
            </Label>
          </div>
          <div className="flex items-start p-4 bg-blue-50 border border-blue-200 rounded-xl hover:border-blue-300 cursor-pointer transition-all">
            <RadioGroupItem value="moderate" id="moderate" className="mt-1 mr-3" />
            <Label htmlFor="moderate" className="flex-1 cursor-pointer">
              <div className="font-medium text-base mb-1">🤷‍♂️ Hold, but get slightly anxious</div>
              <p className="text-sm text-gray-600 mb-3">I can tolerate some ups and downs</p>
              <div className="bg-blue-100 text-blue-700 text-xs py-1.5 px-3 rounded inline-flex items-center font-medium">
                <span className="material-icons text-xs mr-1">trending_up</span>
                10-15% Return Target (Balanced Growth)
              </div>
            </Label>
          </div>
          <div className="flex items-start p-4 bg-white border border-gray-200 rounded-xl hover:border-gray-300 cursor-pointer transition-all">
            <RadioGroupItem value="high" id="high" className="mt-1 mr-3" />
            <Label htmlFor="high" className="flex-1 cursor-pointer">
              <div className="font-medium text-base mb-1">🚀 Buy more! I see opportunities</div>
              <p className="text-sm text-gray-600 mb-3">I embrace volatility as a chance to profit</p>
              <div className="bg-red-50 text-red-700 text-xs py-1.5 px-3 rounded inline-flex items-center font-medium">
                <span className="material-icons text-xs mr-1">trending_up</span>
                20%+ Return Target (High-Risk, High-Reward)
              </div>
            </Label>
          </div>
        </RadioGroup>
      </div>
      <div className="mt-auto pb-6 safe-area-bottom">
        <Button onClick={onSkipToDashboard} className="w-full mb-3 bg-[#E2E8F0] text-gray-700 hover:bg-[#E2E8F0]/80">Skip to dashboard</Button>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={onBack} className="flex-1">
            <span className="material-icons mr-1 text-sm">arrow_back</span>
            Back
          </Button>
          <Button
            onClick={() => { if (!value) return; onNext(); }}
            className="flex-1"
            disabled={!value}
          >
            Next
            <span className="material-icons ml-1 text-sm">arrow_forward</span>
          </Button>
        </div>
      </div>
    </div>
  );
}