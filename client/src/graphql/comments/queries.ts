import { gql } from '@apollo/client';

export const GET_COMMENTS = gql`
  query GetComments($commentableType: CommentableType!, $commentableId: String!, $sortOrder: String) {
    comments(
      commentableType: $commentableType
      commentableId: $commentableId
      sortOrder: $sortOrder
    ) {
      id
      content
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

export const GET_REPLIES = gql`
  query GetReplies($parentId: String!, $sortOrder: String) {
    replies(
      parentId: $parentId
      sortOrder: $sortOrder
    ) {
      id
      content
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

export const GET_COMMENT = gql`
  query GetComment($id: String!) {
    comment(id: $id) {
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

export const GET_COMMENT_THREAD = gql`
  query GetCommentThread($commentId: String!) {
    commentThread(commentId: $commentId) {
      id
      content
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

export const GET_MY_COMMENTS = gql`
  query GetMyComments {
    myComments {
      id
      content
      commentableType
      commentableId
      parentId
      likeCount
      replyCount
      createdAt
    }
  }
`;
