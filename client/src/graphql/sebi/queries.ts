import { gql } from '@apollo/client';

export const MY_SEBI_REGISTRATION = gql`
  query MySebiRegistration {
    mySebiRegistration {
      id
      registrationNumber
      status
      rejectionReason
      verifiedAt
      createdAt
    }
  }
`;
