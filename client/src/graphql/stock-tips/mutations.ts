import { gql } from '@apollo/client';

export const CREATE_STOCK_TIP = gql`
  mutation CreateStockTip($input: CreateStockTipDto!) {
    createStockTip(input: $input) {
      id
      uuid
      type
      stockName
      symbol
      entryPrice
      targetPrice
      entryDate
      exitDate
      reason
      chartImage {
        id
        url
        fileName
      }
      createdAt
    }
  }
`;

export const UPDATE_STOCK_TIP = gql`
  mutation UpdateStockTip($id: Int!, $input: UpdateStockTipDto!) {
    updateStockTip(id: $id, input: $input) {
      id
      uuid
      stockName
      symbol
      entryPrice
      targetPrice
      entryDate
      exitDate
      reason
      status
      chartImage {
        id
        url
        fileName
      }
      updatedAt
    }
  }
`;

export const DELETE_STOCK_TIP = gql`
  mutation DeleteStockTip($id: Int!) {
    deleteStockTip(id: $id)
  }
`;

export const LIKE_STOCK_TIP = gql`
  mutation LikeStockTip($stockTipId: Int!) {
    likeStockTip(stockTipId: $stockTipId) {
      id
      uuid
      createdAt
    }
  }
`;

export const UNLIKE_STOCK_TIP = gql`
  mutation UnlikeStockTip($stockTipId: Int!) {
    unlikeStockTip(stockTipId: $stockTipId)
  }
`;
