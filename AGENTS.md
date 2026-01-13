# agent-marketplace-web - AGENTS.md

## Project Vision

A production-grade React frontend for the Agent Marketplace. Beautiful, responsive web interface for discovering, installing, and managing AI agents. Think "npm's website" or "PyPI's interface" but specifically for AI agents.

**Target Users:**
- Developers browsing and discovering agents
- Agent authors managing their published agents
- Teams evaluating agents before installation
- Casual users exploring the AI agent ecosystem

**Core Value Proposition:**
> "The beautiful face of Agent Marketplace. Discover, evaluate, and install AI agents with a modern, fast, intuitive web interface."

## EXECUTION MODE: AUTONOMOUS

Claude should make ALL changes without asking for approval unless a critical architectural decision arises.
Quality gates at the end determine success. If all tests pass, linting succeeds, and build completes, the implementation is acceptable.

---

## What It Does

### Core Functionality
1. **Agent Discovery**: Browse, search, filter agents
2. **Agent Details**: View agent info, versions, stats, reviews
3. **User Profiles**: View user profiles, published agents, reviews
4. **Authentication**: GitHub OAuth login/logout
5. **Agent Management**: Publish, update, unpublish agents (for authors)
6. **Social Features**: Star agents, leave reviews, view ratings
7. **Analytics**: Trending agents, popular categories, statistics
8. **Responsive Design**: Works on desktop, tablet, mobile

### What It Does NOT Do
- ❌ NO agent execution (that's local via pytest-agents)
- ❌ NO backend logic (all via agent-marketplace-api)
- ❌ NO code editing (agents are uploaded as files)
- ❌ NO real-time chat (future feature)
- ❌ NO payment processing (future feature)

---

## Project Structure

```
agent-marketplace-web/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── Layout.tsx
│   │   ├── agents/
│   │   │   ├── AgentCard.tsx
│   │   │   ├── AgentList.tsx
│   │   │   ├── AgentDetail.tsx
│   │   │   ├── AgentStats.tsx
│   │   │   ├── VersionHistory.tsx
│   │   │   └── InstallButton.tsx
│   │   ├── search/
│   │   │   ├── SearchBar.tsx
│   │   │   ├── SearchFilters.tsx
│   │   │   └── SearchResults.tsx
│   │   ├── reviews/
│   │   │   ├── ReviewCard.tsx
│   │   │   ├── ReviewList.tsx
│   │   │   ├── ReviewForm.tsx
│   │   │   └── StarRating.tsx
│   │   ├── users/
│   │   │   ├── UserProfile.tsx
│   │   │   ├── UserAgents.tsx
│   │   │   └── UserReviews.tsx
│   │   ├── publish/
│   │   │   ├── PublishForm.tsx
│   │   │   ├── FileUploader.tsx
│   │   │   └── ValidationStatus.tsx
│   │   └── common/
│   │       ├── Button.tsx
│   │       ├── Badge.tsx
│   │       ├── Card.tsx
│   │       ├── Modal.tsx
│   │       ├── Spinner.tsx
│   │       └── ErrorBoundary.tsx
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── AgentDetail.tsx
│   │   ├── Search.tsx
│   │   ├── Categories.tsx
│   │   ├── Trending.tsx
│   │   ├── UserProfile.tsx
│   │   ├── Publish.tsx
│   │   ├── Dashboard.tsx
│   │   └── NotFound.tsx
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useAgents.ts
│   │   ├── useSearch.ts
│   │   ├── useReviews.ts
│   │   └── useAnalytics.ts
│   ├── services/
│   │   ├── api.ts              # API client
│   │   ├── auth.ts             # Authentication
│   │   ├── agents.ts           # Agent operations
│   │   ├── search.ts           # Search operations
│   │   └── analytics.ts        # Analytics operations
│   ├── store/
│   │   ├── index.ts
│   │   ├── authSlice.ts
│   │   ├── agentsSlice.ts
│   │   └── uiSlice.ts
│   ├── types/
│   │   ├── agent.ts
│   │   ├── user.ts
│   │   ├── review.ts
│   │   └── api.ts
│   ├── utils/
│   │   ├── format.ts
│   │   ├── validation.ts
│   │   └── constants.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── public/
│   ├── favicon.ico
│   └── logo.svg
├── tests/
│   ├── unit/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── utils/
│   └── e2e/
│       ├── agent-flow.spec.ts
│       ├── search.spec.ts
│       └── publish.spec.ts
├── .github/
│   └── workflows/
│       ├── ci.yml
│       ├── deploy.yml
│       └── security.yml
├── Dockerfile
├── docker-compose.yml
├── nginx.conf
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
├── README.md
├── AGENTS.md                   # This file
└── .gitignore
```

---

## Technical Stack

### Core Dependencies (MUST USE)
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.21.0",
    "@reduxjs/toolkit": "^2.0.0",
    "react-redux": "^9.0.0",
    "axios": "^1.6.0",
    "@tanstack/react-query": "^5.17.0",
    "zod": "^3.22.0",
    "react-hook-form": "^7.49.0",
    "@hookform/resolvers": "^3.3.0",
    "react-markdown": "^9.0.0",
    "date-fns": "^3.0.0",
    "clsx": "^2.1.0",
    "lucide-react": "^0.307.0"
  }
}
```

### Dev Dependencies
```json
{
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "typescript": "^5.3.0",
    "vite": "^5.0.0",
    "@vitejs/plugin-react": "^4.2.0",
    "tailwindcss": "^3.4.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0",
    "vitest": "^1.2.0",
    "@testing-library/react": "^14.1.0",
    "@testing-library/jest-dom": "^6.1.0",
    "@testing-library/user-event": "^14.5.0",
    "playwright": "^1.40.0",
    "eslint": "^8.56.0",
    "@typescript-eslint/eslint-plugin": "^6.18.0",
    "@typescript-eslint/parser": "^6.18.0",
    "prettier": "^3.1.0"
  }
}
```

### DO NOT ADD
- ❌ No Create React App (use Vite)
- ❌ No jQuery (use modern React)
- ❌ No Bootstrap (use Tailwind)
- ❌ No Material-UI (custom design with Tailwind)
- ❌ No complex state managers (Redux Toolkit is enough)

---

## Design System

### Color Palette
```css
:root {
  /* Primary - Blue */
  --primary-50: #eff6ff;
  --primary-500: #3b82f6;
  --primary-600: #2563eb;
  --primary-700: #1d4ed8;
  
  /* Secondary - Purple */
  --secondary-500: #8b5cf6;
  --secondary-600: #7c3aed;
  
  /* Success - Green */
  --success-500: #10b981;
  --success-600: #059669;
  
  /* Warning - Yellow */
  --warning-500: #f59e0b;
  --warning-600: #d97706;
  
  /* Error - Red */
  --error-500: #ef4444;
  --error-600: #dc2626;
  
  /* Neutral - Gray */
  --neutral-50: #f9fafb;
  --neutral-100: #f3f4f6;
  --neutral-200: #e5e7eb;
  --neutral-700: #374151;
  --neutral-800: #1f2937;
  --neutral-900: #111827;
}
```

### Typography
```css
/* Font stack */
font-family: Inter, system-ui, -apple-system, sans-serif;

/* Heading scale */
h1: 2.5rem (40px), font-weight: 700
h2: 2rem (32px), font-weight: 600
h3: 1.5rem (24px), font-weight: 600
h4: 1.25rem (20px), font-weight: 600

/* Body text */
body: 1rem (16px), font-weight: 400, line-height: 1.5
small: 0.875rem (14px)
```

### Component Patterns
```typescript
// Button variants
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>

// Badge colors
<Badge color="blue">Category</Badge>
<Badge color="green">Validated</Badge>
<Badge color="yellow">Pending</Badge>

// Card styles
<Card>
  <Card.Header>Title</Card.Header>
  <Card.Body>Content</Card.Body>
  <Card.Footer>Actions</Card.Footer>
</Card>
```

---

## Key Pages

### Home Page
```typescript
// src/pages/Home.tsx
export default function Home() {
  return (
    <Layout>
      {/* Hero section */}
      <Hero />
      
      {/* Featured agents */}
      <Section title="Featured Agents">
        <AgentList agents={featuredAgents} />
      </Section>
      
      {/* Trending agents */}
      <Section title="Trending">
        <AgentList agents={trendingAgents} />
      </Section>
      
      {/* Categories */}
      <Section title="Browse by Category">
        <CategoryGrid categories={categories} />
      </Section>
      
      {/* Statistics */}
      <StatsSection stats={platformStats} />
    </Layout>
  );
}
```

### Agent Detail Page
```typescript
// src/pages/AgentDetail.tsx
export default function AgentDetail() {
  const { slug } = useParams();
  const { data: agent, isLoading } = useAgent(slug);
  
  if (isLoading) return <Spinner />;
  if (!agent) return <NotFound />;
  
  return (
    <Layout>
      {/* Agent header */}
      <div className="border-b pb-6">
        <h1 className="text-4xl font-bold">{agent.name}</h1>
        <div className="flex gap-4 mt-4">
          <Badge>{agent.category}</Badge>
          <StarRating rating={agent.rating} count={agent.stars} />
          <span>{agent.downloads} downloads</span>
        </div>
      </div>
      
      {/* Main content */}
      <div className="grid grid-cols-3 gap-8 mt-8">
        {/* Left column - Description */}
        <div className="col-span-2">
          <Markdown>{agent.description}</Markdown>
          
          {/* Version history */}
          <VersionHistory versions={agent.versions} />
          
          {/* Reviews */}
          <ReviewList agentSlug={slug} />
        </div>
        
        {/* Right sidebar - Install */}
        <div className="col-span-1">
          <InstallCard agent={agent} />
          <AgentStats agent={agent} />
          <AuthorCard author={agent.author} />
        </div>
      </div>
    </Layout>
  );
}
```

### Search Page
```typescript
// src/pages/Search.tsx
export default function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const category = searchParams.get('category');
  
  const { data, isLoading } = useSearch({
    query,
    category,
  });
  
  return (
    <Layout>
      <div className="grid grid-cols-4 gap-6">
        {/* Filters sidebar */}
        <aside className="col-span-1">
          <SearchFilters />
        </aside>
        
        {/* Results */}
        <main className="col-span-3">
          <h1 className="text-3xl font-bold mb-6">
            Search Results for "{query}"
          </h1>
          
          {isLoading ? (
            <Spinner />
          ) : (
            <SearchResults results={data.results} />
          )}
        </main>
      </div>
    </Layout>
  );
}
```

### Publish Page
```typescript
// src/pages/Publish.tsx
export default function Publish() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const onSubmit = async (data: PublishFormData) => {
    try {
      const agent = await publishAgent(data, {
        onProgress: setUploadProgress,
      });
      
      toast.success('Agent published successfully!');
      navigate(`/agents/${agent.slug}`);
    } catch (error) {
      toast.error('Failed to publish agent');
    }
  };
  
  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6">Publish Agent</h1>
      
      <Card>
        <PublishForm onSubmit={onSubmit} />
        
        {uploadProgress > 0 && (
          <ProgressBar value={uploadProgress} />
        )}
      </Card>
      
      {/* Guidelines */}
      <Card className="mt-6">
        <h2>Publishing Guidelines</h2>
        <ul>
          <li>Provide a clear, descriptive name</li>
          <li>Include comprehensive documentation</li>
          <li>Add test coverage</li>
          <li>Follow pytest-agents conventions</li>
        </ul>
      </Card>
    </Layout>
  );
}
```

---

## Component Examples

### AgentCard Component
```typescript
// src/components/agents/AgentCard.tsx
interface AgentCardProps {
  agent: Agent;
}

export function AgentCard({ agent }: AgentCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <Link to={`/agents/${agent.slug}`}>
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-semibold">{agent.name}</h3>
          {agent.is_validated && (
            <Badge color="green">
              <CheckCircle className="w-4 h-4" />
              Validated
            </Badge>
          )}
        </div>
        
        {/* Description */}
        <p className="text-neutral-600 mb-4 line-clamp-2">
          {agent.description}
        </p>
        
        {/* Stats */}
        <div className="flex gap-4 text-sm text-neutral-500">
          <span className="flex items-center gap-1">
            <Download className="w-4 h-4" />
            {formatNumber(agent.downloads)}
          </span>
          <span className="flex items-center gap-1">
            <Star className="w-4 h-4" />
            {formatNumber(agent.stars)}
          </span>
          <StarRating rating={agent.rating} size="sm" />
        </div>
        
        {/* Footer */}
        <div className="flex justify-between items-center mt-4 pt-4 border-t">
          <Badge color="blue">{agent.category}</Badge>
          <span className="text-sm text-neutral-500">
            v{agent.current_version}
          </span>
        </div>
      </Link>
    </Card>
  );
}
```

### SearchBar Component
```typescript
// src/components/search/SearchBar.tsx
export function SearchBar() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  
  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };
  
  return (
    <form onSubmit={handleSearch} className="relative">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search agents..."
        className="w-full px-4 py-3 pl-12 rounded-lg border border-neutral-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
      />
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
    </form>
  );
}
```

### ReviewForm Component
```typescript
// src/components/reviews/ReviewForm.tsx
interface ReviewFormProps {
  agentSlug: string;
  onSuccess?: () => void;
}

export function ReviewForm({ agentSlug, onSuccess }: ReviewFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<ReviewFormData>();
  const [rating, setRating] = useState(0);
  
  const onSubmit = async (data: ReviewFormData) => {
    try {
      await createReview(agentSlug, {
        ...data,
        rating,
      });
      
      toast.success('Review posted successfully!');
      onSuccess?.();
    } catch (error) {
      toast.error('Failed to post review');
    }
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Rating */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Rating
        </label>
        <StarRating
          rating={rating}
          onChange={setRating}
          interactive
        />
      </div>
      
      {/* Comment */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Review
        </label>
        <textarea
          {...register('comment', {
            required: 'Review is required',
            maxLength: { value: 1000, message: 'Max 1000 characters' }
          })}
          rows={5}
          className="w-full px-4 py-2 border rounded-lg"
          placeholder="Share your experience with this agent..."
        />
        {errors.comment && (
          <p className="text-error-500 text-sm mt-1">
            {errors.comment.message}
          </p>
        )}
      </div>
      
      {/* Submit */}
      <Button type="submit" variant="primary">
        Post Review
      </Button>
    </form>
  );
}
```

---

## API Integration

### API Client
```typescript
// src/services/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://api.agent-marketplace.com',
  timeout: 30000,
});

// Request interceptor (add auth token)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor (handle errors)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Logout user
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

### Agents Service
```typescript
// src/services/agents.ts
import api from './api';
import type { Agent, AgentCreate } from '../types/agent';

export const agentsService = {
  list: async (params?: {
    category?: string;
    limit?: number;
    offset?: number;
  }) => {
    const response = await api.get<{ items: Agent[] }>('/api/v1/agents', { params });
    return response.data;
  },
  
  get: async (slug: string) => {
    const response = await api.get<Agent>(`/api/v1/agents/${slug}`);
    return response.data;
  },
  
  publish: async (data: AgentCreate, onProgress?: (progress: number) => void) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('description', data.description);
    formData.append('category', data.category);
    formData.append('code', data.codeFile);
    
    const response = await api.post<Agent>('/api/v1/agents', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress?.(percentCompleted);
        }
      },
    });
    
    return response.data;
  },
  
  star: async (slug: string) => {
    await api.post(`/api/v1/agents/${slug}/star`);
  },
  
  unstar: async (slug: string) => {
    await api.delete(`/api/v1/agents/${slug}/star`);
  },
};
```

---

## State Management

### Redux Store
```typescript
// src/store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import agentsReducer from './agentsSlice';
import uiReducer from './uiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    agents: agentsReducer,
    ui: uiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

### Auth Slice
```typescript
// src/store/authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { User } from '../types/user';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.isLoading = false;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setUser, logout, setLoading } = authSlice.actions;
export default authSlice.reducer;
```

---

## Custom Hooks

### useAuth Hook
```typescript
// src/hooks/useAuth.ts
export function useAuth() {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, isLoading } = useAppSelector((state) => state.auth);
  
  const login = useCallback(async (githubCode: string) => {
    dispatch(setLoading(true));
    try {
      const { user, token } = await authService.login(githubCode);
      localStorage.setItem('auth_token', token);
      dispatch(setUser(user));
    } catch (error) {
      toast.error('Login failed');
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);
  
  const logoutUser = useCallback(() => {
    localStorage.removeItem('auth_token');
    dispatch(logout());
    toast.success('Logged out successfully');
  }, [dispatch]);
  
  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout: logoutUser,
  };
}
```

### useAgents Hook
```typescript
// src/hooks/useAgents.ts
export function useAgents(category?: string) {
  return useQuery({
    queryKey: ['agents', category],
    queryFn: () => agentsService.list({ category }),
  });
}

export function useAgent(slug: string) {
  return useQuery({
    queryKey: ['agent', slug],
    queryFn: () => agentsService.get(slug),
    enabled: !!slug,
  });
}

export function useStarAgent(slug: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: () => agentsService.star(slug),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agent', slug] });
      toast.success('Agent starred!');
    },
  });
}
```

---

## Testing

### Component Tests
```typescript
// tests/unit/components/AgentCard.test.tsx
import { render, screen } from '@testing-library/react';
import { AgentCard } from '@/components/agents/AgentCard';

describe('AgentCard', () => {
  const mockAgent = {
    id: 1,
    name: 'Test Agent',
    slug: 'test-agent',
    description: 'Test description',
    downloads: 1000,
    stars: 50,
    rating: 4.5,
    category: 'testing',
    is_validated: true,
    current_version: '1.0.0',
  };
  
  it('renders agent name', () => {
    render(<AgentCard agent={mockAgent} />);
    expect(screen.getByText('Test Agent')).toBeInTheDocument();
  });
  
  it('shows validation badge', () => {
    render(<AgentCard agent={mockAgent} />);
    expect(screen.getByText('Validated')).toBeInTheDocument();
  });
  
  it('displays stats', () => {
    render(<AgentCard agent={mockAgent} />);
    expect(screen.getByText('1k')).toBeInTheDocument(); // downloads
    expect(screen.getByText('50')).toBeInTheDocument(); // stars
  });
});
```

### E2E Tests
```typescript
// tests/e2e/agent-flow.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Agent Discovery Flow', () => {
  test('user can search and view agent', async ({ page }) => {
    // Go to home page
    await page.goto('/');
    
    // Search for agent
    await page.fill('[placeholder="Search agents..."]', 'code review');
    await page.click('button[type="submit"]');
    
    // Wait for results
    await page.waitForSelector('[data-testid="agent-card"]');
    
    // Click first result
    await page.click('[data-testid="agent-card"]:first-child');
    
    // Verify agent detail page
    await expect(page).toHaveURL(/\/agents\/[^/]+$/);
    await expect(page.locator('h1')).toBeVisible();
  });
  
  test('authenticated user can star agent', async ({ page }) => {
    // Login
    await page.goto('/login');
    // ... handle OAuth flow
    
    // Go to agent page
    await page.goto('/agents/test-agent');
    
    // Click star button
    await page.click('[data-testid="star-button"]');
    
    // Verify starred
    await expect(page.locator('[data-testid="star-button"]')).toHaveAttribute(
      'data-starred',
      'true'
    );
  });
});
```

---

## Docker Configuration

### Dockerfile
```dockerfile
# Build stage
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### nginx.conf
```nginx
server {
    listen 80;
    server_name localhost;
    
    root /usr/share/nginx/html;
    index index.html;
    
    # SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # API proxy
    location /api/ {
        proxy_pass http://api:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
    
    # Compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
}
```

### docker-compose.yml
```yaml
version: '3.8'

services:
  web:
    build: .
    ports:
      - "3000:80"
    environment:
      - VITE_API_URL=http://localhost:8000
    depends_on:
      - api
  
  api:
    image: agent-marketplace-api:latest
    ports:
      - "8000:8000"
```

---

## CI/CD Configuration

### GitHub Actions - ci.yml
```yaml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run linter
        run: npm run lint
      
      - name: Run type check
        run: npm run type-check
      
      - name: Run tests
        run: npm test -- --coverage
      
      - name: Build
        run: npm run build
      
      - name: Upload coverage
        uses: codecov/codecov-action@v4
        with:
          token: ${{ secrets.CODECOV_TOKEN }}
  
  e2e:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Install Playwright
        run: npx playwright install --with-deps
      
      - name: Run E2E tests
        run: npm run test:e2e
```

### deploy.yml
```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Build Docker image
        run: docker build -t agent-marketplace-web:latest .
      
      - name: Push to registry
        run: |
          echo ${{ secrets.DOCKER_PASSWORD }} | docker login -u ${{ secrets.DOCKER_USERNAME }} --password-stdin
          docker push agent-marketplace-web:latest
      
      - name: Deploy to production
        run: |
          # Deploy to your hosting platform
          # (Vercel, Netlify, AWS, etc.)
```

---

## Deployment Targets

**Web hosting options:**
- **Vercel** (recommended for React/Next.js)
- **Netlify** (easy static hosting)
- **AWS S3 + CloudFront** (scalable)
- **Docker + Nginx** (self-hosted)

**Domain:**
- `agent-marketplace.com` (or similar)
- API at `api.agent-marketplace.com`

---

## Repository Configuration

**Repository:** `github.com/kmcallorum/agent-marketplace-web`

**Description:**
> "React frontend for Agent Marketplace - beautiful, responsive web interface for discovering and managing AI agents built with pytest-agents."

**Topics:**
```
react, typescript, vite, tailwindcss, frontend, web-app,
agent-marketplace, ui, ux, responsive-design, pwa
```

---

## README Structure

```markdown
# agent-marketplace-web

[![CI](https://github.com/kmcallorum/agent-marketplace-web/actions/workflows/ci.yml/badge.svg)](https://github.com/kmcallorum/agent-marketplace-web/actions)
[![Deploy](https://img.shields.io/badge/deploy-vercel-black)](https://agent-marketplace.vercel.app)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Modern React frontend for Agent Marketplace.

## Features

- 🔍 Powerful search and discovery
- 📱 Responsive design (mobile, tablet, desktop)
- ⚡ Fast performance (Vite + React 18)
- 🎨 Beautiful UI (Tailwind CSS)
- 🔐 GitHub OAuth authentication
- ⭐ Social features (stars, reviews)

## Quick Start

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

## Development

See [CONTRIBUTING.md](CONTRIBUTING.md) for setup.

## License

MIT License - see [LICENSE](LICENSE) for details.
```

---

## Success Criteria

1. ✅ All pages render correctly
2. ✅ Search and filters work
3. ✅ Agent details display properly
4. ✅ Authentication flow works
5. ✅ Can star/unstar agents
6. ✅ Can leave reviews
7. ✅ Responsive on mobile
8. ✅ All tests pass
9. ✅ Build completes without errors
10. ✅ Lighthouse score > 90

---

**This AGENTS.md is complete and ready for Claude Code!** 🚀
