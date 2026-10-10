# AI Trading Analyst Pro - Deployment Guide

## Quick Start - Vercel (Recommended)

Vercel is the easiest way to deploy Next.js apps.

### 1. Push to GitHub
```bash
git add .
git commit -m "Deploy AI Trading Analyst Pro"
git push origin main
```

### 2. Connect to Vercel
- Go to [vercel.com](https://vercel.com)
- Click "New Project"
- Select your GitHub repository
- Click "Import"

### 3. Configure Environment
In Vercel Project Settings → Environment Variables, add:
```
NEXT_PUBLIC_APP_NAME=AI Trading Analyst Pro
NEXT_PUBLIC_DEMO_MODE=true
NEXT_PUBLIC_API_BASE_URL=https://your-domain.vercel.app
MARKET_DATA_PROVIDER=demo
```

### 4. Deploy
- Click "Deploy"
- Vercel will build and deploy automatically
- Your app is live at `your-project.vercel.app`

---

## Self-Hosted - Docker

### 1. Create Dockerfile
```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
RUN npm ci --only=production
EXPOSE 3000
CMD ["npm", "start"]
```

### 2. Build & Run Locally
```bash
docker build -t ai-trading-analyst-pro .
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_DEMO_MODE=true \
  -e MARKET_DATA_PROVIDER=demo \
  ai-trading-analyst-pro
```

### 3. Push to Registry
```bash
# Docker Hub
docker tag ai-trading-analyst-pro your-username/ai-trading-analyst-pro
docker push your-username/ai-trading-analyst-pro

# Or use GitHub Container Registry
docker tag ai-trading-analyst-pro ghcr.io/viveklkr95-dotcom/ai-trading-analyst-pro
docker push ghcr.io/viveklkr95-dotcom/ai-trading-analyst-pro
```

### 4. Deploy to Cloud

#### AWS ECS
```bash
# Create ECS task definition with Docker image
# Configure CloudWatch logs
# Deploy service
# Attach load balancer
```

#### Google Cloud Run
```bash
gcloud run deploy ai-trading-analyst-pro \
  --image gcr.io/your-project/ai-trading-analyst-pro \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

#### DigitalOcean App Platform
- Connect GitHub repo
- Choose Docker buildpack
- Set environment variables
- Deploy

---

## Self-Hosted - Node.js + PM2

### 1. SSH into Server
```bash
ssh user@your-server.com
cd /var/www
```

### 2. Clone Repository
```bash
git clone https://github.com/viveklkr95-dotcom/ai-trading-analyst-pro.git
cd ai-trading-analyst-pro
```

### 3. Install & Build
```bash
npm ci
npm run build
```

### 4. Create .env.local
```bash
cat > .env.local << 'EOF'
NEXT_PUBLIC_APP_NAME=AI Trading Analyst Pro
NEXT_PUBLIC_DEMO_MODE=true
NEXT_PUBLIC_API_BASE_URL=https://your-domain.com
MARKET_DATA_PROVIDER=demo
EOF
```

### 5. Setup PM2
```bash
npm install -g pm2
pm2 start "npm start" --name "trading-app"
pm2 startup
pm2 save
```

### 6. Setup Nginx Reverse Proxy
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 7. Enable HTTPS (Let's Encrypt)
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

---

## Environment Variables

### Frontend (Public)
These are exposed to the browser:
```
NEXT_PUBLIC_APP_NAME=AI Trading Analyst Pro
NEXT_PUBLIC_DEMO_MODE=true
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
```

### Backend (Server-only)
These are never exposed to clients:
```
MARKET_DATA_PROVIDER=demo
BINANCE_API_KEY=your-api-key
BINANCE_API_SECRET=your-api-secret
ALPHA_VANTAGE_API_KEY=your-api-key
DATABASE_URL=postgresql://user:pass@host/db
```

---

## Live Data Integration

### For Binance (Crypto)

1. Create API key at [binance.com/api](https://www.binance.com/en/account/api-management)
2. Add to `.env.local`:
   ```
   BINANCE_API_KEY=your-key
   BINANCE_API_SECRET=your-secret
   ```
3. Update `/app/api/market/route.ts`:
   ```typescript
   import { Binance } from 'binance-api-node';
   
   const client = new Binance({
     apiKey: process.env.BINANCE_API_KEY,
     apiSecret: process.env.BINANCE_API_SECRET,
   });
   
   export async function GET(request: NextRequest) {
     const { searchParams } = new URL(request.url);
     const symbol = searchParams.get('symbol') ?? 'BTCUSDT';
     const interval = searchParams.get('timeframe') ?? '1h';
     
     const candles = await client.candles({ symbol, interval, limit: 160 });
     // Return formatted response
   }
   ```

### For Alpha Vantage (Forex/Stocks/Crypto)

1. Get API key at [alphavantage.co](https://www.alphavantage.co/api/)
2. Add to `.env.local`:
   ```
   ALPHA_VANTAGE_API_KEY=your-key
   ```
3. Update `/app/api/market/route.ts`:
   ```typescript
   const response = await fetch(
     `https://www.alphavantage.co/query?function=FX_DAILY&from_symbol=EUR&to_symbol=USD&apikey=${process.env.ALPHA_VANTAGE_API_KEY}`
   );
   const data = await response.json();
   // Process and return
   ```

---

## Monitoring & Logs

### Vercel
- Logs: Vercel Dashboard → Functions → Logs
- Analytics: Real-time request metrics
- Errors: Real-time alerts

### Docker
```bash
docker logs -f container-id
```

### PM2
```bash
pm2 logs
pm2 monit
pm2 start trading-app --watch  # Auto-restart on code change
```

### Nginx
```bash
tail -f /var/log/nginx/error.log
tail -f /var/log/nginx/access.log
```

---

## Scaling

### Vercel
- Automatic scaling with CDN
- Edge functions for API optimization
- No configuration needed

### Docker
- Use Kubernetes for orchestration
- Use Docker Compose for multi-container setup
- Load balance multiple instances

### PM2
```bash
pm2 start "npm start" -i max  # Use all CPU cores
pm2 start "npm start" -i 4     # Use 4 processes
```

---

## Rollback & Updates

### Vercel
- Automatic rollback available in dashboard
- Deployments are instant

### Docker
```bash
# Rollback to previous image
docker run -p 3000:3000 ai-trading-analyst-pro:previous-tag
```

### PM2
```bash
pm2 update  # Reload app with new code
pm2 restart trading-app
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| 502 Bad Gateway | Check if app is running; restart PM2 or container |
| 503 Service Unavailable | Server is overloaded; scale up or optimize code |
| Chart not loading | Check API endpoint in browser DevTools; ensure CORS is configured |
| Memory leak | Check for uncleared intervals; use memory profiler |
| Slow API response | Add database indexing; cache frequent queries |

---

## Support & Maintenance

- Monitor error rates in production
- Keep Node.js and dependencies updated
- Backup database regularly
- Review security logs
- Test disaster recovery procedures
