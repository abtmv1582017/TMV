import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  FileCheck,
  Award,
  Calendar,
  Bell,
  MessageSquare,
  HelpCircle,
  Settings,
  Users,
  BarChart3,
  Layers,
  Clock,
  ShieldAlert,
  ShieldCheck,
  KeyRound,
  LogOut,
  Library,
  GraduationCap
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const {
    currentUser,
    activeTab,
    setActiveTab,
    t,
    assignments,
    submissions,
    announcements,
    tickets,
    setSelectedCourseId,
    setSelectedAssignmentId,
    setActiveQuizId,
    logout,
    setActiveAuthModal
  } = useApp();

  const handleNavClick = (tab: string) => {
    setActiveTab(tab);
    setSelectedCourseId(null);
    setSelectedAssignmentId(null);
    setActiveQuizId(null);
    onClose();
  };

  // Badge calculations
  const pendingAssignmentsCount =
    currentUser.role === 'student'
      ? assignments.filter(
          (a) =>
            a.status === 'published' &&
            !submissions.some((s) => s.assignmentId === a.id && s.studentId === currentUser.id)
        ).length
      : 0;

  const pendingEvaluationsCount =
    currentUser.role === 'faculty' || currentUser.role === 'dept_head'
      ? submissions.filter((s) => s.status === 'submitted').length
      : 0;

  const openTicketsCount =
    currentUser.role === 'tech_support' || currentUser.role === 'super_admin'
      ? tickets.filter((t) => t.status === 'open' || t.status === 'in_progress').length
      : 0;

  const unreadAnnouncementsCount = announcements.filter(
    (a) => !a.readBy.includes(currentUser.id)
  ).length;

  interface NavItem {
    id: string;
    label: string;
    icon: React.ElementType;
    badge?: number;
    roles?: string[];
  }

  const navItems: NavItem[] = [
    {
      id: 'dashboard',
      label: t('nav_dashboard'),
      icon: LayoutDashboard
    },
    {
      id: 'courses',
      label:
        currentUser.role === 'student'
          ? t('nav_courses')
          : currentUser.role === 'faculty'
          ? 'Assigned Courses'
          : t('nav_all_courses'),
      icon: BookOpen
    },
    {
      id: 'resources',
      label: t('nav_resources'),
      icon: FileText
    },
    {
      id: 'assignments',
      label: t('nav_assignments'),
      icon: FileCheck,
      badge: currentUser.role === 'student' ? pendingAssignmentsCount : pendingEvaluationsCount
    },
    {
      id: 'assessments',
      label: t('nav_assessments'),
      icon: Award
    },
    {
      id: 'grades',
      label: t('nav_grades'),
      icon: GraduationCap
    },
    {
      id: 'attendance',
      label: t('nav_attendance'),
      icon: Clock
    },
    {
      id: 'calendar',
      label: t('nav_calendar'),
      icon: Calendar
    },
    {
      id: 'announcements',
      label: t('nav_announcements'),
      icon: Bell,
      badge: unreadAnnouncementsCount
    },
    {
      id: 'discussions',
      label: t('nav_discussions'),
      icon: MessageSquare
    },
    {
      id: 'library',
      label: t('nav_library'),
      icon: Library
    },
    // Admin / Management specific links
    {
      id: 'structure',
      label: t('nav_academic_structure'),
      icon: Layers,
      roles: ['super_admin', 'principal', 'dept_head']
    },
    {
      id: 'users',
      label: t('nav_users'),
      icon: Users,
      roles: ['super_admin', 'principal']
    },
    {
      id: 'auth_security',
      label: 'Auth & ID Policies',
      icon: ShieldCheck,
      roles: ['super_admin', 'principal']
    },
    {
      id: 'reports',
      label: t('nav_reports'),
      icon: BarChart3,
      roles: ['super_admin', 'principal', 'dept_head']
    },
    {
      id: 'support',
      label: t('nav_support'),
      icon: HelpCircle,
      badge: openTicketsCount
    },
    {
      id: 'settings',
      label: t('nav_settings'),
      icon: Settings,
      roles: ['super_admin']
    },
    {
      id: 'audit',
      label: t('nav_audit_logs'),
      icon: ShieldAlert,
      roles: ['super_admin', 'principal', 'tech_support']
    }
  ];

  const visibleItems = navItems.filter((item) => {
    if (!item.roles) return true;
    return item.roles.includes(currentUser.role);
  });

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-16 bottom-0 left-0 z-40 w-64 bg-white border-r border-slate-200 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* User Card Mini */}
        <div className="p-3.5 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-xs shadow-xs">
              {currentUser.name
                .split(' ')
                .map((n) => n[0])
                .slice(0, 2)
                .join('')}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-slate-900 truncate">
                {currentUser.name}
              </div>
              <div className="text-[11px] text-sky-800 font-medium truncate capitalize">
                {currentUser.role.replace('_', ' ')}
              </div>
              <div className="text-[10px] text-slate-500 font-mono truncate">
                {currentUser.institutionUserId}
              </div>
            </div>
          </div>

          <div className="mt-2.5 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
            <button
              onClick={() => setActiveAuthModal('profile')}
              className="text-sky-700 hover:text-sky-900 font-semibold flex items-center gap-1"
            >
              <KeyRound className="w-3 h-3" />
              <span>My Security</span>
            </button>
            <button
              onClick={() => logout()}
              className="text-rose-600 hover:text-rose-800 font-semibold flex items-center gap-1"
            >
              <LogOut className="w-3 h-3" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {visibleItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition ${
                  isActive
                    ? 'bg-sky-50 text-sky-900 font-semibold border-l-4 border-sky-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3 truncate">
                  <Icon
                    className={`w-4 h-4 flex-shrink-0 ${
                      isActive ? 'text-sky-700' : 'text-slate-400'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </div>

                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                      isActive
                        ? 'bg-sky-600 text-white'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="p-3 border-t border-slate-100 text-[10px] text-slate-600 text-center bg-slate-50/50">
          <p className="font-semibold text-slate-700">Tamralipta Mahavidyalaya</p>
          <p>Tamluk, Purba Medinipur, WB</p>
          <p className="text-slate-500 mt-0.5">Session 2025-2026</p>
        </div>
      </aside>
    </>
  );
};
