export type MarketType = 'crypto' | 'forex' | 'stocks' | 'metals';

export type Timeframe = '1m' | '5m' | '15m' | '30m' | '1h' | '4h' | '1d';

export type Candle = {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

export type AssetSymbol = {
  symbol: string;
  market: MarketType;
  name: string;
  currency: string;
  basePrice: number;
};

export type MarketSnapshot = {
  symbol: string;
  timeframe: Timeframe;
  source: 'demo' | 'live' | 'delayed';
  price: number;
  timestamp: string;
  changePercent: number;
  volume: number;
  volatility: number;
  trend: 'bullish' | 'bearish' | 'sideways';
  candles: Candle[];
};

export type SignalStatus = 'BUY' | 'SELL' | 'WAIT';

export type TradePlan = {
  status: SignalStatus;
  asset: string;
  timeframe: Timeframe;
  currentPrice: number;
  timestamp: string;
  entryZone: [number, number];
  stopLoss: number;
  takeProfit1: number;
  takeProfit2: number;
  takeProfit3: number;
  riskReward: number;
  trendDirection: string;
  strength: number;
  reasons: string[];
  invalidation: string[];
  indicatorSummary: {
    ema9: number;
    ema20: number;
    ema50: number;
    ema200: number;
    rsi: number;
    macd: number;
    macdSignal: number;
    vwap: number;
    upperBand: number;
    lowerBand: number;
    atr: number;
  };
  englishExplanation: string;
  hindiExplanation: string;
  source: 'demo' | 'live';
};

export const availableSymbols: AssetSymbol[] = [
  { symbol: 'BTC/USDT', market: 'crypto', name: 'Bitcoin', currency: 'USD', basePrice: 65200 },
  { symbol: 'ETH/USDT', market: 'crypto', name: 'Ethereum', currency: 'USD', basePrice: 3300 },
  { symbol: 'EUR/USD', market: 'forex', name: 'Euro / US Dollar', currency: 'USD', basePrice: 1.088 },
  { symbol: 'GBP/USD', market: 'forex', name: 'Pound / US Dollar', currency: 'USD', basePrice: 1.274 },
  { symbol: 'USD/JPY', market: 'forex', name: 'US Dollar / Yen', currency: 'JPY', basePrice: 156.5 },
  { symbol: 'XAU/USD', market: 'metals', name: 'Gold', currency: 'USD', basePrice: 2340 },
  { symbol: 'RELIANCE.NS', market: 'stocks', name: 'Reliance Industries', currency: 'INR', basePrice: 2912 },
  { symbol: 'TCS.NS', market: 'stocks', name: 'Tata Consultancy Services', currency: 'INR', basePrice: 3923 },
  { symbol: 'NIFTY50', market: 'stocks', name: 'Nifty 50', currency: 'INR', basePrice: 24650 },
];
