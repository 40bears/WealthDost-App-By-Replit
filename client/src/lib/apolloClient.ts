import { ApolloClient, InMemoryCache, HttpLink, ApolloLink, Observable } from '@apollo/client';
import appConfig from '@/config/app';
import axios from 'axios';

// Flag to prevent multiple simultaneous refresh attempts
let isRefreshing = false;
let pendingRequests: Array<() => void> = [];

const resolvePendingRequests = () => {
  pendingRequests.map((callback) => callback());
  pendingRequests = [];
};

const getNewToken = async () => {
  const refreshToken = localStorage.getItem('refreshToken');

  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  try {
    console.log('[Apollo Auth] Attempting to refresh token...');
    const response = await axios.post(
      `${appConfig.apiUrl}/auth/refresh`,
      { refreshToken }
    );

    const { accessToken, refreshToken: newRefreshToken } = response.data;

    console.log('[Apollo Auth] Token refresh successful');

    // Store new tokens
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', newRefreshToken);

    return accessToken;
  } catch (error: any) {
    // Refresh failed, clear auth state
    console.error('[Apollo Auth] Token refresh failed:', error?.response?.data || error.message);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    throw error;
  }
};

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

// Error handling middleware for token refresh
const errorLink = new ApolloLink((operation, forward) => {
  return new Observable(observer => {
    const subscription = forward(operation).subscribe({
      next: (result) => {
        // Check for GraphQL errors indicating authentication issues
        if (result.errors) {
          const authError = result.errors.find(
            (err) => err.extensions?.code === 'UNAUTHENTICATED' ||
                     err.message.includes('Unauthorized')
          );

          if (authError) {
            if (!isRefreshing) {
              isRefreshing = true;

              getNewToken()
                .then((accessToken) => {
                  resolvePendingRequests();
                  isRefreshing = false;

                  // Retry the operation with new token
                  const oldHeaders = operation.getContext().headers;
                  operation.setContext({
                    headers: {
                      ...oldHeaders,
                      authorization: `Bearer ${accessToken}`,
                    },
                  });

                  forward(operation).subscribe(observer);
                })
                .catch((error) => {
                  pendingRequests = [];
                  isRefreshing = false;
                  observer.error(error);
                });
            } else {
              // Queue the request
              pendingRequests.push(() => {
                const accessToken = localStorage.getItem('accessToken');
                const oldHeaders = operation.getContext().headers;
                operation.setContext({
                  headers: {
                    ...oldHeaders,
                    authorization: accessToken ? `Bearer ${accessToken}` : '',
                  },
                });
                forward(operation).subscribe(observer);
              });
            }
            return;
          }
        }

        observer.next(result);
      },
      error: (networkError) => {
        // Check for network-level 401 errors
        if (networkError.statusCode === 401) {
          if (!isRefreshing) {
            isRefreshing = true;

            getNewToken()
              .then((accessToken) => {
                resolvePendingRequests();
                isRefreshing = false;

                const oldHeaders = operation.getContext().headers;
                operation.setContext({
                  headers: {
                    ...oldHeaders,
                    authorization: `Bearer ${accessToken}`,
                  },
                });

                forward(operation).subscribe(observer);
              })
              .catch((error) => {
                pendingRequests = [];
                isRefreshing = false;
                observer.error(error);
              });
          } else {
            pendingRequests.push(() => {
              const accessToken = localStorage.getItem('accessToken');
              const oldHeaders = operation.getContext().headers;
              operation.setContext({
                headers: {
                  ...oldHeaders,
                  authorization: accessToken ? `Bearer ${accessToken}` : '',
                },
              });
              forward(operation).subscribe(observer);
            });
          }
        } else {
          observer.error(networkError);
        }
      },
      complete: () => {
        observer.complete();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  });
});

// Create Apollo Client instance
export const apolloClient = new ApolloClient({
  link: ApolloLink.from([authMiddleware, errorLink, httpLink]),
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
