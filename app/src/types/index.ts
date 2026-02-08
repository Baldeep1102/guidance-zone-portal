// User Types
export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  role?: 'USER' | 'ADMIN';
  authProvider?: 'EMAIL' | 'GOOGLE';
  avatarUrl?: string | null;
  emailVerified?: boolean;
  registeredCourses?: string[];
  createdAt: string;
  _count?: { registrations: number };
}

// Course Types
export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  duration: string;
  level: string;
  thumbnail?: string | null;
  videoUrl?: string;
  materials: CourseMaterial[];
  sessions?: CourseSession[];
  startDate: string;
  endDate: string;
  isActive: boolean;
  maxParticipants?: number | null;
  registeredCount: number;
  recurrence?: 'NONE' | 'DAILY' | 'WEEKLY' | 'BIWEEKLY' | 'MONTHLY';
  recurrenceDays?: string | null;
  sessionTime?: string | null;
  sessionDuration?: number | null;
  timezone?: string | null;
  joinLink?: string | null;
  paymentLink?: string | null;
  visibility?: 'PUBLIC' | 'PRIVATE';
  sortOrder?: number;
  _count?: { registrations: number };
}

export interface CourseMaterial {
  id: string;
  title: string;
  type: 'video' | 'pdf' | 'audio' | 'link';
  url: string;
  description?: string;
  sortOrder?: number;
  courseId?: string;
}

export interface CourseSession {
  id: string;
  title: string;
  date: string;
  recordingUrl?: string | null;
  courseId?: string;
}

// Talk/Video Types
export interface Talk {
  id: string;
  title: string;
  description: string;
  youtubeUrl: string;
  thumbnail?: string | null;
  duration: string;
  category: string;
  tags: string[];
  date: string;
  featured: boolean;
  sortOrder?: number;
}

// Book Types
export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  coverImage?: string | null;
  publishYear: number;
  category: string;
  purchaseLink?: string;
  featured: boolean;
  sortOrder?: number;
}

// Download Types
export interface Download {
  id: string;
  title: string;
  description?: string | null;
  category: string;
  fileUrl: string;
  fileType: string;
  fileSize?: number | null;
  thumbnail?: string | null;
  featured: boolean;
  sortOrder?: number;
}

// Project Types
export interface Project {
  id: string;
  title: string;
  description: string;
  coverImage?: string | null;
  category: string;
  status: 'ONGOING' | 'COMPLETED' | 'UPCOMING';
  location?: string | null;
  impactStats?: any;
  gallery: string[];
  featured: boolean;
  sortOrder?: number;
}

// Registration Types
export interface Registration {
  id: string;
  userId: string;
  courseId: string;
  registrationDate: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
  user?: User;
  course?: Course;
}

// Site Settings Types
export interface SiteSettings {
  id: string;
  siteName: string;
  logoUrl?: string | null;
  heroImages?: any;
  aboutContent?: any;
  contactEmail?: string | null;
  socialLinks?: any;
  satsangSchedule?: any;
  announcementBanner?: string | null;
}

// Navigation Types
export interface NavItem {
  label: string;
  path: string;
  icon?: string;
}

// Form Types
export interface RegistrationFormData {
  name: string;
  email: string;
  phone: string;
}

// Dashboard Types
export interface DashboardStats {
  totalUsers: number;
  totalCourses: number;
  totalTalks: number;
  totalBooks: number;
  totalRegistrations: number;
  totalDownloads: number;
  totalProjects: number;
  recentRegistrations: Registration[];
}
