import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import SignUp from "@/pages/signup";
import Dashboard from "@/pages/dashboard-fixed";
import ExpertProfile from "@/pages/expert-profile";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/signup" component={SignUp} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/expert/:id" component={ExpertProfile} />
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
