import {
  BotStatus,
  BotState,
  Portfolio,
  TradesResponse,
  Signals,
  EmergencyStopResponse,
  PositionsResponse,
  RecommendationsResponse,
} from '@/types';

const API_URL = process.env.NEXT_PUBLIC_BOT_API_URL || 'http://localhost:3847';
const API_KEY = process.env.NEXT_PUBLIC_BOT_API_KEY || '';

async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_URL}${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': API_KEY,
      ...options?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export async function getHealth(): Promise<BotStatus> {
  // Health endpoint doesn't require auth
  const response = await fetch(`${API_URL}/health`);
  if (!response.ok) {
    throw new Error('Bot API is not reachable');
  }
  return response.json();
}

export async function getStatus(): Promise<BotState> {
  return fetchApi<BotState>('/status');
}

export async function getPortfolio(): Promise<Portfolio> {
  return fetchApi<Portfolio>('/portfolio');
}

export async function getTrades(): Promise<TradesResponse> {
  return fetchApi<TradesResponse>('/trades');
}

export async function getPositions(): Promise<PositionsResponse> {
  return fetchApi<PositionsResponse>('/positions');
}

export async function getRecommendations(): Promise<RecommendationsResponse> {
  return fetchApi<RecommendationsResponse>('/recommendations');
}

export async function getSignals(pair: string): Promise<Signals> {
  return fetchApi<Signals>(`/signals/${pair}`);
}

export async function setEmergencyStop(stop: boolean): Promise<EmergencyStopResponse> {
  return fetchApi<EmergencyStopResponse>('/emergency-stop', {
    method: 'POST',
    body: JSON.stringify({ action: stop ? 'stop' : 'start' }),
  });
}
