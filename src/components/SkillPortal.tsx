import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Filter, 
  BookOpen, 
  GraduationCap, 
  Award, 
  CheckCircle, 
  BarChart3, 
  ChevronRight,
  Clock,
  Users,
  Zap,
  Activity,
  Book,
  ArrowRight,
  ShieldCheck,
  TrendingUp
} from 'lucide-react';
import { Category, Course, Lecture, UserProgress } from '../types';

// Helper for conditional classes
const cn = (...classes: any[]) => classes.filter(Boolean).join(' ');

export const SkillPortal = () => {
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [courses, setCourses] = React.useState<Course[]>([]);
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCourse, setSelectedCourse] = React.useState<Course | null>(null);
  const [activeLecture, setActiveLecture] = React.useState<Lecture | null>(null);
  const [userProgress, setUserProgress] = React.useState<UserProgress[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  const [showRequirements, setShowRequirements] = React.useState(false);
  const [selectedLevel, setSelectedLevel] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, courseRes, progRes] = await Promise.all([
          fetch('/api/learning/categories'),
          fetch('/api/learning/courses'),
          fetch('/api/learning/progress')
        ]);
        
        if (!catRes.ok || !courseRes.ok || !progRes.ok) {
          throw new Error('One or more requests failed');
        }

        const [catData, courseData, progData] = await Promise.all([
          catRes.json(),
          courseRes.json(),
          progRes.json()
        ]);

        setCategories(catData);
        setCourses(courseData);
        setUserProgress(progData);
      } catch (err) {
        console.error("Failed to fetch learning data", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter courses
  const filteredCourses = courses.filter(course => {
    const matchesCategory = !selectedCategory || course.categoryId === selectedCategory;
    const matchesLevel = !selectedLevel || course.level === selectedLevel;
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          course.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesLevel && matchesSearch;
  });

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'GraduationCap': return <GraduationCap size={20} />;
      case 'Activity': return <Activity size={20} />;
      case 'BookOpen': return <BookOpen size={20} />;
      case 'Zap': return <Zap size={20} />;
      case 'ShieldCheck': return <ShieldCheck size={20} />;
      case 'TrendingUp': return <TrendingUp size={20} />;
      case 'BarChart3': return <BarChart3 size={20} />;
      default: return <Book size={20} />;
    }
  };

  const toggleLectureCompletion = async (lectureId: string, courseId: string) => {
    const isCurrentlyCompleted = isLectureCompleted(lectureId, courseId);
    try {
      const res = await fetch('/api/learning/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId, lectureId, completed: !isCurrentlyCompleted })
      });
      const updatedProg = await res.json();
      
      setUserProgress(prev => {
        const existing = prev.find(p => p.courseId === courseId);
        if (existing) {
          return prev.map(p => p.courseId === courseId ? updatedProg : p);
        }
        return [...prev, updatedProg];
      });
    } catch (err) {
      console.error("Failed to update progress", err);
    }
  };

  const getCourseProgress = (courseId: string) => {
    return userProgress.find(p => p.courseId === courseId)?.progressPercent || 0;
  };

  const isLectureCompleted = (lectureId: string, courseId: string) => {
    return userProgress.find(p => p.courseId === courseId)?.completedLectures.includes(lectureId) || false;
  };

  if (isLoading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
        <p className="text-slate-500 font-medium">Loading your learning portal...</p>
      </div>
    );
  }

  if (selectedCourse) {
    const currentProgress = getCourseProgress(selectedCourse.id);
    
    return (
      <div className="space-y-8">
        <button 
          onClick={() => { setSelectedCourse(null); setActiveLecture(null); }}
          className="group flex items-center gap-3 text-slate-500 hover:text-slate-900 transition-all text-xs font-black uppercase tracking-[0.2em]"
        >
          <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center group-hover:bg-slate-50 transition-colors">
            <ArrowRight className="rotate-180" size={14} />
          </div>
          Back to Courses
        </button>

        <div className="grid lg:grid-cols-3 gap-10">
          {/* Content Section */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-2xl shadow-slate-200 border border-slate-100 flex flex-col">
              <div className="aspect-video bg-white relative group">
                <div className="w-full h-full overflow-y-auto p-12 custom-scrollbar">
                  {activeLecture ? (
                    <div className="prose prose-slate max-w-none prose-headings:font-black prose-headings:tracking-tighter prose-p:leading-relaxed prose-p:text-slate-600">
                      <div dangerouslySetInnerHTML={{ __html: activeLecture.content }} />
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-6">
                      <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center">
                        <BookOpen size={40} className="opacity-20" />
                      </div>
                      <div className="text-center space-y-2">
                        <p className="font-black text-xl tracking-tight text-slate-900">Ready to start?</p>
                        <p className="text-sm text-slate-500 font-medium">Select a topic from the list to begin reading</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full -mr-32 -mt-32 blur-3xl opacity-50" />
              
              <div className="relative flex flex-col md:flex-row justify-between items-start gap-6">
                <div className="space-y-3">
                  <div className="label-caps !text-blue-600">Now Learning</div>
                  <h2 className="text-4xl font-display font-black text-slate-900 tracking-tighter leading-none">
                    {activeLecture?.title || selectedCourse.title}
                  </h2>
                  <div className="flex items-center gap-3 text-slate-500">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                      <Users size={14} />
                    </div>
                    <span className="text-sm font-bold tracking-tight">Instructor: {selectedCourse.instructor}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-3xl border border-slate-100">
                  <div className="text-right">
                    <p className="label-caps !text-[8px] !text-slate-400">Course Mastery</p>
                    <p className="text-2xl font-black text-blue-600 tracking-tighter">{currentProgress}%</p>
                  </div>
                  <div className="w-14 h-14 rounded-full bg-white shadow-sm flex items-center justify-center relative border border-slate-100">
                    <svg className="w-full h-full -rotate-90 p-1">
                      <circle
                        cx="28"
                        cy="28"
                        r="24"
                        fill="transparent"
                        stroke="currentColor"
                        strokeWidth="4"
                        className="text-slate-100"
                      />
                      <circle
                        cx="28"
                        cy="28"
                        r="24"
                        fill="transparent"
                        stroke="currentColor"
                        strokeWidth="4"
                        className="text-blue-600"
                        strokeDasharray={150.8}
                        strokeDashoffset={150.8 - (150.8 * currentProgress) / 100}
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                </div>
              </div>
              <p className="text-slate-600 leading-relaxed text-lg font-medium max-w-3xl">
                {selectedCourse.description}
              </p>
            </div>
          </div>

          {/* Playlist Section */}
          <div className="space-y-8">
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden flex flex-col max-h-[800px]">
              <div className="p-8 border-b border-slate-100 bg-slate-50/50">
                <h3 className="font-black text-slate-900 flex items-center gap-3 uppercase tracking-tight">
                  <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
                    <BarChart3 size={16} />
                  </div>
                  Course Content
                </h3>
              </div>
              <div className="divide-y divide-slate-50 overflow-y-auto custom-scrollbar flex-1">
                {selectedCourse.lectures.map((lecture, i) => (
                  <div
                    key={lecture.id}
                    onClick={() => setActiveLecture(lecture)}
                    role="button"
                    tabIndex={0}
                    className={cn(
                      "w-full p-6 flex items-start gap-5 transition-all text-left hover:bg-slate-50 cursor-pointer group",
                      activeLecture?.id === lecture.id ? "bg-blue-50/50" : ""
                    )}
                  >
                    <div className="shrink-0 mt-1">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleLectureCompletion(lecture.id, selectedCourse.id);
                        }}
                        className={cn(
                          "w-7 h-7 rounded-xl border-2 flex items-center justify-center transition-all shadow-sm",
                          isLectureCompleted(lecture.id, selectedCourse.id)
                            ? "bg-emerald-500 border-emerald-500 text-white"
                            : "bg-white border-slate-200 text-transparent hover:border-emerald-500"
                        )}
                      >
                        <CheckCircle size={16} />
                      </button>
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex justify-between items-start gap-3">
                        <span className={cn(
                          "text-sm font-black leading-tight tracking-tight",
                          activeLecture?.id === lecture.id ? "text-blue-600" : "text-slate-700"
                        )}>
                          {String(i + 1).padStart(2, '0')}. {lecture.title}
                        </span>
                        <span className="text-[10px] font-black text-slate-400 whitespace-nowrap bg-slate-100 px-2 py-0.5 rounded-md">
                          {lecture.duration}
                        </span>
                      </div>
                      {activeLecture?.id === lecture.id && (
                        <div className="flex items-center gap-2 text-[9px] font-black text-blue-600 uppercase tracking-[0.2em]">
                          <div className="flex gap-0.5">
                            <div className="w-1 h-3 bg-blue-600 rounded-full animate-[bounce_1s_infinite_0.1s]" />
                            <div className="w-1 h-3 bg-blue-600 rounded-full animate-[bounce_1s_infinite_0.2s]" />
                            <div className="w-1 h-3 bg-blue-600 rounded-full animate-[bounce_1s_infinite_0.3s]" />
                          </div>
                          Currently Reading
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-600 to-blue-700 p-8 rounded-[2.5rem] text-white space-y-6 shadow-2xl shadow-blue-200 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-150 transition-transform duration-700" />
              
              <div className="w-14 h-14 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/20">
                <Award size={28} />
              </div>
              <div className="space-y-2">
                <h4 className="text-xl font-black tracking-tight">Earn Certification</h4>
                <p className="text-sm text-blue-100/80 leading-relaxed">Complete all topics and pass the final assessment to receive your verified certificate.</p>
              </div>
              <button 
                onClick={() => setShowRequirements(true)}
                className="w-full py-4 bg-white text-blue-700 rounded-2xl text-xs font-black uppercase tracking-[0.2em] hover:bg-blue-50 transition-all shadow-xl"
              >
                View Requirements
              </button>
            </div>
          </div>
        </div>

        {/* Requirements Modal */}
        <AnimatePresence>
          {showRequirements && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowRequirements(false)}
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden"
              >
                <div className="p-8 space-y-6">
                  <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                    <Award size={32} />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-display font-bold text-slate-900">Certification Requirements</h3>
                    <p className="text-slate-500">To earn your verified certificate for this course, you must fulfill the following criteria:</p>
                  </div>
                  <ul className="space-y-4">
                    {[
                      'Complete 100% of the study modules',
                      'Pass the final assessment with at least 80%',
                      'Submit all required course assignments',
                      'Maintain an active learning streak'
                    ].map((req, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
                        <div className="mt-1 w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                          <CheckCircle size={12} />
                        </div>
                        {req}
                      </li>
                    ))}
                  </ul>
                  <button 
                    onClick={() => setShowRequirements(false)}
                    className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
                  >
                    Got it, thanks!
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Featured Banner */}
      {!selectedCategory && !searchQuery && (
        <div className="relative h-80 md:h-[450px] rounded-[3rem] overflow-hidden shadow-2xl shadow-blue-100 group">
          <img 
            src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80" 
            alt="Featured"
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/60 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-center p-12 md:p-20 space-y-6">
            <div className="inline-flex items-center gap-3 bg-blue-600 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-xl border border-blue-500">
              <Zap size={14} className="fill-white" />
              <span>Featured Path</span>
            </div>
            <h2 className="text-4xl md:text-7xl font-display font-black text-white max-w-2xl leading-[0.85] tracking-tighter">
              Master the <br/>
              <span className="text-blue-400">Future</span> of Tech.
            </h2>
            <p className="text-slate-300 text-lg md:text-xl max-w-lg leading-relaxed font-medium">
              Join over 10,000+ students learning high-demand skills like AI, Web Development, and Data Science.
            </p>
            <div className="flex items-center gap-6 pt-4">
              <button 
                onClick={() => setSelectedCategory('skills')}
                className="bg-white text-slate-900 px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-blue-600 hover:text-white transition-all flex items-center gap-3 shadow-2xl shadow-black/20"
              >
                Explore Skills
                <ArrowRight size={18} />
              </button>
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-slate-900 overflow-hidden bg-slate-800">
                    <img src={`https://api.dicebear.com/7.x/personas/svg?seed=${i * 123}`} alt="User" referrerPolicy="no-referrer" />
                  </div>
                ))}
                <div className="w-10 h-10 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center text-[10px] font-black text-white">
                  +2k
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Category Header Image (When category is selected) */}
      {selectedCategory && !searchQuery && (
        <div className="relative h-80 rounded-[3rem] overflow-hidden shadow-2xl shadow-slate-200 group">
          <img 
            src={categories.find(c => c.id === selectedCategory)?.thumbnail} 
            alt="Category Header"
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-900/40 to-transparent flex items-center p-16">
            <div className="space-y-6">
              <div className="w-16 h-16 bg-white/10 backdrop-blur-2xl rounded-2xl flex items-center justify-center text-white border border-white/20 shadow-2xl">
                {getIcon(categories.find(c => c.id === selectedCategory)?.icon || '')}
              </div>
              <div className="space-y-3">
                <div className="label-caps !text-blue-400">Learning Path</div>
                <h2 className="text-6xl font-display font-black text-white tracking-tighter leading-none">
                  {categories.find(c => c.id === selectedCategory)?.title}
                </h2>
                <p className="text-slate-300 text-lg max-w-lg leading-relaxed font-medium">
                  {categories.find(c => c.id === selectedCategory)?.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search & Filter Header */}
      <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
        <div className="relative w-full lg:w-[450px]">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text"
            placeholder="Search courses, skills, or exams..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-14 pr-6 py-4 bg-white border border-slate-200 rounded-[2rem] focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm font-medium"
          />
        </div>
        <div className="flex items-center gap-2 bg-slate-100/80 backdrop-blur-sm p-1.5 rounded-[2rem] border border-slate-200/50 overflow-x-auto no-scrollbar w-full lg:w-auto">
          <button 
            onClick={() => setSelectedCategory(null)}
            className={cn(
              "px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.15em] transition-all whitespace-nowrap",
              !selectedCategory ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-900"
            )}
          >
            All Courses
          </button>
          {categories.map(cat => (
            <button 
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={cn(
                "px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.15em] transition-all whitespace-nowrap flex items-center gap-2",
                selectedCategory === cat.id ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-900"
              )}
            >
              <span className="opacity-70">{getIcon(cat.icon)}</span>
              {cat.title}
            </button>
          ))}
        </div>
      </div>

      {/* Categories Grid (Only if no search/category filter) */}
      {!selectedCategory && !searchQuery && (
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-2xl font-display font-black text-slate-900 tracking-tight uppercase">Browse Categories</h3>
              <p className="text-sm text-slate-500 font-medium">Explore our diverse learning paths</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map(cat => (
              <motion.div
                key={cat.id}
                whileHover={{ y: -8, scale: 1.02 }}
                onClick={() => setSelectedCategory(cat.id)}
                className="group relative h-64 rounded-[2.5rem] overflow-hidden shadow-xl shadow-slate-200/50 border border-slate-100 cursor-pointer transition-all"
              >
                <img 
                  src={cat.thumbnail} 
                  alt={cat.title}
                  referrerPolicy="no-referrer"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8 text-left">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center text-white mb-4 border border-white/10 group-hover:bg-blue-600 group-hover:border-blue-500 transition-all">
                    {getIcon(cat.icon)}
                  </div>
                  <h3 className="text-white font-black text-xl tracking-tight">{cat.title}</h3>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-white/60 text-[9px] uppercase tracking-[0.2em] font-black">
                      {courses.filter(c => c.categoryId === cat.id).length} Courses
                    </span>
                    <ArrowRight size={12} className="text-white/40 group-hover:text-white group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Recommended Section (Only if no search/category filter) */}
      {!selectedCategory && !searchQuery && (
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-display font-black text-slate-900 tracking-tight uppercase">Recommended for You</h3>
            <div className="flex items-center gap-3 text-blue-600 text-xs font-black uppercase tracking-widest cursor-pointer group">
              <span>View All Paths</span>
              <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
                <ChevronRight size={16} />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {courses.slice(0, 3).map(course => (
              <motion.div
                key={`rec-${course.id}`}
                whileHover={{ y: -10, scale: 1.02 }}
                onClick={() => setSelectedCourse(course)}
                className="group glass-card rounded-[2.5rem] overflow-hidden shadow-xl shadow-slate-200/50 border border-slate-100 cursor-pointer hover:shadow-2xl hover:shadow-blue-500/10 transition-all"
              >
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={course.thumbnail} 
                    alt={course.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute top-5 left-5">
                    <span className="bg-white/90 backdrop-blur-xl text-slate-900 px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-xl border border-white/50">
                      {course.level}
                    </span>
                  </div>
                </div>
                <div className="p-8 space-y-4">
                  <h4 className="text-lg font-black text-slate-900 line-clamp-1 group-hover:text-blue-600 transition-colors tracking-tight">
                    {course.title}
                  </h4>
                  <div className="flex items-center gap-6 text-slate-500 text-[10px] font-black uppercase tracking-widest">
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="text-blue-500" />
                      {course.duration}
                    </div>
                    <div className="flex items-center gap-2">
                      <Users size={14} className="text-blue-500" />
                      {Math.floor(Math.random() * 5000) + 1000} Students
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Courses Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-display font-bold text-slate-900">
            {selectedCategory ? categories.find(c => c.id === selectedCategory)?.title : 'Recommended for You'}
          </h3>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200">
              {['Beginner', 'Intermediate', 'Advanced'].map(level => (
                <button
                  key={level}
                  onClick={() => setSelectedLevel(selectedLevel === level ? null : level)}
                  className={cn(
                    "px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all",
                    selectedLevel === level ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-900"
                  )}
                >
                  {level}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <Filter size={16} />
              <span className="text-xs font-bold uppercase tracking-widest">Filter</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredCourses.map(course => {
            const progress = getCourseProgress(course.id);
            return (
              <motion.div
                key={course.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ y: -10 }}
                className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden group transition-all hover:shadow-2xl hover:shadow-blue-500/10"
              >
                <div className="relative h-56 overflow-hidden">
                  <img 
                    src={course.thumbnail} 
                    alt={course.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute top-5 left-5 flex gap-2">
                    <span className="px-4 py-1.5 bg-white/90 backdrop-blur-xl rounded-xl text-[9px] font-black text-slate-900 uppercase tracking-[0.15em] shadow-xl border border-white/50">
                      {course.level}
                    </span>
                  </div>
                  <div 
                    onClick={() => setSelectedCourse(course)}
                    className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center cursor-pointer backdrop-blur-[2px]"
                  >
                    <motion.div 
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-blue-600 shadow-2xl"
                    >
                      <BookOpen size={28} className="text-blue-600" />
                    </motion.div>
                  </div>
                </div>
                
                <div className="p-8 space-y-6">
                  <div className="space-y-2">
                    <div className="label-caps !text-blue-600/60">{course.instructor}</div>
                    <h4 className="text-xl font-black text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1 tracking-tight">{course.title}</h4>
                    <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed font-medium">{course.description}</p>
                  </div>

                  <div className="flex items-center justify-between text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] border-y border-slate-50 py-4">
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="text-blue-500" />
                      {course.duration}
                    </div>
                    <div className="flex items-center gap-2">
                      <Users size={14} className="text-blue-500" />
                      1.2k Students
                    </div>
                  </div>

                  {progress > 0 ? (
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="label-caps !text-[8px]">Course Progress</span>
                        <span className="text-xs font-black text-blue-600">{progress}%</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden p-0.5">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.5)]"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="h-12" />
                  )}

                  <button 
                    onClick={() => setSelectedCourse(course)}
                    className="w-full py-4 bg-slate-900 text-white rounded-[1.5rem] text-xs font-black uppercase tracking-[0.2em] hover:bg-blue-600 transition-all flex items-center justify-center gap-3 shadow-xl shadow-slate-200 hover:shadow-blue-200"
                  >
                    {progress > 0 ? 'Continue Learning' : 'Start Journey'}
                    <ArrowRight size={16} />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {filteredCourses.length === 0 && (
          <div className="py-20 text-center space-y-4">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
              <Search size={32} />
            </div>
            <div>
              <h4 className="font-bold text-slate-900">No courses found</h4>
              <p className="text-sm text-slate-500">Try adjusting your search or filters to find what you're looking for.</p>
            </div>
            <button 
              onClick={() => { setSearchQuery(''); setSelectedCategory(null); setSelectedLevel(null); }}
              className="text-blue-600 text-sm font-bold hover:underline"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
