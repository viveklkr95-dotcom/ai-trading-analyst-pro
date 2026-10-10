import type { NextRequest } from 'next/server';
import { buildSignal, generateDemoCandles } from '@/lib/analysis';
import type { Timeframe } from '@/lib/types';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get('symbol') ?? 'BTC/USDT';
  const timeframe = (searchParams.get('timeframe') ?? '1h') as Timeframe;

  const candles = generateDemoCandles(symbol, timeframe, 160);
  const signal = buildSignal(candles, symbol, timeframe);

  return Response.json({
    signal,
    candles,
    source: 'demo',
    warning: 'This is simulated market data for demonstration. No live prices are guaranteed.',
  });
}
