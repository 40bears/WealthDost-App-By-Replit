import { finalizeRegistration, initRegistration, verifyRegistration } from "@/sdk/auth/register";
import { useCallback, useState } from "react";
import { z } from "zod";

const PhoneNumberSchema = z
  .string()
  .transform((v) => (v || "").replace(/\D/g, ""))
  .refine((v) => v.length === 10, {
    message: "Please enter a valid 10-digit mobile number",
  });

export async function sendOtp(phoneNumber: string): Promise<string> {
  try {
    const parsedPhoneNumber = PhoneNumberSchema.parse(phoneNumber);
    const res: any = await initRegistration({ driver: "totp", phone: parsedPhoneNumber });
    const pendingId = res?.pendingId ?? res?.pending_id ?? res?.id;

    if (!pendingId) {
      throw new Error("Missing pendingId in response");
    }

    return String(pendingId);
  } catch (err: any) {
    if (err?.issues?.length) {
      throw new Error(err.issues[0].message);
    }
    throw err;
  }
}

const OtpSchema = z
  .string()
  .transform((v) => (v || "").replace(/\D/g, ""))
  .refine((v) => v.length === 6, {
    message: "Please enter a valid 6-digit OTP",
  });

export async function verifyOtp(otp: string, pendingId: string): Promise<void> {
  try {
    const parsedOtp = OtpSchema.parse(otp);

    if (!pendingId) {
      throw new Error("Missing verification context. Please resend OTP.");
    }

    await verifyRegistration({ driver: "totp", pendingId, code: parsedOtp });
  } catch (err: any) {
    if (err?.issues?.length) {
      throw new Error(err.issues[0].message);
    }
    throw err;
  }
}

const CreateAccountSchema = z
  .object({
    email: z.string().min(1, "Email is required").email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((v) => v.password === v.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type CreateAccountInput = z.infer<typeof CreateAccountSchema>;

export async function createAccount(
  email: string,
  password: string,
  confirmPassword: string,
  pendingId: string
): Promise<void> {
  try {
    CreateAccountSchema.parse({ email, password, confirmPassword });
    if (!pendingId) throw new Error("Missing registration context. Please verify OTP again.");
  } catch (err: any) {
    if (err?.issues?.length) {
      throw new Error(err.issues[0].message);
    }
    throw err;
  }

  const username = email.split("@")[0] || email;
  await finalizeRegistration({
    driver: "totp",
    pendingId,
    email,
    username,
    first_name: "",
    last_name: "",
    password,
    confirm_password: confirmPassword,
    additional: {},
  });
}

export interface FinalizeProfileInput {
  username: string;
  first_name: string;
  last_name?: string;
  email?: string;
  password: string;
  confirm_password: string;
  additional?: Record<string, any>;
}
export async function finalizeAccountWithProfile(pendingId: string, input: FinalizeProfileInput): Promise<void> {
  if (!pendingId) throw new Error("Missing registration context. Please verify OTP again.");
  const username = input.username || (input.email ? input.email.split('@')[0] : 'user');
  await finalizeRegistration({
    driver: "totp",
    pendingId,
    email: input.email,
    username,
    first_name: input.first_name || "",
    last_name: input.last_name || "",
    password: input.password,
    confirm_password: input.confirm_password,
    additional: input.additional || {},
  });
}

export function useCreateAccount() {
  const [mobileNumber, setMobileNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [pendingId, setPendingId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const updateMobile = useCallback((raw: string) => {
    setMobileNumber((raw || "").replace(/\D/g, "").slice(0, 10));
  }, []);

  const updateOtp = useCallback((raw: string) => {
    setOtp((raw || "").replace(/\D/g, "").slice(0, 6));
  }, []);

  const resetToMobile = useCallback(() => {
    setIsOtpVerified(false);
    setIsOtpSent(false);
    setOtp("");
  }, []);

  const sendOtpAction = useCallback(async () => {
    setIsLoading(true);
    try {
      const id = await sendOtp(mobileNumber);
      setPendingId(id);
      setIsOtpSent(true);
    } catch (err: any) {
      if (err.response.status === 409) {
        if (err.response.data.data.pendingId) {
          setPendingId(err.response.data.data.pendingId)
        }
      }
      throw err
    }
    finally {
      setIsLoading(false);
    }
  }, [mobileNumber]);

  const verifyOtpAction = useCallback(async () => {
    setIsLoading(true);
    try {
      await verifyOtp(otp, pendingId);
      setIsOtpVerified(true);
    } finally {
      setIsLoading(false);
    }
  }, [otp, pendingId]);

  const finalizeProfileAction = useCallback(async (input: FinalizeProfileInput) => {
    setIsLoading(true);
    try {
      await finalizeAccountWithProfile(pendingId, input);
    } finally {
      setIsLoading(false);
    }
  }, [pendingId]);

  return {
    // state
    mobileNumber,
    otp,
    email,
    password,
    confirmPassword,
    pendingId,
    isOtpSent,
    isOtpVerified,
    isLoading,
    // setters/updates
    updateMobile,
    updateOtp,
    setEmail,
    setPassword,
    setConfirmPassword,
    setIsOtpSent,
    setIsOtpVerified,
    resetToMobile,
    // actions
    sendOtp: sendOtpAction,
    verifyOtp: verifyOtpAction,
    finalizeProfile: finalizeProfileAction,
  } as const;
}
