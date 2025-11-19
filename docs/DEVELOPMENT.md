# Development Guide

## Getting Started

This guide will help you set up your development environment and understand the development workflow for AvilaOps.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18+ (LTS recommended)
- **npm** 9+ (comes with Node.js)
- **Git** 2.40+
- **VS Code** (recommended) or your preferred IDE

### Optional Tools

- **MongoDB Compass** - GUI for MongoDB
- **Postman/Insomnia** - API testing
- **GitHub CLI** - GitHub operations from terminal

## Initial Setup

### 1. Clone the Repository

```bash
# Via HTTPS
git clone https://github.com/avilaops/AvilaOps.git

# Via SSH (recommended for contributors)
git clone git@github.com:avilaops/AvilaOps.git

cd AvilaOps
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

```bash
# Copy the example environment file
cp .env.example .env.local

# Edit with your credentials
code .env.local  # or use your preferred editor
```

**Required variables:**

```bash
# MongoDB Atlas (get free cluster at mongodb.com/cloud/atlas)
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/avilaops

# OpenAI API (get key at platform.openai.com/api-keys)
OPENAI_API_KEY=sk-proj-...
OPENAI_MODEL=gpt-4o-mini

# Application
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 4. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Development Workflow

### Branch Strategy

We follow **GitHub Flow**:

```
main (production-ready)
  ↓
feature/amazing-feature (your work)
  ↓
Pull Request → Code Review → Merge
```

### Creating a Feature

```bash
# 1. Update main branch
git checkout main
git pull origin main

# 2. Create feature branch
git checkout -b feature/your-feature-name

# 3. Make changes
# ... edit files ...

# 4. Commit changes
git add .
git commit -m "feat: add amazing feature"

# 5. Push to GitHub
git push origin feature/your-feature-name

# 6. Open Pull Request on GitHub
```

### Commit Convention

We use [Conventional Commits](https://www.conventionalcommits.org/):

```bash
# Format
<type>(<scope>): <subject>

# Examples
feat: add user authentication
fix: resolve API timeout issue
docs: update README with new API
style: format code with prettier
refactor: simplify chat component logic
test: add unit tests for validation
chore: update dependencies
```

**Types:**

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation only
- `style:` Code style (formatting, semicolons, etc.)
- `refactor:` Code refactoring (no feature/fix)
- `test:` Adding or updating tests
- `chore:` Maintenance tasks
- `perf:` Performance improvements
- `ci:` CI/CD changes

## Project Structure

```
AvilaOps/
├── .github/                    # GitHub configuration
│   ├── workflows/             # CI/CD workflows
│   ├── ISSUE_TEMPLATE/        # Issue templates
│   └── PULL_REQUEST_TEMPLATE.md
│
├── docs/                       # Documentation
│   ├── ARCHITECTURE.md
│   └── DEVELOPMENT.md (this file)
│
├── public/                     # Static assets
│   ├── favicon.svg
│   └── manifest.json
│
├── src/                        # Source code
│   ├── app/                   # Next.js App Router
│   │   ├── api/              # API routes
│   │   ├── components/       # React components
│   │   ├── page.tsx          # Pages
│   │   ├── layout.tsx        # Layouts
│   │   └── globals.css       # Global styles
│   │
│   └── lib/                   # Utilities & libraries
│       ├── azureOpenAI.ts    # OpenAI client
│       ├── telemetry.ts      # Monitoring
│       └── api/              # API utilities
│
├── scripts/                    # Build scripts
│
├── .env.example               # Environment template
├── .env.local                 # Your env (gitignored)
├── next.config.ts             # Next.js config
├── tailwind.config.ts         # Tailwind config
├── tsconfig.json              # TypeScript config
└── package.json               # Dependencies
```

## Code Style Guide

### TypeScript

```typescript
// ✅ Good: Explicit types, clear naming
interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export async function sendMessage(message: ChatMessage): Promise<string> {
  // Implementation
}

// ❌ Bad: No types, unclear naming
async function sm(m: any) {
  // Implementation
}
```

### React Components

```typescript
// ✅ Good: Functional component with TypeScript
interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
}

export const Button: React.FC<ButtonProps> = ({ 
  onClick, 
  children, 
  variant = 'primary' 
}) => {
  return (
    <button 
      onClick={onClick}
      className={`btn btn-${variant}`}
    >
      {children}
    </button>
  );
};

// ❌ Bad: Class component, no types
class Button extends React.Component {
  render() {
    return <button onClick={this.props.onClick}>{this.props.children}</button>;
  }
}
```

### Styling

```typescript
// ✅ Good: Tailwind utility classes
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md">
  <h2 className="text-xl font-bold text-gray-800">Title</h2>
</div>

// ❌ Bad: Inline styles
<div style={{ display: 'flex', padding: '16px', backgroundColor: 'white' }}>
  <h2 style={{ fontSize: '20px', fontWeight: 'bold' }}>Title</h2>
</div>
```

### API Routes

```typescript
// ✅ Good: Error handling, validation, types
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const requestSchema = z.object({
  message: z.string().min(1).max(2000),
  userId: z.string().uuid(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = requestSchema.parse(body);
    
    // Process request
    const response = await processMessage(data);
    
    return NextResponse.json({ success: true, data: response });
  } catch (error) {
    console.error('[API Error]', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// ❌ Bad: No validation, poor error handling
export async function POST(request: NextRequest) {
  const body = await request.json();
  const response = await processMessage(body);
  return NextResponse.json(response);
}
```

## Testing

### Manual Testing

```bash
# 1. Start dev server
npm run dev

# 2. Test health endpoint
curl http://localhost:3000/api/health

# 3. Test chat endpoint
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Hello, how are you?",
    "userId": "test-user-123",
    "conversationId": "test-conv-123",
    "language": "en"
  }'
```

### Linting

```bash
# Run ESLint
npm run lint

# Fix auto-fixable issues
npm run lint -- --fix
```

### Build Testing

```bash
# Production build
npm run build

# Check build output
ls -la out/

# Serve production build locally
npm run start
```

## Common Development Tasks

### Adding a New Component

```bash
# 1. Create component file
touch src/app/components/MyNewComponent.tsx

# 2. Implement component
# ... edit MyNewComponent.tsx ...

# 3. Export from index (if needed)
# ... edit components/index.ts ...

# 4. Import and use
# ... import in page.tsx ...
```

### Adding a New API Route

```bash
# 1. Create API route directory
mkdir -p src/app/api/my-endpoint

# 2. Create route handler
touch src/app/api/my-endpoint/route.ts

# 3. Implement handler
# ... edit route.ts ...

# 4. Test endpoint
curl http://localhost:3000/api/my-endpoint
```

### Updating Dependencies

```bash
# Check for outdated packages
npm outdated

# Update all dependencies
npm update

# Update specific package
npm install package-name@latest

# Check for security vulnerabilities
npm audit

# Fix vulnerabilities automatically
npm audit fix
```

## Debugging

### VS Code Configuration

Create `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Next.js: debug server-side",
      "type": "node-terminal",
      "request": "launch",
      "command": "npm run dev"
    },
    {
      "name": "Next.js: debug client-side",
      "type": "chrome",
      "request": "launch",
      "url": "http://localhost:3000"
    }
  ]
}
```

### Console Logging

```typescript
// Development logging
console.log('[Component Name] Event:', data);

// Error logging
console.error('[API Error]', error);

// Remove before production
// TODO: Replace with proper logging service
```

### Browser DevTools

1. **Elements**: Inspect DOM and styles
2. **Console**: View logs and errors
3. **Network**: Monitor API requests
4. **Application**: Check localStorage, cookies
5. **Lighthouse**: Performance audit

## Performance Optimization

### Code Splitting

```typescript
// ✅ Good: Dynamic import
const DynamicComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <p>Loading...</p>,
});

// ❌ Bad: Static import for heavy components
import HeavyComponent from './HeavyComponent';
```

### Image Optimization

```typescript
// ✅ Good: Next.js Image component
import Image from 'next/image';

<Image 
  src="/logo.png" 
  alt="Logo" 
  width={200} 
  height={100}
  priority
/>

// ❌ Bad: Regular img tag
<img src="/logo.png" alt="Logo" />
```

### API Optimization

```typescript
// ✅ Good: Implement caching
const cache = new Map();

export async function getCachedData(key: string) {
  if (cache.has(key)) {
    return cache.get(key);
  }
  
  const data = await fetchData(key);
  cache.set(key, data);
  return data;
}
```

## Troubleshooting

### Common Issues

#### Build Fails

```bash
# Clear cache and reinstall
rm -rf .next node_modules
npm install
npm run build
```

#### Port Already in Use

```bash
# Find process using port 3000
lsof -i :3000  # macOS/Linux
netstat -ano | findstr :3000  # Windows

# Kill process
kill -9 <PID>  # macOS/Linux
taskkill /PID <PID> /F  # Windows

# Or use different port
npm run dev -- -p 3001
```

#### Environment Variables Not Loading

```bash
# Restart dev server after changing .env.local
# Ensure file is named exactly .env.local
# Check that variables start with NEXT_PUBLIC_ for client-side
```

## Resources

### Documentation

- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

### Tools

- [VS Code Extensions](https://marketplace.visualstudio.com/)
  - ESLint
  - Prettier
  - Tailwind CSS IntelliSense
  - GitLens

### Community

- [GitHub Discussions](https://github.com/avilaops/AvilaOps/discussions)
- [Issues](https://github.com/avilaops/AvilaOps/issues)

## Getting Help

Need assistance?

- 📖 Check this documentation
- 💬 Ask in [GitHub Discussions](https://github.com/avilaops/AvilaOps/discussions)
- 🐛 Report bugs in [Issues](https://github.com/avilaops/AvilaOps/issues)
- 📧 Email: contato@avilaops.com

---

**Happy coding!** 🚀

**AvilaOps Team**
