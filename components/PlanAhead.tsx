
import React, { useState } from 'react';
import { UserProfile, ScheduledTrip } from '../types';
import { findScheduledMatches } from '../services/geminiService';
import { storageService } from '../services/storageService';
import { Calendar, MapPin, ChevronLeft, Clock, Users, ArrowRight } from './Icons';
import AutocompleteInput from './AutocompleteInput';

interface PlanAheadProps {
  onBack: () => void;
}

const PlanAhead: React.FC<PlanAheadProps> = ({ onBack }) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('Tomorrow');
  const [time, setTime] = useState('09:00 AM');
  const [matches, setMatches] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    setStep(2);
    const results = await findScheduledMatches(destination, `${date} at ${time}`);
    setMatches(results);
    setLoading(false);
  };

  const handleConfirmTrip = () => {
    const newTrip: ScheduledTrip = {
      id: `trip-${Date.now()}`,
      destination: destination,
      date: date,
      time: time,
      groupSize: 3,
      status: 'Confirmed',
      timestamp: Date.now()
    };
    storageService.saveTrip(newTrip);
    setStep(3);
  };

  const timeSlots = ["08:00 AM", "09:00 AM", "10:00 AM", "05:00 PM", "06:00 PM", "07:00 PM"];

  return (
    <div className="p-6 md:p-12 h-full flex flex-col animate-fade-in max-w-5xl mx-auto pb-32">
      <div className="flex items-center justify-between mb-12">
        <div className="flex items-center">
          <button onClick={onBack} className="p-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl mr-5 shadow-sm hover:shadow-md transition-all">
            <ChevronLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </button>
          <div>
            <h2 className="text-3xl font-display font-black text-slate-900 dark:text-white tracking-tight">Plan Ahead</h2>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Scheduled Rewards Enabled</p>
          </div>
        </div>
      </div>

      {step === 1 && (
        <div className="bg-white dark:bg-slate-900 rounded-[3rem] shadow-xl border border-slate-50 dark:border-slate-800 overflow-hidden max-w-xl mx-auto w-full animate-slide-up">
          <div className="p-8 md:p-12 space-y-8">
            <div className="text-center mb-4">
               <div className="w-16 h-16 bg-brand-50 dark:bg-brand-900/20 rounded-[1.8rem] flex items-center justify-center text-brand-500 mx-auto mb-4">
                  <Calendar className="w-8 h-8" />
               </div>
               <p className="text-slate-500 dark:text-slate-400 font-medium">Coordinate your future urban crossing.</p>
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Destination</label>
              <AutocompleteInput 
                value={destination} 
                onChange={setDestination} 
                placeholder="Where are you heading?" 
                leftIcon={<MapPin className="w-5 h-5 text-brand-500" />}
                autoFocus
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Date</label>
                <div className="relative">
                  <select 
                    value={date} 
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl outline-none focus:ring-2 focus:ring-brand-500/20 dark:text-white transition-all font-bold text-sm appearance-none"
                  >
                    <option>Today</option>
                    <option>Tomorrow</option>
                    <option>Day After</option>
                    <option>Next Monday</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Time Slot</label>
                <div className="relative">
                  <select 
                    value={time} 
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl outline-none focus:ring-2 focus:ring-brand-500/20 dark:text-white transition-all font-bold text-sm appearance-none"
                  >
                    {timeSlots.map(t => <option key={t}>{t}</option>)}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-brand-50 dark:bg-brand-900/20 p-5 rounded-2xl border border-brand-100 dark:border-brand-800 flex items-start space-x-4">
              <div className="p-3 bg-white dark:bg-slate-900 rounded-xl text-brand-500 shadow-sm shrink-0">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-brand-700 dark:text-brand-300">Early Bird Advantage</p>
                <p className="text-[11px] text-brand-600 dark:text-brand-400 font-medium leading-relaxed opacity-70">Pre-booking increases your match probability by up to <span className="font-black">85%</span>.</p>
              </div>
            </div>

            <button 
              disabled={!destination}
              onClick={handleSearch}
              className="w-full bg-slate-900 dark:bg-brand-500 text-white py-5 rounded-2xl font-bold text-lg hover:bg-black dark:hover:bg-brand-600 transition-all shadow-xl disabled:opacity-40 active:scale-[0.98]"
            >
              Search Future Syncs
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-fade-in">
          <div className="md:col-span-2 space-y-6">
            <h3 className="text-2xl font-display font-black text-slate-900 dark:text-white tracking-tight">Available Matches</h3>
            {loading ? (
              <div className="flex flex-col items-center justify-center py-24 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
                <div className="w-12 h-12 border-4 border-slate-100 border-t-brand-500 rounded-full animate-spin mb-6"></div>
                <p className="text-slate-400 font-bold text-xs uppercase tracking-widest italic">Predicting urban nodes...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {matches.map(user => (
                  <div key={user.id} className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] shadow-sm border border-slate-50 dark:border-slate-800 flex items-center justify-between hover:border-brand-500/20 transition-all group">
                    <div className="flex items-center space-x-5">
                      <img src={user.avatar} className="w-16 h-16 rounded-2xl border-2 border-slate-50 dark:border-slate-800 object-cover" alt={user.name} />
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white text-lg group-hover:text-brand-500 transition-colors">{user.name}</h4>
                        <div className="flex items-center space-x-4 text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">
                          <span className="flex items-center text-amber-500">★ {user.rating}</span>
                          <span className="flex items-center"><Clock className="w-3.5 h-3.5 mr-1.5 opacity-50" /> {user.scheduledTime}</span>
                        </div>
                      </div>
                    </div>
                    <button onClick={handleConfirmTrip} className="bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-300 px-8 py-3 rounded-2xl font-bold text-xs hover:bg-brand-500 hover:text-white transition-all shadow-sm">
                      Pre-Join
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="space-y-6">
            <div className="bg-brand-500 p-8 rounded-[2.5rem] text-white shadow-xl shadow-brand-500/10 relative overflow-hidden group">
              <div className="relative z-10">
                <h4 className="text-xl font-display font-black tracking-tight mb-3">No match yet?</h4>
                <p className="text-white/70 text-sm mb-8 leading-relaxed">List your journey now. We'll notify you as soon as a compatible sync is detected.</p>
                <button className="w-full bg-white text-brand-500 py-4 rounded-2xl font-bold text-sm hover:bg-slate-50 transition-all shadow-lg active:scale-[0.98]">
                  Open Waiting List
                </button>
              </div>
              <Calendar className="absolute -bottom-6 -right-6 w-32 h-32 opacity-[0.08] transform rotate-12 group-hover:scale-110 transition-transform duration-1000" />
            </div>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="max-w-xl mx-auto w-full text-center py-12 animate-fade-in">
          <div className="w-24 h-24 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-xl shadow-emerald-500/5 ring-8 ring-emerald-500/5 animate-slide-up">
             <Calendar className="w-10 h-10" />
          </div>
          <h2 className="text-4xl font-display font-black text-slate-900 dark:text-white mb-3 tracking-tight">Sync Scheduled</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-10 px-8 leading-relaxed">Your future journey is now synchronized. Access details in your Profile at any time.</p>
          
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl border border-slate-50 dark:border-slate-800 mb-10 divide-y divide-slate-50 dark:divide-slate-800">
             <div className="flex justify-between items-center py-5">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Journey Window</span>
                <span className="font-bold text-slate-900 dark:text-white">{date} • {time}</span>
             </div>
             <div className="flex justify-between items-center py-5">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Group Quota</span>
                <span className="font-bold text-slate-900 dark:text-white flex items-center"><Users className="w-4 h-4 mr-2 text-brand-500" /> 3 Commuters</span>
             </div>
             <div className="flex justify-between items-center py-5">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Verification</span>
                <span className="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] italic">Authorized</span>
             </div>
          </div>

          <button 
            onClick={onBack}
            className="w-full bg-slate-900 dark:bg-brand-500 text-white py-5 rounded-2xl font-bold hover:bg-black dark:hover:bg-brand-600 transition-all flex items-center justify-center shadow-xl active:scale-[0.98]"
          >
            Back to Overview <ArrowRight className="w-5 h-5 ml-3" />
          </button>
        </div>
      )}
    </div>
  );
};

export default PlanAhead;
