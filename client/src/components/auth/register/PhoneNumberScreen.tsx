import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Props = {
  mobileNumber: string;
  isLoading: boolean;
  onChange: (value: string) => void;
  onSubmit: (e?: React.SyntheticEvent) => Promise<void> | void;
};

export function PhoneNumberScreen({ mobileNumber, isLoading, onChange, onSubmit }: Props) {
  return (
    <div>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Mobile Number</h2>
        <p className="text-white/80 mb-6">We'll send you a verification code</p>
      </div>
      <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="mobile" className="text-white font-medium">Mobile Number</Label>
        <div className="flex">
          <div className="flex items-center bg-white/10 backdrop-blur-sm px-4 rounded-l-xl border border-white/20 text-white">
            +91
          </div>
          <Input
            id="mobile"
            type="tel"
            placeholder="Enter your 10-digit mobile number"
            value={mobileNumber}
            onChange={(e) => onChange(e.target.value)}
            className="bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-white/60 rounded-r-xl focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50 focus:ring-offset-0 focus:shadow-lg focus:shadow-blue-500/20 transition-all duration-300 h-12 flex-1"
            maxLength={10}
            required
          />
        </div>
      </div>
      <Button 
        type="submit" 
        size="lg"
        className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold text-lg rounded-xl border border-white/20 shadow-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-500/30 focus:scale-[1.02] focus:shadow-xl focus:shadow-blue-500/30 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        disabled={isLoading || mobileNumber.length !== 10}
      >
        <span className="relative z-10 flex items-center justify-center gap-2">
          {isLoading && (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          )}
          {isLoading ? "Sending OTP..." : "Send OTP"}
          {!isLoading && (
            <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          )}
        </span>
        <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
      </Button>
      </form>
    </div>
  );
}
