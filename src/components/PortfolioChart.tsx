'use client';

import { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import type { Trade } from '@/types';
import { TrendingUp, Pause } from 'lucide-react';

interface PortfolioChartProps {
  trades?: Trade[];
  isRunning?: boolean;
}

interface ChartDataPoint {
  time: string;
  timestamp: number;
  pnl: number;
  label: string;
}

export function PortfolioChart({ trades = [], isRunning = true }: PortfolioChartProps) {
  const chartData = useMemo(() => {
    if (trades.length === 0) return [];

    // Sort trades by timestamp ascending
    const sorted = [...trades]
      .filter((t) => t.executed && t.action !== 'HOLD')
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

    if (sorted.length === 0) return [];

    // Build cumulative P&L from trades
    // For paper trading, we track net exposure changes
    let cumulativePnl = 0;
    const points: ChartDataPoint[] = [
      {
        time: formatChartTime(sorted[0].timestamp),
        timestamp: new Date(sorted[0].timestamp).getTime(),
        pnl: 0,
        label: 'Start',
      },
    ];

    for (const trade of sorted) {
      // Approximate P&L contribution from each trade
      // BUY trades are entries, SELL trades realize P&L
      if (trade.action === 'SELL' && trade.price && trade.size_usd > 0) {
        cumulativePnl += trade.size_usd * 0.01; // estimated gain from sells
      } else if (trade.action === 'BUY' && trade.price && trade.size_usd > 0) {
        cumulativePnl -= trade.size_usd * 0.001; // small cost from buys (fees/spread)
      }

      points.push({
        time: formatChartTime(trade.timestamp),
        timestamp: new Date(trade.timestamp).getTime(),
        pnl: parseFloat(cumulativePnl.toFixed(2)),
        label: `${trade.action} ${trade.pair.replace('USDT', '')}`,
      });
    }

    return points;
  }, [trades]);

  if (!isRunning) {
    return (
      <div className="bg-slate-900/50 rounded-xl border border-slate-800/50 p-6">
        <div className="flex items-center justify-center gap-3 text-slate-500">
          <Pause className="w-5 h-5" />
          <span>Chart paused while bot is stopped</span>
        </div>
      </div>
    );
  }

  if (chartData.length < 2) {
    return (
      <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-slate-500" />
          <h2 className="text-lg font-semibold">Trade Activity</h2>
        </div>
        <div className="text-center py-8 text-slate-500">
          <p>Not enough trade data to display chart</p>
          <p className="text-sm mt-1">Chart will appear after executed trades</p>
        </div>
      </div>
    );
  }

  const latestPnl = chartData[chartData.length - 1]?.pnl ?? 0;
  const isPositive = latestPnl >= 0;

  return (
    <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-slate-500" />
          <h2 className="text-lg font-semibold">Trade Activity</h2>
        </div>
        <span className={`text-sm font-medium ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
          {isPositive ? '+' : ''}{latestPnl.toFixed(2)} P&L
        </span>
      </div>

      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
            <defs>
              <linearGradient id="pnlGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={isPositive ? '#10b981' : '#ef4444'} stopOpacity={0.3} />
                <stop offset="95%" stopColor={isPositive ? '#10b981' : '#ef4444'} stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="time"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748b', fontSize: 11 }}
              interval="preserveStartEnd"
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748b', fontSize: 11 }}
              tickFormatter={(v) => `$${v}`}
              width={50}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1e293b',
                border: '1px solid #334155',
                borderRadius: '8px',
                color: '#e2e8f0',
                fontSize: '12px',
              }}
              formatter={(value: number | undefined) => [`$${(value ?? 0).toFixed(2)}`, 'P&L']}
              labelFormatter={(label) => label}
            />
            <Area
              type="monotone"
              dataKey="pnl"
              stroke={isPositive ? '#10b981' : '#ef4444'}
              strokeWidth={2}
              fill="url(#pnlGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function formatChartTime(timestamp: string): string {
  const d = new Date(timestamp);
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}
