
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

// Moved outside to prevent re-mounting on state changes
// Using React.PropsWithChildren to ensure 'children' is recognized as a valid prop.
const Container = ({ children }: React.PropsWithChildren<{}>) => (
  <div className="p-6 md:p-12 h-full flex flex-col slide-up items-center justify-center">
      <div className="w-full max-w-lg bg-white md:p-8 md:rounded-2xl md:shadow-xl md:border border-gray-100 flex flex-col h-full md:h-auto">
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
    
    // Simulate API delay
    const users = await findNearbyMatches(destination, mode);
    setMatches(users);
    setLoading(false);
  };

  const handleJoin = () => {
    setStep('GROUP');
  };

  const simulateVerification = () => {
    // In a real app, this would use a QR scanning library
    setShowCamera(true);
    setTimeout(() => {
        setShowCamera(false);
        setVerified(true);
    }, 2000);
  };

  // Step 1: Input
  if (step === 'INPUT') {
    return (
      <Container>
        <div className="flex items-center mb-6">
            <button onClick={onBack} className="text-gray-500 hover:text-gray-800 flex items-center md:hidden mr-4">
               <ChevronLeft className="w-5 h-5" />
            </button>
            <h2 className="text-2xl font-bold">Find Travel Buddies</h2>
        </div>
        
        <div className="space-y-6">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Where to?</label>
            <AutocompleteInput 
              value={destination} 
              onChange={setDestination}
              placeholder="Enter destination"
              leftIcon={<MapPin className="w-5 h-5 text-emerald-500" />}
              autoFocus
              className="hover:border-emerald-500 shadow-sm"
            />
          </div>

          <div>
             <label className="block text-xs font-semibold text-gray-500 uppercase mb-3">Preferred Vehicle</label>
             <div className="grid grid-cols-2 gap-4">
                <button 
                    onClick={() => setMode(TransportMode.CAB)}
                    className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center space-y-2 transition-all ${mode === TransportMode.CAB ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-md' : 'border-gray-200 text-gray-500 hover:border-emerald-200'}`}
                >
                    <Car className="w-8 h-8" />
                    <span className="font-bold">Cab</span>
                    <span className="text-xs opacity-75">Max 3 people</span>
                </button>
                <button 
                    onClick={() => setMode(TransportMode.AUTO)}
                    className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center space-y-2 transition-all ${mode === TransportMode.AUTO ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-md' : 'border-gray-200 text-gray-500 hover:border-emerald-200'}`}
                >
                    <div className="w-8 h-8 rounded-full border-2 border-current flex items-center justify-center text-xs font-bold">A</div>
                    <span className="font-bold">Auto</span>
                    <span className="text-xs opacity-75">Max 2 people</span>
                </button>
             </div>
          </div>
        </div>

        <button 
          disabled={!destination}
          onClick={handleFindMatches}
          className="mt-auto md:mt-8 w-full bg-emerald-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-emerald-700 disabled:opacity-50 transition-colors shadow-lg shadow-emerald-200"
        >
          Search Nearby
        </button>
      </Container>
    );
  }

  // Step 2: Matching
  if (step === 'MATCHING') {
    return (
      <Container>
        <button onClick={() => setStep('INPUT')} className="mb-4 text-gray-500 flex items-center hover:text-gray-900 self-start">
          <ChevronLeft className="w-5 h-5 mr-1" /> Change Search
        </button>

        {loading ? (
             <div className="flex-1 flex flex-col items-center justify-center py-10">
                <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mb-4"></div>
                <h3 className="text-xl font-bold text-gray-700">Scanning Area...</h3>
                <p className="text-gray-500">Looking for people going to {destination}</p>
             </div>
        ) : (
            <div className="w-full flex flex-col h-full">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Found {matches.length} Travelers</h2>
                    <p className="text-gray-500">Going to <span className="font-semibold text-gray-800">{destination}</span></p>
                </div>

                <div className="flex-1 overflow-y-auto space-y-4 pr-1">
                    {matches.map(user => (
                        <div key={user.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between hover:border-emerald-200 transition-colors">
                            <div className="flex items-center space-x-3">
                                <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-full object-cover bg-gray-200" />
                                <div>
                                    <h4 className="font-bold text-gray-800">{user.name}</h4>
                                    <div className="flex items-center text-xs text-yellow-500">
                                        <span>★ {user.rating}</span>
                                    </div>
                                </div>
                            </div>
                            <button onClick={handleJoin} className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-lg text-sm font-bold hover:bg-emerald-200 transition-colors">
                                Connect
                            </button>
                        </div>
                    ))}
                    
                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 mt-4">
                        <div className="flex items-center space-x-3 mb-2">
                             <Car className="w-5 h-5 text-blue-600" />
                             <span className="font-bold text-blue-800">Vehicle Availability</span>
                        </div>
                        <p className="text-sm text-blue-700">
                            High availability for <strong>{mode === TransportMode.CAB ? 'Cabs' : 'Autos'}</strong> in this area. Estimated wait: 2 mins.
                        </p>
                    </div>
                </div>
            </div>
        )}
      </Container>
    );
  }

  // Step 3: Group Formation
  if (step === 'GROUP') {
      return (
        <Container>
            <h2 className="text-2xl font-bold text-center mb-8 mt-4">Group Formed!</h2>
            
            <div className="flex justify-center -space-x-4 mb-8">
                {matches.slice(0, 2).map((u, i) => (
                    <img key={i} src={u.avatar} className="w-16 h-16 rounded-full border-4 border-white z-10" alt={u.name} />
                ))}
                <div className="w-16 h-16 rounded-full border-4 border-white bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold z-20">
                    You
                </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-2xl mb-8 w-full">
                <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-500">Destination</span>
                    <span className="font-bold text-gray-800">{destination}</span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-500">Transport</span>
                    <span className="font-bold text-gray-800 capitalize">{mode.toLowerCase()}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Split Cost</span>
                    <span className="font-bold text-emerald-600">~₹45 / person</span>
                </div>
            </div>

            <button 
                onClick={() => setStep('VERIFY')}
                className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-emerald-700 shadow-lg shadow-emerald-200 mt-auto md:mt-0"
            >
                Verify & Start
            </button>
        </Container>
      );
  }

  // Step 4: Verification
  if (step === 'VERIFY') {
      if (showCamera) {
          return (
              <div className="fixed inset-0 bg-black z-[70] flex flex-col items-center justify-center">
                  <div className="w-64 h-64 border-2 border-emerald-500 rounded-2xl relative overflow-hidden mb-8">
                      <div className="absolute inset-0 bg-gray-800 opacity-50"></div>
                      <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500 animate-slide-down"></div>
                      <p className="absolute inset-0 flex items-center justify-center text-white font-bold">Simulating Scan...</p>
                  </div>
                  <p className="text-white mb-8">Align QR code within frame</p>
                  <button onClick={() => setShowCamera(false)} className="text-gray-400">Cancel</button>
                  <style>{`
                    @keyframes slide-down {
                        0% { top: 0; }
                        100% { top: 100%; }
                    }
                    .animate-slide-down {
                        animation: slide-down 1.5s linear infinite;
                    }
                  `}</style>
              </div>
          )
      }

      if (verified) {
          return (
              <div className="h-full w-full flex flex-col items-center justify-center p-6 bg-emerald-600 text-white text-center slide-up md:rounded-2xl">
                  <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6 shadow-xl">
                      <Users className="w-12 h-12 text-emerald-600" />
                  </div>
                  <h2 className="text-3xl font-bold mb-2">Verified!</h2>
                  <p className="text-emerald-100 text-lg mb-8">Enjoy Your Journey!</p>
                  
                  <button 
                    onClick={onBack}
                    className="bg-white text-emerald-600 px-8 py-3 rounded-full font-bold shadow-lg hover:bg-emerald-50 transition-colors"
                  >
                      Back to Home
                  </button>
              </div>
          )
      }

      return (
          <Container>
              <div className="flex flex-col items-center w-full h-full pt-6 md:pt-0">
                  <h2 className="text-2xl font-bold mb-2">Verify Identity</h2>
                  <p className="text-gray-500 text-center mb-8">Scan your partner's QR code to ensure safety.</p>

                  <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 mb-8 transform hover:scale-105 transition-transform duration-300">
                      <div className="w-48 h-48 bg-gray-900 rounded-lg flex items-center justify-center text-white overflow-hidden relative">
                          {/* Abstract QR visual */}
                          <div className="absolute inset-0 p-4 grid grid-cols-6 grid-rows-6 gap-1">
                              {Array.from({length: 36}).map((_, i) => (
                                  <div key={i} className={`bg-white ${Math.random() > 0.5 ? 'opacity-100' : 'opacity-0'}`}></div>
                              ))}
                          </div>
                          <QrCode className="w-12 h-12 relative z-10 text-emerald-500 bg-white p-1 rounded" />
                      </div>
                      <p className="text-center text-xs text-gray-400 mt-4">Your Unique Code: US-{Math.floor(Math.random() * 9999)}</p>
                  </div>

                  <div className="w-full space-y-4 mt-auto md:mt-0">
                    <button 
                        onClick={simulateVerification}
                        className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold flex items-center justify-center shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-colors"
                    >
                        <Camera className="w-5 h-5 mr-2" />
                        Scan Partner's QR
                    </button>
                    <button onClick={() => setStep('GROUP')} className="w-full text-gray-500 py-2 hover:text-gray-800 transition-colors">
                        Cancel
                    </button>
                  </div>
              </div>
          </Container>
      );
  }

  return null;
};

export default ConnectPeople;
