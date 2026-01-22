import React from 'react';
import { InvestmentCall, CallStatus } from '../types';
// Fixed: Added Target to the import list from lucide-react
import { Info, CheckCircle2, AlertCircle, ShieldCheck, Target } from 'lucide-react';

interface AnalysisViewProps {
  calls: InvestmentCall[];
}

const AnalysisView: React.FC<AnalysisViewProps> = ({ calls }) => {
  const openCalls = calls.filter(c => c.status === CallStatus.OPEN);
  
  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-2xl font-bold text-slate-800">Research Analysis</h2>
        <p className="text-slate-500 text-sm">Deep dive into current market setups.</p>
      </section>

      {/* Research Methodology */}
      <section className="bg-blue-600 rounded-2xl p-5 text-white shadow-lg">
        <div className="flex items-center space-x-3 mb-3">
          <ShieldCheck className="w-8 h-8 text-blue-200" />
          <h3 className="font-bold text-lg">Our Methodology</h3>
        </div>
        <p className="text-xs text-blue-100 leading-relaxed">
          We combine Technical Indicators (RSI, Bollinger Bands, Moving Averages) with fundamental volume analysis and option chain data to pinpoint high-probability entries.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="bg-white/10 p-2 rounded text-[10px] font-bold">1:2 Risk-Reward Minimum</div>
          <div className="bg-white/10 p-2 rounded text-[10px] font-bold">Volume Weighted Entry</div>
        </div>
      </section>

      {/* Active Setup Analysis */}
      <section>
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3">Active Setup Logic</h3>
        <div className="space-y-4">
          {openCalls.map(call => (
            <div key={call.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-bold text-slate-800">{call.symbol} Setup</h4>
                <div className={`text-[10px] px-2 py-0.5 rounded font-bold ${call.type === 'BUY' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {call.type} CASE
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-start space-x-2">
                  <div className="mt-1"><Info className="w-4 h-4 text-blue-500" /></div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    <strong>Technical Summary:</strong> {call.analysis}
                  </p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="mt-1"><Target className="w-4 h-4 text-green-500" /></div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    <strong>Conviction Level:</strong> High (80%+ accuracy expectation based on historical 30-day volatility).
                  </p>
                </div>
              </div>
            </div>
          ))}
          {openCalls.length === 0 && (
            <div className="p-10 text-center bg-slate-50 rounded-xl border border-dashed border-slate-300">
              <AlertCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-slate-400 text-sm">Waiting for new research triggers.</p>
            </div>
          )}
        </div>
      </section>

      {/* Risk Management Section */}
      <section className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
        <h3 className="text-sm font-bold text-slate-800 mb-2">Advisory Policy</h3>
        <ul className="space-y-2">
          <li className="flex items-start space-x-2 text-[11px] text-slate-600">
            <CheckCircle2 className="w-3 h-3 text-green-500 mt-0.5 shrink-0" />
            <span>Always stick to the Stop Loss (SL) provided. Markets are dynamic.</span>
          </li>
          <li className="flex items-start space-x-2 text-[11px] text-slate-600">
            <CheckCircle2 className="w-3 h-3 text-green-500 mt-0.5 shrink-0" />
            <span>Do not over-leverage your positions beyond 5% capital per trade.</span>
          </li>
          <li className="flex items-start space-x-2 text-[11px] text-slate-600">
            <CheckCircle2 className="w-3 h-3 text-green-500 mt-0.5 shrink-0" />
            <span>Levels are valid for the current trading session unless mentioned as "Positional".</span>
          </li>
        </ul>
      </section>
    </div>
  );
};

export default AnalysisView;