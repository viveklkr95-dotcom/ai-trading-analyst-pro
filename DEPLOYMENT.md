# Build & Deployment Checklist

## ✅ Pre-Build Verification

- [ ] Node.js 18+ installed (`node --version`)
- [ ] npm installed (`npm --version`)
- [ ] Git configured
- [ ] `.env.local` file created from `.env.example`
- [ ] All dependencies installed (`npm install`)

## ✅ Local Development Build

```bash
# Start dev server
npm run dev

# Expected output:
# ▲ Next.js 14.2.15
# - Local:        http://localhost:3000
# - Network:      http://[your-ip]:3000
```

### Check These in Browser
- [ ] App loads at http://localhost:3000
- [ ] Dark theme displays correctly
- [ ] Candlestick chart renders (no blank area)
- [ ] Symbol dropdown works
- [ ] Timeframe selector works
- [ ] BUY/SELL/WAIT signal displays
- [ ] Entry, SL, TP levels show values
- [ ] Risk calculator is interactive
- [ ] Indicators display EMA, RSI, VWAP, etc.
- [ ] English & Hindi explanations render
- [ ] Mobile layout is responsive (use DevTools)

## ✅ TypeScript Compilation

```bash
# Check for type errors
npm run lint

# Expected: No errors or warnings related to app logic
```

## ✅ Test Suite

```bash
# Run tests
npm test

# Expected output:
# ✓ signal engine (2 tests)
#   ✓ returns a valid BUY signal in a strong bullish trend
#   ✓ ensures stop loss stays on the invalidation side of the trade
```

## ✅ Production Build

```bash
# Build for production
npm run build

# Expected output:
# ▲ Next.js 14.2.15
# ✓ Compiled successfully
# ○ Collecting page data
# ○ Generating static pages
# ✓ Routes have been built successfully
```

### Common Build Errors & Fixes

| Error | Cause | Fix |
|-------|-------|-----|
| `Cannot find module '@/lib/types'` | Path alias not resolved | Ensure `tsconfig.json` has `baseUrl: "."` |
| `React is not defined` | Missing import | Add `'use client'` to component top |
| `ReferenceError: window is undefined` | SSR/Client mismatch | Wrap in `useEffect` or use `'use client'` |
| `Module not found: lightweight-charts` | Missing dependency | Run `npm install` |

## ✅ Production Start

```bash
# Start production server
npm run start

# Expected: Server runs on http://localhost:3000
# Visit the URL and verify app loads
```

## ✅ Performance Checks

- [ ] Chart renders smoothly (no lag when changing timeframes)
- [ ] Signal updates without page reload
- [ ] Indicators calculate in < 100ms
- [ ] No console errors or warnings
- [ ] Network tab shows no failed requests

## ✅ Deployment Readiness

### For Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow prompts
```

### For Docker
```bash
# Create Dockerfile (if not exists)
cat > Dockerfile << 'EOF'
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
EOF

# Build image
docker build -t ai-trading-analyst-pro .

# Run container
docker run -p 3000:3000 ai-trading-analyst-pro
```

### For Node.js Host
```bash
# Upload project to host
# SSH into server and:
cd /path/to/ai-trading-analyst-pro
npm ci
npm run build
npm start

# Or use PM2 for process management:
npm i -g pm2
pm2 start "npm start" --name "trading-app"
pm2 save
```

## ✅ Post-Deployment Verification

- [ ] App loads at deployed URL
- [ ] Chart renders on mobile
- [ ] No 404 or 500 errors in logs
- [ ] API endpoints respond (check Network tab)
- [ ] Demo mode clearly labeled
- [ ] Risk disclosures visible

## ✅ Security Checklist

- [ ] No API keys in frontend code
- [ ] `.env.local` is in `.gitignore`
- [ ] `.env.example` has dummy values only
- [ ] HTTPS enabled on production
- [ ] No console.log statements with sensitive data
- [ ] Server-side environment variables are not exposed

## Notes

- The app is demo-mode by default and uses simulated market data.
- No real-money execution is enabled.
- For production with live data, configure market provider API keys securely.
- Always test thoroughly before enabling any real trading features.
