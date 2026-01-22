
import React, { useState } from 'react';
import { InvestmentCall, CallStatus } from '../types';
import CallCard from '../components/CallCard';
import { Search, SlidersHorizontal } from 'lucide-react';

interface CallsViewProps {
  calls: InvestmentCall[];
}

const CallsView: React.FC<CallsViewProps> = ({ calls }) => {
  const [filter, setFilter] = useState<'ALL' | 'OPEN' | 'CLOSED'>('OPEN');
  const [search, setSearch] = useState('');

  const filteredCalls = calls.filter(c => {
    const matchesSearch = c.symbol.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'ALL' ? true : (filter === 'OPEN' ? c.status === CallStatus.OPEN : c.status !== CallStatus.OPEN);
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-2xl font-bold text-slate-800">Investment Calls</h2>
        <p className="text-slate-500 text-sm">Actionable research levels by our experts.</p>
      </section>

      {/* Search and Filters */}
      <div className="flex flex-col space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search stock symbol..."
            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none shadow-sm text-slate-900 font-medium"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <div className="flex space-x-2 overflow-x-auto pb-2 custom-scrollbar">
          {(['OPEN', 'CLOSED', 'ALL'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${
                filter === f 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'bg-white text-slate-500 border border-slate-200'
              }`}
            >
              {f === 'OPEN' ? 'Active' : f === 'CLOSED' ? 'Completed' : 'All Signals'}
            </button>
          ))}
        </div>
      </div>

      {/* Calls List */}
      <div className="space-y-4">
        {filteredCalls.map(call => (
          <CallCard key={call.id} call={call} />
        ))}
        {filteredCalls.length === 0 && (
          <div className="text-center py-20">
            <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="text-slate-400 w-8 h-8" />
            </div>
            <h3 className="text-slate-600 font-bold">No signals found</h3>
            <p className="text-slate-400 text-sm">Try adjusting your filters or search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CallsView;
