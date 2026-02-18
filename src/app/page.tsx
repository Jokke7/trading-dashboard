'use client';

import Image from 'next/image';
import { StatusBar } from '@/components/StatusBar';
import { StatsCards } from '@/components/StatsCards';
import { MarketCard } from '@/components/MarketCard';
import { TradesTable } from '@/components/TradesTable';
import { Activity, Wallet } from 'lucide-react';
import { useStatus, usePositions } from '@/hooks/useBotData';

export default function Dashboard() {
  const { data: status } = useStatus();
  const { data: positionsData } = usePositions(status?.running ?? false);
  const isRunning = status?.running && !status?.emergencyStop;

  const positions = positionsData?.positions ?? [];

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

        {/* Positions / Market Cards */}
        {positions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {positions.map((position) => (
              <MarketCard key={position.symbol} pair={position.symbol} isRunning={isRunning} />
            ))}
          </div>
        ) : (
          <div className="bg-slate-900 rounded-xl p-8 border border-slate-800 text-center">
            <Wallet className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-300 mb-2">No Active Positions</h3>
            <p className="text-slate-500">The bot hasn&apos;t opened any positions yet.</p>
          </div>
        )}

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
