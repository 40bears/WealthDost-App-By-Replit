import { gql } from '@apollo/client';

export const GET_EXPERTS = gql`
  query GetExperts($industrySector: String) {
    experts(industrySector: $industrySector) {
      id
      username
      firstName
      lastName
      email
      phone
      isActive
      roles
      kycStatus
      createdAt
      updatedAt
      profile {
        profileBio
        industrySectors
        experienceLevel
        interests
        topics
        specializations
        achievements
      }
    }
  }
`;
