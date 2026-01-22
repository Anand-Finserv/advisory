
import React from 'react';
import { InvestmentCall, CallType, CallStatus } from '../types';
import { ChevronRight, ArrowUpCircle, ArrowDownCircle, CheckCircle2, XCircle, Clock, Loader2 } from 'lucide-react';

interface CallCardProps {
  call: InvestmentCall;
  showDetails?: boolean;
}

const CallCard: React.FC<CallCardProps> = ({ call, showDetails = true }) => {
  const isBuy = call.type === CallType.BUY;
  
  const getPnL = () => {
    if (!call.cmp || call.cmp === 0) return { value: 0, percent: 0 };
    const diff = isBuy ? call.cmp - call.entry : call.entry - call.cmp;
    const pnlPercent = (diff / call.entry) * 100;
    return { value: diff, percent: pnlPercent };
  };

  const pnl = getPnL();
  const hasCmp = call.cmp && call.cmp > 0;

  const getStatusBadge = () => {
    switch (call.status) {
      case CallStatus.OPEN: return <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center"><Clock className="w-3 h-3 mr-1" /> ACTIVE</span>;
      case CallStatus.HIT_TP: return <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center"><CheckCircle2 className="w-3 h-3 mr-1" /> TARGET HIT</span>;
      case CallStatus.HIT_SL: return <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center"><XCircle className="w-3 h-3 mr-1" /> SL HIT</span>;
      case CallStatus.CLOSED: return <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full text-[10px] font-bold">CLOSED</span>;
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all mb-4">
      <div className={`h-1.5 ${isBuy ? 'bg-green-500' : 'bg-red-500'}`} />
      
      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-black text-xl text-slate-800 tracking-tight">{call.symbol}</h3>
              <span className={`text-[10px] px-2 py-0.5 rounded font-black tracking-widest ${isBuy ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {call.type}
              </span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{call.segment}</span>
            </div>
            <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">
              {new Date(call.timestamp).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
            </p>
          </div>
          {getStatusBadge()}
        </div>

        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Entry Price</p>
            <p className="text-xl font-black text-slate-800 tabular-nums">₹{call.entry.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
          </div>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 relative overflow-hidden group">
            <div className="flex items-center justify-between mb-1">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Current Market Price</p>
              {hasCmp && call.status === CallStatus.OPEN && (
                <div className="flex items-center space-x-1">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-[9px] font-black text-emerald-600 uppercase">Live</span>
                </div>
              )}
            </div>
            {hasCmp ? (
              <p className={`text-xl font-black tabular-nums transition-colors ${pnl.percent >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                ₹{call.cmp.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            ) : (
              <div className="flex items-center space-x-2 py-1">
                <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
                <p className="text-sm font-bold text-slate-400 italic">Fetching...</p>
              </div>
            )}
          </div>
        </div>

        {showDetails && (
          <div className="flex items-center justify-between border-t border-slate-100 pt-5 mb-4">
            <div className="text-left">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Stop Loss</p>
              <p className="text-sm font-black text-rose-500">₹{call.sl.toLocaleString()}</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Target Price</p>
              <p className="text-sm font-black text-emerald-500">₹{call.tp.toLocaleString()}</p>
            </div>
            <div className={`px-4 py-2 rounded-xl text-white min-w-[100px] text-center shadow-lg transition-colors ${!hasCmp ? 'bg-slate-200' : pnl.percent >= 0 ? 'bg-emerald-600 shadow-emerald-500/20' : 'bg-rose-600 shadow-rose-500/20'}`}>
              <p className="text-[9px] font-black uppercase tracking-widest opacity-80">Return</p>
              <p className="text-sm font-black tabular-nums">
                {!hasCmp ? '--' : `${pnl.percent >= 0 ? '+' : ''}${pnl.percent.toFixed(2)}%`}
              </p>
            </div>
          </div>
        )}

        {showDetails && call.analysis && (
          <div className="bg-indigo-50/50 p-4 rounded-xl text-[11px] text-indigo-900 border border-indigo-100/50">
            <strong className="uppercase font-black tracking-widest text-[9px] block mb-1 text-indigo-400">Analyst Research Note</strong>
            <span className="italic leading-relaxed">{call.analysis}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default CallCard;
