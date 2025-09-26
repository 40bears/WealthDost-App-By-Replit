import { QueryClientProvider } from "@tanstack/react-query";
import { createRouter } from '@tanstack/react-router';
import { createRoot } from "react-dom/client";
import AppRoot from "./components/AppRoot";
import "./index.css";
import { queryClient } from "./lib/queryClient";
import { routeTree } from './routeTree.gen';

const router = createRouter({ routeTree })

const root = document.getElementById("root");

if (!root) {
  throw new Error("Root element not found");
}

createRoot(root).render(
  <QueryClientProvider client={queryClient}>
    <AppRoot />
    {/* <App /> */}
  </QueryClientProvider>
);
