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
  Trash2,
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

const LiveQueueTracker = () => {
  const [queues, setQueues] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchQueues = async () => {
      try {
        const locations = ['AIIMS Delhi', 'Safdarjung Hospital', 'Passport Seva Kendra', 'RTO Janakpuri'];
        const results = await Promise.all(locations.map(async (loc) => {
          const res = await fetch(`/api/queue-status?location=${encodeURIComponent(loc)}`);
          return res.json();
        }));
        setQueues(results);
      } catch (err) {
        console.error("Failed to fetch queues", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchQueues();
    const interval = setInterval(fetchQueues, 15000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading) return <div className="h-40 flex items-center justify-center"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {queues.map((q, i) => (
        <div key={i} className="glass-card p-6 rounded-[2rem] space-y-4 group hover:border-blue-200 transition-all">
          <div className="flex items-center justify-between">
            <div className="label-caps !text-[8px] !text-slate-400">{q.location}</div>
            <div className={cn(
              "w-2 h-2 rounded-full animate-pulse",
              q.load === 'High' ? "bg-red-500" : q.load === 'Medium' ? "bg-amber-500" : "bg-emerald-500"
            )} />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 tracking-tighter">{q.waitTime}</div>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Est. Wait Time</div>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Current Load</span>
            <span className={cn(
              "text-[10px] font-black uppercase tracking-widest",
              q.load === 'High' ? "text-red-600" : q.load === 'Medium' ? "text-amber-600" : "text-emerald-600"
            )}>{q.load}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

const SmartCitySlideshow = () => {
  const images = [
    {
      url: "https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=1200&q=80",
      title: "Digital Infrastructure",
      desc: "Real-time monitoring of city assets and infrastructure health."
    },
    {
      url: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80",
      title: "Smart City Tech",
      desc: "Optimizing multi-modal urban mobility for a greener Delhi."
    },
    {
      url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80",
      title: "Smart Governance",
      desc: "AI-driven civic resolution systems for faster response times."
    },
    {
      url: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80",
      title: "Urban Resilience",
      desc: "Predictive maintenance and resource optimization for city services."
    }
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-80 overflow-hidden rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-200 group">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 1.2, ease: "circOut" }}
          className="absolute inset-0"
        >
          <img 
            src={images[index].url} 
            alt={images[index].title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />
          
          <div className="absolute bottom-8 left-8 right-8 space-y-2">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="label-caps !text-blue-400"
            >
              Smart City Vision
            </motion.div>
            <motion.h3
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-3xl font-black text-white tracking-tighter"
            >
              {images[index].title}
            </motion.h3>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="text-slate-300 text-sm font-medium max-w-md"
            >
              {images[index].desc}
            </motion.p>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Progress Indicators */}
      <div className="absolute top-6 right-8 flex gap-2">
        {images.map((_, i) => (
          <div 
            key={i}
            className={cn(
              "h-1 rounded-full transition-all duration-500",
              i === index ? "w-8 bg-blue-500" : "w-2 bg-white/30"
            )}
          />
        ))}
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-6 left-8">
        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
          <span className="text-[10px] font-black text-white uppercase tracking-widest">Live Feed: NagarAI</span>
        </div>
      </div>
    </div>
  );
};

const ComplaintSlideshow = () => {
  const images = [
    {
      url: "https://images.unsplash.com/photo-1584467735815-f778f274e296?auto=format&fit=crop&w=1200&q=80",
      title: "Road Maintenance",
      desc: "AI detection of potholes and road surface damage for rapid repair."
    },
    {
      url: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=1200&q=80",
      title: "Waste Management",
      desc: "Identifying overflowing bins and illegal dumping in real-time."
    },
    {
      url: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1200&q=80",
      title: "Public Infrastructure",
      desc: "Monitoring structural health and reporting public asset damage."
    },
    {
      url: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=1200&q=80",
      title: "Utility Services",
      desc: "Reporting water leaks and electrical hazards for immediate attention."
    }
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-80 overflow-hidden rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-200 group">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 1.2, ease: "circOut" }}
          className="absolute inset-0"
        >
          <img 
            src={images[index].url} 
            alt={images[index].title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />
          
          <div className="absolute bottom-8 left-8 right-8 space-y-2">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="label-caps !text-blue-400"
            >
              Civic Resolution Vision
            </motion.div>
            <motion.h3
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-3xl font-black text-white tracking-tighter"
            >
              {images[index].title}
            </motion.h3>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="text-slate-300 text-sm font-medium max-w-md"
            >
              {images[index].desc}
            </motion.p>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Progress Indicators */}
      <div className="absolute top-6 right-8 flex gap-2">
        {images.map((_, i) => (
          <div 
            key={i}
            className={cn(
              "h-1 rounded-full transition-all duration-500",
              i === index ? "w-8 bg-blue-500" : "w-2 bg-white/30"
            )}
          />
        ))}
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-6 left-8">
        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
          <Sparkles size={12} className="text-blue-400 animate-pulse" />
          <span className="text-[10px] font-black text-white uppercase tracking-widest">AI Vision Active</span>
        </div>
      </div>
    </div>
  );
};

const TransportSlideshow = () => {
  const images = [
    {
      url: "https://images.unsplash.com/photo-1594142461625-0749032608d4?auto=format&fit=crop&w=1200&q=80",
      title: "Delhi Metro Network",
      desc: "The backbone of Delhi's urban mobility, serving millions daily."
    },
    {
      url: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80",
      title: "Smart Bus Transit",
      desc: "Optimized bus routes with real-time tracking and occupancy data."
    },
    {
      url: "https://images.unsplash.com/photo-1590674899484-13da0d1b58f5?auto=format&fit=crop&w=1200&q=80",
      title: "Smart Parking",
      desc: "Integrating e-rickshaws and cycles for seamless end-to-end travel."
    },
    {
      url: "https://images.unsplash.com/photo-1545127398-14699f92334b?auto=format&fit=crop&w=1200&q=80",
      title: "Traffic Intelligence",
      desc: "AI-powered traffic management to reduce congestion and emissions."
    }
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-80 overflow-hidden rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-200 group">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 1.2, ease: "circOut" }}
          className="absolute inset-0"
        >
          <img 
            src={images[index].url} 
            alt={images[index].title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />
          
          <div className="absolute bottom-8 left-8 right-8 space-y-2">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="label-caps !text-blue-400"
            >
              Smart Mobility Vision
            </motion.div>
            <motion.h3
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-3xl font-black text-white tracking-tighter"
            >
              {images[index].title}
            </motion.h3>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="text-slate-300 text-sm font-medium max-w-md"
            >
              {images[index].desc}
            </motion.p>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Progress Indicators */}
      <div className="absolute top-6 right-8 flex gap-2">
        {images.map((_, i) => (
          <div 
            key={i}
            className={cn(
              "h-1 rounded-full transition-all duration-500",
              i === index ? "w-8 bg-blue-500" : "w-2 bg-white/30"
            )}
          />
        ))}
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-6 left-8">
        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
          <Activity size={12} className="text-blue-400 animate-pulse" />
          <span className="text-[10px] font-black text-white uppercase tracking-widest">Live Traffic Data</span>
        </div>
      </div>
    </div>
  );
};

const AgricultureSlideshow = () => {
  const images = [
    {
      url: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80",
      title: "Precision Farming",
      desc: "AI-driven crop health monitoring and yield prediction for farmers."
    },
    {
      url: "https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?auto=format&fit=crop&w=1200&q=80",
      title: "Smart Irrigation",
      desc: "Optimizing water usage through real-time soil moisture sensing."
    },
    {
      url: "https://images.unsplash.com/photo-1595273670150-db0d3bf3926a?auto=format&fit=crop&w=1200&q=80",
      title: "Market Intelligence",
      desc: "Real-time mandi prices and demand forecasting for better profits."
    },
    {
      url: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=1200&q=80",
      title: "Rural Connectivity",
      desc: "Bridging the digital divide with localized services and advisory."
    }
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-80 overflow-hidden rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-200 group">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 1.2, ease: "circOut" }}
          className="absolute inset-0"
        >
          <img 
            src={images[index].url} 
            alt={images[index].title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />
          
          <div className="absolute bottom-8 left-8 right-8 space-y-2">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="label-caps !text-emerald-400"
            >
              Rural Empowerment Vision
            </motion.div>
            <motion.h3
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-3xl font-black text-white tracking-tighter"
            >
              {images[index].title}
            </motion.h3>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="text-slate-300 text-sm font-medium max-w-md"
            >
              {images[index].desc}
            </motion.p>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Progress Indicators */}
      <div className="absolute top-6 right-8 flex gap-2">
        {images.map((_, i) => (
          <div 
            key={i}
            className={cn(
              "h-1 rounded-full transition-all duration-500",
              i === index ? "w-8 bg-emerald-500" : "w-2 bg-white/30"
            )}
          />
        ))}
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-6 left-8">
        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
          <Sprout size={12} className="text-emerald-400 animate-pulse" />
          <span className="text-[10px] font-black text-white uppercase tracking-widest">Agri-Tech Active</span>
        </div>
      </div>
    </div>
  );
};

const UserDashboard = ({ complaints, notifications, user, onUpdateUser }: { complaints: Complaint[], notifications: Notification[], user: any, onUpdateUser: (updatedUser: any) => void }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ ...user });

  const avatarOptions = [
    // Boys
    'Adrian', 'Caleb', 'Dustin', 'Ethan', 'Felix', 
    'George', 'Henry', 'Ian', 'Jack', 'Kevin',
    // Girls
    'Alyssa', 'Britney', 'Chloe', 'Destiny', 'Emma', 
    'Faith', 'Grace', 'Heidi', 'Isabelle', 'Jasmine'
  ];

  const handleSave = () => {
    onUpdateUser({ ...editForm });
    setIsEditing(false);
  };

  const stats = [
    { label: 'Complaints Filed', value: complaints.length, icon: MessageSquare, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Resolved Issues', value: complaints.filter(c => c.status === 'resolved').length, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Learning Hours', value: (12 + Math.floor(Math.random() * 5)) + 'h', icon: GraduationCap, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Community Rank', value: '#' + (120 + Math.floor(Math.random() * 10)), icon: Award, color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  return (
    <div className="space-y-12">
      {/* Edit Profile Modal */}
      <AnimatePresence>
        {isEditing && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditing(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col border border-slate-100"
            >
              <div className="p-8 border-b border-slate-100 flex items-center justify-between flex-shrink-0 bg-slate-50/50">
                <div className="space-y-1">
                  <div className="label-caps !text-blue-600">Settings</div>
                  <h3 className="text-2xl font-display font-black text-slate-900 tracking-tight">Edit Profile</h3>
                </div>
                <button onClick={() => setIsEditing(false)} className="w-10 h-10 bg-white border border-slate-200 rounded-full flex items-center justify-center hover:bg-slate-50 transition-colors shadow-sm">
                  <AlertCircle size={20} className="rotate-45 text-slate-400" />
                </button>
              </div>
              <div className="p-8 space-y-8 overflow-y-auto custom-scrollbar">
                <div className="space-y-3">
                  <label className="label-caps !text-slate-400">Full Name</label>
                  <input 
                    type="text" 
                    value={editForm.name}
                    onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none font-black tracking-tight text-lg"
                  />
                </div>
                <div className="space-y-3">
                  <label className="label-caps !text-slate-400">Bio</label>
                  <textarea 
                    rows={3}
                    value={editForm.bio}
                    onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none font-medium resize-none leading-relaxed"
                  />
                </div>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <label className="label-caps !text-slate-400">Choose Avatar</label>
                    <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-widest">20 Options</span>
                  </div>
                  <div className="grid grid-cols-5 gap-4">
                    {avatarOptions.map((seed) => {
                      const url = `https://api.dicebear.com/7.x/personas/svg?seed=${seed}`;
                      const isSelected = editForm.avatar === url;
                      return (
                        <button
                          key={seed}
                          onClick={() => setEditForm(prev => ({ ...prev, avatar: url }))}
                          className={cn(
                            "relative aspect-square rounded-2xl p-1 transition-all",
                            isSelected 
                              ? "bg-blue-600 shadow-xl shadow-blue-200 scale-110 z-10" 
                              : "bg-slate-50 hover:bg-slate-100 border border-slate-200"
                          )}
                        >
                          <img src={url} alt={seed} className="w-full h-full rounded-xl bg-white" referrerPolicy="no-referrer" />
                          {isSelected && (
                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-lg">
                              <CheckCircle2 size={12} className="text-blue-600" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="p-8 bg-slate-50 border-t border-slate-100 flex gap-4 flex-shrink-0">
                <button 
                  onClick={() => setIsEditing(false)}
                  className="flex-1 px-8 py-4 bg-white border border-slate-200 text-slate-600 rounded-2xl text-xs font-black uppercase tracking-[0.2em] hover:bg-slate-100 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSave}
                  className="flex-1 px-8 py-4 bg-blue-600 text-white rounded-2xl text-xs font-black uppercase tracking-[0.2em] hover:bg-blue-700 transition-all shadow-xl shadow-blue-200"
                >
                  Save Changes
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Profile Header */}
      <div className="glass-card p-10 rounded-[3rem] overflow-hidden relative border border-slate-100 shadow-2xl shadow-slate-200/40">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/5 rounded-full -mr-48 -mt-48 blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-600/5 rounded-full -ml-48 -mb-48 blur-[100px]" />
        
        <div className="relative flex flex-col md:flex-row gap-12 items-center md:items-start">
          <div className="relative">
            <div className="w-40 h-40 rounded-[2.5rem] bg-gradient-to-br from-blue-100 to-indigo-100 p-1 shadow-2xl group">
              <img src={user.avatar} alt={user.name} className="w-full h-full rounded-[2.2rem] bg-white object-cover transition-transform duration-700 group-hover:scale-105" referrerPolicy="no-referrer" />
            </div>
            <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-emerald-500 rounded-2xl border-4 border-white flex items-center justify-center shadow-xl">
              <ShieldCheck size={18} className="text-white" />
            </div>
          </div>
          
          <div className="flex-1 text-center md:text-left space-y-6">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                <h2 className="text-5xl font-display font-black text-slate-900 tracking-tighter leading-none">{user.name}</h2>
                <span className="px-4 py-1.5 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-[0.2em] rounded-full border border-blue-100 shadow-sm">
                  {user.role}
                </span>
              </div>
              <p className="text-slate-500 flex items-center justify-center md:justify-start gap-3 text-lg font-medium tracking-tight">
                <Mail size={18} className="text-blue-500" />
                {user.email}
              </p>
            </div>
            <p className="text-slate-600 max-w-2xl leading-relaxed text-lg font-medium">
              {user.bio}
            </p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-8 pt-2">
              <div className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                <Calendar size={16} className="text-blue-400" />
                Joined {user.joinDate}
              </div>
              <div className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                <MapPin size={16} className="text-blue-400" />
                New Delhi, India
              </div>
            </div>
          </div>
          
          <div className="flex flex-col gap-3 w-full md:w-auto">
            <button 
              onClick={() => {
                setEditForm({ ...user });
                setIsEditing(true);
              }}
              className="px-8 py-4 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-[0.2em] hover:bg-blue-600 transition-all flex items-center justify-center gap-3 shadow-xl shadow-slate-200 hover:shadow-blue-200"
            >
              <Settings size={18} />
              Edit Profile
            </button>
            <button className="px-8 py-4 bg-white text-red-600 border border-red-100 rounded-2xl text-xs font-black uppercase tracking-[0.2em] hover:bg-red-50 transition-all flex items-center justify-center gap-3 shadow-sm">
              <LogOut size={18} />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-8 rounded-[2.5rem] space-y-6 shadow-xl shadow-slate-200/40 relative overflow-hidden group hover:scale-[1.02] transition-all"
          >
            <div className="absolute top-0 right-0 w-20 h-20 bg-slate-50 rounded-full -mr-10 -mt-10 blur-2xl group-hover:bg-blue-50 transition-colors" />
            <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner relative z-10", stat.bg)}>
              <stat.icon size={28} className={stat.color} />
            </div>
            <div className="relative z-10 space-y-1">
              <p className="text-3xl font-black text-slate-900 tracking-tighter leading-none">{stat.value}</p>
              <p className="label-caps !text-[8px] !text-slate-400">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
        {/* Recent Activity */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-display font-black text-slate-900 tracking-tight uppercase flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                <History size={20} />
              </div>
              Recent Activity
            </h3>
            <button className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] hover:underline">View All Logs</button>
          </div>
          
          <div className="space-y-4">
            {complaints.length > 0 ? complaints.slice(0, 3).map((complaint) => (
              <div key={complaint.id} className="glass-card p-6 rounded-[2rem] flex gap-6 items-start hover:border-blue-200 transition-all group shadow-lg shadow-slate-200/20">
                <div className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-inner",
                  complaint.status === 'resolved' ? "bg-emerald-50 text-emerald-600" : 
                  complaint.status === 'in_progress' ? "bg-amber-50 text-amber-600" : "bg-blue-50 text-blue-600"
                )}>
                  {complaint.status === 'resolved' ? <CheckCircle2 size={24} /> : <Clock size={24} />}
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex justify-between items-start">
                    <h4 className="text-lg font-black text-slate-900 group-hover:text-blue-600 transition-colors tracking-tight">{complaint.title}</h4>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-0.5 rounded-md">{complaint.time}</span>
                  </div>
                  <p className="text-sm text-slate-500 flex items-center gap-2 font-medium">
                    <MapPin size={14} className="text-blue-400" />
                    {complaint.location}
                  </p>
                  <div className="flex items-center gap-3 pt-2">
                    <span className={cn(
                      "px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-[0.15em] shadow-sm",
                      complaint.status === 'resolved' ? "bg-emerald-500 text-white" : 
                      complaint.status === 'in_progress' ? "bg-amber-500 text-white" : "bg-blue-500 text-white"
                    )}>
                      {complaint.status.replace('_', ' ')}
                    </span>
                    <span className="text-[10px] font-black text-slate-300 tracking-widest uppercase">{complaint.department}</span>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <ChevronRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            )) : (
              <div className="glass-card p-16 rounded-[2.5rem] text-center space-y-6 shadow-xl shadow-slate-200/40">
                <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto">
                  <MessageSquare size={32} className="text-slate-300" />
                </div>
                <div className="space-y-2">
                  <p className="font-black text-slate-900 text-lg tracking-tight">No recent activity</p>
                  <p className="text-sm text-slate-400 font-medium">Your civic actions and learning history will appear here.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Learning Progress */}
        <div className="space-y-8">
          <h3 className="text-2xl font-display font-black text-slate-900 tracking-tight uppercase flex items-center gap-4">
            <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
              <BookOpen size={20} />
            </div>
            Learning
          </h3>
          
          <div className="glass-card p-8 rounded-[2.5rem] space-y-8 shadow-xl shadow-slate-200/40 border border-slate-100">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-sm font-black text-slate-900 tracking-tight">JEE Physics Masterclass</p>
                <span className="text-xs font-black text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md">75%</span>
              </div>
              <div className="h-3 bg-slate-100 rounded-full overflow-hidden p-0.5">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '75%' }}
                  className="h-full bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full shadow-[0_0_8px_rgba(168,85,247,0.4)]"
                />
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Next: Wave Optics - Lecture 4</p>
            </div>

            <div className="space-y-4 pt-8 border-t border-slate-50">
              <div className="flex justify-between items-center">
                <p className="text-sm font-black text-slate-900 tracking-tight">Data Science Basics</p>
                <span className="text-xs font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">30%</span>
              </div>
              <div className="h-3 bg-slate-100 rounded-full overflow-hidden p-0.5">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '30%' }}
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.4)]"
                />
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Next: Python for Data Analysis</p>
            </div>

            <button className="w-full py-4 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-[0.2em] hover:bg-blue-600 transition-all shadow-xl shadow-slate-200 hover:shadow-blue-200">
              Go to Skill Portal
            </button>
          </div>

          <div className="glass-card p-8 rounded-[2.5rem] bg-gradient-to-br from-indigo-600 to-blue-700 text-white space-y-6 shadow-2xl shadow-blue-200 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-150 transition-transform duration-700" />
            <Sparkles className="absolute top-4 right-4 opacity-20" size={48} />
            <div className="relative z-10 space-y-4">
              <div className="space-y-1">
                <h4 className="text-xl font-black tracking-tight">NagarAI Pro</h4>
                <p className="text-xs text-blue-100 leading-relaxed font-medium">Get priority support, advanced city analytics, and exclusive learning content.</p>
              </div>
              <button className="w-full py-3 bg-white text-blue-600 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-blue-50 transition-all shadow-xl">
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
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="space-y-4">
          <div className="label-caps">City Pulse</div>
          <h2 className="font-display text-5xl font-black text-slate-900 tracking-tighter leading-none">City <span className="text-blue-600">Events</span></h2>
          <p className="text-lg text-slate-600 max-w-xl leading-relaxed font-medium">Discover live hackathons, cultural fests, and technical meetups near you.</p>
        </div>
        <div className="flex flex-wrap gap-3 bg-white p-2 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilter(cat.id as any)}
              className={cn(
                "px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.15em] transition-all flex items-center gap-3",
                filter === cat.id 
                  ? "bg-slate-900 text-white shadow-xl shadow-slate-200" 
                  : "bg-transparent text-slate-400 hover:text-slate-900 hover:bg-slate-50"
              )}
            >
              <cat.icon size={14} />
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
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className={cn(
                    "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm backdrop-blur-md",
                    event.category === 'hackathon' ? "bg-purple-500/90 text-white" :
                    event.category === 'cultural' ? "bg-amber-500/90 text-white" :
                    event.category === 'technical' ? "bg-blue-500/90 text-white" : "bg-emerald-500/90 text-white"
                  )}>
                    {event.category}
                  </span>
                  {event.isLive && (
                    <span className="px-3 py-1 bg-red-500/90 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm backdrop-blur-md flex items-center gap-1">
                      <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                      Live
                    </span>
                  )}
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
    avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Adhyaan",
    bio: "Urban planning enthusiast and active contributor to Delhi's smart city initiatives. Focused on improving local waste management and road infrastructure."
  });
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [aiResult, setAiResult] = useState<any>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
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
    try {
      const res = await fetch('/api/notifications');
      if (!res.ok) {
        if (res.status === 500 && retries > 0) {
          await new Promise(resolve => setTimeout(resolve, 1000));
          return fetchNotifications(retries - 1);
        }
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      if (Array.isArray(data)) {
        setNotifications(data);
      }
    } catch (err) {
      if (retries > 0) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        return fetchNotifications(retries - 1);
      }
      console.error("Failed to fetch notifications", err);
    }
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
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/user');
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        }
      } catch (err) {
        console.error("Failed to fetch user", err);
      }
    };

    fetchUser();
    fetchComplaints();
    fetchNotifications();
    fetchAgriData();
    fetchEvents();
    
    // Refresh notifications every 30 seconds
    const interval = setInterval(() => {
      fetchNotifications();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

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
      const prompt = `Analyze this city complaint image. Focus on identifying issues like garbage, poor infrastructure, or potholes.
      Respond ONLY with a JSON object (no markdown, no extra text): 
      {
        "title": "a concise title for the complaint (e.g., Pothole on Main St, Overflowing Garbage Bin)",
        "category": "road|garbage|infrastructure|other",
        "damage_type": "specific type of damage (e.g., pothole, overflow, crack, broken pavement)",
        "severity": "low|medium|high|critical",
        "urgency_score": 1-10,
        "description": "one sentence description of the issue",
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
        title: data.title || prev.title,
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
    { label: 'Avg. Response', value: (3.5 + Math.random()).toFixed(1) + 'h', icon: Clock, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'AI Accuracy', value: (94 + Math.random() * 2).toFixed(1) + '%', icon: Zap, color: 'text-amber-500', bg: 'bg-amber-50' },
  ];

  return (
    <div className="min-h-screen bg-[#FDFDFF] font-sans relative overflow-x-hidden">
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-50/50 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-50/50 rounded-full blur-[120px]" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-[100] premium-glass border-b border-white/40">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-200/50">
              <Building2 className="text-white" size={24} />
            </div>
            <div>
              <h1 className="font-display font-black text-2xl tracking-tight text-slate-900 leading-none">NagarAI</h1>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_#10b981]" />
                <span className="label-caps">Delhi Municipal Intelligence</span>
              </div>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-6">
            <nav className="flex items-center gap-1 bg-slate-100/50 backdrop-blur-sm p-1.5 rounded-2xl border border-slate-200/50">
              {(['overview', 'complaints', 'transport', 'agriculture', 'skills', 'events', 'profile'] as Tab[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                    activeTab === tab 
                      ? "bg-white text-blue-600 shadow-sm" 
                      : "text-slate-500 hover:text-slate-900 hover:bg-white/50"
                  )}
                >
                  {tab}
                </button>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              <div className="relative">
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative w-11 h-11 flex items-center justify-center bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all shadow-sm group"
                >
                  <Bell size={20} className="text-slate-600 group-hover:scale-110 transition-transform" />
                  {notifications.some(n => !n.read) && (
                    <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full shadow-sm" />
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
                  "w-11 h-11 rounded-2xl flex items-center justify-center transition-all border shadow-sm overflow-hidden",
                  activeTab === 'profile' ? "border-blue-500 ring-4 ring-blue-50" : "border-slate-200 hover:bg-slate-50"
                )}
              >
                <img src={user.avatar} alt="Profile" className="w-full h-full bg-blue-50" referrerPolicy="no-referrer" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-12"
            >
              {/* Hero Section */}
              <section className="grid lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2 space-y-8">
                  <div className="space-y-4">
                    <div className="label-caps">Smart City Dashboard</div>
                    <h2 className="font-display text-6xl font-black tracking-tighter text-slate-900 leading-[0.9]">
                      Urban <span className="text-blue-600">Intelligence</span><br/>
                      Redefined.
                    </h2>
                    <p className="text-lg text-slate-600 max-w-xl leading-relaxed">
                      Harnessing AI to streamline municipal services, predict infrastructure needs, and optimize urban mobility for the citizens of Delhi.
                    </p>
                  </div>
                  <SmartCitySlideshow />
                </div>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display font-black text-slate-900 flex items-center gap-2 uppercase tracking-tight">
                      <TrendingUp size={18} className="text-blue-600" />
                      Live Metrics
                    </h3>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {stats.map((stat, i) => (
                      <div key={i} className="glass-card p-5 rounded-[2rem] space-y-3 group hover:border-blue-200 transition-all">
                        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110", stat.bg)}>
                          <stat.icon size={20} className={stat.color} />
                        </div>
                        <div>
                          <div className="text-3xl font-black text-slate-900 tracking-tighter">{stat.value}</div>
                          <div className="label-caps !text-[8px]">{stat.label}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="glass-card p-6 rounded-[2rem] bg-gradient-to-br from-blue-600 to-indigo-700 text-white border-none shadow-2xl shadow-blue-200">
                    <h4 className="font-black text-sm mb-2 uppercase tracking-widest">AI Priority Engine</h4>
                    <p className="text-xs text-blue-100/80 leading-relaxed mb-4">
                      NagarAI's Priority Engine uses machine learning to automatically rank civic complaints. By analyzing the severity of the issue, its category (like road safety or sanitation), and the population density of the location, it ensures that critical problems are addressed by city officials within a 4-hour window.
                    </p>
                    <div className="flex items-center justify-between text-[10px] font-mono bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/10">
                      <span className="opacity-80">SCORE = S*0.4 + C*0.3 + L*0.2</span>
                      <ChevronRight size={12} />
                    </div>
                  </div>

                </div>
              </section>

              {/* Module Previews */}
              <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[
                  { title: 'Civic Complaints', desc: 'Photo-to-resolution in seconds using AI Vision.', icon: Camera, color: 'text-red-600', bg: 'bg-red-50', tab: 'complaints' as Tab },
                  { title: 'Route Optimizer', desc: 'Multi-modal transport scoring for Delhi journeys.', icon: Navigation, color: 'text-blue-600', bg: 'bg-blue-50', tab: 'transport' as Tab },
                  { title: 'Agri-Tech', desc: 'AI-powered crop advice and real-time market rates.', icon: Sprout, color: 'text-emerald-600', bg: 'bg-emerald-50', tab: 'agriculture' as Tab },
                  { title: 'Skill Portal', desc: 'Master new skills with expert-led study modules.', icon: GraduationCap, color: 'text-purple-600', bg: 'bg-purple-50', tab: 'skills' as Tab },
                  { title: 'City Events', desc: 'Discover and participate in local community events.', icon: Calendar, color: 'text-amber-600', bg: 'bg-amber-50', tab: 'events' as Tab },
                ].map((module, i) => (
                  <button 
                    key={i}
                    onClick={() => setActiveTab(module.tab)}
                    className="group glass-card p-8 rounded-[2.5rem] text-left hover:border-blue-300 transition-all hover:shadow-2xl hover:shadow-blue-100/50 relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 blur-3xl -mr-12 -mt-12 group-hover:bg-blue-50 transition-colors" />
                    <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform relative z-10 shadow-inner", module.bg)}>
                      <module.icon size={28} className={module.color} />
                    </div>
                    <div className="relative z-10 space-y-3">
                      <h4 className="text-xl font-black text-slate-900 tracking-tight">{module.title}</h4>
                      <p className="text-sm text-slate-600 leading-relaxed font-medium">{module.desc}</p>
                      <div className="pt-4 flex items-center gap-3 text-[10px] font-black text-blue-600 uppercase tracking-[0.2em]">
                        <span>Explore Module</span>
                        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
                          <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </section>

              {/* Live City Services Section */}
              <section className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-black text-slate-900 flex items-center gap-3 uppercase tracking-tight">
                    <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
                      <Activity size={20} />
                    </div>
                    Live City Services
                  </h3>
                  <div className="flex items-center gap-2 bg-emerald-50 text-emerald-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-emerald-100">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                    Real-time Status
                  </div>
                </div>
                <LiveQueueTracker />
              </section>
            </motion.div>
          )}

          {activeTab === 'complaints' && (
            <motion.div
              key="complaints"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="grid lg:grid-cols-3 gap-12"
            >
              <div className="lg:col-span-2 space-y-8">
                <div className="space-y-4">
                  <div className="label-caps">Civic Resolution</div>
                  <h2 className="font-display text-5xl font-black text-slate-900 tracking-tighter leading-none">Smart Complaint <br/><span className="text-blue-600">System</span></h2>
                  <p className="text-lg text-slate-600 max-w-xl leading-relaxed">Upload a photo of any civic issue. Our AI will classify it and route it to the correct department instantly.</p>
                </div>
                <ComplaintSlideshow />
                
                <div 
                  onClick={() => document.getElementById('fileInput')?.click()}
                  className={cn(
                    "glass-card p-12 rounded-[2.5rem] border-dashed border-2 flex flex-col items-center justify-center text-center space-y-6 transition-all cursor-pointer group relative overflow-hidden",
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
                    <div className="relative w-full aspect-video rounded-3xl overflow-hidden shadow-2xl">
                      <img src={uploadedImage} alt="Uploaded" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center backdrop-blur-[2px]">
                        <span className="text-white text-xs font-black uppercase tracking-widest bg-black/50 px-6 py-2 rounded-full backdrop-blur-md border border-white/20">Change Image</span>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="w-20 h-20 bg-blue-50 rounded-[2rem] flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform shadow-xl shadow-blue-100/50">
                        <Upload size={40} />
                      </div>
                      <div className="space-y-2">
                        <p className="text-xl font-black text-slate-900 tracking-tight">Upload Complaint Photo</p>
                        <p className="text-sm text-slate-500 font-medium">Drag and drop or click to browse files</p>
                      </div>
                    </>
                  )}
                </div>

                {uploadedImage && !aiResult && (
                  <button 
                    onClick={analyzeImage}
                    disabled={isAnalyzing}
                    className="w-full bg-blue-600 text-white py-5 rounded-[1.5rem] font-black uppercase tracking-[0.2em] hover:bg-blue-700 transition-all shadow-2xl shadow-blue-200 flex items-center justify-center gap-3"
                  >
                    {isAnalyzing ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>AI ANALYZING...</span>
                      </>
                    ) : (
                      <>
                        <Zap size={20} className="fill-white" />
                        <span>ANALYZE WITH AI VISION</span>
                      </>
                    )}
                  </button>
                )}

                {aiResult && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card p-8 rounded-[2rem] bg-emerald-50/50 border-emerald-200 shadow-xl shadow-emerald-100/50"
                  >
                    <div className="flex items-center gap-3 text-emerald-600 mb-6">
                      <Sparkles size={20} />
                      <span className="label-caps !text-emerald-600">AI Analysis Complete</span>
                    </div>
                    <div className="grid grid-cols-2 gap-8">
                      <div className="col-span-2">
                        <span className="label-caps !text-slate-400">Detected Issue</span>
                        <p className="text-xl font-black text-slate-900 tracking-tight">{aiResult.title}</p>
                      </div>
                      <div>
                        <span className="label-caps !text-slate-400">Category</span>
                        <p className="text-lg font-black text-slate-900 capitalize tracking-tight">{aiResult.category}</p>
                      </div>
                      <div>
                        <span className="label-caps !text-slate-400">Severity</span>
                        <p className={cn(
                          "text-lg font-black tracking-tight",
                          aiResult.severity === 'critical' ? "text-red-600" : "text-amber-600"
                        )}>{aiResult.severity?.toUpperCase()}</p>
                      </div>
                      <div className="col-span-2">
                        <span className="label-caps !text-slate-400">Description</span>
                        <p className="text-slate-600 font-medium leading-relaxed">{aiResult.description}</p>
                      </div>
                    </div>
                  </motion.div>
                )}

                <div className="glass-card p-8 rounded-[2rem] space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {!aiResult && (
                      <div className="space-y-2">
                        <label className="label-caps !text-slate-400">Title</label>
                        <input 
                          value={formData.title}
                          onChange={e => setFormData(p => ({ ...p, title: e.target.value }))}
                          placeholder="e.g. Broken Street Light"
                          className="w-full px-6 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                        />
                      </div>
                    )}
                    <div className={cn("space-y-2", aiResult ? "md:col-span-2" : "")}>
                      <label className="label-caps !text-slate-400">Location</label>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                          value={formData.location}
                          onChange={e => setFormData(p => ({ ...p, location: e.target.value }))}
                          placeholder="e.g. Karol Bagh, New Delhi"
                          className="w-full pl-12 pr-6 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                        />
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={submitComplaint}
                    disabled={isSubmitting || !formData.title || !formData.location}
                    className={cn(
                      "w-full py-4 rounded-[1.5rem] font-black uppercase tracking-[0.2em] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-xl",
                      submitSuccess ? "bg-emerald-600 text-white shadow-emerald-100" : "bg-slate-900 text-white hover:bg-slate-800 shadow-slate-200"
                    )}
                  >
                    {isSubmitting ? "SUBMITTING..." : submitSuccess ? (
                      <>
                        <CheckCircle2 size={20} />
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
                            c.priority === 'critical' ? "bg-red-50 text-red-600" : 
                            c.priority === 'high' ? "bg-amber-50 text-amber-600" : "bg-blue-50 text-blue-600"
                          )}>
                            {c.category === 'road' ? <Navigation size={14} /> : 
                             c.category === 'garbage' ? <Trash2 size={14} /> :
                             c.category === 'infrastructure' ? <Building2 size={14} /> :
                             <AlertCircle size={14} />}
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

          {activeTab === 'transport' && (
            <motion.div
              key="transport"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-12"
            >
              <div className="grid lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2 space-y-8">
                  <div className="space-y-4">
                    <div className="label-caps">Smart Mobility</div>
                    <h2 className="font-display text-5xl font-black text-slate-900 tracking-tighter leading-none">Transport <br/><span className="text-blue-600">Optimizer</span></h2>
                    <p className="text-lg text-slate-600 max-w-xl leading-relaxed font-medium">Multi-modal route scoring considering time, crowd density, cost, and carbon footprint.</p>
                  </div>
                  <TransportSlideshow />
                  
                  <div className="glass-card p-8 rounded-[2.5rem] grid md:grid-cols-3 gap-6 shadow-xl shadow-slate-200/40">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="label-caps !text-slate-400">Origin</label>
                        <button 
                          onClick={detectLocation}
                          disabled={routeData.isDetectingLocation}
                          className="text-[10px] font-black text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-all disabled:opacity-50 uppercase tracking-widest"
                        >
                          {routeData.isDetectingLocation ? (
                            <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                          ) : <Navigation size={12} />}
                          Detect
                        </button>
                      </div>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <select 
                          value={routeData.origin}
                          onChange={(e) => setRouteData(p => ({ ...p, origin: e.target.value, results: null }))}
                          className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
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
                    <div className="space-y-2">
                      <label className="label-caps !text-slate-400">Destination</label>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <select 
                          value={routeData.destination}
                          onChange={(e) => setRouteData(p => ({ ...p, destination: e.target.value, results: null }))}
                          className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
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
                        className="w-full bg-blue-600 text-white py-3.5 rounded-2xl font-black uppercase tracking-[0.2em] hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 flex items-center justify-center gap-3"
                      >
                        {routeData.isCalculating ? (
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <>
                            <Zap size={18} className="fill-white" />
                            Optimize
                          </>
                        )}
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
              className="space-y-12"
            >
              <div className="max-w-3xl mx-auto text-center space-y-6">
                <div className="label-caps mx-auto">Rural Empowerment</div>
                <h2 className="font-display text-5xl font-black text-slate-900 tracking-tighter leading-none">Agriculture & <br/><span className="text-emerald-600">Rural Services</span></h2>
                <p className="text-lg text-slate-600 leading-relaxed font-medium">Empowering farmers with AI-driven crop advisory, real-time market prices, and localized weather alerts.</p>
              </div>

              <AgricultureSlideshow />

              <div className="grid lg:grid-cols-3 gap-12">
                {/* Left Column: AI Advisory */}
                <div className="lg:col-span-2 space-y-8">
                  <div className="glass-card p-10 rounded-[2.5rem] space-y-8 shadow-xl shadow-slate-200/40">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 shadow-inner">
                        <Sprout size={28} />
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-slate-900 tracking-tight">Crop Advisory AI</h3>
                        <p className="label-caps !text-[8px] !text-emerald-600">Powered by Gemini 3.0</p>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="label-caps !text-slate-400">Select Crop</label>
                          <select 
                            value={selectedCrop}
                            onChange={(e) => {
                              setSelectedCrop(e.target.value);
                              setAgriAdvice('');
                            }}
                            className="w-full px-6 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all"
                          >
                            <option>Wheat</option>
                            <option>Paddy</option>
                            <option>Mustard</option>
                            <option>Sugarcane</option>
                            <option>Vegetables</option>
                            <option>Other</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="label-caps !text-slate-400">Language</label>
                          <select className="w-full px-6 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all">
                            <option>English</option>
                            <option>Hindi (हिन्दी)</option>
                            <option>Punjabi (ਪੰਜਾਬੀ)</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="label-caps !text-slate-400">Your Question</label>
                        <textarea 
                          value={agriQuery}
                          onChange={(e) => {
                            setAgriQuery(e.target.value);
                            setAgriAdvice('');
                          }}
                          placeholder="e.g. My wheat leaves are turning yellow, what should I do?"
                          className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 min-h-[120px] resize-none transition-all"
                        />
                      </div>

                      <button 
                        onClick={generateAgriAdvice}
                        disabled={isGeneratingAdvice || !agriQuery}
                        className="w-full bg-emerald-600 text-white py-4 rounded-[1.5rem] font-black uppercase tracking-[0.2em] hover:bg-emerald-700 transition-all shadow-2xl shadow-emerald-200 flex items-center justify-center gap-3 disabled:opacity-50"
                      >
                        {isGeneratingAdvice ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>ANALYZING...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles size={20} className="fill-white" />
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
                          className="p-8 bg-emerald-50/50 border border-emerald-100 rounded-[2rem] relative shadow-inner"
                        >
                          <h4 className="font-black text-emerald-900 text-sm mb-4 flex items-center gap-3 uppercase tracking-tight">
                            <div className="w-8 h-8 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-200">
                              <Info size={16} />
                            </div>
                            Expert Recommendation
                          </h4>
                          <div className="text-base text-emerald-800 leading-relaxed whitespace-pre-wrap font-medium">
                            {agriAdvice}
                          </div>
                          <div className="mt-6 pt-6 border-t border-emerald-200 flex justify-between items-center">
                            <span className="label-caps !text-emerald-600 !text-[8px]">Verified by Agri-Scientists</span>
                            <button 
                              onClick={downloadAdvisory}
                              className="text-[10px] font-black text-emerald-700 hover:underline uppercase tracking-widest flex items-center gap-2"
                            >
                              <Folder size={14} />
                              Download Advisory
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Weather Alerts */}
                  <div className="space-y-6">
                    <h3 className="font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
                        <CloudRain size={16} />
                      </div>
                      Weather Alerts for Farmers
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      {agriData?.weatherAlerts.map((alert: any, i: number) => (
                        <div key={i} className={cn(
                          "p-6 rounded-[1.5rem] border flex gap-5 shadow-lg transition-all hover:scale-[1.02]",
                          alert.severity === 'high' ? "bg-red-50 border-red-100 shadow-red-100/50" : "bg-amber-50 border-amber-100 shadow-amber-100/50"
                        )}>
                          <div className={cn(
                            "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-inner",
                            alert.severity === 'high' ? "bg-red-100 text-red-600" : "bg-amber-100 text-amber-600"
                          )}>
                            {alert.type === 'Heatwave' ? <Sun size={24} /> : <CloudRain size={24} />}
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-base font-black text-slate-900 tracking-tight">{alert.type}</span>
                              <span className="label-caps !text-[8px] !text-slate-400">{alert.time}</span>
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed font-medium">{alert.message}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column: Market Prices */}
                <div className="space-y-8">
                  <div className="glass-card p-8 rounded-[2.5rem] space-y-6 shadow-xl shadow-slate-200/40">
                    <div className="flex items-center justify-between">
                      <h3 className="font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
                          <TrendingUp size={16} />
                        </div>
                        Live Mandi Prices
                      </h3>
                      <div className="label-caps !text-slate-400 !text-[8px]">
                        {agriData?.location}
                      </div>
                    </div>

                    <div className="space-y-4">
                      {agriData?.marketPrices.map((item: any, i: number) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-blue-200 transition-all shadow-sm">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 group-hover:text-blue-500 group-hover:bg-blue-50 transition-all shadow-inner">
                              <Wheat size={20} />
                            </div>
                            <div>
                              <div className="text-sm font-black text-slate-900 tracking-tight">{item.crop}</div>
                              <div className="text-[10px] font-bold text-slate-400">{item.unit}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-base font-black text-slate-900 tracking-tighter">{item.price}</div>
                            <div className={cn(
                              "text-[10px] font-black flex items-center justify-end gap-1",
                              item.trend === 'up' ? "text-emerald-600" : item.trend === 'down' ? "text-red-600" : "text-slate-400"
                            )}>
                              {item.trend === 'up' ? '▲' : item.trend === 'down' ? '▼' : '●'}
                              {item.change}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <button className="w-full py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-3">
                      <Phone size={16} />
                      Subscribe to SMS
                    </button>
                    <p className="text-[10px] text-center text-slate-400 font-black uppercase tracking-widest">
                      Updated: {agriData?.lastUpdated}
                    </p>
                  </div>

                  {/* Weather & AQI Dashboard */}
                  <div className="glass-card p-8 rounded-[2.5rem] space-y-6 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white shadow-2xl shadow-slate-900/20 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-3xl -mr-16 -mt-16 group-hover:bg-blue-500/20 transition-all duration-700" />
                    <div className="flex items-center justify-between relative z-10">
                      <h3 className="font-black flex items-center gap-3 uppercase tracking-tight">
                        <div className="w-8 h-8 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-400 border border-blue-500/30">
                          <CloudRain size={16} />
                        </div>
                        Live Environment
                      </h3>
                      <div className="px-3 py-1 bg-blue-500/20 rounded-full text-[8px] font-black uppercase tracking-[0.2em] text-blue-300 border border-blue-500/30">
                        Real-time
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 relative z-10">
                      <div className="p-4 bg-white/5 rounded-[1.5rem] border border-white/10 hover:bg-white/[0.08] transition-all">
                        <div className="flex items-center gap-2 text-slate-400 mb-2">
                          <Thermometer size={14} />
                          <span className="label-caps !text-[8px] !text-slate-500">Temperature</span>
                        </div>
                        <div className="text-2xl font-black tracking-tighter">{agriData?.liveWeather?.temp}</div>
                        <div className="text-[10px] text-blue-400 font-black uppercase tracking-widest mt-1">{agriData?.liveWeather?.condition}</div>
                      </div>

                      <div className="p-4 bg-white/5 rounded-[1.5rem] border border-white/10 hover:bg-white/[0.08] transition-all">
                        <div className="flex items-center gap-2 text-slate-400 mb-2">
                          <Activity size={14} />
                          <span className="label-caps !text-[8px] !text-slate-500">AQI Index</span>
                        </div>
                        <div className="flex items-end gap-2">
                          <div className="text-2xl font-black tracking-tighter">{agriData?.liveWeather?.aqi}</div>
                          <div className={cn("text-[10px] font-black pb-1 uppercase tracking-widest", agriData?.liveWeather?.aqiColor)}>
                            {agriData?.liveWeather?.aqiStatus}
                          </div>
                        </div>
                        <div className="w-full h-1.5 bg-white/10 rounded-full mt-3 overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(100, (agriData?.liveWeather?.aqi / 500) * 100)}%` }}
                            className={cn(
                              "h-full rounded-full shadow-[0_0_10px_rgba(0,0,0,0.2)]",
                              agriData?.liveWeather?.aqi > 300 ? "bg-red-500" : 
                              agriData?.liveWeather?.aqi > 200 ? "bg-orange-500" : 
                              agriData?.liveWeather?.aqi > 100 ? "bg-yellow-500" : "bg-emerald-500"
                            )} 
                          />
                        </div>
                      </div>

                      <div className="p-4 bg-white/5 rounded-[1.5rem] border border-white/10 hover:bg-white/[0.08] transition-all">
                        <div className="flex items-center gap-2 text-slate-400 mb-2">
                          <Droplets size={14} />
                          <span className="label-caps !text-[8px] !text-slate-500">Humidity</span>
                        </div>
                        <div className="text-lg font-black tracking-tight">{agriData?.liveWeather?.humidity}</div>
                      </div>

                      <div className="p-4 bg-white/5 rounded-[1.5rem] border border-white/10 hover:bg-white/[0.08] transition-all">
                        <div className="flex items-center gap-2 text-slate-400 mb-2">
                          <Wind size={14} />
                          <span className="label-caps !text-[8px] !text-slate-500">Wind Speed</span>
                        </div>
                        <div className="text-lg font-black tracking-tight">{agriData?.liveWeather?.windSpeed}</div>
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
              className="space-y-12"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div className="space-y-4">
                  <div className="label-caps">Learning & Growth</div>
                  <h2 className="font-display text-5xl font-black text-slate-900 tracking-tighter leading-none">Skill Development <br/><span className="text-blue-600">Portal</span></h2>
                  <p className="text-lg text-slate-600 max-w-xl leading-relaxed font-medium">Master new skills with expert-led study modules and certification.</p>
                </div>
                <div className="flex items-center gap-6 bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40">
                  <div className="text-right">
                    <p className="label-caps !text-[8px] !text-slate-400">Global Learners</p>
                    <p className="text-3xl font-black text-slate-900 tracking-tighter">12,482</p>
                  </div>
                  <div className="flex -space-x-3">
                    {[1, 2, 3, 4].map(i => (
                      <img 
                        key={i}
                        src={`https://api.dicebear.com/7.x/personas/svg?seed=${i * 99}`}
                        alt="User"
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 rounded-full border-4 border-white shadow-lg"
                      />
                    ))}
                    <div className="w-12 h-12 rounded-full bg-blue-600 border-4 border-white flex items-center justify-center text-[10px] font-black text-white shadow-lg">
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
              className="max-w-4xl mx-auto space-y-16"
            >
              <div className="text-center space-y-6">
                <div className="label-caps mx-auto">The Vision</div>
                <h2 className="font-display text-6xl font-black text-slate-900 tracking-tighter leading-none">Project <span className="text-blue-600">NagarAI</span></h2>
                <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-medium">A next-generation civic intelligence platform designed for the Hackathon 2026, Track 5: Smart Public Services.</p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                {[
                  { title: 'The Problem', desc: 'Delhi generates 20,000+ civic complaints per month with a 72-hour average response time. Citizens face significant delays in accessing public services.', color: 'bg-red-500', shadow: 'shadow-red-100' },
                  { title: 'The Solution', desc: 'NagarAI provides an AI-powered ecosystem: Smart Complaint routing via Vision AI and CO2-aware transport optimization.', color: 'bg-blue-500', shadow: 'shadow-blue-100' },
                  { title: 'The Impact', desc: '60% reduction in resolution time and a significant push towards sustainable public transport and efficient civic management.', color: 'bg-emerald-500', shadow: 'shadow-emerald-100' },
                ].map((item, i) => (
                  <div key={i} className="glass-card p-10 rounded-[2.5rem] space-y-6 shadow-xl shadow-slate-200/40 relative overflow-hidden group hover:scale-[1.02] transition-all">
                    <div className={cn("absolute top-0 left-0 w-full h-1.5", item.color)} />
                    <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg mb-4", item.color, item.shadow)}>
                      {i === 0 ? <AlertCircle size={24} /> : i === 1 ? <Zap size={24} /> : <Activity size={24} />}
                    </div>
                    <div className="space-y-3">
                      <h4 className="text-xl font-black text-slate-900 tracking-tight">{item.title}</h4>
                      <p className="text-sm text-slate-600 leading-relaxed font-medium">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-center pt-12">
                <div className="inline-flex items-center gap-3 px-6 py-3 bg-slate-100 rounded-full text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] border border-slate-200 shadow-sm">
                  <Info size={14} className="text-blue-600" />
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
