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
            <Button variant="ghost" size="sm" className="rounded-full">
              Go to Dashboard
            </Button>
          </Link>
        </div>
      </div>

      {/* Landing Hero Section */}
      <div className="bg-primary rounded-xl p-6 text-white mx-4 mb-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-1">WealthDost</h1>
          <p className="text-sm text-white/80 mb-5">Scroll · Learn · Connect</p>
        </div>
        <p className="mb-6">Join a community of investors and experts to learn, debate, and grow your financial knowledge.</p>
        <Link href="/create-account">
          <Button className="w-full bg-white text-primary hover:bg-white/90 font-semibold transition-all duration-200 transform hover:scale-[1.02]">
            Get Started
          </Button>
        </Link>
      </div>

      {/* Features Preview */}
      <div className="px-4 mb-6">
        <h3 className="text-lg font-semibold mb-3">What you'll get</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-4 rounded-xl border border-purple-100 shadow-sm h-32 flex flex-col justify-center transform hover:scale-105 transition-all duration-200">
            <div className="bg-primary/10 w-10 h-10 rounded-full flex items-center justify-center mb-2">
              <span className="material-icons text-primary text-lg">connect_without_contact</span>
            </div>
            <h4 className="font-semibold text-sm leading-tight mb-1">Expert Connect</h4>
            <p className="text-xs text-gray-600">Get advice from certified experts</p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border border-green-100 shadow-sm h-32 flex flex-col justify-center transform hover:scale-105 transition-all duration-200">
            <div className="bg-green-500/10 w-10 h-10 rounded-full flex items-center justify-center mb-2">
              <span className="material-icons text-green-600 text-lg">trending_up</span>
            </div>
            <h4 className="font-semibold text-sm leading-tight mb-1">Market Insights</h4>
            <p className="text-xs text-gray-600">Track stocks, crypto & more</p>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-yellow-50 p-4 rounded-xl border border-orange-100 shadow-sm h-32 flex flex-col justify-center transform hover:scale-105 transition-all duration-200">
            <div className="bg-orange-500/10 w-10 h-10 rounded-full flex items-center justify-center mb-2">
              <span className="material-icons text-orange-600 text-lg">groups</span>
            </div>
            <h4 className="font-semibold text-sm leading-tight mb-1">Join Tribes</h4>
            <p className="text-xs text-gray-600">Unlock your Wealth Circle</p>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100 shadow-sm h-32 flex flex-col justify-center transform hover:scale-105 transition-all duration-200">
            <div className="bg-blue-500/10 w-10 h-10 rounded-full flex items-center justify-center mb-2">
              <span className="material-icons text-blue-600 text-lg">quiz</span>
            </div>
            <h4 className="font-semibold text-sm leading-tight mb-1">Quiz & Debate</h4>
            <p className="text-xs text-gray-600">Test knowledge & discuss topics</p>
          </div>
        </div>
      </div>

      <div className="mt-auto text-center text-xs text-gray-500 p-4">
        By signing up, you agree to our Terms of Service and Privacy Policy
      </div>
    </div>
  );
};

export default Home;
