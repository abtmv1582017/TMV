export type UserRole =
  | 'super_admin'
  | 'principal'
  | 'dept_head'
  | 'faculty'
  | 'student'
  | 'tech_support';

export type AccountStatus = 'active' | 'deactivated' | 'pending_activation' | 'locked';

export interface User {
  id: string;
  institutionUserId: string; // e.g. TM-STD-2026-00042, TM-FAC-0028, etc.
  name: string;
  nameBengali?: string;
  email: string;
  phone: string;
  passwordHash: string; // Cryptographic hash
  passwordSalt?: string;
  role: UserRole;
  departmentId?: string;
  programmeId?: string;
  designation?: string;
  registrationNumber?: string;
  semester?: number;
  rollNumber?: string;
  employeeId?: string;
  avatar?: string;
  isActive: boolean;
  accountStatus: AccountStatus;
  failedLoginAttempts: number;
  lockoutUntil?: string | null;
  emailVerified: boolean;
  mobileVerified: boolean;
  enrolledCourseIds?: string[];
  assignedCourseIds?: string[];
  createdAt?: string;
  lastLogin?: string;
}

export interface PasswordResetRecord {
  id: string;
  userId: string;
  institutionUserId: string;
  type: 'email' | 'mobile_otp';
  token: string;
  otp?: string;
  targetContact: string; // masked email or phone
  attemptsRemaining: number;
  expiresAt: string;
  isUsed: boolean;
  createdAt: string;
}

export interface AuthPolicy {
  minPasswordLength: number;
  requireMixedCase: boolean;
  requireNumbers: boolean;
  requireSpecialChars: boolean;
  maxFailedAttempts: number;
  lockoutDurationMinutes: number;
  otpExpiryMinutes: number;
  resetLinkExpiryMinutes: number;
  studentIdPrefix: string;
  facultyIdPrefix: string;
  hodIdPrefix: string;
  adminIdPrefix: string;
  sadmIdPrefix: string;
  techIdPrefix: string;
}

export interface DispatchedNotification {
  id: string;
  userId: string;
  type: 'email' | 'sms';
  destination: string;
  subject: string;
  message: string;
  timestamp: string;
  actionUrl?: string;
  otpCode?: string;
  isRead?: boolean;
}

export interface AcademicSession {
  id: string;
  name: string;
  year: string;
  status: 'active' | 'archived';
  startDate: string;
  endDate: string;
  isCurrent: boolean;
}

export interface Department {
  id: string;
  code: string;
  name: string;
  nameBengali: string;
  headFacultyId?: string;
  headFacultyName?: string;
  description: string;
  totalStudents: number;
  totalFaculty: number;
}

export interface Programme {
  id: string;
  code: string;
  name: string;
  departmentId: string;
  degreeType: 'UG' | 'PG' | 'Diploma';
  durationYears: number;
  totalSemesters: number;
}

export interface LearningUnit {
  id: string;
  title: string;
  order: number;
  topics: string[];
}

export interface Course {
  id: string;
  code: string;
  title: string;
  titleBengali?: string;
  departmentId: string;
  programmeId: string;
  semester: number;
  sessionId: string;
  facultyId: string;
  facultyName: string;
  description: string;
  learningObjectives?: string[];
  syllabusSummary?: string;
  credits: number;
  totalEnrolled: number;
  status: 'draft' | 'published' | 'archived';
  units: LearningUnit[];
  coverGradient?: string;
}

export interface LearningResource {
  id: string;
  title: string;
  titleBengali?: string;
  courseId?: string;
  courseCode?: string;
  departmentId?: string;
  unitId?: string;
  category: 'department' | 'course' | 'general' | 'notice' | 'reference';
  fileType: 'pdf' | 'doc' | 'ppt' | 'xls' | 'video' | 'link' | 'image';
  fileSize: string;
  url: string;
  externalUrl?: string;
  uploadedBy: string;
  uploadedByName: string;
  uploadedAt: string;
  downloadCount: number;
  description: string;
  isPublic?: boolean;
}

export interface Assignment {
  id: string;
  courseId: string;
  courseCode: string;
  title: string;
  instructions: string;
  referenceFileUrl?: string;
  referenceFileName?: string;
  maxMarks: number;
  openDate: string;
  dueDate: string;
  allowLate: boolean;
  submissionFormat: 'pdf' | 'text' | 'zip' | 'any';
  status: 'draft' | 'published' | 'closed';
  createdByName: string;
}

export interface AssignmentSubmission {
  id: string;
  assignmentId: string;
  courseId: string;
  studentId: string;
  studentName: string;
  studentRoll: string;
  submittedAt: string;
  fileUrl?: string;
  fileName?: string;
  textContent?: string;
  status: 'submitted' | 'late' | 'under_evaluation' | 'evaluated' | 'returned';
  marksObtained?: number;
  feedback?: string;
  evaluatedBy?: string;
  evaluatedAt?: string;
}

export type QuestionType =
  | 'mcq'
  | 'multiple_select'
  | 'true_false'
  | 'short_answer'
  | 'descriptive'
  | 'fill_blank';

export interface Question {
  id: string;
  type: QuestionType;
  prompt: string;
  options?: string[];
  correctAnswers: (string | number)[];
  marks: number;
  topic?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  explanation?: string;
}

export interface Assessment {
  id: string;
  courseId: string;
  courseCode: string;
  title: string;
  instructions: string;
  timeLimitMinutes: number;
  totalMarks: number;
  passingMarks: number;
  openDate: string;
  closeDate: string;
  randomizeQuestions: boolean;
  maxAttempts: number;
  questions: Question[];
  status: 'draft' | 'published' | 'closed';
  resultsPublished: boolean;
  createdByName: string;
}

export interface AssessmentAttempt {
  id: string;
  assessmentId: string;
  studentId: string;
  studentName: string;
  studentRoll: string;
  startTime: string;
  submittedTime?: string;
  status: 'in_progress' | 'submitted' | 'graded';
  answers: Record<string, any>;
  autoScore: number;
  finalScore: number;
  isGraded: boolean;
  facultyFeedback?: string;
}

export interface GradeItem {
  id: string;
  studentId: string;
  studentName: string;
  studentRoll: string;
  courseId: string;
  courseCode: string;
  courseTitle: string;
  assignmentMarks: number;
  assignmentTotal: number;
  quizMarks: number;
  quizTotal: number;
  midtermMarks: number;
  midtermTotal: number;
  finalGrade: string;
  gpa: number;
  status: 'draft' | 'published';
  publishedDate?: string;
}

export interface AttendanceRecord {
  id: string;
  courseId: string;
  date: string;
  topicCovered: string;
  facultyId: string;
  presentStudentIds: string[];
  absentStudentIds: string[];
}

export interface Announcement {
  id: string;
  title: string;
  titleBengali?: string;
  content: string;
  authorName: string;
  authorRole: string;
  targetAudience: 'all' | 'faculty' | 'students' | 'department';
  departmentId?: string;
  priority: 'normal' | 'urgent' | 'info';
  publishedAt: string;
  expiresAt?: string;
  readBy: string[];
  attachmentName?: string;
}

export interface DiscussionReply {
  id: string;
  threadId: string;
  authorId: string;
  authorName: string;
  authorRole: UserRole;
  content: string;
  createdAt: string;
  isFacultyResponse?: boolean;
}

export interface DiscussionThread {
  id: string;
  courseId: string;
  courseCode: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  authorRole: UserRole;
  createdAt: string;
  replies: DiscussionReply[];
  tags: string[];
  isPinned?: boolean;
}

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  userEmail: string;
  category: 'login' | 'course' | 'quiz' | 'submission' | 'technical' | 'other';
  subject: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'waiting' | 'resolved' | 'closed';
  createdAt: string;
  updatedAt: string;
  replies: {
    id: string;
    author: string;
    message: string;
    date: string;
    isStaff: boolean;
  }[];
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userName: string;
  userRole: string;
  action: string;
  details: string;
  ipAddress: string;
}

export interface InstitutionalSettings {
  collegeName: string;
  collegeBengaliName: string;
  tagline: string;
  location: string;
  address: string;
  contactEmail: string;
  contactPhone: string;
  establishedYear: number;
  affiliation: string;
  naacGrade: string;
  currentSessionId: string;
  gradingScale: {
    grade: string;
    minPercent: number;
    gpa: number;
    description: string;
  }[];
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  endDate?: string;
  type: 'exam' | 'assignment' | 'holiday' | 'seminar' | 'admission' | 'general';
  description: string;
  departmentId?: string;
  color?: string;
}
