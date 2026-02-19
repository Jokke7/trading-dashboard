'use client';

import { usePositions, usePortfolio } from '@/hooks/useBotData';
import { Wallet, TrendingUp, TrendingDown, DollarSign, Coins, Pause } from 'lucide-react';

interface StatsCardsProps {
  isRunning?: boolean;
}

export function StatsCards({ isRunning = true }: StatsCardsProps) {
  const { data: positionsData, isLoading: positionsLoading } = usePositions(isRunning);
  const { data: portfolioData } = usePortfolio(isRunning);

  if (!isRunning) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-800/50 col-span-3">
          <div className="flex items-center justify-center gap-3 text-slate-500">
            <Pause className="w-5 h-5" />
            <span>Auto-refresh paused while bot is stopped</span>
          </div>
        </div>
      </div>
    );
  }

  if (positionsLoading) {
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

  const positions = positionsData?.positions ?? [];
  const balances = portfolioData?.balances ?? [];
  
  const totalValue = positions.reduce((sum, pos) => sum + pos.value, 0);
  const totalPnl = positions.reduce((sum, pos) => sum + pos.pnl, 0);
  
  // Get available USDT from portfolio balances
  const usdtBalance = balances.find(b => b.asset === 'USDT');
  const availableUsdt = usdtBalance ? parseFloat(usdtBalance.free) : 0;
  const portfolioTotal = totalValue + availableUsdt;
  
  const pnlPercent = portfolioTotal > 0 ? (totalPnl / portfolioTotal) * 100 : 0;

  const btcPosition = positions.find(p => p.symbol === 'BTCUSDT');
  const ethPosition = positions.find(p => p.symbol === 'ETHUSDT');

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Portfolio Value */}
      <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500 mb-1">Paper Portfolio Value</p>
            <p className="text-2xl font-bold text-slate-100">
              ${portfolioTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            {(positions.length > 0 || availableUsdt > 0) && (
              <p className="text-xs text-slate-500 mt-1">
                {btcPosition && `${(btcPosition.value / portfolioTotal * 100).toFixed(1)}% BTC `}
                {ethPosition && `${(ethPosition.value / portfolioTotal * 100).toFixed(1)}% ETH `}
                {availableUsdt > 0 && `${(availableUsdt / portfolioTotal * 100).toFixed(1)}% USDT`}
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
              ${availableUsdt.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Available USDT
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
              {pnlPercent >= 0 ? '+' : ''}{pnlPercent.toFixed(2)}% return
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
