
import React, { useState, useEffect } from 'react';
import { AppView } from './types';
import Intro from './components/Intro';
import Dashboard from './components/Dashboard';
import OptimizedRoutes from './components/OptimizedRoutes';
import ConnectPeople from './components/ConnectPeople';
import PlanAhead from './components/PlanAhead';
import Profile from './components/Profile';
import { ChevronLeft, Navigation, MapPin, Users, ArrowRight, Calendar } from './components/Icons';
import { storageService } from './services/storageService';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.INTRO);
  const [user, setUser] = useState<{ name: string; email: string } | null>(storageService.getUser());
  const [authMode, setAuthMode] = useState<'LOGIN' | 'SIGNUP'>('LOGIN');
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    storageService.saveUser(user);
  }, [user]);

  const navigateTo = (targetView: AppView) => {
    const protectedViews = [AppView.ROUTES, AppView.CONNECT, AppView.PLAN_AHEAD, AppView.PROFILE];
    if (protectedViews.includes(targetView) && !user) {
      setAuthMode('LOGIN');
      setView(AppView.AUTH);
    } else {
      setView(targetView);
    }
  };

  const renderContent = () => {
    switch (view) {
      case AppView.DASHBOARD: return <Dashboard onChangeView={navigateTo} user={user} />;
      case AppView.ROUTES: return <OptimizedRoutes onBack={() => setView(AppView.DASHBOARD)} />;
      case AppView.CONNECT: return <ConnectPeople onBack={() => setView(AppView.DASHBOARD)} currentUser={user || { name: 'Guest' }} />;
      case AppView.PLAN_AHEAD: return <PlanAhead onBack={() => setView(AppView.DASHBOARD)} />;
      case AppView.PROFILE: return <Profile user={user!} onBack={() => setView(AppView.DASHBOARD)} onLogout={() => { setUser(null); setView(AppView.DASHBOARD); }} />;
      case AppView.AUTH: return (
        <div className="p-8 h-full flex flex-col justify-center items-center slide-up max-w-md mx-auto">
          <div className="w-full bg-white p-10 rounded-[2.5rem] shadow-2xl border border-slate-100">
            <h2 className="text-4xl font-display font-extrabold text-urban-900 mb-8 tracking-tight">
              {authMode === 'LOGIN' ? 'Welcome' : 'Join Us'}
            </h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);
              const email = formData.get('email') as string;
              const name = formData.get('name') as string;
              setUser({ name: name || email.split('@')[0], email });
              setView(AppView.DASHBOARD);
            }} className="space-y-4">
              {authMode === 'SIGNUP' && (
                <input name="name" type="text" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-urban-indigo transition-all" placeholder="Your Name" required />
              )}
              <input name="email" type="email" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-urban-indigo transition-all" placeholder="Email Address" required />
              <input name="password" type="password" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-urban-indigo transition-all" placeholder="Password" required />
              <button type="submit" className="w-full bg-urban-900 text-white font-bold py-5 rounded-2xl shadow-xl mt-4 hover:bg-black transition-all">
                {authMode === 'LOGIN' ? 'Sign In' : 'Create Account'}
              </button>
            </form>
            <button onClick={() => setAuthMode(authMode === 'LOGIN' ? 'SIGNUP' : 'LOGIN')} className="mt-8 text-center w-full text-slate-400 font-bold hover:text-urban-indigo text-sm">
              {authMode === 'LOGIN' ? "Don't have an account? Sign Up" : "Already have an account? Log In"}
            </button>
          </div>
        </div>
      );
      default: return <div>Unknown View</div>;
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row overflow-hidden font-sans text-slate-900">
      {view === AppView.INTRO && <Intro onComplete={() => setView(AppView.DASHBOARD)} />}

      {/* Hide Sidebar during Intro */}
      {view !== AppView.INTRO && (
        <aside className="hidden md:flex flex-col w-24 lg:w-72 bg-white border-r border-slate-100 h-screen p-8 z-50">
          <div onClick={() => setView(AppView.DASHBOARD)} className="flex items-center gap-3 mb-16 cursor-pointer group">
            <div className="w-12 h-12 bg-urban-900 rounded-2xl flex items-center justify-center text-white shadow-xl group-hover:scale-110 transition-transform">
               <Navigation className="w-6 h-6" />
            </div>
            <span className="hidden lg:block text-2xl font-display font-extrabold tracking-tighter text-urban-900">NexusFlow</span>
          </div>

          <nav className="space-y-4">
            <NavBtn active={view === AppView.DASHBOARD} icon={<div className="w-5 h-5 border-2 border-current rounded-md" />} label="Home" onClick={() => navigateTo(AppView.DASHBOARD)} />
            <NavBtn active={view === AppView.ROUTES} icon={<MapPin className="w-5 h-5" />} label="Routes" onClick={() => navigateTo(AppView.ROUTES)} />
            <NavBtn active={view === AppView.PLAN_AHEAD} icon={<Calendar className="w-5 h-5" />} label="Schedule" onClick={() => navigateTo(AppView.PLAN_AHEAD)} />
            <NavBtn active={view === AppView.CONNECT} icon={<Users className="w-5 h-5" />} label="Connect" onClick={() => navigateTo(AppView.CONNECT)} />
          </nav>

          {user ? (
            <button onClick={() => setView(AppView.PROFILE)} className="mt-auto flex items-center gap-4 p-2 bg-slate-50 rounded-2xl border border-slate-100 group transition-all hover:bg-white hover:shadow-lg">
              <div className="w-12 h-12 bg-urban-indigo rounded-xl text-white flex items-center justify-center font-black shadow-lg shadow-indigo-200">
                {user.name.charAt(0)}
              </div>
              <div className="hidden lg:block text-left overflow-hidden">
                <p className="text-sm font-bold text-urban-900 truncate">{user.name}</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Profile</p>
              </div>
            </button>
          ) : (
            <button onClick={() => { setAuthMode('LOGIN'); setView(AppView.AUTH); }} className="mt-auto w-full py-4 bg-urban-900 text-white rounded-2xl font-bold transition-all hover:bg-black shadow-xl">
               Sign In
            </button>
          )}
        </aside>
      )}

      <main className="flex-1 h-[100dvh] overflow-hidden relative flex flex-col">
        {/* Hide Mobile Header during Intro */}
        {view !== AppView.INTRO && (
          <header className="md:hidden glass border-b border-slate-100 p-6 flex items-center justify-between z-50">
             <div onClick={() => setView(AppView.DASHBOARD)} className="flex items-center gap-3">
                <Navigation className="w-8 h-8 text-urban-900" />
                <span className="font-display font-extrabold text-xl tracking-tighter">NexusFlow</span>
             </div>
             {user && (
               <button onClick={() => setView(AppView.PROFILE)} className="w-10 h-10 bg-urban-indigo rounded-xl text-white flex items-center justify-center font-bold">
                 {user.name.charAt(0)}
               </button>
             )}
          </header>
        )}
        <div className="flex-1 overflow-auto bg-slate-50/30">
           {renderContent()}
        </div>
      </main>
    </div>
  );
};

const NavBtn = ({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) => (
  <button onClick={onClick} className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all ${active ? 'bg-indigo-50 text-urban-indigo font-bold shadow-sm' : 'text-slate-400 hover:text-urban-900 hover:bg-slate-50'}`}>
    <div className={active ? "text-urban-indigo scale-110" : ""}>{icon}</div>
    <span className="hidden lg:block text-sm">{label}</span>
  </button>
);

export default App;