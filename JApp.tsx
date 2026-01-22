import React, { useState, useEffect, useRef } from 'react';
import { UserProfile, InvestmentCall, CallStatus, MarketIndex, StockMover } from './types';
import { MOCK_INDICES } from './constants';
import Layout from './components/Layout';
import Dashboard from './views/Dashboard';
import CallsView from './views/CallsView';
import NewsView from './views/NewsView';
import PerformanceView from './views/PerformanceView';
import AnalysisView from './views/AnalysisView';
import ProfileView from './views/ProfileView';
import AdminDashboard from './views/AdminDashboard';
import LoginView from './views/LoginView';
import { requestNotificationPermission, notifyNewSignal } from './services/notificationService';
import { fetchLiveMarketData, fetchBatchCMPs, getMarketInsights, fetchLatestMarketNews, fetchTopMovers } from './services/geminiService';
import { 
  subscribeToCalls, 
  syncUser, 
  addCall, 
  deleteCall, 
  updateCallStatus, 
  subscribeToMarketMetadata, 
  updateGlobalMarketData,
  bulkUpdateCMPs
} from './services/firebaseService';

const App: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [calls, setCalls] = useState<InvestmentCall[]>([]);
  const [indices, setIndices] = useState<MarketIndex[]>(MOCK_INDICES);
  const [movers, setMovers] = useState<StockMover[]>([]);
  const [marketInsights, setMarketInsights] = useState("Synchronizing with global research...");
  const [marketStatus, setMarketStatus] = useState<string>("SYNCING...");
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [currentView, setCurrentView] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(true);
  
  const prevCallsCount = useRef<number>(0);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('af_user');
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        if (parsedUser.role === 'ADMIN') setIsAdmin(true);
        requestNotificationPermission();
      }
    } catch (e) {
      console.warn("Local storage parse error:", e);
    }

    const unsubCalls = subscribeToCalls((fetchedCalls) => {
      setCalls(fetchedCalls);
      if (fetchedCalls.length > prevCallsCount.current && prevCallsCount.current > 0) {
        const latestCall = fetchedCalls[0];
        if (latestCall.status === CallStatus.OPEN) {
          notifyNewSignal(latestCall.symbol, latestCall.type, latestCall.entry);
        }
      }
      prevCallsCount.current = fetchedCalls.length;
      setIsLoading(false);
    });

    const unsubMeta = subscribeToMarketMetadata((data) => {
      if (data) {
        if (data.indices) setIndices(data.indices);
        if (data.insights) setMarketInsights(data.insights);
        if (data.updatedAt) setLastUpdated(data.updatedAt);
        if (data.movers) setMovers(data.movers);
      }
      setMarketStatus(isMarketOpen() ? "MARKET LIVE" : "MARKET CLOSED");
    });

    const loadingTimeout = setTimeout(() => setIsLoading(false), 2000);

    return () => {
      unsubCalls();
      unsubMeta();
      clearTimeout(loadingTimeout);
    };
  }, []);

  const isMarketOpen = () => {
    const now = new Date();
    const istOffset = 5.5 * 60 * 60 * 1000;
    const istDate = new Date(now.getTime() + istOffset);
    const day = istDate.getUTCDay(); 
    const hours = istDate.getUTCHours();
    const timeInMinutes = hours * 60 + istDate.getUTCMinutes();
    const isWeekday = day >= 1 && day <= 5;
    const isWorkingHours = timeInMinutes >= (9 * 60 + 15) && timeInMinutes <= (15 * 60 + 30);
    return isWeekday && isWorkingHours;
  };

  /**
   * Complex operation that refreshes Indices, Signal CMPs, Market Movers and Market Sentiment
   */
  const broadcastMarketRefresh = async () => {
    setMarketStatus("BROADCASTING...");
    try {
      // 1. Refresh Indices
      const indexText = await fetchLiveMarketData();
      let newIndices = [...indices];

      if (indexText && indexText !== "RATE_LIMIT_ACTIVE" && indexText !== "ERROR_NO_KEY") {
        const pattern = /\[NAME:\s*(.*?)\s*\|\s*PRICE:\s*([\d.]+)\s*\|\s*CHANGE:\s*([-?\d.]+)\s*\|\s*PERCENT:\s*([-?\d.]+)/g;
        let match;
        while ((match = pattern.exec(indexText)) !== null) {
          const [_, name, price, change, percent] = match;
          const idxIndex = newIndices.findIndex(i => i.name.toUpperCase().includes(name.trim().toUpperCase()));
          if (idxIndex !== -1) {
            newIndices[idxIndex] = {
              ...newIndices[idxIndex],
              value: parseFloat(price),
              change: parseFloat(change),
              changePercent: parseFloat(percent)
            };
          }
        }
      }

      // 2. Refresh Top Movers
      let newMovers: StockMover[] = [];
      const moversText = await fetchTopMovers();
      if (moversText) {
        const moverPattern = /\[SYMBOL:\s*(.*?)\s*\|\s*PRICE:\s*([\d.]+)\s*\|\s*PERCENT:\s*([-?\d.]+)\s*\|\s*TYPE:\s*(.*?)\]/g;
        let mMatch;
        while ((mMatch = moverPattern.exec(moversText)) !== null) {
          const [_, symbol, price, percent, type] = mMatch;
          newMovers.push({
            symbol: symbol.trim(),
            price: parseFloat(price),
            changePercent: parseFloat(percent),
            type: type.trim().toUpperCase() as 'GAINER' | 'LOSER'
          });
        }
      }

      // 3. Refresh CMPs for all active calls
      const activeCalls = calls.filter(c => c.status === CallStatus.OPEN);
      if (activeCalls.length > 0) {
        const symbols = activeCalls.map(c => c.symbol);
        const cmpDataString = await fetchBatchCMPs(symbols);
        if (cmpDataString) {
          const cmpPattern = /\[(.*?):\s*([\d.]+)\]/g;
          let cmpMatch;
          const cmpUpdates: { id: string, cmp: number }[] = [];
          while ((cmpMatch = cmpPattern.exec(cmpDataString)) !== null) {
            const [_, symbol, price] = cmpMatch;
            const targetCall = activeCalls.find(c => c.symbol.toUpperCase() === symbol.trim().toUpperCase());
            if (targetCall) {
              cmpUpdates.push({ id: targetCall.id, cmp: parseFloat(price) });
            }
          }
          if (cmpUpdates.length > 0) {
            await bulkUpdateCMPs(cmpUpdates);
          }
        }
      }

      // 4. Refresh News & Insights
      const newsText = await fetchLatestMarketNews();
      const aiInsight = await getMarketInsights(newsText);
      
      // 5. Update Global Metadata
      await updateGlobalMarketData(newIndices, aiInsight, newMovers);
      setMarketStatus(isMarketOpen() ? "MARKET LIVE" : "MARKET CLOSED");
    } catch (e) {
      console.error("Broadcast failed:", e);
      setMarketStatus("SYNC FAILED");
    }
  };

  const handleLogin = async (name: string, mobile: string, asAdmin = false) => {
    const userData: UserProfile = {
      fullName: name, 
      mobile: mobile, 
      clientId: `AF-${Math.floor(10000 + Math.random() * 90000)}`,
      role: asAdmin ? 'ADMIN' : 'CLIENT', 
      joinedAt: new Date().toISOString()
    };
    
    try {
      const synced = await syncUser(userData);
      setUser(synced);
      setIsAdmin(asAdmin);
      localStorage.setItem('af_user', JSON.stringify(synced));
    } catch (e) {
      console.error("Login sync failed:", e);
      setUser(userData);
      localStorage.setItem('af_user', JSON.stringify(userData));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('af_user');
    setUser(null);
    setIsAdmin(false);
    setCurrentView('dashboard');
  };

  if (isLoading) return (
    <div className="h-screen bg-slate-900 flex flex-col items-center justify-center p-12">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500 mb-6"></div>
      <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] text-center">Terminal Initialization</p>
    </div>
  );

  if (!user) return <LoginView onLogin={handleLogin} />;

  const renderView = () => {
    if (isAdmin && currentView === 'admin') {
      return <AdminDashboard 
                calls={calls} onAdd={addCall} onDelete={deleteCall} 
                onClose={updateCallStatus} onBroadcast={broadcastMarketRefresh} 
                marketStatus={marketStatus}
              />;
    }
    switch (currentView) {
      case 'dashboard': return <Dashboard indices={indices} calls={calls} movers={movers} marketStatus={marketStatus} insight={marketInsights} lastUpdated={lastUpdated} />;
      case 'calls': return <CallsView calls={calls} />;
      case 'news': return <NewsView />;
      case 'performance': return <PerformanceView calls={calls} />;
      case 'analysis': return <AnalysisView calls={calls} />;
      case 'profile': return <ProfileView user={user} onLogout={handleLogout} />;
      default: return <Dashboard indices={indices} calls={calls} movers={movers} marketStatus={marketStatus} insight={marketInsights} lastUpdated={lastUpdated} />;
    }
  };

  return (
    <Layout indices={indices} movers={movers} currentView={currentView} setCurrentView={setCurrentView} isAdmin={isAdmin}>
      {renderView()}
    </Layout>
  );
};

export default App;