import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';

// Authentication & Identity
import { LoginPage } from './components/auth/LoginPage';
import { AdminAuthManagementView } from './components/auth/AdminAuthManagementView';
import { UserProfileModal } from './components/auth/UserProfileModal';
import { NotificationSimDrawer } from './components/auth/NotificationSimDrawer';
import { UserManualModal } from './components/support/UserManualModal';

// Dashboards
import { StudentDashboard } from './components/dashboards/StudentDashboard';
import { FacultyDashboard } from './components/dashboards/FacultyDashboard';
import { AdminDashboard } from './components/dashboards/AdminDashboard';
import { DeptHeadDashboard } from './components/dashboards/DeptHeadDashboard';
import { SuperAdminDashboard } from './components/dashboards/SuperAdminDashboard';
import { SupportDashboard } from './components/dashboards/SupportDashboard';

// Governance, Documents & Approvals
import { ApprovalsView } from './components/approvals/ApprovalsView';
import { InstitutionalDocumentsView } from './components/documents/InstitutionalDocumentsView';
import { CentralDatabaseView } from './components/database/CentralDatabaseView';

// Modules
import { MasterAdminStakeholderPanel } from './components/admin/MasterAdminStakeholderPanel';
import { CourseList } from './components/courses/CourseList';
import { CourseDetail } from './components/courses/CourseDetail';
import { ResourceLibrary } from './components/resources/ResourceLibrary';
import { AssignmentList } from './components/assignments/AssignmentList';
import { QuizList } from './components/assessment/QuizList';
import { GradingModule } from './components/grading/GradingModule';
import { AttendanceModule } from './components/attendance/AttendanceModule';
import { AcademicCalendarView } from './components/calendar/AcademicCalendarView';
import { AnnouncementsView } from './components/communication/AnnouncementsView';
import { DiscussionView } from './components/communication/DiscussionView';
import { DigitalLibraryView } from './components/library/DigitalLibraryView';
import { AcademicStructureView } from './components/structure/AcademicStructureView';
import { UserManagementView } from './components/users/UserManagementView';
import { ReportsAnalyticsView } from './components/reports/ReportsAnalyticsView';
import { HelpDeskView } from './components/support/HelpDeskView';
import { InstitutionalSettingsView } from './components/settings/InstitutionalSettingsView';
import { AuditLogsView } from './components/settings/AuditLogsView';
import { GlobalSearchResults } from './components/search/GlobalSearchResults';

const AppContent: React.FC = () => {
  const {
    currentUser,
    isAuthenticated,
    activeTab,
    selectedCourseId,
    setSelectedCourseId,
    globalSearchQuery,
    activeAuthModal,
    setActiveAuthModal
  } = useApp();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // If user is not authenticated, render institutional Login Page
  if (!isAuthenticated) {
    return <LoginPage />;
  }

  // Render main content area
  const renderContent = () => {
    // If user typed in global search
    if (globalSearchQuery.trim()) {
      return <GlobalSearchResults />;
    }

    switch (activeTab) {
      case 'dashboard':
        if (currentUser.role === 'student') return <StudentDashboard />;
        if (currentUser.role === 'faculty') return <FacultyDashboard />;
        if (currentUser.role === 'dept_head') return <DeptHeadDashboard />;
        if (currentUser.role === 'principal') return <AdminDashboard />;
        if (currentUser.role === 'super_admin') return <SuperAdminDashboard />;
        if (currentUser.role === 'tech_support') return <SupportDashboard />;
        return <StudentDashboard />;

      case 'approvals':
        return <ApprovalsView />;

      case 'documents':
        return <InstitutionalDocumentsView />;

      case 'database':
        return <CentralDatabaseView />;

      case 'master_admin':
        return <MasterAdminStakeholderPanel />;

      case 'auth_security':
        return <AdminAuthManagementView />;

      case 'courses':
        if (selectedCourseId) {
          return (
            <CourseDetail
              courseId={selectedCourseId}
              onBack={() => setSelectedCourseId(null)}
            />
          );
        }
        return <CourseList onSelectCourse={(cId) => setSelectedCourseId(cId)} />;

      case 'resources':
        return <ResourceLibrary />;

      case 'assignments':
        return <AssignmentList />;

      case 'assessments':
        return <QuizList />;

      case 'grades':
        return <GradingModule />;

      case 'attendance':
        return <AttendanceModule />;

      case 'calendar':
        return <AcademicCalendarView />;

      case 'announcements':
        return <AnnouncementsView />;

      case 'discussions':
        return <DiscussionView />;

      case 'library':
        return <DigitalLibraryView />;

      case 'structure':
        return <AcademicStructureView />;

      case 'users':
        return <UserManagementView />;

      case 'reports':
        return <ReportsAnalyticsView />;

      case 'support':
        return <HelpDeskView />;

      case 'settings':
        return <InstitutionalSettingsView />;

      case 'audit':
        return <AuditLogsView />;

      default:
        return <StudentDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      {/* Top Header */}
      <Header
        onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        isMobileOpen={isMobileMenuOpen}
      />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Left Navigation Sidebar */}
        <Sidebar
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        />

        {/* Main Content Area */}
        <main className="flex-1 lg:pl-64 p-4 sm:p-6 lg:p-8 min-w-0 transition-all">
          {renderContent()}
        </main>
      </div>

      {/* Institutional Footer */}
      <footer className="bg-white border-t border-slate-200 lg:pl-64 py-4 px-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            © {new Date().getFullYear()} Tamralipta Mahavidyalaya. All rights reserved.
          </span>
          <span className="text-[11px] text-slate-400">
            Smart LMS (TM-LMS) v1.0.0 · Affiliated to Vidyasagar University, Paschim Medinipur
          </span>
        </div>
      </footer>

      {/* User Profile & Password Change Modal */}
      {activeAuthModal === 'profile' && (
        <UserProfileModal onClose={() => setActiveAuthModal(null)} />
      )}

      {/* Stakeholder User Manual Modal */}
      {activeAuthModal === 'user_manual' && (
        <UserManualModal
          onClose={() => setActiveAuthModal(null)}
          initialRoleFilter={currentUser.role}
        />
      )}

      {/* Floating Simulation Drawer for alert dispatches */}
      <NotificationSimDrawer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
