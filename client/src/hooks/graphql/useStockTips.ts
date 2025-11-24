import { useQuery, useMutation } from '@apollo/client/react';
import {
  GET_STOCK_TIPS,
  GET_STOCK_TIP,
  GET_MY_STOCK_TIPS,
} from '@/graphql/stock-tips/queries';
import {
  CREATE_STOCK_TIP,
  UPDATE_STOCK_TIP,
  DELETE_STOCK_TIP,
} from '@/graphql/stock-tips/mutations';

// Query Hooks
export const useStockTips = () => {
  return useQuery(GET_STOCK_TIPS, {
    fetchPolicy: 'cache-and-network',
  });
};

export const useStockTip = (id: number) => {
  return useQuery(GET_STOCK_TIP, {
    variables: { id },
    skip: !id,
  });
};

export const useMyStockTips = () => {
  return useQuery(GET_MY_STOCK_TIPS, {
    fetchPolicy: 'cache-and-network',
  });
};

// Mutation Hooks
export const useCreateStockTip = () => {
  return useMutation(CREATE_STOCK_TIP, {
    refetchQueries: [GET_STOCK_TIPS, GET_MY_STOCK_TIPS],
    awaitRefetchQueries: true,
  });
};

export const useUpdateStockTip = () => {
  return useMutation(UPDATE_STOCK_TIP, {
    refetchQueries: [GET_STOCK_TIPS, GET_MY_STOCK_TIPS, GET_STOCK_TIP],
    awaitRefetchQueries: true,
  });
};

export const useDeleteStockTip = () => {
  return useMutation(DELETE_STOCK_TIP, {
    refetchQueries: [GET_STOCK_TIPS, GET_MY_STOCK_TIPS],
    awaitRefetchQueries: true,
  });
};
