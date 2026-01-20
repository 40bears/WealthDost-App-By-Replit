import { UsernameInput } from "@/components/onboarding/UsernameInput";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useMemo, useState } from "react";
import { z } from "zod";

type FormData = {
  fullName: string;
  username: string;
  profileBio: string;
  education: string;
  membershipNumber: string;
  sebiRegistrationNumber: string;
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
  const Schema = useMemo(
    () =>
      z
        .object({
          fullName: z.string().min(1, "Full name is required"),
          username: z.string().min(3, "Username must be at least 3 characters"),
          profileBio: z.string().optional().or(z.literal("")),
          education: z.string().min(1, "Please select your qualification"),
          achievements: z.array(z.string()).optional(),
        }),
    []
  );

  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [checking, setChecking] = useState(false);

  function setUsernameError(message?: string) {
    setErrors((prev) => ({ ...prev, username: message }));
  }


  function handleAchievementChecked(id: string) {
    return (checked: boolean) => onAchievementChange(id, checked);
  }

  function handleUsernameValueChange(v: string) {
    const synthetic = { target: { name: 'username', value: v } } as any;
    onBasicChange(synthetic);
  }

  function handleUsernameStatusChange(st: any, msg?: string) {
    if (st === 'checking') setChecking(true); else setChecking(false);
    if (st === 'error') setUsernameError(msg || 'Username is already taken');
    else setUsernameError(undefined);
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
          <UsernameInput
            label="Expert Username"
            value={formData.username}
            onChange={handleUsernameValueChange}
            placeholder="AlphaAnalyst, MarketMaverick"
            onStatusChange={handleUsernameStatusChange}
          />
          {errors?.username && (
            <p className="text-xs text-red-600 mt-1">{errors.username}</p>
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
              {[
                { value: "ca", label: "CA" },
                { value: "cfa", label: "CFA" },
                { value: "mba", label: "MBA Finance" },
                { value: "other", label: "Other" },
              ].map(({ value, label }) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>

          </Select>
          {errors?.education && (
            <p className="text-xs text-red-600 mt-1">{errors.education}</p>
          )}
        </div>
        <div>
          <Label htmlFor="membershipNumber">Membership Number</Label>
          <Input
            id="membershipNumber"
            name="membershipNumber"
            value={formData.membershipNumber}
            onChange={onBasicChange}
            className="mt-1"
            placeholder="Enter your membership number"
          />
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
              <div key={item.id}>
                <div className="flex items-start p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <Checkbox id={item.id} checked={formData.achievements.includes(item.id)} onCheckedChange={handleAchievementChecked(item.id)} className="mr-2 mt-0.5" />
                  <Label htmlFor={item.id} className="flex-1 cursor-pointer">{item.label}</Label>
                </div>
                {item.id === 'recognition' && formData.achievements.includes('recognition') && (
                  <div className="mt-2 p-3 border border-gray-200 rounded-lg bg-gray-50">
                    <Label htmlFor="sebiRegistrationNumber" className="text-sm text-gray-600">Regd Number :</Label>
                    <Input
                      id="sebiRegistrationNumber"
                      name="sebiRegistrationNumber"
                      value={formData.sebiRegistrationNumber}
                      onChange={onBasicChange}
                      className="mt-1 border border-gray-300 rounded-md focus-visible:ring-1 focus-visible:ring-gray-400 bg-white"
                      placeholder="Enter 12 digit registration number"
                      maxLength={12}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </form>

      <div className="mt-auto pt-6 pb-6 safe-area-bottom">
        <Button onClick={handleNextClick} className="w-full">Next</Button>
      </div>
    </div>
  );
}
