
export type Role = "investor" | "expert" | null;

interface RoleSelectionProps {
  role: Role,
  onSelect: (role: Role) => void;
}

export const RoleSelection = ({ role, onSelect }: RoleSelectionProps) => {

  const handleRoleSelect = (role: Role) => {
    onSelect(role);
  };

  return (
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
            <h3 className="font-semibold text-lg">I'm a Wealth Enthusiast</h3>
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
  );
};
