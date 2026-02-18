'use client';

import { usePortfolio, useSignals } from '@/hooks/useBotData';
import { Wallet, TrendingUp, TrendingDown, DollarSign, Coins } from 'lucide-react';

export function StatsCards() {
  const { data: portfolio, isLoading: portfolioLoading } = usePortfolio();
  const { data: btcSignals } = useSignals('BTCUSDT');
  const { data: ethSignals } = useSignals('ETHUSDT');

  if (portfolioLoading) {
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

  // Calculate portfolio value with current prices
  let totalValue = 0;
  let btcValue = 0;
  let ethValue = 0;
  let usdtValue = 0;

  portfolio?.balances?.forEach((balance) => {
    const amount = parseFloat(balance.free) + parseFloat(balance.locked);
    if (amount <= 0) return;

    if (balance.asset === 'USDT') {
      usdtValue = amount;
      totalValue += amount;
    } else if (balance.asset === 'BTC' && btcSignals) {
      const price = parseFloat(btcSignals.price);
      btcValue = amount * price;
      totalValue += btcValue;
    } else if (balance.asset === 'ETH' && ethSignals) {
      const price = parseFloat(ethSignals.price);
      ethValue = amount * price;
      totalValue += ethValue;
    }
  });

  // Calculate P&L from trades
  // In paper mode, we start with $10,000 and track trades
  const initialBalance = 10000;
  const currentBalance = totalValue || usdtValue;
  const totalPnl = currentBalance - initialBalance;
  const todayPnl = 0; // Would need daily tracking

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Portfolio Value */}
      <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500 mb-1">Paper Portfolio Value</p>
            <p className="text-2xl font-bold text-slate-100">
              ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            {(btcValue > 0 || ethValue > 0) && (
              <p className="text-xs text-slate-500 mt-1">
                {btcValue > 0 && `${(btcValue / totalValue * 100).toFixed(1)}% BTC `}
                {ethValue > 0 && `${(ethValue / totalValue * 100).toFixed(1)}% ETH `}
                {usdtValue > 0 && `${(usdtValue / totalValue * 100).toFixed(1)}% USDT`}
              </p>
            )}
          </div>
          <div className="p-3 bg-blue-500/20 rounded-lg">
            <Wallet className="w-6 h-6 text-blue-400" />
          </div>
        </div>
      </div>

      {/* Paper Money Available */}
      <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500 mb-1">Paper Money Available</p>
            <p className="text-2xl font-bold text-emerald-400">
              ${usdtValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Starting: ${initialBalance.toLocaleString()}
            </p>
          </div>
          <div className="p-3 bg-emerald-500/20 rounded-lg">
            <Coins className="w-6 h-6 text-emerald-400" />
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
            <p className="text-xs text-slate-500 mt-1">
              {((totalPnl / initialBalance) * 100).toFixed(2)}% return
            </p>
          </div>
          <div className={`p-3 rounded-lg ${totalPnl >= 0 ? 'bg-emerald-500/20' : 'bg-red-500/20'}`}>
            <DollarSign className={`w-6 h-6 ${totalPnl >= 0 ? 'text-emerald-400' : 'text-red-400'}`} />
          </div>
        </div>
      </div>
    </div>
  );
}
