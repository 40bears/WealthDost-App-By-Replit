import { gql } from '@apollo/client';

export const UPDATE_MY_PROFILE = gql`
  mutation UpdateMyProfile($input: UpdateUserProfileDto!) {
    updateMyProfile(input: $input) {
      id
      uuid
      email
      firstName
      lastName
      fullName
      profileBio
      updatedAt
    }
  }
`;
