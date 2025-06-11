import { useState } from "react";
import { RoleSelection } from "@/components/onboarding/RoleSelection";
import { InvestorOnboarding } from "@/components/onboarding/InvestorOnboarding";
import { ExpertOnboarding } from "@/components/onboarding/ExpertOnboarding";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

type Role = "investor" | "expert" | null;

const SignUp = () => {
  // State for tracking onboarding step
  const [role, setRole] = useState<Role>(null);
  const [showWelcome, setShowWelcome] = useState(true);

  // Handle role selection
  const handleRoleSelect = (selectedRole: Role) => {
    setRole(selectedRole);
  };

  // Start the onboarding process
  const handleStartOnboarding = () => {
    setShowWelcome(false);
  };

  // Render welcome screen
  if (showWelcome) {
    return (
      <div className="px-4 py-6 flex flex-col h-full">
        {/* Top Navigation Bar */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            {/* Placeholder for back button */}
          </div>
          <div className="text-right text-sm text-gray-500">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="rounded-full">
                Go to Dashboard
              </Button>
            </Link>
          </div>
        </div>

        {/* Role Selection Section */}
        <div className="bg-primary rounded-xl p-6 text-white mb-6">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold mb-2">Choose Your Role</h1>
            <p className="text-white/80">Select how you want to engage with the WealthDost community</p>
          </div>
          
          {!role ? (
            <div className="space-y-4">
              <div 
                className="bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-white/20 cursor-pointer hover:bg-white/20 transition-all duration-200"
                onClick={() => handleRoleSelect("investor")}
              >
                <div className="flex items-center space-x-3">
                  <div className="bg-white/20 p-2 rounded-lg">
                    <span className="material-icons text-white text-xl">trending_up</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">I'm an Investor</h3>
                    <p className="text-white/80 text-sm">Learn, track investments, and get expert advice</p>
                  </div>
                  <span className="material-icons text-white/60">arrow_forward_ios</span>
                </div>
              </div>
              
              <div 
                className="bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-white/20 cursor-pointer hover:bg-white/20 transition-all duration-200"
                onClick={() => handleRoleSelect("expert")}
              >
                <div className="flex items-center space-x-3">
                  <div className="bg-white/20 p-2 rounded-lg">
                    <span className="material-icons text-white text-xl">school</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">I'm an Expert</h3>
                    <p className="text-white/80 text-sm">Share knowledge, build following, and monetize expertise</p>
                  </div>
                  <span className="material-icons text-white/60">arrow_forward_ios</span>
                </div>
              </div>
            </div>
          ) : (
            <Button onClick={handleStartOnboarding} className="w-full bg-white text-primary hover:bg-white/90 font-semibold transition-all duration-200 transform hover:scale-[1.02]">
              Continue as {role === "investor" ? "Investor" : "Expert"}
            </Button>
          )}
        </div>

        {/* Back Button */}
        <div className="text-center mb-4">
          <Link href="/create-account">
            <Button variant="ghost" className="text-gray-600 hover:text-gray-800">
              ← Back
            </Button>
          </Link>
        </div>

        <div className="mt-auto text-center text-xs text-gray-500">
          By signing up, you agree to our Terms of Service and Privacy Policy
        </div>
      </div>
    );
  }

  return (
    <div className="h-full">
      {/* Render role selection if no role selected */}
      {!role && <RoleSelection onSelect={handleRoleSelect} />}
      
      {/* Render investor onboarding flow */}
      {role === "investor" && <InvestorOnboarding onBack={() => setRole(null)} />}
      
      {/* Render expert onboarding flow */}
      {role === "expert" && <ExpertOnboarding onBack={() => setRole(null)} />}
    </div>
  );
};

export default SignUp;
