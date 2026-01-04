
import React, { useState } from 'react';
import { UserProfile, TransportMode } from '../types';
import { findNearbyMatches } from '../services/geminiService';
import { Users, MapPin, ChevronLeft, Car, QrCode, Camera } from './Icons';
import AutocompleteInput from './AutocompleteInput';

interface ConnectPeopleProps {
  onBack: () => void;
  currentUser: { name: string };
}

type ConnectStep = 'INPUT' | 'MATCHING' | 'GROUP' | 'VERIFY';

const Container = ({ children }: React.PropsWithChildren<{}>) => (
  <div className="p-6 md:p-12 h-full flex flex-col items-center justify-center animate-fade-in bg-slate-50/50 dark:bg-slate-950">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 p-8 md:p-12 rounded-[3rem] shadow-2xl border border-slate-100 dark:border-slate-800 flex flex-col">
          {children}
      </div>
  </div>
);

const ConnectPeople: React.FC<ConnectPeopleProps> = ({ onBack, currentUser }) => {
  const [step, setStep] = useState<ConnectStep>('INPUT');
  const [destination, setDestination] = useState('');
  const [mode, setMode] = useState<TransportMode>(TransportMode.CAB);
  const [matches, setMatches] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);
  const [showCamera, setShowCamera] = useState(false);

  const handleFindMatches = async () => {
    if (!destination) return;
    setLoading(true);
    setStep('MATCHING');
    const users = await findNearbyMatches(destination, mode);
    setMatches(users);
    setLoading(false);
  };

  const handleJoin = () => setStep('GROUP');

  if (step === 'INPUT') {
    return (
      <Container>
        <div className="flex items-center mb-10 w-full">
            <button onClick={onBack} className="p-2 bg-slate-50 dark:bg-slate-800 rounded-xl mr-4 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
               <ChevronLeft className="w-5 h-5" />
            </button>
            <h2 className="text-3xl font-display font-black text-slate-900 dark:text-white tracking-tight">Travel Buddies</h2>
        </div>
        
        <div className="space-y-6 w-full">
          <div>
            <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 ml-1">Destination</label>
            <AutocompleteInput 
              value={destination} 
              onChange={setDestination}
              placeholder="Where are you heading?"
              leftIcon={<MapPin className="w-5 h-5 text-brand-500" />}
              autoFocus
              className="shadow-sm"
            />
          </div>

          <div>
             <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3 ml-1">Preferred Vehicle</label>
             <div className="grid grid-cols-2 gap-4">
                <VehicleBtn 
                   active={mode === TransportMode.CAB} 
                   onClick={() => setMode(TransportMode.CAB)}
                   icon={<Car className="w-8 h-8" />}
                   label="Cab"
                   sub="Up to 3 buddies"
                />
                <VehicleBtn 
                   active={mode === TransportMode.AUTO} 
                   onClick={() => setMode(TransportMode.AUTO)}
                   icon={<div className="w-8 h-8 rounded-full border-2 border-current flex items-center justify-center text-xs font-black italic">A</div>}
                   label="Auto"
                   sub="Up to 2 buddies"
                />
             </div>
          </div>
        </div>

        <button 
          disabled={!destination}
          onClick={handleFindMatches}
          className="mt-12 w-full bg-brand-500 text-white py-5 rounded-2xl font-bold text-lg hover:bg-brand-600 disabled:opacity-40 transition-all shadow-xl shadow-brand-500/15 active:scale-95"
        >
          Search Nearby
        </button>
      </Container>
    );
  }

  // Matching and other steps...
  if (step === 'MATCHING') {
      return (
        <Container>
            <div className="w-full">
                <button onClick={() => setStep('INPUT')} className="mb-8 text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1 font-bold text-xs uppercase tracking-widest">
                    <ChevronLeft className="w-4 h-4" /> Back to Search
                </button>
                {loading ? (
                    <div className="py-20 flex flex-col items-center">
                        <div className="w-12 h-12 border-4 border-slate-100 border-t-brand-500 rounded-full animate-spin mb-6"></div>
                        <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Scanning Grid...</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="mb-4">
                            <h3 className="text-2xl font-display font-black text-slate-900 dark:text-white">Nearby Matches</h3>
                            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Found travelers heading to {destination}</p>
                        </div>
                        <div className="space-y-3 max-h-[300px] overflow-y-auto no-scrollbar">
                            {matches.map(m => (
                                <div key={m.id} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-transparent hover:border-brand-500/20 transition-all flex items-center justify-between group">
                                    <div className="flex items-center gap-4">
                                        <img src={m.avatar} className="w-12 h-12 rounded-xl object-cover" />
                                        <div>
                                            <p className="font-bold text-slate-900 dark:text-white">{m.name}</p>
                                            <p className="text-[10px] font-black text-amber-500">★ {m.rating}</p>
                                        </div>
                                    </div>
                                    <button onClick={handleJoin} className="px-4 py-2 bg-white dark:bg-slate-900 rounded-xl text-xs font-bold shadow-sm group-hover:bg-brand-500 group-hover:text-white transition-all">Connect</button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </Container>
      );
  }

  return (
      <Container>
          <div className="py-12 text-center">
              <div className="w-20 h-20 bg-brand-500 text-white rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-2xl">
                  <Users className="w-10 h-10" />
              </div>
              <h2 className="text-3xl font-display font-black text-slate-900 dark:text-white mb-4">Sync Established</h2>
              <p className="text-slate-500 dark:text-slate-400 mb-10 leading-relaxed">Identity verified via secure mesh. Enjoy your journey together.</p>
              <button onClick={onBack} className="w-full bg-brand-500 text-white py-4 rounded-2xl font-bold hover:bg-brand-600 shadow-xl transition-all">Return to Dashboard</button>
          </div>
      </Container>
  );
};

const VehicleBtn = ({ active, onClick, icon, label, sub }: any) => (
    <button 
        onClick={onClick}
        className={`p-6 rounded-3xl border-2 flex flex-col items-center justify-center gap-2 transition-all shadow-sm ${active ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-300 ring-4 ring-brand-500/5' : 'border-slate-50 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-800/30 text-slate-400 hover:border-slate-200 dark:hover:border-slate-700'}`}
    >
        {icon}
        <div className="font-bold text-sm">{label}</div>
        <div className="text-[10px] opacity-60 font-medium">{sub}</div>
    </button>
);

export default ConnectPeople;
