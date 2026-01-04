
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
      groupSize: 3, // Mocked based on match results
      status: 'Confirmed',
      timestamp: Date.now()
    };
    storageService.saveTrip(newTrip);
    setStep(3);
  };

  const timeSlots = ["08:00 AM", "09:00 AM", "10:00 AM", "05:00 PM", "06:00 PM", "07:00 PM"];

  return (
    <div className="p-6 md:p-12 h-full flex flex-col slide-up max-w-5xl mx-auto">
      <div className="flex items-center mb-8">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full mr-4 transition-colors">
          <ChevronLeft className="w-6 h-6 text-gray-600" />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Plan Ahead</h2>
          <p className="text-sm text-gray-500">Scheduled trips earn 2x Reputation Points</p>
        </div>
      </div>

      {step === 1 && (
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden max-w-xl mx-auto w-full">
          <div className="p-8 space-y-6">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Destination</label>
              <AutocompleteInput 
                value={destination} 
                onChange={setDestination} 
                placeholder="Where are you heading?" 
                leftIcon={<MapPin className="w-5 h-5 text-violet-500" />}
                autoFocus
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Select Date</label>
                <select 
                  value={date} 
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-violet-500 transition-colors appearance-none"
                >
                  <option>Today</option>
                  <option>Tomorrow</option>
                  <option>Day After</option>
                  <option>Next Monday</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Time Slot</label>
                <select 
                  value={time} 
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-violet-500 transition-colors appearance-none"
                >
                  {timeSlots.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
            </div>

            <div className="bg-violet-50 p-4 rounded-2xl border border-violet-100 flex items-start space-x-3">
              <div className="p-2 bg-violet-100 rounded-lg text-violet-600">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-violet-800 italic">Early Bird Advantage</p>
                <p className="text-xs text-violet-700">Matching early increases split-cost probability by 85%.</p>
              </div>
            </div>

            <button 
              disabled={!destination}
              onClick={handleSearch}
              className="w-full bg-violet-600 text-white py-4 rounded-xl font-bold shadow-lg shadow-violet-100 hover:bg-violet-700 transition-colors disabled:opacity-50"
            >
              Search Future Matches
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-4">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Available Future Matches</h3>
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
                <div className="w-10 h-10 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin mb-4"></div>
                <p className="text-gray-500 font-medium">Scanning future calendars...</p>
              </div>
            ) : (
              matches.map(user => (
                <div key={user.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between hover:border-violet-300 transition-all group">
                  <div className="flex items-center space-x-4">
                    <img src={user.avatar} className="w-14 h-14 rounded-full border-2 border-violet-50" alt={user.name} />
                    <div>
                      <h4 className="font-bold text-gray-800 text-lg group-hover:text-violet-700 transition-colors">{user.name}</h4>
                      <div className="flex items-center space-x-3 text-sm text-gray-500">
                        <span className="flex items-center text-amber-500">★ {user.rating}</span>
                        <span className="flex items-center"><Clock className="w-3 h-3 mr-1" /> {user.scheduledTime}</span>
                      </div>
                    </div>
                  </div>
                  <button onClick={handleConfirmTrip} className="bg-violet-50 text-violet-700 px-6 py-2 rounded-xl font-bold hover:bg-violet-600 hover:text-white transition-all">
                    Pre-Join
                  </button>
                </div>
              ))
            )}
          </div>
          
          <div className="space-y-6">
            <div className="bg-indigo-900 p-6 rounded-3xl text-white shadow-xl relative overflow-hidden">
              <div className="relative z-10">
                <h4 className="text-lg font-bold mb-2">Can't find a match?</h4>
                <p className="text-indigo-200 text-sm mb-6">List your trip now and we'll notify you when others join your route.</p>
                <button className="w-full bg-white text-indigo-900 py-3 rounded-xl font-bold hover:bg-indigo-50 transition-colors shadow-lg">
                  List My Trip
                </button>
              </div>
              <Calendar className="absolute -bottom-4 -right-4 w-24 h-24 opacity-10 transform rotate-12" />
            </div>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="max-w-xl mx-auto w-full text-center py-12">
          <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
             <Calendar className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Trip Saved!</h2>
          <p className="text-gray-500 mb-8 px-6">Your history has been updated. You can view this trip in your Profile at any time.</p>
          
          <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100 mb-8">
             <div className="flex justify-between items-center py-2 border-b border-gray-50">
                <span className="text-gray-400">Time</span>
                <span className="font-bold">{date} • {time}</span>
             </div>
             <div className="flex justify-between items-center py-2 border-b border-gray-50">
                <span className="text-gray-400">People</span>
                <span className="font-bold flex items-center"><Users className="w-4 h-4 mr-1" /> 3 Travelers</span>
             </div>
             <div className="flex justify-between items-center py-2">
                <span className="text-gray-400">Status</span>
                <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest">Locked</span>
             </div>
          </div>

          <button 
            onClick={onBack}
            className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold hover:bg-gray-800 transition-colors flex items-center justify-center"
          >
            Back to Dashboard <ArrowRight className="w-5 h-5 ml-2" />
          </button>
        </div>
      )}
    </div>
  );
};

export default PlanAhead;
