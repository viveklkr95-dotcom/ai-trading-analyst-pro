import type { NextRequest } from 'next/server';
import { buildSignal, defaultTimeframes, generateDemoCandles } from '@/lib/analysis';
import { availableSymbols, type Timeframe } from '@/lib/types';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get('symbol') ?? 'BTC/USDT';
  const timeframe = (searchParams.get('timeframe') ?? '1h') as Timeframe;

  const candles = generateDemoCandles(symbol, timeframe, 160);
  const last = candles.at(-1);

  const snapshot = {
    symbol,
    timeframe,
    source: 'demo',
    price: last?.close ?? 0,
    timestamp: new Date(last?.time ?? Date.now()).toISOString(),
    changePercent: (((last?.close ?? 0) - (candles[0]?.open ?? 0)) / (candles[0]?.open ?? 1)) * 100,
    volume: candles.slice(-20).reduce((sum, c) => sum + c.volume, 0),
    volatility: 0,
    trend: 'bullish',
    candles,
  };

  return Response.json(snapshot);
}
