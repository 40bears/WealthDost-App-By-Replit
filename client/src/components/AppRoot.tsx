import { useAuth } from '@/hooks/useAuth';
import { routeTree } from '@/routeTree.gen';
import { createRouter, RouterProvider } from '@tanstack/react-router';
import { AuthProvider } from './auth/auth-context';

const router = createRouter({ routeTree })

function AppRoot() {
    const auth = useAuth()

    return (
        <AuthProvider>
            <RouterProvider router={router} context={{ auth }} />
        </AuthProvider>
    );
}

export default AppRoot;