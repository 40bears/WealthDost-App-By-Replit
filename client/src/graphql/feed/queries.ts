import { gql } from '@apollo/client';

export const GET_FEED = gql`
  query Feed($limit: Int!, $offset: Int!, $showFollowing: Boolean) {
    feed(limit: $limit, offset: $offset, showFollowing: $showFollowing) {
      items {
        id
        type
        createdAt
        score

        # Post fields (only populated when type = 'post')
        post {
          id
          content
          createdAt
          likeCount
          commentCount
          isLikedByMe
          user {
            id
            username
            firstName
            lastName
            profile {
              profileBio
            }
          }
          hashtags {
            id
            tagName
            masterHashtag {
              id
              tag
            }
          }
          image {
            id
            path
            publicUrl
          }
        }

        # Stock Tip fields (only populated when type = 'stock_tip')
        stockTip {
          id
          type
          stockName
          symbol
          entryPrice
          targetPrice
          entryDate
          exitDate
          reason
          createdAt
          likeCount
          commentCount
          isLikedByMe
          user {
            id
            username
            firstName
            lastName
          }
          hashtags {
            id
            tagName
            masterHashtag {
              id
              tag
            }
          }
          chartImage {
            id
            publicUrl
            originalName
          }
        }
      }
      hasMore
      nextOffset
    }
  }
`;
