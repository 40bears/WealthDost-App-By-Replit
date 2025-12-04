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
        <p className="text-white/90">We'll send you a verification code</p>
      </div>
      <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="mobile" className="text-white font-medium">Mobile Number</Label>
        <div className="flex">
          <div className="flex items-center bg-white/10 px-4 rounded-l-xl border border-white/20 text-white">
            +91
          </div>
          <Input
            id="mobile"
            type="tel"
            placeholder="Enter 10-digit mobile number"
            value={mobileNumber}
            onChange={(e) => onChange(e.target.value)}
            className="bg-white/10 border-white/20 text-white placeholder:text-white/50 rounded-r-xl focus:border-white/40 focus:ring-0 transition-all duration-300 h-12 flex-1"
            maxLength={10}
            required
          />
        </div>
      </div>
      <button
        type="submit"
        className="w-full h-12 bg-gray-800 text-white font-semibold text-lg rounded-lg shadow-lg transition-all duration-300 hover:bg-gray-700 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        disabled={isLoading || mobileNumber.length !== 10}
      >
        {isLoading ? (
          <>
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
            Sending OTP...
          </>
        ) : (
          <>
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Send OTP
          </>
        )}
      </button>
      </form>
    </div>
  );
}
