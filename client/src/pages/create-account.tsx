import { ChooseRoleScreen } from "@/components/auth/register/ChooseRoleScreen";
import { OtpVerificationScreen } from "@/components/auth/register/OtpVerificationScreen";
import { PhoneNumberScreen } from "@/components/auth/register/PhoneNumberScreen";
import { SignupLayout } from "@/components/auth/register/SignupLayout";
import { FlowMachineProvider, useFlowMachine } from "@/components/flow/FlowMachine";
import { FlowRoute } from "@/components/flow/FlowRoute";
import { FlowRoutes } from "@/components/flow/FlowRoutes";
import { ExpertOnboarding } from "@/components/onboarding/ExpertOnboarding";
import { InvestorOnboarding } from "@/components/onboarding/InvestorOnboarding";
import { type Role as ChosenRole } from "@/components/onboarding/RoleSelection";
import { useAuth } from "@/hooks/useAuth";
import { useCreateAccount } from "@/sdk/auth/create-account";
import { UI } from "@/ui";
import { useEffect, useState } from "react";
import { useNavigate, useSearch } from "@tanstack/react-router";

export default function CreateAccount() {
  const navigate = useNavigate();
  const search = useSearch({ from: '/' });
  const auth = useAuth();
  const {
    mobileNumber,
    otp,
    isOtpSent,
    isOtpVerified,
    isLoading,
    pendingId,
    updateMobile,
    updateOtp,
    setIsOtpSent,
    sendOtp: sendOtpAction,
    verifyOtp: verifyOtpAction,
    finalizeProfile,
  } = useCreateAccount();
  const toast = UI.toast;

  // Check if user is already logged in and redirect accordingly
  useEffect(() => {
    if (auth.isAuthenticated && !auth.isLoading) {
      const redirectUrl = (search as any)?.redirect || '/dashboard';
      navigate({ to: redirectUrl });
    }
  }, [auth.isAuthenticated, auth.isLoading, search, navigate]);

  const flow = useFlowMachine({
    initial: isOtpVerified ? "role" : isOtpSent ? "otp" : "phone",
    transitions: {
      phone: { OTP_SENT: "otp" },
      otp: { OTP_VERIFIED: "role", BACK: "phone" },
      role: {},
      investor: {},
      expert: {},
    },
  });

  type Role = ChosenRole | null;
  const [role, setRole] = useState<Role>(() => {
    const saved = typeof window !== 'undefined' ? window.localStorage.getItem('signup.role') : null;
    return (saved === 'investor' || saved === 'expert') ? saved : null;
  });

  const handleRoleSelect = (selected: ChosenRole | null) => {
    setRole(selected);
    try { window.localStorage.setItem('signup.role', selected || ''); } catch { }
    if (selected === 'investor') flow.go('investor');
    if (selected === 'expert') flow.go('expert');
  };

  const handleSendOtp = async (e?: React.SyntheticEvent) => {
    e?.preventDefault();
    try {
      await sendOtpAction();
      toast.success("OTP Sent", "We've sent a 6-digit OTP to your mobile number");
      flow.send("OTP_SENT");
    } catch (err: any) {
      if (err.response.status === 409) {
        if (err.response.data.data.pendingId) {
          flow.send("OTP_SENT");
          return
        }

        toast.error(err.response.data.message);

        return
      }
      toast.error("Invalid Mobile Number", err?.message || "Please enter a valid 10-digit mobile number");
    }
  };

  const handleVerifyOtp = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      const response = await verifyOtpAction();
      if (response?.flow === 'login' && response.user) {
        auth.login(response.user);
        navigate({ to: '/dashboard' });
        return;
      }
      toast.success("Phone Verified", "Choose your role to continue");
      flow.send("OTP_VERIFIED");
    } catch (err: any) {
      toast.error("Invalid OTP", err?.message || "Please enter a valid 6-digit OTP");
    }
  };

  // Explicit handlers to replace inline callbacks
  const handleChangeNumber = () => {
    setIsOtpSent(false);
    flow.send("BACK");
  };

  const handleInvestorBack = () => {
    setRole(null);
    try {
      window.localStorage.removeItem('signup.role');
    } catch { }
    flow.go('role');
  };

  const handleExpertBack = () => {
    setRole(null);
    try {
      window.localStorage.removeItem('signup.role');
    } catch { }
    flow.go('role');
  };

  const handleInvestorComplete = async (data: any) => {
    try {
      const [first_name = "", ...rest] = (data.fullName || "").split(" ");
      const last_name = rest.join(" ");
      await finalizeProfile({
        username: data.username,
        email: data.email,
        first_name,
        last_name,
        password: data.password,
        confirm_password: data.confirmPassword,
        additional: {
          role: 'investor',
          investor: data,
          phone: mobileNumber,
          pendingId,
        },
      });
      UI.toast.success('Welcome!', 'Your account is ready.');
      navigate({ to: '/dashboard' });
    } catch (err: any) {
      UI.toast.error('Could not create account', err?.message || 'Please try again.');
    }
  };

  const handleExpertComplete = async (data: any) => {
    try {
      const [first_name = "", ...rest] = (data.fullName || "").split(" ");
      const last_name = rest.join(" ");
      await finalizeProfile({
        username: data.username,
        first_name,
        last_name,
        password: data.password || undefined,
        confirm_password: data.confirm_password || undefined,
        additional: {
          role: 'expert',
          expert: data,
          phone: mobileNumber,
          pendingId,
        },
      });
      UI.toast.success('Welcome!', 'Your account is ready.');
      navigate({ to: '/dashboard' });
    } catch (err: any) {
      UI.toast.error('Could not create account', err?.message || 'Please try again.');
    }
  };

  return (
    <FlowMachineProvider value={flow}>

      <FlowRoutes>
        <FlowRoute
          name="phone"
          element={
            <SignupLayout>
              <PhoneNumberScreen
                mobileNumber={mobileNumber}
                isLoading={isLoading}
                onChange={updateMobile}
                onSubmit={handleSendOtp}
              />
            </SignupLayout>

          }
        />
        <FlowRoute
          name="otp"
          element={
            <SignupLayout>
              <OtpVerificationScreen
                otp={otp}
                isLoading={isLoading}
                mobileNumber={mobileNumber}
                onChange={updateOtp}
                onSubmit={handleVerifyOtp}
                onChangeNumber={handleChangeNumber}
                onResend={handleSendOtp}
              />
            </SignupLayout>
          }
        />
        <FlowRoute
          name="role"
          element={<ChooseRoleScreen role={role} onSelect={handleRoleSelect} />}
        />
        <FlowRoute
          name="investor"
          element={<InvestorOnboarding onBack={handleInvestorBack} onComplete={handleInvestorComplete} />}
        />
        <FlowRoute
          name="expert"
          element={<ExpertOnboarding onBack={handleExpertBack} onComplete={handleExpertComplete} />}
        />
      </FlowRoutes>

    </FlowMachineProvider>
  );
}
