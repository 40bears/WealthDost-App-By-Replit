import { Switch, Route, useLocation } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useState } from "react";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import SignUp from "@/pages/signup";
import Login from "@/pages/login";
import CreateAccount from "@/pages/create-account";
import Dashboard from "@/pages/dashboard-fixed";
import ExpertProfile from "@/pages/expert-profile";
import ExpertsList from "@/pages/experts-list";
import InvestmentRooms from "@/pages/investment-rooms";
import Watchlist from "@/pages/watchlist";
import PortfolioUpload from "@/pages/portfolio-upload";
import UserProfile from "@/pages/user-profile";
import MyPosts from "@/pages/my-posts";
import Activity from "@/pages/activity";
import Settings from "@/pages/settings";
import HelpCenter from "@/pages/help-center";
import Loops from "@/pages/loops";
import BottomNavigation from "@/components/dashboard/BottomNavigation";

function Router() {
  const [location] = useLocation();
  const [activeTab, setActiveTab] = useState<"home" | "experts" | "explore" | "invroom" | "loops">(() => {
    // Determine initial active tab based on current route
    if (location.includes('/dashboard')) return 'home';
    if (location.includes('/experts')) return 'experts';
    if (location.includes('/watchlist') || location.includes('/portfolio')) return 'explore';
    if (location.includes('/investment-rooms')) return 'invroom';
    if (location.includes('/loops')) return 'loops';
    return 'home';
  });

  const handleTabChange = (tab: "home" | "experts" | "explore" | "invroom" | "loops") => {
    setActiveTab(tab);
  };

  // Pages that should not show the bottom navigation
  const pagesWithoutNav = ['/', '/create-account', '/signup', '/login'];
  const showBottomNav = !pagesWithoutNav.includes(location);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/create-account" component={CreateAccount} />
          <Route path="/signup" component={SignUp} />
          <Route path="/login" component={Login} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/experts" component={ExpertsList} />
          <Route path="/expert/:id" component={ExpertProfile} />
          <Route path="/investment-rooms" component={InvestmentRooms} />
          <Route path="/watchlist" component={Watchlist} />
          <Route path="/portfolio-upload" component={PortfolioUpload} />
          <Route path="/profile" component={UserProfile} />
          <Route path="/my-posts" component={MyPosts} />
          <Route path="/activity" component={Activity} />
          <Route path="/settings" component={Settings} />
          <Route path="/help" component={HelpCenter} />
          <Route path="/loops" component={Loops} />
          <Route component={NotFound} />
        </Switch>
      </div>
      
      {/* Global Bottom Navigation */}
      {showBottomNav && (
        <div className="sticky bottom-0 z-50">
          <div className="max-w-md mx-auto">
            <BottomNavigation activeTab={activeTab} onTabChange={handleTabChange} />
          </div>
        </div>
      )}
    </div>
  );
}

function App() {
  return (
    <TooltipProvider>
      <Toaster />
      <div className="max-w-md mx-auto bg-white min-h-screen flex flex-col">
        <Router />
      </div>
    </TooltipProvider>
  );
}

export default App;
