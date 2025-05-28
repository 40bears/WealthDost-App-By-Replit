import { Link } from "wouter";

type Tab = "home" | "experts" | "explore" | "invroom" | "create";

interface BottomNavigationProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const BottomNavigation = ({ activeTab, onTabChange }: BottomNavigationProps) => {
  const tabs = [
    { id: "home", icon: "home", label: "Home", href: "/dashboard" },
    { id: "create", icon: "add_circle", label: "Create", href: null },
    { id: "explore", icon: "search", label: "Explore", href: null },
    { id: "experts", icon: "psychology", label: "Experts", href: "/experts" },
    { id: "invroom", icon: "meeting_room", label: "Inv.Room", href: null },
  ];

  const handleTabClick = (tab: any) => {
    if (tab.href) {
      window.location.href = tab.href;
    } else {
      onTabChange(tab.id as Tab);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-10 safe-bottom">
      <div className="max-w-md mx-auto flex justify-between px-4 py-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`flex flex-col items-center px-2 py-1 tab-slide btn-pulse ${
              activeTab === tab.id ? "text-primary active" : 
              tab.id === "create" ? "text-purple-600" : "text-gray-500"
            }`}
            onClick={() => handleTabClick(tab)}
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
