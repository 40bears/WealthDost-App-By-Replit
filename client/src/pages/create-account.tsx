import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export default function CreateAccount() {
  const [, setLocation] = useLocation();
  const [mobileNumber, setMobileNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mobileNumber.length !== 10) {
      toast({
        title: "Invalid Mobile Number",
        description: "Please enter a valid 10-digit mobile number",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    // Simulate OTP sending
    setTimeout(() => {
      setIsOtpSent(true);
      setIsLoading(false);
      toast({
        title: "OTP Sent",
        description: "We've sent a 6-digit OTP to your mobile number",
      });
    }, 1500);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter a valid 6-digit OTP",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate OTP verification
    setTimeout(() => {
      setIsLoading(false);
      setIsOtpVerified(true);
      toast({
        title: "Phone Verified",
        description: "Now create your account credentials",
      });
    }, 1500);
  };

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!email || !password || !confirmPassword) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Weak Password",
        description: "Password must be at least 6 characters long",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate account creation
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Account Created",
        description: "Welcome to WealthDost! Please complete your profile.",
      });
      setLocation("/signup");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex flex-col justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/30 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-purple-400/20 to-blue-400/20 rounded-full blur-3xl"></div>
      </div>
      
      <div className="w-full max-w-md mx-auto flex-1 flex flex-col justify-center relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-3 drop-shadow-lg">Create Account</h1>
          <p className="text-white/90 text-lg">Enter your mobile number to get started</p>
          <div className="mt-6">
            <p className="text-white/80 text-sm">
              Already have an account?{" "}
              <Link href="/login" className="text-white font-semibold relative inline-block group">
                <span className="relative z-10">Sign In</span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-blue-400 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </p>
          </div>
        </div>

        {/* Registration Form */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl p-8 relative overflow-hidden">
          {/* Glass shine effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-50 rounded-2xl"></div>
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
          
          <div className="relative z-10">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">
                {!isOtpSent 
                  ? "Mobile Number" 
                  : !isOtpVerified 
                    ? "Verify OTP" 
                    : "Create Account"
                }
              </h2>
              <p className="text-white/80">
                {!isOtpSent 
                  ? "We'll send you a verification code"
                  : !isOtpVerified 
                    ? `Enter the 6-digit OTP sent to +91 ${mobileNumber}`
                    : "Set up your email and password for login"
                }
              </p>
            </div>
            
            {!isOtpSent ? (
              <form onSubmit={handleSendOtp} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="mobile" className="text-white font-medium">Mobile Number</Label>
                  <div className="flex">
                    <div className="flex items-center bg-white/10 backdrop-blur-sm px-4 rounded-l-xl border border-white/20 border-r-0 h-12">
                      <span className="text-lg text-white/90 font-semibold">+91</span>
                    </div>
                    <Input
                      id="mobile"
                      type="tel"
                      placeholder="Enter 10-digit mobile number"
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      className="rounded-l-none bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-white/60 rounded-r-xl focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 focus:ring-offset-0 focus:shadow-lg focus:shadow-purple-500/20 transition-all duration-300 h-12 text-lg"
                      required
                    />
                  </div>
                </div>
                <Button 
                  type="submit" 
                  size="lg"
                  className="w-full h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold text-lg rounded-xl border border-white/20 shadow-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl hover:shadow-purple-500/30 focus:scale-[1.02] focus:shadow-xl focus:shadow-purple-500/30 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  disabled={isLoading || mobileNumber.length !== 10}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {isLoading && (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    )}
                    {isLoading ? "Sending OTP..." : "Send OTP"}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                </Button>
              </form>
            ) : !isOtpVerified ? (
              <form onSubmit={handleVerifyOtp} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="otp" className="text-white font-medium">Enter OTP</Label>
                  <Input
                    id="otp"
                    type="tel"
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="text-center text-xl tracking-widest bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-white/60 rounded-xl focus:border-green-400 focus:ring-2 focus:ring-green-400/50 focus:ring-offset-0 focus:shadow-lg focus:shadow-green-500/20 transition-all duration-300 h-14 font-bold"
                    required
                  />
                </div>
                <div className="flex justify-between items-center text-sm">
                  <button 
                    type="button"
                    onClick={() => setIsOtpSent(false)}
                    className="text-white/90 hover:text-white relative inline-block group transition-colors duration-300"
                  >
                    <span className="relative z-10">Change number</span>
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-blue-400 transition-all duration-300 group-hover:w-full"></span>
                  </button>
                  <button 
                    type="button"
                    onClick={handleSendOtp}
                    className="text-white/90 hover:text-white relative inline-block group transition-colors duration-300"
                    disabled={isLoading}
                  >
                    <span className="relative z-10">Resend OTP</span>
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-blue-400 transition-all duration-300 group-hover:w-full"></span>
                  </button>
                </div>
                <Button 
                  type="submit" 
                  size="lg"
                  className="w-full h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold text-lg rounded-xl border border-white/20 shadow-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl hover:shadow-green-500/30 focus:scale-[1.02] focus:shadow-xl focus:shadow-green-500/30 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  disabled={isLoading || otp.length !== 6}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {isLoading && (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    )}
                    {isLoading ? "Verifying..." : "Verify & Continue"}
                    {!isLoading && (
                      <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                </Button>
              </form>
            ) : (
              <form onSubmit={handleCreateAccount} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white font-medium">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-white/60 rounded-xl focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50 focus:ring-offset-0 focus:shadow-lg focus:shadow-blue-500/20 transition-all duration-300 h-12"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-white font-medium">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Create a strong password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-white/60 rounded-xl focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50 focus:ring-offset-0 focus:shadow-lg focus:shadow-blue-500/20 transition-all duration-300 h-12"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-white font-medium">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-white/60 rounded-xl focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50 focus:ring-offset-0 focus:shadow-lg focus:shadow-blue-500/20 transition-all duration-300 h-12"
                    required
                  />
                </div>
                <div className="text-center">
                  <button 
                    type="button"
                    onClick={() => {
                      setIsOtpVerified(false);
                      setIsOtpSent(false);
                      setOtp("");
                    }}
                    className="text-white/90 hover:text-white relative inline-block group transition-colors duration-300 text-sm"
                  >
                    <span className="relative z-10">← Change phone number</span>
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-blue-400 transition-all duration-300 group-hover:w-full"></span>
                  </button>
                </div>
                <Button 
                  type="submit" 
                  size="lg"
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold text-lg rounded-xl border border-white/20 shadow-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-500/30 focus:scale-[1.02] focus:shadow-xl focus:shadow-blue-500/30 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  disabled={isLoading || !email || !password || !confirmPassword}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {isLoading && (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    )}
                    {isLoading ? "Creating Account..." : "Create Account"}
                    {!isLoading && (
                      <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    )}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                </Button>
              </form>
            )}
            
            <div className="mt-8 text-center">
              <p className="text-xs text-white/70">
                By continuing, you agree to our{" "}
                <Link href="/terms" className="text-white/90 hover:text-white relative inline-block group transition-colors duration-300">
                  <span className="relative z-10">Terms of Service</span>
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-blue-400 transition-all duration-300 group-hover:w-full"></span>
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-white/90 hover:text-white relative inline-block group transition-colors duration-300">
                  <span className="relative z-10">Privacy Policy</span>
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-blue-400 transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-8">
          <Link href="/">
            <Button variant="ghost" className="text-white/90 hover:text-white hover:bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-6 py-2 transition-all duration-300 transform hover:scale-105">
              ← Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}