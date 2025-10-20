import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { useMemo, useState } from "react";
import { z } from "zod";
import { PasswordInput } from "./PasswordInput";
import { UsernameInput } from "./UsernameInput";

type FormData = {
  fullName: string;
  username: string;
  profileBio: string;
  password: string;
  confirmPassword: string;
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
  const Schema = useMemo(
    () =>
      z
        .object({
          fullName: z.string().min(1, "Full name is required"),
          username: z.string().min(3, "Username must be at least 3 characters"),
          profileBio: z.string().optional().or(z.literal("")),
          experienceLevel: z.enum(["beginner", "intermediate", "advanced"], {
            message: "Please select your experience level",
          }),
          password: z.string().min(1, "Password is required"),
          confirmPassword: z.string().min(1, "Please confirm your password"),
        })
        .refine((v) => v.password === v.confirmPassword, {
          message: "Passwords do not match",
          path: ["confirmPassword"],
        }),
    []
  );

  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [checking, setChecking] = useState(false);


  function setUsernameError(message?: string) {
    setErrors((prev) => ({ ...prev, username: message }));
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

  function handlePasswordChange(v: string) {
    const synthetic = { target: { name: 'password', value: v } } as any;
    onBasicChange(synthetic);
  }

  function handleConfirmPasswordChange(v: string) {
    const synthetic = { target: { name: 'confirmPassword', value: v } } as any;
    onBasicChange(synthetic);
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
        <UsernameInput
          label="Finance Username"
          value={formData.username}
          onChange={handleUsernameValueChange}
          placeholder="StockGuru, CryptoWhale"
          onStatusChange={handleUsernameStatusChange}
        />
        <div>
          <Label htmlFor="profileBio">Profile Bio</Label>
          <Textarea id="profileBio" name="profileBio" value={formData.profileBio} onChange={onBasicChange} className="mt-1" placeholder="Long-term investor | Tech stocks | AI enthusiast" rows={3} />
          <p className="text-xs text-gray-500 mt-1">Optional: Add a finance-related tagline</p>
        </div>
        <div>
          <PasswordInput
            id="password"
            name="password"
            label="Password"
            placeholder="Create a strong password"
            value={formData.password}
            error={errors?.password}
            onChange={(v) => handlePasswordChange(v)}
          />
        </div>
        <div>
          <PasswordInput
            id="confirmPassword"
            name="confirmPassword"
            label="Confirm Password"
            placeholder="Re-enter password"
            value={formData.confirmPassword}
            error={errors?.confirmPassword}
            onChange={(v) => handleConfirmPasswordChange(v)}
          />
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
