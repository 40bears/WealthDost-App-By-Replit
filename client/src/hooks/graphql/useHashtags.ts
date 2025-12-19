import { useQuery } from '@apollo/client/react';
import { GET_MASTER_HASHTAGS, GET_USER_INTERESTS } from '@/graphql/hashtags/queries';
import { GetMasterHashtagsData, GetUserInterestsData } from '@/graphql/hashtags/types';

// Query Hooks
export const useMasterHashtags = () => {
  return useQuery<GetMasterHashtagsData>(GET_MASTER_HASHTAGS, {
    fetchPolicy: 'cache-and-network',
  });
};

export const useUserInterests = () => {
  return useQuery<GetUserInterestsData>(GET_USER_INTERESTS, {
    fetchPolicy: 'cache-and-network',
  });
};
