import { useQuery, useMutation } from '@apollo/client/react';
import {
  GET_POSTS,
  GET_POST,
  GET_MY_POSTS,
  GET_POST_COMMENTS,
  GET_PUBLIC_POSTS,
  GET_TRIBE_POSTS,
  GET_MY_FEED,
} from '@/graphql/posts/queries';
import {
  CREATE_POST,
  UPDATE_POST,
  DELETE_POST,
  LIKE_POST,
  UNLIKE_POST,
  // CREATE_COMMENT,
  // UPDATE_COMMENT,
  // DELETE_COMMENT,
} from '@/graphql/posts/mutations';

// Query Hooks
export const usePosts = () => {
  return useQuery(GET_POSTS, {
    fetchPolicy: 'cache-and-network',
  });
};

export const usePost = (id: number) => {
  return useQuery(GET_POST, {
    variables: { id },
    skip: !id,
  });
};

export const useMyPosts = () => {
  return useQuery(GET_MY_POSTS, {
    fetchPolicy: 'cache-and-network',
  });
};

export const usePostComments = (postId: number) => {
  return useQuery(GET_POST_COMMENTS, {
    variables: { postId },
    skip: !postId,
  });
};

export const usePublicPosts = () => {
  return useQuery(GET_PUBLIC_POSTS, {
    fetchPolicy: 'cache-and-network',
  });
};

export const useTribePosts = (tribeId: number) => {
  return useQuery(GET_TRIBE_POSTS, {
    variables: { tribeId },
    skip: !tribeId,
    fetchPolicy: 'cache-and-network',
  });
};

export const useMyFeed = () => {
  return useQuery(GET_MY_FEED, {
    fetchPolicy: 'cache-and-network',
  });
};

// Mutation Hooks
export const useCreatePost = () => {
  return useMutation(CREATE_POST, {
    refetchQueries: [GET_POSTS, GET_MY_POSTS],
    awaitRefetchQueries: true,
  });
};

export const useUpdatePost = () => {
  return useMutation(UPDATE_POST, {
    refetchQueries: [GET_POSTS, GET_MY_POSTS, GET_POST],
    awaitRefetchQueries: true,
  });
};

export const useDeletePost = () => {
  return useMutation(DELETE_POST, {
    refetchQueries: [GET_POSTS, GET_MY_POSTS],
    awaitRefetchQueries: true,
  });
};

export const useLikePost = () => {
  return useMutation(LIKE_POST, {
    refetchQueries: [GET_POSTS, GET_MY_POSTS, GET_POST],
    awaitRefetchQueries: true,
  });
};

export const useUnlikePost = () => {
  return useMutation(UNLIKE_POST, {
    refetchQueries: [GET_POSTS, GET_MY_POSTS, GET_POST],
    awaitRefetchQueries: true,
  });
};

// export const useCreateComment = () => {
//   return useMutation(CREATE_COMMENT, {
//     refetchQueries: [GET_POST_COMMENTS, GET_POST],
//     awaitRefetchQueries: true,
//   });
// };

// export const useUpdateComment = () => {
//   return useMutation(UPDATE_COMMENT, {
//     refetchQueries: [GET_POST_COMMENTS],
//     awaitRefetchQueries: true,
//   });
// };

// export const useDeleteComment = () => {
//   return useMutation(DELETE_COMMENT, {
//     refetchQueries: [GET_POST_COMMENTS, GET_POST],
//     awaitRefetchQueries: true,
//   });
// };
