'use client';

import { useTrades } from '@/hooks/useBotData';
import { Check, X, ArrowUpCircle, ArrowDownCircle, MinusCircle, Pause } from 'lucide-react';

interface TradesTableProps {
  isRunning?: boolean;
}

export function TradesTable({ isRunning = true }: TradesTableProps) {
  const { data, isLoading } = useTrades(isRunning);

  if (!isRunning) {
    return (
      <div className="bg-slate-900/50 rounded-xl border border-slate-800/50 p-6">
        <div className="flex items-center justify-center gap-3 text-slate-500">
          <Pause className="w-5 h-5" />
          <span>Trades list paused while bot is stopped</span>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Trades</h2>
        <div className="animate-pulse space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-slate-800 rounded" />
          ))}
        </div>
      </div>
    );
  }

  const trades = data?.trades?.slice(-10).reverse() || [];

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'BUY': return <ArrowUpCircle className="w-4 h-4 text-emerald-400" />;
      case 'SELL': return <ArrowDownCircle className="w-4 h-4 text-red-400" />;
      default: return <MinusCircle className="w-4 h-4 text-slate-400" />;
    }
  };

  const getActionClass = (action: string) => {
    switch (action) {
      case 'BUY': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'SELL': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  return (
    <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-800">
        <h2 className="text-lg font-semibold">Recent Trades</h2>
        <p className="text-sm text-slate-500">Last 10 trades</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-800/50">
            <tr className="text-left text-xs font-medium text-slate-400 uppercase">
              <th className="px-6 py-3">Time</th>
              <th className="px-6 py-3">Pair</th>
              <th className="px-6 py-3">Action</th>
              <th className="px-6 py-3">Size</th>
              <th className="px-6 py-3">Price</th>
              <th className="px-6 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {trades.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                  No trades yet
                </td>
              </tr>
            ) : (
              trades.map((trade, index) => (
                <tr key={index} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4 text-sm text-slate-400">
                    {formatTime(trade.timestamp)}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-200">
                    {trade.pair}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getActionClass(trade.action)}`}>
                      {getActionIcon(trade.action)}
                      {trade.action}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-300">
                    {trade.size_usd > 0 ? `$${trade.size_usd.toFixed(2)}` : '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-300">
                    {trade.price ? `$${trade.price.toLocaleString()}` : '-'}
                  </td>
                  <td className="px-6 py-4">
                    {trade.executed ? (
                      <Check className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <X className="w-5 h-5 text-red-400" />
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
