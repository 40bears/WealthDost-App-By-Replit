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
        <h1 className="text-3xl font-bold mb-4">WealthDost</h1>
        <p className="mb-6">Join a community of investors and experts to learn, debate, and grow your financial knowledge.</p>
        <Link href="/signup">
          <Button className="w-full bg-white text-primary hover:bg-white/90 font-semibold mb-3">
            Sign Up
          </Button>
        </Link>
        <Button 
          className="w-full bg-transparent border border-white text-white hover:bg-white/10"
          variant="outline"
        >
          Log In
        </Button>
      </div>

      {/* Features Preview */}
      <div className="px-4 mb-6">
        <h3 className="text-lg font-semibold mb-3">What you'll get</h3>
        <div className="grid grid-cols-2 gap-3">
          <Card className="bg-gray-50 p-3">
            <span className="material-icons text-primary mb-2">connect_without_contact</span>
            <h4 className="font-medium mb-1">Expert Connect</h4>
            <p className="text-sm text-gray-600">Get advice from certified experts</p>
          </Card>
          <Card className="bg-gray-50 p-3">
            <span className="material-icons text-primary mb-2">trending_up</span>
            <h4 className="font-medium mb-1">Market Insights</h4>
            <p className="text-sm text-gray-600">Track stocks, crypto & more</p>
          </Card>
          <Card className="bg-gray-50 p-3">
            <span className="material-icons text-primary mb-2">groups</span>
            <h4 className="font-medium mb-1">Join Tribes</h4>
            <p className="text-sm text-gray-600">Connect with like-minded investors</p>
          </Card>
          <Card className="bg-gray-50 p-3">
            <span className="material-icons text-primary mb-2">quiz</span>
            <h4 className="font-medium mb-1">Financial Quiz & Community Debates</h4>
            <p className="text-sm text-gray-600">Test knowledge & discuss topics</p>
          </Card>
        </div>
      </div>

      <div className="mt-auto text-center text-xs text-gray-500 p-4">
        By signing up, you agree to our Terms of Service and Privacy Policy
      </div>
    </div>
  );
};

export default Home;
