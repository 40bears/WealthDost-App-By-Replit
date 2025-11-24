import { gql } from '@apollo/client';

export const GET_POSTS = gql`
  query GetPosts($filters: PostFiltersDto) {
    posts(filters: $filters) {
      id
      uuid
      content
      visibility
      tribe {
        id
        name
      }
      attachments {
        id
        url
        fileName
        mimeType
      }
      user {
        id
        firstName
        lastName
        username
      }
      likesCount
      commentsCount
      isLiked
      createdAt
      updatedAt
    }
  }
`;

export const GET_POST = gql`
  query GetPost($id: Int!) {
    post(id: $id) {
      id
      uuid
      content
      visibility
      tribe {
        id
        name
      }
      attachments {
        id
        url
        fileName
        mimeType
      }
      user {
        id
        firstName
        lastName
        username
      }
      comments {
        id
        content
        user {
          id
          firstName
          lastName
          username
        }
        createdAt
      }
      likesCount
      commentsCount
      isLiked
      createdAt
      updatedAt
    }
  }
`;

export const GET_MY_POSTS = gql`
  query GetMyPosts {
    myPosts {
      id
      uuid
      content
      visibility
      tribe {
        id
        name
      }
      attachments {
        id
        url
        fileName
        mimeType
      }
      likesCount
      commentsCount
      isLiked
      createdAt
      updatedAt
    }
  }
`;

export const GET_POST_COMMENTS = gql`
  query GetPostComments($postId: Int!) {
    postComments(postId: $postId) {
      id
      content
      user {
        id
        firstName
        lastName
        username
      }
      createdAt
      updatedAt
    }
  }
`;
