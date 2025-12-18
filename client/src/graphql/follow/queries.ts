import { gql } from '@apollo/client';

export const GET_FOLLOWERS = gql`
  query GetFollowers($userUuid: String!) {
    followers(userUuid: $userUuid) {
      id
      uuid
      username
      firstName
      lastName
    }
  }
`;

export const GET_FOLLOWING = gql`
  query GetFollowing($userUuid: String!) {
    following(userUuid: $userUuid) {
      id
      uuid
      username
      firstName
      lastName
    }
  }
`;

export const IS_FOLLOWING = gql`
  query IsFollowing($userUuid: String!) {
    isFollowing(userUuid: $userUuid)
  }
`;

export const GET_FOLLOWER_COUNT = gql`
  query GetFollowerCount($userUuid: String!) {
    followerCount(userUuid: $userUuid)
  }
`;

export const GET_FOLLOWING_COUNT = gql`
  query GetFollowingCount($userUuid: String!) {
    followingCount(userUuid: $userUuid)
  }
`;
