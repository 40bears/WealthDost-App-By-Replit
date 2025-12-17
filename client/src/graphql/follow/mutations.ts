import { gql } from '@apollo/client';

export const FOLLOW_USER = gql`
  mutation FollowUser($input: FollowUserDto!) {
    followUser(input: $input)
  }
`;

export const UNFOLLOW_USER = gql`
  mutation UnfollowUser($input: FollowUserDto!) {
    unfollowUser(input: $input)
  }
`;