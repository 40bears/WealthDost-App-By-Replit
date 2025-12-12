import { gql } from '@apollo/client';

export const PENDING_SEBI_REGISTRATIONS = gql`
  query PendingSebiRegistrations($limit: Int, $offset: Int) {
    pendingSebiRegistrations(limit: $limit, offset: $offset) {
      id
      registrationNumber
      status
      createdAt
      updatedAt
      user {
        id
        username
        firstName
        lastName
        email
        phone
        kycStatus
      }
    }
  }
`;

export const SEBI_REGISTRATION_BY_ID = gql`
  query SebiRegistrationById($id: String!) {
    sebiRegistrationById(id: $id) {
      id
      registrationNumber
      status
      rejectionReason
      verifiedAt
      createdAt
      updatedAt
      user {
        id
        uuid
        username
        firstName
        lastName
        email
        phone
        kycStatus
      }
      verifiedByAdmin {
        id
        username
        firstName
        lastName
      }
    }
  }
`;
