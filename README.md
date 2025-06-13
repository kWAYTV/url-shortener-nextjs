# URL Shortener

A modern, full-featured URL shortening service built with Next.js, featuring
AI-powered safety checks, user authentication, and comprehensive analytics.

[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/kWAYTV/url-shortener-nextjs)

## Features

- **URL Shortening**: Create shortened URLs with optional custom codes
- **AI Safety Checks**: Automatic URL safety verification using Google Gemini AI
- **User Authentication**: Multiple auth methods including GitHub OAuth and
  magic links
- **Analytics Dashboard**: Track clicks and manage your URLs
- **Admin Panel**: System management and moderation tools
- **QR Code Generation**: Generate QR codes for shortened URLs

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js App Router, Server Actions, Drizzle ORM
- **Database**: PostgreSQL
- **Authentication**: better-auth with GitHub OAuth
- **AI Integration**: Google Gemini API
- **Email**: Resend

## Getting Started

1. **Clone the repository**

   ```bash
   git clone https://github.com/kWAYTV/url-shortener-nextjs.git
   cd url-shortener-nextjs
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Set up environment variables** Create a `.env.local` file with required
   variables (see `.env.example`)

4. **Set up the database**

   ```bash
   pnpm db:push
   ```

5. **Run the development server**
   ```bash
   pnpm dev
   ```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Environment Variables

Key environment variables required:

- `DATABASE_URL` - PostgreSQL connection string
- `GITHUB_CLIENT_ID` & `GITHUB_CLIENT_SECRET` - GitHub OAuth
- `GOOGLE_GEMINI_API_KEY` - For AI safety checks
- `RESEND_API_KEY` - Email service
- `BETTER_AUTH_SECRET` - Authentication secret
