'use client';

import { useHealth, useStatus, useEmergencyStop } from '@/hooks/useBotData';
import { Activity, Square, Play, AlertCircle } from 'lucide-react';

export function StatusBar() {
  const { data: health, isLoading: healthLoading } = useHealth();
  const { data: status, isLoading: statusLoading } = useStatus();
  const emergencyStop = useEmergencyStop();

  const isLoading = healthLoading || statusLoading;

  if (isLoading) {
    return (
      <div className="bg-slate-900 border-b border-slate-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-slate-600 animate-pulse" />
            <span className="text-slate-400">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  const isHealthy = health?.status === 'ok';
  const isRunning = status?.running && !status?.emergencyStop;
  const isStopped = status?.emergencyStop;

  let statusColor = 'bg-slate-500';
  let statusText = 'Unknown';
  let StatusIcon = Activity;

  if (isHealthy && isRunning) {
    statusColor = 'bg-emerald-500';
    statusText = 'Running';
    StatusIcon = Activity;
  } else if (isHealthy && isStopped) {
    statusColor = 'bg-red-500';
    statusText = 'Stopped';
    StatusIcon = AlertCircle;
  } else if (!isHealthy) {
    statusColor = 'bg-amber-500';
    statusText = 'Offline';
    StatusIcon = AlertCircle;
  }

  const modeColor = {
    paper: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    testnet: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    live: 'bg-red-500/20 text-red-400 border-red-500/30',
  }[status?.mode || 'paper'];

  return (
    <div className="bg-slate-900 border-b border-slate-800 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${statusColor} ${isRunning ? 'animate-pulse' : ''}`} />
            <span className="font-medium">{statusText}</span>
          </div>
          
          <span className={`px-3 py-1 rounded-full text-xs font-medium border uppercase ${modeColor}`}>
            {status?.mode || 'paper'}
          </span>
          
          {health?.timestamp && (
            <span className="text-sm text-slate-500">
              Last check: {new Date(health.timestamp).toLocaleTimeString()}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {isRunning ? (
            <button
              onClick={() => emergencyStop.mutate(true)}
              disabled={emergencyStop.isPending}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              <Square className="w-4 h-4" />
              Emergency Stop
            </button>
          ) : (
            <button
              onClick={() => emergencyStop.mutate(false)}
              disabled={emergencyStop.isPending}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              <Play className="w-4 h-4" />
              Resume Trading
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
