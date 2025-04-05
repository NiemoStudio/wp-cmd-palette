import { StrictMode } from 'react'
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider, createHashRouter } from "react-router";
import { Toaster } from "sonner";

import routes from "@/routes";
import "@/app.css";

const queryClient = new QueryClient();
const router = createHashRouter(routes);

createRoot(document.getElementById('wp-cmd-palette-backend')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster />
    </QueryClientProvider>
  </StrictMode>,
)


