'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Activity, AlertCircle, CheckCircle2, Settings, TrendingUp, Bot } from 'lucide-react';

interface LogEntry {
  timestamp: string;
  pair: string;
  action: 'BUY' | 'SELL' | 'HOLD';
  confidence: number;
  reasoning: string;
  executed: boolean;
  price?: number;
}

interface SidebarProps {
  logs?: LogEntry[];
  isRunning?: boolean;
}

export function Sidebar({ logs = [], isRunning = true }: SidebarProps) {
  const [expanded, setExpanded] = useState<string | null>('research');
  const [expandedLog, setExpandedLog] = useState<number | null>(null);

  const toggleSection = (section: string) => {
    setExpanded(expanded === section ? null : section);
  };

  const toggleLog = (idx: number) => {
    setExpandedLog(expandedLog === idx ? null : idx);
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getActionIcon = (action: string, executed: boolean) => {
    if (!executed) return <Activity className="w-3.5 h-3.5 text-yellow-400" />;
    switch (action) {
      case 'BUY':
        return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />;
      case 'SELL':
        return <AlertCircle className="w-3.5 h-3.5 text-red-400" />;
      default:
        return <Activity className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'BUY': return 'text-emerald-400';
      case 'SELL': return 'text-red-400';
      default: return 'text-slate-400';
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
                  <div key={idx}>
                    <button
                      onClick={() => toggleLog(idx)}
                      className="w-full p-3 hover:bg-white/5 text-left"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          {getActionIcon(log.action, log.executed)}
                          <span className={`text-sm font-medium ${getActionColor(log.action)}`}>
                            {log.action}
                          </span>
                          <span className="text-sm text-slate-300">
                            {log.pair.replace('USDT', '')}
                          </span>
                          {log.confidence && (
                            <span className="text-xs text-slate-500">({log.confidence}%)</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-500">
                            {formatTime(log.timestamp)}
                          </span>
                          <ChevronDown className={`w-3 h-3 text-slate-500 transition-transform ${expandedLog === idx ? 'rotate-180' : ''}`} />
                        </div>
                      </div>
                      <p className={`text-xs text-slate-400 mt-1 ${expandedLog === idx ? '' : 'line-clamp-2'}`}>
                        {log.reasoning}
                      </p>
                    </button>
                    {expandedLog === idx && log.price && (
                      <div className="px-3 pb-3 pt-0 bg-white/5">
                        <p className="text-xs text-slate-500">
                          Price: ${log.price.toLocaleString()}
                        </p>
                      </div>
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
