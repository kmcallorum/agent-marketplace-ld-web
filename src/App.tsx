import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { store } from '@/store';
import { ErrorBoundary } from '@/components/common';
import {
  Home,
  Admin,
  AgentDetailPage,
  Search,
  Categories,
  Trending,
  UserProfilePage,
  Publish,
  Dashboard,
  NotFound,
  Login,
  Help,
} from '@/pages';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ErrorBoundary>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/agents/:slug" element={<AgentDetailPage />} />
              <Route path="/search" element={<Search />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/categories/:slug" element={<Categories />} />
              <Route path="/trending" element={<Trending />} />
              <Route path="/users/:username" element={<UserProfilePage />} />
              <Route path="/publish" element={<Publish />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/login" element={<Login />} />
              <Route path="/help" element={<Help />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
          <Toaster
            position="bottom-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#1f2937',
                color: '#f9fafb',
              },
            }}
          />
        </ErrorBoundary>
      </QueryClientProvider>
    </Provider>
  );
}

export default App;
