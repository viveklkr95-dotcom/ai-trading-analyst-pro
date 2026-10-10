import type { ReactNode } from 'react';

export function StatCard({ label, value, tone = 'neutral' }: { label: string; value: string; tone?: 'positive' | 'negative' | 'neutral' }) {
  const colors = {
    positive: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
    negative: 'border-rose-500/30 bg-rose-500/10 text-rose-300',
    neutral: 'border-slate-700 bg-slate-900/80 text-slate-200',
  };

  return (
    <div className={`rounded-2xl border p-3 ${colors[tone]}`}>
      <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">{label}</p>
      <p className="mt-2 text-lg font-semibold">{value}</p>
    </div>
  );
}

export function SectionTitle({ children }: { children: ReactNode }) {
  return <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-300">{children}</h3>;
}
