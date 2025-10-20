import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Props = {
  otp: string;
  isLoading: boolean;
  mobileNumber?: string;
  onChange: (value: string) => void;
  onSubmit: (e: React.SyntheticEvent) => Promise<void> | void;
  onChangeNumber: () => void;
  onResend: () => Promise<void> | void;
};

export function OtpVerificationScreen({ otp, isLoading, mobileNumber, onChange, onSubmit, onChangeNumber, onResend }: Props) {
  return (
    <div>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Verify OTP</h2>
        <p className="text-white/80 mb-6">{`Enter the 6-digit OTP sent to +91 ${mobileNumber ?? ''}`}</p>
      </div>
      <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="otp" className="text-white font-medium">Enter OTP</Label>
        <Input
          id="otp"
          type="tel"
          placeholder="Enter 6-digit OTP"
          value={otp}
          onChange={(e) => onChange(e.target.value)}
          className="bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-white/60 rounded-xl focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50 focus:ring-offset-0 focus:shadow-lg focus:shadow-blue-500/20 transition-all duration-300 h-12"
          maxLength={6}
          required
        />
      </div>
      <div className="flex justify-between items-center text-sm">
        <button 
          type="button"
          onClick={onChangeNumber}
          className="text-white/90 hover:text-white relative inline-block group transition-colors duration-300"
        >
          <span className="relative z-10">Change number</span>
          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-blue-400 transition-all duration-300 group-hover:w-full"></span>
        </button>
        <button 
          type="button"
          onClick={onResend}
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
    </div>
  );
}
