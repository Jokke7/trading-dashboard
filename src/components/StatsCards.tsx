'use client';

import { usePortfolio } from '@/hooks/useBotData';
import { Wallet, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

export function StatsCards() {
  const { data: portfolio, isLoading } = usePortfolio();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-slate-900 rounded-xl p-6 border border-slate-800 animate-pulse">
            <div className="h-4 bg-slate-800 rounded w-1/2 mb-2" />
            <div className="h-8 bg-slate-800 rounded w-3/4" />
          </div>
        ))}
      </div>
    );
  }

  // Calculate total portfolio value
  const totalValue = portfolio?.balances?.reduce((sum, balance) => {
    const value = parseFloat(balance.free) + parseFloat(balance.locked);
    // For simplicity, assume all values are in USD or USDT
    if (balance.asset === 'USDT') {
      return sum + value;
    }
    // For other assets, we'd need current prices - simplified for now
    return sum;
  }, 0) || 0;

  // Mock P&L data - in real app would come from API
  const todayPnl = 0;
  const totalPnl = 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Portfolio Value */}
      <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500 mb-1">Portfolio Value</p>
            <p className="text-2xl font-bold text-slate-100">
              ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
          <div className="p-3 bg-blue-500/20 rounded-lg">
            <Wallet className="w-6 h-6 text-blue-400" />
          </div>
        </div>
      </div>

      {/* Today's P&L */}
      <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500 mb-1">Today's P&L</p>
            <div className="flex items-center gap-2">
              <p className={`text-2xl font-bold ${todayPnl >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {todayPnl >= 0 ? '+' : ''}${todayPnl.toFixed(2)}
              </p>
              {todayPnl !== 0 && (
                todayPnl > 0 ? <TrendingUp className="w-5 h-5 text-emerald-400" /> : <TrendingDown className="w-5 h-5 text-red-400" />
              )}
            </div>
          </div>
          <div className={`p-3 rounded-lg ${todayPnl >= 0 ? 'bg-emerald-500/20' : 'bg-red-500/20'}`}>
            <DollarSign className={`w-6 h-6 ${todayPnl >= 0 ? 'text-emerald-400' : 'text-red-400'}`} />
          </div>
        </div>
      </div>

      {/* Total P&L */}
      <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500 mb-1">Total P&L</p>
            <div className="flex items-center gap-2">
              <p className={`text-2xl font-bold ${totalPnl >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {totalPnl >= 0 ? '+' : ''}${totalPnl.toFixed(2)}
              </p>
              {totalPnl !== 0 && (
                totalPnl > 0 ? <TrendingUp className="w-5 h-5 text-emerald-400" /> : <TrendingDown className="w-5 h-5 text-red-400" />
              )}
            </div>
          </div>
          <div className={`p-3 rounded-lg ${totalPnl >= 0 ? 'bg-emerald-500/20' : 'bg-red-500/20'}`}>
            <DollarSign className={`w-6 h-6 ${totalPnl >= 0 ? 'text-emerald-400' : 'text-red-400'}`} />
          </div>
        </div>
      </div>
    </div>
  );
}
