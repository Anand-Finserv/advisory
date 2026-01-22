
import { InvestmentCall, MarketIndex, NewsItem } from './types';

export const ADMIN_PASSWORD = 'admin'; // Change this before deployment

export const MOCK_INDICES: MarketIndex[] = [
  { name: 'NIFTY 50', value: 24852.15, change: 112.30, changePercent: 0.45 },
  { name: 'SENSEX', value: 81332.72, change: 412.10, changePercent: 0.51 },
  { name: 'BANK NIFTY', value: 52431.20, change: -12.45, changePercent: -0.02 },
  { name: 'NIFTY IT', value: 41221.15, change: 345.20, changePercent: 0.84 },
];

// Start with no preview calls for a clean client deployment
export const INITIAL_CALLS: InvestmentCall[] = [];

export const MOCK_NEWS: NewsItem[] = [
  {
    id: 'n1',
    title: 'RBI likely to keep repo rate unchanged in upcoming policy meet',
    source: 'Financial Express',
    time: '2 hours ago',
    summary: 'Analysts expect the central bank to maintain its hawkish stance despite easing inflation.'
  },
  {
    id: 'n2',
    title: 'FIIs turn net buyers in Indian markets after 3 weeks of selling',
    source: 'MoneyControl',
    time: '4 hours ago',
    summary: 'Foreign Institutional Investors pumped in ₹2,400 crore in the cash segment on Tuesday.'
  },
  {
    id: 'n3',
    title: 'Nifty IT index hits 52-week high led by Infosys and TCS',
    source: 'Business Standard',
    time: '5 hours ago'
  }
];
