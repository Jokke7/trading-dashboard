# Trading Bot Dashboard

A simple, single-page dashboard for monitoring the trading bot at `trading.godot.no`.

## Features

- 📊 Real-time portfolio value and P&L tracking
- 🟢 Bot status indicator with emergency controls
- 💰 Market overview for BTC/USDT and ETH/USDT
- 📈 Portfolio chart (7-day history)
- 📋 Recent trades table
- 🔄 Auto-refresh every 30 seconds

## Tech Stack

- **Runtime**: Bun
- **Framework**: Next.js 15 + React 19
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **State**: TanStack Query (React Query)
- **Icons**: Lucide React

## Development

### Prerequisites

- Bun installed (`curl -fsSL https://bun.sh/install | bash`)
- Bot API running and accessible

### Setup

1. **Clone and install:**
   ```bash
   git clone https://github.com/Jokke7/trading-dashboard.git
   cd trading-dashboard
   bun install
   ```

2. **Configure environment:**
   ```bash
   cp .env.local.example .env.local
   # Edit .env.local with your API URL and key
   ```

3. **Run development server:**
   ```bash
   bun run dev
   ```

4. **Open in browser:**
   - Local: http://localhost:3000
   - LAN: http://YOUR_LOCAL_IP:3000 (see below)

### Viewing from Another PC on LAN

To access the dashboard from another computer on your local network:

**Option 1: Use your local IP address**
```bash
# Find your local IP
ip addr show | grep "inet " | grep -v 127.0.0.1
# Example output: inet 192.168.1.100/24

# Run dev server binding to all interfaces
bun run dev --hostname 0.0.0.0

# Then access from other PC:
# http://192.168.1.100:3000
```

**Option 2: Update package.json script**
```json
{
  "scripts": {
    "dev": "next dev --hostname 0.0.0.0",
    "dev:local": "next dev"
  }
}
```

Then use `bun run dev` for LAN access or `bun run dev:local` for localhost only.

**Security Note:** Only use LAN mode on trusted networks. The dev server is not secure for public internet exposure.

## Environment Variables

Create `.env.local` (not committed to git):

```bash
# Bot API Configuration
BOT_API_URL=http://localhost:3847
BOT_API_KEY=your_api_key_here
```

**Never commit `.env.local` to git!** It contains your API key.

## Building for Production

```bash
bun run build
```

The static export will be in the `out/` directory, ready for deployment to Cloudflare Pages.

## Deployment

This dashboard is designed to deploy to Cloudflare Pages:

1. Push to GitHub
2. Connect repo in Cloudflare Pages dashboard
3. Build command: `bun run build`
4. Output directory: `out`
5. Add environment variables in Cloudflare dashboard

## API Endpoints Used

The dashboard polls these endpoints from the bot API:

- `GET /health` - Bot status
- `GET /status` - Emergency stop state
- `GET /portfolio` - Account balances
- `GET /trades` - Trade history
- `GET /signals/:pair` - Technical indicators
- `POST /emergency-stop` - Stop/resume trading

All endpoints require `X-API-Key` header.

## License

MIT
