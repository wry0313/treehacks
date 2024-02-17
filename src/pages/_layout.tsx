import { Outlet } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { Toaster } from "react-hot-toast";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      cacheTime: 1000 * 60 * 60 * 24, // 24 hours
    },
  },
});

export default function RootLayout() {
  return (
        <QueryClientProvider client={queryClient}>
          <Toaster />
            <Outlet />
        </QueryClientProvider>
  );
}
