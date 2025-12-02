import { gql } from '@apollo/client';

export const GET_STOCK_TIPS = gql`
  query GetStockTips {
    stockTips {
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
      likeCount
      commentCount
      isLikedByMe
      chartImage {
        id
        publicUrl
        originalName
      }
      user {
        id
        firstName
        lastName
        username
      }
      userId
      createdAt
      updatedAt
    }
  }
`;

export const GET_STOCK_TIP = gql`
  query GetStockTip($id: Int!) {
    stockTip(id: $id) {
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
      likeCount
      commentCount
      isLikedByMe
      chartImage {
        id
        publicUrl
        originalName
      }
      user {
        id
        firstName
        lastName
        username
      }
      userId
      createdAt
      updatedAt
    }
  }
`;

export const GET_MY_STOCK_TIPS = gql`
  query GetMyStockTips {
    myStockTips {
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
      likeCount
      commentCount
      isLikedByMe
      chartImage {
        id
        publicUrl
        originalName
      }
      userId
      createdAt
      updatedAt
    }
  }
`;
