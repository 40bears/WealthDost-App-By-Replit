import { gql } from '@apollo/client';

export const GET_TRIBES = gql`
  query GetTribes {
    tribes {
      id
      uuid
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
        fileName
      }
      user {
        id
        firstName
        lastName
        username
      }
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
  query GetTribe($id: Int!) {
    tribe(id: $id) {
      id
      uuid
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
        fileName
      }
      user {
        id
        firstName
        lastName
        username
      }
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
  query GetTribeByUuid($uuid: String!) {
    tribeByUuid(uuid: $uuid) {
      id
      uuid
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
        fileName
      }
      user {
        id
        firstName
        lastName
        username
      }
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
  query GetTribeRules($tribeId: Int!) {
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
  query IsMemberOfTribe($tribeId: Int!) {
    isMemberOfTribe(tribeId: $tribeId)
  }
`;

export const GET_TRIBE_MEMBERS = gql`
  query GetTribeMembers($tribeId: Int!) {
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
      uuid
      name
      description
      category
      coverImage {
        id
        url
        fileName
      }
      isPremium
      price
      user {
        id
        username
      }
      memberCount
      createdAt
    }
  }
`;

export const GET_TRIBE_MEMBER_COUNT = gql`
  query GetTribeMemberCount($tribeId: Int!) {
    tribeMemberCount(tribeId: $tribeId)
  }
`;
