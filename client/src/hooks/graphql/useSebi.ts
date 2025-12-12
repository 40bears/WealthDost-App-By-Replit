import { useMutation, useQuery } from '@apollo/client/react';
import { SUBMIT_SEBI_REGISTRATION } from '@/graphql/sebi/mutations';
import { MY_SEBI_REGISTRATION } from '@/graphql/sebi/queries';

export interface SebiRegistration {
  id: string;
  registrationNumber: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  rejectionReason?: string | null;
  verifiedAt?: string | null;
  createdAt: string;
  updatedAt?: string;
}

export interface MySebiRegistrationResponse {
  mySebiRegistration: SebiRegistration | null;
}

export interface SubmitSebiRegistrationVariables {
  registrationNumber: string;
}

export interface SubmitSebiRegistrationResponse {
  submitSebiRegistration: SebiRegistration;
}

export const useMySebiRegistration = () => {
  return useQuery<MySebiRegistrationResponse>(MY_SEBI_REGISTRATION, {
    fetchPolicy: 'cache-and-network',
  });
};

export const useSubmitSebiRegistration = () => {
  return useMutation<SubmitSebiRegistrationResponse, SubmitSebiRegistrationVariables>(
    SUBMIT_SEBI_REGISTRATION,
    {
      refetchQueries: [{ query: MY_SEBI_REGISTRATION }],
    }
  );
};
