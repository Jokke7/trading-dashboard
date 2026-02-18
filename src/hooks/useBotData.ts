'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getHealth,
  getStatus,
  getPortfolio,
  getTrades,
  getSignals,
  getPositions,
  setEmergencyStop,
} from '@/lib/api';

const REFRESH_INTERVAL = 30000; // 30 seconds
const PAUSED_INTERVAL = false; // Don't auto-refresh when paused

export function useHealth(enabled = true) {
  return useQuery({
    queryKey: ['health'],
    queryFn: getHealth,
    refetchInterval: enabled ? REFRESH_INTERVAL : PAUSED_INTERVAL,
    retry: 3,
    enabled,
  });
}

export function useStatus(enabled = true) {
  return useQuery({
    queryKey: ['status'],
    queryFn: getStatus,
    refetchInterval: enabled ? REFRESH_INTERVAL : PAUSED_INTERVAL,
    retry: 3,
    enabled,
  });
}

export function usePortfolio(enabled = true) {
  return useQuery({
    queryKey: ['portfolio'],
    queryFn: getPortfolio,
    refetchInterval: enabled ? REFRESH_INTERVAL : PAUSED_INTERVAL,
    retry: 3,
    enabled,
  });
}

export function useTrades(enabled = true) {
  return useQuery({
    queryKey: ['trades'],
    queryFn: getTrades,
    refetchInterval: enabled ? REFRESH_INTERVAL : PAUSED_INTERVAL,
    retry: 3,
    enabled,
  });
}

export function usePositions(enabled = true) {
  return useQuery({
    queryKey: ['positions'],
    queryFn: getPositions,
    refetchInterval: enabled ? REFRESH_INTERVAL : PAUSED_INTERVAL,
    retry: 3,
    enabled,
  });
}

export function useSignals(pair: string, enabled = true) {
  return useQuery({
    queryKey: ['signals', pair],
    queryFn: () => getSignals(pair),
    refetchInterval: enabled ? REFRESH_INTERVAL : PAUSED_INTERVAL,
    retry: 3,
    enabled: !!pair && enabled,
  });
}

export function useEmergencyStop() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: setEmergencyStop,
    onSuccess: () => {
      // Invalidate status query to refresh
      queryClient.invalidateQueries({ queryKey: ['status'] });
    },
  });
}
