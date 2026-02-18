'use client';

import { useSignals } from '@/hooks/useBotData';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';

interface MarketCardProps {
  pair: string;
  isRunning?: boolean;
}

export function MarketCard({ pair, isRunning = true }: MarketCardProps) {
  const { data: signals, isLoading, error } = useSignals(pair, isRunning);

  // Parse pair for display (BTCUSDT -> BTC/USDT)
  const displayPair = pair.replace('USDT', '/USDT');

  if (isLoading) {
    return (
      <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-200">{displayPair}</h3>
          <Activity className="w-5 h-5 text-slate-600 animate-pulse" />
        </div>
        <div className="animate-pulse space-y-4">
          <div className="h-12 bg-slate-800 rounded w-1/2" />
          <div className="h-8 bg-slate-800 rounded w-1/3" />
          <div className="grid grid-cols-2 gap-4">
            <div className="h-6 bg-slate-800 rounded" />
            <div className="h-6 bg-slate-800 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !signals) {
    return (
      <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-200">{displayPair}</h3>
          <Activity className="w-5 h-5 text-slate-500" />
        </div>
        <div className="text-center py-8">
          <p className="text-slate-500 mb-2">Unable to load market data</p>
          <p className="text-sm text-slate-600">Check connection to bot API</p>
        </div>
      </div>
    );
  }

  const price = parseFloat(signals.price);
  const change = parseFloat(signals.change24h);
  const isPositive = change >= 0;

  // Determine signal based on RSI and price vs MAs
  let signal: 'BUY' | 'SELL' | 'HOLD' = 'HOLD';
  let signalConfidence = 50;

  if (signals.rsi < 40 && price > signals.sma50) {
    signal = 'BUY';
    signalConfidence = Math.round(60 + (40 - signals.rsi));
  } else if (signals.rsi > 60 && price < signals.sma50) {
    signal = 'SELL';
    signalConfidence = Math.round(60 + (signals.rsi - 60));
  } else {
    signal = 'HOLD';
    signalConfidence = 50;
  }

  const signalColors = {
    BUY: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    SELL: 'bg-red-500/20 text-red-400 border-red-500/30',
    HOLD: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
  };

  const TrendIcon = isPositive ? TrendingUp : TrendingDown;

  return (
    <div className="bg-slate-900 rounded-xl p-6 border border-slate-800 hover:border-slate-700 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-200">{displayPair}</h3>
          <p className="text-3xl font-bold text-slate-100 mt-1">
            ${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
        <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${isPositive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
          <TrendIcon className="w-4 h-4" />
          {isPositive ? '+' : ''}{change.toFixed(2)}%
        </div>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${signalColors[signal]}`}>
          {signal} ({signalConfidence}%)
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="flex justify-between">
          <span className="text-slate-500">RSI (14)</span>
          <span className={`font-medium ${signals.rsi < 40 ? 'text-emerald-400' : signals.rsi > 60 ? 'text-red-400' : 'text-slate-300'}`}>
            {signals.rsi.toFixed(1)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">MACD</span>
          <span className={`font-medium ${signals.macd.histogram > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {signals.macd.histogram > 0 ? 'Bullish' : 'Bearish'}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">SMA 20</span>
          <span className="text-slate-300">${signals.sma20.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">SMA 50</span>
          <span className="text-slate-300">${signals.sma50.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}
