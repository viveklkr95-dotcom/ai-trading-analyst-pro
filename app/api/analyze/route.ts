import type { NextRequest } from 'next/server';
import { generateDemoCandles, buildSignal } from '@/lib/analysis';
import type { Timeframe } from '@/lib/types';

const provider = process.env.MARKET_DATA_PROVIDER ?? 'demo';

function getNormalizedSymbol(symbol: string): string {
  const normalized = symbol.trim();
  if (normalized === 'BTC/USDT') return 'BTCUSDT';
  if (normalized === 'ETH/USDT') return 'ETHUSDT';
  if (normalized === 'EUR/USD') return 'EURUSD';
  if (normalized === 'GBP/USD') return 'GBPUSD';
  if (normalized === 'USD/JPY') return 'USDJPY';
  if (normalized === 'XAU/USD') return 'XAUUSD';
  return normalized.replace(/\//g, '').toUpperCase();
}

async function fetchDemoData(symbol: string, timeframe: Timeframe) {
  const candles = generateDemoCandles(symbol, timeframe, 160);
  return {
    signal: buildSignal(candles, symbol, timeframe),
    candles,
    source: 'demo',
    warning: 'This is simulated market data for demonstration. No live prices are guaranteed.',
  };
}

async function fetchBinanceData(symbol: string, timeframe: Timeframe) {
  const apiKey = process.env.BINANCE_API_KEY;
  if (!apiKey) {
    const demoCandles = generateDemoCandles(symbol, timeframe, 160);
    return {
      signal: buildSignal(demoCandles, symbol, timeframe),
      candles: demoCandles,
      source: 'demo',
      warning: 'BINANCE_API_KEY is not configured. Falling back to simulated demo data.',
    };
  }

  try {
    const normalized = getNormalizedSymbol(symbol);
    const interval = timeframe === '1m' ? '1m' : timeframe === '5m' ? '5m' : timeframe === '15m' ? '15m' : timeframe === '30m' ? '30m' : timeframe === '1h' ? '1h' : timeframe === '4h' ? '4h' : '1d';
    const response = await fetch(`https://api.binance.com/api/v3/klines?symbol=${normalized}&interval=${interval}&limit=160`, {
      headers: { 'X-MBX-APIKEY': apiKey },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Binance responded with ${response.status}`);
    }

    const raw = await response.json();
    const candles = raw.map((bar: any[]) => ({
      time: Number(bar[0]),
      open: Number(bar[1]),
      high: Number(bar[2]),
      low: Number(bar[3]),
      close: Number(bar[4]),
      volume: Number(bar[5]),
    }));

    return {
      signal: buildSignal(candles, symbol, timeframe),
      candles,
      source: 'live',
      warning: 'This data comes from Binance. Verify pricing before taking action.',
    };
  } catch (error) {
    console.error('Binance fetch failed:', error);
    return fetchDemoData(symbol, timeframe);
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get('symbol') ?? 'BTC/USDT';
  const timeframe = (searchParams.get('timeframe') ?? '1h') as Timeframe;

  if (provider === 'binance') {
    return Response.json(await fetchBinanceData(symbol, timeframe));
  }

  return Response.json(await fetchDemoData(symbol, timeframe));
}
