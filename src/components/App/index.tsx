import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Game } from "src/components/Game";

const queryClient = new QueryClient();

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Game />
    </QueryClientProvider>
  );
}
