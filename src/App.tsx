import { QueryClient, QueryClientProvider } from "react-query";
import { Toaster } from "react-hot-toast";
import Home from "./Home";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      cacheTime: 1000 * 60 * 60 * 24, // 24 hours
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <Home />
      {/* <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/upload" element={<UploadExcel />} />
        </Routes>
      </Router> */}
    </QueryClientProvider>
  );
}

export default App;
