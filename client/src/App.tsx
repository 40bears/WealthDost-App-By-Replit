import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
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

function Router() {
  return (
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
