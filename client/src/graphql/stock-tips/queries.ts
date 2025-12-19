import { gql } from '@apollo/client';

export const GET_STOCK_TIPS = gql`
  query GetStockTips {
    stockTips {
      id
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
      tribeId
      tribe {
        id
        name
        description
      }
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
  query GetStockTip($id: String!) {
    stockTip(id: $id) {
      id
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
      tribeId
      tribe {
        id
        name
        description
      }
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
      tribeId
      tribe {
        id
        name
        description
      }
      chartImage {
        id
        publicUrl
        originalName
      }
      user {
        id
        uuid
        avatar
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

export const GET_TRIBE_STOCK_TIPS = gql`
  query GetTribeStockTips($tribeId: String!) {
    tribeStockTips(tribeId: $tribeId) {
      id
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
      tribeId
      tribe {
        id
        name
        description
      }
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
      createdAt
    }
  }
`;

export const GET_MY_STOCK_TIPS_FEED = gql`
  query GetMyStockTipsFeed {
    myStockTipsFeed {
      id
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
      tribeId
      tribe {
        id
        name
        description
      }
      chartImage {
        id
        publicUrl
        originalName
      }
      user {
        id
        uuid
        avatar
        firstName
        lastName
        username
      }
      createdAt
    }
  }
`;
