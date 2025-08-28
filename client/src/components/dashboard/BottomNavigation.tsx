import { Link, useLocation } from "wouter";

type Tab = "home" | "experts" | "explore" | "invroom" | "tips";

interface BottomNavigationProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const BottomNavigation = ({ activeTab, onTabChange }: BottomNavigationProps) => {
  const [, setLocation] = useLocation();
  
  const tabs = [
    { id: "home", icon: "home", label: "Home", href: "/dashboard" },
    { id: "tips", icon: "trending_up", label: "Tips", href: "/stock-tips" },
    { id: "explore", icon: "search", label: "Explore", href: "/search" },
    { id: "experts", icon: "psychology", label: "Experts", href: "/experts" },
    { id: "invroom", icon: "meeting_room", label: "Tribe", href: "/investment-rooms" },
  ];

  const handleTabClick = (tab: any) => {
    // Update active tab state
    onTabChange(tab.id as Tab);
    // Navigate using SPA routing
    setLocation(tab.href);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t-2 border-gray-200/50 shadow-lg z-10 safe-bottom">
      <div className="max-w-md mx-auto flex justify-around px-4 py-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`flex flex-col items-center px-2 py-1 rounded-xl transition-all duration-300 active:scale-95 ${
              activeTab === tab.id ? "text-primary bg-purple-50/70 backdrop-blur-sm" : "text-gray-500"
            }`}
            onClick={() => handleTabClick(tab)}
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
  );
};

export default BottomNavigation;
