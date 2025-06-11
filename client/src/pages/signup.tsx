import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

type Role = "investor" | "expert" | null;

export default function SignUp() {
  const [, setLocation] = useLocation();
  const [selectedRole, setSelectedRole] = useState<Role>(null);
  const [showAccountCreation, setShowAccountCreation] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRoleSelect = (role: Role) => {
    setSelectedRole(role);
    setTimeout(() => {
      setLocation("/dashboard");
    }, 500);
  };

  const handleGoogleSignup = () => {
    setIsLoading(true);
    // Simulate Google signup
    setTimeout(() => {
      setIsLoading(false);
      setShowAccountCreation(false);
    }, 1500);
  };

  const handlePhoneSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber) return;
    
    setIsLoading(true);
    // Simulate phone signup
    setTimeout(() => {
      setIsLoading(false);
      setShowAccountCreation(false);
    }, 1500);
  };

  if (selectedRole) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 flex items-center justify-center p-4">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Welcome to WealthDost!</h2>
          <p className="mb-4">You've selected: {selectedRole === "investor" ? "Investor" : "Expert"}</p>
          <Button 
            onClick={() => setLocation("/dashboard")}
            className="bg-white text-primary hover:bg-white/90"
          >
            Continue to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  if (!showAccountCreation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Choose Your Path</h1>
            <p className="text-white/80">How would you like to use WealthDost?</p>
          </div>

          {/* Role Selection */}
          <Card className="bg-white/95 backdrop-blur-sm shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center">Select Your Role</CardTitle>
              <CardDescription className="text-center">
                Choose your journey in the financial world
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={() => handleRoleSelect("investor")}
                className="w-full h-16 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-none"
                variant="outline"
              >
                <div className="flex flex-col items-center">
                  <span className="text-lg font-semibold">Join as Investor</span>
                  <span className="text-sm opacity-90">Learn and grow your wealth</span>
                </div>
              </Button>

              <Button
                onClick={() => handleRoleSelect("expert")}
                className="w-full h-16 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-none"
                variant="outline"
              >
                <div className="flex flex-col items-center">
                  <span className="text-lg font-semibold">Join as Expert</span>
                  <span className="text-sm opacity-90">Share insights and earn</span>
                </div>
              </Button>
            </CardContent>
          </Card>

          {/* Back Button */}
          <div className="text-center mt-6">
            <Button 
              variant="ghost" 
              className="text-white hover:text-white/80 hover:bg-white/10"
              onClick={() => setShowAccountCreation(true)}
            >
              ← Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Create Your Account</h1>
          <p className="text-white/80">Join the WealthDost community</p>
        </div>

        {/* Account Creation Form */}
        <Card className="bg-white/95 backdrop-blur-sm shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Get Started</CardTitle>
            <CardDescription className="text-center">
              Choose how you'd like to create your account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Google Signup */}
            <Button
              onClick={handleGoogleSignup}
              disabled={isLoading}
              className="w-full h-12 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium"
              variant="outline"
            >
              <div className="flex items-center justify-center space-x-2">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span>{isLoading ? "Creating account..." : "Continue with Google"}</span>
              </div>
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">Or</span>
              </div>
            </div>

            {/* Phone Signup */}
            <form onSubmit={handlePhoneSignup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                disabled={isLoading || !phoneNumber}
              >
                {isLoading ? "Creating account..." : "Continue with Phone"}
              </Button>
            </form>
            
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link href="/login">
                  <span className="text-purple-600 hover:underline font-medium">
                    Sign in here
                  </span>
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link href="/">
            <Button variant="ghost" className="text-white hover:text-white/80 hover:bg-white/10">
              ← Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}