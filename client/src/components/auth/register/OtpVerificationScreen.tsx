import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FeedbackModal } from "@/components/feedback/FeedbackModal";
import { useEffect, useState } from "react";

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
  const [countdown, setCountdown] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    // Start countdown when component mounts
    setCountdown(30);
    setCanResend(false);

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleResend = async () => {
    if (!canResend) return;

    await onResend();

    // Restart countdown after resending
    setCountdown(30);
    setCanResend(false);

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <>
      <div>
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white mb-3">Verify OTP</h2>
          <p className="text-white/90 text-sm">{`Enter the 6-digit OTP sent to`}</p>
          <p className="text-white/90 text-sm">{`+91 ${mobileNumber ?? ''}`}</p>
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
            className="bg-white/10 border-white/20 text-white placeholder:text-white/50 rounded-xl focus:border-white/40 focus:ring-0 transition-all duration-300 h-12"
            maxLength={6}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full h-12 bg-gray-800 text-white font-semibold text-lg rounded-lg shadow-lg transition-all duration-300 hover:bg-gray-700 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          disabled={isLoading || otp.length !== 6}
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
              Verifying...
            </>
          ) : (
            <>
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              Verify & Continue
            </>
          )}
        </button>
        <div className="text-center text-sm text-white/90">
          <button
            type="button"
            onClick={handleResend}
            className={`transition-colors duration-300 ${canResend ? 'hover:text-white cursor-pointer' : 'cursor-not-allowed opacity-60'}`}
            disabled={isLoading || !canResend}
          >
            {canResend ? 'Resend OTP' : `Resend OTP in ${countdown} secs`}
          </button>
        </div>
        </form>

        {/* Feedback Link */}
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => setShowFeedback(true)}
            className="text-white/90 hover:text-white text-sm transition-colors duration-300 inline-flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
            Having trouble? Send us feedback
          </button>
        </div>
      </div>

      {/* Feedback Modal */}
      <FeedbackModal isOpen={showFeedback} onClose={() => setShowFeedback(false)} />
    </>
  );
}
