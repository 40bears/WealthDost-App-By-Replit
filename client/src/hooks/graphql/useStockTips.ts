import { useQuery, useMutation } from '@apollo/client/react';
import {
  GET_STOCK_TIPS,
  GET_STOCK_TIP,
  GET_MY_STOCK_TIPS,
  GET_TRIBE_STOCK_TIPS,
  GET_MY_STOCK_TIPS_FEED,
} from '@/graphql/stock-tips/queries';
import {
  CREATE_STOCK_TIP,
  UPDATE_STOCK_TIP,
  DELETE_STOCK_TIP,
  LIKE_STOCK_TIP,
  UNLIKE_STOCK_TIP,
} from '@/graphql/stock-tips/mutations';
import { GET_FEED } from '@/graphql/feed/queries';

// Query Hooks
export const useStockTips = () => {
  return useQuery<{ stockTips: any[] }>(GET_STOCK_TIPS, {
    fetchPolicy: 'cache-and-network',
  });
};

export const useStockTip = (id: number | string) => {
  return useQuery(GET_STOCK_TIP, {
    variables: { id: String(id) },
    skip: !id,
  });
};

export const useMyStockTips = () => {
  return useQuery(GET_MY_STOCK_TIPS, {
    fetchPolicy: 'cache-and-network',
  });
};


export const useTribeStockTips = (tribeId: number) => {
  return useQuery(GET_TRIBE_STOCK_TIPS, {
    variables: { tribeId },
    skip: !tribeId,
    fetchPolicy: 'cache-and-network',
  });
};

export const useMyStockTipsFeed = () => {
  return useQuery(GET_MY_STOCK_TIPS_FEED, {
    fetchPolicy: 'cache-and-network',
  });
};

// Mutation Hooks
export const useCreateStockTip = () => {
  return useMutation(CREATE_STOCK_TIP, {
    refetchQueries: [GET_STOCK_TIPS, GET_MY_STOCK_TIPS, GET_FEED, GET_MY_STOCK_TIPS_FEED],
    awaitRefetchQueries: true,
  });
};

export const useUpdateStockTip = () => {
  return useMutation(UPDATE_STOCK_TIP, {
    refetchQueries: [GET_STOCK_TIPS, GET_MY_STOCK_TIPS, GET_FEED, GET_MY_STOCK_TIPS_FEED, GET_STOCK_TIP],
    awaitRefetchQueries: true,
  });
};

export const useDeleteStockTip = () => {
  return useMutation(DELETE_STOCK_TIP, {
    refetchQueries: [GET_STOCK_TIPS, GET_MY_STOCK_TIPS, GET_FEED, GET_MY_STOCK_TIPS_FEED],
    awaitRefetchQueries: true,
  });
};

export const useLikeStockTip = () => {
  return useMutation(LIKE_STOCK_TIP, {
    refetchQueries: [GET_STOCK_TIPS, GET_MY_STOCK_TIPS, GET_FEED, GET_MY_STOCK_TIPS_FEED, GET_STOCK_TIP],
    awaitRefetchQueries: true,
  });
};

export const useUnlikeStockTip = () => {
  return useMutation(UNLIKE_STOCK_TIP, {
    refetchQueries: [GET_STOCK_TIPS, GET_MY_STOCK_TIPS, GET_FEED, GET_MY_STOCK_TIPS_FEED, GET_STOCK_TIP],
    awaitRefetchQueries: true,
  });
};
