
import React, { useState, useEffect } from 'react';
import { ChevronLeft, Users, Navigation, Clock, Calendar, MapPin, Award, Shield, IndianRupee, ArrowRight, Bus, Train, Car, Walk } from './Icons';
import { storageService } from '../services/storageService';
import { ScheduledTrip, TransportMode } from '../types';

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
    if (confirm("Are you sure you want to cancel this scheduled trip?")) {
      storageService.deleteTrip(id);
      setScheduledTrips(storageService.getTrips());
    }
  };

  return (
    <div className="p-4 md:p-12 min-h-full bg-slate-50/50 flex flex-col slide-up max-w-7xl mx-auto space-y-10 pb-24">
      {/* Editorial Navigation */}
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="group flex items-center gap-3 p-2 pr-6 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-urban-indigo transition-all">
          <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center group-hover:bg-urban-indigo group-hover:text-white transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </div>
          <span className="font-bold text-sm text-urban-900">Return to Sync</span>
        </button>
        <button 
           onClick={onLogout}
           className="text-slate-400 font-bold text-xs uppercase tracking-widest hover:text-red-500 transition-all p-2"
        >
          End Session
        </button>
      </div>

      {/* Cinematic Bento Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Profile Hero Module (Bento Main) */}
        <div className="lg:col-span-8 relative bg-urban-900 rounded-[3.5rem] p-10 md:p-16 overflow-hidden text-white shadow-2xl flex flex-col md:flex-row items-center gap-12">
          {/* Background Textures */}
          <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_0%,rgba(99,102,241,0.15)_0%,transparent_50%)]"></div>
          <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(circle_at_0%_100%,rgba(16,185,129,0.08)_0%,transparent_40%)]"></div>
          
          <div className="relative">
            {/* Level Orb */}
            <div className="absolute inset-[-18px] border-[3px] border-dashed border-indigo-500/20 rounded-[3.5rem] animate-[spin_30s_linear_infinite]"></div>
            <div className="w-36 h-36 md:w-48 md:h-48 bg-gradient-to-br from-indigo-500 via-urban-indigo to-violet-600 rounded-[3rem] flex items-center justify-center text-6xl md:text-8xl font-display font-black shadow-2xl relative z-10 ring-8 ring-urban-900">
              {user.name.charAt(0)}
            </div>
            <div className="absolute -bottom-4 -right-4 w-14 h-14 bg-emerald-500 rounded-3xl flex items-center justify-center border-8 border-urban-900 shadow-xl z-20">
               <Shield className="w-6 h-6 text-white" />
            </div>
          </div>

          <div className="relative z-10 text-center md:text-left flex-1">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-xl rounded-full text-[10px] font-black uppercase tracking-widest mb-6 border border-white/5">
              <span className="w-2 h-2 bg-emerald-400 rounded-full shadow-[0_0_12px_rgba(52,211,153,1)]"></span>
              Level 24 • Urban Visionary
            </div>
            <h2 className="text-5xl md:text-6xl font-display font-extrabold tracking-tight mb-3">{user.name}</h2>
            <p className="text-indigo-200/50 font-medium text-lg mb-10">{user.email}</p>
            
            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
               <TravelerTag icon={<Train />} label="Metroist" />
               <TravelerTag icon={<Users />} label="Community Pillar" />
               <TravelerTag icon={<Navigation />} label="Eco-Conscious" />
            </div>
          </div>
        </div>

        {/* Sync Reputation Module */}
        <div className="lg:col-span-4 bg-white rounded-[3.5rem] border border-slate-100 shadow-xl shadow-slate-200/30 p-10 flex flex-col justify-between relative overflow-hidden group">
           <div className="relative z-10">
             <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Network Trust Score</h4>
             <div className="flex items-baseline gap-2">
               <div className="text-7xl font-display font-black text-urban-900 tracking-tighter">4.9</div>
               <div className="text-xl font-bold text-slate-300">/ 5.0</div>
             </div>
             
             <div className="mt-8 space-y-3">
               <div className="flex justify-between text-xs font-bold text-urban-900">
                  <span>Reputation Growth</span>
                  <span className="text-emerald-500">+12% this month</span>
               </div>
               <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full w-[94%] bg-gradient-to-r from-urban-indigo to-indigo-400 rounded-full"></div>
               </div>
             </div>
             
             <p className="mt-8 text-slate-500 text-sm leading-relaxed">
               You currently rank in the <span className="text-urban-indigo font-bold">Top 1%</span> for safety and punctuality in Mumbai.
             </p>
           </div>
           
           <div className="absolute -bottom-10 -right-10 opacity-[0.03] group-hover:opacity-10 transition-all duration-1000 transform group-hover:rotate-12 group-hover:scale-125">
             <Award className="w-64 h-64 text-urban-900" />
           </div>
        </div>

        {/* Impact Bento Grid */}
        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-8">
           {/* Ecological Footprint */}
           <div className="bg-emerald-50/50 rounded-[3rem] p-10 border border-emerald-100 flex flex-col justify-between h-72 relative overflow-hidden group">
              <div className="relative z-10">
                <div className="w-14 h-14 bg-white text-emerald-600 rounded-2xl flex items-center justify-center mb-8 shadow-xl shadow-emerald-200/50 border border-emerald-100 group-hover:-translate-y-1 transition-transform">
                  <Navigation className="w-7 h-7" />
                </div>
                <div className="text-5xl font-display font-black text-emerald-900 tracking-tighter mb-1">12.4 <span className="text-xl font-bold opacity-40 uppercase tracking-widest">kg</span></div>
                <div className="text-[11px] font-black text-emerald-700/60 uppercase tracking-widest">Carbon Neutralization Impact</div>
              </div>
              <div className="absolute right-[-10%] bottom-[-10%] opacity-[0.05] group-hover:opacity-10 transition-opacity">
                <Navigation className="w-56 h-56 text-emerald-900" />
              </div>
           </div>

           {/* Financial Optimization */}
           <div className="bg-indigo-50/50 rounded-[3rem] p-10 border border-indigo-100 flex flex-col justify-between h-72 relative overflow-hidden group">
              <div className="relative z-10">
                <div className="w-14 h-14 bg-white text-indigo-600 rounded-2xl flex items-center justify-center mb-8 shadow-xl shadow-indigo-200/50 border border-indigo-100 group-hover:-translate-y-1 transition-transform">
                  <IndianRupee className="w-7 h-7" />
                </div>
                <div className="text-5xl font-display font-black text-indigo-900 tracking-tighter mb-1">₹4,250</div>
                <div className="text-[11px] font-black text-indigo-700/60 uppercase tracking-widest">Cumulative Fare Savings</div>
              </div>
              <div className="absolute right-[-10%] bottom-[-10%] opacity-[0.05] group-hover:opacity-10 transition-opacity">
                <IndianRupee className="w-56 h-56 text-indigo-900" />
              </div>
           </div>

           {/* Achievement Showcase */}
           <div className="md:col-span-2 bg-white rounded-[3.5rem] p-12 border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-12">
                <h3 className="text-2xl font-display font-extrabold text-urban-900">Trophy Room</h3>
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-4 py-2 rounded-full">12 / 24 Collected</span>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
                 <Milestone icon={<Award className="text-amber-500" />} label="Night Owl" percentage={100} />
                 <Milestone icon={<Users className="text-indigo-500" />} label="The Connector" percentage={100} />
                 <Milestone icon={<Clock className="text-emerald-500" />} label="Early Riser" percentage={65} />
                 <Milestone icon={<Shield className="text-slate-300" />} label="Guardian" percentage={20} />
              </div>
           </div>
        </div>

        {/* Mobility Feed (Right Column) */}
        <div className="lg:col-span-4 flex flex-col gap-8">
           <div className="bg-white rounded-[3.5rem] border border-slate-100 shadow-xl shadow-slate-200/20 p-10 flex-1 flex flex-col">
              <div className="flex items-center justify-between mb-10">
                <h4 className="text-xl font-display font-extrabold text-urban-900">Upcoming Syncs</h4>
                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-500">
                   <Calendar className="w-5 h-5" />
                </div>
              </div>

              {scheduledTrips.length > 0 ? (
                <div className="space-y-8 relative">
                  {/* Visual Connection Line */}
                  <div className="absolute left-[27px] top-6 bottom-6 w-[2px] bg-slate-100"></div>

                  {scheduledTrips.map((trip) => (
                    <div key={trip.id} className="relative pl-16 group">
                      <div className="absolute left-0 top-1.5 w-14 h-14 bg-white rounded-2xl border-2 border-slate-100 flex items-center justify-center z-10 group-hover:border-urban-indigo transition-all duration-300 shadow-sm group-hover:shadow-lg group-hover:-translate-y-0.5">
                         <MapPin className="w-6 h-6 text-indigo-500" />
                      </div>
                      <div className="bg-slate-50/40 p-6 rounded-3xl border border-transparent group-hover:border-slate-100 group-hover:bg-white transition-all duration-300">
                        <div className="flex justify-between items-start mb-1">
                           <h5 className="font-bold text-urban-900 truncate pr-2 text-lg tracking-tight">{trip.destination}</h5>
                           <button 
                             onClick={() => handleCancelTrip(trip.id)}
                             className="text-slate-300 hover:text-red-500 transition-colors p-1"
                           >
                             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                           </button>
                        </div>
                        <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-4 italic">{trip.date} at {trip.time}</div>
                        <div className="flex items-center justify-between">
                           <div className="px-3 py-1 bg-emerald-100/60 text-emerald-700 rounded-full text-[9px] font-black uppercase tracking-tight">
                              Active {trip.status}
                           </div>
                           <div className="flex -space-x-2">
                              <div className="w-6 h-6 rounded-full bg-indigo-100 border-2 border-white flex items-center justify-center text-[8px] font-bold text-indigo-600">+{trip.groupSize}</div>
                           </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center py-20 px-6">
                   <div className="w-24 h-24 bg-slate-50 rounded-[3rem] flex items-center justify-center mb-8 border border-slate-100 animate-float">
                      <Navigation className="w-10 h-10 text-slate-200" />
                   </div>
                   <p className="text-slate-400 font-bold text-lg mb-6">No mobility history found.</p>
                   <button 
                     onClick={onNavigateToPlan}
                     className="bg-urban-900 text-white px-10 py-4 rounded-2xl font-bold text-sm shadow-2xl active:scale-95 transition-all hover:bg-black"
                   >
                     Plan Future Journey
                   </button>
                </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};

const TravelerTag = ({ icon, label }: { icon: React.ReactNode, label: string }) => (
  <div className="flex items-center gap-2.5 px-4 py-2 bg-white/5 backdrop-blur-2xl rounded-2xl border border-white/10 text-[11px] font-bold text-indigo-100 transition-transform hover:scale-105 cursor-default">
    <div className="scale-75 opacity-70">{icon}</div>
    {label}
  </div>
);

const Milestone = ({ icon, label, percentage }: { icon: React.ReactNode, label: string, percentage: number }) => {
  const isUnlocked = percentage >= 100;
  return (
    <div className="flex flex-col items-center gap-5 group">
      <div className={`w-24 h-24 md:w-28 md:h-28 rounded-[2.5rem] flex items-center justify-center transition-all duration-700 relative ${isUnlocked ? 'bg-slate-50 border border-slate-100 shadow-sm group-hover:shadow-2xl group-hover:scale-105 group-hover:bg-white' : 'bg-slate-50/30 opacity-40 grayscale'}`}>
        <div className="scale-150 relative z-10 group-hover:rotate-12 transition-transform">{icon}</div>
        {/* Abstract Progress Aura */}
        <svg className="absolute inset-0 w-full h-full -rotate-90">
           <circle cx="50%" cy="50%" r="42%" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-slate-100" />
           <circle cx="50%" cy="50%" r="42%" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray="100 100" strokeDashoffset={100 - percentage} className="text-urban-indigo transition-all duration-1000 ease-out" />
        </svg>
      </div>
      <div className="text-center">
        <div className={`text-[11px] font-black uppercase tracking-[0.15em] ${isUnlocked ? 'text-urban-900' : 'text-slate-300'}`}>{label}</div>
        {!isUnlocked && <div className="text-[9px] font-black text-indigo-500 mt-1">{percentage}% to Unlock</div>}
      </div>
    </div>
  );
};

export default Profile;
