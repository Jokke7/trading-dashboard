'use client';

import Image from 'next/image';
import { StatusBar } from '@/components/StatusBar';
import { StatsCards } from '@/components/StatsCards';
import { MarketCard } from '@/components/MarketCard';
import { TradesTable } from '@/components/TradesTable';
import { Sidebar } from '@/components/Sidebar';
import { Activity, Wallet } from 'lucide-react';
import { useStatus, usePositions, useRecommendations } from '@/hooks/useBotData';

export default function Dashboard() {
  const { data: status } = useStatus();
  const { data: positionsData } = usePositions(status?.running ?? false);
  const { data: recommendationsData } = useRecommendations(status?.running ?? false);
  const isRunning = status?.running && !status?.emergencyStop;

  const positions = positionsData?.positions ?? [];
  const recommendations = recommendationsData?.recommendations ?? [];

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800 flex-shrink-0">
        <div className="px-4 py-3">
          <div className="flex items-center gap-3">
            <Image
              src="/godot-logo.svg"
              alt="Godot"
              width={28}
              height={28}
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

      {/* Main Layout */}
      <div className="flex-1 flex">
        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 space-y-4 md:space-y-6 overflow-auto">
          <StatsCards isRunning={isRunning} />

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

          <TradesTable isRunning={isRunning} />
        </main>

        {/* Sidebar - Desktop only, continuous bar */}
        <aside className="hidden lg:block w-72 border-l border-slate-800 bg-slate-900 flex-shrink-0 overflow-hidden">
          <Sidebar logs={recommendations} isRunning={isRunning} />
        </aside>
      </div>
    </div>
  );
}
