# 🌹 Eternal Flames

[![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.3-61dafb?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-316192?logo=postgresql)](https://neon.tech/)
[![Vercel](https://img.shields.io/badge/Deployed-Vercel-black?logo=vercel)](https://vercel.com/)

> A personal romantic timeline application built with Next.js, featuring client-side face detection, 3D particle effects, and optimized database queries.

**[Live Demo](#) | [Documentation Wiki](../../wiki) | [Architecture Guide](../../wiki/Architecture)**

---

## Overview

Eternal Flames is a web application for preserving and displaying memories in a timeline format. The project implements modern web development practices including React Server Components, cursor-based pagination, and MediaPipe face detection running in the browser.

## Features

### Face Detection
- MediaPipe face detection running in the browser via WebAssembly
- Calculates focus points for portrait-oriented images
- Aspect ratios stored in database to avoid re-computation
- ML models loaded on demand

### 3D Particle System
- Three.js particle system with animated elements
- Particle count adjusts based on device type (20 on mobile, 40-80 on desktop)
- Pauses when page is not visible
- Lazy-loaded to reduce initial bundle size

### Database & Performance
- PostgreSQL with cursor-based pagination for consistent query performance
- Server Components reduce client-side JavaScript
- HTTP caching with stale-while-revalidate
- Prefetches adjacent images for faster navigation

### Audio
- Background music with cross-fade transitions
- Autoplay handling for browser restrictions
- User-controlled volume settings

### Authentication
- NextAuth v5 for session management
- Bcrypt password hashing
- Parameterized database queries
- User-isolated data access

### UI
- Tailwind CSS for styling
- Framer Motion for animations
- Responsive layout
- Respects prefers-reduced-motion

## Tech Stack

### Core Technologies

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Framework** | Next.js 16.1.6 (App Router) | Server-first rendering, API routes, static optimization |
| **UI Library** | React 19.2.3 | Component architecture, concurrent features |
| **Language** | TypeScript 5 (strict) | Type safety, developer experience |
| **Styling** | Tailwind CSS 3.4 | Utility-first styling, responsive design |
| **Animation** | Framer Motion 12 | Declarative animations, gesture handling |
| **3D Graphics** | Three.js + @react-three/fiber | WebGL rendering, particle systems |
| **Database** | Neon PostgreSQL | Serverless Postgres, connection pooling |
| **Storage** | Vercel Blob | Optimized image CDN, automatic resizing |
| **Auth** | NextAuth 5.0 | JWT sessions, credential providers |
| **AI/ML** | MediaPipe Tasks Vision | Face detection, focus point analysis |

### Implementation Notes

- Server Components used by default to reduce client-side JavaScript
- Neon serverless PostgreSQL with connection pooling
- TypeScript strict mode enabled throughout
- File uploads validated for type and size

### Performance Optimizations

| Optimization | Implementation | Impact |
|-------------|----------------|---------|
| **Lazy Loading** | Dynamic imports for 3D scene | Reduced initial bundle |
| **Image Prefetch** | Adjacent memory preloading | Instant navigation |
| **API Caching** | Stale-while-revalidate strategy | Fewer database queries |
| **Cursor Pagination** | Keyset-based pagination | Consistent query speed |
| **Adaptive Particles** | Device-based particle count | Smooth 60fps animation |
| **Aspect Ratio Cache** | Database-persisted dimensions | Zero layout shift |

*Detailed optimization techniques available in the [Performance Wiki](../../wiki/Performance-Optimizations).*

## 📁 Project Structure

```
eternal-flames/
├── app/                          # Next.js App Router
│   ├── api/                      # REST API endpoints
│   │   ├── auth/                 # NextAuth configuration
│   │   └── memories/             # CRUD operations with pagination
│   ├── components/               # Page-specific components
│   │   ├── rose-petal-particles.tsx  # 3D particle system
│   │   ├── valentine-display.tsx     # Main display component
│   │   └── scene-wrapper.tsx         # Three.js scene manager
│   ├── login/                    # Authentication pages
│   └── valentine/                # Timeline application
│       ├── components/           # Valentine-specific UI
│       │   ├── central-image.tsx     # Smart image with face detection
│       │   ├── description-cards.tsx # Memory details
│       │   └── timeline-navigation.tsx
│       └── page.tsx              # Main timeline view
├── components/                   # Shared UI components
│   ├── ui/                       # shadcn/ui components
│   ├── add-memory-dialog.tsx    # Memory creation form
│   ├── archive-grid.tsx         # Image grid view
│   ├── journey-timeline.tsx     # Vertical timeline
│   └── music-provider.tsx       # Audio crossfade system
├── hooks/                        # Custom React hooks
│   ├── use-image-focus.ts       # MediaPipe face detection
│   └── use-toast.ts             # Toast notifications
├── lib/                          # Core utilities
│   ├── auth.ts                  # NextAuth configuration
│   ├── db.ts                    # Database connection pool
│   ├── memories.ts              # Data access layer
│   ├── schema.sql               # PostgreSQL schema
│   └── placeholder-images.ts    # Image placeholders
└── public/
    └── models/                   # ML models
        └── face_detector.tflite  # MediaPipe face detector
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** 20+ (LTS recommended)
- **pnpm** 9+ (`npm install -g pnpm`)
- **PostgreSQL** database ([Neon](https://neon.tech) recommended for serverless)
- **Vercel Blob** storage token ([Get one free](https://vercel.com/docs/storage/vercel-blob))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/lahiruC22/eternal-flames.git
   cd eternal-flames
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

4. **Configure `.env.local`**
   ```env
   # Database (Neon PostgreSQL)
   DATABASE_URL="postgresql://user:pass@host/dbname?sslmode=require"
   
   # NextAuth
   AUTH_SECRET="your-secret-here"  # Generate: openssl rand -base64 32
   NEXTAUTH_URL="http://localhost:3000"
   
   # Vercel Blob Storage
   BLOB_READ_WRITE_TOKEN="vercel_blob_rw_..."
   ```

5. **Initialize the database**
   ```bash
   # Execute schema in your Neon dashboard or via psql
   psql $DATABASE_URL -f lib/schema.sql
   
   # Create your first user (follow prompts)
   pnpm tsx scripts/create-user.ts
   ```

6. **Run the development server**
   ```bash
   pnpm dev
   ```

   Open [http://localhost:3000](http://localhost:3000) and log in with your credentials.

## Documentation

Additional documentation is available in the [GitHub Wiki](../../wiki):

- **[Architecture Overview](../../wiki/Architecture)** - System design and component details
- **[Performance Optimizations](../../wiki/Performance-Optimizations)** - Optimization techniques used
- **[Security Implementation](../../wiki/Security)** - Authentication and data protection
- **[API Documentation](../../wiki/API-Documentation)** - REST endpoint reference
- **[Database Schema](../../wiki/Database-Schema)** - Table structures and queries
- **[Face Detection Guide](../../wiki/Face-Detection)** - MediaPipe integration
- **[3D Particle System](../../wiki/3D-Particles)** - Three.js implementation
- **[Deployment Guide](../../wiki/Deployment)** - Deployment instructions

## Development

### Available Scripts

```bash
pnpm dev          # Start development server with Turbopack
pnpm build        # Build production bundle
pnpm start        # Start production server
pnpm lint         # Run ESLint with auto-fix
pnpm type-check   # Run TypeScript compiler check
```

### Code Quality Standards

- **TypeScript Strict Mode**: All code must pass strict type checking
- **ESLint**: Flat config with Next.js and React rules
- **Component Architecture**: Server Components by default, `"use client"` opt-in
- **Naming Conventions**: kebab-case for files, PascalCase for components
- **Git Workflow**: Feature branches from `main`, PR required for merge

### Testing Philosophy

This project emphasizes **type safety** and **linting** as primary quality gates:
- TypeScript strict mode catches logic errors at compile time
- ESLint enforces React best practices and async patterns
- Manual testing ensures UX quality and accessibility

## Security

### Authentication & Authorization
- **Session Management**: JWT tokens in HTTP-only cookies
- **Password Security**: Bcrypt hashing with 10 salt rounds
- **User Isolation**: All database queries filtered by authenticated user ID

### Data Protection
- **SQL Injection**: Parameterized queries via Neon's prepared statements
- **XSS Prevention**: React's automatic escaping + Content Security Policy
- **File Uploads**: Type validation, size limits, and content sanitization
- **API Rate Limiting**: Vercel's built-in DDoS protection

### Dependency Security
- Automated updates via Dependabot
- Regular vulnerability scans
- Minimal dependency footprint to reduce attack surface

## Deployment

### Vercel

The project is configured for Vercel deployment:

1. **Push to GitHub**
   ```bash
   git push origin main
   ```

2. **Connect to Vercel**
   - Import repository in [Vercel Dashboard](https://vercel.com/new)
   - Add environment variables from `.env.local`
   - Deploy automatically

3. **Environment Variables** (set in Vercel dashboard)
   - `DATABASE_URL` - Neon connection string
   - `AUTH_SECRET` - Random 32-byte string
   - `BLOB_READ_WRITE_TOKEN` - Vercel Blob token

### Alternative Platforms

While optimized for Vercel, the application can run on any Node.js host:
- **Docker**: Build with `node:20-alpine` base image
- **Self-Hosted**: Run `pnpm build && pnpm start`
- **Edge Networks**: Deploy to Cloudflare Workers or AWS Lambda@Edge

*See [Deployment Wiki](../../wiki/Deployment) for detailed instructions.*

## Implementation Details

### Face Detection
MediaPipe's TensorFlow Lite face detector runs in the browser via WebAssembly:
- Detects faces in uploaded images
- Calculates focus points for portrait cropping
- Results stored in database to avoid re-computation
- Falls back to center framing when no faces found

### Performance Approach
- Server Components minimize client-side JavaScript bundle
- Cursor-based pagination for consistent database query performance
- Adjacent images prefetched during navigation
- Particle count adapts based on device capabilities

### Code Quality
- TypeScript strict mode throughout codebase
- Connection pooling for database queries
- HTTP caching with stale-while-revalidate headers
- Error boundaries for graceful failure handling

## Contributing

Contributions are welcome! Please follow these guidelines:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

Ensure your code:
- Passes `pnpm lint` and `pnpm type-check`
- Follows existing architectural patterns
- Includes appropriate documentation

## License

This is a personal portfolio project.

## Acknowledgments

- **MediaPipe** - Face detection library
- **Three.js** - 3D graphics library
- **Vercel** - Deployment platform
- **Neon** - Serverless PostgreSQL

---

**Built with Next.js, React, and TypeScript**

*For questions, issues, or collaboration opportunities, please [open an issue](../../issues).*
