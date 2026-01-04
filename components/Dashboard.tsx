
import React from 'react';
import { AppView } from '../types';
import { Navigation, Users, MapPin, Calendar, ArrowRight, Clock } from './Icons';

interface DashboardProps {
  onChangeView: (view: AppView) => void;
  user: { name: string } | null;
}

const Dashboard: React.FC<DashboardProps> = ({ onChangeView, user }) => {
  return (
    <div className="p-6 md:p-12 min-h-full flex flex-col slide-up max-w-7xl mx-auto space-y-16 pb-24">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl md:text-5xl font-display font-extrabold text-urban-900 tracking-tight leading-tight">
            Syncing your city,<br />
            <span className="text-urban-indigo">{user ? user.name.split(' ')[0] : 'Traveler'}.</span>
          </h2>
          <p className="text-slate-500 mt-4 text-lg font-medium max-w-md">
            The next generation of urban mobility. Optimize, coordinate, and save.
          </p>
        </div>
        
        {/* Only show stats if logged in */}
        {user && (
          <div className="flex gap-3">
             <div className="px-5 py-3 bg-white rounded-2xl shadow-sm border border-slate-100">
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Reputation</div>
                <div className="text-xl font-bold text-urban-indigo">4.9/5</div>
             </div>
             <div className="px-5 py-3 bg-white rounded-2xl shadow-sm border border-slate-100">
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">CO2 Saved</div>
                <div className="text-xl font-bold text-urban-emerald">12.4kg</div>
             </div>
          </div>
        )}
      </div>

      {/* Main Action Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        
        {/* Optimized Routes Card */}
        <button
          onClick={() => onChangeView(AppView.ROUTES)}
          className="group relative overflow-hidden bg-urban-900 p-8 rounded-[2.8rem] shadow-2xl text-left transition-all duration-500 hover:shadow-indigo-500/25 hover:-translate-y-2 flex flex-col justify-between min-h-[360px]"
        >
          <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/20 blur-[60px] -mr-24 -mt-24"></div>
          <div className="relative z-10">
            <div className="w-14 h-14 bg-indigo-500/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-indigo-400 mb-8 border border-white/5">
              <Navigation className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-display font-bold text-white mb-3">Smart Routes</h3>
            <p className="text-slate-400 text-base leading-relaxed">Multimode paths designed for peak speed, cost efficiency, and travel comfort.</p>
          </div>
          <div className="relative z-10 mt-auto flex items-center text-indigo-400 font-bold group-hover:translate-x-2 transition-transform">
            Start Journey <ArrowRight className="ml-2 w-5 h-5" />
          </div>
        </button>

        {/* Plan Ahead Card */}
        <button
          onClick={() => onChangeView(AppView.PLAN_AHEAD)}
          className="group relative overflow-hidden bg-urban-900 p-8 rounded-[2.8rem] shadow-2xl text-left transition-all duration-500 hover:shadow-violet-500/25 hover:-translate-y-2 flex flex-col justify-between min-h-[360px]"
        >
          <div className="absolute top-0 right-0 w-48 h-48 bg-violet-600/20 blur-[60px] -mr-24 -mt-24"></div>
          <div className="relative z-10">
            <div className="w-14 h-14 bg-violet-500/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-violet-400 mb-8 border border-white/5">
              <Calendar className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-display font-bold text-white mb-3">Plan Ahead</h3>
            <p className="text-slate-400 text-base leading-relaxed">Schedule future crossings and unlock high-probability splitting with verified partners.</p>
          </div>
          <div className="relative z-10 mt-auto flex items-center text-violet-400 font-bold group-hover:translate-x-2 transition-transform">
            View Calendar <ArrowRight className="ml-2 w-5 h-5" />
          </div>
        </button>

        {/* Sync & Save Card */}
        <button
          onClick={() => onChangeView(AppView.CONNECT)}
          className="group relative overflow-hidden bg-urban-900 p-8 rounded-[2.8rem] shadow-2xl text-left transition-all duration-500 hover:shadow-emerald-500/25 hover:-translate-y-2 flex flex-col justify-between min-h-[360px] md:col-span-2 lg:col-span-1"
        >
          <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-600/20 blur-[60px] -mr-24 -mt-24"></div>
          <div className="relative z-10">
            <div className="w-14 h-14 bg-emerald-500/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-emerald-400 mb-8 border border-white/5">
              <Users className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-display font-bold text-white mb-3">Sync & Save</h3>
            <p className="text-slate-400 text-base leading-relaxed">Instant real-time matchmaking for fare splitting with nearby travelers in your vicinity.</p>
          </div>
          <div className="relative z-10 mt-auto flex items-center text-emerald-400 font-bold group-hover:translate-x-2 transition-transform">
            Find Buddies <ArrowRight className="ml-2 w-5 h-5" />
          </div>
        </button>
      </div>

      {/* About Section - The Philosophy */}
      <div className="relative overflow-hidden bg-white border border-slate-100 p-10 md:p-14 rounded-[4rem] space-y-12 shadow-sm">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-50/50 blur-[100px] -mr-48 -mt-48 rounded-full"></div>
        <div className="relative z-10 max-w-3xl">
           <h4 className="text-xs font-black uppercase tracking-[0.3em] text-urban-indigo mb-3">The NexusFlow Philosophy</h4>
           <h3 className="text-4xl md:text-5xl font-display font-extrabold text-urban-900 leading-tight">We build technology for a more fluid, connected, and conscious city.</h3>
        </div>

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="flex flex-col gap-5 group">
            <div className="w-14 h-14 bg-slate-50 text-indigo-600 rounded-3xl flex items-center justify-center shadow-sm border border-slate-100 group-hover:scale-110 group-hover:shadow-xl transition-all duration-500">
              <Clock className="w-7 h-7" />
            </div>
            <div>
              <h5 className="text-xl font-display font-bold text-urban-900 mb-2">AI-Driven Efficiency</h5>
              <p className="text-slate-500 leading-relaxed text-sm font-medium">
                Powered by Gemini AI, we analyze thousands of urban data points to find the sweet spot between speed, cost, and comfort.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-5 group">
            <div className="w-14 h-14 bg-slate-50 text-emerald-600 rounded-3xl flex items-center justify-center shadow-sm border border-slate-100 group-hover:scale-110 group-hover:shadow-xl transition-all duration-500">
              <Users className="w-7 h-7" />
            </div>
            <div>
              <h5 className="text-xl font-display font-bold text-urban-900 mb-2">Verified Community</h5>
              <p className="text-slate-500 leading-relaxed text-sm font-medium">
                Mobility is better together. Connect with verified commuters based on trust scores, ensuring every journey is professional.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-5 group">
            <div className="w-14 h-14 bg-slate-50 text-amber-600 rounded-3xl flex items-center justify-center shadow-sm border border-slate-100 group-hover:scale-110 group-hover:shadow-xl transition-all duration-500">
              <MapPin className="w-7 h-7" />
            </div>
            <div>
              <h5 className="text-xl font-display font-bold text-urban-900 mb-2">Sustainable Impact</h5>
              <p className="text-slate-500 leading-relaxed text-sm font-medium">
                Every "sync" reduces the number of vehicles on the road. We track your CO2 savings in real-time for a greener future.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Social Banner / Promo Area */}
      {!user && (
        <div className="relative overflow-hidden bg-gradient-to-br from-urban-900 to-black p-10 md:p-14 rounded-[3.5rem] flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
           <div className="relative z-10 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 text-indigo-300 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 border border-white/5">
                 Limited Beta Access
              </div>
              <h4 className="text-3xl font-display font-extrabold text-white">Elevate Your Commute</h4>
              <p className="text-slate-400 mt-2 text-lg">Join 2,000+ urban syncers saving over ₹15k monthly.</p>
           </div>
           <button 
             onClick={() => onChangeView(AppView.AUTH)}
             className="relative z-10 bg-white text-urban-900 px-10 py-5 rounded-2xl font-bold text-lg hover:bg-indigo-50 transition-all shadow-2xl active:scale-95"
           >
             Join the Network
           </button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;