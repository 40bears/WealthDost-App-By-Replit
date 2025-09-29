import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { checkUsernameThrottled } from "@/sdk/auth/username";
import { useMemo, useRef, useState } from "react";
import { z } from "zod";

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
  const Schema = useMemo(() => z.object({
    fullName: z.string().min(1, "Full name is required"),
    username: z.string().min(3, "Username must be at least 3 characters"),
    profileBio: z.string().optional().or(z.literal("")),
    experienceLevel: z.enum(["beginner", "intermediate", "advanced"], { message: "Please select your experience level" }),
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
      if (usernameRef.current !== val) return; // stale response, ignore
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
      // If username currently invalid or still checking, prevent next
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
        <h2 className="text-lg font-semibold ml-2">Wealth Enthusiast Profile</h2>
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
            <Label htmlFor="username">Finance Username</Label>
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
              className={`rounded-l-none pr-9 ${usernameStatus==='available' ? 'ring-2 ring-green-500 focus:ring-green-500 ring-offset-2' : ''} ${usernameStatus==='error' ? 'ring-2 ring-red-500 focus:ring-red-500 ring-offset-2' : ''} ${usernameStatus==='warning' ? 'ring-2 ring-yellow-500 ring-offset-2' : ''}`}
              placeholder="StockGuru, CryptoWhale"
            />
            {usernameStatus === 'available' && (
              <span className="material-icons text-green-500 absolute right-2 top-1/2 -translate-y-1/2 text-base">check_circle</span>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-1">Choose a finance-themed username</p>
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
          {errors?.experienceLevel && (
            <p className="text-xs text-red-600 mt-2">{errors.experienceLevel}</p>
          )}
        </div>
      </form>

      <div className="mt-auto pb-6 safe-area-bottom">
        <Button onClick={handleNextClick} className="w-full">Next</Button>
      </div>
    </div>
  );
}
