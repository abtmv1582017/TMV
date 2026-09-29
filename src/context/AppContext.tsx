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
  DispatchedNotification
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
  activeAuthModal: 'login' | 'forgot_password' | 'forgot_user_id' | 'account_activation' | 'profile' | null;
  setActiveAuthModal: (modal: 'login' | 'forgot_password' | 'forgot_user_id' | 'account_activation' | 'profile' | null) => void;

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

  addCourse: (course: Omit<Course, 'id' | 'totalEnrolled'>) => void;
  updateCourse: (course: Course) => void;
  addResource: (res: Omit<LearningResource, 'id' | 'uploadedAt' | 'downloadCount'>) => void;
  incrementResourceDownload: (id: string) => void;
  addAssignment: (asg: Omit<Assignment, 'id'>) => void;
  submitAssignment: (sub: Omit<AssignmentSubmission, 'id' | 'submittedAt'>) => void;
  evaluateSubmission: (subId: string, marks: number, feedback: string) => void;
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

  // Authentication & Security state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => StorageService.getIsAuthenticated());
  const [authPolicy, setAuthPolicy] = useState<AuthPolicy>(() => StorageService.getAuthPolicy());
  const [resetTokens, setResetTokens] = useState<PasswordResetRecord[]>(() => StorageService.getResetTokens());
  const [dispatchedNotifications, setDispatchedNotifications] = useState<DispatchedNotification[]>(() => StorageService.getDispatchedNotifications());
  const [activeAuthModal, setActiveAuthModal] = useState<'login' | 'forgot_password' | 'forgot_user_id' | 'account_activation' | 'profile' | null>(null);

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

  const addResource = (res: Omit<LearningResource, 'id' | 'uploadedAt' | 'downloadCount'>) => {
    const newResource: LearningResource = {
      ...res,
      id: `res-${Date.now()}`,
      uploadedAt: new Date().toISOString().substring(0, 10),
      downloadCount: 0
    };
    const updated = [newResource, ...resources];
    setResources(updated);
    StorageService.saveResources(updated);
    StorageService.logAudit(currentUser, 'UPLOAD_RESOURCE', `Uploaded resource "${newResource.title}"`);
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
      const updatedSub: AssignmentSubmission = {
        ...submissions[existingIndex],
        ...sub,
        submittedAt: now,
        status: 'submitted'
      };
      updated = [...submissions];
      updated[existingIndex] = updatedSub;
    } else {
      const newSub: AssignmentSubmission = {
        ...sub,
        id: `sub-${Date.now()}`,
        submittedAt: now
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
        addCourse,
        updateCourse,
        addResource,
        incrementResourceDownload,
        addAssignment,
        submitAssignment,
        evaluateSubmission,
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
