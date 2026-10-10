# AI Trading Analyst Pro

A mobile-first AI-powered trading analysis dashboard for technical analysis, signal generation, paper trading, and chart review.

## Features
- Live or demo market data for crypto, forex, stocks, and XAU/USD
- Technical analysis across EMA, RSI, MACD, VWAP, Bollinger Bands, ATR, support/resistance and volume confirmation
- BUY / SELL / WAIT signal engine with clear invalidation logic
- Entry, stop loss and take-profit calculators with configurable risk settings
- Screenshot chart upload workflow with manual fallback when precise market values are not readable
- Trade journal, watchlist, alerts, and paper-trading dashboard
- Responsive, dark-mode trading terminal UI

## Demo mode and limitations
This MVP is intentionally configured to run in demo mode by default. No real-money execution or guaranteed profits are offered.

The app does not fabricate live prices. When real market-data integration is not configured, it clearly labels the data as simulated.

## Stack
- Next.js 14
- TypeScript
- Tailwind CSS
- lightweight-charts
- Node.js API routes for analysis logic

## Getting started

1. Install dependencies:
   npm install

2. Copy environment variables:
   cp .env.example .env.local

3. Start the local app:
   npm run dev

4. Open http://localhost:3000

## Demo provider configuration
The app defaults to demo market data. For production use, configure a legitimate provider such as Binance or a licensed broker / market data vendor via server-side environment variables and do not expose secret keys in frontend code.

## Risk disclosure
This application is for educational and research use only. Signals are not guaranteed to be profitable and may fail due to market conditions, volatility, spread, fees, slippage or stale data.

## Deployment
- Vercel: `vercel` with env vars from `.env.example`
- Or use a Node host with `npm run build && npm run start`

## Testing
- `npm test`
