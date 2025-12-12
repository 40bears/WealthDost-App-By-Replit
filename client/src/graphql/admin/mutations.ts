import { gql } from '@apollo/client';

export const APPROVE_SEBI_REGISTRATION = gql`
  mutation ApproveSebiRegistration($registrationId: String!) {
    approveSebiRegistration(input: { registrationId: $registrationId }) {
      id
      registrationNumber
      status
      verifiedAt
      verifiedByAdmin {
        id
        username
        firstName
        lastName
      }
      user {
        id
        username
        kycStatus
      }
    }
  }
`;

export const REJECT_SEBI_REGISTRATION = gql`
  mutation RejectSebiRegistration($registrationId: String!, $reason: String!) {
    rejectSebiRegistration(input: {
      registrationId: $registrationId,
      reason: $reason
    }) {
      id
      registrationNumber
      status
      rejectionReason
      verifiedAt
      verifiedByAdmin {
        id
        username
        firstName
        lastName
      }
      user {
        id
        username
        kycStatus
      }
    }
  }
`;
