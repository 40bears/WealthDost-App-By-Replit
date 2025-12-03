import { gql } from '@apollo/client';

export const CREATE_TRIBE = gql`
  mutation CreateTribe($input: CreateTribeDto!) {
    createTribe(input: $input) {
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
        fileName
      }
      memberCount
      tipsHits
      weeklyFeeds
      badges
      createdAt
    }
  }
`;

export const UPDATE_TRIBE = gql`
  mutation UpdateTribe($id: String!, $input: UpdateTribeDto!) {
    updateTribe(id: $id, input: $input) {
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
        fileName
      }
      memberCount
      tipsHits
      weeklyFeeds
      badges
      updatedAt
    }
  }
`;

export const DELETE_TRIBE = gql`
  mutation DeleteTribe($id: String!) {
    deleteTribe(id: $id)
  }
`;

export const CREATE_TRIBE_RULE = gql`
  mutation CreateTribeRule($tribeId: String!, $input: CreateTribeRuleDto!) {
    createTribeRule(tribeId: $tribeId, input: $input) {
      id
      content
      displayOrder
      isDefault
      createdAt
    }
  }
`;

export const UPDATE_TRIBE_RULE = gql`
  mutation UpdateTribeRule($tribeId: String!, $ruleId: String!, $input: UpdateTribeRuleDto!) {
    updateTribeRule(tribeId: $tribeId, ruleId: $ruleId, input: $input) {
      id
      content
      displayOrder
      isDefault
      updatedAt
    }
  }
`;

export const DELETE_TRIBE_RULE = gql`
  mutation DeleteTribeRule($tribeId: String!, $ruleId: String!) {
    deleteTribeRule(tribeId: $tribeId, ruleId: $ruleId)
  }
`;

export const REORDER_TRIBE_RULES = gql`
  mutation ReorderTribeRules($tribeId: String!, $input: ReorderTribeRulesDto!) {
    reorderTribeRules(tribeId: $tribeId, input: $input) {
      id
      content
      displayOrder
      isDefault
    }
  }
`;

export const JOIN_TRIBE = gql`
  mutation JoinTribe($tribeId: String!) {
    joinTribe(tribeId: $tribeId) {
      id
      userId
      tribeId
      joinedAt
      user {
        id
        username
        firstName
        lastName
      }
    }
  }
`;

export const LEAVE_TRIBE = gql`
  mutation LeaveTribe($tribeId: String!) {
    leaveTribe(tribeId: $tribeId)
  }
`;
