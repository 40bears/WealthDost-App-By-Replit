import { Link } from "wouter";

type Tab = "home" | "analytics" | "explore" | "analyst" | "invroom";

interface BottomNavigationProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const BottomNavigation = ({ activeTab, onTabChange }: BottomNavigationProps) => {
  const tabs = [
    { id: "home", icon: "home", label: "Home" },
    { id: "analytics", icon: "bar_chart", label: "Analytics" },
    { id: "explore", icon: "search", label: "Explore" },
    { id: "analyst", icon: "person", label: "Top Analyst" },
    { id: "invroom", icon: "dashboard", label: "Inv. Room" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-10 safe-bottom">
      <div className="max-w-md mx-auto flex justify-around items-center py-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`flex flex-col items-center px-3 py-1 ${
              activeTab === tab.id ? "text-primary" : "text-gray-500"
            }`}
            onClick={() => onTabChange(tab.id as Tab)}
          >
            <span className="material-icons">{tab.icon}</span>
            <span className="text-xs mt-0.5">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default BottomNavigation;
