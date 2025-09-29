import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

type FormData = {
  fullName: string;
  username: string;
  profileBio: string;
  education: string;
  achievements: string[];
};

export function ExpertBasicProfile({
  formData,
  onBack,
  onNext,
  onBasicChange,
  onEducationChange,
  onAchievementChange,
  progress,
}: {
  formData: FormData;
  onBack: () => void;
  onNext: () => void;
  onBasicChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onEducationChange: (value: string) => void;
  onAchievementChange: (value: string, checked: boolean) => void;
  progress: number;
}) {
  return (
    <div className="px-4 py-4 flex flex-col w-full h-screen overflow-auto">
      <div className="flex items-center mb-4">
        <Button variant="ghost" size="icon" onClick={onBack} className="text-gray-500">
          <span className="material-icons">arrow_back</span>
        </Button>
        <h2 className="text-lg font-semibold ml-2">Expert Profile</h2>
      </div>

      <Progress value={progress} className="h-1 mb-4" />

      <form className="space-y-4 flex-1">
        <div>
          <Label htmlFor="fullName">Full Name</Label>
          <Input id="fullName" name="fullName" value={formData.fullName} onChange={onBasicChange} className="mt-1" placeholder="Your name" />
        </div>
        <div>
          <Label htmlFor="username">Expert Username</Label>
          <div className="flex mt-1">
            <div className="bg-gray-100 flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300">
              <span className="text-gray-500">@</span>
            </div>
            <Input id="username" name="username" value={formData.username} onChange={onBasicChange} className="rounded-l-none" placeholder="AlphaAnalyst, MarketMaverick" />
          </div>
          <p className="text-xs text-gray-500 mt-1">Choose a professional finance-themed username</p>
        </div>
        <div>
          <Label htmlFor="profileBio">Professional Bio</Label>
          <Textarea id="profileBio" name="profileBio" value={formData.profileBio} onChange={onBasicChange} className="mt-1" placeholder="Equity Research | Options Trader | Macro Specialist" rows={3} />
        </div>
        <div>
          <Label htmlFor="education" className="block text-sm font-medium text-gray-700 mb-1">Educational Background</Label>
          <Select value={formData.education} onValueChange={onEducationChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select your qualification" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ca">CA (Chartered Accountant)</SelectItem>
              <SelectItem value="cfa">CFA (Chartered Financial Analyst)</SelectItem>
              <SelectItem value="mba">MBA Finance (IIM/ISB/Other)</SelectItem>
              <SelectItem value="bcom">B.Com/M.Com</SelectItem>
              <SelectItem value="engineer">Finance Engineer</SelectItem>
              <SelectItem value="self">Self-Taught Market Expert</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="block text-sm font-medium text-gray-700 mb-3">Exceptional Achievements</Label>
          <div className="space-y-2">
            {[
              { id: 'tv', label: 'Featured on CNBC/ET Now' },
              { id: 'recognition', label: 'SEBI/RBI Recognized' },
              { id: 'aum', label: 'Managed ₹100Cr+ AUM' },
              { id: 'speaker', label: 'Top Finance Speaker' },
              { id: 'published', label: 'Published in Forbes/Moneycontrol' },
              { id: 'founder', label: 'Finance Startup Founder' },
            ].map(item => (
              <div key={item.id} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                <Checkbox id={item.id} checked={formData.achievements.includes(item.id)} onCheckedChange={(c) => onAchievementChange(item.id, !!c)} className="mr-2" />
                <Label htmlFor={item.id} className="flex-1 cursor-pointer">{item.label}</Label>
              </div>
            ))}
          </div>
        </div>
      </form>

      <div className="mt-auto pb-6 safe-area-bottom">
        <Button onClick={onNext} className="w-full">Next</Button>
      </div>
    </div>
  );
}

