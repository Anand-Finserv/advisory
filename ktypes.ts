
export enum CallType {
  BUY = 'BUY',
  SELL = 'SELL'
}

export enum CallStatus {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
  HIT_TP = 'HIT_TP',
  HIT_SL = 'HIT_SL'
}

export interface InvestmentCall {
  id: string;
  symbol: string;
  type: CallType;
  entry: number;
  sl: number;
  tp: number;
  cmp: number;
  status: CallStatus;
  timestamp: string;
  analysis: string;
  segment: 'EQUITY' | 'F&O' | 'COMMODITY';
}

export interface UserProfile {
  fullName: string;
  mobile: string;
  clientId: string;
  role: 'CLIENT' | 'ADMIN';
  joinedAt: string;
}

export interface MarketIndex {
  name: string;
  value: number;
  change: number;
  changePercent: number;
}

export interface StockMover {
  symbol: string;
  price: number;
  changePercent: number;
  type: 'GAINER' | 'LOSER';
}

export interface NewsItem {
  id: string;
  title: string;
  source: string;
  time: string;
  summary?: string;
}