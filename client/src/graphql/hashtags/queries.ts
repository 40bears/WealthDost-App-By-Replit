import { gql } from '@apollo/client';

export const GET_MASTER_HASHTAGS = gql`
  query GetMasterHashtags {
    masterHashtags {
      id
      tag
      createdAt
      updatedAt
    }
  }
`;

export const GET_USER_INTERESTS = gql`
  query GetUserInterests {
    userInterests {
      id
      tag
      createdAt
      updatedAt
    }
  }
`;
