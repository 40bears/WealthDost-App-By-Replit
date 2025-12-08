import { Role, RoleSelection } from "@/components/onboarding/RoleSelection";
import { Button } from "@/components/ui/button";

export interface ChooseRoleScreenProps {
  role: Role | null,
  onSelect: (role: Role | null) => void;
  onBack?: () => void;
}

export function ChooseRoleScreen({ role, onSelect, onBack }: ChooseRoleScreenProps) {
  return (
    <div className="px-4 py-6 flex flex-col min-h-screen">
      {/* Role Selection Section */}
      <div className="bg-primary rounded-xl p-6 text-white mb-6 flex-1 flex flex-col justify-center">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Choose Your Role</h1>
          <p className="text-white/80">Select how you want to engage with the WealthDost community</p>
        </div>
        <RoleSelection role={role} onSelect={onSelect as any} />
      </div>

      {/* Back Button */}
      <div className="text-center mb-4">
        {!role ? (
          <Button variant="ghost" className="text-gray-600 hover:text-gray-800" onClick={onBack}>
            ← Back
          </Button>
        ) : (
          <Button variant="ghost" className="text-gray-600 hover:text-gray-800" onClick={() => onSelect(null)}>
            ← Back
          </Button>
        )}
      </div>

      <div className="mt-auto text-center text-xs text-gray-500">
        By signing up, you agree to our{" "}
        <a href="https://wealthdost.com/terms" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="https://wealthdost.com/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
          Privacy Policy
        </a>
      </div>
    </div>
  );
}
