import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import {
  Bell,
  Search,
  Globe,
  UserCheck,
  ChevronDown,
  Building2,
  CheckCircle,
  Menu,
  X,
  LogOut,
  KeyRound,
  ShieldCheck,
  User as UserIcon,
  FileText
} from 'lucide-react';

export const Header: React.FC<{ onMenuToggle?: () => void; isMobileOpen?: boolean }> = ({
  onMenuToggle,
  isMobileOpen
}) => {
  const {
    currentUser,
    switchRole,
    logout,
    setActiveAuthModal,
    language,
    setLanguage,
    t,
    announcements,
    markAnnouncementRead,
    setActiveTab,
    globalSearchQuery,
    setGlobalSearchQuery,
    settings
  } = useApp();

  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const unreadAnnouncements = announcements.filter(
    (a) => !a.readBy.includes(currentUser.id)
  );

  const rolesList: { role: UserRole; title: string; subtitle: string }[] = [
    { role: 'student', title: 'Student', subtitle: 'Souvik Jana (B.Sc. CS Sem 3)' },
    { role: 'faculty', title: 'Faculty Member', subtitle: 'Prof. Tanmoy Banerjee' },
    { role: 'dept_head', title: 'Department Head', subtitle: 'Dr. Anupam Mukherjee (CS)' },
    { role: 'principal', title: 'Principal / Admin', subtitle: 'Prof. (Dr.) Pranab K. Mishra' },
    { role: 'super_admin', title: 'Super Administrator', subtitle: 'Dr. Sisir Kumar Bhowmik' },
    { role: 'tech_support', title: 'Technical Support', subtitle: 'Biplab Maity (IT Cell)' }
  ];

  const handleRoleSelect = (role: UserRole) => {
    switchRole(role);
    setShowRoleMenu(false);
  };

  return (
    <header className="sticky top-0 z-30 bg-[#0f2942] text-white border-b border-[#1e3e5e] shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Mobile hamburger & Institutional Identity */}
          <div className="flex items-center gap-3">
            <button
              onClick={onMenuToggle}
              className="lg:hidden p-2 rounded-md text-slate-300 hover:text-white hover:bg-[#1a3d5e] focus:outline-none"
              aria-label="Toggle Navigation"
            >
              {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <div
              onClick={() => setActiveTab('dashboard')}
              className="flex items-center gap-3 cursor-pointer group"
            >
              {/* College Logo Crest Placeholder */}
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-700 flex items-center justify-center text-white font-bold shadow-inner border border-white/20">
                <Building2 className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-base tracking-tight text-white group-hover:text-sky-300 transition-colors">
                    {language === 'bn' ? settings.collegeBengaliName : settings.collegeName}
                  </span>
                  <span className="text-[11px] font-semibold tracking-wider uppercase text-sky-300 bg-sky-950/80 px-1.5 py-0.5 rounded border border-sky-400/30">
                    TM-LMS
                  </span>
                </div>
                <span className="text-xs text-slate-300 hidden sm:inline">
                  {language === 'bn' ? 'স্মার্ট লার্নিং ম্যানেজমেন্ট সিস্টেম' : 'Tamluk · Affiliated to Vidyasagar University'}
                </span>
              </div>
            </div>
          </div>

          {/* Center: Global Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-6">
            <div className="relative w-full">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={globalSearchQuery}
                onChange={(e) => setGlobalSearchQuery(e.target.value)}
                placeholder={t('action_search')}
                className="w-full bg-[#183957] text-sm text-slate-100 placeholder-slate-400 pl-9 pr-4 py-1.5 rounded-lg border border-[#274f75] focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400 transition"
              />
              {globalSearchQuery && (
                <button
                  onClick={() => setGlobalSearchQuery('')}
                  className="absolute right-2.5 top-2 text-xs text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Right: Controls & Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Toggle */}
            <div className="flex items-center bg-[#183957] rounded-lg p-0.5 border border-[#274f75]">
              <button
                onClick={() => setLanguage('en')}
                className={`px-2.5 py-1 text-xs font-medium rounded transition-all ${
                  language === 'en'
                    ? 'bg-sky-500 text-white font-semibold shadow-sm'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('bn')}
                className={`px-2.5 py-1 text-xs font-medium rounded transition-all ${
                  language === 'bn'
                    ? 'bg-sky-500 text-white font-semibold shadow-sm'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                বাংলা
              </button>
            </div>

            {/* Stakeholder User Manual Modal / PDF Trigger */}
            <button
              onClick={() => setActiveAuthModal('user_manual')}
              className="flex items-center gap-1.5 bg-[#183957] hover:bg-[#20496f] text-xs px-2.5 py-1.5 rounded-lg border border-[#274f75] text-slate-200 transition cursor-pointer shadow-xs"
              title="Open Stakeholder User Manual & Download PDF"
            >
              <FileText className="w-3.5 h-3.5 text-sky-400" />
              <span className="hidden md:inline font-medium">User Manual (PDF)</span>
            </button>

            {/* Role Switcher (For demonstration & testing across all 6 roles) */}
            <div className="relative">
              <button
                onClick={() => setShowRoleMenu(!showRoleMenu)}
                className="flex items-center gap-1.5 bg-[#183957] hover:bg-[#20496f] text-xs px-2.5 py-1.5 rounded-lg border border-[#274f75] text-slate-200 transition"
                title="Switch User Role for testing"
              >
                <UserCheck className="w-3.5 h-3.5 text-sky-400" />
                <span className="hidden sm:inline font-medium capitalize">
                  {currentUser.role.replace('_', ' ')}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {showRoleMenu && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-2xl py-2 z-50 text-slate-800 border border-slate-200">
                  <div className="px-3 py-1.5 border-b border-slate-100 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Switch Test Persona
                  </div>
                  <div className="py-1">
                    {rolesList.map((r) => (
                      <button
                        key={r.role}
                        onClick={() => handleRoleSelect(r.role)}
                        className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 transition ${
                          currentUser.role === r.role ? 'bg-sky-50 text-sky-900 font-semibold' : ''
                        }`}
                      >
                        <div>
                          <div className="font-medium text-slate-800">{r.title}</div>
                          <div className="text-[11px] text-slate-500">{r.subtitle}</div>
                        </div>
                        {currentUser.role === r.role && (
                          <CheckCircle className="w-4 h-4 text-sky-600 flex-shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Notifications Popover */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-lg bg-[#183957] hover:bg-[#20496f] text-slate-200 border border-[#274f75] transition"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadAnnouncements.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                    {unreadAnnouncements.length}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-2xl py-2 z-50 text-slate-800 border border-slate-200">
                  <div className="flex items-center justify-between px-4 py-2 border-b border-slate-100">
                    <span className="text-xs font-semibold text-slate-800 uppercase tracking-wider">
                      {language === 'bn' ? 'নোটিশ ও বিজ্ঞপ্তি' : 'Announcements'}
                    </span>
                    <span className="text-xs text-sky-600 font-medium">
                      {unreadAnnouncements.length} unread
                    </span>
                  </div>

                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                    {announcements.slice(0, 5).map((ann) => {
                      const isUnread = !ann.readBy.includes(currentUser.id);
                      return (
                        <div
                          key={ann.id}
                          onClick={() => {
                            markAnnouncementRead(ann.id);
                            setActiveTab('announcements');
                            setShowNotifications(false);
                          }}
                          className={`p-3 text-xs hover:bg-slate-50 cursor-pointer transition ${
                            isUnread ? 'bg-sky-50/60' : ''
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="font-semibold text-slate-900 line-clamp-1">
                              {language === 'bn' && ann.titleBengali ? ann.titleBengali : ann.title}
                            </span>
                            {isUnread && (
                              <span className="w-2 h-2 rounded-full bg-sky-500 flex-shrink-0 mt-1" />
                            )}
                          </div>
                          <p className="text-slate-600 text-[11px] line-clamp-2 mt-1">
                            {ann.content}
                          </p>
                          <div className="text-[10px] text-slate-500 mt-1 flex items-center justify-between">
                            <span>{ann.authorRole}</span>
                            <span>{ann.publishedAt}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="p-2 border-t border-slate-100 text-center">
                    <button
                      onClick={() => {
                        setActiveTab('announcements');
                        setShowNotifications(false);
                      }}
                      className="text-xs text-sky-700 hover:text-sky-900 font-medium"
                    >
                      {language === 'bn' ? 'সকল বিজ্ঞপ্তি দেখুন' : 'View all announcements'} →
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Avatar & Name */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-lg hover:bg-[#183957] transition"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-sky-400 to-indigo-500 flex items-center justify-center font-bold text-white text-xs shadow">
                  {currentUser.name
                    .split(' ')
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join('')}
                </div>
                <div className="hidden lg:flex flex-col text-left">
                  <span className="text-xs font-semibold leading-tight text-white">
                    {language === 'bn' && currentUser.nameBengali
                      ? currentUser.nameBengali
                      : currentUser.name}
                  </span>
                  <span className="text-[10px] text-slate-300 leading-tight">
                    {currentUser.rollNumber || currentUser.employeeId || currentUser.email}
                  </span>
                </div>
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl py-2 z-50 text-slate-800 border border-slate-200">
                  <div className="px-4 py-3 border-b border-slate-100">
                    <div className="font-semibold text-slate-900 text-sm">
                      {currentUser.name}
                    </div>
                    <div className="text-xs text-slate-500">{currentUser.email}</div>
                    <div className="text-[11px] text-sky-700 font-medium mt-1 uppercase tracking-wider">
                      {currentUser.role.replace('_', ' ')}
                    </div>
                  </div>

                  <div className="py-1 text-xs">
                    <button
                      onClick={() => {
                        setActiveTab('dashboard');
                        setShowProfileMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-700"
                    >
                      {t('nav_dashboard')}
                    </button>
                    
                    <button
                      onClick={() => {
                        setActiveAuthModal('profile');
                        setShowProfileMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-slate-50 flex items-center justify-between text-slate-700 font-medium"
                    >
                      <span className="flex items-center gap-2">
                        <KeyRound className="w-3.5 h-3.5 text-sky-600" />
                        <span>My Profile & Password</span>
                      </span>
                      <span className="text-[10px] text-sky-600 bg-sky-50 px-1.5 py-0.5 rounded font-mono">
                        {currentUser.institutionUserId}
                      </span>
                    </button>

                    {(currentUser.role === 'super_admin' || currentUser.role === 'principal') && (
                      <button
                        onClick={() => {
                          setActiveTab('auth_security');
                          setShowProfileMenu(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-slate-50 flex items-center gap-2 text-slate-700 font-medium"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Auth & Security Console</span>
                      </button>
                    )}

                    <button
                      onClick={() => {
                        setActiveTab('support');
                        setShowProfileMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-700"
                    >
                      {t('nav_support')}
                    </button>

                    {(currentUser.role === 'super_admin' || currentUser.role === 'principal') && (
                      <button
                        onClick={() => {
                          setActiveTab('settings');
                          setShowProfileMenu(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-700"
                      >
                        {t('nav_settings')}
                      </button>
                    )}

                    <div className="border-t border-slate-100 my-1 pt-1">
                      <button
                        onClick={() => {
                          setShowProfileMenu(false);
                          logout();
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-rose-50 text-rose-700 font-semibold flex items-center gap-2 transition"
                      >
                        <LogOut className="w-3.5 h-3.5 text-rose-600" />
                        <span>Sign Out / Lock Session</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Sign Out icon button */}
            <button
              onClick={() => logout()}
              title="Sign Out / Lock Session"
              aria-label="Sign Out"
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-[#183957] transition text-xs font-medium"
            >
              <LogOut className="w-3.5 h-3.5 text-slate-400 group-hover:text-white" />
              <span className="hidden xl:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
