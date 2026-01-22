
import React, { useState } from 'react';
import { InvestmentCall, CallType, CallStatus } from '../types';
import { Plus, Trash2, XCircle, CheckCircle, ChevronUp, Loader2, Radio } from 'lucide-react';

interface AdminDashboardProps {
  calls: InvestmentCall[];
  onAdd: (call: Omit<InvestmentCall, 'id'>) => Promise<any>;
  onDelete: (id: string) => Promise<any>;
  onClose: (id: string, status: CallStatus) => Promise<any>;
  onBroadcast: () => Promise<void>;
  marketStatus: string;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ calls, onAdd, onDelete, onClose, onBroadcast, marketStatus }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [newCall, setNewCall] = useState<Partial<InvestmentCall>>({
    symbol: '', type: CallType.BUY, entry: 0, sl: 0, tp: 0, segment: 'EQUITY', analysis: ''
  });

  const handleBroadcast = async () => {
    setIsBroadcasting(true);
    await onBroadcast();
    setIsBroadcasting(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const callData: Omit<InvestmentCall, 'id'> = {
        symbol: newCall.symbol || '',
        type: newCall.type || CallType.BUY,
        entry: Number(newCall.entry) || 0,
        sl: Number(newCall.sl) || 0,
        tp: Number(newCall.tp) || 0,
        cmp: Number(newCall.entry) || 0,
        status: CallStatus.OPEN,
        timestamp: new Date().toISOString(),
        analysis: newCall.analysis || '',
        segment: (newCall.segment as any) || 'EQUITY'
      };
      await onAdd(callData);
      setShowAddForm(false);
      setNewCall({ symbol: '', type: CallType.BUY, entry: 0, sl: 0, tp: 0, segment: 'EQUITY', analysis: '' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <section className="flex justify-between items-center bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Command Center</h2>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1">Broadcast Control Panel</p>
        </div>
        <div className="flex space-x-3">
           <button 
            onClick={handleBroadcast}
            disabled={isBroadcasting}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
              isBroadcasting ? 'bg-slate-100 text-slate-400' : 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700'
            }`}
          >
            {isBroadcasting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Radio className="w-3 h-3" />}
            <span>{isBroadcasting ? 'Syncing...' : 'Broadcast Market'}</span>
          </button>
          <button 
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-slate-900 text-white p-3 rounded-2xl shadow-lg hover:bg-black transition-transform active:scale-95"
          >
            {showAddForm ? <ChevronUp className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
          </button>
        </div>
      </section>

      {showAddForm && (
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-[2rem] border border-blue-100 shadow-2xl space-y-6 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="font-black text-slate-800 tracking-tight uppercase text-xs">Publish Global Research</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Symbol</label>
              <input 
                required
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 outline-none text-slate-900 font-bold" 
                placeholder="NIFTY_AUG_FUT"
                value={newCall.symbol}
                onChange={e => setNewCall({...newCall, symbol: e.target.value.toUpperCase()})}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Segment</label>
              <select 
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-slate-900 font-bold"
                value={newCall.segment}
                onChange={e => setNewCall({...newCall, segment: e.target.value as any})}
              >
                <option value="EQUITY">CASH EQUITY</option>
                <option value="F&O">DERIVATIVES (F&O)</option>
                <option value="COMMODITY">COMMODITY</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Action</label>
              <div className="flex bg-slate-50 p-1.5 rounded-2xl border border-slate-200">
                <button 
                  type="button" onClick={() => setNewCall({...newCall, type: CallType.BUY})}
                  className={`flex-1 py-3 rounded-xl text-xs font-black transition-all ${newCall.type === CallType.BUY ? 'bg-green-500 text-white shadow-md' : 'text-slate-400'}`}
                >BUY</button>
                <button 
                  type="button" onClick={() => setNewCall({...newCall, type: CallType.SELL})}
                  className={`flex-1 py-3 rounded-xl text-xs font-black transition-all ${newCall.type === CallType.SELL ? 'bg-red-500 text-white shadow-md' : 'text-slate-400'}`}
                >SELL</button>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Entry Level</label>
              <input type="number" step="0.05" required className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold" value={newCall.entry || ''} onChange={e => setNewCall({...newCall, entry: Number(e.target.value)})} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Stop Loss</label>
              <input type="number" step="0.05" required className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-rose-600" value={newCall.sl || ''} onChange={e => setNewCall({...newCall, sl: Number(e.target.value)})} />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Take Profit</label>
              <input type="number" step="0.05" required className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-emerald-600" value={newCall.tp || ''} onChange={e => setNewCall({...newCall, tp: Number(e.target.value)})} />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Institutional Note</label>
            <textarea className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none h-24 text-sm font-medium" placeholder="Describe the technical setup or news trigger..." value={newCall.analysis} onChange={e => setNewCall({...newCall, analysis: e.target.value})} />
          </div>

          <button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-blue-500/30 hover:bg-blue-700 transition-all active:scale-[0.98] disabled:opacity-50">
            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : <span>Blast Research to All Terminals</span>}
          </button>
        </form>
      )}

      {/* Call Management List */}
      <section>
        <div className="flex justify-between items-center mb-4 px-1">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Terminal Sync</h3>
          <span className="text-[9px] font-bold text-slate-300 italic">Connected to investment-app-26c11</span>
        </div>
        <div className="space-y-3">
          {calls.map(call => (
            <div key={call.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between hover:border-blue-200 transition-colors">
              <div>
                <div className="flex items-center space-x-3">
                  <span className="font-black text-slate-800 tracking-tight uppercase">{call.symbol}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-lg font-black tracking-widest ${call.type === 'BUY' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {call.type}
                  </span>
                </div>
                <div className="flex items-center mt-1 space-x-2">
                   <div className={`w-1.5 h-1.5 rounded-full ${call.status === CallStatus.OPEN ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
                   <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Status: {call.status}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {call.status === CallStatus.OPEN && (
                  <>
                    <button onClick={() => onClose(call.id, CallStatus.HIT_TP)} className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100 hover:bg-emerald-100 transition-colors">
                      <CheckCircle className="w-5 h-5" />
                    </button>
                    <button onClick={() => onClose(call.id, CallStatus.HIT_SL)} className="p-2.5 bg-rose-50 text-rose-600 rounded-xl border border-rose-100 hover:bg-rose-100 transition-colors">
                      <XCircle className="w-5 h-5" />
                    </button>
                  </>
                )}
                <button onClick={() => onDelete(call.id)} className="p-2.5 bg-slate-50 text-slate-400 rounded-xl border border-slate-200 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-100 transition-colors">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
          {calls.length === 0 && (
            <div className="py-20 text-center bg-slate-50 rounded-[2rem] border border-dashed border-slate-200">
               <p className="text-slate-400 text-xs font-black uppercase tracking-widest">Global Vault is Empty</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
