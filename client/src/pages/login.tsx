import { useAuth } from "@/components/auth/auth-context";
import { LoginLayout } from "@/components/auth/login/LoginLayout";
import { OtpVerificationScreen } from "@/components/auth/register/OtpVerificationScreen";
import { PhoneNumberScreen } from "@/components/auth/register/PhoneNumberScreen";
import { FlowMachineProvider, useFlowMachine } from "@/components/flow/FlowMachine";
import { FlowRoute } from "@/components/flow/FlowRoute";
import { FlowRoutes } from "@/components/flow/FlowRoutes";
import { UI } from "@/ui";
import { useCallback, useState } from "react";
import { useLocation } from "wouter";

export default function Login() {
  const [, navigate] = useLocation();
  const auth = useAuth();

  const [mobileNumber, setMobileNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const updateMobile = useCallback((raw: string) => {
    setMobileNumber((raw || "").replace(/\D/g, "").slice(0, 10));
  }, []);

  const updateOtp = useCallback((raw: string) => {
    setOtp((raw || "").replace(/\D/g, "").slice(0, 6));
  }, []);

  const flow = useFlowMachine({
    initial: isOtpSent ? "otp" : "phone",
    transitions: {
      phone: { OTP_SENT: "otp" },
      otp: { BACK: "phone" },
    },
  });

  const handleSendOtp = async (e?: React.SyntheticEvent) => {
    e?.preventDefault();
    setIsLoading(true);
    try {
      // Here you would call your login OTP init API
      // For now, simulate success
      await new Promise((r) => setTimeout(r, 600));
      setIsOtpSent(true);
      UI.toast.success("OTP Sent", "We've sent a 6-digit OTP to your mobile number");
      flow.send("OTP_SENT");
    } catch (err: any) {
      UI.toast.error("Could not send OTP", err?.message || "Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Here you would verify OTP with your API
      await new Promise((r) => setTimeout(r, 600));
      await auth.login(mobileNumber || "user");
      UI.toast.success("Welcome back!", "You have been signed in.");
      navigate("/dashboard");
    } catch (err: any) {
      UI.toast.error("Invalid OTP", err?.message || "Please enter a valid 6-digit OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangeNumber = () => {
    setIsOtpSent(false);
    setOtp("");
    flow.send("BACK");
  };

  return (
    <FlowMachineProvider value={flow}>

      <FlowRoutes>
        <FlowRoute
          name="phone"
          element={
            <LoginLayout>
              <PhoneNumberScreen
                mobileNumber={mobileNumber}
                isLoading={isLoading}
                onChange={updateMobile}
                onSubmit={handleSendOtp}
              />
            </LoginLayout>
          }
        />
        <FlowRoute
          name="otp"
          element={
            <LoginLayout>
              <OtpVerificationScreen
                otp={otp}
                isLoading={isLoading}
                mobileNumber={mobileNumber}
                onChange={updateOtp}
                onSubmit={handleVerifyOtp}
                onChangeNumber={handleChangeNumber}
                onResend={handleSendOtp}
              />
            </LoginLayout>
          }
        />
      </FlowRoutes>
    </FlowMachineProvider>
  );
}
