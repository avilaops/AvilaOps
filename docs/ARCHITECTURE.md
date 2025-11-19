# Architecture Documentation

## System Overview

AvilaOps is a modern, cloud-native platform built with a serverless-first architecture, focusing on scalability, performance, and developer experience.

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Layer                          │
│  (React 19 + Next.js 16 + TypeScript + Tailwind CSS)       │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ HTTPS/REST
                         │
┌────────────────────────▼────────────────────────────────────┐
│                    Application Layer                         │
│                  (Next.js API Routes)                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ Rate Limiter │  │  Validation  │  │    CORS      │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  Chat API    │  │  Health API  │  │  Future APIs │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└────────────────────────┬────────────────────────────────────┘
                         │
          ┌──────────────┼──────────────┐
          │              │              │
┌─────────▼─────┐ ┌─────▼──────┐ ┌────▼──────────┐
│ OpenAI API    │ │  MongoDB   │ │ App Insights  │
│ (GPT-4o-mini) │ │   Atlas    │ │  (Optional)   │
└───────────────┘ └────────────┘ └───────────────┘
```

## Component Architecture

### Frontend Architecture

```
src/app/
├── layout.tsx              # Root layout, providers
├── page.tsx                # Home page, main entry
├── globals.css             # Global styles, animations
│
├── components/             # React components
│   ├── InteractiveTerminal.tsx      # AI chat interface
│   ├── LiveMetricsDashboard.tsx     # Real-time metrics
│   ├── ScrollStorytelling.tsx       # Narrative scroll
│   ├── InteractiveCases.tsx         # Case studies
│   ├── JsonLdSchema.tsx             # SEO structured data
│   └── TelemetryProvider.tsx        # Monitoring wrapper
│
├── api/                    # Backend API routes
│   ├── chat/
│   │   └── route.ts                 # OpenAI integration
│   ├── health/
│   │   └── route.ts                 # Health check
│   └── middleware/
│       ├── rateLimit.ts             # Rate limiting
│       └── validation.ts            # Input validation
│
└── services/
    └── page.tsx                     # Services page
```

### Backend Services

```typescript
// Service Layer Architecture
src/lib/
├── azureOpenAI.ts          // OpenAI client configuration
├── telemetry.ts            // Application Insights setup
├── endpoints.ts            // API endpoint configuration
└── api/
    └── client.ts           // Generic API utilities
```

## Data Flow

### 1. Chat Request Flow

```
User Input
    ↓
InteractiveTerminal Component
    ↓
POST /api/chat
    ↓
Rate Limiter Middleware (20 req/min)
    ↓
Input Validation (max 2000 chars)
    ↓
OpenAI API Call (GPT-4o-mini)
    ↓
MongoDB History Storage
    ↓
Response Streaming
    ↓
UI Update
```

### 2. Monitoring Flow

```
Component Event
    ↓
TelemetryProvider
    ↓
Application Insights
    ↓
Azure Monitor
    ↓
Dashboards & Alerts
```

## Technology Stack Details

### Frontend Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 16.0 | React framework, SSG/SSR |
| **React** | 19.2 | UI library with compiler |
| **TypeScript** | 5.x | Type safety |
| **Tailwind CSS** | 4.0 | Utility-first styling |
| **Framer Motion** | 12.x | Animations |
| **Lucide React** | Latest | Icon library |

### Backend Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | 20.x | Runtime environment |
| **OpenAI SDK** | 4.73+ | AI integration |
| **MongoDB** | Atlas | Document database |
| **Application Insights** | Latest | Monitoring (optional) |

### DevOps Stack

| Technology | Purpose |
|------------|---------|
| **GitHub Actions** | CI/CD automation |
| **GitHub Pages** | Static site hosting |
| **Dependabot** | Dependency updates |
| **CodeQL** | Security scanning |

## Security Architecture

### Defense in Depth

```
┌─────────────────────────────────────────────────────────┐
│ Layer 1: Network Security                               │
│ - HTTPS only                                            │
│ - HSTS headers                                          │
│ - CORS configuration                                    │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│ Layer 2: Application Security                           │
│ - Rate limiting (20 req/min)                           │
│ - Input validation (max 2000 chars)                    │
│ - XSS protection (escape sequences)                    │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│ Layer 3: Data Security                                  │
│ - Environment variables for secrets                     │
│ - MongoDB Atlas encryption at rest                      │
│ - TLS 1.2+ for data in transit                         │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│ Layer 4: Monitoring & Response                          │
│ - Application Insights logging                          │
│ - Error tracking                                        │
│ - Security audit trails                                │
└─────────────────────────────────────────────────────────┘
```

## Scalability Considerations

### Current Architecture

- **Static Site Generation (SSG)**: Pre-rendered pages for fast loading
- **API Routes**: Serverless functions that auto-scale
- **MongoDB Atlas**: Managed database with auto-scaling
- **CDN Distribution**: GitHub Pages with edge caching

### Scaling Strategy

```
Traffic Growth → Horizontal Scaling Plan:

1-10K users/day
├─ Current: GitHub Pages + MongoDB Atlas (Free tier)
└─ Cost: ~$0/month

10K-100K users/day
├─ Upgrade: MongoDB Atlas Dedicated + Vercel Pro
└─ Cost: ~$150/month

100K-1M users/day
├─ Upgrade: Multi-region deployment + Redis cache
└─ Cost: ~$500/month

1M+ users/day
├─ Upgrade: Kubernetes + CDN + Load Balancers
└─ Cost: Custom enterprise pricing
```

## Performance Optimization

### Build-Time Optimizations

```typescript
// next.config.ts
{
  reactCompiler: true,          // Automatic memoization
  output: 'export',             // Static HTML generation
  images: { unoptimized: true } // Static image serving
}
```

### Runtime Optimizations

1. **Code Splitting**: Automatic by Next.js
2. **Tree Shaking**: Unused code removal
3. **Image Optimization**: WebP conversion, lazy loading
4. **CSS Optimization**: Tailwind purge unused styles
5. **API Caching**: In-memory cache with MongoDB fallback

### Monitoring Metrics

```typescript
// Key Performance Indicators (KPIs)
{
  "lighthouse_score": 95,
  "lcp": "< 1.2s",          // Largest Contentful Paint
  "fid": "< 50ms",          // First Input Delay
  "cls": "< 0.05",          // Cumulative Layout Shift
  "bundle_size": "~200KB",  // Gzipped
  "api_p95": "< 500ms"      // 95th percentile latency
}
```

## Database Schema

### MongoDB Collections

#### `conversations`

```typescript
{
  _id: ObjectId,
  conversationId: string,        // UUID
  userId: string,                // User identifier
  messages: [
    {
      role: 'user' | 'assistant',
      content: string,
      timestamp: Date
    }
  ],
  language: string,              // PT, EN, ES, etc.
  createdAt: Date,
  updatedAt: Date
}
```

#### `metrics` (Future)

```typescript
{
  _id: ObjectId,
  type: 'cpu' | 'latency' | 'deploy' | 'cost',
  value: number,
  timestamp: Date,
  metadata: object
}
```

## API Specifications

### POST /api/chat

**Request:**

```typescript
{
  message: string,           // Max 2000 chars
  userId: string,
  conversationId: string,    // UUID
  language: string          // PT, EN, ES, DE, JA, ZH, RU
}
```

**Response:**

```typescript
{
  response: string,
  conversationId: string,
  timestamp: string,
  tokensUsed: number,
  model: string
}
```

**Error Codes:**

- `400`: Bad request (validation failed)
- `429`: Too many requests (rate limit)
- `500`: Internal server error
- `503`: Service unavailable (OpenAI timeout)

### GET /api/health

**Response:**

```typescript
{
  status: 'ok' | 'error',
  timestamp: string,
  uptime: number,           // Seconds
  version: string
}
```

## Deployment Architecture

### GitHub Pages Deployment

```yaml
# .github/workflows/deploy.yml

Build Stage:
1. Checkout code
2. Setup Node.js 20.x
3. Install dependencies (npm ci)
4. Lint code
5. Build Next.js (static export)
6. Upload artifact

Deploy Stage:
1. Download artifact
2. Deploy to GitHub Pages
3. Update DNS (if custom domain)
```

### Environment Configuration

```bash
# Development
npm run dev              # Port 3000

# Production Build
npm run build           # Output: ./out
npm run start           # Serve ./out

# Linting
npm run lint            # ESLint check
```

## Future Architecture

### Planned Enhancements

```
Phase 1 (Q1 2026)
├─ Add authentication (OAuth 2.0)
├─ User profiles and dashboards
└─ Real monitoring integrations

Phase 2 (Q2 2026)
├─ Multi-tenant support
├─ Advanced analytics
└─ Webhook integrations

Phase 3 (Q3 2026)
├─ Mobile app (React Native)
├─ Real-time collaboration
└─ Enterprise features
```

## References

- [Next.js Documentation](https://nextjs.org/docs)
- [React 19 RFC](https://react.dev/blog/2024/04/25/react-19)
- [MongoDB Atlas Best Practices](https://www.mongodb.com/docs/atlas/best-practices/)
- [OpenAI API Reference](https://platform.openai.com/docs)

---

**Last Updated**: November 19, 2025  
**Maintained by**: AvilaOps Team
