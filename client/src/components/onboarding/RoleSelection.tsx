import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

type Role = "investor" | "expert" | null;

interface RoleSelectionProps {
  onSelect: (role: Role) => void;
}

export const RoleSelection = ({ onSelect }: RoleSelectionProps) => {
  const [selectedRole, setSelectedRole] = useState<Role>(null);

  const handleRoleSelect = (role: Role) => {
    setSelectedRole(role);
  };

  const handleContinue = () => {
    if (selectedRole) {
      onSelect(selectedRole);
    }
  };

  return (
    <div className="px-4 py-6 flex flex-col h-full">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-gray-500"
          onClick={() => window.history.back()}
        >
          <span className="material-icons">arrow_back</span>
        </Button>
        <h2 className="text-xl font-semibold ml-2">Choose your role</h2>
      </div>

      {/* Progress Bar */}
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: "20%" }}></div>
      </div>

      <p className="text-gray-600 mb-6">Select the option that best describes you:</p>

      <div className="space-y-4 mb-8">
        <button 
          onClick={() => handleRoleSelect("investor")}
          className={`w-full bg-white border border-gray-200 hover:border-primary p-4 rounded-xl text-left transition flex items-start ${
            selectedRole === "investor" ? "border-primary bg-primary bg-opacity-5" : ""
          }`}
        >
          <div className="bg-primary bg-opacity-10 p-2 rounded-lg mr-4">
            <span className="material-icons text-primary">account_balance</span>
          </div>
          <div>
            <h3 className="font-semibold text-lg">Investor or Finance Enthusiast</h3>
            <p className="text-gray-600 text-sm">I want to learn, track investments and connect with others</p>
          </div>
        </button>

        <button 
          onClick={() => handleRoleSelect("expert")}
          className={`w-full bg-white border border-gray-200 hover:border-primary p-4 rounded-xl text-left transition flex items-start ${
            selectedRole === "expert" ? "border-primary bg-primary bg-opacity-5" : ""
          }`}
        >
          <div className="bg-primary bg-opacity-10 p-2 rounded-lg mr-4">
            <span className="material-icons text-primary">psychology</span>
          </div>
          <div>
            <h3 className="font-semibold text-lg">Financial Expert</h3>
            <p className="text-gray-600 text-sm">I have professional finance experience and want to share my knowledge</p>
          </div>
        </button>
      </div>

      <div className="mt-auto">
        <Button 
          onClick={handleContinue}
          className="w-full"
          disabled={!selectedRole}
        >
          Continue
        </Button>
      </div>
    </div>
  );
};
