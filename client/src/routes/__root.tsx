import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { InteractionProvider } from "@/lib/interactionContext";
import { Outlet, createRootRoute } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import * as React from 'react';
export const Route = createRootRoute({
    component: RootComponent,
})

function RootComponent() {
    return (
        <React.Fragment>
            <TooltipProvider>
                <InteractionProvider>
                    <Toaster />
                    <div className="max-w-md mx-auto bg-white min-h-screen flex flex-col">
                        <div className="flex flex-col min-h-screen">
                            <div className="flex-1">
                                <Outlet />
                            </div>
                        </div>
                    </div>
                </InteractionProvider>
            </TooltipProvider>
            <TanStackRouterDevtools />
        </React.Fragment >
    )
}
