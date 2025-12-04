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
      if (err?.response?.status === 409) {
        if (err.response.data?.data?.pendingId) {
          flow.send("OTP_SENT");
          return
        }

        toast.error(err.response.data?.message || "User already exists");

        return
      }
      toast.error("Invalid Mobile Number", err?.message || "Please enter a valid 10-digit mobile number");
    }
  };

  const handleVerifyOtp = async (e: React.SyntheticEvent) => {
    console.log("Verifying OTP...");
    e.preventDefault();
    try {
      const response = await verifyOtpAction();
      if (response?.flow === 'login' && response.user) {
        console.log(response);
        if (response.accessToken) {
          localStorage.setItem('accessToken', response.accessToken);
        }
        if (response.refreshToken) {
          localStorage.setItem('refreshToken', response.refreshToken);
        }
        const userWithLoginFlag = { ...response.user, isLoggedIn: true };
        await auth.login(userWithLoginFlag);
        navigate({ to: '/dashboard' });
        return;
      }
      // Store tokens for register flow as well
      if (response?.flow === 'register') {
        if (response.accessToken) {
          localStorage.setItem('accessToken', response.accessToken);
        }
        if (response.refreshToken) {
          localStorage.setItem('refreshToken', response.refreshToken);
        }
      }
      toast.success("Phone Verified", "Choose your role to continue");
      flow.send("OTP_VERIFIED");
    } catch (err: any) {
      toast.error("Invalid OTP", err?.message || "Please enter a valid 6-digit OTP");
    }
  };

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
      const response = await finalizeProfile({
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

      if (response?.user) {
        // Extract tokens and flow from user object if present and store tokens separately
        const { accessToken, refreshToken, flow, ...userData } = response.user;
        if (accessToken) {
          localStorage.setItem('accessToken', accessToken);
        }
        if (refreshToken) {
          localStorage.setItem('refreshToken', refreshToken);
        }
        const userWithLoginFlag = { ...userData, isLoggedIn: true };
        await auth.login(userWithLoginFlag);
      }

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
      const response = await finalizeProfile({
        username: data.username,
        email: data.email,
        first_name,
        last_name,
        password: data.password,
        confirm_password: data.confirmPassword,
        additional: {
          role: 'expert',
          expert: data,
          phone: mobileNumber,
          pendingId,
        },
      });

      if (response?.user) {
        // Extract tokens and flow from user object if present and store tokens separately
        const { accessToken, refreshToken, flow, ...userData } = response.user;
        if (accessToken) {
          localStorage.setItem('accessToken', accessToken);
        }
        if (refreshToken) {
          localStorage.setItem('refreshToken', refreshToken);
        }
        const userWithLoginFlag = { ...userData, isLoggedIn: true };
        await auth.login(userWithLoginFlag);
      }

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
            <SignupLayout
              showLogo={false}
              headerText="Enter your mobile number to get started"
              showTermsInCard={false}
              footerContent={
                <div className="text-center">
                  <button
                    type="button"
                    onClick={handleChangeNumber}
                    className="text-white/90 hover:text-white font-medium transition-colors duration-300 inline-flex items-center"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Change Number
                  </button>
                </div>
              }
            >
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
