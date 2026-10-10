import { Candle, Timeframe, availableSymbols, TradePlan } from './types';

export function generateDemoCandles(symbol: string, timeframe: Timeframe = '1h', count = 120): Candle[] {
  const symbolMeta = availableSymbols.find((s) => s.symbol === symbol) ?? availableSymbols[0];
  const base = symbolMeta.basePrice;
  const stepMap: Record<Timeframe, number> = {
    '1m': 0.0008,
    '5m': 0.002,
    '15m': 0.0035,
    '30m': 0.005,
    '1h': 0.008,
    '4h': 0.015,
    '1d': 0.03,
  };
  const drift = Math.sin(count / 8) * 0.012;
  const candles: Candle[] = [];
  let current = base * (1 - 0.1 + Math.random() * 0.2);
  const now = Date.now();

  for (let i = count; i >= 0; i -= 1) {
    const wave = Math.sin((i + 1) / 11) * stepMap[timeframe] * base;
    const momentum = (i % 18) / 18;
    const open = current;
    const move = (Math.random() - 0.47) * base * stepMap[timeframe] * 1.4 + wave * 0.22 + (drift * base * 0.2);
    const close = Math.max(0.0001, open * (1 + move * 0.0008 + momentum * 0.0005));
    const high = Math.max(open, close) * (1 + (Math.random() * 0.008) + Math.abs(Math.sin(i)) * 0.0036);
    const low = Math.min(open, close) * (1 - (Math.random() * 0.008) - Math.abs(Math.cos(i)) * 0.0036);
    const volume = Math.round((300 + Math.random() * 500) * (1 + Math.abs(move) * 1500));
    candles.push({
      time: now - i * getTimeframeMs(timeframe),
      open: Number(open.toFixed(4)),
      high: Number(high.toFixed(4)),
      low: Number(low.toFixed(4)),
      close: Number(close.toFixed(4)),
      volume,
    });
    current = close;
  }

  return candles;
}

export function getTimeframeMs(timeframe: Timeframe): number {
  const map: Record<Timeframe, number> = {
    '1m': 60_000,
    '5m': 5 * 60_000,
    '15m': 15 * 60_000,
    '30m': 30 * 60_000,
    '1h': 60 * 60_000,
    '4h': 4 * 60 * 60_000,
    '1d': 24 * 60 * 60_000,
  };
  return map[timeframe];
}

export function calculateEMA(values: number[], period: number): number {
  if (!values.length) return 0;
  const multiplier = 2 / (period + 1);
  let ema = values[0];
  for (let i = 1; i < values.length; i += 1) {
    ema = values[i] * multiplier + ema * (1 - multiplier);
  }
  return ema;
}

export function calculateRSI(values: number[], period = 14): number {
  if (values.length <= period) return 50;
  let gains = 0;
  let losses = 0;
  for (let i = values.length - period; i < values.length; i += 1) {
    const delta = values[i] - values[i - 1];
    if (delta >= 0) gains += delta; else losses += Math.abs(delta);
  }
  const avgGain = gains / period;
  const avgLoss = losses / period;
  if (avgLoss === 0) return 100;
  const rs = avgGain / avgLoss;
  return 100 - 100 / (1 + rs);
}

export function getVWAP(candles: Candle[]): number {
  const totalPriceVolume = candles.reduce((sum, c) => sum + ((c.high + c.low + c.close) / 3) * c.volume, 0);
  const totalVolume = candles.reduce((sum, c) => sum + c.volume, 0);
  return totalVolume ? totalPriceVolume / totalVolume : candles[candles.length - 1]?.close ?? 0;
}

export function getATR(candles: Candle[], period = 14): number {
  if (!candles.length) return 0;
  const trValues: number[] = [];
  for (let i = 1; i < candles.length; i += 1) {
    const candle = candles[i];
    const prev = candles[i - 1];
    const tr = Math.max(
      candle.high - candle.low,
      Math.abs(candle.high - prev.close),
      Math.abs(candle.low - prev.close),
    );
    trValues.push(tr);
  }
  if (!trValues.length) return 0;
  const sma = trValues.slice(-period).reduce((sum, v) => sum + v, 0) / Math.min(period, trValues.length);
  return sma;
}

export function determineSupportResistance(candles: Candle[]) {
  const lows = candles.slice(-40).map((c) => c.low);
  const highs = candles.slice(-40).map((c) => c.high);
  const support = Math.min(...lows);
  const resistance = Math.max(...highs);
  return { support, resistance };
}

export function buildSignal(candles: Candle[], symbol: string, timeframe: Timeframe): TradePlan {
  const closes = candles.map((c) => c.close);
  const recentClose = closes.at(-1) ?? 0;
  const ema9 = calculateEMA(closes, 9);
  const ema20 = calculateEMA(closes, 20);
  const ema50 = calculateEMA(closes, 50);
  const ema200 = calculateEMA(closes, 200);
  const rsi = calculateRSI(closes, 14);
  const vwap = getVWAP(candles);
  const atr = getATR(candles, 14);
  const { support, resistance } = determineSupportResistance(candles);
  const macdValues = closes.map((close, i) => {
    const val = calculateEMA(closes.slice(0, i + 1), 12) - calculateEMA(closes.slice(0, i + 1), 26);
    return val;
  });
  const macd = macdValues.at(-1) ?? 0;
  const macdSignal = calculateEMA(macdValues, 9);

  const upperBand = vwap * 1.002;
  const lowerBand = vwap * 0.998;

  let score = 0;
  const reasons: string[] = [];
  const invalidation: string[] = [];

  let trendDirection = 'sideways';
  if (ema20 > ema50 && ema50 > ema200 && recentClose > ema20) {
    trendDirection = 'bullish';
    score += 26;
    reasons.push('EMA 20 is above EMA 50 and EMA 200, favoring upside trend.');
  } else if (ema20 < ema50 && ema50 < ema200 && recentClose < ema20) {
    trendDirection = 'bearish';
    score += 26;
    reasons.push('EMA 20 is below EMA 50 and EMA 200, favoring downside trend.');
  } else {
    reasons.push('Trend is mixed; waiting for a clear directional break.');
  }

  if (recentClose > vwap) {
    score += 14;
    reasons.push('Price is above VWAP, indicating positive intraday participation.');
  } else if (recentClose < vwap) {
    score -= 14;
    reasons.push('Price is below VWAP, implying weak participation.');
  }

  if (rsi > 55 && rsi < 70) {
    score += 12;
    reasons.push('RSI is in a healthy bullish zone without being overextended.');
  } else if (rsi < 45 && rsi > 30) {
    score += 12;
    reasons.push('RSI is supportive of a rebound without oversold exhaustion.');
  } else if (rsi > 70) {
    score -= 10;
    invalidation.push('RSI is overbought and may be vulnerable to a pullback.');
  } else if (rsi < 30) {
    score -= 10;
    invalidation.push('RSI is oversold; a weak bounce could fail if momentum does not improve.');
  }

  if (macd > macdSignal) {
    score += 12;
    reasons.push('MACD is above signal line, suggesting positive momentum.');
  } else {
    score -= 8;
    invalidation.push('MACD is below signal line, reducing momentum support.');
  }

  if (recentClose > support * 1.001 && recentClose < resistance * 0.995) {
    score += 8;
    reasons.push('Price is trading inside a constructive range with support intact.');
  } else if (recentClose < support) {
    invalidation.push('Price has fallen below recent support, invalidating the bullish setup.');
  } else if (recentClose > resistance) {
    invalidation.push('Price broke above resistance without sustained follow-through.');
  }

  const recentVolume = candles.slice(-10).reduce((sum, c) => sum + c.volume, 0) / 10;
  const avgVolume = candles.reduce((sum, c) => sum + c.volume, 0) / candles.length;
  if (recentVolume > avgVolume * 1.05) {
    score += 10;
    reasons.push('Volume remains supportive of the current move.');
  } else {
    invalidation.push('Volume is weak relative to its average, increasing the probability of a false breakout.');
  }

  let status: TradePlan['status'] = 'WAIT';
  if (score >= 58 && trendDirection === 'bullish') {
    status = 'BUY';
  } else if (score <= 42 && trendDirection === 'bearish') {
    status = 'SELL';
  }

  const currentPrice = recentClose;
  const entryBase = Math.min(currentPrice, resistance * 0.995);
  const entryZone: [number, number] = [entryBase * 0.998, entryBase * 1.002];

  const stopLoss = trendDirection === 'bullish'
    ? Math.max(support * 0.998, currentPrice - atr * 1.2)
    : Math.min(resistance * 1.002, currentPrice + atr * 1.2);

  const risk = Math.abs(currentPrice - stopLoss);
  const takeProfit1 = trendDirection === 'bullish'
    ? currentPrice + risk * 1.5
    : currentPrice - risk * 1.5;
  const takeProfit2 = trendDirection === 'bullish'
    ? currentPrice + risk * 2.0
    : currentPrice - risk * 2.0;
  const takeProfit3 = trendDirection === 'bullish'
    ? currentPrice + risk * 3.0
    : currentPrice - risk * 3.0;

  const riskReward = risk > 0 ? (Math.abs(takeProfit2 - currentPrice) / risk) : 0;

  const englishExplanation = `${trendDirection === 'bullish' ? 'Trend bullish' : 'Trend is mixed'} because EMA 20 is ${ema20 > ema50 ? 'above' : 'below'} EMA 50 and price is ${recentClose > vwap ? 'above' : 'below'} VWAP. RSI is ${rsi.toFixed(1)} and MACD is ${macd > macdSignal ? 'supportive' : 'weak'}, while volume confirms ${recentVolume > avgVolume ? 'the move' : 'lack of conviction'}. Wait for candle close and volume confirmation before taking a position.`;

  const hindiExplanation = `${trendDirection === 'bullish' ? 'Trend bullish' : 'Trend mixed'} hai kyunki EMA 20 ${ema20 > ema50 ? 'EMA 50 se upar' : 'EMA 50 se neeche'} hai aur price ${recentClose > vwap ? 'VWAP ke upar' : 'VWAP ke neeche'} hai. RSI ${rsi.toFixed(1)} hai aur MACD ${macd > macdSignal ? 'support kar raha hai' : 'weak hai'}, volume ${recentVolume > avgVolume ? 'move ko support kar raha hai' : 'conviction dikhata nahi hai'}. Entry lene se pahle candle close aur volume confirmation ka intezar karein.`;

  return {
    status,
    asset: symbol,
    timeframe,
    currentPrice,
    timestamp: new Date().toISOString(),
    entryZone,
    stopLoss,
    takeProfit1,
    takeProfit2,
    takeProfit3,
    riskReward,
    trendDirection,
    strength: Math.min(99, Math.max(25, score)),
    reasons,
    invalidation,
    indicatorSummary: {
      ema9,
      ema20,
      ema50,
      ema200,
      rsi,
      macd,
      macdSignal,
      vwap,
      upperBand,
      lowerBand,
      atr,
    },
    englishExplanation,
    hindiExplanation,
    source: 'demo',
  };
}

export function buildPositionSize(accountBalance: number, riskPercent: number, stopLossDistance: number, entryPrice: number): number {
  const riskAmount = accountBalance * (riskPercent / 100);
  const units = riskAmount / Math.max(stopLossDistance, 0.01);
  return Number((entryPrice > 0 ? units / entryPrice : 0).toFixed(4));
}

export function computeRrPreset(entry: number, stopLoss: number, preset: '1:1.5' | '1:2' | '1:3') {
  const risk = Math.abs(entry - stopLoss);
  const multiplierMap = { '1:1.5': 1.5, '1:2': 2, '1:3': 3 };
  return entry + Math.sign(entry - stopLoss) * risk * multiplierMap[preset];
}

export const defaultTimeframes: Timeframe[] = ['1m', '5m', '15m', '30m', '1h', '4h', '1d'];
