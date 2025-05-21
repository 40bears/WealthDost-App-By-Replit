import { Link } from "wouter";

type Tab = "home" | "experts" | "explore" | "invroom" | "create";

interface BottomNavigationProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const BottomNavigation = ({ activeTab, onTabChange }: BottomNavigationProps) => {
  // Split the tabs into two groups - before and after the create button
  const leftTabs = [
    { id: "home", icon: "home", label: "Home" },
  ];
  
  const rightTabs = [
    { id: "explore", icon: "search", label: "Explore" },
    { id: "experts", icon: "psychology", label: "Experts" },
    { id: "invroom", icon: "meeting_room", label: "Inv.Room" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-10 safe-bottom">
      <div className="relative max-w-md mx-auto">
        {/* Create Button - Absolutely positioned in the center */}
        <div className="absolute top-0 left-0 w-full flex justify-center">
          <button
            className="transform -translate-y-7 flex flex-col items-center btn-pulse z-10"
            onClick={() => onTabChange("create")}
          >
            <div className="w-14 h-14 rounded-full bg-primary text-white flex items-center justify-center shadow-lg border-4 border-white">
              <span className="material-icons text-3xl">add</span>
            </div>
          </button>
        </div>
        
        {/* Navigation container with space for center button */}
        <div className="flex justify-between py-3 px-4">
          {/* Left side tabs */}
          <div className="flex items-center space-x-8">
            {leftTabs.map((tab) => (
              <button
                key={tab.id}
                className={`flex flex-col items-center tab-slide btn-pulse ${
                  activeTab === tab.id ? "text-primary active" : "text-gray-500"
                }`}
                onClick={() => onTabChange(tab.id as Tab)}
              >
                <span className={`material-icons transition-transform duration-200 ${
                  activeTab === tab.id ? "scale-110" : "scale-100"
                }`}>{tab.icon}</span>
                <span className={`text-xs mt-0.5 transition-all duration-300 ${
                  activeTab === tab.id ? "font-medium" : ""
                }`}>{tab.label}</span>
              </button>
            ))}
          </div>
          
          {/* Right side tabs */}
          <div className="flex items-center space-x-8">
            {rightTabs.map((tab) => (
              <button
                key={tab.id}
                className={`flex flex-col items-center tab-slide btn-pulse ${
                  activeTab === tab.id ? "text-primary active" : "text-gray-500"
                }`}
                onClick={() => onTabChange(tab.id as Tab)}
              >
                <span className={`material-icons transition-transform duration-200 ${
                  activeTab === tab.id ? "scale-110" : "scale-100"
                }`}>{tab.icon}</span>
                <span className={`text-xs mt-0.5 transition-all duration-300 ${
                  activeTab === tab.id ? "font-medium" : ""
                }`}>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BottomNavigation;
