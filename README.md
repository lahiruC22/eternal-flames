# Eternal Flames - Valentine's Story

[![CI](https://github.com/YOUR_USERNAME/eternal-flames/actions/workflows/ci.yml/badge.svg)](https://github.com/YOUR_USERNAME/eternal-flames/actions/workflows/ci.yml)
[![Security](https://github.com/YOUR_USERNAME/eternal-flames/actions/workflows/security.yml/badge.svg)](https://github.com/YOUR_USERNAME/eternal-flames/actions/workflows/security.yml)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black)](https://nextjs.org/)

A romantic timeline application to capture and cherish special moments together. Built with modern web technologies and deployed on Vercel.

## ✨ Features

- 🎨 Beautiful 3D rose petal particle effects
- 📸 Image upload with Vercel Blob storage
- 🗄️ PostgreSQL database with Neon
- 🔐 Secure authentication with NextAuth
- 📱 Fully responsive mobile design
- ⚡ Server-first architecture with React Server Components

## 🚀 Tech Stack

- **Framework**: Next.js 16.1.6 (App Router)
- **Language**: TypeScript 5 (strict mode)
- **UI**: React 19, Tailwind CSS, Framer Motion
- **3D Graphics**: Three.js, React Three Fiber
- **Database**: Neon PostgreSQL (serverless)
- **Storage**: Vercel Blob
- **Auth**: NextAuth v5
- **Deployment**: Vercel (automatic from main branch)

## 📦 Getting Started

### Prerequisites

- Node.js 20+
- pnpm 9+
- PostgreSQL database (Neon recommended)
- Vercel Blob storage token

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/YOUR_USERNAME/eternal-flames.git
   cd eternal-flames
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```

4. Configure your `.env.local`:
   ```env
   DATABASE_URL="postgresql://..."
   AUTH_SECRET="..." # Generate with: openssl rand -base64 32
   BLOB_READ_WRITE_TOKEN="..."
   ```

5. Set up the database:
   ```bash
   # Run the schema SQL in your Neon dashboard
   cat lib/schema.sql
   
   # Create initial user
   pnpm tsx scripts/create-user.ts
   ```

6. Run the development server:
   ```bash
   pnpm dev
   ```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 🔧 Development

### Available Scripts

- `pnpm dev` - Start development server with Turbopack
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

### Project Structure

```
eternal-flames/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── components/        # Page-specific components
│   └── valentine/         # Valentine timeline page
├── components/            # Shared UI components
├── lib/                   # Utilities and data access
│   ├── db.ts             # Database connection
│   ├── auth.ts           # NextAuth configuration
│   ├── memories.ts       # Data access layer
│   └── schema.sql        # Database schema
├── hooks/                # Custom React hooks
└── public/               # Static assets
```

## 🔒 Security

- Passwords hashed with bcrypt (10 salt rounds)
- JWT-based sessions (HTTP-only cookies)
- Environment variables validated at runtime
- SQL injection protection via parameterized queries
- User isolation enforced in all database queries
- File upload validation (type, size, sanitization)

## 🚦 CI/CD

### Automated Checks

Every pull request and push to `main` triggers:

- **Code Quality**: ESLint, TypeScript type checking
- **Build Verification**: Production build test
- **Security**: CodeQL analysis, dependency review
- **Dependencies**: Automated updates via Dependabot

### Deployment

Vercel handles deployment automatically:
- **Production**: Deploys from `main` branch
- **Preview**: Deploys from pull requests
- No manual deployment needed

## 📖 Documentation

- [Best Practices](BEST-PRACTICES.md) - Engineering patterns and standards
- [Performance Guide](PERFORMANCE.md) - Optimization recommendations
- [UI/UX Improvements](UI-UX-IMPROVEMENTS.md) - Accessibility and UX enhancements
- [Setup Guide](SETUP-AUTH-STORAGE.md) - Authentication and storage configuration

## 🤝 Contributing

1. Create a feature branch from `main`
2. Make your changes
3. Ensure all CI checks pass
4. Submit a pull request

## 📝 License

This is a personal project. All rights reserved.

## 🙋 Support

For issues or questions, please open a GitHub issue.

---

**Built with ❤️ using Next.js and React**
