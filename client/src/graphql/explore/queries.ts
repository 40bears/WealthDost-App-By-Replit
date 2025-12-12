import { gql } from '@apollo/client';

export const EXPLORE = gql`
  query Explore($query: String!, $type: ExploreType, $limit: Int) {
    explore(query: $query, type: $type, limit: $limit) {
      ... on ExploreUserResult {
        _type
        user {
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
        }
      }
      ... on ExplorePostResult {
        _type
        post {
          id
          content
          createdAt
          likeCount
          commentCount
          isLikedByMe
          tribeId
          user {
            id
            username
            firstName
            lastName
            email
          }
          image {
            id
            path
            publicUrl
          }
          tribe {
            id
            name
            description
          }
        }
      }
    }
  }
`;
