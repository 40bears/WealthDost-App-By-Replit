import { X, TrendingUp, CheckCircle2, Clock, XCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { useMySebiRegistration, useSubmitSebiRegistration } from "@/hooks/graphql";
import { useToast } from "@/hooks/use-toast";

interface KycPromptProps {
  isOpen: boolean;
  onClose: () => void;
  onGetStarted?: () => void;
}

const KycPrompt = ({ isOpen, onClose, onGetStarted }: KycPromptProps) => {
  const [showForm, setShowForm] = useState(false);
  const [sebiNumber, setSebiNumber] = useState("");
  const [error, setError] = useState("");
  const { toast } = useToast();

  const { data: registrationData, loading: fetchingRegistration, refetch } = useMySebiRegistration();
  const [submitRegistration, { loading: submitting }] = useSubmitSebiRegistration();

  const existingRegistration = registrationData?.mySebiRegistration;

  // Refetch registration data when modal opens
  useEffect(() => {
    if (isOpen) {
      refetch();
    }
  }, [isOpen, refetch]);

  if (!isOpen) return null;

  const handleGetStarted = () => {
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
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

    try {
      const response = await submitRegistration({
        variables: {
          registrationNumber: sebiNumber.trim(),
        },
      });

      if (response.data?.submitSebiRegistration) {
        toast({
          title: "Success",
          description: "Your SEBI registration has been submitted for verification.",
        });

        // Reset and close
        setSebiNumber("");
        setError("");
        setShowForm(false);
        onGetStarted?.();
      }
    } catch (err: any) {
      setError(err.message || "Failed to submit registration. Please try again.");
      toast({
        title: "Error",
        description: err.message || "Failed to submit registration",
        variant: "destructive",
      });
    }
  };

  const handleClose = () => {
    setSebiNumber("");
    setError("");
    setShowForm(false);
    onClose();
  };

  const handleResubmit = () => {
    setShowForm(true);
    setSebiNumber("");
    setError("");
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
          {fetchingRegistration ? (
            <div className="text-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-purple-600 mx-auto mb-4" />
              <p className="text-gray-600">Loading registration status...</p>
            </div>
          ) : existingRegistration?.status === 'APPROVED' ? (
            <div className="text-center">
              <CheckCircle2 className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Verified!</h3>
              <p className="text-gray-700 mb-4">
                Your SEBI registration has been approved.
              </p>
              <p className="text-sm text-gray-600 mb-6">
                Registration Number: <span className="font-semibold">{existingRegistration.registrationNumber}</span>
              </p>
              <Button
                onClick={handleClose}
                className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-8 py-3 rounded-lg"
              >
                Close
              </Button>
            </div>
          ) : existingRegistration?.status === 'PENDING' ? (
            <div className="text-center">
              <Clock className="h-16 w-16 text-orange-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Awaiting Approval</h3>
              <p className="text-gray-700 mb-4">
                Your SEBI registration is under review.
              </p>
              <p className="text-sm text-gray-600 mb-6">
                Registration Number: <span className="font-semibold">{existingRegistration.registrationNumber}</span>
              </p>
              <p className="text-sm text-gray-500 mb-6">
                We'll notify you once your registration is verified.
              </p>
              <Button
                onClick={handleClose}
                variant="outline"
                className="px-8 py-3"
              >
                Close
              </Button>
            </div>
          ) : existingRegistration?.status === 'REJECTED' ? (
            <div className="text-center">
              <XCircle className="h-16 w-16 text-red-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Registration Rejected</h3>
              <p className="text-gray-700 mb-4">
                Your SEBI registration was not approved.
              </p>
              {existingRegistration.rejectionReason && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <p className="text-sm text-red-800">
                    <span className="font-semibold">Reason:</span> {existingRegistration.rejectionReason}
                  </p>
                </div>
              )}
              <p className="text-sm text-gray-600 mb-6">
                Previous Registration Number: <span className="font-semibold">{existingRegistration.registrationNumber}</span>
              </p>
              <div className="flex gap-3">
                <Button
                  onClick={handleClose}
                  variant="outline"
                  className="flex-1"
                >
                  Close
                </Button>
                <Button
                  onClick={handleResubmit}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-semibold"
                >
                  Resubmit
                </Button>
              </div>
            </div>
          ) : !showForm ? (
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
                  disabled={submitting}
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
                  disabled={submitting}
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-semibold"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Submitting...
                    </>
                  ) : (
                    'Submit'
                  )}
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
