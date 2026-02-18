'use client';

import { useHealth, useStatus, useEmergencyStop } from '@/hooks/useBotData';
import { Square, Play, RefreshCw } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

export function StatusBar() {
  const { data: health, isLoading: healthLoading, error: healthError } = useHealth();
  const { data: status, isLoading: statusLoading, error: statusError } = useStatus();
  const emergencyStop = useEmergencyStop();
  const queryClient = useQueryClient();

  const isLoading = healthLoading || statusLoading;
  const hasError = healthError || statusError;

  // Manual refresh function
  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['health'] });
    queryClient.invalidateQueries({ queryKey: ['status'] });
  };

  if (isLoading) {
    return (
      <div className="bg-slate-900 border-b border-slate-800 px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-slate-600 animate-pulse" />
            <span className="text-sm text-slate-400">Connecting to bot...</span>
          </div>
          <button
            onClick={handleRefresh}
            className="text-sm text-slate-400 hover:text-slate-200"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="bg-slate-900 border-b border-slate-800 px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500" />
            <span className="text-sm font-medium text-red-400">Connection Error</span>
            <span className="text-xs text-slate-500">Check if bot is running at bot.godot.no</span>
          </div>
          <button
            onClick={handleRefresh}
            className="text-sm text-slate-400 hover:text-slate-200"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const isHealthy = health?.status === 'ok';
  const isRunning = status?.running && !status?.emergencyStop;
  const isStopped = status?.emergencyStop;

  let statusColor = 'bg-slate-500';
  let statusText = 'Unknown';

  if (isHealthy && isRunning) {
    statusColor = 'bg-emerald-500';
    statusText = 'Running';
  } else if (isHealthy && isStopped) {
    statusColor = 'bg-red-500';
    statusText = 'Stopped';
  } else if (!isHealthy) {
    statusColor = 'bg-amber-500';
    statusText = 'Offline';
  }

  const modeColor = {
    paper: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    testnet: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    live: 'bg-red-500/20 text-red-400 border-red-500/30',
  }[status?.mode || 'paper'];

  return (
    <div className="bg-slate-900 border-b border-slate-800 px-4 py-2">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 md:gap-3">
          <div className="flex items-center gap-1.5">
            <div className={`w-2 h-2 rounded-full ${statusColor} ${isRunning ? 'animate-pulse' : ''}`} />
            <span className="text-sm font-medium">{statusText}</span>
          </div>
          
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium border uppercase ${modeColor}`}>
            {status?.mode || 'paper'}
          </span>
          
          {health?.timestamp && (
            <span className="hidden md:inline text-xs text-slate-500">
              {new Date(health.timestamp).toLocaleTimeString()}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            className="p-1.5 text-slate-400 hover:text-slate-200 rounded hover:bg-slate-800"
            title="Refresh data"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
          
          {isRunning ? (
            <button
              onClick={() => emergencyStop.mutate(true)}
              disabled={emergencyStop.isPending}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-medium transition-colors disabled:opacity-50"
              title="Stop the trading bot"
            >
              <Square className="w-3 h-3" />
              {emergencyStop.isPending ? 'Stopping...' : 'Stop'}
            </button>
          ) : (
            <button
              onClick={() => emergencyStop.mutate(false)}
              disabled={emergencyStop.isPending}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-medium transition-colors disabled:opacity-50"
              title="Resume trading"
            >
              <Play className="w-3 h-3" />
              {emergencyStop.isPending ? 'Starting...' : 'Start'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
