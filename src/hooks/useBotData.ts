'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getHealth,
  getStatus,
  getPortfolio,
  getTrades,
  getSignals,
  setEmergencyStop,
} from '@/lib/api';

const REFRESH_INTERVAL = 30000; // 30 seconds

export function useHealth() {
  return useQuery({
    queryKey: ['health'],
    queryFn: getHealth,
    refetchInterval: REFRESH_INTERVAL,
    retry: 3,
  });
}

export function useStatus() {
  return useQuery({
    queryKey: ['status'],
    queryFn: getStatus,
    refetchInterval: REFRESH_INTERVAL,
    retry: 3,
  });
}

export function usePortfolio() {
  return useQuery({
    queryKey: ['portfolio'],
    queryFn: getPortfolio,
    refetchInterval: REFRESH_INTERVAL,
    retry: 3,
  });
}

export function useTrades() {
  return useQuery({
    queryKey: ['trades'],
    queryFn: getTrades,
    refetchInterval: REFRESH_INTERVAL,
    retry: 3,
  });
}

export function useSignals(pair: string) {
  return useQuery({
    queryKey: ['signals', pair],
    queryFn: () => getSignals(pair),
    refetchInterval: REFRESH_INTERVAL,
    retry: 3,
    enabled: !!pair,
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
