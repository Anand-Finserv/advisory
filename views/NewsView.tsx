import React, { useState, useEffect } from 'react';
import { fetchLatestMarketNews } from '../services/geminiService';
import { Newspaper, Clock, RefreshCw } from 'lucide-react';

const NewsView: React.FC = () => {
  const [newsContent, setNewsContent] = useState<string>("Fetching breaking market headlines...");
  const [loading, setLoading] = useState(true);

  const loadNews = async () => {
    setLoading(true);
    const data = await fetchLatestMarketNews();
    setNewsContent(data);
    setLoading(false);
  };

  useEffect(() => {
    loadNews();
  }, []);

  return (
    <div className="space-y-6">
      <section className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Market Pulse</h2>
          <p className="text-slate-500 text-sm">Real-time headlines from top financial sources.</p>
        </div>
        <button 
          onClick={loadNews}
          className="p-2 bg-white border border-slate-200 rounded-full shadow-sm"
        >
          <RefreshCw className={`w-5 h-5 text-blue-600 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </section>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white p-5 rounded-2xl border border-slate-100 animate-pulse h-32"></div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6">
             <div className="prose prose-sm max-w-none text-slate-700 whitespace-pre-wrap font-medium leading-relaxed">
               {newsContent}
             </div>
          </div>
          <div className="bg-slate-50 p-4 border-t border-slate-200 flex justify-between items-center">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Institutional Research Feed</span>
            <div className="flex items-center text-[10px] text-slate-400 font-medium">
              <Clock className="w-3 h-3 mr-1" />
              Last updated just now
            </div>
          </div>
        </div>
      )}
      
      <div className="p-5 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-200">
        <h4 className="text-white font-bold text-sm mb-1">Expert Commentary Enabled</h4>
        <p className="text-indigo-100 text-[10px]">Our AI is cross-referencing these headlines with internal research to adjust signal volatility levels.</p>
      </div>
    </div>
  );
};

export default NewsView;