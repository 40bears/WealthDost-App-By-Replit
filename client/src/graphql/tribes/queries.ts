import { gql } from '@apollo/client';

export const GET_TRIBES = gql`
  query GetTribes {
    tribes {
      id
      name
      description
      category
      features
      price
      isPremium
      isActive
      coverImage {
        id
        url
        publicUrl
        fileName
      }
      user {
        id
        firstName
        lastName
        username
      }
      userId
      memberCount
      tipsHits
      weeklyFeeds
      badges
      createdAt
      updatedAt
    }
  }
`;

export const GET_TRIBE = gql`
  query GetTribe($id: String!) {
    tribe(id: $id) {
      id
      name
      description
      category
      features
      price
      isPremium
      isActive
      coverImage {
        id
        url
        publicUrl
        fileName
      }
      user {
        id
        firstName
        lastName
        username
      }
      userId
      memberCount
      tipsHits
      weeklyFeeds
      badges
      rules {
        id
        content
        displayOrder
        isDefault
        createdAt
      }
      createdAt
      updatedAt
    }
  }
`;

export const GET_TRIBE_BY_UUID = gql`
  query GetTribeByUuid($id: String!) {
    tribeByUuid(id: $id) {
      id
      name
      description
      category
      features
      price
      isPremium
      isActive
      coverImage {
        id
        url
        publicUrl
        fileName
      }
      user {
        id
        firstName
        lastName
        username
      }
      userId
      memberCount
      tipsHits
      weeklyFeeds
      badges
      rules {
        id
        content
        displayOrder
        isDefault
      }
      createdAt
      updatedAt
    }
  }
`;

export const GET_TRIBE_RULES = gql`
  query GetTribeRules($tribeId: String!) {
    tribeRules(tribeId: $tribeId) {
      id
      content
      displayOrder
      isDefault
      createdAt
      updatedAt
    }
  }
`;

export const IS_MEMBER_OF_TRIBE = gql`
  query IsMemberOfTribe($tribeId: String!) {
    isMemberOfTribe(tribeId: $tribeId)
  }
`;

export const GET_TRIBE_MEMBERS = gql`
  query GetTribeMembers($tribeId: String!) {
    tribeMembers(tribeId: $tribeId) {
      id
      joinedAt
      user {
        id
        username
        firstName
        lastName
        email
      }
    }
  }
`;

export const GET_MY_TRIBES = gql`
  query GetMyTribes {
    myTribes {
      id
      name
      description
      category
      coverImage {
        id
        url
        publicUrl
        fileName
      }
      isPremium
      price
      user {
        id
        username
        firstName
        lastName
      }
      memberCount
      createdAt
    }
  }
`;

export const GET_TRIBE_MEMBER_COUNT = gql`
  query GetTribeMemberCount($tribeId: String!) {
    tribeMemberCount(tribeId: $tribeId)
  }
`;
