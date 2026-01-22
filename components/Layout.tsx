import React from 'react';
import { MarketIndex, StockMover } from '../types';
import { Home, TrendingUp, Newspaper, BarChart3, PieChart, User, ShieldAlert, ArrowUpRight } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  indices: MarketIndex[];
  movers?: StockMover[];
  currentView: string;
  setCurrentView: (view: string) => void;
  isAdmin: boolean;
}

const CompanyLogo = () => (
  <div className="relative flex items-center justify-center w-10 h-10 bg-blue-600 rounded-xl shadow-lg shadow-blue-500/20">
    <div className="flex items-baseline -space-x-1 translate-y-0.5">
      <span className="text-white font-black text-lg italic tracking-tighter">A</span>
      <span className="text-white/80 font-black text-lg italic tracking-tighter">F</span>
    </div>
    <div className="absolute -top-1 -right-1 bg-emerald-500 rounded-full p-0.5 border-2 border-white">
      <ArrowUpRight className="text-white w-2 h-2 stroke-[4px]" />
    </div>
  </div>
);

const Layout: React.FC<LayoutProps> = ({ children, indices, movers = [], currentView, setCurrentView, isAdmin }) => {
  const navItems = [
    { id: 'dashboard', label: 'Home', icon: Home },
    { id: 'calls', label: 'Signals', icon: TrendingUp },
    { id: 'news', label: 'News', icon: Newspaper },
    { id: 'performance', label: 'Past', icon: PieChart },
    { id: 'analysis', label: 'Analysis', icon: BarChart3 },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  if (isAdmin) {
    navItems.push({ id: 'admin', label: 'Admin', icon: ShieldAlert });
  }

  // Create ticker items: Indices + Movers
  const tickerItems = [
    ...indices.map(idx => ({ name: idx.name, value: idx.value, change: idx.changePercent, prefix: '' })),
    ...movers.map(m => ({ name: m.symbol, value: m.price, change: m.changePercent, prefix: '' }))
  ];

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Top Index & Mover Ticker */}
      <div className="bg-slate-900 text-white h-10 flex items-center overflow-hidden border-b border-slate-800">
        <div className="flex animate-marquee whitespace-nowrap">
          {(tickerItems.length > 0 ? tickerItems.concat(tickerItems) : []).map((item, i) => (
            <div key={`${item.name}-${i}`} className="flex items-center mx-6 space-x-2 text-[11px] font-bold">
              <span className="text-slate-400 uppercase tracking-tighter">{item.name}</span>
              <span className="font-mono">₹{item.value.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              <span className={item.change >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                {item.change >= 0 ? '▲' : '▼'}{Math.abs(item.change).toFixed(2)}%
              </span>
            </div>
          ))}
          {tickerItems.length === 0 && (
            <div className="px-6 text-[10px] text-slate-500 font-black uppercase tracking-widest">
              Connecting to NSE Live Data Feed...
            </div>
          )}
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center space-x-3">
          <CompanyLogo />
          <div>
            <h1 className="text-base font-black leading-none bg-gradient-to-r from-blue-700 to-indigo-600 bg-clip-text text-transparent uppercase">
              ANAND FINSERV
            </h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Research Advisory</p>
          </div>
        </div>
        <div className="flex items-center">
           <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse mr-2" />
           <span className="text-[10px] text-slate-500 font-bold uppercase">System Live</span>
        </div>
      </header>

      {/* Viewport */}
      <main className="flex-1 overflow-y-auto pb-24 custom-scrollbar bg-[#f8fafc]">
        <div className="max-w-4xl mx-auto p-4 md:p-6">
          {children}
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="bg-white border-t border-slate-200 h-16 fixed bottom-0 left-0 right-0 flex items-center justify-around px-2 z-20 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setCurrentView(item.id)}
            className={`flex flex-col items-center justify-center w-full h-full transition-all duration-300 ${
              currentView === item.id ? 'text-blue-600 scale-110' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <item.icon className={`w-5 h-5 ${currentView === item.id ? 'stroke-[2.5px]' : 'stroke-2'}`} />
            <span className={`text-[9px] mt-1 font-black uppercase tracking-tighter ${currentView === item.id ? 'opacity-100' : 'opacity-70'}`}>
              {item.label}
            </span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Layout;