import { StatusBar } from '@/components/StatusBar';
import { StatsCards } from '@/components/StatsCards';
import { MarketCard } from '@/components/MarketCard';
import { TradesTable } from '@/components/TradesTable';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800">
        <div className="px-6 py-4">
          <h1 className="text-xl font-bold text-slate-100">Trading Bot Dashboard</h1>
        </div>
        <StatusBar />
      </header>

      {/* Main Content */}
      <main className="p-6 space-y-6">
        {/* Stats Cards */}
        <StatsCards />

        {/* Market Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <MarketCard pair="BTCUSDT" />
          <MarketCard pair="ETHUSDT" />
        </div>

        {/* Trades Table */}
        <TradesTable />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 px-6 py-4 mt-8">
        <div className="flex items-center justify-between text-sm text-slate-500">
          <span>Trading Bot Dashboard v0.1.0</span>
          <span>Auto-refresh every 30s</span>
        </div>
      </footer>
    </div>
  );
}
