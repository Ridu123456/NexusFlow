
import React, { useEffect, useState } from 'react';
import { Navigation } from './Icons';

interface IntroProps {
  onComplete: () => void;
}

const Intro: React.FC<IntroProps> = ({ onComplete }) => {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setStage(1), 500),  // Logo appear
      setTimeout(() => setStage(2), 1200), // Text appear
      setTimeout(() => setStage(3), 2800), // Fade out
      setTimeout(onComplete, 3400)         // Finish
    ];

    return () => timers.forEach(t => clearTimeout(t));
  }, [onComplete]);

  return (
    <div className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-urban-900 transition-opacity duration-700 ${stage === 3 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/10 blur-[120px] rounded-full"></div>
      </div>
      
      <div className="relative flex flex-col items-center">
        <div className={`transition-all duration-1000 transform ${stage >= 1 ? 'scale-100 opacity-100 translate-y-0' : 'scale-50 opacity-0 translate-y-10'}`}>
           <div className="relative mb-8">
              <div className="absolute inset-0 bg-indigo-500 blur-2xl opacity-40 animate-pulse"></div>
              <Navigation className="w-24 h-24 text-white relative z-10" />
           </div>
        </div>

        <div className={`text-center transition-all duration-1000 delay-300 transform ${stage >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h1 className="text-6xl font-display font-extrabold text-white tracking-tighter mb-3">
            Nexus<span className="text-urban-indigo">Flow</span>
          </h1>
          <div className="flex items-center justify-center gap-4">
            <div className="h-px w-8 bg-indigo-500/30"></div>
            <p className="text-indigo-200 text-xs font-black uppercase tracking-[0.4em]">Smart Mobility Together</p>
            <div className="h-px w-8 bg-indigo-500/30"></div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-12 flex flex-col items-center gap-2">
         <div className="w-1 h-12 bg-gradient-to-b from-transparent via-indigo-500/50 to-transparent rounded-full overflow-hidden">
            <div className="w-full h-full bg-white animate-scroll-line"></div>
         </div>
         <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Initialising Urban Sync</span>
      </div>

      <style>{`
        @keyframes scroll-line {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        .animate-scroll-line {
          animation: scroll-line 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Intro;
