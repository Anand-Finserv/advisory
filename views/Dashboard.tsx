import React from 'react';
import { MarketIndex, InvestmentCall, CallStatus, StockMover } from '../types';
import CallCard from '../components/CallCard';
import { TrendingUp, Award, Activity, Globe, ShieldCheck, Zap, Info, ArrowUpRight, ArrowDownRight, ChevronRight } from 'lucide-react';

interface DashboardProps {
  indices: MarketIndex[];
  calls: InvestmentCall[];
  movers?: StockMover[];
  marketStatus?: string;
  insight?: string;
  lastUpdated?: string;
}

const Dashboard: React.FC<DashboardProps> = ({ indices, calls, movers = [], marketStatus, insight, lastUpdated }) => {
  const activeCalls = calls.filter(c => c.status === CallStatus.OPEN);
  const completedCalls = calls.filter(c => c.status !== CallStatus.OPEN);
  const accuracy = completedCalls.length > 0 ? (calls.filter(c => c.status === CallStatus.HIT_TP).length / completedCalls.length * 100) : 0;

  const getRelativeTime = (iso?: string) => {
    if (!iso) return "Real-time Ready";
    const date = new Date(iso);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const gainers = movers.filter(m => m.type === 'GAINER').slice(0, 5);
  const losers = movers.filter(m => m.type === 'LOSER').slice(0, 5);

  return (
    <div className="space-y-6 pb-4">
      {/* Dynamic Header */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Financial Terminal</h2>
          <div className="flex items-center space-x-2 mt-1">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <p className="text-slate-500 text-[11px] font-bold uppercase tracking-widest">Research Feed Active • {getRelativeTime(lastUpdated)}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className={`px-4 py-2 rounded-xl border flex items-center space-x-2 shadow-sm ${
            marketStatus?.includes('LIVE') ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-slate-50 border-slate-200 text-slate-600'
          }`}>
            <Zap className="w-4 h-4 fill-current" />
            <span className="text-[11px] font-black uppercase tracking-widest">{marketStatus || 'CONNECTED'}</span>
          </div>
        </div>
      </section>

      {/* Research Intelligence Card */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[80px] -mr-32 -mt-32"></div>
        <div className="relative z-10">
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-blue-600/30 p-2 rounded-lg backdrop-blur-sm border border-white/10">
              <ShieldCheck className="w-5 h-5 text-blue-400" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-300">Institutional Strategy AI</span>
          </div>
          
          <h3 className="text-xl md:text-2xl font-bold leading-tight mb-4 text-slate-50">
            {insight || "Decoding global market trends using research-grounded intelligence..."}
          </h3>
          
          <div className="flex flex-wrap gap-4 mt-8 pt-6 border-t border-white/10">
            <div className="flex items-center space-x-2">
              <Globe className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Multi-Source Analysis</span>
            </div>
          </div>
        </div>
      </section>

      {/* Primary Indices Grid */}
      <section>
        <div className="flex items-center justify-between mb-4 px-1">
          <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Live Market Barometers</h3>
          <Info className="w-4 h-4 text-slate-300" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {indices.map((idx) => (
            <div key={idx.name} className="glass-card p-5 rounded-3xl shadow-sm hover:shadow-md transition-all border-slate-200">
              <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">{idx.name}</p>
              <p className="text-xl font-black text-slate-900 tracking-tight mb-1 tabular-nums">
                {idx.value.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </p>
              <span className={`text-[10px] font-black ${idx.change >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                {idx.change >= 0 ? '▲' : '▼'} {idx.changePercent.toFixed(2)}%
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Top Gainers & Losers Section */}
      {movers.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4 px-1">
            <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Top Movers (Nifty 50)</h3>
            <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Source: NSE Live Feed</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Top Gainers */}
            <div className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm">
              <div className="bg-emerald-50 px-6 py-4 border-b border-emerald-100 flex justify-between items-center">
                <h3 className="text-[10px] font-black text-emerald-700 uppercase tracking-widest flex items-center">
                  <ArrowUpRight className="w-4 h-4 mr-2" />
                  Top 5 Gainers
                </h3>
              </div>
              <div className="divide-y divide-slate-50">
                {gainers.map((mover, i) => (
                  <div key={mover.symbol + i} className="px-6 py-3 flex items-center justify-between hover:bg-emerald-50/20 transition-colors">
                    <div className="flex flex-col">
                      <span className="text-xs font-black text-slate-800">{mover.symbol}</span>
                      <span className="text-[10px] font-bold text-slate-400">₹{mover.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-black text-emerald-600">+{mover.changePercent.toFixed(2)}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Losers */}
            <div className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm">
              <div className="bg-rose-50 px-6 py-4 border-b border-rose-100 flex justify-between items-center">
                <h3 className="text-[10px] font-black text-rose-700 uppercase tracking-widest flex items-center">
                  <ArrowDownRight className="w-4 h-4 mr-2" />
                  Top 5 Losers
                </h3>
              </div>
              <div className="divide-y divide-slate-50">
                {losers.map((mover, i) => (
                  <div key={mover.symbol + i} className="px-6 py-3 flex items-center justify-between hover:bg-rose-50/20 transition-colors">
                    <div className="flex flex-col">
                      <span className="text-xs font-black text-slate-800">{mover.symbol}</span>
                      <span className="text-[10px] font-bold text-slate-400">₹{mover.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-black text-rose-600">{mover.changePercent.toFixed(2)}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Conviction & Signals Section */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Institutional Signals</h3>
            <span className="text-[10px] font-bold bg-blue-100 text-blue-700 px-2 py-1 rounded-lg">
              {activeCalls.length} ACTIVE
            </span>
          </div>
          
          {activeCalls.length > 0 ? (
            activeCalls.slice(0, 5).map(call => (
              <CallCard key={call.id} call={call} />
            ))
          ) : (
            <div className="bg-white rounded-[2rem] border-2 border-dashed border-slate-200 p-12 text-center">
              <Activity className="w-10 h-10 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Market Scan: No high-conviction triggers found</p>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 -mr-8 -mt-8 rounded-full transition-transform group-hover:scale-150 duration-700"></div>
            <div className="flex items-center justify-between mb-6">
              <div className="bg-indigo-50 p-3 rounded-2xl">
                <TrendingUp className="text-indigo-600 w-6 h-6" />
              </div>
              <span className="text-4xl font-black text-slate-900 tracking-tighter">{accuracy.toFixed(0)}%</span>
            </div>
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">Signal Precision</p>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">Historical accuracy based on research tracking.</p>
          </div>

          <div className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 -mr-8 -mt-8 rounded-full transition-transform group-hover:scale-150 duration-700"></div>
            <div className="flex items-center justify-between mb-6">
              <div className="bg-emerald-50 p-3 rounded-2xl">
                <Award className="text-emerald-600 w-6 h-6" />
              </div>
              <span className="text-4xl font-black text-slate-900 tracking-tighter">{activeCalls.length}</span>
            </div>
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">Open Trade Engine</p>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">Active research positions monitored by the vault.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;