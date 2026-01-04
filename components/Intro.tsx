
import React, { useEffect, useState } from 'react';
import { Navigation } from './Icons';

interface IntroProps {
  onComplete: () => void;
}

const Intro: React.FC<IntroProps> = ({ onComplete }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onComplete, 500); // Allow fade out
    }, 2500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-indigo-600 text-white transition-opacity duration-500 ${visible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div className="relative mb-4">
        <div className="absolute inset-0 bg-white opacity-20 blur-xl rounded-full animate-pulse"></div>
        <Navigation className="w-20 h-20 relative z-10" />
      </div>
      <h1 className="text-4xl font-bold tracking-tighter mb-2">NexusFlow</h1>
      <p className="text-indigo-200 text-sm tracking-widest uppercase">Smart Mobility Together</p>
    </div>
  );
};

export default Intro;