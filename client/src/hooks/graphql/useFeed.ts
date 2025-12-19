import { useQuery } from '@apollo/client/react';
import { GET_FEED } from '@/graphql/feed/queries';
import type { FeedResponse, FeedVariables } from '@/graphql/feed/types';

export const useFeed = (variables: FeedVariables) => {
  return useQuery<FeedResponse, FeedVariables>(GET_FEED, {
    variables,
    fetchPolicy: 'cache-and-network',
  });
};
