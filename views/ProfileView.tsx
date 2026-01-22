
import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { LogOut, User, Phone, Hash, Calendar, ShieldCheck, BellRing, Settings, Server, Cpu, CheckCircle, XCircle } from 'lucide-react';
import { requestNotificationPermission } from '../services/notificationService';
import { isApiKeyPresent, isCoolingDown } from '../services/geminiService';

interface ProfileViewProps {
  user: UserProfile;
  onLogout: () => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ user, onLogout }) => {
  const [notifPermission, setNotifPermission] = useState<NotificationPermission>(
    typeof Notification !== 'undefined' ? Notification.permission : 'denied'
  );

  const handleEnableNotifs = async () => {
    const perm = await requestNotificationPermission();
    setNotifPermission(perm);
  };

  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-2xl font-bold text-slate-800">My Profile</h2>
        <p className="text-slate-500 text-sm">Manage your investment account.</p>
      </section>

      {/* Profile Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center">
        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-md">
          <User className="w-10 h-10 text-blue-600" />
        </div>
        <h3 className="text-xl font-bold text-slate-800">{user.fullName}</h3>
        <p className="text-xs font-bold text-blue-600 bg-blue-50 inline-block px-3 py-1 rounded-full mt-2">
          {user.role}
        </p>
      </div>

      {/* System Health Diagnostics */}
      <div className="bg-slate-900 rounded-[2rem] p-6 text-white overflow-hidden relative border border-white/5 shadow-2xl">
         <div className="flex items-center space-x-3 mb-6">
            <Settings className="w-5 h-5 text-blue-500" />
            <h4 className="text-sm font-black uppercase tracking-widest">System Health</h4>
         </div>
         
         <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
               <div className="flex items-center space-x-3">
                  <Cpu className="w-4 h-4 text-slate-400" />
                  <span className="text-[11px] font-bold text-slate-300">AI Intelligence Engine</span>
               </div>
               {isApiKeyPresent() ? (
                  <div className="flex items-center space-x-1.5">
                     <span className="text-[9px] font-black text-emerald-500 uppercase">Configured</span>
                     <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                  </div>
               ) : (
                  <div className="flex items-center space-x-1.5">
                     <span className="text-[9px] font-black text-rose-500 uppercase">Key Missing</span>
                     <XCircle className="w-3.5 h-3.5 text-rose-500" />
                  </div>
               )}
            </div>

            <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
               <div className="flex items-center space-x-3">
                  <Server className="w-4 h-4 text-slate-400" />
                  <span className="text-[11px] font-bold text-slate-300">Database Connection</span>
               </div>
               <div className="flex items-center space-x-1.5">
                  <span className="text-[9px] font-black text-emerald-500 uppercase">Live (Firebase)</span>
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
               </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
               <div className="flex items-center space-x-3">
                  <BellRing className="w-4 h-4 text-slate-400" />
                  <span className="text-[11px] font-bold text-slate-300">Quota Status</span>
               </div>
               {isCoolingDown() ? (
                  <span className="text-[9px] font-black text-amber-500 uppercase bg-amber-500/10 px-2 py-0.5 rounded">Cooldown Active</span>
               ) : (
                  <span className="text-[9px] font-black text-emerald-500 uppercase bg-emerald-500/10 px-2 py-0.5 rounded">Quota Available</span>
               )}
            </div>
         </div>
         
         {!isApiKeyPresent() && (
            <div className="mt-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl">
               <p className="text-[10px] text-rose-300 leading-relaxed font-bold italic">
                 ACTION REQUIRED: API_KEY is missing in your Vercel Environment Variables. The AI features will not work until this is added.
               </p>
            </div>
         )}
      </div>

      {/* Details List */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-100 flex items-center space-x-4">
          <Hash className="w-5 h-5 text-slate-400" />
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase">Unique Client ID</p>
            <p className="text-sm font-bold text-slate-800">{user.clientId}</p>
          </div>
        </div>
        <div className="p-4 border-b border-slate-100 flex items-center space-x-4">
          <Phone className="w-5 h-5 text-slate-400" />
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase">Mobile Number</p>
            <p className="text-sm font-bold text-slate-800">{user.mobile}</p>
          </div>
        </div>
        <div className="p-4 border-b border-slate-100 flex items-center space-x-4">
          <Calendar className="w-5 h-5 text-slate-400" />
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase">Member Since</p>
            <p className="text-sm font-bold text-slate-800">{new Date(user.joinedAt).toLocaleDateString()}</p>
          </div>
        </div>
        <div className="p-4 flex items-center space-x-4">
          <ShieldCheck className="w-5 h-5 text-green-500" />
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase">Status</p>
            <p className="text-sm font-bold text-green-600">KYC Verified</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <button 
          onClick={onLogout}
          className="w-full bg-red-50 text-red-600 py-4 rounded-2xl font-bold text-sm border border-red-100 flex items-center justify-center space-x-2 hover:bg-red-100 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout Account</span>
        </button>
      </div>

      <div className="text-center">
        <p className="text-[10px] text-slate-400">Version 2.1.0 (Cloud Sync Engine)</p>
      </div>
    </div>
  );
};

export default ProfileView;
