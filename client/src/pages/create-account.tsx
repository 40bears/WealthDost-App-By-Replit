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
      role: { BACK: "otp" },
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

      // Handle network and server errors gracefully
      if (!err?.response || err?.response?.status >= 500 || err?.code === 'ERR_NETWORK') {
        toast.error("Service Unavailable", "We're having trouble connecting. Please try again later.");
        return;
      }

      // Handle validation errors
      const errorMessage = err?.response?.data?.message;
      if (errorMessage && typeof errorMessage === 'string') {
        toast.error("Invalid Mobile Number", errorMessage);
      } else {
        toast.error("Invalid Mobile Number", "Please enter a valid 10-digit mobile number");
      }
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
      // Extract error message from response
      const errorMessage = err?.response?.data?.message || err?.message || "Please enter a valid 6-digit OTP";
      toast.error("Invalid OTP", errorMessage);
    }
  };

  const handleChangeNumber = () => {
    setIsOtpSent(false);
    flow.send("BACK");
  };

  const handleRoleBack = () => {
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
          role: 'finmate',
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
        // Add default profile stats for new users
        const userWithDefaults = {
          ...userData,
          totalPosts: 0,
          likesReceived: 0,
          watchlistCount: 0,
          totalComments: 0,
        };
        const userWithLoginFlag = { ...userWithDefaults, isLoggedIn: true };
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
            <SignupLayout showWhiteAreas={true}>
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
                    className="px-8 py-4 border-2 border-white/40 text-white text-md font-medium rounded-2xl transition-all duration-300 inline-flex items-center hover:bg-white/10 hover:border-white/60 active:scale-[0.98]"
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
          element={<ChooseRoleScreen role={role} onSelect={handleRoleSelect} onBack={handleRoleBack} />}
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
