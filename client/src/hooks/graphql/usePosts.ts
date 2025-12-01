import { useQuery, useMutation } from '@apollo/client/react';
import {
  GET_POSTS,
  GET_POST,
  GET_MY_POSTS,
  GET_POST_COMMENTS,
} from '@/graphql/posts/queries';
import {
  CREATE_POST,
  UPDATE_POST,
  DELETE_POST,
  // LIKE_POST,
  // UNLIKE_POST,
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

// TODO: Uncomment these hooks when the backend mutations are implemented
// export const useLikePost = () => {
//   return useMutation(LIKE_POST, {
//     // Optimistic response for better UX
//     optimisticResponse: (vars: any) => ({
//       likePost: {
//         __typename: 'Post',
//         id: vars.postId,
//         likesCount: 0, // Will be updated by actual response
//         isLiked: true,
//       },
//     }),
//   });
// };

// export const useUnlikePost = () => {
//   return useMutation(UNLIKE_POST, {
//     // Optimistic response for better UX
//     optimisticResponse: (vars: any) => ({
//       unlikePost: {
//         __typename: 'Post',
//         id: vars.postId,
//         likesCount: 0, // Will be updated by actual response
//         isLiked: false,
//       },
//     }),
//   });
// };

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
