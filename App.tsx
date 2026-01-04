
import React, { useState, useEffect } from 'react';
import { AppView } from './types';
import Intro from './components/Intro';
import Dashboard from './components/Dashboard';
import OptimizedRoutes from './components/OptimizedRoutes';
import ConnectPeople from './components/ConnectPeople';
import PlanAhead from './components/PlanAhead';
import Profile from './components/Profile';
import VisionaryRoadmap from './components/VisionaryRoadmap';
import NexusOracle from './components/NexusOracle';
import { Navigation, MapPin, Users, Calendar, Mic, Zap, Sun, Moon, ArrowRight } from './components/Icons';
import { storageService } from './services/storageService';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.INTRO);
  const [user, setUser] = useState<{ name: string; email: string } | null>(storageService.getUser());
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' || 
             (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  useEffect(() => {
    storageService.saveUser(user);
  }, [user]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const navigateTo = (targetView: AppView) => {
    setView(targetView);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const email = formData.get('email') as string;
    const name = email.split('@')[0];
    setUser({ name: name.charAt(0).toUpperCase() + name.slice(1), email });
    setView(AppView.DASHBOARD);
  };

  const enterAsGuest = () => {
    setUser({ name: 'Guest', email: 'guest@nexus.flow' });
    setView(AppView.DASHBOARD);
  };

  if (view === AppView.INTRO) {
    return <Intro onComplete={() => setView(user ? AppView.DASHBOARD : AppView.AUTH)} />;
  }

  // Auth Guard
  if (!user && view === AppView.AUTH) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50 dark:bg-slate-950 font-sans">
        <div className="w-full max-w-md animate-slide-up">
          <div className="text-center mb-10">
            <div className="inline-flex p-4 bg-brand-500 rounded-3xl text-white shadow-xl shadow-brand-500/20 mb-6">
              <Navigation className="w-8 h-8" />
            </div>
            <h1 className="text-4xl font-display font-black tracking-tight text-slate-900 dark:text-white mb-2">NexusFlow</h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">Synchronizing your urban journey.</p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-800">
            <form onSubmit={handleAuthSubmit} className="space-y-4">
              <input 
                name="email" type="email" required placeholder="Email Address" 
                className="w-full bg-slate-50 dark:bg-slate-800 border-none p-4 rounded-2xl outline-none focus:ring-2 focus:ring-brand-500/20 dark:text-white transition-all font-medium" 
              />
              <input 
                name="password" type="password" required placeholder="Password" 
                className="w-full bg-slate-50 dark:bg-slate-800 border-none p-4 rounded-2xl outline-none focus:ring-2 focus:ring-brand-500/20 dark:text-white transition-all font-medium" 
              />
              <button type="submit" className="w-full bg-brand-500 text-white font-bold py-4 rounded-2xl hover:bg-brand-600 transition-all shadow-lg shadow-brand-500/20">
                Sign In
              </button>
            </form>
            <div className="mt-8 flex flex-col items-center gap-4">
              <button onClick={enterAsGuest} className="text-slate-400 hover:text-brand-500 font-bold text-sm transition-colors">
                I'll just look around for now
              </button>
              <div className="h-px w-10 bg-slate-100 dark:bg-slate-800"></div>
              <p className="text-[11px] text-slate-400 uppercase tracking-widest font-black">v3.0.4 Stable</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full flex flex-col md:flex-row bg-slate-50 dark:bg-slate-950 overflow-hidden font-sans">
      
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-24 lg:w-72 bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 p-6 lg:p-8 shrink-0 overflow-y-auto z-[100] transition-all">
        <div className="flex items-center gap-3 mb-12 cursor-pointer group" onClick={() => navigateTo(AppView.DASHBOARD)}>
          <div className="w-12 h-12 bg-brand-500 rounded-2xl flex items-center justify-center text-white shadow-lg transition-transform group-hover:scale-105 shrink-0">
            <Navigation className="w-6 h-6" />
          </div>
          <span className="hidden lg:block text-2xl font-display font-black tracking-tighter text-slate-900 dark:text-white">NexusFlow</span>
        </div>

        <nav className="space-y-3 flex-1">
          <SideLink active={view === AppView.DASHBOARD} label="Overview" icon={<Zap className="w-5 h-5"/>} onClick={() => navigateTo(AppView.DASHBOARD)} />
          <SideLink active={view === AppView.ROUTES} label="Smart Routes" icon={<MapPin className="w-5 h-5"/>} onClick={() => navigateTo(AppView.ROUTES)} />
          <SideLink active={view === AppView.CONNECT} label="Connect" icon={<Users className="w-5 h-5"/>} onClick={() => navigateTo(AppView.CONNECT)} />
          <SideLink active={view === AppView.ORACLE} label="Oracle AI" icon={<Mic className="w-5 h-5"/>} onClick={() => navigateTo(AppView.ORACLE)} />
          <SideLink active={view === AppView.PLAN_AHEAD} label="Planning" icon={<Calendar className="w-5 h-5"/>} onClick={() => navigateTo(AppView.PLAN_AHEAD)} />
          <SideLink active={view === AppView.VISION} label="Architecture" icon={<ArrowRight className="w-5 h-5"/>} onClick={() => navigateTo(AppView.VISION)} />
        </nav>

        <div className="mt-auto pt-6 border-t border-slate-50 dark:border-slate-800 space-y-4">
          <button onClick={() => setIsDarkMode(!isDarkMode)} className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-slate-400 hover:text-brand-500 transition-all font-bold text-sm">
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            <span className="hidden lg:block">Theme</span>
          </button>
          {user && (
            <button onClick={() => navigateTo(AppView.PROFILE)} className="w-full flex items-center gap-4 p-2 bg-slate-50 dark:bg-slate-800 rounded-2xl hover:shadow-md transition-all group">
              <div className="w-10 h-10 bg-brand-100 dark:bg-brand-900/40 rounded-xl flex items-center justify-center text-brand-600 dark:text-brand-200 font-bold shrink-0">
                {user.name.charAt(0)}
              </div>
              <div className="hidden lg:block text-left overflow-hidden">
                <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{user.name}</p>
                <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">Account</p>
              </div>
            </button>
          )}
        </div>
      </aside>

      {/* Mobile Top Header */}
      <header className="md:hidden flex items-center justify-between p-5 glass sticky top-0 z-[80] border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2" onClick={() => navigateTo(AppView.DASHBOARD)}>
          <div className="w-9 h-9 bg-brand-500 rounded-xl flex items-center justify-center text-white shadow-md">
            <Navigation className="w-5 h-5" />
          </div>
          <span className="font-display font-black text-xl tracking-tight text-slate-900 dark:text-white">Nexus</span>
        </div>
        <div className="flex items-center gap-3">
           <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2 text-slate-400">
             {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
           </button>
           <button onClick={() => navigateTo(AppView.PROFILE)} className="w-9 h-9 bg-brand-100 dark:bg-brand-900/40 rounded-xl flex items-center justify-center text-brand-600 dark:text-brand-200 font-bold text-xs">
              {user?.name.charAt(0)}
           </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 h-full overflow-y-auto relative z-10 no-scrollbar pb-24 md:pb-0 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto h-full">
          {view === AppView.DASHBOARD && <Dashboard onChangeView={navigateTo} user={user} />}
          {view === AppView.ROUTES && <OptimizedRoutes onBack={() => setView(AppView.DASHBOARD)} />}
          {view === AppView.CONNECT && <ConnectPeople onBack={() => setView(AppView.DASHBOARD)} currentUser={user || { name: 'Guest' }} />}
          {view === AppView.ORACLE && <NexusOracle onBack={() => setView(AppView.DASHBOARD)} />}
          {view === AppView.PROFILE && <Profile user={user!} onBack={() => setView(AppView.DASHBOARD)} onLogout={() => { setUser(null); setView(AppView.AUTH); }} />}
          {view === AppView.VISION && <VisionaryRoadmap onBack={() => setView(AppView.DASHBOARD)} />}
          {view === AppView.PLAN_AHEAD && <PlanAhead onBack={() => setView(AppView.DASHBOARD)} />}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-6 left-6 right-6 h-16 glass border border-white/40 dark:border-slate-800 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.15)] z-[90] flex items-center justify-around px-2">
        <MobileNavBtn active={view === AppView.DASHBOARD} icon={<Zap className="w-5 h-5"/>} onClick={() => navigateTo(AppView.DASHBOARD)} />
        <MobileNavBtn active={view === AppView.ROUTES} icon={<MapPin className="w-5 h-5"/>} onClick={() => navigateTo(AppView.ROUTES)} />
        <MobileNavBtn active={view === AppView.CONNECT} icon={<Users className="w-5 h-5"/>} onClick={() => navigateTo(AppView.CONNECT)} />
        <MobileNavBtn active={view === AppView.ORACLE} icon={<Mic className="w-5 h-5"/>} onClick={() => navigateTo(AppView.ORACLE)} />
      </nav>
    </div>
  );
};

const SideLink = ({ label, icon, active, onClick }: { label: string, icon: React.ReactNode, active: boolean, onClick: () => void }) => (
  <button onClick={onClick} className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all font-bold text-sm ${active ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/20' : 'text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
    <div className="shrink-0">{icon}</div>
    <span className="hidden lg:block">{label}</span>
  </button>
);

const MobileNavBtn = ({ active, icon, onClick }: { active: boolean, icon: React.ReactNode, onClick: () => void }) => (
  <button onClick={onClick} className={`flex-1 flex flex-col items-center justify-center h-12 rounded-full transition-all ${active ? 'bg-brand-500 text-white shadow-lg' : 'text-slate-400'}`}>
    {icon}
  </button>
);

export default App;
