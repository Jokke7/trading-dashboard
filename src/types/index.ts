// Bot API Types

export interface BotStatus {
  status: 'ok' | 'error';
  timestamp: string;
}

export interface BotState {
  running: boolean;
  emergencyStop: boolean;
  mode: 'paper' | 'testnet' | 'live';
  pairs: string[];
  lastUpdated: string;
}

export interface Position {
  symbol: string;
  quantity: number;
  avgPrice: number;
  currentPrice: number;
  value: number;
  pnl: number;
  pnlPercent: number;
}

export interface PositionsResponse {
  positions: Position[];
}

export interface Balance {
  asset: string;
  free: string;
  locked: string;
}

export interface Portfolio {
  balances: Balance[];
}

export interface Trade {
  timestamp: string;
  pair: string;
  action: 'BUY' | 'SELL' | 'HOLD';
  confidence: number;
  reasoning: string;
  size_usd: number;
  executed: boolean;
  orderId?: number;
  price?: number;
  error?: string;
  mode: 'paper' | 'testnet' | 'live';
}

export interface TradesResponse {
  trades: Trade[];
  date: string;
}

export interface MacdData {
  macd: number;
  signal: number;
  histogram: number;
}

export interface Signals {
  symbol: string;
  price: string;
  change24h: string;
  rsi: number;
  sma20: number;
  sma50: number;
  sma200: number;
  macd: MacdData;
}

export interface EmergencyStopResponse {
  emergencyStop: boolean;
  message?: string;
}
