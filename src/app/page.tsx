'use client';

import Image from 'next/image';
import { StatusBar } from '@/components/StatusBar';
import { StatsCards } from '@/components/StatsCards';
import { MarketCard } from '@/components/MarketCard';
import { PortfolioChart } from '@/components/PortfolioChart';
import { TradesTable } from '@/components/TradesTable';
import { Sidebar } from '@/components/Sidebar';
import { MobileDrawer } from '@/components/MobileDrawer';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Activity, Wallet } from 'lucide-react';
import { useStatus, usePositions, useTrades, useRecommendations } from '@/hooks/useBotData';

export default function Dashboard() {
  const { data: status } = useStatus();
  const { data: positionsData } = usePositions(status?.running ?? false);
  const { data: tradesData } = useTrades(status?.running ?? false);
  const { data: recsData } = useRecommendations(status?.running ?? false);
  const isRunning = status?.running && !status?.emergencyStop;

  const positions = positionsData?.positions ?? [];
  const trades = tradesData?.trades ?? [];
  const recommendations = recsData?.recommendations ?? [];

  // Build a map of latest recommendation per symbol
  const latestRecBySymbol = recommendations.reduce((acc, rec) => {
    if (!acc[rec.symbol] || new Date(rec.timestamp) > new Date(acc[rec.symbol].timestamp)) {
      acc[rec.symbol] = rec;
    }
    return acc;
  }, {} as Record<string, typeof recommendations[0]>);

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
            <div className="ml-auto">
              <MobileDrawer>
                <Sidebar logs={trades} isRunning={isRunning} status={status} positions={positions} />
              </MobileDrawer>
            </div>
          </div>
        </div>
        <StatusBar />
      </header>

      {/* Main Layout */}
      <div className="flex-1 flex">
        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 space-y-4 md:space-y-6 overflow-auto">
          <ErrorBoundary fallbackMessage="Failed to load portfolio stats.">
            <StatsCards isRunning={isRunning} />
          </ErrorBoundary>

          <ErrorBoundary fallbackMessage="Failed to load market data.">
            {positions.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {positions.map((position) => (
                  <MarketCard key={position.symbol} pair={position.symbol} isRunning={isRunning} latestRecommendation={latestRecBySymbol[position.symbol]} />
                ))}
              </div>
            ) : (
              <div className="bg-slate-900 rounded-xl p-8 border border-slate-800 text-center">
                <Wallet className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-300 mb-2">No Active Positions</h3>
                <p className="text-slate-500">The bot hasn&apos;t opened any positions yet.</p>
              </div>
            )}
          </ErrorBoundary>

          <ErrorBoundary fallbackMessage="Failed to load trade activity chart.">
            <PortfolioChart trades={trades} isRunning={isRunning} />
          </ErrorBoundary>

          <ErrorBoundary fallbackMessage="Failed to load trades table.">
            <TradesTable isRunning={isRunning} />
          </ErrorBoundary>
        </main>

        {/* Sidebar - Desktop only, continuous bar */}
        <aside className="hidden lg:block w-72 border-l border-slate-800 bg-slate-900 flex-shrink-0 overflow-hidden">
          <Sidebar logs={trades} isRunning={isRunning} status={status} positions={positions} />
        </aside>
      </div>
    </div>
  );
}
