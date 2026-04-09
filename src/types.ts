export type Tab = 'overview' | 'complaints' | 'transport' | 'agriculture' | 'skills' | 'events' | 'profile' | 'about';

export interface CityEvent {
  id: string;
  title: string;
  category: 'hackathon' | 'cultural' | 'social' | 'technical';
  date: string;
  time: string;
  location: string;
  description: string;
  organizer: string;
  image: string;
  tags: string[];
  registrationUrl?: string;
  isFree: boolean;
  coordinates?: { lat: number; lng: number };
}

export interface Category {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  icon: string;
}

export interface Course {
  id: string;
  categoryId: string;
  title: string;
  description: string;
  thumbnail: string;
  instructor: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  lectures: Lecture[];
}

export interface Lecture {
  id: string;
  courseId: string;
  title: string;
  videoUrl: string;
  duration: string;
  order: number;
  content?: string;
}

export interface UserProgress {
  courseId: string;
  completedLectures: string[];
  progressPercent: number;
}

export interface TrackingAction {
  status: 'open' | 'in_progress' | 'resolved';
  action: string;
  time: string;
  timestamp?: number;
}

export interface Complaint {
  id: string;
  title: string;
  category: 'road' | 'garbage' | 'electricity' | 'water' | 'infrastructure' | 'other';
  location: string;
  status: 'open' | 'in_progress' | 'resolved';
  priority: 'low' | 'medium' | 'high' | 'critical';
  score: number;
  time: string;
  department: string;
  deptEmail: string;
  description?: string;
  history: TrackingAction[];
}

export interface Notification {
  id: string;
  complaintId: string;
  title: string;
  action: string;
  status: string;
  time: string;
  timestamp?: number;
  read: boolean;
}
