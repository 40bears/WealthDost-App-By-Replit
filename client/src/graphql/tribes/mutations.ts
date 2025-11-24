import { gql } from '@apollo/client';

export const CREATE_TRIBE = gql`
  mutation CreateTribe($input: CreateTribeDto!) {
    createTribe(input: $input) {
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
      createdAt
    }
  }
`;

export const UPDATE_TRIBE = gql`
  mutation UpdateTribe($id: Int!, $input: UpdateTribeDto!) {
    updateTribe(id: $id, input: $input) {
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
      updatedAt
    }
  }
`;

export const DELETE_TRIBE = gql`
  mutation DeleteTribe($id: Int!) {
    deleteTribe(id: $id)
  }
`;

export const CREATE_TRIBE_RULE = gql`
  mutation CreateTribeRule($tribeId: Int!, $input: CreateTribeRuleDto!) {
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
  mutation UpdateTribeRule($tribeId: Int!, $ruleId: Int!, $input: UpdateTribeRuleDto!) {
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
  mutation DeleteTribeRule($tribeId: Int!, $ruleId: Int!) {
    deleteTribeRule(tribeId: $tribeId, ruleId: $ruleId)
  }
`;

export const REORDER_TRIBE_RULES = gql`
  mutation ReorderTribeRules($tribeId: Int!, $input: ReorderTribeRulesDto!) {
    reorderTribeRules(tribeId: $tribeId, input: $input) {
      id
      content
      displayOrder
      isDefault
    }
  }
`;
