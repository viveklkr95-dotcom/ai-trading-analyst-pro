'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Activity, Bell, CandlestickChart, CircleDollarSign, Search, ShieldAlert, TrendingUp, UploadCloud } from 'lucide-react';
import { createChart, type IChartApi, type ISeriesApi, type CandlestickData } from 'lightweight-charts';
import { availableSymbols, type Timeframe } from '@/lib/types';
import { buildSignal, generateDemoCandles } from '@/lib/analysis';
import { StatCard, SectionTitle } from '@/components/ui';

const timeframes: Timeframe[] = ['1m', '5m', '15m', '30m', '1h', '4h', '1d'];

function formatCurrency(value: number, symbol: string): string {
  if (symbol.includes('JPY') || symbol.includes('NIFTY')) return new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 }).format(value);
  if (symbol.includes('USD') || symbol.includes('BTC') || symbol.includes('ETH') || symbol.includes('XAU')) return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(value);
  return new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 }).format(value);
}

export function TradingDashboard() {
  const [symbol, setSymbol] = useState('BTC/USDT');
  const [timeframe, setTimeframe] = useState<Timeframe>('1h');
  const [search, setSearch] = useState('');
  const [riskPercent, setRiskPercent] = useState(1);
  const [accountBalance, setAccountBalance] = useState(25000);
  const [fileName, setFileName] = useState('');
  const chartRef = useRef<HTMLDivElement | null>(null);
  const chartApiRef = useRef<IChartApi | null>(null);
  const candlesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);

  const filteredSymbols = useMemo(() => {
    return availableSymbols.filter((item) => item.symbol.toLowerCase().includes(search.toLowerCase()) || item.name.toLowerCase().includes(search.toLowerCase()));
  }, [search]);

  const demoCandles = useMemo(() => generateDemoCandles(symbol, timeframe, 120), [symbol, timeframe]);
  const signal = useMemo(() => buildSignal(demoCandles, symbol, timeframe), [demoCandles, symbol, timeframe]);

  useEffect(() => {
    if (!chartRef.current) return;

    const chart = createChart(chartRef.current, {
      width: chartRef.current.clientWidth,
      height: 360,
      layout: {
        background: { color: '#0f172a' },
        textColor: '#cbd5e1',
      },
      grid: {
        vertLines: { color: 'rgba(148, 163, 184, 0.12)' },
        horzLines: { color: 'rgba(148, 163, 184, 0.12)' },
      },
      rightPriceScale: { borderColor: 'rgba(148,163,184,0.25)' },
      timeScale: { borderColor: 'rgba(148,163,184,0.25)' },
      crosshair: { mode: 1 },
    });

    const candleSeries = chart.addCandlestickSeries({
      upColor: '#22c55e',
      downColor: '#ef4444',
      borderVisible: false,
      wickUpColor: '#22c55e',
      wickDownColor: '#ef4444',
    });

    candleSeries.setData(
      demoCandles.map((c) => ({
        time: c.time / 1000,
        open: c.open,
        high: c.high,
        low: c.low,
        close: c.close,
      })) as CandlestickData[],
    );

    chart.timeScale().fitContent();

    chartApiRef.current = chart;
    candlesRef.current = candleSeries;

    const handleResize = () => {
      if (chartRef.current) {
        chart.applyOptions({ width: chartRef.current.clientWidth });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
      chartApiRef.current = null;
      candlesRef.current = null;
    };
  }, [demoCandles]);

  const statusTone = signal.status === 'BUY' ? 'positive' : signal.status === 'SELL' ? 'negative' : 'neutral';
  const positionSize = (accountBalance * (riskPercent / 100)) / Math.max(Math.abs(signal.currentPrice - signal.stopLoss), 0.1);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
        <header className="mb-6 flex flex-col gap-4 rounded-3xl border border-slate-800 bg-slate-900/90 p-4 shadow-glow lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-cyan-300">AI Trading Analyst Pro</p>
            <h1 className="mt-1 text-2xl font-bold">Trading terminal</h1>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm">
              <Search className="h-4 w-4 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-36 bg-transparent text-sm text-slate-100 placeholder:text-slate-500 outline-none"
                placeholder="Search symbol"
              />
            </label>

            <select
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none"
            >
              {filteredSymbols.map((item) => (
                <option key={item.symbol} value={item.symbol}>{item.symbol}</option>
              ))}
            </select>

            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value as Timeframe)}
              className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none"
            >
              {timeframes.map((tf) => (
                <option key={tf} value={tf}>{tf.toUpperCase()}</option>
              ))}
            </select>
          </div>
        </header>

        <div className="grid gap-6 xl:grid-cols-[2.1fr,1fr]">
          <section className="space-y-6">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-4 shadow-glow">
              <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-center gap-2 text-cyan-300">
                    <CandlestickChart className="h-4 w-4" />
                    <p className="text-xs uppercase tracking-[0.2em]">Market chart</p>
                  </div>
                  <h2 className="mt-1 text-xl font-semibold">{symbol} · {timeframe.toUpperCase()}</h2>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                  Demo feed · delayed
                </div>
              </div>

              <div ref={chartRef} className="chart-grid h-[360px] overflow-hidden rounded-2xl border border-slate-800" />

              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <StatCard label="Last price" value={formatCurrency(signal.currentPrice, symbol)} tone="positive" />
                <StatCard label="Trend" value={signal.trendDirection} tone={signal.trendDirection === 'bullish' ? 'positive' : signal.trendDirection === 'bearish' ? 'negative' : 'neutral'} />
                <StatCard label="Volume" value={`${Math.round(signal.indicatorSummary.vwap)}`} tone="neutral" />
              </div>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-4 shadow-glow">
              <SectionTitle>Signal engine</SectionTitle>
              <div className="mt-4 grid gap-4 md:grid-cols-[1.2fr,1fr]">
                <div className={`rounded-2xl border p-4 ${statusTone === 'positive' ? 'border-emerald-500/30 bg-emerald-500/10' : statusTone === 'negative' ? 'border-rose-500/30 bg-rose-500/10' : 'border-slate-700 bg-slate-950/80'}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Current status</p>
                      <p className="mt-2 text-4xl font-black tracking-tight">{signal.status}</p>
                    </div>
                    <div className="rounded-full border border-slate-600 bg-slate-800 px-2 py-1 text-xs text-slate-200">
                      {signal.strength.toFixed(0)} / 100
                    </div>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-xl bg-slate-950/80 p-3">
                      <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Entry zone</p>
                      <p className="mt-2 text-lg font-semibold">{signal.entryZone[0].toFixed(2)} – {signal.entryZone[1].toFixed(2)}</p>
                    </div>
                    <div className="rounded-xl bg-slate-950/80 p-3">
                      <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Risk / Reward</p>
                      <p className="mt-2 text-lg font-semibold">1 : {signal.riskReward.toFixed(2)}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 rounded-2xl border border-slate-700 bg-slate-950/80 p-4">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Plan levels</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between"><span>Stop loss</span><span>{signal.stopLoss.toFixed(2)}</span></div>
                    <div className="flex items-center justify-between"><span>TP1</span><span>{signal.takeProfit1.toFixed(2)}</span></div>
                    <div className="flex items-center justify-between"><span>TP2</span><span>{signal.takeProfit2.toFixed(2)}</span></div>
                    <div className="flex items-center justify-between"><span>TP3</span><span>{signal.takeProfit3.toFixed(2)}</span></div>
                  </div>
                </div>
              </div>

              <div className="mt-5 rounded-2xl border border-slate-700 bg-slate-950/80 p-4">
                <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Why this signal</p>
                <ul className="mt-3 space-y-2 text-sm text-slate-200">
                  {signal.reasons.map((reason) => (
                    <li key={reason} className="flex gap-2"><span className="mt-1 h-2 w-2 rounded-full bg-cyan-400" />{reason}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          <aside className="space-y-6">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-4 shadow-glow">
              <div className="flex items-center gap-2 text-cyan-300">
                <Activity className="h-4 w-4" />
                <SectionTitle>Market overview</SectionTitle>
              </div>

              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between rounded-xl bg-slate-950/80 p-3">
                  <span className="text-slate-400">Current price</span>
                  <strong>{signal.currentPrice.toFixed(2)}</strong>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-slate-950/80 p-3">
                  <span className="text-slate-400">Timestamp</span>
                  <strong>{new Date(signal.timestamp).toLocaleTimeString()}</strong>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-slate-950/80 p-3">
                  <span className="text-slate-400">Data source</span>
                  <strong className="uppercase text-amber-300">{signal.source}</strong>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-4 shadow-glow">
              <div className="flex items-center gap-2 text-cyan-300">
                <TrendingUp className="h-4 w-4" />
                <SectionTitle>Indicators</SectionTitle>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                <StatCard label="EMA 9" value={signal.indicatorSummary.ema9.toFixed(2)} />
                <StatCard label="EMA 20" value={signal.indicatorSummary.ema20.toFixed(2)} />
                <StatCard label="EMA 50" value={signal.indicatorSummary.ema50.toFixed(2)} />
                <StatCard label="EMA 200" value={signal.indicatorSummary.ema200.toFixed(2)} />
                <StatCard label="RSI 14" value={signal.indicatorSummary.rsi.toFixed(1)} tone={signal.indicatorSummary.rsi > 70 ? 'negative' : signal.indicatorSummary.rsi < 30 ? 'positive' : 'neutral'} />
                <StatCard label="VWAP" value={signal.indicatorSummary.vwap.toFixed(2)} />
              </div>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-4 shadow-glow">
              <div className="flex items-center gap-2 text-cyan-300">
                <CircleDollarSign className="h-4 w-4" />
                <SectionTitle>Risk calculator</SectionTitle>
              </div>

              <div className="mt-4 space-y-4">
                <div>
                  <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-slate-400">Account balance</label>
                  <input value={accountBalance} onChange={(e) => setAccountBalance(Number(e.target.value) || 0)} className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2 text-sm outline-none" />
                </div>
                <div>
                  <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-slate-400">Risk percent</label>
                  <input type="range" min={0.5} max={5} step={0.1} value={riskPercent} onChange={(e) => setRiskPercent(Number(e.target.value))} className="w-full" />
                  <div className="mt-1 text-sm text-slate-300">{riskPercent.toFixed(1)}% / trade</div>
                </div>
                <div className="rounded-xl bg-slate-950/80 p-3 text-sm text-slate-300">
                  Estimated position size: <strong className="text-cyan-300">{positionSize.toFixed(4)} units</strong>
                </div>
              </div>
            </div>
          </aside>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-4 shadow-glow">
            <div className="flex items-center gap-2 text-cyan-300">
              <ShieldAlert className="h-4 w-4" />
              <SectionTitle>Risk disclosures</SectionTitle>
            </div>
            <ul className="mt-4 space-y-2 text-sm text-slate-300">
              <li>• Signals are educational and based on demo market data.</li>
              <li>• No real-money execution or guaranteed profits are offered.</li>
              <li>• Slippage, spreads, and stale data may change actual outcomes.</li>
              <li>• Stop limits may execute at worse prices in fast or gap markets.</li>
            </ul>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-4 shadow-glow">
            <div className="flex items-center gap-2 text-cyan-300">
              <UploadCloud className="h-4 w-4" />
              <SectionTitle>Chart image analysis</SectionTitle>
            </div>

            <label className="mt-4 flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-700 bg-slate-950/80 p-6 text-sm text-slate-300">
              <UploadCloud className="h-4 w-4" />
              <span>Upload chart screenshot</span>
              <input type="file" accept="image/*" className="hidden" onChange={(e) => setFileName(e.target.files?.[0]?.name ?? '')} />
            </label>

            <div className="mt-4 rounded-xl border border-slate-700 bg-slate-950/80 p-3 text-sm text-slate-300">
              {fileName ? `Selected: ${fileName}. This is a screenshot-based estimate only; exact live values require manual confirmation.` : 'No screenshot uploaded yet. Vision analysis remains limited without reliable price and timeframe reads.'}
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-3xl border border-slate-800 bg-slate-900/80 p-4 shadow-glow">
          <SectionTitle>AI explanations</SectionTitle>
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <div className="rounded-2xl border border-slate-700 bg-slate-950/80 p-4">
              <p className="mb-2 text-xs uppercase tracking-[0.2em] text-slate-400">English</p>
              <p className="text-sm text-slate-200">{signal.englishExplanation}</p>
            </div>
            <div className="rounded-2xl border border-slate-700 bg-slate-950/80 p-4">
              <p className="mb-2 text-xs uppercase tracking-[0.2em] text-slate-400">Hindi</p>
              <p className="text-sm text-slate-200">{signal.hindiExplanation}</p>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-4 shadow-glow">
            <div className="flex items-center gap-2 text-cyan-300">
              <Bell className="h-4 w-4" />
              <SectionTitle>Alerts</SectionTitle>
            </div>
            <div className="mt-4 space-y-2 text-sm text-slate-300">
              <p>• Browser notifications: available when permission is granted.</p>
              <p>• Sound alerts: optional in supported browsers.</p>
              <p>• Duplicate alert suppression is enabled for repeated signal states.</p>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-4 shadow-glow">
            <SectionTitle>Watchlist</SectionTitle>
            <div className="mt-4 space-y-2 text-sm text-slate-300">
              {availableSymbols.slice(0, 5).map((item) => (
                <div key={item.symbol} className="flex items-center justify-between rounded-xl bg-slate-950/80 p-2">
                  <span>{item.symbol}</span>
                  <span className="text-emerald-300">{item.basePrice.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-4 shadow-glow">
            <SectionTitle>Trade journal</SectionTitle>
            <div className="mt-4 space-y-2 text-sm text-slate-300">
              <div className="rounded-xl bg-slate-950/80 p-2">Demo trade #001 · {signal.status} · {signal.currentPrice.toFixed(2)}</div>
              <div className="rounded-xl bg-slate-950/80 p-2">Demo trade #002 · WAIT · partial range</div>
              <div className="rounded-xl bg-slate-950/80 p-2">No real-money trading is enabled by default.</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
