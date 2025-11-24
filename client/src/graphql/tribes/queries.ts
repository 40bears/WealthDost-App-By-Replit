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
