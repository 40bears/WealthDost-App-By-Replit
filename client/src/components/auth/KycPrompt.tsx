import { X, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

interface KycPromptProps {
  isOpen: boolean;
  onClose: () => void;
  onGetStarted?: () => void;
}

const KycPrompt = ({ isOpen, onClose, onGetStarted }: KycPromptProps) => {
  const [showForm, setShowForm] = useState(false);
  const [sebiNumber, setSebiNumber] = useState("");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleGetStarted = () => {
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!sebiNumber.trim()) {
      setError("SEBI registration number is required");
      return;
    }

    // Basic format validation (alphanumeric, length check)
    if (sebiNumber.trim().length < 5) {
      setError("Please enter a valid SEBI registration number");
      return;
    }

    // TODO: API integration for SEBI number verification
    console.log("SEBI Number submitted:", sebiNumber);
    onGetStarted?.();

    // Reset and close
    setSebiNumber("");
    setError("");
    setShowForm(false);
    onClose();
  };

  const handleClose = () => {
    setSebiNumber("");
    setError("");
    setShowForm(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={handleClose}
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
            onClick={handleClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-purple-600" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-8">
          {!showForm ? (
            <div className="text-center">
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
                className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-8 py-3 rounded-lg"
              >
                Get Started
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">SEBI Registration</h3>
                <p className="text-sm text-gray-600">
                  Enter your SEBI registration number to continue
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sebiNumber" className="text-sm font-medium text-gray-700">
                  SEBI Registration Number
                </Label>
                <Input
                  id="sebiNumber"
                  type="text"
                  value={sebiNumber}
                  onChange={(e) => {
                    setSebiNumber(e.target.value);
                    setError("");
                  }}
                  placeholder="Enter your SEBI registration number"
                  className={`w-full ${error ? 'border-red-500' : ''}`}
                />
                {error && (
                  <p className="text-xs text-red-600 mt-1">{error}</p>
                )}
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowForm(false)}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-semibold"
                >
                  Submit
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default KycPrompt;
