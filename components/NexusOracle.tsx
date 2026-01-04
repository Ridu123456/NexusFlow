
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { Mic, Brain, ChevronLeft, Zap, Navigation } from './Icons';

interface NexusOracleProps {
  onBack: () => void;
}

const NexusOracle: React.FC<NexusOracleProps> = ({ onBack }) => {
  const [isActive, setIsActive] = useState(false);
  const [transcriptionHistory, setTranscriptionHistory] = useState<string[]>([]);
  const [isConnecting, setIsConnecting] = useState(false);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const sessionRef = useRef<any>(null);

  const toggleSession = async () => {
    if (isActive) stopSession();
    else startSession();
  };

  const decode = (base64: string) => {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
    return bytes;
  };

  const decodeAudioData = async (data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number) => {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
    for (let channel = 0; channel < numChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < frameCount; i++) channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
    return buffer;
  };

  const encode = (bytes: Uint8Array) => btoa(String.fromCharCode(...bytes));

  const createBlob = (data: Float32Array) => {
    const int16 = new Int16Array(data.length);
    for (let i = 0; i < data.length; i++) int16[i] = data[i] * 32768;
    return { data: encode(new Uint8Array(int16.buffer)), mimeType: 'audio/pcm;rate=16000' };
  };

  const startSession = async () => {
    if (!process.env.API_KEY) {
      alert("API key required.");
      return;
    }
    setIsConnecting(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      audioContextRef.current = outputCtx;

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        callbacks: {
          onopen: () => {
            const source = inputCtx.createMediaStreamSource(stream);
            const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
            scriptProcessor.onaudioprocess = (e) => {
              const pcmBlob = createBlob(e.inputBuffer.getChannelData(0));
              sessionPromise.then(session => session.sendRealtimeInput({ media: pcmBlob }));
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputCtx.destination);
            setIsConnecting(false);
            setIsActive(true);
          },
          onmessage: async (m: LiveServerMessage) => {
            const base64Audio = m.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (base64Audio) {
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputCtx.currentTime);
              const audioBuffer = await decodeAudioData(decode(base64Audio), outputCtx, 24000, 1);
              const source = outputCtx.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(outputCtx.destination);
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += audioBuffer.duration;
              sourcesRef.current.add(source);
            }
            if (m.serverContent?.outputTranscription) setTranscriptionHistory(p => [...p.slice(-4), `Oracle: ${m.serverContent?.outputTranscription?.text}`]);
            if (m.serverContent?.inputTranscription) setTranscriptionHistory(p => [...p.slice(-4), `You: ${m.serverContent?.inputTranscription?.text}`]);
            if (m.serverContent?.interrupted) {
              sourcesRef.current.forEach(s => s.stop());
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }
          },
          onclose: () => { setIsActive(false); setIsConnecting(false); },
          onerror: (e) => console.error(e),
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } },
          systemInstruction: 'You are Nexus Oracle, a helpful city co-pilot. Direct, smart, and futuristic.',
          inputAudioTranscription: {},
          outputAudioTranscription: {},
        }
      });
      sessionRef.current = sessionPromise;
    } catch (err) {
      console.error(err);
      setIsConnecting(false);
    }
  };

  const stopSession = () => {
    if (sessionRef.current) sessionRef.current.then((s: any) => s.close());
    setIsActive(false);
  };

  useEffect(() => () => stopSession(), []);

  return (
    <div className="p-6 md:p-12 h-full flex flex-col items-center justify-center animate-fade-in bg-white dark:bg-slate-950 no-scrollbar">
      <div className="flex items-center justify-between w-full max-w-5xl mb-12">
         <button onClick={onBack} className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
            <ChevronLeft className="w-6 h-6 text-slate-400" />
         </button>
         <div className="text-right">
            <h2 className="text-3xl font-display font-black text-slate-900 dark:text-white tracking-tight">Nexus Oracle</h2>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-500 mt-2">AI Voice Assistant</p>
         </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-2xl">
         <div className="relative mb-20">
            <div className={`w-64 h-64 md:w-80 md:h-80 rounded-full flex items-center justify-center transition-all duration-1000 ${isActive ? 'scale-110 shadow-[0_0_80px_rgba(79,70,229,0.3)]' : 'scale-100'}`}>
                {/* Aura rings */}
                <div className={`absolute inset-0 border-2 border-brand-500/10 rounded-full transition-all duration-1000 ${isActive ? 'animate-pulse' : 'opacity-0'}`}></div>
                
                <button 
                  onClick={toggleSession}
                  disabled={isConnecting}
                  className={`relative z-10 w-48 h-48 md:w-60 md:h-60 rounded-full flex flex-col items-center justify-center transition-all duration-500 active:scale-95 shadow-2xl ${isActive ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900' : 'bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white hover:bg-white dark:hover:bg-slate-800 border border-slate-100 dark:border-slate-800'}`}
                >
                  {isConnecting ? (
                    <div className="animate-spin border-4 border-brand-500 border-t-transparent w-10 h-10 rounded-full"></div>
                  ) : isActive ? (
                    <>
                       <div className="flex gap-1.5 mb-4 items-end h-8">
                          {[1,2,3,4,5,6].map(i => (
                            <div key={i} className={`w-1.5 bg-current rounded-full animate-bounce`} style={{ animationDelay: `${i * 0.1}s`, height: `${30 + Math.random() * 50}%` }}></div>
                          ))}
                       </div>
                       <span className="text-[10px] font-black uppercase tracking-[0.2em]">Listening</span>
                    </>
                  ) : (
                    <>
                      <Mic className="w-10 h-10 mb-4 text-brand-500" />
                      <span className="text-[10px] font-black uppercase tracking-[0.2em]">Invoke Oracle</span>
                    </>
                  )}
                </button>
            </div>
         </div>

         <div className="w-full space-y-4 min-h-[160px]">
            {transcriptionHistory.length === 0 && !isActive && (
              <p className="text-center text-slate-400 text-sm font-medium italic opacity-60">
                "Nexus, find me the fastest split to Terminal 2."
              </p>
            )}
            <div className="flex flex-col gap-3">
              {transcriptionHistory.map((text, i) => (
                <div key={i} className={`p-5 rounded-2xl text-sm font-medium animate-slide-up shadow-sm border ${text.startsWith('Oracle') ? 'bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-300 border-brand-100 dark:border-brand-800 self-start max-w-[90%]' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-50 dark:border-slate-800 self-end text-right max-w-[90%]'}`}>
                  {text}
                </div>
              ))}
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl mt-12 pb-10">
         <OracleFeature icon={<Navigation className="w-5 h-5" />} label="Hands-Free Sync" />
         <OracleFeature icon={<Zap className="w-5 h-5" />} label="Zero-Latency" />
         <OracleFeature icon={<Brain className="w-5 h-5" />} label="Predictive Nodes" />
      </div>
    </div>
  );
};

const OracleFeature = ({ icon, label }: { icon: React.ReactNode, label: string }) => (
  <div className="bg-slate-50/50 dark:bg-slate-900/50 p-6 rounded-3xl border border-slate-50 dark:border-slate-800 flex flex-col items-center text-center hover:bg-white dark:hover:bg-slate-900 transition-all shadow-sm">
     <div className="text-brand-500 mb-3">{icon}</div>
     <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">{label}</span>
  </div>
);

export default NexusOracle;
