import {
  User,
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
  ClassSwapRequest
} from '../types';
import { defaultAuthPolicy } from './authService';

import {
  initialSettings,
  initialSessions,
  initialDepartments,
  initialProgrammes,
  initialUsers,
  initialCourses,
  initialResources,
  initialAssignments,
  initialSubmissions,
  initialAssessments,
  initialAttempts,
  initialGrades,
  initialAttendance,
  initialAnnouncements,
  initialDiscussions,
  initialSupportTickets,
  initialCalendarEvents,
  initialAuditLogs,
  initialInstitutionalDocs,
  initialApprovalRequests,
  initialClassSwaps
} from '../data/initialData';

const STORAGE_KEYS = {
  SETTINGS: 'tm_lms_settings_v1',
  SESSIONS: 'tm_lms_sessions_v1',
  DEPARTMENTS: 'tm_lms_departments_v1',
  PROGRAMMES: 'tm_lms_programmes_v1',
  USERS: 'tm_lms_users_v1',
  COURSES: 'tm_lms_courses_v1',
  RESOURCES: 'tm_lms_resources_v1',
  ASSIGNMENTS: 'tm_lms_assignments_v1',
  SUBMISSIONS: 'tm_lms_submissions_v1',
  ASSESSMENTS: 'tm_lms_assessments_v1',
  ATTEMPTS: 'tm_lms_attempts_v1',
  GRADES: 'tm_lms_grades_v1',
  ATTENDANCE: 'tm_lms_attendance_v1',
  ANNOUNCEMENTS: 'tm_lms_announcements_v1',
  DISCUSSIONS: 'tm_lms_discussions_v1',
  TICKETS: 'tm_lms_tickets_v1',
  EVENTS: 'tm_lms_events_v1',
  AUDIT: 'tm_lms_audit_v1',
  CURRENT_USER_ID: 'tm_lms_active_user_id_v1',
  LANGUAGE: 'tm_lms_lang_v1',
  AUTH_POLICY: 'tm_lms_auth_policy_v1',
  RESET_TOKENS: 'tm_lms_reset_tokens_v1',
  DISPATCHED_NOTIFS: 'tm_lms_dispatched_notifs_v1',
  IS_AUTHENTICATED: 'tm_lms_is_authenticated_v1',
  INSTITUTIONAL_DOCS: 'tm_lms_institutional_docs_v1',
  APPROVAL_REQUESTS: 'tm_lms_approval_requests_v1',
  CLASS_SWAPS: 'tm_lms_class_swaps_v1'
};

function loadItem<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) return defaultValue;
    return JSON.parse(item) as T;
  } catch (err) {
    console.error(`Error loading key ${key}:`, err);
    return defaultValue;
  }
}

function saveItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Error saving key ${key}:`, err);
  }
}

export const StorageService = {
  getSettings: (): InstitutionalSettings => loadItem(STORAGE_KEYS.SETTINGS, initialSettings),
  saveSettings: (settings: InstitutionalSettings) => saveItem(STORAGE_KEYS.SETTINGS, settings),

  getSessions: (): AcademicSession[] => loadItem(STORAGE_KEYS.SESSIONS, initialSessions),
  saveSessions: (sessions: AcademicSession[]) => saveItem(STORAGE_KEYS.SESSIONS, sessions),

  getDepartments: (): Department[] => loadItem(STORAGE_KEYS.DEPARTMENTS, initialDepartments),
  saveDepartments: (depts: Department[]) => saveItem(STORAGE_KEYS.DEPARTMENTS, depts),

  getProgrammes: (): Programme[] => loadItem(STORAGE_KEYS.PROGRAMMES, initialProgrammes),
  saveProgrammes: (progs: Programme[]) => saveItem(STORAGE_KEYS.PROGRAMMES, progs),

  getUsers: (): User[] => {
    const stored = loadItem<User[]>(STORAGE_KEYS.USERS, initialUsers);
    if (Array.isArray(stored) && stored.length > 0) {
      // Ensure any newly added users in initialUsers (like staff) are included, and default fields merged
      const existingIds = new Set(stored.map((u) => u.id));
      const missingFromInit = initialUsers.filter((u) => !existingIds.has(u.id));
      const mergedStored = stored.map((u) => {
        const init = initialUsers.find((i) => i.id === u.id);
        if (init) {
          return {
            ...init,
            ...u,
            permanentAddress: u.permanentAddress || init.permanentAddress,
            presentAddress: u.presentAddress || init.presentAddress,
            guardian: u.guardian || init.guardian,
            financial: u.financial || init.financial,
            permissions: u.permissions || init.permissions,
            editLogs: u.editLogs || init.editLogs
          };
        }
        return u;
      });
      return [...mergedStored, ...missingFromInit];
    }
    return initialUsers;
  },
  saveUsers: (users: User[]) => saveItem(STORAGE_KEYS.USERS, users),

  getCourses: (): Course[] => loadItem(STORAGE_KEYS.COURSES, initialCourses),
  saveCourses: (courses: Course[]) => saveItem(STORAGE_KEYS.COURSES, courses),

  getResources: (): LearningResource[] => loadItem(STORAGE_KEYS.RESOURCES, initialResources),
  saveResources: (resources: LearningResource[]) => saveItem(STORAGE_KEYS.RESOURCES, resources),

  getAssignments: (): Assignment[] => loadItem(STORAGE_KEYS.ASSIGNMENTS, initialAssignments),
  saveAssignments: (assignments: Assignment[]) => saveItem(STORAGE_KEYS.ASSIGNMENTS, assignments),

  getSubmissions: (): AssignmentSubmission[] => loadItem(STORAGE_KEYS.SUBMISSIONS, initialSubmissions),
  saveSubmissions: (subs: AssignmentSubmission[]) => saveItem(STORAGE_KEYS.SUBMISSIONS, subs),

  getAssessments: (): Assessment[] => loadItem(STORAGE_KEYS.ASSESSMENTS, initialAssessments),
  saveAssessments: (assessments: Assessment[]) => saveItem(STORAGE_KEYS.ASSESSMENTS, assessments),

  getAttempts: (): AssessmentAttempt[] => loadItem(STORAGE_KEYS.ATTEMPTS, initialAttempts),
  saveAttempts: (attempts: AssessmentAttempt[]) => saveItem(STORAGE_KEYS.ATTEMPTS, attempts),

  getGrades: (): GradeItem[] => loadItem(STORAGE_KEYS.GRADES, initialGrades),
  saveGrades: (grades: GradeItem[]) => saveItem(STORAGE_KEYS.GRADES, grades),

  getAttendance: (): AttendanceRecord[] => loadItem(STORAGE_KEYS.ATTENDANCE, initialAttendance),
  saveAttendance: (att: AttendanceRecord[]) => saveItem(STORAGE_KEYS.ATTENDANCE, att),

  getAnnouncements: (): Announcement[] => loadItem(STORAGE_KEYS.ANNOUNCEMENTS, initialAnnouncements),
  saveAnnouncements: (ann: Announcement[]) => saveItem(STORAGE_KEYS.ANNOUNCEMENTS, ann),

  getDiscussions: (): DiscussionThread[] => loadItem(STORAGE_KEYS.DISCUSSIONS, initialDiscussions),
  saveDiscussions: (disc: DiscussionThread[]) => saveItem(STORAGE_KEYS.DISCUSSIONS, disc),

  getTickets: (): SupportTicket[] => loadItem(STORAGE_KEYS.TICKETS, initialSupportTickets),
  saveTickets: (tickets: SupportTicket[]) => saveItem(STORAGE_KEYS.TICKETS, tickets),

  getEvents: (): CalendarEvent[] => loadItem(STORAGE_KEYS.EVENTS, initialCalendarEvents),
  saveEvents: (events: CalendarEvent[]) => saveItem(STORAGE_KEYS.EVENTS, events),

  getAuditLogs: (): AuditLog[] => loadItem(STORAGE_KEYS.AUDIT, initialAuditLogs),
  saveAuditLogs: (logs: AuditLog[]) => saveItem(STORAGE_KEYS.AUDIT, logs),

  getInstitutionalDocs: (): InstitutionalDocument[] => loadItem(STORAGE_KEYS.INSTITUTIONAL_DOCS, initialInstitutionalDocs),
  saveInstitutionalDocs: (docs: InstitutionalDocument[]) => saveItem(STORAGE_KEYS.INSTITUTIONAL_DOCS, docs),

  getApprovalRequests: (): ApprovalRequest[] => loadItem(STORAGE_KEYS.APPROVAL_REQUESTS, initialApprovalRequests),
  saveApprovalRequests: (reqs: ApprovalRequest[]) => saveItem(STORAGE_KEYS.APPROVAL_REQUESTS, reqs),

  getClassSwaps: (): ClassSwapRequest[] => loadItem(STORAGE_KEYS.CLASS_SWAPS, initialClassSwaps),
  saveClassSwaps: (swaps: ClassSwapRequest[]) => saveItem(STORAGE_KEYS.CLASS_SWAPS, swaps),

  getActiveUserId: (): string => loadItem(STORAGE_KEYS.CURRENT_USER_ID, 'user-student-souvik'),
  saveActiveUserId: (id: string) => saveItem(STORAGE_KEYS.CURRENT_USER_ID, id),

  getLanguage: (): 'en' | 'bn' => loadItem(STORAGE_KEYS.LANGUAGE, 'en'),
  saveLanguage: (lang: 'en' | 'bn') => saveItem(STORAGE_KEYS.LANGUAGE, lang),

  getAuthPolicy: (): AuthPolicy => loadItem(STORAGE_KEYS.AUTH_POLICY, defaultAuthPolicy),
  saveAuthPolicy: (policy: AuthPolicy) => saveItem(STORAGE_KEYS.AUTH_POLICY, policy),

  getResetTokens: (): PasswordResetRecord[] => loadItem(STORAGE_KEYS.RESET_TOKENS, []),
  saveResetTokens: (tokens: PasswordResetRecord[]) => saveItem(STORAGE_KEYS.RESET_TOKENS, tokens),

  getDispatchedNotifications: (): DispatchedNotification[] => loadItem(STORAGE_KEYS.DISPATCHED_NOTIFS, []),
  saveDispatchedNotifications: (notifs: DispatchedNotification[]) => saveItem(STORAGE_KEYS.DISPATCHED_NOTIFS, notifs),

  getIsAuthenticated: (): boolean => loadItem(STORAGE_KEYS.IS_AUTHENTICATED, false),
  saveIsAuthenticated: (isAuth: boolean) => saveItem(STORAGE_KEYS.IS_AUTHENTICATED, isAuth),

  logAudit: (
    user: User,
    action: string,
    details: string,
    extra?: { module?: string; recordId?: string; previousValue?: string; newValue?: string; approvedBy?: string }
  ) => {
    const logs = loadItem(STORAGE_KEYS.AUDIT, initialAuditLogs);
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      action,
      module: extra?.module,
      recordId: extra?.recordId,
      previousValue: extra?.previousValue,
      newValue: extra?.newValue,
      approvedBy: extra?.approvedBy,
      details,
      ipAddress: '192.168.1.' + Math.floor(Math.random() * 200 + 10)
    };
    saveItem(STORAGE_KEYS.AUDIT, [newLog, ...logs.slice(0, 149)]);
  },

  resetAllData: () => {
    Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k));
    window.location.reload();
  },

  exportDatabaseBackup: (): string => {
    const dump = {
      timestamp: new Date().toISOString(),
      institution: 'Tamralipta Mahavidyalaya',
      system: 'TM-LMS',
      version: '1.0.0',
      data: {
        settings: StorageService.getSettings(),
        sessions: StorageService.getSessions(),
        departments: StorageService.getDepartments(),
        programmes: StorageService.getProgrammes(),
        users: StorageService.getUsers(),
        courses: StorageService.getCourses(),
        resources: StorageService.getResources(),
        assignments: StorageService.getAssignments(),
        submissions: StorageService.getSubmissions(),
        assessments: StorageService.getAssessments(),
        attempts: StorageService.getAttempts(),
        grades: StorageService.getGrades(),
        attendance: StorageService.getAttendance(),
        announcements: StorageService.getAnnouncements(),
        discussions: StorageService.getDiscussions(),
        tickets: StorageService.getTickets(),
        events: StorageService.getEvents(),
        auditLogs: StorageService.getAuditLogs(),
        institutionalDocs: StorageService.getInstitutionalDocs(),
        approvalRequests: StorageService.getApprovalRequests(),
        classSwaps: StorageService.getClassSwaps()
      }
    };
    return JSON.stringify(dump, null, 2);
  },

  importDatabaseBackup: (jsonContent: string): boolean => {
    try {
      const parsed = JSON.parse(jsonContent);
      if (!parsed.data) return false;
      const d = parsed.data;
      if (d.settings) StorageService.saveSettings(d.settings);
      if (d.sessions) StorageService.saveSessions(d.sessions);
      if (d.departments) StorageService.saveDepartments(d.departments);
      if (d.programmes) StorageService.saveProgrammes(d.programmes);
      if (d.users) StorageService.saveUsers(d.users);
      if (d.courses) StorageService.saveCourses(d.courses);
      if (d.resources) StorageService.saveResources(d.resources);
      if (d.assignments) StorageService.saveAssignments(d.assignments);
      if (d.submissions) StorageService.saveSubmissions(d.submissions);
      if (d.assessments) StorageService.saveAssessments(d.assessments);
      if (d.attempts) StorageService.saveAttempts(d.attempts);
      if (d.grades) StorageService.saveGrades(d.grades);
      if (d.attendance) StorageService.saveAttendance(d.attendance);
      if (d.announcements) StorageService.saveAnnouncements(d.announcements);
      if (d.discussions) StorageService.saveDiscussions(d.discussions);
      if (d.tickets) StorageService.saveTickets(d.tickets);
      if (d.events) StorageService.saveEvents(d.events);
      if (d.auditLogs) StorageService.saveAuditLogs(d.auditLogs);
      if (d.institutionalDocs) StorageService.saveInstitutionalDocs(d.institutionalDocs);
      if (d.approvalRequests) StorageService.saveApprovalRequests(d.approvalRequests);
      if (d.classSwaps) StorageService.saveClassSwaps(d.classSwaps);
      return true;
    } catch (err) {
      console.error('Failed to import database backup:', err);
      return false;
    }
  }
};
