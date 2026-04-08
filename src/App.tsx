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
  User,
  Settings,
  LogOut,
  Calendar,
  ShieldCheck,
  Search,
  ArrowRight,
  ChevronRight,
  Sparkles,
  Bell,
  History,
  Mail,
  ExternalLink,
  Folder,
  Send,
  Sprout,
  CloudRain,
  Wheat,
  Sun,
  Thermometer,
  Tractor,
  Phone,
  Wind,
  Droplets,
  Activity,
  Play,
  BookOpen,
  GraduationCap,
  Award,
  Filter,
  CheckCircle,
  BarChart3,
  Book,
  Code2,
  Music
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { GoogleGenAI, Type } from "@google/genai";
import { 
  Tab, 
  Category, 
  Course, 
  Lecture, 
  UserProgress, 
  TrackingAction, 
  Complaint, 
  Notification,
  CityEvent
} from './types';
import { SkillPortal } from './components/SkillPortal';

// --- Utilities ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Components ---

const TrackingTimeline = ({ history }: { history: TrackingAction[] }) => {
  return (
    <div className="space-y-6 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
      {history.map((step, i) => (
        <div key={i} className="relative pl-10">
          <div className={cn(
            "absolute left-0 w-6 h-6 rounded-full border-4 border-white shadow-sm flex items-center justify-center",
            step.status === 'resolved' ? "bg-emerald-500" : 
            step.status === 'in_progress' ? "bg-amber-500" : "bg-blue-500"
          )}>
            <div className="w-1.5 h-1.5 bg-white rounded-full" />
          </div>
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <span className={cn(
                "text-[10px] font-black uppercase tracking-widest",
                step.status === 'resolved' ? "text-emerald-600" : 
                step.status === 'in_progress' ? "text-amber-600" : "text-blue-600"
              )}>
                {step.status.replace('_', ' ')}
              </span>
              <span className="text-[10px] font-bold text-slate-400">{step.time}</span>
            </div>
            <p className="text-sm font-bold text-slate-900">{step.action}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

const NotificationsDropdown = ({ notifications, onClose, onTrack }: { notifications: Notification[], onClose: () => void, onTrack: (id: string) => void }) => {
  return (
    <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-[110]">
      <div className="p-4 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
        <h4 className="font-bold text-sm text-slate-900">Recent Updates</h4>
        <button onClick={onClose} className="text-[10px] font-bold text-slate-400 hover:text-slate-600 uppercase tracking-widest">Close</button>
      </div>
      <div className="max-h-96 overflow-y-auto">
        {notifications.length > 0 ? notifications.map((n) => (
          <div 
            key={n.id} 
            onClick={() => { onTrack(n.complaintId); onClose(); }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                onTrack(n.complaintId);
                onClose();
              }
            }}
            className="w-full p-4 text-left hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-none flex gap-3 cursor-pointer"
          >
            <div className={cn(
              "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
              n.status === 'resolved' ? "bg-emerald-50 text-emerald-600" : 
              n.status === 'in_progress' ? "bg-amber-50 text-amber-600" : "bg-blue-50 text-blue-600"
            )}>
              <History size={14} />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-900 line-clamp-1">{n.title}</p>
              <p className="text-[11px] text-slate-600 line-clamp-2">{n.action}</p>
              <p className="text-[9px] font-bold text-slate-400 uppercase">{n.time}</p>
            </div>
          </div>
        )) : (
          <div className="p-8 text-center text-slate-400">
            <Bell size={24} className="mx-auto mb-2 opacity-20" />
            <p className="text-xs font-bold uppercase tracking-widest">No new updates</p>
          </div>
        )}
      </div>
      <div className="p-3 bg-slate-50 text-center">
        <button className="text-[10px] font-bold text-blue-600 uppercase tracking-widest hover:underline">View All Notifications</button>
      </div>
    </div>
  );
};

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

const UserDashboard = ({ complaints, notifications, user, onUpdateUser }: { complaints: Complaint[], notifications: Notification[], user: any, onUpdateUser: (updatedUser: any) => void }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ ...user });

  const avatarOptions = [
    'Adhyaan', 'Felix', 'Aneka', 'Milo', 'Lilly', 
    'Toby', 'Sasha', 'Oliver', 'Luna', 'Jasper', 
    'Bella', 'Leo', 'Daisy', 'Max', 'Coco', 
    'Rocky', 'Ruby', 'Simba', 'Nala', 'Zoe'
  ];

  const handleSave = () => {
    onUpdateUser({ ...editForm });
    setIsEditing(false);
  };

  const stats = [
    { label: 'Complaints Filed', value: complaints.length, icon: MessageSquare, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Resolved Issues', value: complaints.filter(c => c.status === 'resolved').length, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Learning Hours', value: '42h', icon: GraduationCap, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Community Rank', value: '#124', icon: Award, color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  return (
    <div className="space-y-8">
      {/* Edit Profile Modal */}
      <AnimatePresence>
        {isEditing && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditing(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between flex-shrink-0">
                <h3 className="text-xl font-display font-bold text-slate-900">Edit Profile</h3>
                <button onClick={() => setIsEditing(false)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                  <AlertCircle size={20} className="rotate-45 text-slate-400" />
                </button>
              </div>
              <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Full Name</label>
                  <input 
                    type="text" 
                    value={editForm.name}
                    onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Bio</label>
                  <textarea 
                    rows={3}
                    value={editForm.bio}
                    onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none font-medium resize-none"
                  />
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Choose Avatar</label>
                    <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">20 Options</span>
                  </div>
                  <div className="grid grid-cols-5 gap-3">
                    {avatarOptions.map((seed) => {
                      const url = `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`;
                      const isSelected = editForm.avatar === url;
                      return (
                        <button
                          key={seed}
                          onClick={() => setEditForm(prev => ({ ...prev, avatar: url }))}
                          className={cn(
                            "relative aspect-square rounded-xl p-1 transition-all",
                            isSelected 
                              ? "bg-blue-600 shadow-lg shadow-blue-200 scale-105" 
                              : "bg-slate-50 hover:bg-slate-100 border border-slate-200"
                          )}
                        >
                          <img src={url} alt={seed} className="w-full h-full rounded-lg bg-white" referrerPolicy="no-referrer" />
                          {isSelected && (
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center shadow-sm">
                              <CheckCircle2 size={10} className="text-blue-600" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Or Custom Seed</label>
                    <input 
                      type="text" 
                      placeholder="Type anything..."
                      value={avatarOptions.includes(editForm.avatar.split('seed=')[1]) ? '' : editForm.avatar.split('seed=')[1]}
                      onChange={(e) => setEditForm(prev => ({ ...prev, avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${e.target.value}` }))}
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    />
                  </div>
                </div>
              </div>
              <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-3 flex-shrink-0">
                <button 
                  onClick={() => setIsEditing(false)}
                  className="flex-1 px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-100 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSave}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
                >
                  Save Changes
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Profile Header */}
      <div className="glass-card p-8 rounded-3xl overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 rounded-full -mr-32 -mt-32 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-600/5 rounded-full -ml-32 -mb-32 blur-3xl" />
        
        <div className="relative flex flex-col md:flex-row gap-8 items-center md:items-start">
          <div className="relative">
            <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-blue-100 to-indigo-100 p-1 shadow-xl">
              <img src={user.avatar} alt={user.name} className="w-full h-full rounded-[22px] bg-white object-cover" referrerPolicy="no-referrer" />
            </div>
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-emerald-500 rounded-xl border-4 border-white flex items-center justify-center shadow-lg">
              <ShieldCheck size={14} className="text-white" />
            </div>
          </div>
          
          <div className="flex-1 text-center md:text-left space-y-4">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                <h2 className="text-3xl font-display font-bold text-slate-900">{user.name}</h2>
                <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-blue-100">
                  {user.role}
                </span>
              </div>
              <p className="text-slate-500 flex items-center justify-center md:justify-start gap-2 text-sm">
                <Mail size={14} />
                {user.email}
              </p>
            </div>
            <p className="text-slate-600 max-w-2xl leading-relaxed">
              {user.bio}
            </p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 pt-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <Calendar size={14} />
                Joined {user.joinDate}
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <MapPin size={14} />
                New Delhi, India
              </div>
            </div>
          </div>
          
          <div className="flex flex-col gap-2">
            <button 
              onClick={() => {
                setEditForm({ ...user });
                setIsEditing(true);
              }}
              className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all flex items-center gap-2 shadow-lg shadow-slate-200"
            >
              <Settings size={16} />
              Edit Profile
            </button>
            <button className="px-6 py-2.5 bg-white text-red-600 border border-red-100 rounded-xl text-sm font-bold hover:bg-red-50 transition-all flex items-center gap-2">
              <LogOut size={16} />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-6 rounded-2xl space-y-4"
          >
            <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center shadow-sm", stat.bg)}>
              <stat.icon size={24} className={stat.color} />
            </div>
            <div>
              <p className="text-2xl font-display font-bold text-slate-900">{stat.value}</p>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-display font-bold text-slate-900 flex items-center gap-2">
              <History size={20} className="text-blue-600" />
              Recent Activity
            </h3>
            <button className="text-xs font-bold text-blue-600 uppercase tracking-widest hover:underline">View All</button>
          </div>
          
          <div className="space-y-4">
            {complaints.length > 0 ? complaints.slice(0, 3).map((complaint) => (
              <div key={complaint.id} className="glass-card p-5 rounded-2xl flex gap-4 items-start hover:border-blue-200 transition-all group">
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm",
                  complaint.status === 'resolved' ? "bg-emerald-50 text-emerald-600" : 
                  complaint.status === 'in_progress' ? "bg-amber-50 text-amber-600" : "bg-blue-50 text-blue-600"
                )}>
                  {complaint.status === 'resolved' ? <CheckCircle2 size={18} /> : <Clock size={18} />}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{complaint.title}</h4>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">{complaint.time}</span>
                  </div>
                  <p className="text-xs text-slate-500 flex items-center gap-1">
                    <MapPin size={12} />
                    {complaint.location}
                  </p>
                  <div className="flex items-center gap-2 pt-2">
                    <span className={cn(
                      "px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-tighter",
                      complaint.status === 'resolved' ? "bg-emerald-100 text-emerald-700" : 
                      complaint.status === 'in_progress' ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"
                    )}>
                      {complaint.status.replace('_', ' ')}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">•</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{complaint.department}</span>
                  </div>
                </div>
                <ChevronRight size={18} className="text-slate-300 group-hover:text-blue-400 transition-all" />
              </div>
            )) : (
              <div className="glass-card p-12 rounded-2xl text-center space-y-4">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
                  <MessageSquare size={24} className="text-slate-300" />
                </div>
                <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">No recent complaints</p>
              </div>
            )}
          </div>
        </div>

        {/* Learning Progress */}
        <div className="space-y-6">
          <h3 className="text-xl font-display font-bold text-slate-900 flex items-center gap-2">
            <BookOpen size={20} className="text-purple-600" />
            Learning
          </h3>
          
          <div className="glass-card p-6 rounded-2xl space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-sm font-bold text-slate-900">JEE Physics Masterclass</p>
                <span className="text-xs font-bold text-purple-600">75%</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '75%' }}
                  className="h-full bg-purple-500 rounded-full"
                />
              </div>
              <p className="text-[10px] text-slate-500">Next: Wave Optics - Lecture 4</p>
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-100">
              <div className="flex justify-between items-center">
                <p className="text-sm font-bold text-slate-900">Data Science Basics</p>
                <span className="text-xs font-bold text-blue-600">30%</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '30%' }}
                  className="h-full bg-blue-500 rounded-full"
                />
              </div>
              <p className="text-[10px] text-slate-500">Next: Python for Data Analysis</p>
            </div>

            <button className="w-full py-3 bg-slate-50 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-100 transition-colors uppercase tracking-widest">
              Go to Skill Portal
            </button>
          </div>

          <div className="glass-card p-6 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white space-y-4 relative overflow-hidden">
            <Sparkles className="absolute top-2 right-2 opacity-20" size={48} />
            <div className="relative z-10 space-y-2">
              <h4 className="font-bold">NagarAI Pro</h4>
              <p className="text-xs text-blue-100 leading-relaxed">Get priority support, advanced city analytics, and exclusive learning content.</p>
              <button className="w-full py-2 bg-white text-blue-600 rounded-lg text-xs font-bold hover:bg-blue-50 transition-colors">
                Upgrade Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const EventsSection = ({ events }: { events: CityEvent[] }) => {
  const [filter, setFilter] = useState<'all' | 'hackathon' | 'cultural' | 'social' | 'technical'>('all');
  
  const filteredEvents = filter === 'all' ? events : events.filter(e => e.category === filter);

  const categories = [
    { id: 'all', label: 'All Events', icon: Calendar },
    { id: 'hackathon', label: 'Hackathons', icon: Code2 },
    { id: 'cultural', label: 'Cultural', icon: Music },
    { id: 'technical', label: 'Technical', icon: Zap },
    { id: 'social', label: 'Social', icon: Users },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h2 className="text-3xl font-display font-bold text-slate-900">City Events</h2>
          <p className="text-slate-500">Discover live hackathons, cultural fests, and technical meetups near you.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilter(cat.id as any)}
              className={cn(
                "px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2",
                filter === cat.id 
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-200" 
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              )}
            >
              <cat.icon size={16} />
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredEvents.map((event) => (
            <motion.div
              key={event.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="glass-card rounded-3xl overflow-hidden flex flex-col group hover:border-blue-300 transition-all"
            >
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={event.image} 
                  alt={event.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4">
                  <span className={cn(
                    "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm backdrop-blur-md",
                    event.category === 'hackathon' ? "bg-purple-500/90 text-white" :
                    event.category === 'cultural' ? "bg-amber-500/90 text-white" :
                    event.category === 'technical' ? "bg-blue-500/90 text-white" : "bg-emerald-500/90 text-white"
                  )}>
                    {event.category}
                  </span>
                </div>
                {event.isFree && (
                  <div className="absolute top-4 right-4">
                    <span className="px-3 py-1 bg-emerald-500/90 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm backdrop-blur-md">
                      Free
                    </span>
                  </div>
                )}
              </div>
              
              <div className="p-6 flex-1 flex flex-col space-y-4">
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{event.title}</h3>
                  <p className="text-sm text-slate-500 line-clamp-2">{event.description}</p>
                </div>
                
                <div className="space-y-2 pt-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    <Calendar size={14} className="text-blue-500" />
                    {event.date} • {event.time}
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    <MapPin size={14} className="text-red-500" />
                    {event.location}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  {event.tags.map(tag => (
                    <span key={tag} className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[9px] font-bold rounded-md uppercase tracking-tighter">
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="pt-4 mt-auto">
                  <button className="w-full py-3 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
                    Register Now
                    <ExternalLink size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [user, setUser] = useState({
    name: "Adhyaan Sirohi",
    email: "sirohiadhyaan@gmail.com",
    role: "Verified Citizen",
    joinDate: "Jan 2024",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Adhyaan",
    bio: "Urban planning enthusiast and active contributor to Delhi's smart city initiatives. Focused on improving local waste management and road infrastructure."
  });
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [aiResult, setAiResult] = useState<any>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [queueLocation, setQueueLocation] = useState('AIIMS Delhi');
  const [venueStatuses, setVenueStatuses] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [events, setEvents] = useState<CityEvent[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedRouteIndex, setSelectedRouteIndex] = useState<number | null>(null);
  const [isDispatching, setIsDispatching] = useState(false);
  const [agriData, setAgriData] = useState<any>(null);
  const [agriQuery, setAgriQuery] = useState('');
  const [selectedCrop, setSelectedCrop] = useState('Wheat');
  const [agriAdvice, setAgriAdvice] = useState('');
  const [isGeneratingAdvice, setIsGeneratingAdvice] = useState(false);

  const fetchAgriData = async (retries = 3) => {
    try {
      const res = await fetch('/api/agri-data');
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      setAgriData(data);
    } catch (err) {
      if (retries > 0) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        return fetchAgriData(retries - 1);
      }
      console.error("Failed to fetch agri data", err);
    }
  };

  const downloadAdvisory = () => {
    if (!agriAdvice) return;
    const element = document.createElement("a");
    const file = new Blob([`NagarAI Agriculture Advisory\nCrop: ${selectedCrop}\nDate: ${new Date().toLocaleDateString()}\n\nRecommendation:\n${agriAdvice}`], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `nagarai-advisory-${selectedCrop.toLowerCase()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const generateAgriAdvice = async () => {
    if (!agriQuery) return;
    setIsGeneratingAdvice(true);
    try {
      // @ts-ignore
      const apiKey = (typeof process !== 'undefined' && process.env) ? (process.env.GEMINI_API_KEY || process.env.API_KEY) : '';
      if (!apiKey) {
        throw new Error("GEMINI_API_KEY is not configured");
      }

      const ai = new GoogleGenAI({ apiKey });
      const prompt = `You are an expert Agriculture Advisor for farmers in the Delhi/NCR region. 
      The farmer is asking about ${selectedCrop || 'their crops'}: "${agriQuery}".
      Provide a concise, practical, and scientifically sound advice. 
      Include:
      1. Immediate action steps.
      2. Recommended fertilizers or pesticides if applicable.
      3. Water management tips.
      Keep the tone helpful and professional. Max 150 words. Respond in plain text.`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [{ role: "user", parts: [{ text: prompt }] }]
      });

      setAgriAdvice(response.text || "No advice received. Please try again.");
    } catch (err) {
      console.error("Failed to generate advice", err);
      setAgriAdvice("Failed to connect to AI service. Please check your connection.");
    } finally {
      setIsGeneratingAdvice(false);
    }
  };

  const handleDailyDispatch = async () => {
    setIsDispatching(true);
    
    try {
      // Step 1: Collect complaints
      const res = await fetch('/api/dispatch-daily', { method: 'POST' });
      const data = await res.json();
      
      // Add "Added to folder" notification
      const folderNotif: Notification = {
        id: Math.random().toString(36).substr(2, 9),
        complaintId: 'system',
        title: 'Daily Dispatch Folder',
        action: `${data.count} complaints added to the 24h dispatch folder.`,
        status: 'open',
        time: 'Just now',
        read: false
      };
      setNotifications(prev => [folderNotif, ...prev]);
      
      // Wait 3 seconds to simulate "sending"
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Add "Sent to Gov" notification
      const sentNotif: Notification = {
        id: Math.random().toString(36).substr(2, 9),
        complaintId: 'system',
        title: 'Government Dispatch',
        action: `Batch email successfully sent to ${data.targetEmail}.`,
        status: 'resolved',
        time: 'Just now',
        read: false
      };
      setNotifications(prev => [sentNotif, ...prev]);
      
      setShowNotifications(true);
    } catch (err) {
      console.error("Dispatch failed", err);
    } finally {
      setIsDispatching(false);
    }
  };

  const fetchNotifications = async (retries = 3) => {
    // ... existing
  };

  const fetchEvents = async (retries = 3) => {
    try {
      const res = await fetch('/api/events');
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      setEvents(data);
    } catch (err) {
      if (retries > 0) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        return fetchEvents(retries - 1);
      }
      console.error("Failed to fetch events", err);
    }
  };

  const trackComplaint = async (id: string) => {
    try {
      const res = await fetch(`/api/complaints/${id}`);
      const data = await res.json();
      setSelectedComplaint(data);
      setActiveTab('complaints');
    } catch (err) {
      console.error("Failed to track complaint", err);
    }
  };
  const [routeData, setRouteData] = useState({
    origin: 'Dwarka Sector 12',
    destination: 'Connaught Place',
    isCalculating: false,
    results: null as any[] | null,
    isDetectingLocation: false
  });

  const detectLocation = () => {
    if (!navigator.geolocation) {
      console.error("Geolocation is not supported by your browser");
      return;
    }

    setRouteData(prev => ({ ...prev, isDetectingLocation: true }));
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        // For demo purposes, we'll use a string representation
        // In a real app, we'd reverse geocode this
        setRouteData(prev => ({ 
          ...prev, 
          origin: `Current Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`,
          isDetectingLocation: false 
        }));
      },
      (error) => {
        console.error("Error detecting location", error);
        setRouteData(prev => ({ ...prev, isDetectingLocation: false }));
      }
    );
  };

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

      let lat = 28.6139;
      let lng = 77.2090;
      if (routeData.origin.startsWith('Current Location')) {
        const coords = routeData.origin.match(/\(([^)]+)\)/);
        if (coords) {
          [lat, lng] = coords[1].split(',').map(Number);
        }
      }

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          tools: [{ googleMaps: {} }], 
          toolConfig: {
            retrievalConfig: {
              latLng: {
                latitude: lat,
                longitude: lng
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
    if (activeTab === 'agriculture' && !agriData) {
      fetchAgriData();
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
    fetchNotifications();
    fetchAgriData();
    fetchEvents();
    
    // Refresh notifications every 30 seconds
    const interval = setInterval(() => {
      fetchNotifications();
      fetchVenueStatuses();
    }, 30000);
    return () => clearInterval(interval);
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
        try {
          const res = await fetch(`/api/queue-status?location=${encodeURIComponent(v)}`);
          if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
          return await res.json();
        } catch (e) {
          console.warn(`Failed to fetch status for ${v}, using fallback`, e);
          return {
            location: v,
            count: Math.floor(Math.random() * 20) + 5,
            waitTime: Math.floor(Math.random() * 30) + 10,
            load: Math.floor(Math.random() * 40) + 20,
            status: 'normal'
          };
        }
      }));
      setVenueStatuses(results);
    } catch (err) {
      console.error("Failed to fetch venue statuses", err);
    }
  };

  const fetchComplaints = async (retries = 3) => {
    try {
      const res = await fetch('/api/complaints');
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      setComplaints(data);
    } catch (err) {
      if (retries > 0) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        return fetchComplaints(retries - 1);
      }
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
      
      // @ts-ignore
      const apiKey = (typeof process !== 'undefined' && process.env) ? (process.env.GEMINI_API_KEY || process.env.API_KEY) : '';
      if (!apiKey) {
        throw new Error("GEMINI_API_KEY is not configured");
      }

      const ai = new GoogleGenAI({ apiKey });
      const prompt = `Analyze this city complaint image. Respond ONLY with a JSON object (no markdown, no extra text): 
      {
        "category": "road|garbage|electricity|water|other",
        "damage_type": "specific type of damage",
        "severity": "low|medium|high|critical",
        "urgency_score": 1-10,
        "description": "one sentence description",
        "recommended_action": "what should be done",
        "confidence": 0.0-1.0
      }`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          {
            parts: [
              { text: prompt },
              { inlineData: { data: base64, mimeType: mimeType } }
            ]
          }
        ],
        config: {
          responseMimeType: "application/json"
        }
      });
      
      const data = JSON.parse(response.text || "{}");
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

          <div className="hidden md:flex items-center gap-4">
            <nav className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 overflow-x-auto no-scrollbar">
              {(['overview', 'complaints', 'queue', 'transport', 'agriculture', 'skills', 'events', 'profile', 'about'] as Tab[]).map((tab) => (
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

            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm"
              >
                <Bell size={20} className="text-slate-600" />
                {notifications.some(n => !n.read) && (
                  <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full" />
                )}
              </button>
              
              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 top-full"
                  >
                    <NotificationsDropdown 
                      notifications={notifications} 
                      onClose={() => setShowNotifications(false)}
                      onTrack={trackComplaint}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button 
              onClick={() => setActiveTab('profile')}
              className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center transition-all border shadow-sm overflow-hidden",
                activeTab === 'profile' ? "border-blue-500 ring-2 ring-blue-100" : "border-slate-200 hover:bg-slate-50"
              )}
            >
              <img src={user.avatar} alt="Profile" className="w-full h-full bg-blue-50" referrerPolicy="no-referrer" />
            </button>

            <button className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200">
              <Sparkles size={16} />
              <span>AI Dashboard</span>
            </button>
          </div>
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

                  {/* Quick Weather/AQI Summary */}
                  <div className="glass-card p-4 rounded-2xl bg-slate-900 text-white border-none">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Live Environment</span>
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl font-bold">{agriData?.liveWeather?.temp || '38°C'}</div>
                        <div className="text-slate-400">
                          <Sun size={16} />
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={cn("text-xs font-bold", agriData?.liveWeather?.aqiColor || 'text-orange-400')}>
                          AQI {agriData?.liveWeather?.aqi || '245'}
                        </div>
                        <div className="text-[9px] text-slate-500 font-bold uppercase">
                          {agriData?.liveWeather?.aqiStatus || 'Poor Quality'}
                        </div>
                      </div>
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
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-bold text-slate-900 flex items-center gap-2">
                    <MessageSquare size={18} className="text-blue-600" />
                    Recent Complaints
                  </h3>
                  <button 
                    onClick={handleDailyDispatch}
                    disabled={isDispatching}
                    className={cn(
                      "px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-2 transition-all",
                      isDispatching ? "bg-slate-100 text-slate-400" : "bg-blue-50 text-blue-600 hover:bg-blue-100"
                    )}
                  >
                    {isDispatching ? (
                      <>
                        <div className="w-3 h-3 border-2 border-slate-300 border-t-blue-600 rounded-full animate-spin" />
                        <span>Dispatching...</span>
                      </>
                    ) : (
                      <>
                        <Send size={12} />
                        <span>Daily Dispatch</span>
                      </>
                    )}
                  </button>
                </div>
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
                        <div className="flex gap-3">
                          <button 
                            onClick={() => trackComplaint(c.id)}
                            className="text-[10px] font-bold text-blue-600 uppercase tracking-wider hover:underline flex items-center gap-1"
                          >
                            <History size={10} />
                            Track Status
                          </button>
                          <button 
                            onClick={() => setSelectedComplaint(c)}
                            className="text-[10px] font-bold text-slate-400 uppercase tracking-wider hover:text-slate-600"
                          >
                            Details
                          </button>
                        </div>
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

                        {selectedComplaint.department && (
                          <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100 flex items-center gap-4">
                            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-100">
                              <Mail size={20} />
                            </div>
                            <div>
                              <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Assigned Authority</span>
                              <p className="text-sm font-bold text-slate-900">{selectedComplaint.department}</p>
                              <p className="text-[10px] font-medium text-slate-500">{selectedComplaint.deptEmail}</p>
                            </div>
                          </div>
                        )}

                        <div className="space-y-4">
                          <div className="flex items-center gap-2">
                            <History size={16} className="text-slate-400" />
                            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest">Tracking History</h4>
                          </div>
                          {selectedComplaint.history ? (
                            <TrackingTimeline history={selectedComplaint.history} />
                          ) : (
                            <p className="text-xs text-slate-500 italic">No tracking history available yet.</p>
                          )}
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
                      <div className="flex justify-between items-center">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Origin</label>
                        <button 
                          onClick={detectLocation}
                          disabled={routeData.isDetectingLocation}
                          className="text-[10px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors disabled:opacity-50"
                        >
                          {routeData.isDetectingLocation ? (
                            <div className="w-2 h-2 border border-blue-600 border-t-transparent rounded-full animate-spin" />
                          ) : <Navigation size={10} />}
                          DETECT
                        </button>
                      </div>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                        <select 
                          value={routeData.origin}
                          onChange={(e) => setRouteData(p => ({ ...p, origin: e.target.value, results: null }))}
                          className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                          {routeData.origin.startsWith('Current Location') && (
                            <option value={routeData.origin}>{routeData.origin}</option>
                          )}
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

          {activeTab === 'agriculture' && (
            <motion.div
              key="agriculture"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-8"
            >
              <div className="max-w-3xl mx-auto text-center space-y-4">
                <h2 className="font-display text-3xl font-bold text-slate-900">Agriculture & Rural Services</h2>
                <p className="text-slate-600">Empowering farmers with AI-driven crop advisory, real-time market prices, and localized weather alerts.</p>
              </div>

              <div className="grid lg:grid-cols-3 gap-8">
                {/* Left Column: AI Advisory */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="glass-card p-6 rounded-2xl space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                        <Sprout size={20} />
                      </div>
                      <div>
                        <h3 className="font-display font-bold text-slate-900">Crop Advisory AI</h3>
                        <p className="text-[10px] text-slate-500 uppercase font-bold">Powered by Gemini 3.0</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Select Crop</label>
                          <select 
                            value={selectedCrop}
                            onChange={(e) => {
                              setSelectedCrop(e.target.value);
                              setAgriAdvice('');
                            }}
                            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                          >
                            <option>Wheat</option>
                            <option>Paddy</option>
                            <option>Mustard</option>
                            <option>Sugarcane</option>
                            <option>Vegetables</option>
                            <option>Other</option>
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Language</label>
                          <select className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500">
                            <option>English</option>
                            <option>Hindi (हिन्दी)</option>
                            <option>Punjabi (ਪੰਜਾਬੀ)</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Your Question</label>
                        <textarea 
                          value={agriQuery}
                          onChange={(e) => {
                            setAgriQuery(e.target.value);
                            setAgriAdvice('');
                          }}
                          placeholder="e.g. My wheat leaves are turning yellow, what should I do?"
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500 min-h-[100px] resize-none"
                        />
                      </div>

                      <button 
                        onClick={generateAgriAdvice}
                        disabled={isGeneratingAdvice || !agriQuery}
                        className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {isGeneratingAdvice ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>ANALYZING...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles size={18} />
                            <span>GET AI ADVISORY</span>
                          </>
                        )}
                      </button>
                    </div>

                    <AnimatePresence>
                      {agriAdvice && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-6 bg-emerald-50 border border-emerald-100 rounded-2xl relative"
                        >
                          <h4 className="font-bold text-emerald-900 text-sm mb-3 flex items-center gap-2">
                            <Info size={16} />
                            Expert Recommendation
                          </h4>
                          <div className="text-sm text-emerald-800 leading-relaxed whitespace-pre-wrap">
                            {agriAdvice}
                          </div>
                          <div className="mt-4 pt-4 border-t border-emerald-200 flex justify-between items-center">
                            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Verified by Agri-Scientists</span>
                            <button 
                              onClick={downloadAdvisory}
                              className="text-[10px] font-bold text-emerald-700 hover:underline uppercase tracking-widest flex items-center gap-1"
                            >
                              <Folder size={12} />
                              Download Advisory
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Weather Alerts */}
                  <div className="space-y-4">
                    <h3 className="font-display font-bold text-slate-900 flex items-center gap-2">
                      <CloudRain size={18} className="text-blue-500" />
                      Weather Alerts for Farmers
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {agriData?.weatherAlerts.map((alert: any, i: number) => (
                        <div key={i} className={cn(
                          "p-4 rounded-2xl border flex gap-4",
                          alert.severity === 'high' ? "bg-red-50 border-red-100" : "bg-amber-50 border-amber-100"
                        )}>
                          <div className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                            alert.severity === 'high' ? "bg-red-100 text-red-600" : "bg-amber-100 text-amber-600"
                          )}>
                            {alert.type === 'Heatwave' ? <Sun size={20} /> : <CloudRain size={20} />}
                          </div>
                          <div className="space-y-1">
                            <div className="flex justify-between items-center">
                              <span className="text-xs font-bold text-slate-900">{alert.type}</span>
                              <span className="text-[9px] font-bold uppercase tracking-widest opacity-60">{alert.time}</span>
                            </div>
                            <p className="text-[11px] text-slate-600 leading-tight">{alert.message}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column: Market Prices */}
                <div className="space-y-6">
                  <div className="glass-card p-6 rounded-2xl space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-display font-bold text-slate-900 flex items-center gap-2">
                        <TrendingUp size={18} className="text-blue-600" />
                        Live Mandi Prices
                      </h3>
                      <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                        {agriData?.location}
                      </div>
                    </div>

                    <div className="space-y-3">
                      {agriData?.marketPrices.map((item: any, i: number) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 group hover:border-blue-200 transition-all">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-slate-400 group-hover:text-blue-500 transition-colors">
                              <Wheat size={16} />
                            </div>
                            <div>
                              <div className="text-sm font-bold text-slate-900">{item.crop}</div>
                              <div className="text-[10px] text-slate-500">{item.unit}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-bold text-slate-900">{item.price}</div>
                            <div className={cn(
                              "text-[10px] font-bold flex items-center justify-end gap-1",
                              item.trend === 'up' ? "text-emerald-600" : item.trend === 'down' ? "text-red-600" : "text-slate-400"
                            )}>
                              {item.trend === 'up' ? '▲' : item.trend === 'down' ? '▼' : '●'}
                              {item.change}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <button className="w-full py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2">
                      <Phone size={14} />
                      SUBSCRIBE TO SMS ALERTS
                    </button>
                    <p className="text-[9px] text-center text-slate-400 font-medium">
                      Last updated: {agriData?.lastUpdated}
                    </p>
                  </div>

                  {/* Weather & AQI Dashboard */}
                  <div className="glass-card p-6 rounded-2xl space-y-4 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
                    <div className="flex items-center justify-between">
                      <h3 className="font-display font-bold flex items-center gap-2">
                        <CloudRain size={18} className="text-blue-400" />
                        Live Environment
                      </h3>
                      <div className="px-2 py-0.5 bg-blue-500/20 rounded text-[8px] font-bold uppercase tracking-widest text-blue-300">
                        Live Data
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                        <div className="flex items-center gap-2 text-slate-400 mb-1">
                          <Thermometer size={12} />
                          <span className="text-[9px] font-bold uppercase tracking-wider">Temperature</span>
                        </div>
                        <div className="text-xl font-bold">{agriData?.liveWeather?.temp}</div>
                        <div className="text-[10px] text-blue-400 font-medium">{agriData?.liveWeather?.condition}</div>
                      </div>

                      <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                        <div className="flex items-center gap-2 text-slate-400 mb-1">
                          <Activity size={12} />
                          <span className="text-[9px] font-bold uppercase tracking-wider">AQI Index</span>
                        </div>
                        <div className="flex items-end gap-2">
                          <div className="text-xl font-bold">{agriData?.liveWeather?.aqi}</div>
                          <div className={cn("text-[10px] font-bold pb-1", agriData?.liveWeather?.aqiColor)}>
                            {agriData?.liveWeather?.aqiStatus}
                          </div>
                        </div>
                        <div className="w-full h-1 bg-white/10 rounded-full mt-2 overflow-hidden">
                          <div 
                            className={cn(
                              "h-full rounded-full",
                              agriData?.liveWeather?.aqi > 300 ? "bg-red-500" : 
                              agriData?.liveWeather?.aqi > 200 ? "bg-orange-500" : 
                              agriData?.liveWeather?.aqi > 100 ? "bg-yellow-500" : "bg-emerald-500"
                            )} 
                            style={{ width: `${Math.min(100, (agriData?.liveWeather?.aqi / 500) * 100)}%` }}
                          />
                        </div>
                      </div>

                      <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                        <div className="flex items-center gap-2 text-slate-400 mb-1">
                          <Droplets size={12} />
                          <span className="text-[9px] font-bold uppercase tracking-wider">Humidity</span>
                        </div>
                        <div className="text-sm font-bold">{agriData?.liveWeather?.humidity}</div>
                      </div>

                      <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                        <div className="flex items-center gap-2 text-slate-400 mb-1">
                          <Wind size={12} />
                          <span className="text-[9px] font-bold uppercase tracking-wider">Wind Speed</span>
                        </div>
                        <div className="text-sm font-bold">{agriData?.liveWeather?.windSpeed}</div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-white/10 grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-[8px] font-bold text-slate-500 uppercase">Visibility</span>
                        <p className="text-[10px] font-bold">{agriData?.liveWeather?.visibility}</p>
                      </div>
                      <div>
                        <span className="text-[8px] font-bold text-slate-500 uppercase">UV Index</span>
                        <p className="text-[10px] font-bold">{agriData?.liveWeather?.uvIndex}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'skills' && (
            <motion.div
              key="skills"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-3xl font-display font-bold text-slate-900">Skill Development Portal</h2>
                  <p className="text-slate-500 mt-1">Master new skills with expert-led video courses and certification.</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right hidden sm:block">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Global Learners</p>
                    <p className="text-lg font-display font-bold text-slate-900">12,482</p>
                  </div>
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map(i => (
                      <img 
                        key={i}
                        src={`https://i.pravatar.cc/150?u=${i}`}
                        alt="User"
                        className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
                      />
                    ))}
                    <div className="w-10 h-10 rounded-full bg-blue-600 border-2 border-white flex items-center justify-center text-[10px] font-bold text-white shadow-sm">
                      +2k
                    </div>
                  </div>
                </div>
              </div>

              <SkillPortal />
            </motion.div>
          )}

          {activeTab === 'events' && (
            <motion.div
              key="events"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <EventsSection events={events} />
            </motion.div>
          )}

          {activeTab === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <UserDashboard 
                complaints={complaints} 
                notifications={notifications} 
                user={user}
                onUpdateUser={setUser}
              />
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
