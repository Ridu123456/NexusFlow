
import React from 'react';
import { ChevronLeft, Zap, Server, Globe, Activity, ArrowRight, Navigation, Shield, Users } from './Icons';

interface VisionaryRoadmapProps {
  onBack: () => void;
}

const VisionaryRoadmap: React.FC<VisionaryRoadmapProps> = ({ onBack }) => {
  return (
    <div className="p-6 md:p-12 min-h-full flex flex-col animate-fade-in max-w-7xl mx-auto space-y-16 pb-32">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <button onClick={onBack} className="group self-start flex items-center gap-4 p-3 pr-8 bg-white dark:bg-slate-900 rounded-[1.5rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-brand-500/30 transition-all">
          <div className="w-10 h-10 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center group-hover:bg-brand-500 group-hover:text-white transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </div>
          <span className="font-bold text-sm text-slate-700 dark:text-slate-300">Hub Overview</span>
        </button>
        <div className="text-right">
          <h2 className="text-4xl md:text-6xl font-display font-black text-slate-900 dark:text-white tracking-tighter leading-none">
            Architectural <span className="text-brand-500 italic">Vision</span>
          </h2>
          <p className="text-slate-400 font-black text-[10px] uppercase tracking-[0.3em] mt-3 opacity-60">NexusFlow Technical Roadmap v1.0 - v3.0</p>
        </div>
      </div>

      {/* Hero: The Unified Stack */}
      <div className="bg-slate-900 dark:bg-brand-500 rounded-[3.5rem] p-10 md:p-20 text-white relative overflow-hidden shadow-2xl">
         <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.1)_0%,transparent_50%)]"></div>
         
         <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="animate-slide-up">
               <span className="inline-flex px-4 py-1.5 bg-white/10 backdrop-blur-md text-white rounded-full text-[10px] font-black uppercase tracking-widest mb-8 border border-white/10">
                 The Core Intelligence
               </span>
               <h3 className="text-5xl font-display font-black mb-8 tracking-tight leading-[1.1]">The Urban Intelligence Mesh</h3>
               <p className="text-white/70 text-lg leading-relaxed mb-10 font-medium">
                 NexusFlow isn't just an interface; it's a distributed coordination engine. We've built the foundation for a city-wide operating system that harmonizes individual transit needs with collective urban efficiency.
               </p>
               
               <div className="flex flex-col gap-8">
                  <StackLayer 
                    number="03" 
                    title="Reasoning Layer" 
                    desc="Gemini 3 Pro handles complex multimodal synthesis and group fare negotiation."
                  />
                  <StackLayer 
                    number="02" 
                    title="Real-Time Sync" 
                    desc="High-frequency streams for sub-second peer matching across the mesh network."
                  />
                  <StackLayer 
                    number="01" 
                    title="Trust Protocol" 
                    desc="Distributed reputation shards and cryptographic identity verification nodes."
                  />
               </div>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
               <VisionMetric icon={<Zap />} value="< 2s" label="Sync Latency" />
               <VisionMetric icon={<Server />} value="Edge" label="Nodes Active" />
               <VisionMetric icon={<Globe />} value="Global" label="Mesh Scale" />
               <VisionMetric icon={<Activity />} value="Auto" label="Optimized" />
            </div>
         </div>
      </div>

      {/* Roadmap Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         <RoadmapCard 
           phase="Phase 01"
           title="Social Transit"
           status="LIVE"
           items={["Multimodal Engine", "Commute Buddy Sync", "Identity Verification"]}
           color="border-brand-100"
         />
         <RoadmapCard 
           phase="Phase 02"
           title="Autonomous Link"
           status="Q4 2024"
           items={["AI Agent Negotiation", "IoT Transit Integration", "Escrow Fare Pooling"]}
           color="border-indigo-100"
         />
         <RoadmapCard 
           phase="Phase 03"
           title="Urban Autonomy"
           status="VISION 2026"
           items={["Fleet Orchestration", "Predictive Demand Mesh", "ZKP Privacy Shield"]}
           color="border-emerald-100"
         />
      </div>

      {/* Footer Call to Action */}
      <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-12 md:p-16 border border-slate-100 dark:border-slate-800 text-center flex flex-col items-center shadow-sm">
         <div className="w-16 h-16 bg-brand-50 dark:bg-brand-900/20 rounded-[1.5rem] flex items-center justify-center text-brand-500 mb-8 shadow-xl shadow-brand-500/5">
            <Activity className="w-8 h-8" />
         </div>
         <h3 className="text-3xl md:text-4xl font-display font-black text-slate-900 dark:text-white mb-5 tracking-tight">Built for Scale. Designed for Cities.</h3>
         <p className="text-slate-500 dark:text-slate-400 max-w-2xl mb-12 font-medium leading-relaxed">
           Our mesh architecture handles 100k+ concurrent travel sessions, aiming to reduce urban congestion by an estimated 40% when adopted at network scale.
         </p>
         <button onClick={onBack} className="bg-slate-900 dark:bg-brand-500 text-white px-12 py-5 rounded-2xl font-bold shadow-2xl hover:bg-black dark:hover:bg-brand-600 active:scale-[0.98] transition-all flex items-center gap-4">
           Back to Overview <ArrowRight className="w-5 h-5" />
         </button>
      </div>
    </div>
  );
};

const StackLayer = ({ number, title, desc }: { number: string, title: string, desc: string }) => (
  <div className="flex gap-6 group">
     <div className="text-white font-display font-black text-2xl group-hover:scale-110 transition-transform opacity-40">{number}</div>
     <div>
        <h4 className="font-bold text-white text-lg mb-1">{title}</h4>
        <p className="text-white/50 text-sm leading-relaxed font-medium">{desc}</p>
     </div>
  </div>
);

const VisionMetric = ({ icon, value, label }: { icon: React.ReactNode, value: string, label: string }) => (
  <div className="bg-white/5 backdrop-blur-2xl p-8 rounded-[2.5rem] border border-white/10 flex flex-col items-center text-center group hover:bg-white/10 transition-all shadow-lg">
     <div className="text-white/40 mb-4 group-hover:text-white transition-colors group-hover:scale-110 duration-500">{icon}</div>
     <div className="text-3xl font-display font-black mb-1">{value}</div>
     <div className="text-[10px] font-black uppercase tracking-widest text-white/30">{label}</div>
  </div>
);

const RoadmapCard = ({ phase, title, status, items, color }: { phase: string, title: string, status: string, items: string[], color: string }) => (
  <div className={`bg-white dark:bg-slate-900 p-10 rounded-[3rem] border-2 ${color} dark:border-slate-800 shadow-sm flex flex-col h-full hover:shadow-2xl transition-all duration-700 group`}>
     <div className="text-[10px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-[0.25em] mb-2">{phase}</div>
     <h4 className="text-2xl font-display font-black text-slate-900 dark:text-white mb-8 tracking-tight">{title}</h4>
     <div className="flex-1 space-y-4">
        {items.map((item, i) => (
           <div key={i} className="flex items-center gap-4 text-slate-500 dark:text-slate-400 font-bold text-sm">
              <div className="w-1.5 h-1.5 bg-brand-500 rounded-full group-hover:scale-150 transition-transform"></div>
              {item}
           </div>
        ))}
     </div>
     <div className="mt-12 pt-8 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between">
        <span className={`text-[9px] font-black uppercase tracking-widest ${status === 'LIVE' ? 'text-emerald-500' : 'text-slate-300 dark:text-slate-600'} italic`}>{status}</span>
        <ArrowRight className="w-4 h-4 text-slate-200 dark:text-slate-700" />
     </div>
  </div>
);

export default VisionaryRoadmap;
