
import React from 'react';
import { InvestmentCall, CallStatus } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Trophy, Target, TrendingDown, AlertCircle } from 'lucide-react';

interface PerformanceViewProps {
  calls: InvestmentCall[];
}

const PerformanceView: React.FC<PerformanceViewProps> = ({ calls }) => {
  const completedCalls = calls.filter(c => c.status !== CallStatus.OPEN);
  const winners = completedCalls.filter(c => c.status === CallStatus.HIT_TP);
  const losers = completedCalls.filter(c => c.status === CallStatus.HIT_SL);
  
  const accuracy = completedCalls.length > 0 ? (winners.length / completedCalls.length * 100) : 0;

  const chartData = completedCalls.slice(-5).map(c => ({
    name: c.symbol,
    pnl: c.status === CallStatus.HIT_TP ? ((c.tp - c.entry)/c.entry * 100) : ((c.sl - c.entry)/c.entry * 100)
  }));

  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-2xl font-bold text-slate-800">Past Performance</h2>
        <p className="text-slate-500 text-sm">Transparency in our research tracking.</p>
      </section>

      {/* Top Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200 text-center shadow-sm">
          <Trophy className="w-6 h-6 text-yellow-500 mx-auto mb-1" />
          <p className="text-[10px] font-bold text-slate-400 uppercase">Win Rate</p>
          <p className="text-lg font-bold text-slate-800">{accuracy.toFixed(0)}%</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 text-center shadow-sm">
          <Target className="w-6 h-6 text-blue-500 mx-auto mb-1" />
          <p className="text-[10px] font-bold text-slate-400 uppercase">Winners</p>
          <p className="text-lg font-bold text-slate-800">{winners.length}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 text-center shadow-sm">
          <TrendingDown className="w-6 h-6 text-red-500 mx-auto mb-1" />
          <p className="text-[10px] font-bold text-slate-400 uppercase">Losses</p>
          <p className="text-lg font-bold text-slate-800">{losers.length}</p>
        </div>
      </div>

      {/* Chart Section */}
      <section className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <h3 className="text-sm font-bold text-slate-800 mb-4">Last 5 Closed Trades (% P&L)</h3>
        {completedCalls.length > 0 ? (
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="pnl" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.pnl > 0 ? '#10b981' : '#ef4444'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-48 flex flex-col items-center justify-center text-slate-400 border border-dashed border-slate-200 rounded-xl">
            <AlertCircle className="w-8 h-8 mb-2 opacity-20" />
            <p className="text-xs">No historical trades to display yet.</p>
          </div>
        )}
      </section>

      {/* Trade Log */}
      <section>
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3">Historical Logs</h3>
        {completedCalls.length > 0 ? (
          <div className="space-y-2">
            {[...completedCalls].reverse().map(call => (
              <div key={call.id} className="bg-white p-3 rounded-lg border border-slate-100 flex items-center justify-between shadow-sm">
                <div>
                  <span className="text-xs font-bold text-slate-800">{call.symbol}</span>
                  <p className="text-[10px] text-slate-400 uppercase font-bold">{call.type}</p>
                </div>
                <div className="text-right">
                  <span className={`text-xs font-bold ${call.status === CallStatus.HIT_TP ? 'text-green-600' : 'text-red-600'}`}>
                    {call.status === CallStatus.HIT_TP ? 'HIT TP' : 'HIT SL'}
                  </span>
                  <p className="text-[10px] text-slate-400">{new Date(call.timestamp).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center bg-slate-50 border border-dashed border-slate-300 rounded-xl text-slate-400 text-xs font-medium">
            Your trade history will appear here once calls are closed.
          </div>
        )}
      </section>
    </div>
  );
};

export default PerformanceView;
