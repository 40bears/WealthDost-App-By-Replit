import { Link } from "wouter";

type Tab = "home" | "experts" | "explore" | "invroom" | "create";

interface BottomNavigationProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const BottomNavigation = ({ activeTab, onTabChange }: BottomNavigationProps) => {
  const tabs = [
    { id: "home", icon: "home", label: "Home" },
    { id: "create", icon: "add_circle", label: "Create" },
    { id: "explore", icon: "search", label: "Explore" },
    { id: "experts", icon: "psychology", label: "Experts" },
    { id: "invroom", icon: "meeting_room", label: "Inv.Room" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-10 safe-bottom">
      <div className="max-w-md mx-auto flex justify-between px-4 py-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`flex flex-col items-center px-2 py-1 tab-slide btn-pulse ${
              activeTab === tab.id ? "text-primary active" : 
              tab.id === "create" ? "text-primary" : "text-gray-500"
            }`}
            onClick={() => onTabChange(tab.id as Tab)}
          >
            <span className={`material-icons transition-transform duration-200 ${
              activeTab === tab.id ? "scale-110" : "scale-100"
            }`}>{tab.icon}</span>
            <span className={`text-xs mt-0.5 transition-all duration-300 ${
              activeTab === tab.id || tab.id === "create" ? "font-medium" : ""
            }`}>{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default BottomNavigation;
