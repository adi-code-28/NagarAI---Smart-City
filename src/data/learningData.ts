import { Category, Course } from '../types';

export const CATEGORIES: Category[] = [
  {
    id: 'jee',
    title: 'JEE Preparation',
    description: 'Master Physics, Chemistry, and Maths for JEE Main & Advanced.',
    thumbnail: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=800&q=80',
    icon: 'GraduationCap'
  },
  {
    id: 'neet',
    title: 'NEET Preparation',
    description: 'Comprehensive Biology, Physics, and Chemistry for Medical aspirants.',
    thumbnail: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=800&q=80',
    icon: 'Activity'
  },
  {
    id: 'class10',
    title: 'Class 10 Boards',
    description: 'Complete syllabus coverage for Class 10 Board exams.',
    thumbnail: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80',
    icon: 'BookOpen'
  },
  {
    id: 'skills',
    title: 'Skill Development',
    description: 'Learn Coding, AI, Communication, and more for the future.',
    thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
    icon: 'Zap'
  }
];

export const COURSES: Course[] = [
  {
    id: 'c1',
    categoryId: 'jee',
    title: 'Physics: Mechanics Masterclass',
    description: 'Deep dive into Kinematics, Laws of Motion, and Work Power Energy.',
    thumbnail: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=800&q=80',
    instructor: 'Dr. Amit Sharma',
    level: 'Advanced',
    duration: '24 Hours',
    lectures: [
      { id: 'l1', courseId: 'c1', title: 'Introduction to Vectors', duration: '45m', order: 1, content: '<h3 class="text-xl font-bold mb-4">Theory: Vectors</h3><p>Vectors are quantities with both magnitude and direction.</p>' },
      { id: 'l2', courseId: 'c1', title: 'Newton\'s First Law', duration: '50m', order: 2, content: '<h3 class="text-xl font-bold mb-4">Theory: Newton\'s First Law</h3><p>An object at rest stays at rest unless acted upon by a force.</p>' },
      { id: 'l3', courseId: 'c1', title: 'Friction and its applications', duration: '55m', order: 3, content: '<h3 class="text-xl font-bold mb-4">Theory: Friction</h3><p>Friction is the resistance to motion of one object moving relative to another.</p>' }
    ]
  },
  {
    id: 'c2',
    categoryId: 'skills',
    title: 'Full Stack Web Development',
    description: 'Learn React, Node.js, and MongoDB from scratch.',
    thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80',
    instructor: 'Sandeep Singh',
    level: 'Beginner',
    duration: '40 Hours',
    lectures: [
      { id: 'l4', courseId: 'c2', title: 'HTML & CSS Basics', duration: '60m', order: 1, content: '<h3 class="text-xl font-bold mb-4">Theory: HTML & CSS</h3><p>The building blocks of the web.</p>' },
      { id: 'l5', courseId: 'c2', title: 'JavaScript Fundamentals', duration: '90m', order: 2, content: '<h3 class="text-xl font-bold mb-4">Theory: JavaScript</h3><p>The programming language of the web.</p>' }
    ]
  },
  {
    id: 'c3',
    categoryId: 'skills',
    title: 'AI & Machine Learning',
    description: 'Understand the basics of AI and build your first ML model.',
    thumbnail: 'https://images.unsplash.com/photo-1555255707-c07966088b7b?auto=format&fit=crop&w=800&q=80',
    instructor: 'Priya Verma',
    level: 'Intermediate',
    duration: '30 Hours',
    lectures: [
      { id: 'l6', courseId: 'c3', title: 'What is AI?', duration: '40m', order: 1, content: '<h3 class="text-xl font-bold mb-4">Theory: Artificial Intelligence</h3><p>AI is the simulation of human intelligence by machines.</p>' }
    ]
  }
];
