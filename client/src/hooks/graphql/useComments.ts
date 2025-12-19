import { useQuery, useMutation } from '@apollo/client/react';
import { gql } from '@apollo/client';
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
  return useQuery<{ comments: any[] }>(GET_COMMENTS, {
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
  return useQuery<{ replies: any[] }>(GET_REPLIES, {
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
  return useMutation(CREATE_COMMENT, {
    update(cache, result, { variables }) {
      if (result.data && (result.data as any).createComment && variables?.input) {
        const { commentableType, commentableId, parentId } = variables.input;
        // Only increment commentCount for top-level comments, not replies
        if (!parentId) {
          const typename = commentableType === 'POST' ? 'Post' : 'StockTip';

          cache.modify({
            id: cache.identify({ __typename: typename, id: commentableId }),
            fields: {
              commentCount(existingCount = 0) {
                return existingCount + 1;
              },
            },
          });
        }
      }
    },
  });
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
  return useMutation(DELETE_COMMENT, {
    update(cache, result, { variables }) {
      if (result.data && variables?.commentId) {
        // Read the comment from cache to get commentable info
        const commentId = cache.identify({ __typename: 'Comment', id: variables.commentId });
        const commentFragment = cache.readFragment({
          id: commentId,
          fragment: gql`
            fragment CommentFragment on Comment {
              commentableType
              commentableId
              parentId
            }
          `,
        }) as { commentableType: string; commentableId: string; parentId?: string } | null;

        if (commentFragment && !commentFragment.parentId) { // Only decrement for top-level comments
          const { commentableType, commentableId } = commentFragment;
          const typename = commentableType === 'POST' ? 'Post' : 'StockTip';

          cache.modify({
            id: cache.identify({ __typename: typename, id: commentableId }),
            fields: {
              commentCount(existingCount = 0) {
                return Math.max(0, existingCount - 1);
              },
            },
          });
        }
      }
    },
  });
};
