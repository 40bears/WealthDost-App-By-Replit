import { gql } from '@apollo/client';

export const CREATE_POST = gql`
  mutation CreatePost($input: CreatePostDto!) {
    createPost(input: $input) {
      id
      uuid
      content
      createdAt
      user {
        id
        firstName
        lastName
      }
      image {
        id
        path
      }
    }
  }
`;

export const UPDATE_POST = gql`
  mutation UpdatePost($id: Int!, $input: UpdatePostDto!) {
    updatePost(id: $id, input: $input) {
      id
      uuid
      content
      createdAt
      user {
        id
        firstName
        lastName
      }
      image {
        id
        path
      }
    }
  }
`;

export const DELETE_POST = gql`
  mutation DeletePost($id: Int!) {
    deletePost(id: $id)
  }
`;

export const LIKE_POST = gql`
  mutation LikePost($postId: Int!) {
    likePost(postId: $postId) {
      id
      uuid
      createdAt
    }
  }
`;

export const UNLIKE_POST = gql`
  mutation UnlikePost($postId: Int!) {
    unlikePost(postId: $postId)
  }
`;

// export const CREATE_COMMENT = gql`
//   mutation CreateComment($postId: Int!, $input: CreateCommentDto!) {
//     createComment(postId: $postId, input: $input) {
//       id
//       content
//       user {
//         id
//         firstName
//         lastName
//       }
//       createdAt
//     }
//   }
// `;

// export const UPDATE_COMMENT = gql`
//   mutation UpdateComment($postId: Int!, $commentId: Int!, $input: UpdateCommentDto!) {
//     updateComment(postId: $postId, commentId: $commentId, input: $input) {
//       id
//       content
//       updatedAt
//     }
//   }
// `;

// export const DELETE_COMMENT = gql`
//   mutation DeleteComment($postId: Int!, $commentId: Int!) {
//     deleteComment(postId: $postId, commentId: $commentId)
//   }
// `;
