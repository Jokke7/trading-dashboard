'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Activity, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';

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
  const [expanded, setExpanded] = useState<string | null>('recommendations');

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
    if (!executed) return <XCircle className="w-4 h-4 text-yellow-400" />;
    switch (action) {
      case 'BUY':
        return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      case 'SELL':
        return <AlertCircle className="w-4 h-4 text-red-400" />;
      default:
        return <Activity className="w-4 h-4 text-slate-400" />;
    }
  };

  const recentLogs = logs.slice(-10).reverse();

  return (
    <div className="space-y-3">
      {/* Recommendations Section */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
        <button
          onClick={() => toggleSection('recommendations')}
          className="w-full flex items-center justify-between p-4 hover:bg-slate-800/50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-400" />
            <span className="font-semibold text-slate-200">Dexter Recommendations</span>
          </div>
          {expanded === 'recommendations' ? (
            <ChevronUp className="w-5 h-5 text-slate-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-slate-400" />
          )}
        </button>

        {expanded === 'recommendations' && (
          <div className="border-t border-slate-800">
            {recentLogs.length === 0 ? (
              <p className="p-4 text-slate-500 text-sm">No recommendations yet</p>
            ) : (
              <div className="max-h-80 overflow-y-auto">
                {recentLogs.map((log, idx) => (
                  <div
                    key={idx}
                    className="p-3 border-b border-slate-800/50 last:border-0 hover:bg-slate-800/30"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        {getActionIcon(log.action, log.executed)}
                        <span className="font-medium text-slate-200">
                          {log.action} {log.symbol.replace('USDT', '')}
                        </span>
                      </div>
                      <span className="text-xs text-slate-500">
                        {formatTime(log.timestamp)}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mb-1">{log.reasoning}</p>
                    {log.executed ? (
                      <span className="text-xs text-emerald-400">
                        ${log.amountUsd.toFixed(2)} executed
                      </span>
                    ) : (
                      <span className="text-xs text-yellow-400">
                        {log.reason || 'Not executed'}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* System Status Section */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
        <button
          onClick={() => toggleSection('status')}
          className="w-full flex items-center justify-between p-4 hover:bg-slate-800/50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isRunning ? 'bg-emerald-400' : 'bg-red-400'}`} />
            <span className="font-semibold text-slate-200">System Status</span>
          </div>
          {expanded === 'status' ? (
            <ChevronUp className="w-5 h-5 text-slate-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-slate-400" />
          )}
        </button>

        {expanded === 'status' && (
          <div className="border-t border-slate-800 p-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-400">Bot Mode</span>
              <span className="text-slate-200">Paper</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Active Pairs</span>
              <span className="text-slate-200">5</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Max Positions</span>
              <span className="text-slate-200">5</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Max Trade</span>
              <span className="text-slate-200">$20</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
