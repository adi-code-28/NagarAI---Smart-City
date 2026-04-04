import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, 
  MessageSquare, 
  Clock, 
  MapPin, 
  Bus, 
  Info, 
  Upload, 
  Camera, 
  CheckCircle2, 
  AlertCircle,
  TrendingUp,
  Zap,
  Navigation,
  Users,
  Search,
  ArrowRight,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { GoogleGenAI, Type } from "@google/genai";

// --- Utilities ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Types ---
type Tab = 'overview' | 'complaints' | 'queue' | 'transport' | 'about';

interface Complaint {
  id: string;
  title: string;
  category: 'road' | 'garbage' | 'electricity' | 'water' | 'other';
  location: string;
  status: 'open' | 'in_progress' | 'resolved';
  priority: 'critical' | 'high' | 'medium' | 'low';
  score: number;
  time: string;
}

// --- Components ---

const SmartCityAnimation = () => {
  const [isDay, setIsDay] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => setIsDay(prev => !prev), 10000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className={cn(
      "relative w-full h-64 overflow-hidden rounded-2xl border transition-colors duration-1000 shadow-2xl",
      isDay ? "bg-sky-400 border-sky-200" : "bg-slate-950 border-slate-800"
    )}>
      {/* Sun / Moon */}
      <motion.div
        animate={{ 
          y: isDay ? 20 : 150,
          opacity: isDay ? 1 : 0,
          scale: isDay ? 1 : 0.5
        }}
        transition={{ duration: 2, ease: "easeInOut" }}
        className="absolute left-1/4 w-12 h-12 bg-yellow-300 rounded-full shadow-[0_0_30px_#fbbf24]"
      />
      <motion.div
        animate={{ 
          y: isDay ? 150 : 20,
          opacity: isDay ? 0 : 1,
          scale: isDay ? 0.5 : 1
        }}
        transition={{ duration: 2, ease: "easeInOut" }}
        className="absolute right-1/4 w-10 h-10 bg-slate-200 rounded-full shadow-[0_0_20px_#e2e8f0]"
      >
        <div className="absolute top-2 left-2 w-2 h-2 bg-slate-300 rounded-full opacity-50" />
        <div className="absolute bottom-2 right-3 w-3 h-3 bg-slate-300 rounded-full opacity-50" />
      </motion.div>

      {/* Data Streams */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ x: -100, y: 50 + i * 40, opacity: 0 }}
            animate={{ x: 1200, opacity: [0, 0.5, 0] }}
            transition={{ 
              duration: 15 + i * 5, 
              repeat: Infinity, 
              delay: i * 3,
              ease: "linear" 
            }}
            className="absolute h-px w-32 bg-gradient-to-r from-transparent via-blue-400 to-transparent"
          />
        ))}
      </div>

      {/* Clouds / Stars */}
      <div className="absolute inset-0 pointer-events-none">
        {isDay ? (
          <>
            <motion.div animate={{ x: [-20, 500] }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="absolute top-10 text-4xl opacity-40">☁️</motion.div>
            <motion.div animate={{ x: [500, -20] }} transition={{ duration: 25, repeat: Infinity, ease: "linear" }} className="absolute top-20 text-3xl opacity-30">☁️</motion.div>
          </>
        ) : (
          Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              animate={{ opacity: [0.2, 1, 0.2] }}
              transition={{ duration: 2 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 2 }}
              className="absolute w-0.5 h-0.5 bg-white rounded-full"
              style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 60}%` }}
            />
          ))
        )}
      </div>

      {/* Grid Floor */}
      <div 
        className={cn(
          "absolute bottom-0 w-full h-32 transition-colors duration-1000",
          isDay 
            ? "bg-[linear-gradient(to_right,#bae6fd_1px,transparent_1px),linear-gradient(to_bottom,#bae6fd_1px,transparent_1px)]" 
            : "bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)]"
        )}
        style={{ 
          backgroundSize: '40px 40px',
          transform: 'perspective(500px) rotateX(60deg) translateY(0px)', 
          transformOrigin: 'bottom' 
        }}
      />
      
      {/* Buildings */}
      <div className="absolute bottom-12 w-full flex items-end justify-around px-8 gap-2">
        {[80, 120, 60, 160, 100, 140, 70, 110].map((h, i) => (
          <motion.div
            key={i}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: h, opacity: 1 }}
            transition={{ delay: i * 0.1, duration: 0.8, ease: "easeOut" }}
            className={cn(
              "w-8 border-t border-x relative group transition-colors duration-1000",
              isDay ? "bg-slate-200 border-slate-300" : "bg-slate-800 border-slate-700"
            )}
          >
            {/* Windows */}
            <div className="grid grid-cols-2 gap-1 p-1">
              {Array.from({ length: Math.floor(h / 15) }).map((_, j) => (
                <motion.div
                  key={j}
                  animate={{ 
                    backgroundColor: !isDay && Math.random() > 0.6 ? '#fbbf24' : (isDay ? '#cbd5e1' : '#1e293b'),
                    boxShadow: !isDay && Math.random() > 0.6 ? '0 0 8px #fbbf24' : 'none'
                  }}
                  transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse', delay: Math.random() * 2 }}
                  className="w-2 h-2 rounded-sm"
                />
              ))}
            </div>
            {/* Antenna for tall buildings */}
            {h > 120 && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-0.5 h-4 bg-slate-600">
                <motion.div 
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="absolute -top-1 -left-0.5 w-1.5 h-1.5 bg-red-500 rounded-full"
                />
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Moving Cars */}
      <div className="absolute bottom-16 w-full h-4 overflow-hidden">
        <motion.div
          animate={{ x: ['-10%', '110%'] }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="absolute text-xl"
        >
          🚗
        </motion.div>
        <motion.div
          animate={{ x: ['110%', '-10%'] }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear", delay: 2 }}
          className="absolute text-xl scale-x-[-1]"
        >
          🚌
        </motion.div>
      </div>

      {/* Data Points */}
      <AnimatePresence>
        {[
          { x: '20%', y: '40%', color: 'bg-red-500' },
          { x: '50%', y: '30%', color: 'bg-amber-500' },
          { x: '80%', y: '50%', color: 'bg-emerald-500' }
        ].map((p, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
            className={cn("absolute w-3 h-3 rounded-full shadow-lg z-10", p.color)}
            style={{ left: p.x, top: p.y }}
          >
            <div className={cn("absolute inset-0 rounded-full animate-ping", p.color)} />
          </motion.div>
        ))}
      </AnimatePresence>

      <div className="absolute top-4 left-4 flex items-center gap-2 bg-white/80 backdrop-blur px-3 py-1.5 rounded-full border border-slate-200 shadow-sm">
        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
        <span className="text-[10px] font-mono text-slate-600 uppercase tracking-widest">System Live: Delhi NCR</span>
      </div>
    </div>
  );
};

const PotholeAnimation = () => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setStep((prev) => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-40 bg-slate-100 rounded-xl overflow-hidden border border-slate-200">
      {/* Road */}
      <div className="absolute bottom-0 w-full h-20 bg-slate-700">
        <div className="absolute top-1/2 left-0 w-full h-1 border-t-2 border-dashed border-slate-500" />
      </div>

      {/* Pothole / Patch */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        {step === 0 && (
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-16 h-8 bg-slate-900 rounded-full shadow-inner flex items-center justify-center overflow-hidden"
          >
            <div className="w-full h-full bg-[radial-gradient(circle_at_center,#1a1a1a_0%,transparent_70%)] opacity-50" />
          </motion.div>
        )}
        {step >= 2 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-18 h-10 bg-slate-600 rounded-lg border border-slate-500 shadow-sm"
          />
        )}
      </div>

      {/* Worker / Truck */}
      <AnimatePresence>
        {step === 1 && (
          <motion.div
            initial={{ x: -100 }}
            animate={{ x: '50%' }}
            exit={{ x: 500 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute bottom-10 left-0 text-4xl"
          >
            🚛
          </motion.div>
        )}
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-10 left-[55%] text-3xl"
          >
            👷
          </motion.div>
        )}
      </AnimatePresence>

      {/* Status Badge */}
      <div className="absolute top-4 left-4">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className={cn(
            "px-3 py-1 rounded-full text-xs font-medium border",
            step === 0 ? "bg-red-50 border-red-200 text-red-600" :
            step === 1 ? "bg-amber-50 border-amber-200 text-amber-600" :
            step === 2 ? "bg-blue-50 border-blue-200 text-blue-600" :
            "bg-emerald-50 border-emerald-200 text-emerald-600"
          )}
        >
          {step === 0 ? "Pothole Detected" :
           step === 1 ? "Crew Dispatched" :
           step === 2 ? "Repair in Progress" :
           "Resolved Successfully"}
        </motion.div>
      </div>

      {step === 3 && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-4 right-4 text-emerald-500"
        >
          <CheckCircle2 size={24} />
        </motion.div>
      )}
    </div>
  );
};

const QueueAnimation = ({ location = 'General' }: { location?: string }) => {
  const [queue, setQueue] = useState<{ id: number; avatar: string }[]>([]);
  const [waitTime, setWaitTime] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const nextId = useRef(0);
  const intervals = useRef<{ [key: string]: NodeJS.Timeout }>({});

  const avatars = ['👨', '👩', '🧑', '👴', '👵', '👦', '👧', '🧔', '👱‍♂️', '👱‍♀️', '👳‍♂️', '🧕', '👮‍♂️', '👷‍♀️', '👩‍⚕️', '👨‍🏫'];

  const fetchStatus = async () => {
    try {
      const res = await fetch(`/api/queue-status?location=${encodeURIComponent(location)}`);
      const data = await res.json();
      
      const initialQueue = Array.from({ length: Math.min(data.count, 12) }).map(() => ({
        id: nextId.current++,
        avatar: avatars[Math.floor(Math.random() * avatars.length)]
      }));
      
      setQueue(initialQueue);
      setWaitTime(data.waitTime);
      setIsLoading(false);
    } catch (err) {
      console.error("Failed to fetch queue status", err);
      const fallbackCount = 6;
      setQueue(Array.from({ length: fallbackCount }).map(() => ({
        id: nextId.current++,
        avatar: avatars[Math.floor(Math.random() * avatars.length)]
      })));
      setWaitTime(15);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    fetchStatus();
    
    // Main simulation loop
    intervals.current.timer = setInterval(() => {
      if (isProcessing) return;
      
      setIsProcessing(true);
      setProgress(0);
      
      let p = 0;
      intervals.current.progress = setInterval(() => {
        p += 2.5;
        setProgress(p);
        if (p >= 100) {
          clearInterval(intervals.current.progress);
          
          // Delay before removal for visual impact
          setTimeout(() => {
            setQueue(current => {
              const newQueue = [...current];
              newQueue.shift();
              if (newQueue.length < 4) {
                newQueue.push({
                  id: nextId.current++,
                  avatar: avatars[Math.floor(Math.random() * avatars.length)]
                });
              }
              return newQueue;
            });
            setIsProcessing(false);
            setProgress(0);
          }, 300);
        }
      }, 40);
    }, 6000);

    intervals.current.refresh = setInterval(fetchStatus, 60000);

    return () => {
      Object.values(intervals.current).forEach(clearInterval);
    };
  }, [location]);

  return (
    <div className="relative w-full h-48 bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden shadow-inner">
      {isLoading ? (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-50/80 z-50">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Fetching Live Data...</span>
          </div>
        </div>
      ) : null}
      
      {/* Counter */}
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-b from-blue-600 to-blue-800 flex flex-col items-center justify-center text-white z-20 shadow-[-8px_0_20px_rgba(0,0,0,0.1)]">
        <div className="text-[10px] uppercase font-black tracking-widest mb-3 opacity-80">Service Desk</div>
        <div className="relative">
          <motion.div 
            animate={isProcessing ? { scale: [1, 1.1, 1] } : {}}
            className="w-14 h-14 bg-blue-500 rounded-2xl flex items-center justify-center shadow-lg border-2 border-blue-400/50"
          >
            <Users size={28} />
          </motion.div>
          {isProcessing && (
            <motion.div 
              animate={{ scale: [1, 1.5, 1], opacity: [1, 0, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="absolute -top-2 -right-2 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white shadow-sm"
            />
          )}
        </div>
        <div className="mt-4 text-[9px] font-black bg-blue-900/80 px-3 py-1 rounded-full uppercase tracking-tighter border border-blue-700 max-w-[100px] truncate text-center">{location}</div>
        
        {isProcessing && (
          <div className="mt-4 w-24 h-2 bg-blue-950 rounded-full overflow-hidden border border-blue-800 p-0.5">
            <motion.div 
              className="h-full bg-emerald-400 rounded-full shadow-[0_0_10px_#34d399]"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>

      {/* People in Queue */}
      <div className="absolute inset-0 right-32 flex flex-row-reverse items-center justify-start px-12 gap-3">
        <AnimatePresence mode="popLayout">
          {queue.slice(0, 8).map((person, i) => (
            <motion.div
              key={person.id}
              layout
              initial={{ opacity: 0, x: 50, scale: 0.8 }}
              animate={{ 
                opacity: 1, 
                x: 0, 
                scale: 1 - (i * 0.05),
                zIndex: 10 - i
              }}
              exit={{ 
                opacity: 0, 
                x: 100, 
                scale: 1.2, 
                y: -10,
                filter: 'blur(4px)'
              }}
              transition={{ 
                duration: 0.5,
                ease: "circOut"
              }}
              className={cn(
                "w-12 h-16 rounded-t-2xl rounded-b-lg flex flex-col items-center justify-center text-3xl shadow-lg border-b-4 border-black/10 relative",
                i === 0 && isProcessing ? "ring-4 ring-blue-400 ring-offset-2 scale-110 z-30" : ""
              )}
              style={{ 
                backgroundColor: `hsl(${i * 20 + 210}, 70%, 85%)`,
              }}
            >
              <span className="drop-shadow-sm select-none">{person.avatar}</span>
              {i === 0 && isProcessing && (
                <>
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute -top-10 bg-blue-600 text-white px-3 py-1 rounded-full shadow-xl text-[8px] font-black tracking-widest whitespace-nowrap z-40"
                  >
                    PROCESSING
                  </motion.div>
                  <svg className="absolute inset-0 -m-1 w-[calc(100%+8px)] h-[calc(100%+8px)] pointer-events-none rotate-[-90deg]">
                    <motion.circle
                      cx="50%"
                      cy="50%"
                      r="48%"
                      fill="none"
                      stroke="#34d399"
                      strokeWidth="3"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: progress / 100 }}
                      className="drop-shadow-[0_0_5px_#34d399]"
                    />
                  </svg>
                </>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        {queue.length > 10 && (
          <div className="absolute left-8 top-1/2 -translate-y-1/2 flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-500 border-2 border-white shadow-sm">
              +{queue.length - 10}
            </div>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">More in line</span>
          </div>
        )}
      </div>

      {/* Live Stats Overlay */}
      <div className="absolute top-5 left-8 flex gap-10">
        <div className="flex flex-col">
          <span className="text-[9px] text-slate-400 uppercase font-black tracking-widest mb-1">Live Queue</span>
          <motion.div 
            key={`${location}-${queue.length}`}
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="flex items-baseline gap-1"
          >
            <span className="text-3xl font-black text-slate-900">{queue.length}</span>
            <span className="text-[10px] font-bold text-slate-400">PEOPLE</span>
          </motion.div>
        </div>
        <div className="flex flex-col">
          <span className="text-[9px] text-slate-400 uppercase font-black tracking-widest mb-1">Wait Time</span>
          <div className="flex items-baseline gap-1">
            <span className={cn(
              "text-3xl font-black transition-colors",
              queue.length > 30 ? "text-red-500" : queue.length > 15 ? "text-amber-500" : "text-emerald-500"
            )}>
              {waitTime}
            </span>
            <span className="text-[10px] font-bold text-slate-400">MINS</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const RouteAnimation = ({ origin, destination, mode = 'metro' }: { origin: string, destination: string, mode?: string }) => {
  const pathData = "M 100 100 C 300 20, 700 180, 900 100";
  
  const getVehicle = (m: string) => {
    const lower = m.toLowerCase();
    if (lower.includes('metro')) return '🚇';
    if (lower.includes('bus')) return '🚌';
    if (lower.includes('taxi') || lower.includes('auto')) return '🚕';
    return '🚗';
  };

  return (
    <div className="relative w-full h-64 bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl group">
      {/* Map Grid */}
      <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:40px_40px]" />
      
      {/* City Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-5">
        {[...Array(10)].map((_, i) => (
          <div 
            key={i}
            className="absolute bg-slate-700 rounded-sm"
            style={{
              width: Math.random() * 60 + 20,
              height: Math.random() * 60 + 20,
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
              transform: `rotate(${Math.random() * 45}deg)`
            }}
          />
        ))}
      </div>

      <div className="absolute inset-0">
        <svg className="w-full h-full" viewBox="0 0 1000 200" preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="50%" stopColor="#60a5fa" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="4" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Background Path (Solid) */}
          <path
            d={pathData}
            fill="none"
            stroke="#1e293b"
            strokeWidth="4"
            strokeLinecap="round"
            className="opacity-30"
          />
          
          {/* Animated Progress Path */}
          <motion.path
            d={pathData}
            fill="none"
            stroke="url(#routeGradient)"
            strokeWidth="6"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: [0, 1, 1] }}
            transition={{ 
              duration: 6, 
              times: [0, 0.7, 1],
              repeat: Infinity, 
              ease: "easeInOut"
            }}
            filter="url(#glow)"
          />

          {/* Start & End Markers */}
          <g transform="translate(100, 100)">
            <circle r="12" fill="#10b981" fillOpacity="0.2" className="animate-ping" />
            <circle r="6" fill="#10b981" className="shadow-lg shadow-emerald-500/50" />
            <text y="-25" textAnchor="middle" className="text-[10px] font-black fill-emerald-500 uppercase tracking-widest">Origin</text>
          </g>
          
          <g transform="translate(900, 100)">
            <motion.circle 
              r="20" 
              fill="#ef4444" 
              fillOpacity="0.1" 
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <circle r="8" fill="#ef4444" className="shadow-lg shadow-red-500/50" />
            <text y="-25" textAnchor="middle" className="text-[10px] font-black fill-red-500 uppercase tracking-widest">Destination</text>
          </g>

          {/* Vehicle Group */}
          <motion.g
            initial={{ offsetDistance: "0%" }}
            animate={{ offsetDistance: ["0%", "100%", "100%"] }}
            transition={{ 
              duration: 6, 
              times: [0, 0.7, 1],
              repeat: Infinity, 
              ease: "easeInOut"
            }}
            style={{ 
              offsetPath: `path('${pathData}')`,
              WebkitOffsetPath: `path('${pathData}')`,
            }}
          >
            {/* Vehicle Icon */}
            <text 
              x="0" 
              y="0" 
              fontSize="36" 
              className="drop-shadow-[0_0_15px_rgba(59,130,246,0.8)]" 
              style={{ 
                dominantBaseline: 'middle', 
                textAnchor: 'middle',
              }}
            >
              {getVehicle(mode)}
            </text>
            
            {/* Pulsing Aura */}
            <motion.circle 
              r="24" 
              fill="#3b82f6" 
              fillOpacity="0.2" 
              animate={{ scale: [1, 1.4, 1], opacity: [0.4, 0.8, 0.4] }} 
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.g>
        </svg>
      </div>

      {/* Overlays */}
      <div className="absolute top-4 left-6 flex items-center gap-2 bg-slate-900/50 backdrop-blur-sm px-3 py-1 rounded-full border border-slate-800">
        <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
        <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Live Optimization</span>
      </div>

      <div className="absolute bottom-4 left-6 right-6 flex justify-between items-end pointer-events-none">
        <div className="flex flex-col">
          <span className="text-[8px] font-black text-slate-500 uppercase tracking-tighter mb-1">From</span>
          <span className="text-xs font-bold text-slate-200 truncate max-w-[150px]">{origin}</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[8px] font-black text-slate-500 uppercase tracking-tighter mb-1">To</span>
          <span className="text-xs font-bold text-slate-200 truncate max-w-[150px]">{destination}</span>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [aiResult, setAiResult] = useState<any>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [queueLocation, setQueueLocation] = useState('AIIMS Delhi');
  const [venueStatuses, setVenueStatuses] = useState<any[]>([]);
  const [selectedRouteIndex, setSelectedRouteIndex] = useState<number | null>(null);
  const [routeData, setRouteData] = useState({
    origin: 'Dwarka Sector 12',
    destination: 'Connaught Place',
    isCalculating: false,
    results: null as any[] | null
  });

  const calculateRoute = async () => {
    setSelectedRouteIndex(null);
    // Check for API key selection if missing in env
    let apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
    const hasKey = apiKey || ((window as any).aistudio && await (window as any).aistudio.hasSelectedApiKey());
    
    if (!hasKey) {
      console.error("GEMINI_API_KEY is missing");
      if ((window as any).aistudio) {
        await (window as any).aistudio.openSelectKey();
      }
      
      // Fallback immediately if key is missing
      setRouteData(prev => ({ ...prev, isCalculating: false, results: [
        { mode: 'Metro', time: '45 min', cost: '₹40', crowd: 'High', co2: '0.2 kg', efficiency: 92, details: 'Blue Line to Rajiv Chowk', best: true },
        { mode: 'Taxi', time: '65 min', cost: '₹450', crowd: 'Low', co2: '4.5 kg', efficiency: 65, details: 'Via NH-48', best: false },
        { mode: 'Bus', time: '90 min', cost: '₹25', crowd: 'Medium', co2: '1.2 kg', efficiency: 78, details: 'Route 727', best: false }
      ]}));
      return;
    }

    setRouteData(prev => ({ ...prev, isCalculating: true }));
    try {
      // Re-read key to ensure we have the one from the dialog if it was just selected
      const currentKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
      if (!currentKey) {
        throw new Error("API key not found after selection");
      }
      
      const ai = new GoogleGenAI({ apiKey: currentKey });
      const prompt = `Provide 3 real-world transport route options between ${routeData.origin} and ${routeData.destination} in Delhi. 
      Include Metro, Bus, and Taxi/Auto options.
      Respond ONLY with a JSON array of objects:
      [{
        "mode": "metro|bus|taxi",
        "time": "estimated time in mins",
        "cost": "estimated cost in INR",
        "crowd": "low|medium|high",
        "co2": "estimated carbon footprint in kg",
        "efficiency": 0-100,
        "details": "brief description of the route",
        "best": boolean
      }]`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          tools: [{ googleMaps: {} }], 
          toolConfig: {
            retrievalConfig: {
              latLng: {
                latitude: 28.6139,
                longitude: 77.2090
              }
            }
          }
        }
      });

      // Extract JSON from response text (it might be wrapped in markdown)
      const text = response.text || "[]";
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      const results = JSON.parse(jsonMatch ? jsonMatch[0] : (text.includes('[') ? text : "[]"));
      setRouteData(prev => ({ ...prev, results, isCalculating: false }));
    } catch (err) {
      console.error("Route calculation failed", err);
      // If it's an API key error, prompt again
      if (err instanceof Error && err.message.includes("API key") && (window as any).aistudio) {
        await (window as any).aistudio.openSelectKey();
      }
      
      // Fallback to simulation if AI fails
      setRouteData(prev => ({ ...prev, isCalculating: false, results: [
        { mode: 'Metro', time: '45 min', cost: '₹40', crowd: 'High', co2: '0.2 kg', efficiency: 92, details: 'Blue Line to Rajiv Chowk', best: true },
        { mode: 'Taxi', time: '65 min', cost: '₹450', crowd: 'Low', co2: '4.5 kg', efficiency: 65, details: 'Via NH-48', best: false },
        { mode: 'Bus', time: '90 min', cost: '₹25', crowd: 'Medium', co2: '1.2 kg', efficiency: 78, details: 'Route 727', best: false }
      ]}));
    }
  };

  useEffect(() => {
    if (activeTab === 'transport' && !routeData.results) {
      calculateRoute();
    }
  }, [activeTab]);
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    category: 'road' as any,
    description: ''
  });

  useEffect(() => {
    fetchComplaints();
    fetchVenueStatuses();
  }, []);

  const fetchVenueStatuses = async () => {
    const venues = [
      'AIIMS Delhi',
      'Passport Seva Kendra',
      'MCD Civic Centre',
      'Safdarjung Hospital',
      'Max Super Speciality',
      'Delhi University (North)'
    ];
    
    try {
      const results = await Promise.all(venues.map(async (v) => {
        const res = await fetch(`/api/queue-status?location=${encodeURIComponent(v)}`);
        return await res.json();
      }));
      setVenueStatuses(results);
    } catch (err) {
      console.error("Failed to fetch venue statuses", err);
    }
  };

  const fetchComplaints = async () => {
    try {
      const res = await fetch('/api/complaints');
      const data = await res.json();
      setComplaints(data);
    } catch (err) {
      console.error("Failed to fetch complaints", err);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      setUploadedImage(ev.target?.result as string);
      setAiResult(null);
    };
    reader.readAsDataURL(file);
  };

  const analyzeImage = async () => {
    if (!uploadedImage) return;
    setIsAnalyzing(true);
    try {
      const base64 = uploadedImage.split(',')[1];
      const mimeType = uploadedImage.split(';')[0].split(':')[1];
      
      const res = await fetch('/api/analyze-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64, mimeType })
      });
      
      const data = await res.json();
      setAiResult(data);
      setFormData(prev => ({
        ...prev,
        category: data.category || prev.category,
        description: data.description || prev.description
      }));
    } catch (err) {
      console.error("Analysis failed", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const submitComplaint = async () => {
    if (!formData.title || !formData.location) return;
    setIsSubmitting(true);
    try {
      const score = Math.floor(Math.random() * 40) + 60; // Mock score
      const priority = score > 80 ? 'critical' : score > 65 ? 'high' : 'medium';
      
      const res = await fetch('/api/complaints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          status: 'open',
          priority,
          score
        })
      });
      
      if (res.ok) {
        setSubmitSuccess(true);
        setTimeout(() => setSubmitSuccess(false), 3000);
        setFormData({ title: '', location: '', category: 'road', description: '' });
        setUploadedImage(null);
        setAiResult(null);
        fetchComplaints();
        setActiveTab('overview');
      }
    } catch (err) {
      console.error("Submission failed", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const stats = [
    { label: 'Active Issues', value: complaints.filter(c => c.status !== 'resolved').length.toString(), icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-50' },
    { label: 'Resolved Today', value: complaints.filter(c => c.status === 'resolved').length.toString(), icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { label: 'Avg. Response', value: '4.2h', icon: Clock, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'AI Accuracy', value: '94%', icon: Zap, color: 'text-amber-500', bg: 'bg-amber-50' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
              <Building2 className="text-white" size={20} />
            </div>
            <div>
              <h1 className="font-display font-bold text-lg tracking-tight text-slate-900">NagarAI</h1>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Delhi Municipal Intelligence</span>
              </div>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
            {(['overview', 'complaints', 'queue', 'transport', 'about'] as Tab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-4 py-1.5 rounded-lg text-sm font-medium transition-all capitalize",
                  activeTab === tab 
                    ? "bg-white text-blue-600 shadow-sm" 
                    : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
                )}
              >
                {tab}
              </button>
            ))}
          </nav>

          <button className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200">
            <Sparkles size={16} />
            <span>AI Dashboard</span>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Hero Section */}
              <section className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                  <div className="space-y-2">
                    <h2 className="font-display text-4xl font-bold tracking-tight text-slate-900">
                      Smart City <span className="text-blue-600">Intelligence</span>
                    </h2>
                    <p className="text-slate-600 max-w-xl">
                      Harnessing AI to streamline municipal services, predict infrastructure needs, and optimize urban mobility for the citizens of Delhi.
                    </p>
                  </div>
                  <SmartCityAnimation />
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-display font-bold text-slate-900 flex items-center gap-2">
                    <TrendingUp size={18} className="text-blue-600" />
                    Real-time Metrics
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {stats.map((stat, i) => (
                      <div key={i} className="glass-card p-4 rounded-2xl space-y-2">
                        <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", stat.bg)}>
                          <stat.icon size={16} className={stat.color} />
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{stat.label}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="glass-card p-4 rounded-2xl bg-blue-600 text-white border-none shadow-xl shadow-blue-100">
                    <h4 className="font-bold text-sm mb-1">AI Priority Engine</h4>
                    <p className="text-xs text-blue-100 mb-3">Our scoring algorithm ensures critical issues are resolved within 4 hours.</p>
                    <div className="flex items-center justify-between text-[10px] font-mono bg-blue-700/50 p-2 rounded-lg">
                      <span>SCORE = S*0.4 + C*0.3 + L*0.2</span>
                      <ChevronRight size={12} />
                    </div>
                  </div>
                </div>
              </section>

              {/* Module Previews */}
              <section className="grid md:grid-cols-3 gap-6">
                {[
                  { title: 'Civic Complaints', desc: 'Photo-to-resolution in seconds using AI Vision.', icon: Camera, color: 'text-red-500', tab: 'complaints' as Tab },
                  { title: 'Queue Prediction', desc: 'Live wait times for hospitals and govt offices.', icon: Clock, color: 'text-emerald-500', tab: 'queue' as Tab },
                  { title: 'Route Optimizer', desc: 'Multi-modal transport scoring for Delhi journeys.', icon: Navigation, color: 'text-blue-500', tab: 'transport' as Tab },
                ].map((module, i) => (
                  <button 
                    key={i}
                    onClick={() => setActiveTab(module.tab)}
                    className="group glass-card p-6 rounded-2xl text-left hover:border-blue-300 transition-all hover:shadow-md"
                  >
                    <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform", "bg-slate-50")}>
                      <module.icon size={24} className={module.color} />
                    </div>
                    <h4 className="font-bold text-slate-900 mb-2">{module.title}</h4>
                    <p className="text-sm text-slate-600 mb-4">{module.desc}</p>
                    <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider">
                      <span>Explore Module</span>
                      <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </button>
                ))}
              </section>
            </motion.div>
          )}

          {activeTab === 'complaints' && (
            <motion.div
              key="complaints"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="grid lg:grid-cols-3 gap-8"
            >
              <div className="lg:col-span-2 space-y-6">
                <div className="space-y-2">
                  <h2 className="font-display text-3xl font-bold text-slate-900">Smart Complaint System</h2>
                  <p className="text-slate-600">Upload a photo of any civic issue. Our AI will classify it and route it to the correct department instantly.</p>
                </div>
                <PotholeAnimation />
                
                <div 
                  onClick={() => document.getElementById('fileInput')?.click()}
                  className={cn(
                    "glass-card p-8 rounded-2xl border-dashed border-2 flex flex-col items-center justify-center text-center space-y-4 transition-all cursor-pointer group relative overflow-hidden",
                    uploadedImage ? "border-blue-400 bg-blue-50/10" : "border-slate-300 hover:border-blue-400"
                  )}
                >
                  <input 
                    id="fileInput"
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleImageUpload}
                  />
                  
                  {uploadedImage ? (
                    <div className="relative w-full aspect-video rounded-xl overflow-hidden">
                      <img src={uploadedImage} alt="Uploaded" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                        <span className="text-white text-xs font-bold bg-black/50 px-3 py-1 rounded-full backdrop-blur-sm">Change Image</span>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                        <Upload size={32} />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">Upload Complaint Photo</p>
                        <p className="text-sm text-slate-500">Drag and drop or click to browse files</p>
                      </div>
                    </>
                  )}
                </div>

                {uploadedImage && !aiResult && (
                  <button 
                    onClick={analyzeImage}
                    disabled={isAnalyzing}
                    className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 flex items-center justify-center gap-2"
                  >
                    {isAnalyzing ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>AI ANALYZING...</span>
                      </>
                    ) : (
                      <>
                        <Zap size={20} />
                        <span>ANALYZE WITH AI VISION</span>
                      </>
                    )}
                  </button>
                )}

                {aiResult && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card p-6 rounded-2xl bg-emerald-50/50 border-emerald-200"
                  >
                    <div className="flex items-center gap-2 text-emerald-600 mb-4">
                      <Sparkles size={18} />
                      <span className="font-bold text-sm uppercase tracking-wider">AI Analysis Complete</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Category</span>
                        <p className="font-bold text-slate-900 capitalize">{aiResult.category}</p>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Severity</span>
                        <p className={cn(
                          "font-bold",
                          aiResult.severity === 'critical' ? "text-red-600" : "text-amber-600"
                        )}>{aiResult.severity?.toUpperCase()}</p>
                      </div>
                      <div className="col-span-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Description</span>
                        <p className="text-slate-600">{aiResult.description}</p>
                      </div>
                    </div>
                  </motion.div>
                )}

                <div className="glass-card p-6 rounded-2xl space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Title</label>
                      <input 
                        value={formData.title}
                        onChange={e => setFormData(p => ({ ...p, title: e.target.value }))}
                        placeholder="e.g. Broken Street Light"
                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Location</label>
                      <input 
                        value={formData.location}
                        onChange={e => setFormData(p => ({ ...p, location: e.target.value }))}
                        placeholder="e.g. Karol Bagh"
                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <button 
                    onClick={submitComplaint}
                    disabled={isSubmitting || !formData.title || !formData.location}
                    className={cn(
                      "w-full py-3 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2",
                      submitSuccess ? "bg-emerald-600 text-white" : "bg-slate-900 text-white hover:bg-slate-800"
                    )}
                  >
                    {isSubmitting ? "SUBMITTING..." : submitSuccess ? (
                      <>
                        <CheckCircle2 size={18} />
                        <span>SUBMITTED SUCCESSFULLY</span>
                      </>
                    ) : "SUBMIT COMPLAINT"}
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-display font-bold text-slate-900 flex items-center gap-2">
                  <MessageSquare size={18} className="text-blue-600" />
                  Recent Complaints
                </h3>
                <div className="space-y-3">
                  {complaints.map((c) => (
                    <div key={c.id} className="glass-card p-4 rounded-xl space-y-3 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          <div className={cn(
                            "w-8 h-8 rounded-lg flex items-center justify-center",
                            c.priority === 'critical' ? "bg-red-50 text-red-600" : "bg-amber-50 text-amber-600"
                          )}>
                            {c.category === 'road' ? <Navigation size={14} /> : <AlertCircle size={14} />}
                          </div>
                          <div>
                            <h5 className="text-sm font-bold text-slate-900">{c.title}</h5>
                            <p className="text-[10px] text-slate-500 flex items-center gap-1">
                              <MapPin size={10} /> {c.location} • {c.time}
                            </p>
                          </div>
                        </div>
                        <span className={cn(
                          "px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider",
                          c.status === 'in_progress' ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"
                        )}>
                          {c.status.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex gap-1">
                          <span className="px-2 py-0.5 bg-slate-100 rounded text-[9px] font-bold text-slate-600 uppercase tracking-wider">
                            Score: {c.score}
                          </span>
                        </div>
                        <button 
                          onClick={() => setSelectedComplaint(c)}
                          className="text-[10px] font-bold text-blue-600 uppercase tracking-wider hover:underline"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Complaint Details Modal */}
              <AnimatePresence>
                {selectedComplaint && (
                  <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setSelectedComplaint(null)}
                      className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                    />
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: 20 }}
                      className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden"
                    >
                      <div className="p-6 space-y-6">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              "w-12 h-12 rounded-xl flex items-center justify-center",
                              selectedComplaint.priority === 'critical' ? "bg-red-50 text-red-600" : "bg-amber-50 text-amber-600"
                            )}>
                              <AlertCircle size={24} />
                            </div>
                            <div>
                              <h3 className="text-xl font-bold text-slate-900">{selectedComplaint.title}</h3>
                              <p className="text-sm text-slate-500">{selectedComplaint.location}</p>
                            </div>
                          </div>
                          <button 
                            onClick={() => setSelectedComplaint(null)}
                            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                          >
                            <Info size={20} className="text-slate-400" />
                          </button>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-4 bg-slate-50 rounded-2xl">
                            <span className="text-[10px] font-bold text-slate-400 uppercase">Status</span>
                            <p className="font-bold text-slate-900 capitalize">{selectedComplaint.status.replace('_', ' ')}</p>
                          </div>
                          <div className="p-4 bg-slate-50 rounded-2xl">
                            <span className="text-[10px] font-bold text-slate-400 uppercase">Priority</span>
                            <p className={cn(
                              "font-bold capitalize",
                              selectedComplaint.priority === 'critical' ? "text-red-600" : "text-amber-600"
                            )}>{selectedComplaint.priority}</p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <span className="text-[10px] font-bold text-slate-400 uppercase">AI Priority Score</span>
                          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${selectedComplaint.score}%` }}
                              className={cn(
                                "h-full rounded-full",
                                selectedComplaint.score > 80 ? "bg-red-500" : selectedComplaint.score > 60 ? "bg-amber-500" : "bg-blue-500"
                              )}
                            />
                          </div>
                          <div className="flex justify-between text-[10px] font-bold text-slate-500">
                            <span>LOW</span>
                            <span>SCORE: {selectedComplaint.score}</span>
                            <span>CRITICAL</span>
                          </div>
                        </div>

                        <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                          <h4 className="text-xs font-bold text-blue-900 mb-1">Resolution Timeline</h4>
                          <p className="text-xs text-blue-700 leading-relaxed">
                            Based on current load, this issue is expected to be inspected within 4 hours and resolved within 24 hours.
                          </p>
                        </div>
                      </div>
                      <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
                        <button 
                          onClick={() => setSelectedComplaint(null)}
                          className="px-6 py-2 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-colors"
                        >
                          Close Details
                        </button>
                      </div>
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {activeTab === 'queue' && (
            <motion.div
              key="queue"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-8"
            >
              <div className="max-w-3xl mx-auto text-center space-y-4">
                <h2 className="font-display text-3xl font-bold text-slate-900">Queue Prediction System</h2>
                <p className="text-slate-600">Using M/M/1 queue theory to provide real-time wait time estimates for public services across Delhi.</p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display font-bold text-slate-900">Live Simulation</h3>
                    <select 
                      value={queueLocation}
                      onChange={(e) => setQueueLocation(e.target.value)}
                      className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100 outline-none"
                    >
                      <option>AIIMS Delhi</option>
                      <option>Passport Seva Kendra</option>
                      <option>MCD Civic Centre</option>
                      <option>Safdarjung Hospital</option>
                      <option>RTO Janakpuri</option>
                      <option>Delhi High Court</option>
                      <option>New Delhi Railway Station</option>
                      <option>ISBT Kashmiri Gate</option>
                      <option>DDA Head Office</option>
                      <option>LNJP Hospital</option>
                      <option>Max Super Speciality</option>
                      <option>Fortis Hospital</option>
                      <option>Delhi University (North)</option>
                      <option>Tihar Jail (Visitor)</option>
                      <option>Akshardham Temple</option>
                      <option>Delhi Secretariat</option>
                      <option>Vikas Minar (DDA)</option>
                      <option>Ram Manohar Lohia Hospital</option>
                      <option>Guru Teg Bahadur Hospital</option>
                      <option>Indira Gandhi International Airport (T3)</option>
                      <option>Sarojini Nagar Market (Parking)</option>
                      <option>Lajpat Nagar Market (Parking)</option>
                      <option>Connaught Place (Palika Parking)</option>
                      <option>Police Headquarters</option>
                      <option>Delhi Jal Board</option>
                      <option>DTC Headquarters</option>
                      <option>Ambedkar University</option>
                      <option>JNU Campus</option>
                      <option>IIT Delhi</option>
                      <option>National Museum</option>
                      <option>Supreme Court of India</option>
                    </select>
                  </div>
                  <QueueAnimation location={queueLocation} />
                  <div className="glass-card p-6 rounded-2xl space-y-4">
                    <h4 className="font-bold text-sm text-slate-900">How it works</h4>
                    <div className="space-y-3">
                      {[
                        { title: 'Service Rate', desc: 'Average time taken to process one citizen.' },
                        { title: 'Arrival Rate', desc: 'Real-time tracking of people joining the queue.' },
                        { title: 'Time Factor', desc: 'Historical data adjustments for peak hours.' },
                      ].map((item, i) => (
                        <div key={i} className="flex gap-3">
                          <div className="w-5 h-5 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 flex-shrink-0">
                            <CheckCircle2 size={12} />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-900">{item.title}</div>
                            <p className="text-[11px] text-slate-600">{item.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-display font-bold text-slate-900">Public Service Status</h3>
                  <div className="space-y-3">
                    {(venueStatuses.length > 0 ? venueStatuses : [
                      { location: 'AIIMS Delhi', waitTime: 180, status: 'critical', load: 92 },
                      { location: 'Passport Seva Kendra', waitTime: 45, status: 'normal', load: 45 },
                      { location: 'MCD Civic Centre', waitTime: 15, status: 'low', load: 12 },
                      { location: 'Safdarjung Hospital', waitTime: 120, status: 'high', load: 78 },
                      { location: 'Max Super Speciality', waitTime: 90, status: 'high', load: 65 },
                      { location: 'Delhi University (North)', waitTime: 10, status: 'low', load: 8 },
                    ]).map((venue, i) => (
                      <div key={i} className="glass-card p-4 rounded-xl flex items-center justify-between group hover:border-blue-200 transition-all">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400 group-hover:text-blue-500 transition-colors">
                            <Building2 size={20} />
                          </div>
                          <div>
                            <h5 className="text-sm font-bold text-slate-900">{venue.location || venue.name}</h5>
                            <div className="flex items-center gap-2">
                              <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <div 
                                  className={cn(
                                    "h-full rounded-full",
                                    venue.load > 80 ? "bg-red-500" : venue.load > 50 ? "bg-amber-500" : "bg-emerald-500"
                                  )} 
                                  style={{ width: `${venue.load}%` }}
                                />
                              </div>
                              <span className="text-[10px] font-bold text-slate-500">{venue.load}%</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={cn(
                            "text-sm font-bold",
                            venue.status === 'critical' ? "text-red-500" : venue.status === 'high' ? "text-amber-500" : "text-emerald-500"
                          )}>
                            {venue.waitTime || venue.wait} min
                          </div>
                          <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Wait Time</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'transport' && (
            <motion.div
              key="transport"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                  <div className="space-y-2">
                    <h2 className="font-display text-3xl font-bold text-slate-900">Transport Optimizer</h2>
                    <p className="text-slate-600">Multi-modal route scoring considering time, crowd density, cost, and carbon footprint.</p>
                  </div>
                  <RouteAnimation 
                    origin={routeData.origin} 
                    destination={routeData.destination} 
                    mode={selectedRouteIndex !== null && routeData.results ? routeData.results[selectedRouteIndex].mode : 'metro'} 
                  />
                  
                  <div className="glass-card p-6 rounded-2xl grid md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Origin</label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                        <select 
                          value={routeData.origin}
                          onChange={(e) => setRouteData(p => ({ ...p, origin: e.target.value, results: null }))}
                          className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                          <option>Dwarka Sector 12</option>
                          <option>Rohini Sector 3</option>
                          <option>Janakpuri West</option>
                          <option>Karol Bagh</option>
                          <option>Lajpat Nagar</option>
                          <option>Pitampura</option>
                          <option>Vasant Kunj</option>
                          <option>Saket District Centre</option>
                          <option>Mayur Vihar Ph-1</option>
                          <option>Paschim Vihar</option>
                          <option>Okhla Phase III</option>
                          <option>Red Fort</option>
                          <option>India Gate</option>
                          <option>Lotus Temple</option>
                          <option>Qutub Minar</option>
                          <option>Akshardham</option>
                          <option>Preet Vihar</option>
                          <option>Model Town</option>
                          <option>Greater Kailash</option>
                          <option>Malviya Nagar</option>
                          <option>Kalkaji</option>
                          <option>Sarita Vihar</option>
                          <option>Vikaspuri</option>
                          <option>Uttam Nagar</option>
                        </select>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Destination</label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                        <select 
                          value={routeData.destination}
                          onChange={(e) => setRouteData(p => ({ ...p, destination: e.target.value, results: null }))}
                          className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                          <option>Connaught Place</option>
                          <option>Gurgaon Cyber City</option>
                          <option>Noida Sector 62</option>
                          <option>Indira Gandhi Airport</option>
                          <option>Hauz Khas</option>
                          <option>Red Fort</option>
                          <option>India Gate</option>
                          <option>Akshardham Temple</option>
                          <option>Lotus Temple</option>
                          <option>Qutub Minar</option>
                          <option>Janakpuri West</option>
                          <option>Karol Bagh</option>
                          <option>Lajpat Nagar</option>
                          <option>Jama Masjid</option>
                          <option>Humayun Tomb</option>
                          <option>Lodhi Garden</option>
                          <option>Jantar Mantar</option>
                          <option>Rashtrapati Bhavan</option>
                          <option>National War Memorial</option>
                          <option>Waste to Wonder Park</option>
                          <option>Garden of Five Senses</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex items-end">
                      <button 
                        onClick={calculateRoute}
                        disabled={routeData.isCalculating}
                        className="w-full bg-blue-600 text-white py-2 rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-100 flex items-center justify-center gap-2"
                      >
                        {routeData.isCalculating ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>CALCULATING...</span>
                          </>
                        ) : "Optimize Route"}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-display font-bold text-slate-900">Recommended Routes</h3>
                  <div className="space-y-3">
                    {routeData.results ? routeData.results.map((route, i) => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        onClick={() => setSelectedRouteIndex(i)}
                        className={cn(
                          "glass-card p-4 rounded-xl space-y-3 border-2 transition-all cursor-pointer",
                          selectedRouteIndex === i ? "border-blue-500 bg-blue-50/30 shadow-lg shadow-blue-100" : 
                          route.best && selectedRouteIndex === null ? "border-blue-500/50 bg-blue-50/10" : "border-transparent hover:border-slate-200"
                        )}
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <div className={cn(
                              "p-1.5 rounded-lg",
                              route.best ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-500"
                            )}>
                              {route.mode.toLowerCase().includes('metro') ? <TrendingUp size={14} /> : route.mode.toLowerCase().includes('bus') ? <Bus size={14} /> : <Navigation size={14} />}
                            </div>
                            <span className="text-sm font-bold text-slate-900">{route.mode}</span>
                          </div>
                          {route.best && <span className="bg-blue-600 text-white text-[8px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest">Best Pick</span>}
                        </div>
                        
                        <p className="text-[10px] text-slate-500 leading-tight italic">{route.details}</p>

                        <div className="grid grid-cols-4 gap-2 text-center pt-2 border-t border-slate-100">
                          <div>
                            <div className="text-xs font-bold text-slate-900">{route.time}</div>
                            <div className="text-[8px] text-slate-500 uppercase font-bold">Time</div>
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-900">{route.cost}</div>
                            <div className="text-[8px] text-slate-500 uppercase font-bold">Fare</div>
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-900">{route.crowd}</div>
                            <div className="text-[8px] text-slate-500 uppercase font-bold">Crowd</div>
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-900">{route.co2}</div>
                            <div className="text-[8px] text-slate-500 uppercase font-bold">CO₂</div>
                          </div>
                        </div>
                      </motion.div>
                    )) : (
                      <div className="glass-card p-8 rounded-xl border-dashed border-2 border-slate-200 flex flex-col items-center justify-center text-center text-slate-400">
                        <Navigation size={32} className="mb-2 opacity-20" />
                        <p className="text-xs font-bold uppercase tracking-widest">Select origin & destination to see routes</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'about' && (
            <motion.div
              key="about"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-3xl mx-auto space-y-8"
            >
              <div className="text-center space-y-4">
                <h2 className="font-display text-3xl font-bold text-slate-900">Project NagarAI</h2>
                <p className="text-slate-600">A next-generation civic intelligence platform designed for the Hackathon 2026, Track 5: Smart Public Services.</p>
              </div>

              <div className="space-y-6">
                {[
                  { title: 'The Problem', desc: 'Delhi generates 20,000+ civic complaints per month with a 72-hour average response time. Citizens waste 2-3 hours daily in government queues with zero visibility.', color: 'bg-red-500' },
                  { title: 'The Solution', desc: 'NagarAI provides an AI-powered ecosystem: Smart Complaint routing via Vision AI, Queue prediction using mathematical modeling, and CO2-aware transport optimization.', color: 'bg-blue-500' },
                  { title: 'The Impact', desc: '60% reduction in resolution time, 35% reduction in wasted queue time, and a significant push towards sustainable public transport adoption.', color: 'bg-emerald-500' },
                ].map((item, i) => (
                  <div key={i} className="glass-card p-6 rounded-2xl flex gap-6">
                    <div className={cn("w-1 h-auto rounded-full", item.color)} />
                    <div className="space-y-2">
                      <h4 className="font-display font-bold text-slate-900">{item.title}</h4>
                      <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-center pt-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-full text-xs font-bold text-slate-500 uppercase tracking-widest">
                  <Info size={14} />
                  <span>Version 1.0.4 · Build 2026.04.03</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="max-w-7xl mx-auto px-4 py-12 border-t border-slate-200">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 opacity-50">
            <Building2 size={16} />
            <span className="text-xs font-bold uppercase tracking-widest">NagarAI © 2026</span>
          </div>
          <div className="flex gap-8">
            <a href="#" className="text-xs font-bold text-slate-400 hover:text-blue-600 uppercase tracking-widest transition-colors">Privacy Policy</a>
            <a href="#" className="text-xs font-bold text-slate-400 hover:text-blue-600 uppercase tracking-widest transition-colors">Terms of Service</a>
            <a href="#" className="text-xs font-bold text-slate-400 hover:text-blue-600 uppercase tracking-widest transition-colors">Contact Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
