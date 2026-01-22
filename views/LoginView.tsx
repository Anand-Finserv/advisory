
import React, { useState } from 'react';
import { TrendingUp, ShieldAlert, User, Smartphone, ChevronRight, ArrowUpRight } from 'lucide-react';
import { ADMIN_PASSWORD } from '../constants';

interface LoginViewProps {
  onLogin: (name: string, mobile: string, asAdmin: boolean) => void;
}

const CompanyLogoLarge = () => (
  <div className="relative flex items-center justify-center w-24 h-24 bg-blue-600 rounded-[2rem] shadow-2xl shadow-blue-500/30 rotate-3 group-hover:rotate-0 transition-transform duration-500">
    <div className="flex items-baseline -space-x-2 translate-y-1">
      <span className="text-white font-black text-5xl italic tracking-tighter">A</span>
      <span className="text-white/70 font-black text-5xl italic tracking-tighter">F</span>
    </div>
    <div className="absolute -top-2 -right-2 bg-emerald-500 rounded-full p-2 border-4 border-slate-900 group-hover:scale-110 transition-transform">
      <ArrowUpRight className="text-white w-6 h-6 stroke-[4px]" />
    </div>
  </div>
);

const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<'CLIENT' | 'ADMIN'>('CLIENT');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (mode === 'ADMIN') {
      if (password === ADMIN_PASSWORD) {
        onLogin('Administrator', '0000000000', true);
      } else {
        setError('Invalid admin password');
      }
    } else {
      if (name.length < 3) {
        setError('Please enter your full name');
        return;
      }
      if (mobile.length < 10) {
        setError('Please enter a valid mobile number');
        return;
      }
      onLogin(name, mobile, false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md group">
        {/* Logo Section */}
        <div className="text-center mb-10 animate-in fade-in slide-in-from-bottom-10 duration-700">
          <div className="flex justify-center mb-6">
            <CompanyLogoLarge />
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight mb-2">ANAND FINSERV</h1>
          <p className="text-slate-400 font-medium">Premium Investment Advisory</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-[2rem] p-8 shadow-2xl shadow-black/50 overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4">
             <button 
              onClick={() => {
                setMode(mode === 'CLIENT' ? 'ADMIN' : 'CLIENT');
                setError('');
              }}
              className="text-[10px] font-black text-slate-300 uppercase tracking-widest hover:text-blue-500 transition-colors"
            >
              {mode === 'CLIENT' ? 'ADMIN LOGIN' : 'BACK TO CLIENT'}
            </button>
          </div>

          <div className="flex items-center space-x-2 mb-8">
            <div className={`w-2 h-8 rounded-full ${mode === 'CLIENT' ? 'bg-blue-600' : 'bg-red-600'}`} />
            <h2 className="text-2xl font-bold text-slate-800">
              {mode === 'CLIENT' ? 'Welcome Back' : 'Secure Admin Portal'}
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {mode === 'CLIENT' ? (
              <>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                    <input 
                      required
                      type="text" 
                      placeholder="Enter your name"
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-semibold text-slate-900"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Mobile Number</label>
                  <div className="relative">
                    <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                    <input 
                      required
                      type="tel" 
                      placeholder="10-digit number"
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-semibold text-slate-900"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                    />
                  </div>
                </div>
              </>
            ) : (
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Admin Password</label>
                <div className="relative">
                  <ShieldAlert className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                  <input 
                    required
                    type="password" 
                    placeholder="Enter security key"
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-red-100 focus:border-red-500 outline-none transition-all font-semibold text-slate-900"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
            )}

            {error && <p className="text-red-500 text-xs font-bold text-center animate-pulse">{error}</p>}

            <button 
              type="submit"
              className={`w-full group flex items-center justify-center space-x-2 py-4 rounded-2xl text-white font-bold shadow-xl transition-all active:scale-95 ${
                mode === 'CLIENT' ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/25' : 'bg-slate-900 hover:bg-black'
              }`}
            >
              <span>{mode === 'CLIENT' ? 'Login Now' : 'Access Dashboard'}</span>
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-8 text-center border-t border-slate-100 pt-6">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Research-Backed Advisory</p>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center text-slate-500 text-xs flex flex-col space-y-2">
          <p>© 2024 Anand Finserv Advisory. SEBI Registered Research Analyst</p>
          <div className="flex justify-center space-x-4">
            <a href="#" className="hover:text-blue-400">Terms</a>
            <a href="#" className="hover:text-blue-400">Privacy Policy</a>
            <a href="#" className="hover:text-blue-400">Disclaimer</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginView;
