import { useMutation, useQuery } from '@apollo/client/react';
import { PENDING_SEBI_REGISTRATIONS, SEBI_REGISTRATION_BY_ID } from '@/graphql/admin/queries';
import { APPROVE_SEBI_REGISTRATION, REJECT_SEBI_REGISTRATION } from '@/graphql/admin/mutations';

export interface AdminUser {
  id: string;
  uuid: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  kycStatus: boolean;
}

export interface VerifiedByAdmin {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
}

export interface PendingSebiRegistration {
  id: string;
  registrationNumber: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  updatedAt: string;
  user: AdminUser;
}

export interface SebiRegistrationDetail extends PendingSebiRegistration {
  rejectionReason?: string | null;
  verifiedAt?: string | null;
  verifiedByAdmin?: VerifiedByAdmin | null;
}

export interface PendingSebiRegistrationsResponse {
  pendingSebiRegistrations: PendingSebiRegistration[];
}

export interface SebiRegistrationByIdResponse {
  sebiRegistrationById: SebiRegistrationDetail;
}

export interface PendingSebiRegistrationsVariables {
  limit?: number;
  offset?: number;
}

export interface ApproveSebiRegistrationVariables {
  registrationId: string;
}

export interface RejectSebiRegistrationVariables {
  registrationId: string;
  reason: string;
}

export interface ApproveSebiRegistrationResponse {
  approveSebiRegistration: SebiRegistrationDetail;
}

export interface RejectSebiRegistrationResponse {
  rejectSebiRegistration: SebiRegistrationDetail;
}

export const usePendingSebiRegistrations = (limit = 20, offset = 0) => {
  return useQuery<PendingSebiRegistrationsResponse, PendingSebiRegistrationsVariables>(
    PENDING_SEBI_REGISTRATIONS,
    {
      variables: { limit, offset },
      fetchPolicy: 'cache-and-network',
    }
  );
};

export const useSebiRegistrationById = (id: string) => {
  return useQuery<SebiRegistrationByIdResponse, { id: string }>(SEBI_REGISTRATION_BY_ID, {
    variables: { id },
    fetchPolicy: 'cache-and-network',
    skip: !id,
  });
};

export const useApproveSebiRegistration = () => {
  return useMutation<ApproveSebiRegistrationResponse, ApproveSebiRegistrationVariables>(
    APPROVE_SEBI_REGISTRATION,
    {
      refetchQueries: [{ query: PENDING_SEBI_REGISTRATIONS, variables: { limit: 20, offset: 0 } }],
    }
  );
};

export const useRejectSebiRegistration = () => {
  return useMutation<RejectSebiRegistrationResponse, RejectSebiRegistrationVariables>(
    REJECT_SEBI_REGISTRATION,
    {
      refetchQueries: [{ query: PENDING_SEBI_REGISTRATIONS, variables: { limit: 20, offset: 0 } }],
    }
  );
};
