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

        {/* Landing Hero Section */}
        <div className="bg-primary rounded-xl p-6 text-white mb-6">
          <h1 className="text-3xl font-bold mb-2">WealthDost</h1>
          <p className="text-sm text-white/80 mb-4">Scroll · Learn · Connect</p>
          <p className="mb-6">Join a community of investors and experts to learn, debate, and grow your financial knowledge.</p>
          <Button onClick={handleStartOnboarding} className="w-full bg-white text-primary hover:bg-white/90 font-semibold mb-3">
            Sign Up
          </Button>
          <Button 
            className="w-full bg-transparent border border-white text-white hover:bg-white/10"
            variant="outline"
          >
            Log In
          </Button>
        </div>

        {/* Features Preview */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">What you'll get</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 p-4 rounded-lg h-24 flex flex-col justify-center">
              <span className="material-icons text-primary mb-1 text-lg">connect_without_contact</span>
              <h4 className="font-medium text-sm leading-tight">Expert Connect</h4>
              <p className="text-xs text-gray-600 mt-1">Get advice from certified experts</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg h-24 flex flex-col justify-center">
              <span className="material-icons text-primary mb-1 text-lg">trending_up</span>
              <h4 className="font-medium text-sm leading-tight">Market Insights</h4>
              <p className="text-xs text-gray-600 mt-1">Track stocks, crypto & more</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg h-24 flex flex-col justify-center">
              <span className="material-icons text-primary mb-1 text-lg">groups</span>
              <h4 className="font-medium text-sm leading-tight">Join Tribes</h4>
              <p className="text-xs text-gray-600 mt-1">Connect with like-minded investors</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg h-24 flex flex-col justify-center">
              <span className="material-icons text-primary mb-1 text-lg">quiz</span>
              <h4 className="font-medium text-sm leading-tight">Financial Quiz & Community Debates</h4>
              <p className="text-xs text-gray-600 mt-1">Test knowledge & discuss topics</p>
            </div>
          </div>
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
