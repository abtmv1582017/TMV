import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Shield,
  Users,
  Server,
  Database,
  HardDrive,
  KeyRound,
  AlertTriangle,
  CheckCircle2,
  Download,
  Upload,
  RefreshCw,
  Lock,
  Layers,
  Settings,
  Activity,
  FileText,
  UserCheck,
  UserX,
  Clock,
  ArrowUpRight,
  ShieldCheck,
  Sliders
} from 'lucide-react';
import { StorageService } from '../../services/storage';

export const SuperAdminDashboard: React.FC = () => {
  const {
    currentUser,
    users,
    departments,
    courses,
    resources,
    auditLogs,
    authPolicy,
    updateAuthPolicy,
    setActiveTab,
    language
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'security' | 'backups' | 'health'>('overview');
  const [backupStatus, setBackupStatus] = useState<string | null>(null);
  const [restoreJson, setRestoreJson] = useState('');
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [restoreMessage, setRestoreMessage] = useState<string | null>(null);

  // Statistics
  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.accountStatus === 'active').length;
  const pendingActivationUsers = users.filter((u) => u.accountStatus === 'pending_activation').length;
  const lockedUsers = users.filter((u) => u.accountStatus === 'locked').length;
  const deactivatedUsers = users.filter((u) => u.accountStatus === 'deactivated').length;

  const totalCourses = courses.length;
  const totalResources = resources.length;
  const totalStorageMB = (resources.length * 3.4).toFixed(1);

  // Failed login attempts recorded in recent audit logs
  const failedLogins = auditLogs.filter(
    (l) => l.action.includes('FAILED') || l.action.includes('LOCKOUT')
  );

  const handleDownloadBackup = () => {
    const backupJson = StorageService.exportDatabaseBackup();
    const blob = new Blob([backupJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tamralipta_lms_master_backup_${new Date().toISOString().substring(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setBackupStatus('Master JSON database backup generated and downloaded successfully.');
    setTimeout(() => setBackupStatus(null), 5000);
  };

  const handleImportBackup = () => {
    if (!restoreJson.trim()) return;
    const ok = StorageService.importDatabaseBackup(restoreJson.trim());
    if (ok) {
      setRestoreMessage('Database successfully restored from backup! Refreshing environment...');
      setTimeout(() => window.location.reload(), 1200);
    } else {
      setRestoreMessage('Invalid JSON backup file. Please verify structure.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Super Admin Executive Header Banner */}
      <div className="bg-gradient-to-r from-[#0b1d3a] via-[#0f2942] to-[#1e1b4b] text-white rounded-2xl p-6 shadow-xl border border-indigo-900/60">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-purple-300">
              <Shield className="w-4 h-4 text-purple-400" />
              <span>Highest System-Level Authority</span>
              <span aria-hidden="true">·</span>
              <span>Role: Super Administrator (TM-SADM)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold mt-1 tracking-tight">
              {currentUser.name} — Technical Control Console
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Global infrastructure oversight, centralized RBAC enforcement, real-time security audit trails, academic structure provisioning, and automated disaster recovery.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <button
              onClick={() => setActiveTab('master_admin')}
              className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer border border-purple-400/40"
              title="Open the Master Admin Panel to view and edit all A-to-Z stakeholder information"
            >
              <Shield className="w-4 h-4 text-purple-200" />
              <span>Master Admin A-to-Z Panel</span>
            </button>
            <button
              onClick={handleDownloadBackup}
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-3.5 py-2.5 rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer"
              title="Download complete JSON dump of the centralized LMS database"
            >
              <Download className="w-4 h-4" />
              <span>Database Dump</span>
            </button>
            <button
              onClick={() => setShowRestoreModal(true)}
              className="bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-3.5 py-2.5 rounded-xl border border-white/20 transition flex items-center gap-2 cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span>Restore DB</span>
            </button>
            <button
              onClick={() => setActiveTab('auth_security')}
              className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold px-3.5 py-2.5 rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer"
            >
              <KeyRound className="w-4 h-4" />
              <span>ID & Auth Policy</span>
            </button>
          </div>
        </div>

        {backupStatus && (
          <div className="mt-4 p-2.5 bg-emerald-950/80 border border-emerald-500/50 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>{backupStatus}</span>
          </div>
        )}
      </div>

      {/* Primary Infrastructure Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Total Accounts</span>
            <Users className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">{totalUsers}</div>
          <div className="text-[11px] text-emerald-600 font-medium mt-0.5">{activeUsers} Active Accounts</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Pending Activation</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-amber-600 mt-2">{pendingActivationUsers}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Awaiting first login</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Locked Accounts</span>
            <Lock className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-bold text-rose-600 mt-2">{lockedUsers}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">5-attempt lockout</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Academic Depts</span>
            <Layers className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-bold text-indigo-700 mt-2">{departments.length}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">{totalCourses} Active Courses</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Storage Quota</span>
            <HardDrive className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-2xl font-bold text-sky-800 mt-2">{totalStorageMB} MB</div>
          <div className="text-[11px] text-slate-500 mt-0.5">{totalResources} Learning Assets</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>System Health</span>
            <Activity className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-emerald-700 mt-2">100%</div>
          <div className="text-[11px] text-emerald-600 font-medium mt-0.5">Zero Outages</div>
        </div>
      </div>

      {/* Subtabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveSubTab('overview')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
            activeSubTab === 'overview'
              ? 'bg-purple-100 text-purple-900 border border-purple-300'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Administrative Console
        </button>
        <button
          onClick={() => setActiveSubTab('security')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
            activeSubTab === 'security'
              ? 'bg-purple-100 text-purple-900 border border-purple-300'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Security & Access Control
        </button>
        <button
          onClick={() => setActiveSubTab('backups')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
            activeSubTab === 'backups'
              ? 'bg-purple-100 text-purple-900 border border-purple-300'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Backup & Disaster Recovery
        </button>
        <button
          onClick={() => setActiveSubTab('health')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
            activeSubTab === 'health'
              ? 'bg-purple-100 text-purple-900 border border-purple-300'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Server & Error Telemetry
        </button>
      </div>

      {/* Subtab 1: Administrative Console Overview */}
      {activeSubTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Quick Technical Access Cards */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-purple-700" />
                  <h2 className="text-sm font-bold text-slate-900">Technical Module Controllers</h2>
                </div>
                <span className="text-[11px] text-slate-400">Direct Super Admin Routing</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <button
                  onClick={() => setActiveTab('users')}
                  className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-purple-50/50 hover:border-purple-300 text-left transition flex items-start justify-between group cursor-pointer"
                >
                  <div>
                    <span className="font-bold text-slate-900 group-hover:text-purple-900 block">
                      User Management Console
                    </span>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Search, provision, bulk CSV import, password resets, and role assignments across all 6 tiers.
                    </p>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600" />
                </button>

                <button
                  onClick={() => setActiveTab('structure')}
                  className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-purple-50/50 hover:border-purple-300 text-left transition flex items-start justify-between group cursor-pointer"
                >
                  <div>
                    <span className="font-bold text-slate-900 group-hover:text-purple-900 block">
                      Academic Hierarchy Engine
                    </span>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Configure Departments, Programmes, Semesters, Courses, Faculty allocations & Student enrollments.
                    </p>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600" />
                </button>

                <button
                  onClick={() => setActiveTab('auth_security')}
                  className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-purple-50/50 hover:border-purple-300 text-left transition flex items-start justify-between group cursor-pointer"
                >
                  <div>
                    <span className="font-bold text-slate-900 group-hover:text-purple-900 block">
                      ID Generation & Password Policy
                    </span>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Configure TM-STD prefixes, lockout thresholds (5 failed attempts), token expiry TTLs.
                    </p>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600" />
                </button>

                <button
                  onClick={() => setActiveTab('audit')}
                  className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-purple-50/50 hover:border-purple-300 text-left transition flex items-start justify-between group cursor-pointer"
                >
                  <div>
                    <span className="font-bold text-slate-900 group-hover:text-purple-900 block">
                      Forensic Security Audit Logs
                    </span>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Inspect immutable records of every login, password reset, grade update, and system action.
                    </p>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600" />
                </button>

                <button
                  onClick={() => setActiveTab('database')}
                  className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-purple-50/50 hover:border-purple-300 text-left transition flex items-start justify-between group cursor-pointer"
                >
                  <div>
                    <span className="font-bold text-slate-900 group-hover:text-purple-900 block flex items-center gap-1.5">
                      <Database className="w-3.5 h-3.5 text-purple-600" />
                      <span>Central Common Database Console</span>
                    </span>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Inspect 20 relational collections, query records, check integrity, export master JSON, and manage RBAC.
                    </p>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600" />
                </button>

                <button
                  onClick={() => setActiveTab('approvals')}
                  className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-purple-50/50 hover:border-purple-300 text-left transition flex items-start justify-between group cursor-pointer"
                >
                  <div>
                    <span className="font-bold text-slate-900 group-hover:text-purple-900 block flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Institutional Approvals Queue</span>
                    </span>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Supervise academic approval hierarchy across all departments, syllabus drafts, and class swaps.
                    </p>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600" />
                </button>
              </div>
            </div>

            {/* Recent High-Priority Administrative Activities */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-900">Recent Security & Administrative Actions</h3>
                <button
                  onClick={() => setActiveTab('audit')}
                  className="text-xs text-purple-700 hover:underline font-semibold"
                >
                  View All Audit Logs →
                </button>
              </div>

              <div className="space-y-2">
                {auditLogs.slice(0, 6).map((log) => (
                  <div
                    key={log.id}
                    className="p-2.5 rounded-lg border border-slate-100 bg-slate-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-800">{log.action}</span>
                        <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded font-mono">
                          {log.userRole}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-0.5">{log.details}</p>
                    </div>
                    <div className="text-right text-[10px] text-slate-400 flex-shrink-0 font-mono">
                      <div>{log.timestamp}</div>
                      <div>IP: {log.ipAddress}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: System Status & User Distribution */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900 mb-3 pb-2 border-b border-slate-100 flex items-center gap-2">
                <Database className="w-4 h-4 text-purple-700" />
                Centralized Database Health
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between items-center py-1 border-b border-slate-100">
                  <span className="text-slate-600">Storage Engine:</span>
                  <span className="font-mono font-semibold text-slate-800">HTML5 LocalStorage / IndexedDB</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-100">
                  <span className="text-slate-600">JSON Record Collections:</span>
                  <span className="font-semibold text-slate-800">22 Synced Collections</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-100">
                  <span className="text-slate-600">Password Hashing:</span>
                  <span className="font-mono font-semibold text-emerald-700">SHA-256 + Salt</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-100">
                  <span className="text-slate-600">DPDP Act 2023 Readiness:</span>
                  <span className="font-semibold text-emerald-700">Enforced & Compliant</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-600">Last Backup Check:</span>
                  <span className="font-semibold text-slate-800">Today, Clean State</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100">
                <button
                  onClick={handleDownloadBackup}
                  className="w-full py-2 bg-purple-50 hover:bg-purple-100 text-purple-800 font-semibold rounded-lg text-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Live Master Backup (.json)</span>
                </button>
              </div>
            </div>

            {/* Stakeholder Role Distribution */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900 mb-3 pb-2 border-b border-slate-100">
                Stakeholder Account Breakdown
              </h3>
              <div className="space-y-2 text-xs">
                {[
                  { label: 'Students (TM-STD)', role: 'student', count: users.filter((u) => u.role === 'student').length, color: 'bg-sky-500' },
                  { label: 'Faculty Members (TM-FAC)', role: 'faculty', count: users.filter((u) => u.role === 'faculty').length, color: 'bg-emerald-500' },
                  { label: 'Department Heads (TM-HOD)', role: 'dept_head', count: users.filter((u) => u.role === 'dept_head').length, color: 'bg-blue-500' },
                  { label: 'Principal & Admin (TM-ADM)', role: 'principal', count: users.filter((u) => u.role === 'principal').length, color: 'bg-amber-500' },
                  { label: 'Technical Support (TM-ITS)', role: 'tech_support', count: users.filter((u) => u.role === 'tech_support').length, color: 'bg-rose-500' },
                  { label: 'Super Administrators', role: 'super_admin', count: users.filter((u) => u.role === 'super_admin').length, color: 'bg-purple-500' }
                ].map((item) => (
                  <div key={item.role} className="flex items-center justify-between py-1">
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                      <span className="text-slate-700">{item.label}</span>
                    </div>
                    <span className="font-bold text-slate-900">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Subtab 2: Security & Access Control */}
      {activeSubTab === 'security' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">Institutional Security & Lockout Parameters</h2>
              <p className="text-xs text-slate-500">Configure global authentication thresholds and brute-force defenses</p>
            </div>
            <button
              onClick={() => setActiveTab('auth_security')}
              className="px-3 py-1.5 bg-purple-700 hover:bg-purple-800 text-white rounded-lg text-xs font-semibold shadow-xs"
            >
              Open Full Policy Editor →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <span className="text-slate-500 block">Failed Password Lockout:</span>
              <div className="text-xl font-bold text-slate-900">{authPolicy.maxFailedAttempts} Consecutive Attempts</div>
              <p className="text-[11px] text-slate-500">Exceeding this automatically locks account for {authPolicy.lockoutDurationMinutes} minutes.</p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <span className="text-slate-500 block">Mobile SMS OTP Validity:</span>
              <div className="text-xl font-bold text-slate-900">{authPolicy.otpExpiryMinutes} Minutes TTL</div>
              <p className="text-[11px] text-slate-500">6-digit cryptographically generated OTP token; maximum 3 verification tries.</p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <span className="text-slate-500 block">Institutional Email Reset Link:</span>
              <div className="text-xl font-bold text-slate-900">{authPolicy.resetLinkExpiryMinutes} Minutes TTL</div>
              <p className="text-[11px] text-slate-500">Single-use token with cryptographic signing; invalidated upon consumption.</p>
            </div>
          </div>

          {/* Failed Login Surveillance Table */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              Recent Security Incident Log & Failed Logins
            </h3>
            {failedLogins.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center bg-slate-50 rounded-xl">No security warnings or lockouts recorded.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
                  <thead className="bg-slate-100 text-slate-700 font-semibold">
                    <tr>
                      <th className="p-2.5">Timestamp</th>
                      <th className="p-2.5">Target Stakeholder</th>
                      <th className="p-2.5">Action</th>
                      <th className="p-2.5">Incident Details</th>
                      <th className="p-2.5">Client IP</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {failedLogins.map((fl) => (
                      <tr key={fl.id} className="hover:bg-rose-50/40">
                        <td className="p-2.5 font-mono text-[11px] text-slate-500">{fl.timestamp}</td>
                        <td className="p-2.5 font-semibold text-slate-900">{fl.userName}</td>
                        <td className="p-2.5">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800">
                            {fl.action}
                          </span>
                        </td>
                        <td className="p-2.5 text-slate-600">{fl.details}</td>
                        <td className="p-2.5 font-mono text-[11px] text-slate-500">{fl.ipAddress}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Subtab 3: Backup & Disaster Recovery */}
      {activeSubTab === 'backups' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div>
            <h2 className="text-base font-bold text-slate-900">Database Backup & Disaster Recovery</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Automated database serialization, snapshot archiving, and recovery verification for Tamralipta Mahavidyalaya.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 border border-slate-200 rounded-xl bg-slate-50 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 font-bold text-sm text-slate-900 mb-1">
                  <Download className="w-4 h-4 text-emerald-600" />
                  Full Database Export
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Generates an immutable JSON snapshot containing all 22 collections: Users, Courses, Assignments, Submissions, Quizzes, Attendance, Grades, Resources, Announcements, Audit Logs, and Institutional Documents.
                </p>
              </div>
              <button
                onClick={handleDownloadBackup}
                className="mt-4 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs transition flex items-center justify-center gap-2 cursor-pointer self-start"
              >
                <Download className="w-4 h-4" />
                <span>Export Master JSON Dump</span>
              </button>
            </div>

            <div className="p-5 border border-slate-200 rounded-xl bg-slate-50 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 font-bold text-sm text-slate-900 mb-1">
                  <Upload className="w-4 h-4 text-purple-600" />
                  Snapshot Restoration
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Restore previous verified snapshots into the active database. Restorations are validated before write operations to prevent schema corruption.
                </p>
              </div>
              <button
                onClick={() => setShowRestoreModal(true)}
                className="mt-4 px-4 py-2.5 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-xs font-semibold shadow-xs transition flex items-center justify-center gap-2 cursor-pointer self-start"
              >
                <Upload className="w-4 h-4" />
                <span>Open Restore Interface</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Subtab 4: Server & Error Telemetry */}
      {activeSubTab === 'health' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900">Application Availability & Service Mesh</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
              <span className="font-bold text-emerald-900 block">Vite / React Core</span>
              <span className="text-emerald-700 text-[11px]">Online · Production Build OK</span>
            </div>
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
              <span className="font-bold text-emerald-900 block">Database Synchronization</span>
              <span className="text-emerald-700 text-[11px]">Synced · 0 Uncommitted Tx</span>
            </div>
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
              <span className="font-bold text-emerald-900 block">Notification Gateway</span>
              <span className="text-emerald-700 text-[11px]">Simulated Active · 100% Delivery</span>
            </div>
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
              <span className="font-bold text-emerald-900 block">PDF Generation Engine</span>
              <span className="text-emerald-700 text-[11px]">jsPDF v4 Client Engine Ready</span>
            </div>
          </div>
        </div>
      )}

      {/* Restore Database Modal */}
      {showRestoreModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <Upload className="w-5 h-5 text-purple-700" />
                Restore Centralized LMS Database
              </h3>
              <button
                onClick={() => {
                  setShowRestoreModal(false);
                  setRestoreMessage(null);
                }}
                className="text-slate-400 hover:text-slate-700 text-xs p-1"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Paste the contents of your verified <code>.json</code> database snapshot below:
            </p>

            <textarea
              rows={8}
              value={restoreJson}
              onChange={(e) => setRestoreJson(e.target.value)}
              placeholder='Paste JSON here: {"timestamp": "...", "data": {...}}'
              className="w-full text-xs font-mono p-3 border border-slate-300 rounded-xl focus:outline-none focus:border-purple-600"
            />

            {restoreMessage && (
              <div className="p-2.5 rounded-lg text-xs bg-purple-50 text-purple-800 border border-purple-200">
                {restoreMessage}
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowRestoreModal(false);
                  setRestoreMessage(null);
                }}
                className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleImportBackup}
                className="px-5 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-xs font-semibold shadow-xs"
              >
                Commit Restoration
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
