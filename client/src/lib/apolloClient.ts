import { ApolloClient, InMemoryCache, HttpLink, ApolloLink } from '@apollo/client';
import appConfig from '@/config/app';

// HTTP connection to the GraphQL API
const httpLink = new HttpLink({
  uri: `${appConfig.apiUrl}/graphql`,
  credentials: 'same-origin',
});

// Authentication middleware
const authMiddleware = new ApolloLink((operation, forward) => {
  const accessToken = localStorage.getItem('accessToken');

  operation.setContext({
    headers: {
      authorization: accessToken ? `Bearer ${accessToken}` : '',
    }
  });

  return forward(operation);
});

// Create Apollo Client instance
export const apolloClient = new ApolloClient({
  link: authMiddleware.concat(httpLink),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          tribes: {
            merge(existing = [], incoming) {
              return incoming;
            },
          },
          stockTips: {
            merge(existing = [], incoming) {
              return incoming;
            },
          },
          posts: {
            merge(existing = [], incoming) {
              return incoming;
            },
          },
        },
      },
    },
  }),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
      errorPolicy: 'all',
    },
    query: {
      fetchPolicy: 'network-only',
      errorPolicy: 'all',
    },
    mutate: {
      errorPolicy: 'all',
    },
  },
});
