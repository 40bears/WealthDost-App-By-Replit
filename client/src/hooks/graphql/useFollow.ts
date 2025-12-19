import { useQuery, useMutation } from '@apollo/client/react';
import { gql } from '@apollo/client';
import {
  GET_FOLLOWERS,
  GET_FOLLOWING,
  IS_FOLLOWING,
  GET_FOLLOWER_COUNT,
  GET_FOLLOWING_COUNT,
} from '@/graphql/follow/queries';
import {
  FOLLOW_USER,
  UNFOLLOW_USER,
} from '@/graphql/follow/mutations';

// Query Hooks
export const useFollowers = (userUuid: string, skip?: boolean) => {
  return useQuery(GET_FOLLOWERS, {
    variables: { userUuid },
    skip: skip || false,
    fetchPolicy: 'cache-and-network',
  });
};

export const useFollowing = (userUuid: string, skip?: boolean) => {
  return useQuery(GET_FOLLOWING, {
    variables: { userUuid },
    skip: skip || false,
    fetchPolicy: 'cache-and-network',
  });
};

export const useIsFollowing = (userUuid: string, skip?: boolean) => {
  return useQuery<{ isFollowing: boolean }, { userUuid: string }>(IS_FOLLOWING, {
    variables: { userUuid },
    skip: skip || false,
    fetchPolicy: 'cache-and-network',
  });
};

export const useFollowerCount = (userUuid: string, skip?: boolean) => {
  return useQuery(GET_FOLLOWER_COUNT, {
    variables: { userUuid },
    skip: skip || false,
    fetchPolicy: 'cache-and-network',
  });
};

export const useFollowingCount = (userUuid: string, skip?: boolean) => {
  return useQuery(GET_FOLLOWING_COUNT, {
    variables: { userUuid },
    skip: skip || false,
    fetchPolicy: 'cache-and-network',
  });
};

// Mutation Hooks
export const useFollowUser = () => {
  return useMutation(FOLLOW_USER, {
    update(cache, result, { variables }) {
      if (result.data && variables?.input?.userUuid) {
        const userUuid = variables.input.userUuid;

        // Update isFollowing query
        cache.writeQuery({
          query: IS_FOLLOWING,
          variables: { userUuid },
          data: { isFollowing: true },
        });

        // Increment follower count for the target user
        const followerCountQuery = cache.readQuery({
          query: GET_FOLLOWER_COUNT,
          variables: { userUuid },
        }) as { followerCount: number } | null;

        if (followerCountQuery) {
          cache.writeQuery({
            query: GET_FOLLOWER_COUNT,
            variables: { userUuid },
            data: { followerCount: followerCountQuery.followerCount + 1 },
          });
        }
      }
    },
  });
};

export const useUnfollowUser = () => {
  return useMutation(UNFOLLOW_USER, {
    update(cache, result, { variables }) {
      if (result.data && variables?.input?.userUuid) {
        const userUuid = variables.input.userUuid;

        // Update isFollowing query
        cache.writeQuery({
          query: IS_FOLLOWING,
          variables: { userUuid },
          data: { isFollowing: false },
        });

        // Decrement follower count for the target user
        const followerCountQuery = cache.readQuery({
          query: GET_FOLLOWER_COUNT,
          variables: { userUuid },
        }) as { followerCount: number } | null;

        if (followerCountQuery && followerCountQuery.followerCount > 0) {
          cache.writeQuery({
            query: GET_FOLLOWER_COUNT,
            variables: { userUuid },
            data: { followerCount: followerCountQuery.followerCount - 1 },
          });
        }
      }
    },
  });
};