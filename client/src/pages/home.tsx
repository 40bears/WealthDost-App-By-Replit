import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const Home = () => {
  return (
    <div className="flex flex-col h-full">
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
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-50 p-3 rounded-lg h-28 flex flex-col justify-center">
            <span className="material-icons text-primary mb-1 text-xl">connect_without_contact</span>
            <h4 className="font-medium text-sm leading-tight mb-1">Expert Connect</h4>
            <p className="text-xs text-gray-600">Get advice from certified experts</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg h-28 flex flex-col justify-center">
            <span className="material-icons text-primary mb-1 text-xl">trending_up</span>
            <h4 className="font-medium text-sm leading-tight mb-1">Market Insights</h4>
            <p className="text-xs text-gray-600">Track stocks, crypto & more</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg h-28 flex flex-col justify-center">
            <span className="material-icons text-primary mb-1 text-xl">groups</span>
            <h4 className="font-medium text-sm leading-tight mb-1">Join Tribes</h4>
            <p className="text-xs text-gray-600">Unlock your Wealth Circle</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg h-28 flex flex-col justify-center">
            <span className="material-icons text-primary mb-1 text-xl">quiz</span>
            <h4 className="font-medium text-sm leading-tight mb-1">Quiz & Debate</h4>
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
