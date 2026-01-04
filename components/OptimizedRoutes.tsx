
import React, { useState, useEffect } from 'react';
import { RouteOption, TransportMode, RoutePreference } from '../types';
import { getSmartRoutes } from '../services/geminiService';
import { MapPin, Bus, Train, Car, Walk, ChevronLeft, ArrowRight, Clock, Navigation } from './Icons';
import AutocompleteInput from './AutocompleteInput';

interface OptimizedRoutesProps {
  onBack: () => void;
}

const OptimizedRoutes: React.FC<OptimizedRoutesProps> = ({ onBack }) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [origin, setOrigin] = useState('Current Location');
  const [destination, setDestination] = useState('');
  const [preferences, setPreferences] = useState<RoutePreference[]>([]);
  const [routes, setRoutes] = useState<RouteOption[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<RouteOption | null>(null);
  const [loading, setLoading] = useState(false);
  const [mapLoading, setMapLoading] = useState(false);

  useEffect(() => {
    if (selectedRoute) setMapLoading(true);
  }, [selectedRoute]);

  const handleSearch = async () => {
    setLoading(true);
    setStep(3);
    const data = await getSmartRoutes(origin, destination, preferences);
    setRoutes(data);
    if (data.length > 0) setSelectedRoute(data[0]);
    setLoading(false);
  };

  const getModeIcon = (mode: TransportMode, size: string = "w-4 h-4") => {
    switch (mode) {
      case TransportMode.BUS: return <Bus className={size} />;
      case TransportMode.METRO: return <Train className={size} />;
      case TransportMode.CAB:
      case TransportMode.AUTO: return <Car className={size} />;
      default: return <Walk className={size} />;
    }
  };

  const getModeStyles = (mode: TransportMode) => {
    switch (mode) {
      case TransportMode.METRO: return { bg: 'bg-indigo-50 dark:bg-indigo-900/30', text: 'text-indigo-600 dark:text-indigo-400', border: 'border-indigo-100 dark:border-indigo-800', dot: 'bg-indigo-500' };
      case TransportMode.BUS: return { bg: 'bg-sky-50 dark:bg-sky-900/30', text: 'text-sky-600 dark:text-sky-400', border: 'border-sky-100 dark:border-sky-800', dot: 'bg-sky-500' };
      case TransportMode.CAB: return { bg: 'bg-amber-50 dark:bg-amber-900/30', text: 'text-amber-600 dark:text-amber-400', border: 'border-amber-100 dark:border-amber-800', dot: 'bg-amber-500' };
      case TransportMode.AUTO: return { bg: 'bg-orange-50 dark:bg-orange-900/30', text: 'text-orange-600 dark:text-orange-400', border: 'border-orange-100 dark:border-orange-800', dot: 'bg-orange-500' };
      case TransportMode.WALKING: return { bg: 'bg-emerald-50 dark:bg-emerald-900/30', text: 'text-emerald-600 dark:text-emerald-400', border: 'border-emerald-100 dark:border-emerald-800', dot: 'bg-emerald-500' };
      default: return { bg: 'bg-slate-50 dark:bg-slate-800', text: 'text-slate-600 dark:text-slate-400', border: 'border-slate-100 dark:border-slate-700', dot: 'bg-slate-500' };
    }
  };

  const getMapUrl = (route: RouteOption) => {
    let dirflg = 'r';
    const modes = route.segments.map(s => s.mode);
    if (modes.filter(m => m === TransportMode.CAB || m === TransportMode.AUTO).length > modes.length / 2) dirflg = 'd';
    else if (modes.every(m => m === TransportMode.WALKING)) dirflg = 'w';
    return `https://maps.google.com/maps?saddr=${encodeURIComponent(origin)}&daddr=${encodeURIComponent(destination)}&dirflg=${dirflg}&t=m&ie=UTF8&iwloc=&output=embed`;
  };

  if (step === 1) {
    return (
      <div className="p-6 md:p-12 min-h-full flex items-center justify-center bg-slate-50/50 dark:bg-slate-950 animate-fade-in">
        <div className="w-full max-w-lg bg-white dark:bg-slate-900 p-8 md:p-10 rounded-[2.5rem] shadow-xl border border-slate-100 dark:border-slate-800">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-display font-black text-slate-900 dark:text-white tracking-tight">Sync Path</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Where are we heading today?</p>
          </div>
          <div className="space-y-4">
            <div className="relative">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 mb-1 block">Origin</label>
              <AutocompleteInput value={origin} onChange={setOrigin} placeholder="Starting Point" className="border-none shadow-sm" />
            </div>
            <div className="relative">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 mb-1 block">Destination</label>
              <AutocompleteInput value={destination} onChange={setDestination} placeholder="Enter destination..." autoFocus className="border-none shadow-sm" />
            </div>
          </div>
          <button 
            disabled={!destination} 
            onClick={() => setStep(2)} 
            className="mt-10 w-full bg-brand-500 text-white py-5 rounded-2xl font-bold text-lg hover:bg-brand-600 transition-all active:scale-[0.98] disabled:opacity-40 shadow-xl"
          >
            Preferences
          </button>
        </div>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="p-6 md:p-12 min-h-full flex items-center justify-center bg-slate-50/50 dark:bg-slate-950 animate-fade-in">
        <div className="w-full max-w-lg bg-white dark:bg-slate-900 p-8 md:p-10 rounded-[2.5rem] shadow-xl border border-slate-100 dark:border-slate-800">
          <button onClick={() => setStep(1)} className="mb-8 text-slate-400 flex items-center hover:text-slate-900 dark:hover:text-white transition-colors font-bold text-xs uppercase tracking-widest">
            <ChevronLeft className="w-4 h-4 mr-1" /> Back
          </button>
          <div className="mb-10">
            <h2 className="text-3xl font-display font-black text-slate-900 dark:text-white tracking-tight">Routing Engine</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Fine-tune your synchronization logic.</p>
          </div>
          <div className="space-y-3">
            {Object.values(RoutePreference).map((pref) => (
              <button 
                key={pref} 
                onClick={() => setPreferences(prev => prev.includes(pref) ? prev.filter(p => p !== pref) : [...prev, pref])}
                className={`w-full p-5 rounded-2xl border-2 flex items-center justify-between transition-all ${preferences.includes(pref) ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-900/10' : 'border-slate-50 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-800/30 hover:border-slate-200'}`}
              >
                <div className="flex items-center gap-4">
                  <span className={`font-bold capitalize text-slate-900 dark:text-white`}>{pref.toLowerCase().replace('_', ' ')}</span>
                </div>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${preferences.includes(pref) ? 'border-brand-500 bg-brand-500' : 'border-slate-200 dark:border-slate-700'}`}>
                  {preferences.includes(pref) && <div className="w-2.5 h-2.5 bg-white rounded-full"></div>}
                </div>
              </button>
            ))}
          </div>
          <button onClick={handleSearch} className="mt-10 w-full bg-brand-500 text-white py-5 rounded-2xl font-bold text-lg hover:bg-brand-600 shadow-xl active:scale-[0.98]">
            Calculate Routes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row h-full bg-white dark:bg-slate-950 overflow-hidden font-sans">
      {/* Search Sidebar/List */}
      <div className="order-2 md:order-1 h-[50%] md:h-full md:w-[360px] lg:w-[440px] bg-slate-50 dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 flex flex-col z-20">
        <div className="p-6 overflow-y-auto flex-1 space-y-6 no-scrollbar">
          <div className="flex items-center justify-between px-2">
            <div>
              <h3 className="text-xl font-display font-black text-slate-900 dark:text-white">Recommendations</h3>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-1">{routes.length} Optimized Results</p>
            </div>
            <button onClick={() => setStep(2)} className="bg-white dark:bg-slate-800 p-2 rounded-xl border border-slate-100 dark:border-slate-700 text-slate-400">
               <Clock className="w-5 h-5" />
            </button>
          </div>

          {/* ARIA Live Region for accessibility announcements */}
          <div aria-live="polite" className="sr-only">
             {selectedRoute ? `Route selected: Duration ${selectedRoute.duration}, estimated cost ${selectedRoute.cost}` : "Loading results..."}
          </div>

          {loading ? (
            <div className="py-24 flex flex-col items-center justify-center">
              <div className="w-12 h-12 border-4 border-slate-200 border-t-brand-500 rounded-full animate-spin mb-6"></div>
              <p className="text-slate-400 font-bold text-xs uppercase tracking-widest animate-pulse">Computing sync nodes...</p>
            </div>
          ) : (
            <div className="space-y-4 pb-20">
              {routes.map((route) => {
                const isActive = selectedRoute?.id === route.id;
                return (
                  <div 
                    key={route.id} 
                    onClick={() => setSelectedRoute(route)}
                    className={`p-6 rounded-[2rem] border-2 cursor-pointer transition-all duration-300 relative overflow-hidden ${isActive ? 'border-brand-500 bg-white dark:bg-slate-800 shadow-xl' : 'border-transparent bg-white dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 shadow-sm'}`}
                  >
                    <div className="flex justify-between items-start mb-5">
                      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
                        {route.segments.map((seg, i) => (
                          <div key={i} className={`p-1.5 rounded-lg shrink-0 ${isActive ? 'bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-300' : 'text-slate-400'}`}>
                             {getModeIcon(seg.mode, "w-4 h-4")}
                          </div>
                        ))}
                      </div>
                      <div className="text-right shrink-0">
                         <div className="text-lg font-black text-slate-900 dark:text-white">{route.cost}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-end justify-between">
                       <div className="flex-1 min-w-0 pr-4">
                          <div className="flex items-center gap-2">
                             <span className="text-2xl font-display font-black text-slate-900 dark:text-white tracking-tight">{route.duration}</span>
                             <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md shrink-0 ${route.comfortLevel === 'High' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20' : 'bg-amber-50 text-amber-600 dark:bg-amber-900/20'}`}>{route.comfortLevel}</span>
                          </div>
                          <p className="text-[12px] text-slate-400 font-medium mt-1 truncate">{route.summary}</p>
                       </div>
                       <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all shrink-0 ${isActive ? 'bg-brand-500 text-white' : 'bg-slate-50 dark:bg-slate-800 text-slate-300'}`}>
                          <ArrowRight className="w-5 h-5" />
                       </div>
                    </div>

                    {isActive && (
                      <div className="mt-8 pt-6 border-t border-slate-50 dark:border-slate-700 space-y-5 animate-slide-up">
                        {route.segments.map((seg, i) => (
                          <div key={i} className="flex gap-4">
                            <div className="flex flex-col items-center shrink-0">
                              <div className={`w-3 h-3 rounded-full mt-1.5 ${getModeStyles(seg.mode).dot}`}></div>
                              {i < route.segments.length - 1 && <div className="w-0.5 h-full bg-slate-100 dark:bg-slate-700 my-1"></div>}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-0.5">
                                <span className={`text-[9px] font-black uppercase tracking-[0.2em] ${getModeStyles(seg.mode).text}`}>{seg.mode}</span>
                                <span className="text-[9px] font-bold text-slate-400">{seg.duration}</span>
                              </div>
                              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 leading-snug">{seg.instruction}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
        
        {selectedRoute && (
          <div className="p-6 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
            <button 
              onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&travelmode=transit`, '_blank')}
              className="w-full bg-brand-500 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-brand-600 transition-all shadow-xl shadow-brand-500/10 active:scale-[0.98]"
            >
              Start Sync <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Map Content */}
      <div className="order-1 md:order-2 flex-1 relative bg-slate-100 dark:bg-slate-950 h-full overflow-hidden">
        {selectedRoute ? (
          <div className="absolute inset-0">
            <iframe 
              key={selectedRoute.id} 
              title="City Mapping" 
              width="100%" 
              height="100%" 
              frameBorder="0" 
              src={getMapUrl(selectedRoute)} 
              onLoad={() => setMapLoading(false)} 
              className={`w-full h-full transition-all duration-1000 ${mapLoading ? 'opacity-30 blur-lg grayscale' : 'opacity-100'}`} 
              allowFullScreen 
              allow="geolocation"
            />
            
            <div className="absolute top-6 left-6 right-6 flex justify-between pointer-events-none z-10">
               <button onClick={onBack} className="pointer-events-auto glass p-3 rounded-2xl shadow-xl border border-white dark:border-slate-800 hover:scale-105 transition-all">
                 <ChevronLeft className="w-6 h-6 text-slate-900 dark:text-white" />
               </button>
               
               <div className="pointer-events-auto glass px-6 py-4 rounded-[1.8rem] shadow-xl border border-white dark:border-slate-800 flex items-center gap-6 animate-slide-up">
                  <div className="text-center">
                    <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 block mb-0.5">TIME</span>
                    <span className="text-xl font-display font-black text-slate-900 dark:text-white">{selectedRoute.duration}</span>
                  </div>
                  <div className="w-px h-8 bg-slate-200 dark:bg-slate-700"></div>
                  <div className="text-center">
                    <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 block mb-0.5">COST</span>
                    <span className="text-xl font-display font-black text-brand-500">{selectedRoute.cost}</span>
                  </div>
               </div>
            </div>
          </div>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-300 p-8 text-center animate-fade-in">
             <div className="w-20 h-20 bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl flex items-center justify-center mb-6 border border-slate-50 dark:border-slate-800">
                <Navigation className="w-8 h-8 opacity-20" />
             </div>
             <p className="font-display font-black text-xl tracking-tight text-slate-400 dark:text-slate-600">Enter a destination to begin synchronization.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OptimizedRoutes;
