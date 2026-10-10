# LOCAL BUILD CHECK - RUN THIS

## Prerequisites
✓ Node.js 18+
✓ npm installed
✓ Git clone complete
✓ .env.local created

## Step 1: Install Dependencies
Run: npm install
Expected: ✓ packages installed without errors

## Step 2: Verify TypeScript Config
Run: npm run lint
Expected: ✓ No errors

## Step 3: Run Tests
Run: npm test
Expected:
  ✓ signal engine (2 tests)
    ✓ returns a valid BUY signal in a strong bullish trend
    ✓ ensures stop loss stays on the invalidation side of the trade

## Step 4: Start Development Server
Run: npm run dev
Expected:
  ▲ Next.js 14.2.15
  - Local:        http://localhost:3000
  ✓ ready started server on 0.0.0.0:3000

## Step 5: Open Browser
URL: http://localhost:3000

Checklist:
☐ Page loads without errors
☐ Dark theme displays
☐ "AI Trading Analyst Pro" header visible
☐ Candlestick chart renders (not blank)
☐ Symbol dropdown contains: BTC/USDT, ETH/USDT, EUR/USD, etc.
☐ Timeframe selector shows: 1m, 5m, 15m, 30m, 1h, 4h, 1d
☐ "BUY", "SELL", or "WAIT" status displays in large text
☐ Entry zone, SL, TP levels show numbers
☐ Risk/Reward ratio displays (e.g., "1 : 1.50")
☐ Indicator values show for EMA, RSI, VWAP
☐ English explanation visible
☐ Hindi explanation visible
☐ "Demo feed · delayed" label visible (bottom right of chart)
☐ "Demo" badge shows in data source field
☐ Risk disclosures visible at bottom
☐ Watchlist shows 5 symbols
☐ Alert info section present
☐ Trade journal shows mock entries
☐ Screenshot upload area present

## Step 6: Test Interactivity
☐ Change symbol dropdown → chart updates
☐ Change timeframe → chart and signal update
☐ Adjust account balance slider → position size changes
☐ Adjust risk percent slider → position size changes
☐ Try search box → filters symbols
☐ Resize browser window → layout adapts (responsive)
☐ Open DevTools → no console errors

## Step 7: Build Production
Run: npm run build
Expected:
  ▲ Next.js 14.2.15
  ✓ Compiled successfully
  ○ Collecting page data
  ○ Generating static pages
  ✓ Routes have been built successfully

## Step 8: Test Production Build
Run: npm run start
URL: http://localhost:3000
Expected: App loads and functions identically to dev mode

## All Checks Passed?
✅ YES → App is build-ready for deployment
❌ NO → See TROUBLESHOOTING in SETUP.md

---

Notes:
- The app is in DEMO MODE by default
- All market data is SIMULATED
- No real-money trading is enabled
- Signals are NOT guaranteed and for educational use only
- This is an MVP; feature-complete but not production-integrated with live data
