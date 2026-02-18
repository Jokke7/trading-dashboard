'use client';

import { useHealth, useStatus, useEmergencyStop } from '@/hooks/useBotData';
import { Activity, Square, Play, AlertCircle, RefreshCw } from 'lucide-react';
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
      <div className="bg-slate-900 border-b border-slate-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-slate-600 animate-pulse" />
            <span className="text-slate-400">Connecting to bot...</span>
          </div>
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 px-3 py-1 text-sm text-slate-400 hover:text-slate-200"
          >
            <RefreshCw className="w-4 h-4" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="bg-slate-900 border-b border-slate-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span className="font-medium text-red-400">Connection Error</span>
              <span className="text-sm text-slate-500">Check if bot is running at bot.godot.no</span>
          </div>
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 px-3 py-1 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm"
          >
            <RefreshCw className="w-4 h-4" />
            Retry Connection
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
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 px-3 py-2 text-slate-400 hover:text-slate-200 rounded-lg"
            title="Refresh data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          
          {isRunning ? (
            <button
              onClick={() => emergencyStop.mutate(true)}
              disabled={emergencyStop.isPending}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              <Square className="w-4 h-4" />
              {emergencyStop.isPending ? 'Stopping...' : 'Emergency Stop'}
            </button>
          ) : (
            <button
              onClick={() => emergencyStop.mutate(false)}
              disabled={emergencyStop.isPending}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              <Play className="w-4 h-4" />
              {emergencyStop.isPending ? 'Starting...' : 'Resume Trading'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
