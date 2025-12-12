import { useState } from "react";
import { usePendingSebiRegistrations, useApproveSebiRegistration, useRejectSebiRegistration, type PendingSebiRegistration } from "@/hooks/graphql";
import { useToast } from "@/hooks/use-toast";
import ApproveSebiModal from "@/components/admin/ApproveSebiModal";
import RejectSebiModal from "@/components/admin/RejectSebiModal";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Loader2, ChevronLeft, ChevronRight, Calendar, User, Hash } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const PendingSebiApprovals = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedRegistration, setSelectedRegistration] = useState<PendingSebiRegistration | null>(null);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);

  const { toast } = useToast();
  const limit = 20;
  const offset = currentPage * limit;

  const { data, loading, error, refetch } = usePendingSebiRegistrations(limit, offset);
  const [approveRegistration, { loading: approving }] = useApproveSebiRegistration();
  const [rejectRegistration, { loading: rejecting }] = useRejectSebiRegistration();

  const registrations = data?.pendingSebiRegistrations || [];

  const handleApprove = (registration: PendingSebiRegistration) => {
    setSelectedRegistration(registration);
    setShowApproveModal(true);
  };

  const handleReject = (registration: PendingSebiRegistration) => {
    setSelectedRegistration(registration);
    setShowRejectModal(true);
  };

  const confirmApprove = async () => {
    if (!selectedRegistration) return;

    try {
      await approveRegistration({
        variables: {
          registrationId: selectedRegistration.id,
        },
      });

      toast({
        title: "Registration Approved",
        description: `${selectedRegistration.user.firstName} ${selectedRegistration.user.lastName}'s SEBI registration has been approved. KYC status updated.`,
      });

      setShowApproveModal(false);
      setSelectedRegistration(null);
      refetch();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to approve registration",
        variant: "destructive",
      });
    }
  };

  const confirmReject = async (reason: string) => {
    if (!selectedRegistration) return;

    try {
      await rejectRegistration({
        variables: {
          registrationId: selectedRegistration.id,
          reason,
        },
      });

      toast({
        title: "Registration Rejected",
        description: `${selectedRegistration.user.firstName} ${selectedRegistration.user.lastName}'s SEBI registration has been rejected. Expert can resubmit.`,
      });

      setShowRejectModal(false);
      setSelectedRegistration(null);
      refetch();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to reject registration",
        variant: "destructive",
      });
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <XCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-red-900 mb-2">Error Loading Registrations</h3>
            <p className="text-red-700 mb-4">{error.message}</p>
            <Button onClick={() => refetch()} variant="outline">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Pending SEBI Approvals</h1>
          <p className="text-sm text-gray-600 mt-1">
            Review and verify expert SEBI registrations
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-6">
        {loading ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Loader2 className="h-12 w-12 animate-spin text-purple-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading pending registrations...</p>
          </div>
        ) : registrations.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">All Caught Up!</h3>
            <p className="text-gray-600">No pending SEBI registrations at the moment.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Table */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Expert Details
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        SEBI Number
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Submitted
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {registrations.map((registration) => (
                      <tr key={registration.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                              <User className="h-5 w-5 text-purple-600" />
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-gray-900">
                                {registration.user.firstName} {registration.user.lastName}
                              </p>
                              <p className="text-xs text-gray-600">@{registration.user.username}</p>
                              <p className="text-xs text-gray-500">{registration.user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Hash className="h-4 w-4 text-gray-400" />
                            <span className="text-sm font-mono text-gray-900">
                              {registration.registrationNumber}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span>
                              {formatDistanceToNow(new Date(registration.createdAt), {
                                addSuffix: true,
                              })}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleReject(registration)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleApprove(registration)}
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between bg-white rounded-lg shadow-sm px-6 py-4">
              <p className="text-sm text-gray-600">
                Showing {offset + 1} to {Math.min(offset + limit, offset + registrations.length)} results
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                  disabled={currentPage === 0}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => p + 1)}
                  disabled={registrations.length < limit}
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {selectedRegistration && (
        <>
          <ApproveSebiModal
            isOpen={showApproveModal}
            onClose={() => {
              setShowApproveModal(false);
              setSelectedRegistration(null);
            }}
            onConfirm={confirmApprove}
            registrationNumber={selectedRegistration.registrationNumber}
            expertName={`${selectedRegistration.user.firstName} ${selectedRegistration.user.lastName}`}
            isLoading={approving}
          />
          <RejectSebiModal
            isOpen={showRejectModal}
            onClose={() => {
              setShowRejectModal(false);
              setSelectedRegistration(null);
            }}
            onConfirm={confirmReject}
            registrationNumber={selectedRegistration.registrationNumber}
            expertName={`${selectedRegistration.user.firstName} ${selectedRegistration.user.lastName}`}
            isLoading={rejecting}
          />
        </>
      )}
    </div>
  );
};

export default PendingSebiApprovals;
