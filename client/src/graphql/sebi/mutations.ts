import { gql } from '@apollo/client';

export const SUBMIT_SEBI_REGISTRATION = gql`
  mutation SubmitSebiRegistration($registrationNumber: String!) {
    submitSebiRegistration(input: { registrationNumber: $registrationNumber }) {
      id
      registrationNumber
      status
      rejectionReason
      createdAt
      updatedAt
    }
  }
`;
