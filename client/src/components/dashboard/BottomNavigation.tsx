import { Link } from "wouter";

type Tab = "home" | "experts" | "explore" | "invroom" | "create";

interface BottomNavigationProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const BottomNavigation = ({ activeTab, onTabChange }: BottomNavigationProps) => {
  const tabs = [
    { id: "home", icon: "home", label: "Home" },
    { id: "create", icon: "add_circle", label: "Create", special: true },
    { id: "explore", icon: "search", label: "Explore" },
    { id: "experts", icon: "psychology", label: "Experts" },
    { id: "invroom", icon: "meeting_room", label: "Inv.Room" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-10 safe-bottom">
      <div className="max-w-md mx-auto flex justify-around items-center py-2">
        {tabs.map((tab) => (
          tab.special ? (
            <button
              key={tab.id}
              className="flex flex-col items-center px-3 py-1 btn-pulse"
              onClick={() => onTabChange(tab.id as Tab)}
            >
              <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center -mt-5 shadow-lg">
                <span className="material-icons text-2xl">add</span>
              </div>
              <span className="text-xs mt-0.5 text-primary font-medium">{tab.label}</span>
            </button>
          ) : (
            <button
              key={tab.id}
              className={`flex flex-col items-center px-3 py-1 tab-slide btn-pulse ${
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
          )
        ))}
      </div>
    </div>
  );
};

export default BottomNavigation;
