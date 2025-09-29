import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useMemo, useRef, useState } from "react";
import { z } from "zod";
import { checkUsernameThrottled } from "@/sdk/auth/username";

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
  const Schema = useMemo(() => z.object({
    fullName: z.string().min(1, "Full name is required"),
    username: z.string().min(3, "Username must be at least 3 characters"),
    profileBio: z.string().optional().or(z.literal("")),
    education: z.string().optional().or(z.literal("")),
    achievements: z.array(z.string()).optional(),
  }), []);

  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [checking, setChecking] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState<'idle'|'checking'|'available'|'error'|'warning'>("idle");
  const [usernameMessage, setUsernameMessage] = useState<string | undefined>(undefined);
  const usernameRef = useRef("");

  function setUsernameError(message?: string) {
    setErrors((prev) => ({ ...prev, username: message }));
  }

  async function handleUsernameChange(e: React.ChangeEvent<HTMLInputElement>) {
    onBasicChange(e);
    const val = (e.target.value || "").trim().toLowerCase();
    usernameRef.current = val;
    setUsernameError(undefined);
    setUsernameMessage(undefined);
    if (val.length < 3) {
      setChecking(false);
      setUsernameStatus('warning');
      setUsernameMessage('At least 3 characters required');
      return;
    }
    setChecking(true);
    setUsernameStatus('checking');
    try {
      const { available } = await checkUsernameThrottled(val);
      if (usernameRef.current !== val) return;
      setChecking(false);
      if (!available) {
        setUsernameError("Username is already taken");
        setUsernameStatus('error');
        setUsernameMessage('Username is already taken');
      } else {
        setUsernameError(undefined);
        setUsernameStatus('available');
        setUsernameMessage('Username available');
      }
    } catch (_) {
      if (usernameRef.current !== val) return;
      setChecking(false);
      setUsernameError("Could not validate username. Please try again.");
      setUsernameStatus('warning');
      setUsernameMessage('Could not validate username. Please try again.');
    }
  }

  const handleNextClick = async () => {
    const validation = Schema.safeParse(formData as any);
    if (validation.success) {
      if (checking) {
        setErrors((prev) => ({ ...prev, username: prev.username || "Validating username, please wait..." }));
        return;
      }
      if (errors.username) {
        return;
      }
      setErrors({});
      onNext();
      return;
    }
    const byField: any = {};
    for (const issue of validation.error.issues) {
      const path = issue.path?.[0] as string | undefined;
      if (path) byField[path] = issue.message;
    }
    setErrors(byField);
  };
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
          {errors?.fullName && (
            <p className="text-xs text-red-600 mt-1">{errors.fullName}</p>
          )}
        </div>
        <div>
          <div className="flex items-center justify-between">
            <Label htmlFor="username">Expert Username</Label>
            {checking && (
              <span className="flex items-center gap-1 text-xs text-gray-500">
                <span className="w-3 h-3 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></span>
                Checking
              </span>
            )}
          </div>
          <div className="flex mt-1 relative w-full">
            <div className="bg-gray-100 flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300">
              <span className="text-gray-500">@</span>
            </div>
            <Input
              id="username"
              name="username"
              value={formData.username}
              onChange={handleUsernameChange}
              className={`rounded-l-none pr-9 ${usernameStatus==='available' ? 'ring-2 ring-green-500 ring-offset-2' : ''} ${usernameStatus==='error' ? 'ring-2 ring-red-500 ring-offset-2' : ''} ${usernameStatus==='warning' ? 'ring-2 ring-yellow-500 ring-offset-2' : ''}`}
              placeholder="AlphaAnalyst, MarketMaverick"
            />
            {usernameStatus === 'available' && (
              <span className="material-icons text-green-500 absolute right-2 top-1/2 -translate-y-1/2 text-base">check_circle</span>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-1">Choose a professional finance-themed username</p>
          {usernameStatus === 'available' && usernameMessage && (
            <p className="text-xs text-green-600 mt-1">{usernameMessage}</p>
          )}
          {usernameStatus === 'warning' && usernameMessage && (
            <p className="text-xs text-yellow-600 mt-1">{usernameMessage}</p>
          )}
          {(usernameStatus === 'error' || errors?.username) && (
            <p className="text-xs text-red-600 mt-1">{errors.username || usernameMessage}</p>
          )}
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
        <Button onClick={handleNextClick} className="w-full">Next</Button>
      </div>
    </div>
  );
}
