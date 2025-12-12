import { X, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ApproveSebiModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  registrationNumber: string;
  expertName: string;
  isLoading?: boolean;
}

const ApproveSebiModal = ({
  isOpen,
  onClose,
  onConfirm,
  registrationNumber,
  expertName,
  isLoading = false,
}: ApproveSebiModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md mx-auto overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4 border-b">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-6 w-6 text-green-600" />
            <h2 className="text-xl font-semibold text-gray-900">Approve Registration</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            disabled={isLoading}
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          <p className="text-gray-700 mb-4">
            Are you sure you want to approve this SEBI registration?
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

          <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-6">
            <p className="text-sm text-green-800">
              This action will update the expert's KYC status and allow them to post stock tips.
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={onConfirm}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold"
              disabled={isLoading}
            >
              {isLoading ? "Approving..." : "Approve"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApproveSebiModal;
