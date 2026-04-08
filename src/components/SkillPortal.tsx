import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Filter, 
  Play, 
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
  ArrowRight
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
      <div className="space-y-6">
        <button 
          onClick={() => { setSelectedCourse(null); setActiveLecture(null); }}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors text-sm font-medium"
        >
          <ArrowRight className="rotate-180" size={16} />
          Back to Courses
        </button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Video Player Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="aspect-video bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-200 relative group">
              {activeLecture ? (
                <iframe
                  src={activeLecture.videoUrl}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-white space-y-4">
                  <div className="w-20 h-20 bg-blue-600/20 rounded-full flex items-center justify-center animate-pulse">
                    <Play size={40} className="text-blue-500 fill-blue-500" />
                  </div>
                  <p className="font-medium text-slate-400">Select a lecture to start learning</p>
                </div>
              )}
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-display font-bold text-slate-900">{activeLecture?.title || selectedCourse.title}</h2>
                  <p className="text-slate-500 mt-1">Instructor: {selectedCourse.instructor}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Course Progress</p>
                    <p className="text-lg font-display font-bold text-blue-600">{currentProgress}%</p>
                  </div>
                  <div className="w-12 h-12 rounded-full border-4 border-slate-100 flex items-center justify-center relative">
                    <svg className="w-full h-full -rotate-90">
                      <circle
                        cx="24"
                        cy="24"
                        r="20"
                        fill="transparent"
                        stroke="currentColor"
                        strokeWidth="4"
                        className="text-blue-600"
                        strokeDasharray={125.6}
                        strokeDashoffset={125.6 - (125.6 * currentProgress) / 100}
                      />
                    </svg>
                  </div>
                </div>
              </div>
              <p className="text-slate-600 leading-relaxed">{selectedCourse.description}</p>
            </div>
          </div>

          {/* Playlist Section */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                  <BarChart3 size={18} className="text-blue-600" />
                  Course Content
                </h3>
              </div>
              <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
                {selectedCourse.lectures.map((lecture, i) => (
                  <div
                    key={lecture.id}
                    onClick={() => setActiveLecture(lecture)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        setActiveLecture(lecture);
                      }
                    }}
                    className={cn(
                      "w-full p-4 flex items-start gap-4 transition-all text-left hover:bg-slate-50 cursor-pointer",
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
                          "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                          isLectureCompleted(lecture.id, selectedCourse.id)
                            ? "bg-emerald-500 border-emerald-500 text-white"
                            : "border-slate-200 text-transparent hover:border-emerald-500"
                        )}
                      >
                        <CheckCircle size={14} />
                      </button>
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex justify-between items-start gap-2">
                        <span className={cn(
                          "text-sm font-medium leading-tight",
                          activeLecture?.id === lecture.id ? "text-blue-600" : "text-slate-700"
                        )}>
                          {i + 1}. {lecture.title}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 whitespace-nowrap">{lecture.duration}</span>
                      </div>
                      {activeLecture?.id === lecture.id && (
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-blue-500 uppercase tracking-wider">
                          <Play size={10} className="fill-blue-500" />
                          Now Playing
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-600 to-blue-700 p-6 rounded-3xl text-white space-y-4 shadow-lg shadow-blue-200">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Award size={20} />
              </div>
              <div>
                <h4 className="font-bold">Earn a Certificate</h4>
                <p className="text-xs text-blue-100 mt-1">Complete all lectures and pass the final assessment to receive your verified certificate.</p>
              </div>
              <button 
                onClick={() => setShowRequirements(true)}
                className="w-full py-2.5 bg-white text-blue-700 rounded-xl text-xs font-bold hover:bg-blue-50 transition-colors"
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
                      'Complete 100% of the video lectures',
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
        <div className="relative h-64 md:h-80 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-blue-100 group">
          <img 
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1200" 
            alt="Featured"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/40 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-center p-8 md:p-12 space-y-4">
            <div className="inline-flex items-center gap-2 bg-blue-500 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
              <Zap size={12} />
              <span>Featured Course</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-display font-bold text-white max-w-lg leading-tight">
              Master the Future of <span className="text-blue-400">Technology</span>
            </h2>
            <p className="text-slate-300 text-sm md:text-base max-w-md">
              Join over 10,000+ students learning high-demand skills like AI, Web Development, and Data Science.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <button 
                onClick={() => setSelectedCategory('skills')}
                className="bg-white text-slate-900 px-6 py-3 rounded-2xl font-bold text-sm hover:bg-blue-50 transition-all flex items-center gap-2"
              >
                Explore Skills
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Category Header Image (When category is selected) */}
      {selectedCategory && !searchQuery && (
        <div className="relative h-48 rounded-[2rem] overflow-hidden shadow-lg">
          <img 
            src={categories.find(c => c.id === selectedCategory)?.thumbnail} 
            alt="Category Header"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 to-slate-900/20 flex items-center p-8">
            <div className="space-y-2">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white">
                {getIcon(categories.find(c => c.id === selectedCategory)?.icon || '')}
              </div>
              <h2 className="text-3xl font-display font-bold text-white">
                {categories.find(c => c.id === selectedCategory)?.title}
              </h2>
              <p className="text-slate-300 text-sm max-w-md">
                {categories.find(c => c.id === selectedCategory)?.description}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Search & Filter Header */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text"
            placeholder="Search courses, skills, or exams..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
          />
        </div>
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-2xl border border-slate-200 overflow-x-auto no-scrollbar w-full md:w-auto">
          <button 
            onClick={() => setSelectedCategory(null)}
            className={cn(
              "px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap",
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
                "px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2",
                selectedCategory === cat.id ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-900"
              )}
            >
              {getIcon(cat.icon)}
              {cat.title}
            </button>
          ))}
        </div>
      </div>

      {/* Categories Grid (Only if no search/category filter) */}
      {!selectedCategory && !searchQuery && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-display font-bold text-slate-900">Browse Categories</h3>
            <p className="text-sm text-slate-500 font-medium">Explore our diverse learning paths</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map(cat => (
              <motion.div
                key={cat.id}
                whileHover={{ y: -5 }}
                onClick={() => setSelectedCategory(cat.id)}
                className="group relative h-48 rounded-3xl overflow-hidden shadow-sm border border-slate-200 cursor-pointer"
              >
                <img 
                  src={cat.thumbnail} 
                  alt={cat.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-left">
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center text-white mb-3">
                    {getIcon(cat.icon)}
                  </div>
                  <h3 className="text-white font-bold text-lg">{cat.title}</h3>
                  <p className="text-white/60 text-[10px] uppercase tracking-widest font-bold mt-1">
                    {courses.filter(c => c.categoryId === cat.id).length} Courses
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Recommended Section (Only if no search/category filter) */}
      {!selectedCategory && !searchQuery && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-display font-bold text-slate-900">Recommended for You</h3>
            <div className="flex items-center gap-2 text-blue-600 text-sm font-bold cursor-pointer hover:underline">
              View All <ChevronRight size={16} />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {courses.slice(0, 3).map(course => (
              <motion.div
                key={`rec-${course.id}`}
                whileHover={{ y: -5 }}
                onClick={() => setSelectedCourse(course)}
                className="group bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-200 cursor-pointer hover:shadow-xl hover:shadow-blue-500/5 transition-all"
              >
                <div className="relative h-40">
                  <img 
                    src={course.thumbnail} 
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/90 backdrop-blur-md text-slate-900 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm">
                      {course.level}
                    </span>
                  </div>
                </div>
                <div className="p-5 space-y-3">
                  <h4 className="font-bold text-slate-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
                    {course.title}
                  </h4>
                  <div className="flex items-center gap-4 text-slate-500 text-xs font-medium">
                    <div className="flex items-center gap-1">
                      <Clock size={14} />
                      {course.duration}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users size={14} />
                      {Math.floor(Math.random() * 5000) + 1000} students
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.map(course => {
            const progress = getCourseProgress(course.id);
            return (
              <motion.div
                key={course.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden group hover:shadow-xl hover:shadow-blue-500/5 transition-all"
              >
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={course.thumbnail} 
                    alt={course.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-lg text-[10px] font-bold text-slate-900 uppercase tracking-wider shadow-sm">
                      {course.level}
                    </span>
                  </div>
                  <div 
                    onClick={() => setSelectedCourse(course)}
                    className="absolute inset-0 bg-slate-900/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                  >
                    <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-blue-600 shadow-xl transform scale-90 group-hover:scale-100 transition-transform">
                      <Play size={24} className="fill-blue-600 ml-1" />
                    </div>
                  </div>
                </div>
                
                <div className="p-6 space-y-4">
                  <div className="space-y-1">
                    <h4 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">{course.title}</h4>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{course.description}</p>
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    <div className="flex items-center gap-1.5">
                      <Clock size={14} />
                      {course.duration}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users size={14} />
                      1.2k Students
                    </div>
                  </div>

                  {progress > 0 && (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-[10px] font-bold">
                        <span className="text-slate-400 uppercase tracking-widest">Progress</span>
                        <span className="text-blue-600">{progress}%</span>
                      </div>
                      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          className="h-full bg-blue-600 rounded-full"
                        />
                      </div>
                    </div>
                  )}

                  <button 
                    onClick={() => setSelectedCourse(course)}
                    className="w-full py-3 bg-slate-50 text-slate-900 rounded-2xl text-xs font-bold hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center gap-2"
                  >
                    {progress > 0 ? 'Continue Learning' : 'Start Course'}
                    <ChevronRight size={14} />
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
