import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Layout } from "src/components/Layout";

const queryClient = new QueryClient();

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Layout />
    </QueryClientProvider>
  );
}
