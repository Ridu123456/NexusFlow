
import React, { useState, useEffect } from 'react';
import { RouteOption, TransportMode, RoutePreference, RouteSegment } from '../types';
import { getSmartRoutes } from '../services/geminiService';
// Ensure all icons are imported
import { MapPin, Bus, Train, Car, Walk, ChevronLeft, ArrowRight, Clock, Users, Navigation } from './Icons';
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
    if (selectedRoute) {
      setMapLoading(true);
    }
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
      case TransportMode.METRO: return { bg: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-100', dot: 'bg-indigo-500' };
      case TransportMode.BUS: return { bg: 'bg-sky-50', text: 'text-sky-600', border: 'border-sky-100', dot: 'bg-sky-500' };
      case TransportMode.CAB: return { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-100', dot: 'bg-amber-500' };
      case TransportMode.AUTO: return { bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-100', dot: 'bg-orange-500' };
      case TransportMode.WALKING: return { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100', dot: 'bg-emerald-500' };
      default: return { bg: 'bg-slate-50', text: 'text-slate-600', border: 'border-slate-100', dot: 'bg-slate-500' };
    }
  };

  const getMapUrl = (route: RouteOption) => {
    // Mode determination for Google Maps 'dirflg'
    let dirflg = 'r'; // Default to transit ('r')
    const modes = route.segments.map(s => s.mode);
    
    // Logic to select the best display flag
    if (modes.filter(m => m === TransportMode.CAB || m === TransportMode.AUTO).length > modes.length / 2) {
      dirflg = 'd'; // Driving ('d')
    } else if (modes.every(m => m === TransportMode.WALKING)) {
      dirflg = 'w'; // Walking ('w')
    }

    // Removing hardcoded zoom 'z' allows Google Maps to auto-fit both saddr and daddr markers
    return `https://maps.google.com/maps?saddr=${encodeURIComponent(origin)}&daddr=${encodeURIComponent(destination)}&dirflg=${dirflg}&t=m&ie=UTF8&iwloc=&output=embed`;
  };

  if (step === 1) {
    return (
      <div className="p-6 h-full flex items-center justify-center slide-up dot-grid bg-slate-50">
        <div className="w-full max-w-lg bg-white p-10 rounded-[3rem] shadow-2xl shadow-indigo-100/50 border border-slate-100">
          <div className="mb-10 text-center">
            <div className="w-16 h-16 bg-urban-900 rounded-3xl flex items-center justify-center text-white mx-auto mb-6 shadow-xl shadow-slate-200">
               <MapPin className="w-8 h-8" />
            </div>
            <h2 className="text-3xl font-display font-extrabold text-urban-900 tracking-tight">Sync Journey</h2>
            <p className="text-slate-400 mt-2 font-medium">Coordinate your urban crossing.</p>
          </div>
          <div className="space-y-6">
            <div className="relative">
              <div className="absolute left-6 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-indigo-500 z-10"></div>
              <div className="absolute left-[26px] top-1/2 h-12 border-l border-dashed border-slate-200"></div>
              <AutocompleteInput value={origin} onChange={setOrigin} placeholder="Starting Point" className="pl-12 rounded-2xl border-slate-100 bg-slate-50/50 focus-within:bg-white transition-all py-4" />
            </div>
            <div className="relative">
              <div className="absolute left-6 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-red-500 z-10"></div>
              <AutocompleteInput value={destination} onChange={setDestination} placeholder="Where to?" autoFocus className="pl-12 rounded-2xl border-slate-100 bg-slate-50/50 focus-within:bg-white transition-all py-4" />
            </div>
          </div>
          <button disabled={!destination} onClick={() => setStep(2)} className="mt-10 w-full bg-urban-900 text-white py-5 rounded-[1.8rem] font-bold text-lg hover:bg-black transition-all shadow-xl shadow-slate-200 active:scale-95 disabled:opacity-40">
            Next: Preferences
          </button>
        </div>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="p-6 h-full flex items-center justify-center slide-up dot-grid bg-slate-50">
        <div className="w-full max-w-lg bg-white p-10 rounded-[3rem] shadow-2xl shadow-indigo-100/50 border border-slate-100">
          <button onClick={() => setStep(1)} className="mb-8 text-slate-400 flex items-center hover:text-urban-indigo transition-colors font-bold text-sm">
            <ChevronLeft className="w-4 h-4 mr-2" /> Back
          </button>
          <div className="mb-10">
            <h2 className="text-3xl font-display font-extrabold text-urban-900 tracking-tight">Optimize For...</h2>
            <p className="text-slate-400 mt-2 font-medium">Fine-tune your routing engine.</p>
          </div>
          <div className="space-y-4">
            {Object.values(RoutePreference).map((pref) => (
              <button 
                key={pref} 
                onClick={() => setPreferences(prev => prev.includes(pref) ? prev.filter(p => p !== pref) : [...prev, pref])}
                className={`w-full p-6 rounded-3xl border-2 flex items-center justify-between transition-all group ${preferences.includes(pref) ? 'border-indigo-600 bg-indigo-50/50 shadow-lg shadow-indigo-500/5' : 'border-slate-50 bg-slate-50/30 hover:border-slate-200'}`}
              >
                <div className="flex items-center gap-5">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${preferences.includes(pref) ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-500'}`}>
                    {pref === RoutePreference.FAST ? <Clock className="w-6 h-6" /> : pref === RoutePreference.COST_EFFICIENT ? <MapPin className="w-6 h-6" /> : <Users className="w-6 h-6" />}
                  </div>
                  <span className={`font-bold capitalize text-lg tracking-tight ${preferences.includes(pref) ? 'text-indigo-900' : 'text-slate-600'}`}>{pref.toLowerCase().replace('_', ' ')}</span>
                </div>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${preferences.includes(pref) ? 'border-indigo-600 bg-indigo-600' : 'border-slate-200'}`}>
                  {preferences.includes(pref) && <div className="w-2.5 h-2.5 bg-white rounded-full"></div>}
                </div>
              </button>
            ))}
          </div>
          <button onClick={handleSearch} className="mt-10 w-full bg-urban-900 text-white py-5 rounded-[1.8rem] font-bold text-lg hover:bg-black shadow-xl active:scale-95">
            Discover Routes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row h-full bg-white overflow-hidden">
      {/* Dynamic Route Sidebar - Adjusted Width to be a bit smaller (340px/380px) */}
      <div className="order-2 md:order-1 h-[45%] md:h-full md:w-[340px] lg:w-[380px] bg-slate-50 border-r border-slate-200 flex flex-col z-20">
        <div className="p-6 overflow-y-auto flex-1 space-y-6 no-scrollbar">
          <div className="flex items-center justify-between px-2">
            <div>
              <h3 className="text-xl font-display font-extrabold text-urban-900">Recommended</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{routes.length} Multimode paths</p>
            </div>
            <button onClick={() => setStep(2)} className="bg-white p-2.5 rounded-xl shadow-sm border border-slate-100 hover:bg-slate-100 transition-all">
               <Clock className="w-4 h-4 text-slate-600" />
            </button>
          </div>

          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center space-y-6">
              <div className="relative">
                <div className="w-14 h-14 border-[4px] border-slate-200 border-t-urban-indigo rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                   <Navigation className="w-5 h-5 text-urban-indigo animate-pulse" />
                </div>
              </div>
              <div className="text-center">
                <div className="text-urban-900 font-bold text-xs uppercase tracking-widest">Optimizing Path</div>
                <p className="text-slate-400 text-[10px] mt-1 font-medium italic">Simulating urban nodes...</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {routes.map((route) => {
                const isActive = selectedRoute?.id === route.id;
                return (
                  <div 
                    key={route.id} 
                    onClick={() => setSelectedRoute(route)}
                    className={`p-5 rounded-[2rem] border-2 cursor-pointer transition-all duration-500 relative overflow-hidden group ${isActive ? 'border-indigo-600 bg-white shadow-xl shadow-indigo-100' : 'border-white bg-white hover:border-slate-200 shadow-sm'}`}
                  >
                    {isActive && <div className="absolute top-0 right-0 w-20 h-20 bg-indigo-500/5 blur-xl rounded-full -mr-10 -mt-10"></div>}
                    
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                        {route.segments.map((seg, i) => (
                          <div key={i} className="flex items-center">
                             <div className={`p-2 rounded-xl border transition-all ${isActive ? getModeStyles(seg.mode).border + ' ' + getModeStyles(seg.mode).bg + ' ' + getModeStyles(seg.mode).text : 'bg-slate-50 border-slate-100 text-slate-400'} shadow-sm`}>
                               {getModeIcon(seg.mode, "w-4 h-4")}
                             </div>
                             {i < route.segments.length - 1 && <div className="mx-0.5 h-[1.5px] w-1.5 bg-slate-100 rounded-full"></div>}
                          </div>
                        ))}
                      </div>
                      <div className="text-right">
                         <div className="text-xl font-black text-urban-900 leading-none">{route.cost}</div>
                         <div className={`text-[9px] font-black uppercase tracking-widest mt-1 ${route.comfortLevel === 'High' ? 'text-emerald-500' : 'text-amber-500'}`}>{route.comfortLevel}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-end justify-between">
                       <div className="flex-1">
                          <div className="flex items-center gap-1.5">
                             <span className="text-2xl font-display font-black text-urban-900 leading-none">{route.duration}</span>
                             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                          </div>
                          <p className="text-[11px] text-slate-500 font-semibold mt-1 tracking-tight line-clamp-1">{route.summary}</p>
                       </div>
                       <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${isActive ? 'bg-urban-900 text-white shadow-lg rotate-0' : 'bg-slate-50 text-slate-300 -rotate-45'}`}>
                          <ArrowRight className="w-5 h-5" />
                       </div>
                    </div>

                    {/* Timeline expansion */}
                    {isActive && (
                      <div className="mt-6 pt-6 border-t border-slate-50 space-y-6 animate-slide-up">
                        {route.segments.map((seg, i) => (
                          <div key={i} className="flex gap-4 group/item">
                            <div className="flex flex-col items-center">
                              <div className={`w-3.5 h-3.5 rounded-full mt-1 border-[2.5px] border-white shadow-md transition-transform duration-500 ${getModeStyles(seg.mode).dot}`}></div>
                              {i < route.segments.length - 1 && <div className="w-0.5 h-full bg-slate-100 my-1 rounded-full group-hover/item:bg-indigo-100 transition-colors"></div>}
                            </div>
                            <div className="flex-1 pb-1">
                              <div className="flex items-center justify-between mb-1">
                                <span className={`text-[10px] font-black uppercase tracking-widest ${getModeStyles(seg.mode).text}`}>{seg.mode}</span>
                                <span className="text-[9px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full">{seg.duration}</span>
                              </div>
                              <p className="text-[12px] font-bold text-slate-800 leading-snug">{seg.instruction}</p>
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
          <div className="p-6 bg-white border-t border-slate-200">
            <button 
              onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&travelmode=transit`, '_blank')}
              className="w-full bg-urban-900 text-white py-4 rounded-[1.8rem] font-bold text-base flex items-center justify-center gap-3 hover:bg-black transition-all shadow-xl shadow-slate-300 active:scale-[0.98]"
            >
              Begin Nav Sync <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Immersive Map Experience - Larger display area */}
      <div className="order-1 md:order-2 flex-1 relative bg-slate-200 overflow-hidden">
        {selectedRoute ? (
          <div className="absolute inset-0 w-full h-full">
            <iframe 
              key={selectedRoute.id} 
              title="City Mapping" 
              width="100%" 
              height="100%" 
              frameBorder="0" 
              src={getMapUrl(selectedRoute)} 
              onLoad={() => setMapLoading(false)} 
              className={`w-full h-full transition-all duration-1000 ease-in-out ${mapLoading ? 'opacity-20 blur-xl grayscale' : 'opacity-100 blur-0 grayscale-0'}`} 
              allowFullScreen 
              allow="geolocation"
            />
            
            {/* HUD Overlays */}
            <div className="absolute top-8 inset-x-0 px-6 flex justify-between items-start pointer-events-none z-40">
               <button onClick={onBack} className="pointer-events-auto bg-white/95 backdrop-blur-md p-4 rounded-[1.5rem] shadow-2xl border border-white hover:scale-105 active:scale-95 transition-all">
                 <ChevronLeft className="w-6 h-6 text-urban-900" />
               </button>
               
               <div className="flex flex-col gap-3 items-end">
                 <div className="pointer-events-auto bg-urban-900/90 backdrop-blur-2xl px-6 py-4 rounded-[2rem] shadow-2xl border border-white/10 flex items-center gap-6 slide-up">
                    <div className="flex flex-col">
                      <span className="text-[9px] font-black uppercase tracking-[0.2em] text-indigo-300/60 mb-0.5">Time</span>
                      <span className="text-white text-xl font-black">{selectedRoute.duration}</span>
                    </div>
                    <div className="w-px h-10 bg-white/10"></div>
                    <div className="flex flex-col">
                      <span className="text-[9px] font-black uppercase tracking-[0.2em] text-indigo-300/60 mb-0.5">Fare</span>
                      <span className="text-white text-xl font-black">{selectedRoute.cost}</span>
                    </div>
                 </div>
                 
                 <div className="pointer-events-auto bg-emerald-500/90 backdrop-blur-md px-3 py-1.5 rounded-xl flex items-center gap-2 shadow-xl border border-emerald-400/50 animate-float">
                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                    <span className="text-[8px] font-black text-white uppercase tracking-widest">Auto-Zoom Enabled</span>
                 </div>
               </div>
            </div>

            {/* Bottom Floating Map Controls */}
            <div className="absolute bottom-8 right-6 flex flex-col gap-2.5 pointer-events-none">
               <div className="pointer-events-auto w-12 h-12 bg-white/95 backdrop-blur-md rounded-xl shadow-2xl flex items-center justify-center cursor-pointer hover:bg-white transition-all border border-slate-100">
                  <Navigation className="w-5 h-5 text-urban-indigo" />
               </div>
               <div className="pointer-events-auto w-12 h-12 bg-white/95 backdrop-blur-md rounded-xl shadow-2xl flex items-center justify-center cursor-pointer hover:bg-white transition-all border border-slate-100">
                  <MapPin className="w-5 h-5 text-slate-400" />
               </div>
            </div>

            {mapLoading && (
              <div className="absolute inset-0 flex items-center justify-center z-30 bg-white/20 backdrop-blur-sm">
                <div className="p-10 bg-white rounded-[3rem] shadow-2xl border border-slate-50 text-center animate-float max-w-sm">
                  <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6 relative">
                    <div className="absolute inset-0 border-4 border-urban-indigo border-t-transparent rounded-full animate-spin"></div>
                    <Navigation className="w-6 h-6 text-urban-indigo" />
                  </div>
                  <h4 className="text-xl font-display font-extrabold text-urban-900 mb-2 tracking-tight">Syncing View</h4>
                  <p className="text-[12px] text-slate-500 font-medium leading-relaxed">Adjusting viewport for optimal route coverage...</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center dot-grid text-slate-300 bg-slate-50">
             <div className="w-24 h-24 bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200 border border-slate-100 flex items-center justify-center mb-8 animate-float">
                <Navigation className="w-10 h-10 text-slate-100" />
             </div>
             <p className="font-display font-black text-2xl tracking-tight text-slate-400">Awaiting Route</p>
             <p className="text-slate-400 mt-2 font-semibold text-base max-w-[200px] text-center">Markers will auto-center upon selection.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OptimizedRoutes;
