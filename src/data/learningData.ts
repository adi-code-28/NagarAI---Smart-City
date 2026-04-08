import { Category, Course } from '../types';

export const CATEGORIES: Category[] = [
  {
    id: 'jee',
    title: 'JEE Preparation',
    description: 'Master Physics, Chemistry, and Maths for JEE Main & Advanced.',
    thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=800',
    icon: 'GraduationCap'
  },
  {
    id: 'neet',
    title: 'NEET Preparation',
    description: 'Comprehensive Biology, Physics, and Chemistry for Medical aspirants.',
    thumbnail: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&q=80&w=800',
    icon: 'Activity'
  },
  {
    id: 'class10',
    title: 'Class 10 Boards',
    description: 'Complete syllabus coverage for Class 10 Board exams.',
    thumbnail: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=800',
    icon: 'BookOpen'
  },
  {
    id: 'skills',
    title: 'Skill Development',
    description: 'Learn Coding, AI, Communication, and more for the future.',
    thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800',
    icon: 'Zap'
  }
];

export const COURSES: Course[] = [
  {
    id: 'c1',
    categoryId: 'jee',
    title: 'Physics: Mechanics Masterclass',
    description: 'Deep dive into Kinematics, Laws of Motion, and Work Power Energy.',
    thumbnail: 'https://images.unsplash.com/photo-1636466484202-cae263f05812?auto=format&fit=crop&q=80&w=800',
    instructor: 'Dr. Amit Sharma',
    level: 'Advanced',
    duration: '24 Hours',
    lectures: [
      { id: 'l1', courseId: 'c1', title: 'Introduction to Vectors', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '45m', order: 1 },
      { id: 'l2', courseId: 'c1', title: 'Newton\'s First Law', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '50m', order: 2 },
      { id: 'l3', courseId: 'c1', title: 'Friction and its applications', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '55m', order: 3 }
    ]
  },
  {
    id: 'c2',
    categoryId: 'skills',
    title: 'Full Stack Web Development',
    description: 'Learn React, Node.js, and MongoDB from scratch.',
    thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800',
    instructor: 'Sandeep Singh',
    level: 'Beginner',
    duration: '40 Hours',
    lectures: [
      { id: 'l4', courseId: 'c2', title: 'HTML & CSS Basics', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '60m', order: 1 },
      { id: 'l5', courseId: 'c2', title: 'JavaScript Fundamentals', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '90m', order: 2 }
    ]
  },
  {
    id: 'c3',
    categoryId: 'skills',
    title: 'AI & Machine Learning',
    description: 'Understand the basics of AI and build your first ML model.',
    thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800',
    instructor: 'Priya Verma',
    level: 'Intermediate',
    duration: '30 Hours',
    lectures: [
      { id: 'l6', courseId: 'c3', title: 'What is AI?', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '40m', order: 1 }
    ]
  }
];
