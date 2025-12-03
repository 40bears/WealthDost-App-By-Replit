import { gql } from '@apollo/client';

export const CREATE_POST = gql`
  mutation CreatePost($input: CreatePostDto!) {
    createPost(input: $input) {
      id
      content
      createdAt
      tribeId
      tribe {
        id
        name
        description
      }
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
  mutation UpdatePost($id: String!, $input: UpdatePostDto!) {
    updatePost(id: $id, input: $input) {
      id
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
  mutation DeletePost($id: String!) {
    deletePost(id: $id)
  }
`;

export const LIKE_POST = gql`
  mutation LikePost($postId: String!) {
    likePost(postId: $postId) {
      id
      createdAt
    }
  }
`;

export const UNLIKE_POST = gql`
  mutation UnlikePost($postId: String!) {
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
