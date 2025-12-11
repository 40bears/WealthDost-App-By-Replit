import { useQuery } from '@apollo/client/react';
import { EXPLORE } from '@/graphql/explore/queries';

export enum ExploreType {
  USER = 'USER',
  POST = 'POST',
}

export interface ExploreUser {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  isActive: boolean;
  roles?: string[];
  kycStatus: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ExplorePost {
  id: string;
  content: string;
  createdAt: string;
  likeCount: number;
  commentCount: number;
  isLikedByMe: boolean;
  tribeId?: number;
  user: {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    email?: string;
  };
  image?: {
    id: string;
    path: string;
    publicUrl?: string;
  };
  tribe?: {
    id: string;
    name: string;
    description?: string;
  };
}

export interface ExploreUserResult {
  _type: 'USER';
  user: ExploreUser;
}

export interface ExplorePostResult {
  _type: 'POST';
  post: ExplorePost;
}

export type ExploreResult = ExploreUserResult | ExplorePostResult;

export const useExplore = (query: string, type?: ExploreType, limit: number = 20) => {
  return useQuery<{ explore: ExploreResult[] }>(EXPLORE, {
    variables: {
      query,
      type,
      limit,
    },
    skip: !query || query.trim().length === 0,
    fetchPolicy: 'cache-and-network',
  });
};
