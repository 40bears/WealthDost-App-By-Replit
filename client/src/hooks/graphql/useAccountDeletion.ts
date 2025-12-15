import { useMutation } from '@apollo/client/react';
import { gql } from '@apollo/client';

// Types
interface RequestDeletionResponse {
  requestAccountDeletion: {
    deletionDate: string;
  };
}

interface CancelDeletionResponse {
  cancelAccountDeletion: {
    message: string;
  };
}

// Mutation for requesting account deletion
const REQUEST_ACCOUNT_DELETION = gql`
  mutation RequestAccountDeletion {
    requestAccountDeletion {
      deletionDate
    }
  }
`;

// Mutation for canceling account deletion
const CANCEL_ACCOUNT_DELETION = gql`
  mutation CancelAccountDeletion {
    cancelAccountDeletion {
      message
    }
  }
`;

// Hook for account deletion operations
export function useAccountDeletion() {
  const [requestDeletion, { loading: requestLoading, error: requestError }] = useMutation<RequestDeletionResponse>(REQUEST_ACCOUNT_DELETION);
  const [cancelDeletion, { loading: cancelLoading, error: cancelError }] = useMutation<CancelDeletionResponse>(
    CANCEL_ACCOUNT_DELETION,
    {
      refetchQueries: ['MyProfile'], // Refetch the profile query after cancellation
    }
  );

  return {
    requestDeletion,
    cancelDeletion,
    loading: requestLoading || cancelLoading,
    error: requestError || cancelError,
  };
}