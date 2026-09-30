import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  UserRole,
  AcademicSession,
  Department,
  Programme,
  Course,
  LearningResource,
  Assignment,
  AssignmentSubmission,
  Assessment,
  AssessmentAttempt,
  GradeItem,
  AttendanceRecord,
  Announcement,
  DiscussionThread,
  SupportTicket,
  InstitutionalSettings,
  CalendarEvent,
  AuditLog,
  AuthPolicy,
  PasswordResetRecord,
  DispatchedNotification,
  InstitutionalDocument,
  ApprovalRequest,
  ClassSwapRequest,
  ResourceVersion
} from '../types';
import { StorageService } from '../services/storage';
import { AuthService, defaultAuthPolicy } from '../services/authService';
import { translations, Language } from '../i18n/translations';

interface AppContextType {
  currentUser: User;
  setCurrentUser: (user: User) => void;
  switchRole: (role: UserRole) => void;
  users: User[];
  addUser: (user: Omit<User, 'id'>) => void;
  updateUser: (user: User) => void;

  // Authentication & Security
  isAuthenticated: boolean;
  login: (credential: string, password: string, selectedRole?: UserRole) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  requestPasswordReset: (identifier: string, method: 'email' | 'mobile_otp') => Promise<{ success: boolean; message: string; record?: PasswordResetRecord; notification?: DispatchedNotification }>;
  verifyOtp: (token: string, otp: string) => Promise<{ success: boolean; error?: string }>;
  completePasswordReset: (token: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
  requestUserIdRetrieval: (contact: string) => Promise<{ success: boolean; message: string; foundUserId?: string; notification?: DispatchedNotification }>;
  activateAccount: (userIdOrEmail: string, activationCode: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
  changeUserPassword: (userId: string, currentPass: string, newPass: string) => Promise<{ success: boolean; error?: string }>;
  unlockUserAccount: (userId: string) => void;
  authPolicy: AuthPolicy;
  updateAuthPolicy: (newPolicy: AuthPolicy) => void;
  dispatchedNotifications: DispatchedNotification[];
  dismissNotification: (id: string) => void;
  activeAuthModal: 'login' | 'forgot_password' | 'forgot_user_id' | 'account_activation' | 'profile' | 'user_manual' | null;
  setActiveAuthModal: (modal: 'login' | 'forgot_password' | 'forgot_user_id' | 'account_activation' | 'profile' | 'user_manual' | null) => void;

  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof translations.en) => string;

  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedCourseId: string | null;
  setSelectedCourseId: (id: string | null) => void;
  selectedAssignmentId: string | null;
  setSelectedAssignmentId: (id: string | null) => void;
  activeQuizId: string | null;
  setActiveQuizId: (id: string | null) => void;

  settings: InstitutionalSettings;
  updateSettings: (newSettings: InstitutionalSettings) => void;
  sessions: AcademicSession[];
  departments: Department[];
  programmes: Programme[];
  courses: Course[];
  resources: LearningResource[];
  assignments: Assignment[];
  submissions: AssignmentSubmission[];
  assessments: Assessment[];
  attempts: AssessmentAttempt[];
  grades: GradeItem[];
  attendance: AttendanceRecord[];
  announcements: Announcement[];
  discussions: DiscussionThread[];
  tickets: SupportTicket[];
  events: CalendarEvent[];
  auditLogs: AuditLog[];
  institutionalDocs: InstitutionalDocument[];
  approvalRequests: ApprovalRequest[];
  classSwaps: ClassSwapRequest[];

  addCourse: (course: Omit<Course, 'id' | 'totalEnrolled'>) => void;
  updateCourse: (course: Course) => void;
  assignFacultyToCourse: (courseId: string, facultyId: string, facultyName: string) => void;
  addResource: (res: Omit<LearningResource, 'id' | 'uploadedAt' | 'downloadCount'>) => void;
  updateResource: (res: LearningResource) => void;
  deleteResource: (id: string) => void;
  archiveResource: (id: string) => void;
  restoreResource: (id: string) => void;
  submitResourceForApproval: (id: string) => void;
  approveResource: (id: string, reviewNotes?: string) => void;
  returnResourceForCorrection: (id: string, reviewNotes: string) => void;
  uploadResourceNewVersion: (id: string, fileDetails: { fileName: string; fileUrl: string; fileSize: string; changeSummary?: string }) => void;
  restoreResourceVersion: (id: string, versionNumber: number) => void;
  incrementResourceDownload: (id: string) => void;
  addAssignment: (asg: Omit<Assignment, 'id'>) => void;
  submitAssignment: (sub: Omit<AssignmentSubmission, 'id' | 'submittedAt'>) => void;
  evaluateSubmission: (subId: string, marks: number, feedback: string) => void;
  returnSubmissionForCorrection: (subId: string, feedback: string) => void;
  resubmitAssignment: (subId: string, fileDetails: { fileName?: string; fileUrl?: string; textContent?: string; comment?: string }) => void;
  addAssessment: (assessment: Omit<Assessment, 'id'>) => void;
  submitQuizAttempt: (attempt: Omit<AssessmentAttempt, 'id'>) => void;
  markAttendance: (rec: Omit<AttendanceRecord, 'id'>) => void;
  publishAnnouncement: (ann: Omit<Announcement, 'id' | 'publishedAt' | 'readBy'>) => void;
  markAnnouncementRead: (id: string) => void;
  addDiscussionThread: (th: Omit<DiscussionThread, 'id' | 'createdAt' | 'replies'>) => void;
  replyToDiscussion: (threadId: string, content: string) => void;
  createSupportTicket: (ticket: Omit<SupportTicket, 'id' | 'ticketNumber' | 'createdAt' | 'updatedAt' | 'replies'>) => void;
  replySupportTicket: (ticketId: string, message: string) => void;
  updateTicketStatus: (ticketId: string, status: SupportTicket['status']) => void;
  publishCourseGrades: (courseId: string) => void;
  addAcademicSession: (sess: Omit<AcademicSession, 'id'>) => void;
  addDepartment: (dept: Omit<Department, 'id'>) => void;
  addProgramme: (prog: Omit<Programme, 'id'>) => void;

  addInstitutionalDoc: (doc: Omit<InstitutionalDocument, 'id' | 'publicationDate'>) => void;
  updateInstitutionalDoc: (doc: InstitutionalDocument) => void;
  deleteInstitutionalDoc: (id: string) => void;

  createApprovalRequest: (req: Omit<ApprovalRequest, 'id' | 'submittedAt' | 'status'>) => void;
  reviewApprovalRequest: (reqId: string, status: 'approved' | 'returned_for_correction' | 'rejected', reviewNotes?: string) => void;

  requestClassSwap: (swap: Omit<ClassSwapRequest, 'id' | 'status' | 'submittedAt'>) => void;
  reviewClassSwap: (swapId: string, status: 'approved' | 'rejected', reviewNotes?: string) => void;

  globalSearchQuery: string;
  setGlobalSearchQuery: (q: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(() => StorageService.getUsers());
  const [currentUserId, setCurrentUserId] = useState<string>(() => StorageService.getActiveUserId());
  const [language, setLanguageState] = useState<Language>(() => StorageService.getLanguage());

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string | null>(null);
  const [activeQuizId, setActiveQuizId] = useState<string | null>(null);
  const [globalSearchQuery, setGlobalSearchQuery] = useState<string>('');

  const [settings, setSettings] = useState<InstitutionalSettings>(() => StorageService.getSettings());
  const [sessions, setSessions] = useState<AcademicSession[]>(() => StorageService.getSessions());
  const [departments, setDepartments] = useState<Department[]>(() => StorageService.getDepartments());
  const [programmes, setProgrammes] = useState<Programme[]>(() => StorageService.getProgrammes());
  const [courses, setCourses] = useState<Course[]>(() => StorageService.getCourses());
  const [resources, setResources] = useState<LearningResource[]>(() => StorageService.getResources());
  const [assignments, setAssignments] = useState<Assignment[]>(() => StorageService.getAssignments());
  const [submissions, setSubmissions] = useState<AssignmentSubmission[]>(() => StorageService.getSubmissions());
  const [assessments, setAssessments] = useState<Assessment[]>(() => StorageService.getAssessments());
  const [attempts, setAttempts] = useState<AssessmentAttempt[]>(() => StorageService.getAttempts());
  const [grades, setGrades] = useState<GradeItem[]>(() => StorageService.getGrades());
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => StorageService.getAttendance());
  const [announcements, setAnnouncements] = useState<Announcement[]>(() => StorageService.getAnnouncements());
  const [discussions, setDiscussions] = useState<DiscussionThread[]>(() => StorageService.getDiscussions());
  const [tickets, setTickets] = useState<SupportTicket[]>(() => StorageService.getTickets());
  const [events, setEvents] = useState<CalendarEvent[]>(() => StorageService.getEvents());
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => StorageService.getAuditLogs());
  const [institutionalDocs, setInstitutionalDocs] = useState<InstitutionalDocument[]>(() => StorageService.getInstitutionalDocs());
  const [approvalRequests, setApprovalRequests] = useState<ApprovalRequest[]>(() => StorageService.getApprovalRequests());
  const [classSwaps, setClassSwaps] = useState<ClassSwapRequest[]>(() => StorageService.getClassSwaps());

  // Authentication & Security state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => StorageService.getIsAuthenticated());
  const [authPolicy, setAuthPolicy] = useState<AuthPolicy>(() => StorageService.getAuthPolicy());
  const [resetTokens, setResetTokens] = useState<PasswordResetRecord[]>(() => StorageService.getResetTokens());
  const [dispatchedNotifications, setDispatchedNotifications] = useState<DispatchedNotification[]>(() => StorageService.getDispatchedNotifications());
  const [activeAuthModal, setActiveAuthModal] = useState<'login' | 'forgot_password' | 'forgot_user_id' | 'account_activation' | 'profile' | 'user_manual' | null>(null);

  // Real-time synchronization across browser tabs for the common database
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (!e.key) return;
      setUsers(StorageService.getUsers());
      setCourses(StorageService.getCourses());
      setResources(StorageService.getResources());
      setAssignments(StorageService.getAssignments());
      setSubmissions(StorageService.getSubmissions());
      setAssessments(StorageService.getAssessments());
      setAttempts(StorageService.getAttempts());
      setGrades(StorageService.getGrades());
      setAttendance(StorageService.getAttendance());
      setAnnouncements(StorageService.getAnnouncements());
      setDiscussions(StorageService.getDiscussions());
      setTickets(StorageService.getTickets());
      setEvents(StorageService.getEvents());
      setAuditLogs(StorageService.getAuditLogs());
      setInstitutionalDocs(StorageService.getInstitutionalDocs());
      setApprovalRequests(StorageService.getApprovalRequests());
      setClassSwaps(StorageService.getClassSwaps());
      setDepartments(StorageService.getDepartments());
      setSessions(StorageService.getSessions());
      setSettings(StorageService.getSettings());
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const currentUser = users.find((u) => u.id === currentUserId) || users[0];

  const updateAuthPolicy = (newPolicy: AuthPolicy) => {
    setAuthPolicy(newPolicy);
    StorageService.saveAuthPolicy(newPolicy);
    StorageService.logAudit(currentUser, 'UPDATE_AUTH_POLICY', 'Updated password and lockout parameters');
    setAuditLogs(StorageService.getAuditLogs());
  };

  const dismissNotification = (id: string) => {
    const updated = dispatchedNotifications.filter((n) => n.id !== id);
    setDispatchedNotifications(updated);
    StorageService.saveDispatchedNotifications(updated);
  };

  const login = async (
    credential: string,
    password: string,
    selectedRole?: UserRole
  ): Promise<{ success: boolean; error?: string }> => {
    const term = credential.trim().toLowerCase();
    const matchedUser = users.find(
      (u) =>
        u.institutionUserId.toLowerCase() === term ||
        u.email.toLowerCase() === term ||
        u.phone.replace(/\s+/g, '') === term.replace(/\s+/g, '')
    );

    if (!matchedUser) {
      StorageService.logAudit(
        { ...currentUser, name: `Unknown (${credential})`, role: 'student' },
        'LOGIN_FAILED_UNKNOWN_USER',
        `Attempt with non-existent user identifier: ${credential}`
      );
      setAuditLogs(StorageService.getAuditLogs());
      return { success: false, error: 'Invalid User ID or password.' };
    }

    // Account Status check
    if (matchedUser.accountStatus === 'deactivated' || !matchedUser.isActive) {
      return { success: false, error: 'This institutional account has been deactivated. Please contact the college administration.' };
    }

    if (matchedUser.accountStatus === 'pending_activation') {
      return { success: false, error: 'Account is pending activation. Please use "Activate Account" to set your permanent password.' };
    }

    if (matchedUser.accountStatus === 'locked') {
      if (matchedUser.lockoutUntil) {
        const lockoutEnd = new Date(matchedUser.lockoutUntil).getTime();
        if (Date.now() < lockoutEnd) {
          const remainingMins = Math.ceil((lockoutEnd - Date.now()) / 60000);
          return {
            success: false,
            error: `Account is temporarily locked due to repeated failed logins. Please use Password Recovery or wait ${remainingMins} minute(s).`
          };
        } else {
          // Lockout expired - unlock
          matchedUser.accountStatus = 'active';
          matchedUser.failedLoginAttempts = 0;
          matchedUser.lockoutUntil = null;
        }
      }
    }

    // Validate password
    const isPasswordCorrect = await AuthService.verifyPassword(password, matchedUser.passwordHash);

    if (!isPasswordCorrect) {
      const newFailed = (matchedUser.failedLoginAttempts || 0) + 1;
      const isNowLocked = newFailed >= authPolicy.maxFailedAttempts;

      const updatedUser: User = {
        ...matchedUser,
        failedLoginAttempts: newFailed,
        accountStatus: isNowLocked ? 'locked' : matchedUser.accountStatus,
        lockoutUntil: isNowLocked
          ? new Date(Date.now() + authPolicy.lockoutDurationMinutes * 60000).toISOString()
          : matchedUser.lockoutUntil
      };

      const updatedUsers = users.map((u) => (u.id === updatedUser.id ? updatedUser : u));
      setUsers(updatedUsers);
      StorageService.saveUsers(updatedUsers);

      if (isNowLocked) {
        // Dispatch alert notification
        const lockoutNotif: DispatchedNotification = {
          id: `notif-${Date.now()}`,
          userId: matchedUser.id,
          type: 'email',
          destination: AuthService.maskEmail(matchedUser.email),
          subject: 'Security Alert: Account Temporarily Locked - Tamralipta Mahavidyalaya LMS',
          message: `Your account (${matchedUser.institutionUserId}) has been temporarily locked for ${authPolicy.lockoutDurationMinutes} minutes following ${authPolicy.maxFailedAttempts} consecutive failed password attempts. If this was not you, please immediately reset your password.`,
          timestamp: new Date().toLocaleTimeString()
        };
        const updatedNotifs = [lockoutNotif, ...dispatchedNotifications];
        setDispatchedNotifications(updatedNotifs);
        StorageService.saveDispatchedNotifications(updatedNotifs);

        StorageService.logAudit(
          matchedUser,
          'ACCOUNT_LOCKED',
          `Account locked for ${authPolicy.lockoutDurationMinutes} mins after ${newFailed} failed attempts`
        );
      } else {
        StorageService.logAudit(
          matchedUser,
          'LOGIN_FAILED_BAD_PASSWORD',
          `Failed login attempt (${newFailed}/${authPolicy.maxFailedAttempts})`
        );
      }
      setAuditLogs(StorageService.getAuditLogs());

      const attemptsRemaining = authPolicy.maxFailedAttempts - newFailed;
      return {
        success: false,
        error: isNowLocked
          ? `Account locked for ${authPolicy.lockoutDurationMinutes} minutes due to ${authPolicy.maxFailedAttempts} failed attempts.`
          : `Invalid password. ${attemptsRemaining} attempt(s) remaining before temporary lockout.`
      };
    }

    // Success!
    const activeUser: User = {
      ...matchedUser,
      failedLoginAttempts: 0,
      accountStatus: 'active',
      lockoutUntil: null,
      lastLogin: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };

    const updatedUsers = users.map((u) => (u.id === activeUser.id ? activeUser : u));
    setUsers(updatedUsers);
    StorageService.saveUsers(updatedUsers);

    setCurrentUserId(activeUser.id);
    StorageService.saveActiveUserId(activeUser.id);
    setIsAuthenticated(true);
    StorageService.saveIsAuthenticated(true);

    // Redirect to correct dashboard based on actual assigned role
    setActiveTab('dashboard');
    setSelectedCourseId(null);
    setSelectedAssignmentId(null);
    setActiveQuizId(null);

    StorageService.logAudit(activeUser, 'LOGIN_SUCCESS', `Authenticated securely via User ID: ${activeUser.institutionUserId}`);
    setAuditLogs(StorageService.getAuditLogs());

    return { success: true };
  };

  const logout = () => {
    StorageService.logAudit(currentUser, 'USER_LOGOUT', `Signed out from TM-LMS session`);
    setAuditLogs(StorageService.getAuditLogs());
    setIsAuthenticated(false);
    StorageService.saveIsAuthenticated(false);
    setActiveAuthModal(null);
  };

  const requestPasswordReset = async (
    identifier: string,
    method: 'email' | 'mobile_otp'
  ): Promise<{ success: boolean; message: string; record?: PasswordResetRecord; notification?: DispatchedNotification }> => {
    const term = identifier.trim().toLowerCase();
    const user = users.find(
      (u) =>
        u.institutionUserId.toLowerCase() === term ||
        u.email.toLowerCase() === term ||
        u.phone.replace(/\s+/g, '') === term.replace(/\s+/g, '')
    );

    if (!user) {
      // Return safe message to prevent account enumeration
      return {
        success: true,
        message: 'If an account matches the provided identifier, recovery instructions have been dispatched.'
      };
    }

    const token = AuthService.generateResetToken();
    const otp = method === 'mobile_otp' ? AuthService.generateOtp() : undefined;
    const expiresAt = new Date(
      Date.now() + (method === 'email' ? authPolicy.resetLinkExpiryMinutes : authPolicy.otpExpiryMinutes) * 60000
    ).toISOString();

    const record: PasswordResetRecord = {
      id: `reset-${Date.now()}`,
      userId: user.id,
      institutionUserId: user.institutionUserId,
      type: method,
      token,
      otp,
      targetContact: method === 'email' ? AuthService.maskEmail(user.email) : AuthService.maskPhone(user.phone),
      attemptsRemaining: 3,
      expiresAt,
      isUsed: false,
      createdAt: new Date().toISOString()
    };

    const updatedTokens = [record, ...resetTokens];
    setResetTokens(updatedTokens);
    StorageService.saveResetTokens(updatedTokens);

    // Create dispatched notification for interactive simulation
    const notif: DispatchedNotification = {
      id: `notif-${Date.now()}`,
      userId: user.id,
      type: method === 'email' ? 'email' : 'sms',
      destination: method === 'email' ? user.email : user.phone,
      subject: method === 'email' ? 'TM-LMS: Password Reset Request' : 'TM-LMS OTP Verification',
      message:
        method === 'email'
          ? `Hello ${user.name}, we received a password recovery request for your account (${user.institutionUserId}). Click the secure link below to create a new password. Valid for ${authPolicy.resetLinkExpiryMinutes} minutes.`
          : `Tamralipta Mahavidyalaya LMS: Your OTP for password recovery is ${otp}. Valid for ${authPolicy.otpExpiryMinutes} minutes. Never share this code.`,
      timestamp: new Date().toLocaleTimeString(),
      actionUrl: method === 'email' ? `?token=${token}` : undefined,
      otpCode: otp
    };

    const updatedNotifs = [notif, ...dispatchedNotifications];
    setDispatchedNotifications(updatedNotifs);
    StorageService.saveDispatchedNotifications(updatedNotifs);

    StorageService.logAudit(
      user,
      'PASSWORD_RESET_DISPATCHED',
      `Dispatched reset via ${method} to ${record.targetContact}`
    );
    setAuditLogs(StorageService.getAuditLogs());

    return {
      success: true,
      message: `Recovery code dispatched to ${record.targetContact}`,
      record,
      notification: notif
    };
  };

  const verifyOtp = async (token: string, enteredOtp: string): Promise<{ success: boolean; error?: string }> => {
    const record = resetTokens.find((r) => r.token === token && !r.isUsed);
    if (!record) {
      return { success: false, error: 'Password recovery session has expired or is invalid. Please restart recovery.' };
    }

    if (new Date(record.expiresAt).getTime() < Date.now()) {
      return { success: false, error: 'OTP has expired. Please request a new one.' };
    }

    if (record.attemptsRemaining <= 0) {
      return { success: false, error: 'Too many incorrect OTP attempts. Session invalidated.' };
    }

    if (record.otp !== enteredOtp.trim()) {
      record.attemptsRemaining -= 1;
      const updatedTokens = resetTokens.map((r) => (r.id === record.id ? record : r));
      setResetTokens(updatedTokens);
      StorageService.saveResetTokens(updatedTokens);
      return {
        success: false,
        error: `Invalid OTP. ${record.attemptsRemaining} attempt(s) remaining.`
      };
    }

    return { success: true };
  };

  const completePasswordReset = async (
    token: string,
    newPassword: string
  ): Promise<{ success: boolean; error?: string }> => {
    const record = resetTokens.find((r) => r.token === token && !r.isUsed);
    if (!record) {
      return { success: false, error: 'Reset session is invalid or has already been used.' };
    }

    if (new Date(record.expiresAt).getTime() < Date.now()) {
      return { success: false, error: 'Reset session has expired. Please request a new link.' };
    }

    const user = users.find((u) => u.id === record.userId);
    if (!user) {
      return { success: false, error: 'User account not found.' };
    }

    const newHash = await AuthService.hashPassword(newPassword);

    const updatedUser: User = {
      ...user,
      passwordHash: newHash,
      failedLoginAttempts: 0,
      accountStatus: 'active',
      lockoutUntil: null
    };

    const updatedUsers = users.map((u) => (u.id === updatedUser.id ? updatedUser : u));
    setUsers(updatedUsers);
    StorageService.saveUsers(updatedUsers);

    // Invalidate token
    const updatedTokens = resetTokens.map((r) => (r.id === record.id ? { ...r, isUsed: true } : r));
    setResetTokens(updatedTokens);
    StorageService.saveResetTokens(updatedTokens);

    // Dispatch confirmation
    const confNotif: DispatchedNotification = {
      id: `notif-${Date.now()}`,
      userId: user.id,
      type: 'email',
      destination: AuthService.maskEmail(user.email),
      subject: 'Password Changed Successfully - Tamralipta Mahavidyalaya LMS',
      message: `Your TM-LMS account password for ${user.institutionUserId} was successfully reset. You may now log in.`,
      timestamp: new Date().toLocaleTimeString()
    };
    const updatedNotifs = [confNotif, ...dispatchedNotifications];
    setDispatchedNotifications(updatedNotifs);
    StorageService.saveDispatchedNotifications(updatedNotifs);

    StorageService.logAudit(user, 'PASSWORD_RESET_SUCCESS', `Password reset completed for ${user.institutionUserId}`);
    setAuditLogs(StorageService.getAuditLogs());

    return { success: true };
  };

  const requestUserIdRetrieval = async (
    contact: string
  ): Promise<{ success: boolean; message: string; foundUserId?: string; notification?: DispatchedNotification }> => {
    const clean = contact.trim().toLowerCase();
    const user = users.find(
      (u) =>
        u.email.toLowerCase() === clean ||
        u.phone.replace(/\s+/g, '') === clean.replace(/\s+/g, '')
    );

    if (!user) {
      return {
        success: true,
        message: 'If the provided contact is registered with Tamralipta Mahavidyalaya, your User ID has been dispatched.'
      };
    }

    const notif: DispatchedNotification = {
      id: `notif-${Date.now()}`,
      userId: user.id,
      type: user.email.toLowerCase() === clean ? 'email' : 'sms',
      destination: user.email.toLowerCase() === clean ? user.email : user.phone,
      subject: 'Tamralipta Mahavidyalaya LMS – Institutional User ID Retrieval',
      message: `Hello ${user.name}, your registered institutional User ID is: ${user.institutionUserId}. Use this ID along with your password to log in.`,
      timestamp: new Date().toLocaleTimeString(),
      otpCode: user.institutionUserId
    };

    const updatedNotifs = [notif, ...dispatchedNotifications];
    setDispatchedNotifications(updatedNotifs);
    StorageService.saveDispatchedNotifications(updatedNotifs);

    StorageService.logAudit(user, 'USER_ID_RETRIEVED', `User ID retrieved via verified contact`);
    setAuditLogs(StorageService.getAuditLogs());

    return {
      success: true,
      message: `User ID dispatched to ${user.email.toLowerCase() === clean ? AuthService.maskEmail(user.email) : AuthService.maskPhone(user.phone)}`,
      foundUserId: user.institutionUserId,
      notification: notif
    };
  };

  const activateAccount = async (
    userIdOrEmail: string,
    activationCode: string,
    newPassword: string
  ): Promise<{ success: boolean; error?: string }> => {
    const term = userIdOrEmail.trim().toLowerCase();
    const user = users.find(
      (u) =>
        u.institutionUserId.toLowerCase() === term ||
        u.email.toLowerCase() === term
    );

    if (!user) {
      return { success: false, error: 'Account matching this User ID was not found.' };
    }

    if (activationCode.trim() !== 'TM-ACTIVATE' && activationCode.trim() !== '123456') {
      return { success: false, error: 'Invalid activation code. Please check your admission welcome circular or SMS.' };
    }

    const newHash = await AuthService.hashPassword(newPassword);
    const updatedUser: User = {
      ...user,
      passwordHash: newHash,
      accountStatus: 'active',
      isActive: true,
      emailVerified: true,
      mobileVerified: true,
      failedLoginAttempts: 0
    };

    const updatedUsers = users.map((u) => (u.id === updatedUser.id ? updatedUser : u));
    setUsers(updatedUsers);
    StorageService.saveUsers(updatedUsers);

    StorageService.logAudit(updatedUser, 'ACCOUNT_ACTIVATED', `First-time password set and account activated for ${updatedUser.institutionUserId}`);
    setAuditLogs(StorageService.getAuditLogs());

    return { success: true };
  };

  const changeUserPassword = async (
    userId: string,
    currentPass: string,
    newPass: string
  ): Promise<{ success: boolean; error?: string }> => {
    const user = users.find((u) => u.id === userId);
    if (!user) return { success: false, error: 'User not found.' };

    const isCurrentValid = await AuthService.verifyPassword(currentPass, user.passwordHash);
    if (!isCurrentValid) {
      return { success: false, error: 'Current password entered is incorrect.' };
    }

    const newHash = await AuthService.hashPassword(newPass);
    const updatedUser: User = {
      ...user,
      passwordHash: newHash,
      failedLoginAttempts: 0
    };

    const updatedUsers = users.map((u) => (u.id === updatedUser.id ? updatedUser : u));
    setUsers(updatedUsers);
    StorageService.saveUsers(updatedUsers);

    StorageService.logAudit(user, 'PASSWORD_CHANGED', `User updated their password`);
    setAuditLogs(StorageService.getAuditLogs());

    return { success: true };
  };

  const unlockUserAccount = (userId: string) => {
    const updatedUsers = users.map((u) =>
      u.id === userId
        ? { ...u, accountStatus: 'active' as const, failedLoginAttempts: 0, lockoutUntil: null }
        : u
    );
    setUsers(updatedUsers);
    StorageService.saveUsers(updatedUsers);
    const user = users.find((u) => u.id === userId);
    if (user) {
      StorageService.logAudit(currentUser, 'ACCOUNT_UNLOCKED_ADMIN', `Administrator unlocked account ${user.institutionUserId}`);
      setAuditLogs(StorageService.getAuditLogs());
    }
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    StorageService.saveLanguage(lang);
  };

  const t = (key: keyof typeof translations.en): string => {
    const dict = translations[language] || translations.en;
    return dict[key] || translations.en[key] || String(key);
  };

  const setCurrentUser = (user: User) => {
    setCurrentUserId(user.id);
    StorageService.saveActiveUserId(user.id);
  };

  const switchRole = (role: UserRole) => {
    const targetUser = users.find((u) => u.role === role) || users[0];
    setCurrentUserId(targetUser.id);
    StorageService.saveActiveUserId(targetUser.id);
    setActiveTab('dashboard');
    setSelectedCourseId(null);
    setSelectedAssignmentId(null);
    setActiveQuizId(null);
    StorageService.logAudit(targetUser, 'SWITCH_ROLE_DEMO', `Switched active preview role to ${role}`);
    setAuditLogs(StorageService.getAuditLogs());
  };

  const addUser = (newUser: Omit<User, 'id'>) => {
    const created: User = {
      ...newUser,
      id: `user-${Date.now()}`
    };
    const updated = [...users, created];
    setUsers(updated);
    StorageService.saveUsers(updated);
    StorageService.logAudit(currentUser, 'CREATE_USER', `Created user account for ${created.name} (${created.role})`);
    setAuditLogs(StorageService.getAuditLogs());
  };

  const updateUser = (updatedUser: User) => {
    const updated = users.map((u) => (u.id === updatedUser.id ? updatedUser : u));
    setUsers(updated);
    StorageService.saveUsers(updated);
  };

  const updateSettings = (newSettings: InstitutionalSettings) => {
    setSettings(newSettings);
    StorageService.saveSettings(newSettings);
    StorageService.logAudit(currentUser, 'UPDATE_SETTINGS', 'Updated institutional profile & grading criteria');
    setAuditLogs(StorageService.getAuditLogs());
  };

  const addCourse = (c: Omit<Course, 'id' | 'totalEnrolled'>) => {
    const newCourse: Course = {
      ...c,
      id: `course-${Date.now()}`,
      totalEnrolled: 0
    };
    const updated = [newCourse, ...courses];
    setCourses(updated);
    StorageService.saveCourses(updated);
    StorageService.logAudit(currentUser, 'CREATE_COURSE', `Created course ${newCourse.code}: ${newCourse.title}`);
    setAuditLogs(StorageService.getAuditLogs());
  };

  const updateCourse = (updatedCourse: Course) => {
    const updated = courses.map((c) => (c.id === updatedCourse.id ? updatedCourse : c));
    setCourses(updated);
    StorageService.saveCourses(updated);
  };

  const assignFacultyToCourse = (courseId: string, facultyId: string, facultyName: string) => {
    const updated = courses.map((c) => (c.id === courseId ? { ...c, facultyId, facultyName } : c));
    setCourses(updated);
    StorageService.saveCourses(updated);
    StorageService.logAudit(currentUser, 'ASSIGN_FACULTY', `Assigned course ${courseId} to ${facultyName}`);
    setAuditLogs(StorageService.getAuditLogs());
  };

  const addResource = (res: Omit<LearningResource, 'id' | 'uploadedAt' | 'downloadCount'>) => {
    const newResource: LearningResource = {
      ...res,
      id: `res-${Date.now()}`,
      uploadedAt: new Date().toISOString().substring(0, 10),
      downloadCount: 0,
      approvalStatus: res.approvalStatus || (currentUser.role === 'dept_head' || currentUser.role === 'super_admin' ? 'approved' : 'approved'),
      version: 1,
      isArchived: false,
      isSoftDeleted: false
    };
    const updated = [newResource, ...resources];
    setResources(updated);
    StorageService.saveResources(updated);
    StorageService.logAudit(currentUser, 'UPLOAD_RESOURCE', `Uploaded resource "${newResource.title}"`);
    setAuditLogs(StorageService.getAuditLogs());
  };

  const updateResource = (updatedResource: LearningResource) => {
    const updated = resources.map((r) => (r.id === updatedResource.id ? updatedResource : r));
    setResources(updated);
    StorageService.saveResources(updated);
    StorageService.logAudit(currentUser, 'UPDATE_RESOURCE', `Updated resource "${updatedResource.title}"`);
    setAuditLogs(StorageService.getAuditLogs());
  };

  const deleteResource = (id: string) => {
    const target = resources.find((r) => r.id === id);
    const updated = resources.map((r) => (r.id === id ? { ...r, isSoftDeleted: true, approvalStatus: 'archived' as const } : r));
    setResources(updated);
    StorageService.saveResources(updated);
    StorageService.logAudit(currentUser, 'ARCHIVE_RESOURCE', `Archived/soft-deleted resource "${target?.title || id}"`);
    setAuditLogs(StorageService.getAuditLogs());
  };

  const archiveResource = (id: string) => {
    const updated = resources.map((r) => (r.id === id ? { ...r, isArchived: true, approvalStatus: 'archived' as const } : r));
    setResources(updated);
    StorageService.saveResources(updated);
    StorageService.logAudit(currentUser, 'ARCHIVE_RESOURCE', `Archived resource ID ${id}`);
    setAuditLogs(StorageService.getAuditLogs());
  };

  const restoreResource = (id: string) => {
    const updated = resources.map((r) => (r.id === id ? { ...r, isArchived: false, isSoftDeleted: false, approvalStatus: 'approved' as const } : r));
    setResources(updated);
    StorageService.saveResources(updated);
    StorageService.logAudit(currentUser, 'RESTORE_RESOURCE', `Restored resource ID ${id}`);
    setAuditLogs(StorageService.getAuditLogs());
  };

  const submitResourceForApproval = (id: string) => {
    const target = resources.find((r) => r.id === id);
    if (!target) return;
    const updated = resources.map((r) => (r.id === id ? { ...r, approvalStatus: 'pending_review' as const } : r));
    setResources(updated);
    StorageService.saveResources(updated);

    const req: ApprovalRequest = {
      id: `appr-${Date.now()}`,
      type: 'resource_approval',
      title: `Resource Review: ${target.title}`,
      departmentId: target.departmentId,
      courseId: target.courseId,
      submittedBy: currentUser.id,
      submittedByName: currentUser.name,
      submittedByRole: currentUser.role,
      submittedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      status: 'pending',
      targetId: target.id,
      details: `Faculty ${currentUser.name} uploaded course material for departmental approval: "${target.title}".`
    };
    const updatedReqs = [req, ...approvalRequests];
    setApprovalRequests(updatedReqs);
    StorageService.saveApprovalRequests(updatedReqs);

    StorageService.logAudit(currentUser, 'SUBMIT_RESOURCE_APPROVAL', `Submitted resource "${target.title}" for departmental approval`);
    setAuditLogs(StorageService.getAuditLogs());
  };

  const approveResource = (id: string, reviewNotes?: string) => {
    const target = resources.find((r) => r.id === id);
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const updated = resources.map((r) =>
      r.id === id
        ? {
            ...r,
            approvalStatus: 'approved' as const,
            reviewedBy: currentUser.id,
            reviewedByName: currentUser.name,
            reviewedAt: now,
            reviewNotes: reviewNotes || 'Approved for student access.'
          }
        : r
    );
    setResources(updated);
    StorageService.saveResources(updated);

    const updatedReqs = approvalRequests.map((req) =>
      req.targetId === id
        ? { ...req, status: 'approved' as const, reviewedBy: currentUser.id, reviewedByName: currentUser.name, reviewedAt: now, reviewNotes }
        : req
    );
    setApprovalRequests(updatedReqs);
    StorageService.saveApprovalRequests(updatedReqs);

    StorageService.logAudit(currentUser, 'APPROVE_RESOURCE', `Approved resource "${target?.title || id}"`);
    setAuditLogs(StorageService.getAuditLogs());
  };

  const returnResourceForCorrection = (id: string, reviewNotes: string) => {
    const target = resources.find((r) => r.id === id);
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const updated = resources.map((r) =>
      r.id === id
        ? {
            ...r,
            approvalStatus: 'returned_for_correction' as const,
            reviewedBy: currentUser.id,
            reviewedByName: currentUser.name,
            reviewedAt: now,
            reviewNotes
          }
        : r
    );
    setResources(updated);
    StorageService.saveResources(updated);

    const updatedReqs = approvalRequests.map((req) =>
      req.targetId === id
        ? { ...req, status: 'returned_for_correction' as const, reviewedBy: currentUser.id, reviewedByName: currentUser.name, reviewedAt: now, reviewNotes }
        : req
    );
    setApprovalRequests(updatedReqs);
    StorageService.saveApprovalRequests(updatedReqs);

    StorageService.logAudit(currentUser, 'RETURN_RESOURCE_CORRECTION', `Returned resource "${target?.title || id}" for correction: ${reviewNotes}`);
    setAuditLogs(StorageService.getAuditLogs());
  };

  const uploadResourceNewVersion = (id: string, fileDetails: { fileName: string; fileUrl: string; fileSize: string; changeSummary?: string }) => {
    const target = resources.find((r) => r.id === id);
    if (!target) return;
    const now = new Date().toISOString().substring(0, 10);
    const prevVersion: ResourceVersion = {
      version: target.version || 1,
      fileName: target.url.split('/').pop() || `${target.title}.pdf`,
      fileUrl: target.url,
      fileSize: target.fileSize,
      uploadedAt: target.uploadedAt,
      uploadedBy: target.uploadedByName,
      changeSummary: fileDetails.changeSummary || 'Previous release'
    };
    const currentHistory = target.versionHistory || [];
    const newVersionNum = (target.version || 1) + 1;
    const updated = resources.map((r) =>
      r.id === id
        ? {
            ...r,
            version: newVersionNum,
            url: fileDetails.fileUrl,
            fileSize: fileDetails.fileSize,
            uploadedAt: now,
            versionHistory: [prevVersion, ...currentHistory],
            approvalStatus: 'approved' as const
          }
        : r
    );
    setResources(updated);
    StorageService.saveResources(updated);
    StorageService.logAudit(currentUser, 'UPDATE_RESOURCE_VERSION', `Uploaded v${newVersionNum} for resource "${target.title}"`);
    setAuditLogs(StorageService.getAuditLogs());
  };

  const restoreResourceVersion = (id: string, versionNumber: number) => {
    const target = resources.find((r) => r.id === id);
    if (!target || !target.versionHistory) return;
    const ver = target.versionHistory.find((v) => v.version === versionNumber);
    if (!ver) return;

    const currentAsArchived: ResourceVersion = {
      version: target.version || 1,
      fileName: target.url.split('/').pop() || `${target.title}.pdf`,
      fileUrl: target.url,
      fileSize: target.fileSize,
      uploadedAt: target.uploadedAt,
      uploadedBy: target.uploadedByName,
      changeSummary: 'Replaced by rollback to version ' + versionNumber
    };

    const remainingHistory = target.versionHistory.filter((v) => v.version !== versionNumber);
    const updated = resources.map((r) =>
      r.id === id
        ? {
            ...r,
            version: versionNumber,
            url: ver.fileUrl,
            fileSize: ver.fileSize,
            versionHistory: [currentAsArchived, ...remainingHistory]
          }
        : r
    );
    setResources(updated);
    StorageService.saveResources(updated);
    StorageService.logAudit(currentUser, 'ROLLBACK_RESOURCE_VERSION', `Restored v${versionNumber} for resource "${target.title}"`);
    setAuditLogs(StorageService.getAuditLogs());
  };

  const incrementResourceDownload = (id: string) => {
    const updated = resources.map((r) => (r.id === id ? { ...r, downloadCount: r.downloadCount + 1 } : r));
    setResources(updated);
    StorageService.saveResources(updated);
  };

  const addAssignment = (asg: Omit<Assignment, 'id'>) => {
    const newAsg: Assignment = {
      ...asg,
      id: `asg-${Date.now()}`
    };
    const updated = [newAsg, ...assignments];
    setAssignments(updated);
    StorageService.saveAssignments(updated);
    StorageService.logAudit(currentUser, 'CREATE_ASSIGNMENT', `Created assignment "${newAsg.title}"`);
    setAuditLogs(StorageService.getAuditLogs());
  };

  const submitAssignment = (sub: Omit<AssignmentSubmission, 'id' | 'submittedAt'>) => {
    const existingIndex = submissions.findIndex(
      (s) => s.assignmentId === sub.assignmentId && s.studentId === sub.studentId
    );

    const now = new Date().toISOString().replace('T', ' ').substring(0, 16);
    let updated: AssignmentSubmission[];

    if (existingIndex >= 0) {
      const existing = submissions[existingIndex];
      const prevVersion = {
        version: existing.version || 1,
        fileUrl: existing.fileUrl,
        fileName: existing.fileName,
        textContent: existing.textContent,
        submittedAt: existing.submittedAt,
        comment: existing.feedback
      };
      const updatedSub: AssignmentSubmission = {
        ...existing,
        ...sub,
        submittedAt: now,
        status: 'submitted',
        version: (existing.version || 1) + 1,
        versionHistory: [prevVersion, ...(existing.versionHistory || [])]
      };
      updated = [...submissions];
      updated[existingIndex] = updatedSub;
    } else {
      const newSub: AssignmentSubmission = {
        ...sub,
        id: `sub-${Date.now()}`,
        submittedAt: now,
        version: 1,
        versionHistory: []
      };
      updated = [newSub, ...submissions];
    }

    setSubmissions(updated);
    StorageService.saveSubmissions(updated);
    StorageService.logAudit(currentUser, 'SUBMIT_ASSIGNMENT', `Submitted solution for assignment ID ${sub.assignmentId}`);
    setAuditLogs(StorageService.getAuditLogs());
  };

  const evaluateSubmission = (subId: string, marks: number, feedback: string) => {
    const now = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const updated = submissions.map((s) => {
      if (s.id === subId) {
        return {
          ...s,
          marksObtained: marks,
          feedback,
          status: 'evaluated' as const,
          evaluatedBy: currentUser.name,
          evaluatedAt: now
        };
      }
      return s;
    });
    setSubmissions(updated);
    StorageService.saveSubmissions(updated);
    StorageService.logAudit(currentUser, 'EVALUATE_SUBMISSION', `Evaluated submission ${subId}, awarded ${marks} marks`);
    setAuditLogs(StorageService.getAuditLogs());
  };

  const returnSubmissionForCorrection = (subId: string, feedback: string) => {
    const now = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const updated = submissions.map((s) => {
      if (s.id === subId) {
        return {
          ...s,
          feedback,
          status: 'returned_for_correction' as const,
          evaluatedBy: currentUser.name,
          evaluatedAt: now,
          allowResubmission: true
        };
      }
      return s;
    });
    setSubmissions(updated);
    StorageService.saveSubmissions(updated);
    StorageService.logAudit(currentUser, 'RETURN_SUBMISSION', `Returned submission ${subId} for student correction: ${feedback}`);
    setAuditLogs(StorageService.getAuditLogs());
  };

  const resubmitAssignment = (subId: string, fileDetails: { fileName?: string; fileUrl?: string; textContent?: string; comment?: string }) => {
    const now = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const target = submissions.find((s) => s.id === subId);
    if (!target) return;

    const prevVer = {
      version: target.version || 1,
      fileName: target.fileName,
      fileUrl: target.fileUrl,
      textContent: target.textContent,
      submittedAt: target.submittedAt,
      comment: target.feedback
    };

    const newVersionNum = (target.version || 1) + 1;
    const history = target.versionHistory || [];

    const updated = submissions.map((s) =>
      s.id === subId
        ? {
            ...s,
            fileName: fileDetails.fileName || s.fileName,
            fileUrl: fileDetails.fileUrl || s.fileUrl,
            textContent: fileDetails.textContent !== undefined ? fileDetails.textContent : s.textContent,
            submittedAt: now,
            status: 'submitted' as const,
            version: newVersionNum,
            versionHistory: [prevVer, ...history]
          }
        : s
    );
    setSubmissions(updated);
    StorageService.saveSubmissions(updated);
    StorageService.logAudit(currentUser, 'RESUBMIT_ASSIGNMENT', `Student uploaded revision v${newVersionNum} for submission ${subId}`);
    setAuditLogs(StorageService.getAuditLogs());
  };

  const createApprovalRequest = (req: Omit<ApprovalRequest, 'id' | 'submittedAt' | 'status'>) => {
    const newReq: ApprovalRequest = {
      ...req,
      id: `appr-${Date.now()}`,
      submittedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      status: 'pending'
    };
    const updated = [newReq, ...approvalRequests];
    setApprovalRequests(updated);
    StorageService.saveApprovalRequests(updated);
    StorageService.logAudit(currentUser, 'CREATE_APPROVAL_REQUEST', `Submitted approval request "${newReq.title}"`);
    setAuditLogs(StorageService.getAuditLogs());
  };

  const reviewApprovalRequest = (reqId: string, status: 'approved' | 'returned_for_correction' | 'rejected', reviewNotes?: string) => {
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const target = approvalRequests.find((r) => r.id === reqId);
    const updated = approvalRequests.map((r) =>
      r.id === reqId
        ? { ...r, status, reviewNotes, reviewedBy: currentUser.id, reviewedByName: currentUser.name, reviewedAt: now }
        : r
    );
    setApprovalRequests(updated);
    StorageService.saveApprovalRequests(updated);

    // If target was a resource approval, sync with the resource
    if (target && target.type === 'resource_approval') {
      const resourceStatus = status === 'approved' ? ('approved' as const) : ('returned_for_correction' as const);
      const updatedRes = resources.map((res) =>
        res.id === target.targetId
          ? {
              ...res,
              approvalStatus: resourceStatus,
              reviewedBy: currentUser.id,
              reviewedByName: currentUser.name,
              reviewedAt: now,
              reviewNotes: reviewNotes || (status === 'approved' ? 'Approved by HOD' : 'Correction required')
            }
          : res
      );
      setResources(updatedRes);
      StorageService.saveResources(updatedRes);
    }

    StorageService.logAudit(currentUser, 'REVIEW_APPROVAL_REQUEST', `Marked request ${reqId} as ${status}`);
    setAuditLogs(StorageService.getAuditLogs());
  };

  const requestClassSwap = (swap: Omit<ClassSwapRequest, 'id' | 'status' | 'submittedAt'>) => {
    const newSwap: ClassSwapRequest = {
      ...swap,
      id: `swap-${Date.now()}`,
      submittedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      status: 'pending'
    };
    const updated = [newSwap, ...classSwaps];
    setClassSwaps(updated);
    StorageService.saveClassSwaps(updated);

    const apprReq: ApprovalRequest = {
      id: `appr-swap-${Date.now()}`,
      type: 'class_swap',
      title: `Class Swap: ${swap.courseTitle}`,
      departmentId: swap.departmentId,
      courseId: swap.courseId,
      submittedBy: currentUser.id,
      submittedByName: currentUser.name,
      submittedByRole: currentUser.role,
      submittedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      status: 'pending',
      targetId: newSwap.id,
      details: `${swap.requesterFacultyName} requested lecture swap with ${swap.targetFacultyName} for ${swap.originalDate} (${swap.originalTimeSlot}). Reason: ${swap.reason}`
    };
    const updatedReqs = [apprReq, ...approvalRequests];
    setApprovalRequests(updatedReqs);
    StorageService.saveApprovalRequests(updatedReqs);

    StorageService.logAudit(currentUser, 'REQUEST_CLASS_SWAP', `Requested lecture swap for course ${swap.courseTitle}`);
    setAuditLogs(StorageService.getAuditLogs());
  };

  const reviewClassSwap = (swapId: string, status: 'approved' | 'rejected', reviewNotes?: string) => {
    const updated = classSwaps.map((s) =>
      s.id === swapId
        ? { ...s, status, reviewNotes, reviewedBy: currentUser.name }
        : s
    );
    setClassSwaps(updated);
    StorageService.saveClassSwaps(updated);

    const updatedReqs = approvalRequests.map((r) =>
      r.targetId === swapId
        ? { ...r, status: status === 'approved' ? ('approved' as const) : ('rejected' as const), reviewNotes, reviewedBy: currentUser.id, reviewedByName: currentUser.name }
        : r
    );
    setApprovalRequests(updatedReqs);
    StorageService.saveApprovalRequests(updatedReqs);

    StorageService.logAudit(currentUser, 'REVIEW_CLASS_SWAP', `Class swap ${swapId} ${status} by ${currentUser.name}`);
    setAuditLogs(StorageService.getAuditLogs());
  };

  const addInstitutionalDoc = (doc: Omit<InstitutionalDocument, 'id' | 'publicationDate'>) => {
    const newDoc: InstitutionalDocument = {
      ...doc,
      id: `doc-inst-${Date.now()}`,
      publicationDate: new Date().toISOString().substring(0, 10)
    };
    const updated = [newDoc, ...institutionalDocs];
    setInstitutionalDocs(updated);
    StorageService.saveInstitutionalDocs(updated);
    StorageService.logAudit(currentUser, 'PUBLISH_INST_DOC', `Published institutional document "${newDoc.title}"`);
    setAuditLogs(StorageService.getAuditLogs());
  };

  const updateInstitutionalDoc = (doc: InstitutionalDocument) => {
    const updated = institutionalDocs.map((d) => (d.id === doc.id ? doc : d));
    setInstitutionalDocs(updated);
    StorageService.saveInstitutionalDocs(updated);
    StorageService.logAudit(currentUser, 'UPDATE_INST_DOC', `Updated institutional document "${doc.title}"`);
    setAuditLogs(StorageService.getAuditLogs());
  };

  const deleteInstitutionalDoc = (id: string) => {
    const updated = institutionalDocs.filter((d) => d.id !== id);
    setInstitutionalDocs(updated);
    StorageService.saveInstitutionalDocs(updated);
    StorageService.logAudit(currentUser, 'DELETE_INST_DOC', `Removed institutional document ID ${id}`);
    setAuditLogs(StorageService.getAuditLogs());
  };

  const addAssessment = (assessment: Omit<Assessment, 'id'>) => {
    const newAss: Assessment = {
      ...assessment,
      id: `quiz-${Date.now()}`
    };
    const updated = [newAss, ...assessments];
    setAssessments(updated);
    StorageService.saveAssessments(updated);
    StorageService.logAudit(currentUser, 'CREATE_ASSESSMENT', `Created online quiz "${newAss.title}"`);
    setAuditLogs(StorageService.getAuditLogs());
  };

  const submitQuizAttempt = (attemptData: Omit<AssessmentAttempt, 'id'>) => {
    const newAttempt: AssessmentAttempt = {
      ...attemptData,
      id: `att-${Date.now()}`
    };
    const updated = [newAttempt, ...attempts];
    setAttempts(updated);
    StorageService.saveAttempts(updated);
    StorageService.logAudit(
      currentUser,
      'SUBMIT_QUIZ_ATTEMPT',
      `Completed assessment ${newAttempt.assessmentId} with score ${newAttempt.finalScore}`
    );
    setAuditLogs(StorageService.getAuditLogs());
  };

  const markAttendance = (rec: Omit<AttendanceRecord, 'id'>) => {
    const newRec: AttendanceRecord = {
      ...rec,
      id: `att-${Date.now()}`
    };
    const updated = [newRec, ...attendance];
    setAttendance(updated);
    StorageService.saveAttendance(updated);
    StorageService.logAudit(currentUser, 'MARK_ATTENDANCE', `Recorded attendance for ${rec.date} on course ${rec.courseId}`);
    setAuditLogs(StorageService.getAuditLogs());
  };

  const publishAnnouncement = (ann: Omit<Announcement, 'id' | 'publishedAt' | 'readBy'>) => {
    const newAnn: Announcement = {
      ...ann,
      id: `ann-${Date.now()}`,
      publishedAt: new Date().toISOString().substring(0, 10),
      readBy: []
    };
    const updated = [newAnn, ...announcements];
    setAnnouncements(updated);
    StorageService.saveAnnouncements(updated);
    StorageService.logAudit(currentUser, 'PUBLISH_ANNOUNCEMENT', `Published announcement: "${newAnn.title}"`);
    setAuditLogs(StorageService.getAuditLogs());
  };

  const markAnnouncementRead = (id: string) => {
    const updated = announcements.map((a) => {
      if (a.id === id && !a.readBy.includes(currentUser.id)) {
        return { ...a, readBy: [...a.readBy, currentUser.id] };
      }
      return a;
    });
    setAnnouncements(updated);
    StorageService.saveAnnouncements(updated);
  };

  const addDiscussionThread = (th: Omit<DiscussionThread, 'id' | 'createdAt' | 'replies'>) => {
    const newThread: DiscussionThread = {
      ...th,
      id: `disc-${Date.now()}`,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      replies: []
    };
    const updated = [newThread, ...discussions];
    setDiscussions(updated);
    StorageService.saveDiscussions(updated);
  };

  const replyToDiscussion = (threadId: string, content: string) => {
    const reply = {
      id: `rep-${Date.now()}`,
      threadId,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorRole: currentUser.role,
      content,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      isFacultyResponse: currentUser.role === 'faculty' || currentUser.role === 'dept_head'
    };
    const updated = discussions.map((d) => (d.id === threadId ? { ...d, replies: [...d.replies, reply] } : d));
    setDiscussions(updated);
    StorageService.saveDiscussions(updated);
  };

  const createSupportTicket = (ticket: Omit<SupportTicket, 'id' | 'ticketNumber' | 'createdAt' | 'updatedAt' | 'replies'>) => {
    const now = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const newTicket: SupportTicket = {
      ...ticket,
      id: `tkt-${Date.now()}`,
      ticketNumber: `TKT-2026-${Math.floor(100 + Math.random() * 900)}`,
      createdAt: now,
      updatedAt: now,
      replies: []
    };
    const updated = [newTicket, ...tickets];
    setTickets(updated);
    StorageService.saveTickets(updated);
    StorageService.logAudit(currentUser, 'CREATE_TICKET', `Filed support ticket ${newTicket.ticketNumber}`);
    setAuditLogs(StorageService.getAuditLogs());
  };

  const replySupportTicket = (ticketId: string, message: string) => {
    const now = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const updated = tickets.map((t) => {
      if (t.id === ticketId) {
        return {
          ...t,
          updatedAt: now,
          status: currentUser.role === 'tech_support' ? ('waiting' as const) : ('in_progress' as const),
          replies: [
            ...t.replies,
            {
              id: `tr-${Date.now()}`,
              author: currentUser.name + (currentUser.role === 'tech_support' ? ' (Support)' : ''),
              message,
              date: now,
              isStaff: currentUser.role === 'tech_support' || currentUser.role === 'super_admin'
            }
          ]
        };
      }
      return t;
    });
    setTickets(updated);
    StorageService.saveTickets(updated);
  };

  const updateTicketStatus = (ticketId: string, status: SupportTicket['status']) => {
    const now = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const updated = tickets.map((t) => (t.id === ticketId ? { ...t, status, updatedAt: now } : t));
    setTickets(updated);
    StorageService.saveTickets(updated);
  };

  const publishCourseGrades = (courseId: string) => {
    const now = new Date().toISOString().substring(0, 10);
    const updated = grades.map((g) => (g.courseId === courseId ? { ...g, status: 'published' as const, publishedDate: now } : g));
    setGrades(updated);
    StorageService.saveGrades(updated);
    StorageService.logAudit(currentUser, 'PUBLISH_GRADES', `Published student grade records for course ${courseId}`);
    setAuditLogs(StorageService.getAuditLogs());
  };

  const addAcademicSession = (sess: Omit<AcademicSession, 'id'>) => {
    const newSession: AcademicSession = {
      ...sess,
      id: `session-${Date.now()}`
    };
    const updated = [newSession, ...sessions];
    setSessions(updated);
    StorageService.saveSessions(updated);
  };

  const addDepartment = (dept: Omit<Department, 'id'>) => {
    const newDept: Department = {
      ...dept,
      id: `dept-${Date.now()}`
    };
    const updated = [...departments, newDept];
    setDepartments(updated);
    StorageService.saveDepartments(updated);
  };

  const addProgramme = (prog: Omit<Programme, 'id'>) => {
    const newProg: Programme = {
      ...prog,
      id: `prog-${Date.now()}`
    };
    const updated = [...programmes, newProg];
    setProgrammes(updated);
    StorageService.saveProgrammes(updated);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        switchRole,
        users,
        addUser,
        updateUser,
        language,
        setLanguage,
        t,
        activeTab,
        setActiveTab,
        selectedCourseId,
        setSelectedCourseId,
        selectedAssignmentId,
        setSelectedAssignmentId,
        activeQuizId,
        setActiveQuizId,
        settings,
        updateSettings,
        sessions,
        departments,
        programmes,
        courses,
        resources,
        assignments,
        submissions,
        assessments,
        attempts,
        grades,
        attendance,
        announcements,
        discussions,
        tickets,
        events,
        auditLogs,
        institutionalDocs,
        approvalRequests,
        classSwaps,
        addCourse,
        updateCourse,
        assignFacultyToCourse,
        addResource,
        updateResource,
        deleteResource,
        archiveResource,
        restoreResource,
        submitResourceForApproval,
        approveResource,
        returnResourceForCorrection,
        uploadResourceNewVersion,
        restoreResourceVersion,
        incrementResourceDownload,
        addAssignment,
        submitAssignment,
        evaluateSubmission,
        returnSubmissionForCorrection,
        resubmitAssignment,
        addAssessment,
        submitQuizAttempt,
        markAttendance,
        publishAnnouncement,
        markAnnouncementRead,
        addDiscussionThread,
        replyToDiscussion,
        createSupportTicket,
        replySupportTicket,
        updateTicketStatus,
        publishCourseGrades,
        addAcademicSession,
        addDepartment,
        addProgramme,
        addInstitutionalDoc,
        updateInstitutionalDoc,
        deleteInstitutionalDoc,
        createApprovalRequest,
        reviewApprovalRequest,
        requestClassSwap,
        reviewClassSwap,
        globalSearchQuery,
        setGlobalSearchQuery,

        // Authentication & Security
        isAuthenticated,
        login,
        logout,
        requestPasswordReset,
        verifyOtp,
        completePasswordReset,
        requestUserIdRetrieval,
        activateAccount,
        changeUserPassword,
        unlockUserAccount,
        authPolicy,
        updateAuthPolicy,
        dispatchedNotifications,
        dismissNotification,
        activeAuthModal,
        setActiveAuthModal
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
