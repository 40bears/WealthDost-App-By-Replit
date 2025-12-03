import { gql } from '@apollo/client';

export const GET_POSTS = gql`
  query GetPosts {
    posts {
      id
      uuid
      content
      createdAt
      likeCount
      commentCount
      isLikedByMe
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

export const GET_POST = gql`
  query GetPost($id: Int!) {
    post(id: $id) {
      id
      uuid
      content
      createdAt
      likeCount
      commentCount
      isLikedByMe
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

export const GET_MY_POSTS = gql`
  query GetMyPosts {
    myPosts {
      id
      uuid
      content
      createdAt
      likeCount
      commentCount
      isLikedByMe
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

export const GET_POST_COMMENTS = gql`
  query GetPostComments($postId: Int!) {
    postComments(postId: $postId) {
      id
      content
      user {
        id
        firstName
        lastName
      }
      createdAt
    }
  }
`;
