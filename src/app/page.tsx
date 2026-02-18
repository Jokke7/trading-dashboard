'use client';

import Image from 'next/image';
import { StatusBar } from '@/components/StatusBar';
import { StatsCards } from '@/components/StatsCards';
import { MarketCard } from '@/components/MarketCard';
import { TradesTable } from '@/components/TradesTable';
import { Activity } from 'lucide-react';
import { useStatus } from '@/hooks/useBotData';

export default function Dashboard() {
  const { data: status } = useStatus();
  const isRunning = status?.running && !status?.emergencyStop;

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Cool Header with Gradient */}
      <header className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-700">
        <div className="px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative w-10 h-10 flex items-center justify-center bg-blue-500/20 rounded-xl border border-blue-500/30">
                <Image
                  src="/godot-logo.svg"
                  alt="Godot"
                  width={28}
                  height={28}
                  className="text-blue-400"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Trading Bot Dashboard
                </h1>
                <p className="text-sm text-slate-400 flex items-center gap-2">
                  <Activity className="w-3 h-3" />
                  Live Trading Monitor
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-500 uppercase tracking-wider">Powered by</p>
              <p className="text-sm font-medium text-slate-300">Godot Intelligence</p>
            </div>
          </div>
        </div>
        <StatusBar />
      </header>

      {/* Main Content */}
      <main className="p-6 space-y-6">
        {/* Stats Cards - Pass isRunning to control auto-refresh */}
        <StatsCards isRunning={isRunning} />

        {/* Market Cards - Pass isRunning to control auto-refresh */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <MarketCard pair="BTCUSDT" isRunning={isRunning} />
          <MarketCard pair="ETHUSDT" isRunning={isRunning} />
        </div>

        {/* Trades Table - Pass isRunning to control auto-refresh */}
        <TradesTable isRunning={isRunning} />
      </main>

      {/* Footer with Godot Logo */}
      <footer className="border-t border-slate-800 px-6 py-6 mt-8 bg-slate-900/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/godot-logo.svg"
              alt="Godot"
              width={20}
              height={20}
              className="text-slate-500"
            />
            <span className="text-sm text-slate-500">
              Trading Bot Dashboard v0.1.0
            </span>
          </div>
          <span className="text-xs text-slate-600">
            Made with Bun
          </span>
        </div>
      </footer>
    </div>
  );
}
