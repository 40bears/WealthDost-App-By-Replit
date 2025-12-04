import { gql } from '@apollo/client';

export const CREATE_STOCK_TIP = gql`
  mutation CreateStockTip($input: CreateStockTipDto!) {
    createStockTip(input: $input) {
      id
      type
      stockName
      symbol
      entryPrice
      targetPrice
      entryDate
      exitDate
      reason
      tribeId
      tribe {
        id
        name
        description
      }
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
  mutation UpdateStockTip($id: String!, $input: UpdateStockTipDto!) {
    updateStockTip(id: $id, input: $input) {
      id
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
  mutation DeleteStockTip($id: String!) {
    deleteStockTip(id: $id)
  }
`;

export const LIKE_STOCK_TIP = gql`
  mutation LikeStockTip($stockTipId: String!) {
    likeStockTip(stockTipId: $stockTipId) {
      id
      createdAt
    }
  }
`;

export const UNLIKE_STOCK_TIP = gql`
  mutation UnlikeStockTip($stockTipId: String!) {
    unlikeStockTip(stockTipId: $stockTipId)
  }
`;
