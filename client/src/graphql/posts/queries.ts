import { gql } from '@apollo/client';

export const GET_POSTS = gql`
  query GetPosts {
    posts {
      id
      content
      createdAt
      likeCount
      commentCount
      isLikedByMe
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

export const GET_POST = gql`
  query GetPost($id: String!) {
    post(id: $id) {
      id
      content
      createdAt
      likeCount
      commentCount
      isLikedByMe
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
        username
      }
      image {
        id
        path
        publicUrl
      }
    }
  }
`;

export const GET_MY_POSTS = gql`
  query GetMyPosts {
    myPosts {
      id
      content
      createdAt
      likeCount
      commentCount
      isLikedByMe
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

export const GET_TRIBE_POSTS = gql`
  query GetTribePosts($tribeId: String!) {
    tribePosts(tribeId: $tribeId) {
      id
      content
      createdAt
      likeCount
      commentCount
      isLikedByMe
      tribeId
      tribe {
        id
        name
        description
        coverImage {
          url
        }
      }
      user {
        id
        firstName
        lastName
        username
      }
      image {
        id
        path
      }
    }
  }
`;

export const GET_MY_FEED = gql`
  query GetMyFeed {
    myFeed {
      id
      content
      createdAt
      likeCount
      commentCount
      isLikedByMe
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
        username
      }
      image {
        id
        path
      }
    }
  }
`;
