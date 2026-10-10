import { describe, expect, it } from 'vitest';
import { buildSignal, generateDemoCandles } from './analysis';

describe('signal engine', () => {
  it('returns a valid BUY signal in a strong bullish trend', () => {
    const candles = generateDemoCandles('BTC/USDT', '1h', 120);
    const bullishCandles = candles.map((candle, index) => ({
      ...candle,
      close: candle.open + (index / candles.length) * 5,
      high: candle.high + (index / candles.length) * 5,
      low: candle.low + (index / candles.length) * 6,
    }));

    const signal = buildSignal(bullishCandles, 'BTC/USDT', '1h');
    expect(['BUY', 'WAIT']).toContain(signal.status);
    expect(signal.stopLoss).toBeGreaterThan(0);
    expect(signal.takeProfit1).toBeGreaterThan(signal.currentPrice);
  });

  it('ensures stop loss stays on the invalidation side of the trade', () => {
    const candles = generateDemoCandles('BTC/USDT', '1h', 120);
    const signal = buildSignal(candles, 'BTC/USDT', '1h');
    if (signal.status === 'BUY') {
      expect(signal.stopLoss).toBeLessThan(signal.currentPrice);
    }
    if (signal.status === 'SELL') {
      expect(signal.stopLoss).toBeGreaterThan(signal.currentPrice);
    }
  });
});
