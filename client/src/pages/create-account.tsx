import { ChooseRoleScreen } from "@/components/auth/register/ChooseRoleScreen";
import { OtpVerificationScreen } from "@/components/auth/register/OtpVerificationScreen";
import { PhoneNumberScreen } from "@/components/auth/register/PhoneNumberScreen";
import { SignupLayout1 } from "@/components/auth/register/SignupLayout1";
import { FlowMachineProvider, useFlowMachine } from "@/components/flow/FlowMachine";
import { FlowRoute } from "@/components/flow/FlowRoute";
import { FlowRoutes } from "@/components/flow/FlowRoutes";
import { ExpertOnboarding } from "@/components/onboarding/ExpertOnboarding";
import { InvestorOnboarding } from "@/components/onboarding/InvestorOnboarding";
import { type Role as ChosenRole } from "@/components/onboarding/RoleSelection";
import { useCreateAccount } from "@/sdk/auth/create-account";
import { useLocation } from "wouter";
import { UI } from "@/ui";
import { useState } from "react";

export default function CreateAccount() {
  const [, navigate] = useLocation();
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

  // Persisted role selection
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
      if(err.response.status === 409) {
        flow.send("OTP_SENT");
        return 
      }
      toast.error("Invalid Mobile Number", err?.message || "Please enter a valid 10-digit mobile number");
    }
  };

  const handleVerifyOtp = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      await verifyOtpAction();
      toast.success("Phone Verified", "Choose your role to continue");
      flow.send("OTP_VERIFIED");
    } catch (err: any) {
      toast.error("Invalid OTP", err?.message || "Please enter a valid 6-digit OTP");
    }
  };

  return (
    <FlowMachineProvider value={flow}>

      <FlowRoutes>
        <FlowRoute
          name="phone"
          element={
            <SignupLayout1>
              <PhoneNumberScreen
                mobileNumber={mobileNumber}
                isLoading={isLoading}
                onChange={updateMobile}
                onSubmit={handleSendOtp}
              />
            </SignupLayout1>

          }
        />
        <FlowRoute
          name="otp"
          element={
            <SignupLayout1>
              <OtpVerificationScreen
                otp={otp}
                isLoading={isLoading}
                mobileNumber={mobileNumber}
                onChange={updateOtp}
                onSubmit={handleVerifyOtp}
                onChangeNumber={() => { setIsOtpSent(false); flow.send("BACK"); }}
                onResend={handleSendOtp}
              />
            </SignupLayout1>
          }
        />
        <FlowRoute
          name="role"
          element={<ChooseRoleScreen role={role} onSelect={handleRoleSelect} />}
        />
        <FlowRoute
          name="investor"
          element={<InvestorOnboarding onBack={() => { setRole(null); try { window.localStorage.removeItem('signup.role'); } catch { }; flow.go('role'); }} onComplete={async (data) => {
            try {
              const [first_name = "", ...rest] = (data.fullName || "").split(" ");
              const last_name = rest.join(" ");
              await finalizeProfile({
                username: data.username || (data.fullName ? data.fullName.replace(/\s+/g, '').toLowerCase() : 'user'),
                first_name,
                last_name,
                additional: {
                  role: 'investor',
                  investor: data,
                  phone: mobileNumber,
                  pendingId,
                },
              });
              UI.toast.success('Welcome!', 'Your account is ready.');
              navigate('/dashboard');
            } catch (err: any) {
              UI.toast.error('Could not create account', err?.message || 'Please try again.');
            }
          }} />}
        />
        <FlowRoute
          name="expert"
          element={<ExpertOnboarding onBack={() => { setRole(null); try { window.localStorage.removeItem('signup.role'); } catch { }; flow.go('role'); }} onComplete={async (data) => {
            try {
              const [first_name = "", ...rest] = (data.fullName || "").split(" ");
              const last_name = rest.join(" ");
              await finalizeProfile({
                username: data.username || (data.fullName ? data.fullName.replace(/\s+/g, '').toLowerCase() : 'user'),
                first_name,
                last_name,
                additional: {
                  role: 'expert',
                  expert: data,
                  phone: mobileNumber,
                  pendingId,
                },
              });
              UI.toast.success('Welcome!', 'Your account is ready.');
              navigate('/dashboard');
            } catch (err: any) {
              UI.toast.error('Could not create account', err?.message || 'Please try again.');
            }
          }} />}
        />
      </FlowRoutes>

    </FlowMachineProvider>
  );
}
