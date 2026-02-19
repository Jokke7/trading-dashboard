# Trading Dashboard — Agent Guidelines

> Guidelines for agentic coding agents working on this repository.

---

## Project Overview

- **Type**: Next.js 16 monitoring dashboard for trading bot
- **Runtime**: Bun
- **Framework**: Next.js 16 + React 19 + Tailwind CSS v4
- **Charts**: Recharts
- **State Management**: TanStack Query (React Query)
- **API**: Polls bot API at `/health`, `/status`, `/portfolio`, `/positions`, `/recommendations`, `/trades`, `/signals/:pair`
- **Deployment**: Static export to Cloudflare Pages

---

## Development Commands

| Command | Description |
|---------|-------------|
| `bun run dev` | Start dev server (0.0.0.0 for LAN access) |
| `bun run build` | Build for production (static export) |
| `bun run lint` | Run ESLint |

---

## Code Style

- Use Tailwind CSS classes for styling
- Follow existing component patterns in `src/components/`
- Use TanStack Query hooks for data fetching
- All components must be `'use client'` since using React Query

---

## Environment Variables

Create `.env.local`:
```bash
NEXT_PUBLIC_BOT_API_URL=https://bot.godot.no
NEXT_PUBLIC_BOT_API_KEY=your_api_key
```

---

## Key Files

- `src/app/page.tsx` - Main dashboard layout
- `src/components/` - UI components (MarketCard, StatsCards, Sidebar, etc.)
- `src/hooks/useBotData.ts` - React Query hooks for bot API
- `src/lib/api.ts` - API fetch functions
- `src/types/index.ts` - TypeScript interfaces

---

## Adding New API Endpoints

1. Add type to `src/types/index.ts`
2. Add fetch function to `src/lib/api.ts`
3. Add hook to `src/hooks/useBotData.ts`
4. Use in component

---

## Git Workflow

1. Never commit to main without user approval
2. Run lint before committing
3. Use clear commit messages
