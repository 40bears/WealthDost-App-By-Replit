import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

type FormData = {
  fullName: string;
  username: string;
  profileBio: string;
  experienceLevel: string;
};

export function InvestorBasicProfile({
  formData,
  onBack,
  onNext,
  onBasicChange,
  onExperienceLevelChange,
  progress,
}: {
  formData: FormData;
  onBack: () => void;
  onNext: () => void;
  onBasicChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onExperienceLevelChange: (value: string) => void;
  progress: number;
}) {
  return (
    <div className="px-4 py-4 flex flex-col w-full h-screen overflow-auto">
      <div className="flex items-center mb-4">
        <Button variant="ghost" size="icon" onClick={onBack} className="text-gray-500">
          <span className="material-icons">arrow_back</span>
        </Button>
        <h2 className="text-lg font-semibold ml-2">Wealth Enthusiast Profile</h2>
      </div>

      <Progress value={progress} className="h-1 mb-4" />

      <form className="space-y-4 flex-1">
        <div>
          <Label htmlFor="fullName">Full Name</Label>
          <Input id="fullName" name="fullName" value={formData.fullName} onChange={onBasicChange} className="mt-1" placeholder="Your name" />
        </div>
        <div>
          <Label htmlFor="username">Finance Username</Label>
          <div className="flex mt-1">
            <div className="bg-gray-100 flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300">
              <span className="text-gray-500">@</span>
            </div>
            <Input id="username" name="username" value={formData.username} onChange={onBasicChange} className="rounded-l-none" placeholder="StockGuru, CryptoWhale" />
          </div>
          <p className="text-xs text-gray-500 mt-1">Choose a finance-themed username</p>
        </div>
        <div>
          <Label htmlFor="profileBio">Profile Bio</Label>
          <Textarea id="profileBio" name="profileBio" value={formData.profileBio} onChange={onBasicChange} className="mt-1" placeholder="Long-term investor | Tech stocks | AI enthusiast" rows={3} />
          <p className="text-xs text-gray-500 mt-1">Optional: Add a finance-related tagline</p>
        </div>
        <div>
          <Label className="block text-sm font-medium text-gray-700 mb-3">Investment Experience Level</Label>
          <RadioGroup value={formData.experienceLevel} onValueChange={onExperienceLevelChange}>
            <div className="space-y-3">
              <div className="flex items-start p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <RadioGroupItem value="beginner" id="beginner" className="mt-0.5 mr-3" />
                <Label htmlFor="beginner" className="flex-1 cursor-pointer">
                  <span className="font-medium flex items-center">🐣 Beginner <span className="text-sm ml-1 text-gray-500">(0-2 years)</span></span>
                  <p className="text-sm text-gray-600">New to investing and learning the basics</p>
                </Label>
              </div>
              <div className="flex items-start p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <RadioGroupItem value="intermediate" id="intermediate" className="mt-0.5 mr-3" />
                <Label htmlFor="intermediate" className="flex-1 cursor-pointer">
                  <span className="font-medium flex items-center">🦅 Intermediate <span className="text-sm ml-1 text-gray-500">(2-5 years)</span></span>
                  <p className="text-sm text-gray-600">Comfortable with basic investments</p>
                </Label>
              </div>
              <div className="flex items-start p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <RadioGroupItem value="advanced" id="advanced" className="mt-0.5 mr-3" />
                <Label htmlFor="advanced" className="flex-1 cursor-pointer">
                  <span className="font-medium flex items-center">🦈 Advanced <span className="text-sm ml-1 text-gray-500">(5+ years)</span></span>
                  <p className="text-sm text-gray-600">Experienced investor familiar with complex strategies</p>
                </Label>
              </div>
            </div>
          </RadioGroup>
        </div>
      </form>

      <div className="mt-auto pb-6 safe-area-bottom">
        <Button onClick={onNext} className="w-full">Next</Button>
      </div>
    </div>
  );
}

