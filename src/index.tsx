import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { App } from "~/src/components/App";

const queryClient = new QueryClient();
const root = createRoot(document.getElementById("root") as HTMLElement);

root.render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>
);
