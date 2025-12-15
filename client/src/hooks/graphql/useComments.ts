import { useQuery, useMutation } from '@apollo/client/react';
import {
  GET_COMMENTS,
  GET_REPLIES,
  GET_COMMENT,
  GET_COMMENT_THREAD,
  GET_MY_COMMENTS,
} from '@/graphql/comments/queries';
import {
  CREATE_COMMENT,
  LIKE_COMMENT,
  UNLIKE_COMMENT,
  DELETE_COMMENT,
} from '@/graphql/comments/mutations';

// Query Hooks
export const useComments = (commentableType: string, commentableId: string, sortOrder?: string, skip?: boolean) => {
  return useQuery(GET_COMMENTS, {
    variables: {
      commentableType,
      commentableId,
      sortOrder: sortOrder || 'newest',
    },
    skip: skip || false,
    fetchPolicy: 'cache-and-network',
  });
};

export const useReplies = (parentId: string, sortOrder?: string, skip?: boolean) => {
  return useQuery(GET_REPLIES, {
    variables: {
      parentId,
      sortOrder: sortOrder || 'oldest',
    },
    skip: skip || false,
    fetchPolicy: 'cache-and-network',
  });
};

export const useComment = (id: string) => {
  return useQuery(GET_COMMENT, {
    variables: { id },
    fetchPolicy: 'cache-and-network',
  });
};

export const useCommentThread = (commentId: string) => {
  return useQuery(GET_COMMENT_THREAD, {
    variables: { commentId },
    fetchPolicy: 'cache-and-network',
  });
};

export const useMyComments = () => {
  return useQuery(GET_MY_COMMENTS, {
    fetchPolicy: 'cache-and-network',
  });
};

// Mutation Hooks
export const useCreateComment = () => {
  return useMutation(CREATE_COMMENT);
};

export const useLikeComment = () => {
  return useMutation(LIKE_COMMENT, {
    optimisticResponse: {
      likeComment: true,
    },
    update(cache, result, { variables }) {
      if (result.data && variables?.commentId) {
        cache.modify({
          id: cache.identify({ __typename: 'Comment', id: variables.commentId }),
          fields: {
            isLikedByMe() {
              return true;
            },
            likeCount(existingCount = 0) {
              return existingCount + 1;
            },
          },
        });
      }
    },
  });
};

export const useUnlikeComment = () => {
  return useMutation(UNLIKE_COMMENT, {
    optimisticResponse: {
      unlikeComment: true,
    },
    update(cache, result, { variables }) {
      if (result.data && variables?.commentId) {
        cache.modify({
          id: cache.identify({ __typename: 'Comment', id: variables.commentId }),
          fields: {
            isLikedByMe() {
              return false;
            },
            likeCount(existingCount = 0) {
              return Math.max(0, existingCount - 1);
            },
          },
        });
      }
    },
  });
};

export const useDeleteComment = () => {
  return useMutation(DELETE_COMMENT);
};
