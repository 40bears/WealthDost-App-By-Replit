import { X, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

interface KycPromptProps {
  isOpen: boolean;
  onClose: () => void;
  onGetStarted?: () => void;
}

const KycPrompt = ({ isOpen, onClose, onGetStarted }: KycPromptProps) => {
  if (!isOpen) return null;

  const handleGetStarted = () => {
    // TODO: Navigate to KYC registration page or open KYC flow
    onGetStarted?.();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md mx-auto overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-green-600" />
            <h2 className="text-xl font-semibold text-gray-900">Share a Stock Tip</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-purple-600" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Sorry !</h3>

          <p className="text-gray-700 mb-2">
            Stock tips can be posted by only
          </p>
          <p className="text-gray-700 font-semibold mb-6">
            SEBI registered experts.
          </p>

          <p className="text-gray-600 mb-6">
            Get yourself registered using below link.
          </p>

          <Button
            onClick={handleGetStarted}
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-8 py-3 rounded-lg underline"
          >
            Get Started
          </Button>
        </div>
      </div>
    </div>
  );
};

export default KycPrompt;
