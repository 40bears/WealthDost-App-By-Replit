import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

type Props = {
  value: string;
  onChange: (value: string) => void;
  onBack: () => void;
  onNext: () => void;
  progress: number;
};

export function InvestorRiskProfile({ value, onChange, onBack, onNext, progress }: Props) {
  return (
    <div className="px-4 py-6 flex flex-col w-full">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="icon" onClick={onBack} className="text-gray-500">
          <span className="material-icons">arrow_back</span>
        </Button>
        <h2 className="text-xl font-semibold ml-2">Your Risk Preference</h2>
      </div>
      <Progress value={progress} className="h-1 mb-6" />
      <div className="bg-gray-50 p-4 rounded-xl mb-6">
        <h3 className="font-semibold mb-2">How do you react to market dips?</h3>
        <p className="text-sm text-gray-600 mb-4">This helps us create your wealth persona.</p>
        <RadioGroup value={value} onValueChange={onChange} className="space-y-4">
          <div className="flex items-start p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
            <RadioGroupItem value="low" id="low" className="mt-0.5 mr-3" />
            <Label htmlFor="low" className="flex-1 cursor-pointer">
              <div className="font-medium">🦉 Play safe! I prefer stability</div>
              <p className="text-sm text-gray-600">I prioritize capital preservation over returns</p>
              <div className="mt-2 bg-blue-100 text-blue-800 text-sm py-1 px-2 rounded inline-flex items-center">
                <span className="material-icons text-sm mr-1">trending_up</span>
                5-8% Return Target (Safe & Steady)
              </div>
            </Label>
          </div>
          <div className="flex items-start p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
            <RadioGroupItem value="moderate" id="moderate" className="mt-0.5 mr-3" />
            <Label htmlFor="moderate" className="flex-1 cursor-pointer">
              <div className="font-medium">🤷‍♂️ Hold, but get slightly anxious</div>
              <p className="text-sm text-gray-600">I can tolerate some ups and downs</p>
              <div className="mt-2 bg-yellow-100 text-yellow-800 text-sm py-1 px-2 rounded inline-flex items-center">
                <span className="material-icons text-sm mr-1">trending_up</span>
                10-15% Return Target (Balanced Growth)
              </div>
            </Label>
          </div>
          <div className="flex items-start p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
            <RadioGroupItem value="high" id="high" className="mt-0.5 mr-3" />
            <Label htmlFor="high" className="flex-1 cursor-pointer">
              <div className="font-medium">🚀 Buy more! I see opportunities</div>
              <p className="text-sm text-gray-600">I embrace volatility as a chance to profit</p>
              <div className="mt-2 bg-red-100 text-red-800 text-sm py-1 px-2 rounded inline-flex items-center">
                <span className="material-icons text-sm mr-1">trending_up</span>
                20%+ Return Target (High-Risk, High-Reward)
              </div>
            </Label>
          </div>
        </RadioGroup>
      </div>
      <div className="mt-auto flex space-x-3 pb-6 safe-area-bottom">
        <Button variant="outline" onClick={onBack} className="flex-1">Back</Button>
        {!value && (
          <span className="flex-1 text-xs text-red-600 self-center">Please select a risk preference</span>
        )}
        <Button onClick={() => { if (!value) return; onNext(); }} className="flex-1">Finish</Button>
      </div>
    </div>
  );
}