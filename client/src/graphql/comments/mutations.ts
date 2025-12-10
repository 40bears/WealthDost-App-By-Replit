import { gql } from '@apollo/client';

export const CREATE_COMMENT = gql`
  mutation CreateComment($input: CreateCommentDto!) {
    createComment(input: $input) {
      id
      content
      commentableType
      commentableId
      parentId
      user {
        id
        firstName
        lastName
        username
      }
      likeCount
      replyCount
      isLikedByMe
      createdAt
    }
  }
`;

export const LIKE_COMMENT = gql`
  mutation LikeComment($commentId: String!) {
    likeComment(commentId: $commentId)
  }
`;

export const UNLIKE_COMMENT = gql`
  mutation UnlikeComment($commentId: String!) {
    unlikeComment(commentId: $commentId)
  }
`;

export const DELETE_COMMENT = gql`
  mutation DeleteComment($commentId: String!) {
    deleteComment(commentId: $commentId)
  }
`;
