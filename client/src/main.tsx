import { QueryClientProvider } from "@tanstack/react-query";
import { createRouter, RouterProvider } from '@tanstack/react-router';
import { createRoot } from "react-dom/client";
import "./index.css";
import { queryClient } from "./lib/queryClient";
import { routeTree } from './routeTree.gen';

const router = createRouter({ routeTree })


declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

const root = document.getElementById("root");

if (!root) {
  throw new Error("Root element not found");
}

createRoot(root).render(
  <QueryClientProvider client={queryClient}>
    <RouterProvider router={router} />
    {/* <App /> */}
  </QueryClientProvider>
);
