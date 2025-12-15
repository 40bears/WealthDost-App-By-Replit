import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useAccountDeletion } from "@/hooks/graphql";
import { useAuth } from "@/components/auth/auth-context";
import { useNavigate } from "@tanstack/react-router";
import { useToast } from "@/hooks/use-toast";

interface AccountDeletionProps {
  deletionRequestedAt?: string | null;
}

export const AccountDeletion: React.FC<AccountDeletionProps> = ({
  deletionRequestedAt
}) => {
  const { requestDeletion, cancelDeletion, loading, error } = useAccountDeletion();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [scheduledDeletionDate, setScheduledDeletionDate] = useState<string | null>(null);

  const hasPendingDeletion = deletionRequestedAt !== null;

  const handleRequestDeletion = async () => {
    try {
      const { data } = await requestDeletion();
      if (data?.requestAccountDeletion?.deletionDate) {
        setScheduledDeletionDate(data.requestAccountDeletion.deletionDate);
        setShowConfirmation(false);
        setShowSuccessDialog(true);
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to request account deletion",
        variant: "destructive",
      });
    }
  };

  const handleCancelDeletion = async () => {
    try {
      const { data } = await cancelDeletion();
      if (data?.cancelAccountDeletion?.message) {
        toast({
          title: "Account deletion cancelled",
          description: data.cancelAccountDeletion.message,
        });
        // The component will automatically re-render when the query refetches
        // due to the mutation updating the cache
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to cancel account deletion",
        variant: "destructive",
      });
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate({ to: "/" });
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  if (hasPendingDeletion) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-base font-semibold text-gray-900 mb-4">Danger Zone</h3>

        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="space-y-3">
            <div>
              <h4 className="text-sm font-medium text-red-900">Account Deletion Pending</h4>
              <p className="text-sm text-red-700">
                Your account deletion was requested and will be processed soon.
              </p>
              <p className="text-xs text-red-600">
                You can cancel this request if you change your mind.
              </p>
            </div>
            <Button
              variant="outline"
              onClick={handleCancelDeletion}
              disabled={loading}
              className="text-red-600 border-red-600 hover:bg-red-50"
            >
              {loading ? "Cancelling..." : "Cancel Deletion"}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-base font-semibold text-gray-900 mb-4">Danger Zone</h3>

      <div className="space-y-4">
        <div className="p-4 border border-red-200 rounded-lg">
          <div className="space-y-3">
            <div>
              <h4 className="text-sm font-medium text-gray-900">Delete Account</h4>
              <p className="text-sm text-gray-600">
                Permanently delete your account and all associated data. This action cannot be undone after 7 days.
              </p>
            </div>

            <AlertDialog open={showConfirmation} onOpenChange={setShowConfirmation}>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" disabled={loading}>
                  Delete Account
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your account
                    and remove your data from our servers after a 7-day grace period.
                    <br /><br />
                    You can cancel this request within 7 days if you change your mind.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleRequestDeletion}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    {loading ? "Requesting..." : "Request Deletion"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            {/* Success Dialog */}
            <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Account Deletion Requested</AlertDialogTitle>
                  <AlertDialogDescription>
                    Your account deletion has been requested successfully.
                    {scheduledDeletionDate && (
                      <>
                        <br /><br />
                        Your account will be permanently deleted on {new Date(scheduledDeletionDate).toLocaleDateString()}.
                        <br />
                        You can cancel this request within 7 days.
                      </>
                    )}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogAction onClick={handleLogout}>
                    Logout Now
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        {error && (
          <div className="text-sm text-red-600 bg-red-50 p-3 rounded">
            {error.message}
          </div>
        )}
      </div>
    </div>
  );
};