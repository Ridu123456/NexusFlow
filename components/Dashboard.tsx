
import React from 'react';
import { AppView } from '../types';
import { Navigation, Users, MapPin, Mic, Zap, ArrowRight, Shield } from './Icons';

interface DashboardProps {
  onChangeView: (view: AppView) => void;
  user: { name: string } | null;
}

const Dashboard: React.FC<DashboardProps> = ({ onChangeView, user }) => {
  return (
    <div className="p-6 md:p-12 lg:p-20 min-h-full flex flex-col space-y-12 animate-fade-in pb-32">
      {/* Hero Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2.5 px-3 py-1 bg-brand-50 dark:bg-brand-900/20 rounded-full border border-brand-100 dark:border-brand-800 text-[10px] font-black uppercase tracking-[0.2em] text-brand-500">
           <div className="w-1.5 h-1.5 bg-brand-500 rounded-full animate-pulse"></div>
           System Ready
        </div>
        <h2 className="text-4xl md:text-7xl font-display font-black text-slate-900 dark:text-white tracking-tight leading-[0.95]">
          Syncing your grid, <br />
          <span className="text-slate-300 dark:text-slate-600 italic">{user?.name.split(' ')[0] || 'Traveler'}.</span>
        </h2>
      </div>

      {/* Main Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <DashboardCard 
          icon={<MapPin className="w-6 h-6" />}
          title="Smart Routes"
          desc="Optimized multimodal paths tailored to your destination."
          onClick={() => onChangeView(AppView.ROUTES)}
          color="bg-slate-900 dark:bg-slate-800"
        />
        <DashboardCard 
          icon={<Mic className="w-6 h-6" />}
          title="Nexus Oracle"
          desc="AI voice co-pilot for seamless urban transit."
          onClick={() => onChangeView(AppView.ORACLE)}
          color="bg-brand-500"
        />
        <DashboardCard 
          icon={<Users className="w-6 h-6" />}
          title="Commute Sync"
          desc="Share fares and footprints with verified travelers."
          onClick={() => onChangeView(AppView.CONNECT)}
          color="bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-100 dark:border-slate-800 shadow-sm"
          darkIcon
        />
      </div>

      {/* Secondary Status Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 p-8 md:p-12 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-12 items-center">
           <div className="flex-1 space-y-4 text-center md:text-left">
              <h4 className="text-2xl font-display font-black text-slate-900 dark:text-white">Transit Efficiency</h4>
              <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">Your choice of multi-modal transit has saved <strong>₹1,240</strong> and offset <strong>4.2kg</strong> of CO2 this week.</p>
              <button onClick={() => onChangeView(AppView.VISION)} className="inline-flex items-center gap-2 text-brand-500 font-bold text-sm hover:translate-x-1 transition-transform">
                 Explore architecture <ArrowRight className="w-4 h-4" />
              </button>
           </div>
           <div className="w-40 h-40 rounded-full border-8 border-slate-50 dark:border-slate-800 flex items-center justify-center relative shrink-0 shadow-inner">
              <div className="absolute inset-0 rounded-full border-8 border-brand-500 border-t-transparent rotate-[30deg]"></div>
              <span className="text-3xl font-display font-black text-slate-900 dark:text-white">92%</span>
           </div>
        </div>

        <div className="lg:col-span-4 bg-brand-500 rounded-[2.5rem] p-8 md:p-10 text-white flex flex-col justify-between shadow-xl shadow-brand-500/15">
           <Shield className="w-10 h-10 mb-8 opacity-30" />
           <div className="space-y-1">
             <h4 className="text-xl font-display font-black tracking-tight">Reputation Alpha</h4>
             <p className="text-brand-100 text-xs font-medium leading-relaxed opacity-70">Top 5% verified commuter in Mumbai Central network.</p>
           </div>
           <div className="mt-8 pt-6 border-t border-white/10 flex justify-between items-center text-[10px] font-black uppercase tracking-widest opacity-60">
              <span>Security_Verified</span>
              <span>v3.0.4 Stable</span>
           </div>
        </div>
      </div>
    </div>
  );
};

const DashboardCard = ({ icon, title, desc, onClick, color, darkIcon }: any) => (
  <button 
    onClick={onClick}
    className={`p-10 rounded-[2.5rem] text-left transition-all duration-500 group relative overflow-hidden flex flex-col h-80 ${color} ${!color.includes('white') && !color.includes('slate-900') ? 'text-white' : ''}`}
  >
    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-10 shadow-lg group-hover:scale-110 transition-transform ${darkIcon ? 'bg-brand-500/10 text-brand-500' : 'bg-white/10 backdrop-blur-md border border-white/20 text-white'}`}>
      {icon}
    </div>
    <div className="flex-1">
      <h3 className="text-2xl font-display font-black mb-3 tracking-tight">{title}</h3>
      <p className={`text-sm font-medium leading-relaxed opacity-70`}>
        {desc}
      </p>
    </div>
    <div className="mt-auto flex items-center gap-2 text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
       Launch Protocol <ArrowRight className="w-4 h-4" />
    </div>
  </button>
);

export default Dashboard;
