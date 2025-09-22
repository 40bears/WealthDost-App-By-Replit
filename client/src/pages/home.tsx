import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center">
          {/* Empty space for back button alignment */}
        </div>
        <div className="text-right text-sm text-gray-500">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="rounded-full border border-gray-200 hover:border-primary/50 hover:shadow-md hover:shadow-primary/20 transition-all duration-300 transform hover:scale-105 active:scale-95">
              Go to Dashboard
            </Button>
          </Link>
        </div>
      </div>

      {/* Landing Hero Section */}
      <div className="bg-primary rounded-xl p-4 text-white mx-4 mb-4 border-2 border-primary-foreground/20 hover:border-primary-foreground/40 transition-all duration-300 transform hover:scale-[1.01] shadow-lg hover:shadow-xl hover:shadow-primary/30">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-1">WealthDost</h1>
          <p className="text-sm text-white/80 mb-4">Scroll · Learn · Connect</p>
        </div>
        <p className="mb-4 text-sm">Join a community of investors and experts to learn, debate, and grow your financial knowledge.</p>
        <Link href="/create-account">
          <Button className="w-full bg-white text-primary hover:bg-white/90 font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 border-2 border-white hover:border-primary/20 hover:shadow-lg hover:shadow-white/20">
            Get Started
          </Button>
        </Link>
      </div>

      {/* Features Preview */}
      <div className="px-4 mb-4 flex-1">
        <h3 className="text-lg font-semibold mb-3">What you'll get</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-3 rounded-xl border-2 border-purple-100 hover:border-purple-300 shadow-sm h-24 flex flex-col justify-center transform hover:scale-105 active:scale-95 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 cursor-pointer">
            <div className="bg-primary/10 w-8 h-8 rounded-full flex items-center justify-center mb-1">
              <span className="material-icons text-primary text-base">connect_without_contact</span>
            </div>
            <h4 className="font-semibold text-xs leading-tight mb-0.5">Expert Connect</h4>
            <p className="text-xs text-gray-600 text-xs">Get advice from experts</p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-3 rounded-xl border-2 border-green-100 hover:border-green-300 shadow-sm h-24 flex flex-col justify-center transform hover:scale-105 active:scale-95 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/20 cursor-pointer">
            <div className="bg-green-500/10 w-8 h-8 rounded-full flex items-center justify-center mb-1">
              <span className="material-icons text-green-600 text-base">trending_up</span>
            </div>
            <h4 className="font-semibold text-xs leading-tight mb-0.5">Market Insights</h4>
            <p className="text-xs text-gray-600">Track stocks & crypto</p>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-yellow-50 p-3 rounded-xl border-2 border-orange-100 hover:border-orange-300 shadow-sm h-24 flex flex-col justify-center transform hover:scale-105 active:scale-95 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/20 cursor-pointer">
            <div className="bg-orange-500/10 w-8 h-8 rounded-full flex items-center justify-center mb-1">
              <span className="material-icons text-orange-600 text-base">groups</span>
            </div>
            <h4 className="font-semibold text-xs leading-tight mb-0.5">Join Tribes</h4>
            <p className="text-xs text-gray-600">Unlock Wealth Circle</p>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-3 rounded-xl border-2 border-blue-100 hover:border-blue-300 shadow-sm h-24 flex flex-col justify-center transform hover:scale-105 active:scale-95 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 cursor-pointer">
            <div className="bg-blue-500/10 w-8 h-8 rounded-full flex items-center justify-center mb-1">
              <span className="material-icons text-blue-600 text-base">quiz</span>
            </div>
            <h4 className="font-semibold text-xs leading-tight mb-0.5">Quiz & Debate</h4>
            <p className="text-xs text-gray-600">Test knowledge</p>
          </div>
        </div>
      </div>

      <div className="mt-auto text-center text-xs text-gray-500 px-4 py-6">
        By signing up, you agree to our Terms of Service and Privacy Policy
      </div>
    </div>
  );
};

export default Home;
