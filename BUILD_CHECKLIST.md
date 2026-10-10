# AI Trading Analyst Pro - Local Setup Guide

## Prerequisites
- Node.js 18+ (download from [nodejs.org](https://nodejs.org))
- npm or yarn package manager
- Git

## Installation Steps

### 1. Clone and Install
```bash
git clone https://github.com/viveklkr95-dotcom/ai-trading-analyst-pro.git
cd ai-trading-analyst-pro
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env.local
```

The default `.env.local` includes:
- `NEXT_PUBLIC_APP_NAME="AI Trading Analyst Pro"`
- `NEXT_PUBLIC_DEMO_MODE=true` (demo mode enabled by default)
- `NEXT_PUBLIC_API_BASE_URL=http://localhost:3000`
- `MARKET_DATA_PROVIDER=demo`

### 3. Run Development Server
```bash
npm run dev
```

The app will start at [http://localhost:3000](http://localhost:3000)

### 4. Build for Production
```bash
npm run build
npm run start
```

### 5. Run Tests
```bash
npm test
```

## Project Structure

```
.
├── app/                      # Next.js app directory
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Home page
│   ├── globals.css          # Global styles
│   └── api/
│       ├── analyze/         # Signal analysis endpoint
│       └── market/          # Market data endpoint
├── components/
│   ├── trading-dashboard.tsx # Main dashboard (client)
│   └── ui.tsx               # Reusable UI components
├── lib/
│   ├── types.ts             # TypeScript type definitions
│   ├── analysis.ts          # Technical analysis logic
│   └── analysis.test.ts     # Unit tests
├── package.json             # Dependencies
├── tsconfig.json            # TypeScript config
├── tailwind.config.ts       # Tailwind CSS config
├── next.config.mjs          # Next.js config
└── .env.example             # Environment template
```

## Key Features (MVP)

✅ Live Chart
- Candlestick rendering using lightweight-charts
- Symbol and timeframe selector
- Demo market data (simulated)
- Responsive, dark-mode UI

✅ Technical Indicators
- EMA 9, 20, 50, 200
- RSI 14
- MACD & Signal Line
- VWAP
- Bollinger Bands
- ATR (Average True Range)
- Support & Resistance

✅ Signal Engine
- BUY / SELL / WAIT status
- Entry zone calculation
- Stop loss (based on market structure & ATR)
- Take profit targets (TP1, TP2, TP3)
- Risk/reward ratio
- Signal strength (0-100)
- Reasons for signal
- Invalidation conditions

✅ Risk Calculator
- Account balance input
- Risk percentage per trade (0.5% - 5%)
- Position size estimation
- Configurable risk/reward presets

✅ Explanations
- English explanation
- Hindi explanation
- Both reflect actual calculated indicators

✅ Dashboard Sections
- Market overview
- Indicator summary
- Watchlist (5 symbols)
- Alerts info
- Trade journal (demo)
- Risk disclosures
- Chart screenshot upload area

## Demo Mode Details

The app runs entirely in demo mode by default:
- Market data is simulated using algorithmic candle generation
- No real API keys or broker connections
- No real-money execution (disabled)
- All prices and signals are not guaranteed and for educational purposes only
- The UI clearly labels data as "Demo feed · delayed"

## Known Limitations

1. Market Data: Currently simulated; requires live provider integration (Binance, Alpha Vantage, etc.)
2. Chart Upload: Screenshot analysis UI is present but vision model integration is not yet implemented
3. Alerts: Notifications are UI-ready but require browser permission & backend subscription logic
4. Paper Trading: Dashboard shows mock trades; persistent storage and real paper-trading backend needed
5. Multi-timeframe Confirmation: Indicator data is single-timeframe; logic can be extended
6. Backtesting: Strategy backtesting framework not yet built

## Troubleshooting

### Port 3000 Already in Use
```bash
# Use a different port
npm run dev -- -p 3001
```

### Module Not Found Errors
```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install
```

### TypeScript Errors
```bash
# Check for strict type issues
npm run lint
```

## Next Steps

1. Connect Real Market Data
   - Configure a provider API (Binance, Polygon.io, etc.)
   - Update `/app/api/market/route.ts` to fetch live candles
   - Store API keys securely in `.env.local` (server-side only)

2. Implement Paper Trading Backend
   - Add database (SQLite, PostgreSQL) for trade history
   - Create `/app/api/trades/` endpoints for CRUD operations
   - Implement trade journal persistence

3. Add Vision Model Integration
   - Integrate OpenAI Vision API or Claude Vision
   - Process uploaded chart screenshots
   - Extract visible patterns and price levels

4. Deploy
   - Vercel: `vercel`
   - Docker: Build with `npm run build` and run `npm start`
   - Node host: Push code and run `npm run start`

## Risk Disclosure

This application is for educational and research use only. Signals are NOT guaranteed to be profitable and may fail due to:
- Market volatility
- Slippage and spreads
- Stale or delayed data
- Network failures
- Overnight gaps
- Black swan events

Never trade with real money based solely on this tool without your own due diligence and risk management.

## Support

For issues, feature requests, or improvements, please open a GitHub issue or contact the development team.
