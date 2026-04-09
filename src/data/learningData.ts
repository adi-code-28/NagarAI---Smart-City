import { Category, Course } from '../types';

export const CATEGORIES: Category[] = [
  {
    id: 'jee',
    title: 'JEE Preparation',
    description: 'Master Physics, Chemistry, and Maths for JEE Main & Advanced.',
    thumbnail: 'https://picsum.photos/seed/jee_cat/800/600',
    icon: 'GraduationCap'
  },
  {
    id: 'neet',
    title: 'NEET Preparation',
    description: 'Comprehensive Biology, Physics, and Chemistry for Medical aspirants.',
    thumbnail: 'https://picsum.photos/seed/neet_cat/800/600',
    icon: 'Activity'
  },
  {
    id: 'class10',
    title: 'Class 10 Boards',
    description: 'Complete syllabus coverage for Class 10 Board exams.',
    thumbnail: 'https://picsum.photos/seed/class10_cat/800/600',
    icon: 'BookOpen'
  },
  {
    id: 'skills',
    title: 'Skill Development',
    description: 'Learn Coding, AI, Communication, and more for the future.',
    thumbnail: 'https://picsum.photos/seed/skills_cat/800/600',
    icon: 'Zap'
  }
];

export const COURSES: Course[] = [
  {
    id: 'c1',
    categoryId: 'jee',
    title: 'Physics: Mechanics Masterclass',
    description: 'Deep dive into Kinematics, Laws of Motion, and Work Power Energy.',
    thumbnail: 'https://picsum.photos/seed/mechanics/800/600',
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
    thumbnail: 'https://picsum.photos/seed/webdev_fallback/800/600',
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
    thumbnail: 'https://picsum.photos/seed/ai_fallback/800/600',
    instructor: 'Priya Verma',
    level: 'Intermediate',
    duration: '30 Hours',
    lectures: [
      { id: 'l6', courseId: 'c3', title: 'What is AI?', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '40m', order: 1 }
    ]
  }
];
