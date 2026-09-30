import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import {
  Building2,
  Lock,
  User as UserIcon,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  GraduationCap,
  BookOpen,
  Users,
  Shield,
  HelpCircle,
  ArrowRight,
  Globe,
  KeyRound,
  ShieldAlert,
  FileText,
  Sparkles,
  Smartphone,
  Mail,
  ShieldCheck
} from 'lucide-react';
import { ForgotPasswordModal } from './ForgotPasswordModal';
import { ForgotUserIdModal } from './ForgotUserIdModal';
import { AccountActivationModal } from './AccountActivationModal';
import { NotificationSimDrawer } from './NotificationSimDrawer';
import { UserManualModal } from '../support/UserManualModal';
import { AdminPasswordRetrievalModal } from './AdminPasswordRetrievalModal';

export const LoginPage: React.FC = () => {
  const {
    login,
    users,
    language,
    setLanguage,
    t,
    settings,
    activeAuthModal,
    setActiveAuthModal
  } = useApp();

  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
  const [credential, setCredential] = useState('TM-STD-2026-00042');
  const [password, setPassword] = useState('Tamralipta@2026');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [infoMessage, setInfoMessage] = useState('');
  const [showAdminRecoveryModal, setShowAdminRecoveryModal] = useState(false);

  // Load remember-me preference
  useEffect(() => {
    const saved = localStorage.getItem('tm_lms_saved_credential');
    if (saved) {
      setCredential(saved);
    }
  }, []);

  const rolesConfig: {
    role: UserRole;
    title: string;
    bengaliTitle: string;
    icon: React.ElementType;
    desc: string;
    defaultId: string;
    isMasterAdmin?: boolean;
  }[] = [
    {
      role: 'student',
      title: 'Student',
      bengaliTitle: 'শিক্ষার্থী',
      icon: GraduationCap,
      desc: 'Access enrolled courses, submit assignments & review grade card',
      defaultId: 'TM-STD-2026-00042'
    },
    {
      role: 'faculty',
      title: 'Faculty Member',
      bengaliTitle: 'শিক্ষকমণ্ডলী',
      icon: BookOpen,
      desc: 'Deliver syllabus, evaluate submissions & manage quizzes',
      defaultId: 'TM-FAC-0028'
    },
    {
      role: 'dept_head',
      title: 'Department Head',
      bengaliTitle: 'বিভাগীয় প্রধান',
      icon: Users,
      desc: 'Department academic delivery, faculty oversight & syllabus',
      defaultId: 'TM-HOD-0014'
    },
    {
      role: 'principal',
      title: 'Principal / Administrator',
      bengaliTitle: 'অধ্যক্ষ / প্রশাসন',
      icon: Building2,
      desc: 'Institutional analytics, university compliance & circulars',
      defaultId: 'TM-ADM-001'
    },
    {
      role: 'super_admin',
      title: 'Master Administrator',
      bengaliTitle: 'মাস্টার অ্যাডমিন',
      icon: Shield,
      desc: 'Full A-to-Z stakeholder records modification, database & security console',
      defaultId: 'TM-SADM-0001',
      isMasterAdmin: true
    },
    {
      role: 'tech_support',
      title: 'Technical Support',
      bengaliTitle: 'আইটি সহায়তা',
      icon: HelpCircle,
      desc: 'Helpdesk tickets queue, session integrity & diagnostics',
      defaultId: 'TM-ITS-0003'
    }
  ];

  const handleSelectRole = (r: UserRole) => {
    setSelectedRole(r);
    const conf = rolesConfig.find((item) => item.role === r);
    if (conf) {
      setCredential(conf.defaultId);
      setPassword('Tamralipta@2026');
      setErrorMessage('');
    }
  };

  const handleQuickSwitchMasterAdmin = () => {
    setSelectedRole('super_admin');
    setCredential('TM-SADM-0001');
    setPassword('Tamralipta@2026');
    setErrorMessage('');
    setInfoMessage('Switched to Master Admin Mode. Full A-to-Z stakeholder modification privileges enabled.');
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setInfoMessage('');

    if (!credential.trim() || !password) {
      setErrorMessage('Please provide both User ID and Password.');
      return;
    }

    setIsLoading(true);
    // Crucial: The login function independently verifies credentials against actual assigned user role!
    const result = await login(credential.trim(), password, selectedRole);
    setIsLoading(false);

    if (result.success) {
      if (rememberMe) {
        localStorage.setItem('tm_lms_saved_credential', credential.trim());
      } else {
        localStorage.removeItem('tm_lms_saved_credential');
      }
    } else {
      setErrorMessage(result.error || 'Authentication failed. Please verify credentials.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between font-sans text-slate-900">
      {/* Top institutional header */}
      <header className="bg-[#0f2942] text-white border-b border-[#1e3e5e] shadow-md py-3.5 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-700 flex items-center justify-center text-white font-bold shadow-inner border border-white/20">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base tracking-tight text-white">
                  {language === 'bn' ? settings.collegeBengaliName : settings.collegeName}
                </span>
                <span className="text-[11px] font-semibold tracking-wider uppercase text-sky-300 bg-sky-950/80 px-1.5 py-0.5 rounded border border-sky-400/30">
                  TM-LMS
                </span>
              </div>
              <div className="text-xs text-slate-300">
                {language === 'bn' ? 'স্মার্ট লার্নিং ম্যানেজমেন্ট সিস্টেম' : 'Tamluk, Purba Medinipur · Affiliated to Vidyasagar University'}
              </div>
            </div>
          </div>

          {/* Master Admin Direct Trigger & Language Toggle */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleQuickSwitchMasterAdmin}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer shadow-xs border ${
                selectedRole === 'super_admin'
                  ? 'bg-purple-600 text-white border-purple-400'
                  : 'bg-purple-950/70 hover:bg-purple-900 text-purple-200 border-purple-500/40'
              }`}
              title="Switch to Master Admin Console Gateway"
            >
              <Shield className="w-3.5 h-3.5 text-purple-300" />
              <span>Master Admin Portal</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveAuthModal('user_manual')}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-sky-900/70 hover:bg-sky-800 text-sky-200 border border-sky-400/30 rounded-lg text-xs font-medium transition cursor-pointer shadow-xs"
              title="Download or Read the Comprehensive Stakeholder User Manual"
            >
              <FileText className="w-3.5 h-3.5 text-sky-300" />
              <span>{language === 'bn' ? 'ব্যবহার নির্দেশিকা' : 'User Manual'}</span>
            </button>

            {/* Language Toggle */}
            <div className="flex items-center bg-[#183957] rounded-lg p-0.5 border border-[#274f75]">
              <button
                onClick={() => setLanguage('en')}
                className={`px-2.5 py-1 text-xs font-medium rounded transition-all ${
                  language === 'en'
                    ? 'bg-sky-500 text-white font-semibold shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('bn')}
                className={`px-2.5 py-1 text-xs font-medium rounded transition-all ${
                  language === 'bn'
                    ? 'bg-sky-500 text-white font-semibold shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                বাংলা
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Authentication Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-12 bg-white rounded-3xl shadow-xl border border-slate-200/90 overflow-hidden">
          {/* Left Column: Stakeholder Category Selection */}
          <div className="lg:col-span-5 bg-gradient-to-b from-[#0f2942] to-[#14324f] text-white p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-sky-300 mb-1">
                <span>Access Portal</span>
                <span aria-hidden="true">·</span>
                <span>Role Selection</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                {language === 'bn' ? 'সদস্য বিভাগ নির্বাচন' : 'Stakeholder Category'}
              </h2>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Select your academic designation for quick credentials filling. The system independently verifies and authorizes your assigned account.
              </p>

              {/* Stakeholder cards */}
              <div className="mt-5 space-y-2">
                {rolesConfig.map((item) => {
                  const Icon = item.icon;
                  const isSelected = selectedRole === item.role;

                  return (
                    <button
                      key={item.role}
                      type="button"
                      onClick={() => handleSelectRole(item.role)}
                      className={`w-full p-2.5 rounded-xl border text-left flex items-center gap-3 transition-all ${
                        isSelected
                          ? item.isMasterAdmin
                            ? 'bg-purple-600/30 border-purple-400 text-white shadow-xs ring-1 ring-purple-400'
                            : 'bg-sky-500/20 border-sky-400 text-white shadow-xs'
                          : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                      }`}
                    >
                      <div
                        className={`p-2 rounded-lg ${
                          isSelected
                            ? item.isMasterAdmin ? 'bg-purple-600 text-white' : 'bg-sky-500 text-white'
                            : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-semibold text-xs leading-tight text-white flex items-center justify-between">
                          <span className="flex items-center gap-1.5">
                            <span>{language === 'bn' ? item.bengaliTitle : item.title}</span>
                            {item.isMasterAdmin && (
                              <span className="text-[9px] bg-purple-500 text-white px-1.5 py-0.2 rounded font-extrabold uppercase">
                                Master
                              </span>
                            )}
                          </span>
                          <span className="font-mono text-[10px] text-sky-300 font-normal">
                            {item.defaultId}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-300 truncate mt-0.5">
                          {item.desc}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Admin Password Retrieval Direct Link in Left Sidebar */}
              <div className="mt-4 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowAdminRecoveryModal(true)}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl bg-purple-900/40 hover:bg-purple-900/60 border border-purple-400/40 text-xs text-purple-200 transition cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <KeyRound className="w-4 h-4 text-purple-300" />
                    <span className="font-bold">Admin Password Retrieval</span>
                  </div>
                  <span className="text-[10px] bg-purple-500/40 text-purple-200 px-2 py-0.5 rounded font-mono font-bold">
                    Mail / Phone OTP
                  </span>
                </button>
              </div>
            </div>

            {/* Institutional Security Notice */}
            <div className="mt-6 pt-4 border-t border-white/10 text-[11px] text-slate-300 flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 text-sky-400 flex-shrink-0 mt-0.5" />
              <span>
                Protected under Digital Personal Data Protection Act (DPDP), 2023. Unauthorized access attempts are monitored and recorded.
              </span>
            </div>
          </div>

          {/* Right Column: Secure Login Form */}
          <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between">
            <div>
              {/* Header with Master Admin Indicator */}
              <div className="border-b border-slate-100 pb-4 mb-6 flex items-start justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                    <span>{language === 'bn' ? t('auth_login_title') : 'Secure Login'}</span>
                    {selectedRole === 'super_admin' && (
                      <span className="text-xs bg-purple-100 text-purple-800 font-bold px-2 py-0.5 rounded-full border border-purple-200 flex items-center gap-1">
                        <Shield className="w-3 h-3 text-purple-700" />
                        <span>Master Admin Gate</span>
                      </span>
                    )}
                  </h1>
                  <p className="text-xs text-slate-500 mt-1">
                    {selectedRole === 'super_admin'
                      ? 'Authenticated access to the Master Admin Panel with full A-to-Z stakeholder editing authority.'
                      : (language === 'bn' ? t('auth_login_subtitle') : 'Sign in to access your academic dashboard.')}
                  </p>
                </div>
              </div>

              {selectedRole === 'super_admin' && (
                <div className="mb-5 p-3 bg-purple-50/80 border border-purple-200 text-purple-900 rounded-xl text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-purple-700 flex-shrink-0" />
                    <span>
                      Master Admin profile loaded: <span className="font-bold">Dr. Sisir Kumar Bhowmik</span> (<span className="font-mono font-bold">TM-SADM-0001</span>)
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowAdminRecoveryModal(true)}
                    className="text-purple-700 hover:text-purple-900 font-bold underline whitespace-nowrap ml-2 cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>
              )}

              {errorMessage && (
                <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-start gap-2.5 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-600" />
                  <div className="font-medium">{errorMessage}</div>
                </div>
              )}

              {infoMessage && (
                <div className="mb-5 p-3.5 bg-sky-50 border border-sky-200 text-sky-900 rounded-xl text-xs flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5 text-sky-600" />
                  <div className="font-medium">{infoMessage}</div>
                </div>
              )}

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                {/* User ID input */}
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    {language === 'bn' ? 'ইউজার আইডি / নিবন্ধিত ইমেল / মোবাইল:' : 'User ID / Registered Contact:'}
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      value={credential}
                      onChange={(e) => setCredential(e.target.value)}
                      placeholder="e.g. TM-STD-2026-00042, TM-SADM-0001, or email"
                      className="w-full text-xs pl-10 pr-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition font-medium"
                    />
                  </div>
                </div>

                {/* Password input with show/hide and Admin Recovery option */}
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <label className="font-semibold text-slate-700">
                      {language === 'bn' ? 'পাসওয়ার্ড:' : 'Password:'}
                    </label>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setShowAdminRecoveryModal(true)}
                        className="text-purple-700 hover:text-purple-900 font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                        title="Retrieve administrator password via Mail ID or Phone Number"
                      >
                        <KeyRound className="w-3 h-3 text-purple-600" />
                        <span>Admin Retrieval (Mail/Phone)</span>
                      </button>
                      <span className="text-slate-300">|</span>
                      <button
                        type="button"
                        onClick={() => setActiveAuthModal('forgot_password')}
                        className="text-sky-700 hover:text-sky-900 font-semibold text-[11px] cursor-pointer"
                      >
                        {language === 'bn' ? t('auth_forgot_password') : 'Forgot?'}
                      </button>
                    </div>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter password"
                      className="w-full text-xs pl-10 pr-10 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-2.5 text-slate-400 hover:text-slate-700 cursor-pointer"
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Remember Me and Forgot User ID */}
                <div className="flex items-center justify-between text-xs pt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none text-slate-600">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                    />
                    <span>{t('auth_remember_me')}</span>
                  </label>

                  <button
                    type="button"
                    onClick={() => setActiveAuthModal('forgot_user_id')}
                    className="text-slate-500 hover:text-slate-800 text-[11px] font-medium cursor-pointer"
                  >
                    {t('auth_forgot_user_id')}
                  </button>
                </div>

                {/* Submit button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full py-3 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 cursor-pointer ${
                      selectedRole === 'super_admin'
                        ? 'bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-800 hover:to-indigo-800'
                        : 'bg-[#0f2942] hover:bg-[#1a3d5e]'
                    } disabled:opacity-50`}
                  >
                    <span>
                      {isLoading
                        ? 'Verifying Secure Credentials...'
                        : selectedRole === 'super_admin'
                        ? 'Sign In to Master Admin Panel'
                        : t('auth_sign_in_btn')}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>

              {/* First-time Account Activation CTA */}
              <div className="mt-5 text-center text-xs border-t border-slate-100 pt-4">
                <span className="text-slate-500">First time logging in with admission roll? </span>
                <button
                  type="button"
                  onClick={() => setActiveAuthModal('account_activation')}
                  className="font-bold text-sky-700 hover:text-sky-900 cursor-pointer"
                >
                  Activate Account →
                </button>
              </div>
            </div>

            {/* Footer links */}
            <div className="mt-8 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between text-[11px] text-slate-400 gap-2">
              <button
                type="button"
                onClick={() => setShowAdminRecoveryModal(true)}
                className="text-purple-700 font-bold hover:underline cursor-pointer flex items-center gap-1"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Admin Password Retrieval</span>
              </button>
              <span aria-hidden="true">·</span>
              <button
                type="button"
                onClick={() => setActiveAuthModal('user_manual')}
                className="hover:text-sky-700 text-sky-700 font-semibold flex items-center gap-1 cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>User Manual (PDF)</span>
              </button>
              <span aria-hidden="true">·</span>
              <button
                type="button"
                onClick={() => alert('IT Support Cell, Tamralipta Mahavidyalaya\nEmail: itsupport@tmv.ac.in\nPhone: +91 (03228) 266054')}
                className="hover:text-slate-700 cursor-pointer"
              >
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Floating Simulation Notifications Drawer (for previewing simulated SMS & Email dispatches) */}
      <NotificationSimDrawer />

      {/* Admin Password Retrieval Modal */}
      {showAdminRecoveryModal && (
        <AdminPasswordRetrievalModal
          onClose={() => setShowAdminRecoveryModal(false)}
          onSuccess={(adminUserId, newPass) => {
            setShowAdminRecoveryModal(false);
            setCredential(adminUserId);
            if (newPass) {
              setPassword(newPass);
            }
            setSelectedRole('super_admin');
            setInfoMessage(`Master Admin password reset successfully via registered mail/phone! You can now log in.`);
          }}
        />
      )}

      {/* Standard Modals */}
      {activeAuthModal === 'user_manual' && (
        <UserManualModal
          onClose={() => setActiveAuthModal(null)}
          initialRoleFilter={selectedRole}
        />
      )}

      {activeAuthModal === 'forgot_password' && (
        <ForgotPasswordModal
          onClose={() => setActiveAuthModal(null)}
          onSuccessReturnToLogin={() => {
            setActiveAuthModal(null);
            setInfoMessage('Your password has been reset successfully. Please log in using your new password.');
          }}
        />
      )}

      {activeAuthModal === 'forgot_user_id' && (
        <ForgotUserIdModal
          onClose={() => setActiveAuthModal(null)}
          onUseUserId={(retrievedId) => {
            setCredential(retrievedId);
            setInfoMessage(`User ID ${retrievedId} has been populated into the login form.`);
          }}
        />
      )}

      {activeAuthModal === 'account_activation' && (
        <AccountActivationModal
          onClose={() => setActiveAuthModal(null)}
          onSuccess={(activatedId) => {
            setCredential(activatedId);
            setInfoMessage('Account activated successfully. Please sign in with your newly defined password.');
          }}
        />
      )}

      {/* Institutional Footer */}
      <footer className="py-4 text-center text-xs text-slate-500 border-t border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-1 text-[11px]">
          <span>© {new Date().getFullYear()} Tamralipta Mahavidyalaya. All rights reserved.</span>
          <span>Affiliated to Vidyasagar University · Grade A Accredited by NAAC</span>
        </div>
      </footer>
    </div>
  );
};

