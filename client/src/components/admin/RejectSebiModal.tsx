import { X, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

interface RejectSebiModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  registrationNumber: string;
  expertName: string;
  isLoading?: boolean;
}

const REJECTION_REASONS = [
  "Invalid SEBI registration number format",
  "Registration number does not exist in SEBI database",
  "Mismatched user details",
  "Expired registration",
  "Other (specify below)",
];

const RejectSebiModal = ({
  isOpen,
  onClose,
  onConfirm,
  registrationNumber,
  expertName,
  isLoading = false,
}: RejectSebiModalProps) => {
  const [selectedReason, setSelectedReason] = useState("");
  const [customReason, setCustomReason] = useState("");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleConfirm = () => {
    const finalReason = selectedReason === "Other (specify below)" ? customReason : selectedReason;

    if (!finalReason.trim()) {
      setError("Please select or provide a rejection reason");
      return;
    }

    onConfirm(finalReason);
  };

  const handleClose = () => {
    setSelectedReason("");
    setCustomReason("");
    setError("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={handleClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md mx-auto overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4 border-b">
          <div className="flex items-center gap-2">
            <XCircle className="h-6 w-6 text-red-600" />
            <h2 className="text-xl font-semibold text-gray-900">Reject Registration</h2>
          </div>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            disabled={isLoading}
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          <p className="text-gray-700 mb-4">
            Please provide a reason for rejecting this SEBI registration.
          </p>

          <div className="bg-gray-50 rounded-lg p-4 mb-6 space-y-2">
            <div>
              <span className="text-sm font-medium text-gray-600">Expert:</span>
              <span className="ml-2 text-sm text-gray-900">{expertName}</span>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-600">SEBI Number:</span>
              <span className="ml-2 text-sm text-gray-900">{registrationNumber}</span>
            </div>
          </div>

          <div className="space-y-4 mb-6">
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">
                Rejection Reason
              </Label>
              <div className="space-y-2">
                {REJECTION_REASONS.map((reason) => (
                  <label
                    key={reason}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="reason"
                      value={reason}
                      checked={selectedReason === reason}
                      onChange={(e) => {
                        setSelectedReason(e.target.value);
                        setError("");
                      }}
                      className="text-purple-600 focus:ring-purple-500"
                      disabled={isLoading}
                    />
                    <span className="text-sm text-gray-700">{reason}</span>
                  </label>
                ))}
              </div>
            </div>

            {selectedReason === "Other (specify below)" && (
              <div>
                <Label htmlFor="customReason" className="text-sm font-medium text-gray-700 mb-2 block">
                  Custom Reason
                </Label>
                <Textarea
                  id="customReason"
                  value={customReason}
                  onChange={(e) => {
                    setCustomReason(e.target.value);
                    setError("");
                  }}
                  placeholder="Enter the reason for rejection..."
                  className="min-h-[100px]"
                  disabled={isLoading}
                />
              </div>
            )}

            {error && <p className="text-xs text-red-600">{error}</p>}
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-6">
            <p className="text-sm text-red-800">
              The expert will be notified and can resubmit with a new registration number.
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold"
              disabled={isLoading}
            >
              {isLoading ? "Rejecting..." : "Reject"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RejectSebiModal;
