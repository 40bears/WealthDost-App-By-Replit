import { useQuery, useMutation } from '@apollo/client/react';
import {
  GET_TRIBES,
  GET_TRIBE,
  GET_TRIBE_BY_UUID,
  GET_TRIBE_RULES,
} from '@/graphql/tribes/queries';
import {
  CREATE_TRIBE,
  UPDATE_TRIBE,
  DELETE_TRIBE,
  CREATE_TRIBE_RULE,
  UPDATE_TRIBE_RULE,
  DELETE_TRIBE_RULE,
  REORDER_TRIBE_RULES,
} from '@/graphql/tribes/mutations';

// Query Hooks
export const useTribes = () => {
  return useQuery(GET_TRIBES, {
    fetchPolicy: 'cache-and-network',
  });
};

export const useTribe = (id: number) => {
  return useQuery(GET_TRIBE, {
    variables: { id },
    skip: !id,
  });
};

export const useTribeByUuid = (uuid: string) => {
  return useQuery(GET_TRIBE_BY_UUID, {
    variables: { uuid },
    skip: !uuid,
  });
};

export const useTribeRules = (tribeId: number) => {
  return useQuery(GET_TRIBE_RULES, {
    variables: { tribeId },
    skip: !tribeId,
  });
};

// Mutation Hooks
export const useCreateTribe = () => {
  return useMutation(CREATE_TRIBE, {
    refetchQueries: [GET_TRIBES],
    awaitRefetchQueries: true,
  });
};

export const useUpdateTribe = () => {
  return useMutation(UPDATE_TRIBE, {
    refetchQueries: [GET_TRIBES, GET_TRIBE],
    awaitRefetchQueries: true,
  });
};

export const useDeleteTribe = () => {
  return useMutation(DELETE_TRIBE, {
    refetchQueries: [GET_TRIBES],
    awaitRefetchQueries: true,
  });
};

export const useCreateTribeRule = () => {
  return useMutation(CREATE_TRIBE_RULE, {
    refetchQueries: [GET_TRIBE_RULES, GET_TRIBE],
    awaitRefetchQueries: true,
  });
};

export const useUpdateTribeRule = () => {
  return useMutation(UPDATE_TRIBE_RULE, {
    refetchQueries: [GET_TRIBE_RULES, GET_TRIBE],
    awaitRefetchQueries: true,
  });
};

export const useDeleteTribeRule = () => {
  return useMutation(DELETE_TRIBE_RULE, {
    refetchQueries: [GET_TRIBE_RULES, GET_TRIBE],
    awaitRefetchQueries: true,
  });
};

export const useReorderTribeRules = () => {
  return useMutation(REORDER_TRIBE_RULES, {
    refetchQueries: [GET_TRIBE_RULES, GET_TRIBE],
    awaitRefetchQueries: true,
  });
};
