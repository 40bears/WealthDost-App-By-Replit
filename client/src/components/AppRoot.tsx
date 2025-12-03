import { useAuth } from '@/hooks/useAuth';
import { routeTree } from '@/routeTree.gen';
import { createRouter, RouterProvider } from '@tanstack/react-router';
import { ApolloProvider } from '@apollo/client/react';
import { apolloClient } from '@/lib/apolloClient';
import { AuthProvider } from './auth/auth-context';

const router = createRouter({
    routeTree,
    context: {
        auth: undefined!, // This will be set by the RouterProvider
    },
})

function RouterWrapper() {
    const auth = useAuth()

    return (
        <RouterProvider router={router} context={{ auth }} />
    );
}

function AppRoot() {
    return (
        <ApolloProvider client={apolloClient}>
            <AuthProvider>
                <RouterWrapper />
            </AuthProvider>
        </ApolloProvider>
    );
}

export default AppRoot;