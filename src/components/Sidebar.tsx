'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Activity, AlertCircle, CheckCircle2, XCircle, Settings, Zap, TrendingUp, Bot } from 'lucide-react';

interface LogEntry {
  timestamp: string;
  symbol: string;
  action: 'BUY' | 'SELL' | 'HOLD';
  amountUsd: number;
  reasoning: string;
  executed: boolean;
  reason?: string;
}

interface SidebarProps {
  logs?: LogEntry[];
  isRunning?: boolean;
}

export function Sidebar({ logs = [], isRunning = true }: SidebarProps) {
  const [expanded, setExpanded] = useState<string | null>('research');

  const toggleSection = (section: string) => {
    setExpanded(expanded === section ? null : section);
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getActionIcon = (action: string, executed: boolean) => {
    if (!executed) return <XCircle className="w-3.5 h-3.5 text-yellow-400" />;
    switch (action) {
      case 'BUY':
        return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />;
      case 'SELL':
        return <AlertCircle className="w-3.5 h-3.5 text-red-400" />;
      default:
        return <Activity className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  const recentLogs = logs.slice(-10).reverse();

  return (
    <div className="h-full flex flex-col">
      {/* Research Logs Section */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <button
          onClick={() => toggleSection('research')}
          className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/5 transition-colors border-b border-white/10"
        >
          <div className="flex items-center gap-2">
            <Bot className="w-4 h-4 text-slate-400" />
            <span className="text-sm font-medium text-slate-300">Research logs</span>
          </div>
          {expanded === 'research' ? (
            <ChevronUp className="w-4 h-4 text-slate-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-500" />
          )}
        </button>

        {expanded === 'research' && (
          <div className="flex-1 overflow-y-auto">
            {recentLogs.length === 0 ? (
              <p className="p-4 text-slate-500 text-xs">No research yet</p>
            ) : (
              <div className="divide-y divide-white/5">
                {recentLogs.map((log, idx) => (
                  <div key={idx} className="p-3 hover:bg-white/5">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5">
                        {getActionIcon(log.action, log.executed)}
                        <span className="text-sm font-medium text-slate-200">
                          {log.action} {log.symbol.replace('USDT', '')}
                        </span>
                      </div>
                      <span className="text-xs text-slate-500">
                        {formatTime(log.timestamp)}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-2 mb-1">{log.reasoning}</p>
                    {log.executed ? (
                      <span className="text-xs text-emerald-400">${log.amountUsd.toFixed(2)}</span>
                    ) : (
                      <span className="text-xs text-yellow-400">{log.reason || 'Skipped'}</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* System Status - Bottom */}
      <div className="border-t border-white/10">
        <button
          onClick={() => toggleSection('status')}
          className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/5 transition-colors"
        >
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isRunning ? 'bg-emerald-400' : 'bg-red-400'}`} />
            <span className="text-sm font-medium text-slate-300">System</span>
          </div>
          {expanded === 'status' ? (
            <ChevronUp className="w-4 h-4 text-slate-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-500" />
          )}
        </button>

        {expanded === 'status' && (
          <div className="px-4 pb-4 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 flex items-center gap-1.5">
                <TrendingUp className="w-3 h-3" /> Mode
              </span>
              <span className="text-slate-300 font-medium">Paper</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 flex items-center gap-1.5">
                <Activity className="w-3 h-3" /> Pairs
              </span>
              <span className="text-slate-300">5</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 flex items-center gap-1.5">
                <Settings className="w-3 h-3" /> Max Position
              </span>
              <span className="text-slate-300">5</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">Max Trade</span>
              <span className="text-slate-300">$20</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
