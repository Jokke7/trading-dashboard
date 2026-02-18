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
        <div className="px-4 py-3">
          <div className="flex items-center gap-3">
            <Image
              src="/godot-logo.svg"
              alt="Godot"
              width={32}
              height={32}
              className="text-blue-400"
            />
            <p className="text-sm text-slate-400 flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Live Trading Monitor
            </p>
          </div>
        </div>
        <StatusBar />
      </header>

      {/* Main Content */}
      <main className="p-4 md:p-6 space-y-4 md:space-y-6">
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

      {/* Footer */}
      <footer className="border-t border-slate-800 px-6 py-4 mt-8 bg-slate-900/50">
        <div className="flex items-center justify-center gap-2">
          <a href="https://godot.no" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Image
              src="/godot-logo.svg"
              alt="Godot"
              width={16}
              height={16}
              className="text-slate-500"
            />
            <span className="text-sm text-slate-500">
              Trading Bot Dashboard v0.1.0
            </span>
          </a>
        </div>
      </footer>
    </div>
  );
}
