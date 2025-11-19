# 🚀 AvilaOps - Infrastructure That Scales

[![Next.js](https://img.shields.io/badge/Next.js-16.0-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react)](https://reactjs.org/)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o--mini-412991?logo=openai)](https://openai.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb)](https://www.mongodb.com/cloud/atlas)

> **From chaos to cloud-native.** Modern DevOps platform showcasing cloud architecture, automation, and observability excellence.

## 📋 Overview

AvilaOps is a cutting-edge DevOps consulting platform built with Next.js 16, featuring:

- 🤖 **AI-Powered Terminal** - Interactive chat assistant specialized in DevOps/Cloud/Kubernetes
- 📊 **Live Metrics Dashboard** - Real-time infrastructure monitoring simulation
- 🎨 **Modern UI/UX** - Jobs-inspired minimalist design with Framer Motion animations
- ⚡ **Performance First** - React 19 with compiler, optimized for production
- 🔒 **Security Hardened** - Rate limiting, input validation, security headers

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 16.0 (App Router)
- **Language:** TypeScript 5.x (strict mode)
- **UI Library:** React 19.2 with React Compiler
- **Styling:** Tailwind CSS 4.0
- **Animations:** Framer Motion 12.x

### Backend & Services
- **Database:** MongoDB Atlas
- **AI Service:** OpenAI API (GPT-4o-mini)
- **Monitoring:** Application Insights (optional)
- **Cache:** In-memory with MongoDB fallback

### DevOps
- **Deployment:** Azure Static Web Apps / Vercel
- **CI/CD:** GitHub Actions / Azure Pipelines
- **IaC:** Bicep templates
- **Version Control:** Git

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm 9+
- MongoDB Atlas account
- OpenAI API key

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/avilaops/AvilaOps.git
cd AvilaOps

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env.local
# Edit .env.local with your credentials

# 4. Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## ⚙️ Environment Variables

Create a `.env.local` file in the root directory:

```env
# Database (Required)
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/avilaops

# AI Service (Required)
OPENAI_API_KEY=sk-proj-...
OPENAI_MODEL=gpt-4o-mini

# Application (Required)
NEXT_PUBLIC_SITE_URL=https://avilaops.com

# Optional: Monitoring
NEXT_PUBLIC_APPINSIGHTS_CONNECTION_STRING=InstrumentationKey=...
```

See `.env.example` for all available options including payment gateways, cloud services, and development tools.

## 📁 Project Structure

```
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── chat/
│   │   │   │   └── route.ts           # AI chat endpoint
│   │   │   ├── health/
│   │   │   │   └── route.ts           # Health check
│   │   │   └── middleware/
│   │   │       ├── rateLimit.ts       # Rate limiting
│   │   │       └── validation.ts      # Input validation
│   │   ├── components/
│   │   │   ├── InteractiveTerminal.tsx
│   │   │   ├── LiveMetricsDashboard.tsx
│   │   │   ├── ScrollStorytelling.tsx
│   │   │   ├── InteractiveCases.tsx
│   │   │   ├── JsonLdSchema.tsx
│   │   │   └── TelemetryProvider.tsx
│   │   ├── page.tsx                   # Home page
│   │   ├── layout.tsx                 # Root layout
│   │   ├── globals.css                # Global styles
│   │   ├── loading.tsx                # Loading state
│   │   ├── error.tsx                  # Error boundary
│   │   ├── robots.ts                  # Robots.txt config
│   │   └── sitemap.ts                 # Sitemap config
│   └── lib/
│       ├── azureOpenAI.ts             # OpenAI client
│       ├── telemetry.ts               # Application Insights
│       ├── endpoints.ts               # API configuration
│       └── api/
│           └── client.ts              # API utilities
├── public/                            # Static assets
│   ├── favicon.svg
│   ├── manifest.json                  # PWA manifest
│   └── preview.html
├── infra/                             # Infrastructure as Code
│   └── staticwebapp.bicep             # Azure SWA config
├── scripts/                           # Build scripts
│   ├── generate-images.js
│   ├── generate-pwa-assets.js
│   └── convert-icons.mjs
├── .env.example                       # Environment template
├── .env.local                         # Your credentials (gitignored)
├── next.config.ts                     # Next.js configuration
├── tailwind.config.ts                 # Tailwind configuration
├── tsconfig.json                      # TypeScript configuration
├── eslint.config.mjs                  # ESLint configuration
├── staticwebapp.config.json           # Azure SWA routing
├── swa-cli.config.json                # SWA CLI config
└── package.json                       # Dependencies
```

## 🎯 Features

### 🤖 AI Terminal Assistant
- **Multi-language Support:** PT, EN, ES, DE, JA, ZH, RU
- **Context Awareness:** Maintains conversation history (last 5 messages)
- **DevOps Expertise:** Specialized in CI/CD, IaC, Kubernetes, Cloud platforms
- **Smart Features:** Tab completion, command shortcuts, timeout handling (30s)
- **Persistent Storage:** MongoDB Atlas with in-memory fallback

### 📊 Live Metrics Dashboard
- **Real-time Monitoring:** CPU, latency, deploy rate, cost metrics
- **Interactive Charts:** Sparkline visualizations with smooth animations
- **User Controls:** Pause/resume functionality
- **Responsive Design:** Adapts to all screen sizes

### 🎨 Interactive UI Components
- **Scroll Storytelling:** Narrative-driven content reveal
- **Case Studies:** Interactive architecture diagrams
- **Tech Stack Showcase:** Animated technology badges
- **Mobile-First:** Touch-optimized interactions

### 🔒 Security & Performance

**Security:**
- Rate limiting (20 req/min per IP)
- Input validation & sanitization (max 2000 chars)
- XSS protection via escape sequences
- Security headers (HSTS, CSP, X-Frame-Options, etc.)
- Environment variable protection (.gitignore)

**Performance:**
- React 19 Compiler for automatic memoization
- Image optimization with Next.js Image
- Code splitting & lazy loading
- Tailwind CSS tree-shaking
- Gzip compression
- CDN-ready static assets

**Monitoring:**
- Application Insights integration
- Structured logging with prefixes
- Error tracking and diagnostics
- Performance metrics (latency, tokens)

## 🛠️ Development

### Available Scripts

```bash
# Development
npm run dev              # Start dev server (http://localhost:3000)

# Production
npm run build           # Build for production
npm start              # Start production server

# Code Quality
npm run lint           # Run ESLint

# Assets
npm run generate:images  # Generate PWA images
npm run generate:icons   # Convert SVG icons
```

### Development Workflow

1. **Feature Branch:** Create from `main`
2. **Development:** Make changes, test locally
3. **Linting:** Run `npm run lint` before committing
4. **Commit:** Use conventional commits (feat, fix, chore, etc.)
5. **Push:** Push to remote and create PR
6. **Review:** Wait for code review
7. **Merge:** Squash and merge to `main`

### Code Standards

- **TypeScript:** Strict mode enabled, no implicit any
- **Components:** Functional components with hooks
- **Naming:** camelCase for variables, PascalCase for components
- **Imports:** Absolute imports using `@/` alias
- **Styling:** Tailwind utility classes, no inline styles
- **Comments:** JSDoc for functions, inline for complex logic

## 🚢 Deployment

### Azure Static Web Apps (Recommended)

```bash
# 1. Install Azure CLI
# https://docs.microsoft.com/cli/azure/install-azure-cli

# 2. Login
az login

# 3. Create resource group (if needed)
az group create --name rg-avilaops --location eastus2

# 4. Deploy using Bicep
az deployment group create \
  --resource-group rg-avilaops \
  --template-file infra/staticwebapp.bicep \
  --parameters name=avilaops
```

### Vercel (Alternative)

```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Deploy
vercel --prod
```

### Environment Variables (Production)

Set these in your hosting platform:

**Required:**
- `MONGODB_URI`
- `OPENAI_API_KEY`
- `OPENAI_MODEL`
- `NEXT_PUBLIC_SITE_URL`

**Optional:**
- `NEXT_PUBLIC_APPINSIGHTS_CONNECTION_STRING`
- Payment gateway keys (if using payment features)
- Cloud provider keys (if using cloud integrations)

### Custom Domain Setup

1. **Azure SWA:**
   ```bash
   az staticwebapp hostname set \
     --name avilaops \
     --hostname avilaops.com
   ```

2. **DNS Configuration:**
   - Add CNAME record: `www` → `{app-name}.azurestaticapps.net`
   - Add A record: `@` → SWA IP address
   - Wait for propagation (up to 48h)

## 📊 Performance Benchmarks

- **Lighthouse Score:** 95+ (all categories)
- **Core Web Vitals:**
  - LCP: < 1.2s
  - FID: < 100ms
  - CLS: < 0.1
- **Bundle Size:** < 200KB (gzipped)
- **API Latency:** < 500ms (p95)
- **Database Queries:** < 100ms (avg)

## 🧪 Testing

### Health Check

```bash
# Check API health
curl http://localhost:3000/api/health

# Expected response
{
  "status": "ok",
  "timestamp": "2025-11-19T...",
  "uptime": 1234.56
}
```

### AI Chat Test

```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What is Kubernetes?",
    "userId": "test-user",
    "conversationId": "test-conv",
    "language": "en"
  }'
```

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

### Contribution Process

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Make** your changes
4. **Test** thoroughly: `npm run dev` and `npm run build`
5. **Lint** your code: `npm run lint`
6. **Commit** with descriptive messages: `git commit -m 'feat: add amazing feature'`
7. **Push** to your branch: `git push origin feature/amazing-feature`
8. **Open** a Pull Request with detailed description

### Commit Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting)
- `refactor:` Code refactoring
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

### Code Review Checklist

- [ ] Code follows project style guidelines
- [ ] No console.log or debug code
- [ ] TypeScript types are properly defined
- [ ] No security vulnerabilities introduced
- [ ] Performance impact considered
- [ ] Documentation updated if needed

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

**AvilaOps** - DevOps Engineering & Cloud Architecture

- 🌐 Website: [avilaops.com](https://avilaops.com)
- 🐙 GitHub: [@avilaops](https://github.com/avilaops)
- 💼 LinkedIn: [/company/avilaops](https://linkedin.com/company/avilaops)
- 📧 Email: contato@avilaops.com

## 🙏 Acknowledgments

- **Next.js Team** for the incredible framework
- **Vercel** for deployment platform and innovations
- **OpenAI** for AI capabilities
- **MongoDB** for reliable database services
- **Microsoft** for Azure infrastructure
- **Open Source Community** for amazing tools and libraries

## 📚 Resources

### Official Documentation
- [Next.js 16 Docs](https://nextjs.org/docs)
- [React 19 Docs](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [OpenAI API Reference](https://platform.openai.com/docs)
- [MongoDB Atlas Docs](https://www.mongodb.com/docs/atlas/)

### Learning Resources
- [Next.js Learn](https://nextjs.org/learn)
- [React Tutorial](https://react.dev/learn)
- [TypeScript Tutorial](https://www.typescriptlang.org/docs/handbook/intro.html)
- [DevOps Handbook](https://www.devopshandbook.com/)

## 🗺️ Roadmap

### Q1 2026
- [ ] Add authentication (OAuth 2.0)
- [ ] Implement user dashboards
- [ ] Add real monitoring integrations
- [ ] Expand AI capabilities (code generation)

### Q2 2026
- [ ] Multi-tenant support
- [ ] Advanced analytics dashboard
- [ ] API rate limiting per user
- [ ] Webhook integrations

### Q3 2026
- [ ] Mobile app (React Native)
- [ ] Marketplace for DevOps tools
- [ ] Community forum
- [ ] Educational content platform

### Future
- [ ] Enterprise features (SSO, RBAC)
- [ ] White-label solutions
- [ ] Partner integrations
- [ ] Global CDN optimization

## 🐛 Known Issues

- None currently. Report issues on [GitHub Issues](https://github.com/avilaops/AvilaOps/issues)

## 📞 Support

Need help? Reach out:

- 📧 Email: contato@avilaops.com
- 💬 GitHub Issues: [Create an issue](https://github.com/avilaops/AvilaOps/issues)
- 📖 Documentation: This README
- 🌐 Website: [avilaops.com](https://avilaops.com)

---

**Built with ❤️ by AvilaOps Team**
**Infrastructure That Scales** | **From Chaos to Cloud-Native**

*Last Updated: November 19, 2025*
