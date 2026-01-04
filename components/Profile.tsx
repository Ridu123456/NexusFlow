
import React, { useState, useEffect } from 'react';
import { ChevronLeft, MapPin, Award, Shield, IndianRupee, ArrowRight, Calendar, Users, Zap, Navigation } from './Icons';
import { storageService } from '../services/storageService';
import { ScheduledTrip } from '../types';

interface ProfileProps {
  user: { name: string; email: string };
  onBack: () => void;
  onLogout: () => void;
  onNavigateToPlan?: () => void;
}

const Profile: React.FC<ProfileProps> = ({ user, onBack, onLogout, onNavigateToPlan }) => {
  const [scheduledTrips, setScheduledTrips] = useState<ScheduledTrip[]>([]);

  useEffect(() => {
    setScheduledTrips(storageService.getTrips());
  }, []);

  const handleCancelTrip = (id: string) => {
    storageService.deleteTrip(id);
    setScheduledTrips(storageService.getTrips());
  };

  return (
    <div className="p-6 md:p-12 lg:p-16 min-h-full flex flex-col max-w-7xl mx-auto animate-fade-in space-y-12 pb-32">
      {/* Navigation Header */}
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-3 p-2 pr-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
          <div className="w-10 h-10 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-brand-500">
            <ChevronLeft className="w-5 h-5" />
          </div>
          <span className="font-bold text-sm text-slate-700 dark:text-slate-200">Return</span>
        </button>
        <button onClick={onLogout} className="text-slate-400 hover:text-red-500 font-bold text-xs uppercase tracking-widest transition-colors">
          End Session
        </button>
      </div>

      {/* Profile Identity Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 p-8 md:p-12 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center gap-10">
          <div className="relative shrink-0">
            <div className="w-32 h-32 md:w-44 md:h-44 bg-brand-500 rounded-[2.5rem] flex items-center justify-center text-5xl md:text-7xl font-display font-black text-white shadow-2xl shadow-brand-500/20">
              {user.name.charAt(0)}
            </div>
            <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center border-4 border-white dark:border-slate-900 text-white shadow-lg">
              <Shield className="w-6 h-6" />
            </div>
          </div>
          <div className="text-center md:text-left space-y-2">
            <div className="inline-flex px-3 py-1 bg-brand-50 dark:bg-brand-900/30 rounded-full text-[10px] font-black uppercase tracking-widest text-brand-600 dark:text-brand-300 mb-2">
              Verified Commuter
            </div>
            <h2 className="text-4xl md:text-6xl font-display font-black text-slate-900 dark:text-white tracking-tight">{user.name}</h2>
            <p className="text-slate-400 dark:text-slate-500 font-medium text-lg">{user.email}</p>
          </div>
        </div>

        {/* Reputation Score */}
        <div className="lg:col-span-4 bg-brand-500 rounded-[3rem] p-10 text-white flex flex-col justify-between h-full min-h-[300px] shadow-xl shadow-brand-500/10">
          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Network Trust</h4>
          <div>
            <div className="text-7xl font-display font-black tracking-tighter">4.9</div>
            <div className="mt-4 flex items-center gap-2">
              <div className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full w-[94%] bg-white rounded-full"></div>
              </div>
              <span className="text-[10px] font-black uppercase">Top 1%</span>
            </div>
          </div>
          <p className="text-brand-100 text-sm font-medium mt-6 leading-relaxed">
            Your punctuality and community ratings are exceptional this month.
          </p>
        </div>
      </div>

      {/* Impact Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={<Zap className="w-5 h-5" />} 
          label="Efficiency" 
          value="92%" 
          sub="Multi-modal use" 
          color="bg-slate-900 dark:bg-slate-800 text-white" 
        />
        <StatCard 
          icon={<IndianRupee className="w-5 h-5" />} 
          label="Fare Saved" 
          value="₹4,250" 
          sub="Sync group split" 
          color="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800" 
        />
        <StatCard 
          icon={<Navigation className="w-5 h-5" />} 
          label="CO2 Offset" 
          value="24.8kg" 
          sub="Green transit" 
          color="bg-emerald-500 text-white" 
        />
        <StatCard 
          icon={<Award className="w-5 h-5" />} 
          label="Tokens" 
          value="1,240" 
          sub="Redeemable" 
          color="bg-indigo-500 text-white" 
        />
      </div>

      {/* Upcoming Syncs / History Section */}
      <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-8 md:p-12 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between">
          <h3 className="text-2xl font-display font-black text-slate-900 dark:text-white">Scheduled Syncs</h3>
          <Calendar className="w-6 h-6 text-slate-300" />
        </div>
        <div className="p-8 md:p-12">
          {scheduledTrips.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {scheduledTrips.map((trip) => (
                <div key={trip.id} className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-transparent hover:border-brand-500/20 transition-all flex justify-between items-start group">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white dark:bg-slate-800 rounded-xl shadow-sm flex items-center justify-center text-brand-500">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <div>
                        <h5 className="font-bold text-slate-900 dark:text-white leading-tight">{trip.destination}</h5>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{trip.date} @ {trip.time}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                       <span className="px-3 py-1 bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-300 rounded-lg text-[9px] font-black uppercase tracking-widest">Active Sync</span>
                       <span className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-400 rounded-lg text-[9px] font-black uppercase tracking-widest">{trip.groupSize} Users</span>
                    </div>
                  </div>
                  <button onClick={() => handleCancelTrip(trip.id)} className="p-2 text-slate-300 hover:text-red-500 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 flex flex-col items-center">
              <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-[2rem] flex items-center justify-center mb-6 text-slate-200 dark:text-slate-700">
                <Calendar className="w-10 h-10" />
              </div>
              <p className="text-slate-400 font-bold mb-8">No future syncs found in your grid.</p>
              <button 
                onClick={() => onNavigateToPlan ? onNavigateToPlan() : onBack()} 
                className="inline-flex items-center gap-3 bg-brand-500 text-white px-8 py-4 rounded-2xl font-bold hover:bg-brand-600 transition-all shadow-xl shadow-brand-500/10 active:scale-95"
              >
                Plan New Journey <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, sub, color }: any) => (
  <div className={`p-8 rounded-[2.5rem] flex flex-col justify-between min-h-[200px] shadow-sm transition-transform hover:-translate-y-1 ${color}`}>
    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-md">
      {icon}
    </div>
    <div>
      <div className="text-3xl font-display font-black tracking-tight">{value}</div>
      <div className="text-[10px] font-black uppercase tracking-[0.2em] mt-1 opacity-60">{label}</div>
      <div className="text-[10px] font-medium opacity-40 italic mt-2">{sub}</div>
    </div>
  </div>
);

export default Profile;
