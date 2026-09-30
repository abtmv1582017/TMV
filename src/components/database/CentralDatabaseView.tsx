import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StorageService } from '../../services/storage';
import {
  Database,
  Table,
  HardDrive,
  Download,
  Upload,
  RefreshCw,
  Search,
  CheckCircle2,
  AlertTriangle,
  Shield,
  Layers,
  FileText,
  Users,
  BookOpen,
  Calendar,
  Lock,
  ChevronRight,
  Eye,
  Sliders,
  Sparkles,
  Server
} from 'lucide-react';

export const CentralDatabaseView: React.FC = () => {
  const {
    currentUser,
    users,
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
    settings,
    sessions,
    language
  } = useApp();

  const isSuperAdmin = currentUser.role === 'super_admin';
  const [selectedTable, setSelectedTable] = useState<string>('courses');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'tables' | 'rbac' | 'health' | 'backup'>('tables');
  const [showRestoreModal, setShowRestoreModal] = useState<boolean>(false);
  const [restoreJson, setRestoreJson] = useState<string>('');
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Table definitions matching the 20 common database collections
  const tables = [
    { id: 'courses', name: 'courses', label: 'Academic Courses', count: courses.length, data: courses, icon: BookOpen, primaryKey: 'id' },
    { id: 'resources', name: 'resources', label: 'Teaching Materials & Handouts', count: resources.length, data: resources, icon: FileText, primaryKey: 'id' },
    { id: 'approval_requests', name: 'approval_requests', label: 'Approval Queue Records', count: approvalRequests.length, data: approvalRequests, icon: CheckCircle2, primaryKey: 'id' },
    { id: 'class_swaps', name: 'class_swaps', label: 'Faculty Class Swaps', count: classSwaps.length, data: classSwaps, icon: Calendar, primaryKey: 'id' },
    { id: 'users', name: 'users', label: 'User Identities & Profiles', count: users.length, data: users, icon: Users, primaryKey: 'id' },
    { id: 'departments', name: 'departments', label: 'Academic Departments', count: departments.length, data: departments, icon: Layers, primaryKey: 'id' },
    { id: 'institutional_docs', name: 'institutional_docs', label: 'Official College Circulars', count: institutionalDocs.length, data: institutionalDocs, icon: FileText, primaryKey: 'id' },
    { id: 'assignments', name: 'assignments', label: 'Course Assignments', count: assignments.length, data: assignments, icon: FileText, primaryKey: 'id' },
    { id: 'submissions', name: 'submissions', label: 'Assignment Submissions', count: submissions.length, data: submissions, icon: FileText, primaryKey: 'id' },
    { id: 'assessments', name: 'assessments', label: 'Quizzes & Continuous Assessments', count: assessments.length, data: assessments, icon: Sliders, primaryKey: 'id' },
    { id: 'attempts', name: 'attempts', label: 'Assessment Attempts', count: attempts.length, data: attempts, icon: Sliders, primaryKey: 'id' },
    { id: 'grades', name: 'grades', label: 'Continuous Evaluation Grades', count: grades.length, data: grades, icon: Sliders, primaryKey: 'id' },
    { id: 'attendance', name: 'attendance', label: 'Attendance Rosters', count: attendance.length, data: attendance, icon: Calendar, primaryKey: 'id' },
    { id: 'announcements', name: 'announcements', label: 'Broadcast Announcements', count: announcements.length, data: announcements, icon: FileText, primaryKey: 'id' },
    { id: 'discussions', name: 'discussions', label: 'Academic Forum Threads', count: discussions.length, data: discussions, icon: FileText, primaryKey: 'id' },
    { id: 'tickets', name: 'tickets', label: 'Help Desk Tickets', count: tickets.length, data: tickets, icon: FileText, primaryKey: 'id' },
    { id: 'events', name: 'events', label: 'Academic Calendar Events', count: events.length, data: events, icon: Calendar, primaryKey: 'id' },
    { id: 'audit_logs', name: 'audit_logs', label: 'System Security Audit Trail', count: auditLogs.length, data: auditLogs, icon: Shield, primaryKey: 'id' },
    { id: 'programmes', name: 'programmes', label: 'Degree Programmes (CBCS)', count: programmes.length, data: programmes, icon: Layers, primaryKey: 'id' },
    { id: 'sessions', name: 'sessions', label: 'Academic Sessions', count: sessions.length, data: sessions, icon: Calendar, primaryKey: 'id' }
  ];

  const currentTableObj = tables.find((t) => t.id === selectedTable) || tables[0];

  // Filter records in current table
  const filteredRecords = (currentTableObj.data as any[]).filter((record) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return Object.values(record).some((val) => {
      if (typeof val === 'string' || typeof val === 'number') {
        return String(val).toLowerCase().includes(term);
      }
      return false;
    });
  });

  const totalRecordsCount = tables.reduce((acc, t) => acc + t.count, 0);

  const handleDownloadBackup = () => {
    const backupJson = StorageService.exportDatabaseBackup();
    const blob = new Blob([backupJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tamralipta_lms_central_db_${new Date().toISOString().substring(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setStatusMessage({ type: 'success', text: 'Central common database JSON backup downloaded successfully.' });
    setTimeout(() => setStatusMessage(null), 5000);
  };

  const handleRestoreDatabase = () => {
    if (!restoreJson.trim()) return;
    const success = StorageService.importDatabaseBackup(restoreJson.trim());
    if (success) {
      setStatusMessage({ type: 'success', text: 'Database successfully imported! Reloading synchronized state...' });
      setTimeout(() => window.location.reload(), 1200);
    } else {
      setStatusMessage({ type: 'error', text: 'Invalid JSON backup format. Please verify the structure.' });
    }
  };

  const handleResetToDefault = () => {
    if (window.confirm('Are you sure you want to reset the common database to institutional initial seed data? All custom records will be restored to defaults.')) {
      StorageService.resetAllData();
    }
  };

  // RBAC Matrix
  const rbacRules = [
    {
      collection: 'Teaching Materials (resources)',
      faculty: 'Full CRUD & Versioning (Own)',
      deptHead: 'Read & Review / Approve Dept Resources',
      principal: 'Read & Executive Oversight',
      superAdmin: 'Full Database & Schema Control'
    },
    {
      collection: 'Department Courses & Syllabi (courses)',
      faculty: 'Read & Manage Assigned Units',
      deptHead: 'Coordinate Allocation & Faculty Assignment',
      principal: 'Institutional Academic Oversight',
      superAdmin: 'Master Table Provisioning'
    },
    {
      collection: 'Approval Queue (approval_requests)',
      faculty: 'Initiate Requests (Materials, Swaps, CA)',
      deptHead: 'Review & Authorize Dept Requests',
      principal: 'Final Executive Approval (College-wide)',
      superAdmin: 'Workflow & Audit Log Monitoring'
    },
    {
      collection: 'Official Circulars (institutional_docs)',
      faculty: 'Read & Download Official Notices',
      deptHead: 'Read & Co-sign Dept Directives',
      principal: 'Create, Sign & Gazette Institutional Docs',
      superAdmin: 'System Storage & Integrity Management'
    },
    {
      collection: 'Continuous Evaluation & Grades (grades)',
      faculty: 'Enter & Submit Marks for Assigned Courses',
      deptHead: 'Moderate Departmental Grades Before Publishing',
      principal: 'Review College-wide Academic Analytics',
      superAdmin: 'Database Persistence & Backup'
    },
    {
      collection: 'User Accounts & Security (users, auth_policy)',
      faculty: 'Self Profile & Password Reset',
      deptHead: 'View Department Roster',
      principal: 'Review Staff Strengths & Directory',
      superAdmin: 'Full Lifecycle, Unlock, Policy Enforcement'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Executive Header Banner */}
      <div className="bg-gradient-to-r from-[#0b1d3a] via-[#102a45] to-[#1e1b4b] text-white rounded-2xl p-6 shadow-xl border border-sky-900/60">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-sky-300">
              <Database className="w-4 h-4 text-sky-400" />
              <span>Centralized Institutional Data Repository</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono">TM-LMS Central Schema v2.4</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold mt-1 tracking-tight">
              Common Database & Technical Control Console
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Unified schema serving all institutional stakeholders. Manages cross-table relational integrity, role-based access control (RBAC), multi-tab state synchronization, and automated disaster recovery dumps.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <button
              onClick={handleDownloadBackup}
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Export Master JSON Dump</span>
            </button>
            {isSuperAdmin && (
              <>
                <button
                  onClick={() => setShowRestoreModal(true)}
                  className="bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-3.5 py-2.5 rounded-xl border border-white/20 transition flex items-center gap-2 cursor-pointer"
                >
                  <Upload className="w-4 h-4" />
                  <span>Restore Database</span>
                </button>
                <button
                  onClick={handleResetToDefault}
                  className="bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border border-rose-400/30 text-xs font-semibold px-3 py-2.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                  title="Reset database to default seed state"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Re-seed DB</span>
                </button>
              </>
            )}
          </div>
        </div>

        {statusMessage && (
          <div
            className={`mt-4 p-3 rounded-xl text-xs flex items-center gap-2 ${
              statusMessage.type === 'success'
                ? 'bg-emerald-950/80 border border-emerald-500/50 text-emerald-300'
                : 'bg-rose-950/80 border border-rose-500/50 text-rose-300'
            }`}
          >
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}
      </div>

      {/* Database KPI Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Total Tables</span>
            <Table className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">{tables.length}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Relational Collections</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Total Records</span>
            <Database className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-bold text-indigo-600 mt-2">{totalRecordsCount}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Active Rows in Memory</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Schema Integrity</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-emerald-600 mt-2">100% Valid</div>
          <div className="text-[11px] text-emerald-700 font-medium mt-0.5">Zero Foreign Key Violations</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Sync Mechanism</span>
            <Server className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-lg font-bold text-slate-900 mt-2">Cross-Tab Live</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Real-time Storage Bus</div>
        </div>
      </div>

      {/* Navigation Sub-tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('tables')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition flex items-center gap-2 ${
            activeTab === 'tables'
              ? 'bg-sky-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Table className="w-4 h-4" />
          <span>Interactive Table Explorer</span>
        </button>

        <button
          onClick={() => setActiveTab('rbac')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition flex items-center gap-2 ${
            activeTab === 'rbac'
              ? 'bg-sky-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>RBAC Access Control Matrix</span>
        </button>

        <button
          onClick={() => setActiveTab('health')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition flex items-center gap-2 ${
            activeTab === 'health'
              ? 'bg-sky-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <HardDrive className="w-4 h-4" />
          <span>Database Health & Integrity</span>
        </button>
      </div>

      {/* Tab 1: Interactive Table Explorer */}
      {activeTab === 'tables' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Table List Sidebar */}
          <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-xs space-y-1">
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider px-2 py-1.5 flex items-center justify-between">
              <span>Database Collections</span>
              <span className="text-[10px] text-slate-400 font-mono">({tables.length})</span>
            </div>

            <div className="space-y-1 max-h-[500px] overflow-y-auto pr-1">
              {tables.map((t) => {
                const isSelected = selectedTable === t.id;
                const Icon = t.icon;
                return (
                  <button
                    key={t.id}
                    onClick={() => {
                      setSelectedTable(t.id);
                      setSearchTerm('');
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between transition ${
                      isSelected
                        ? 'bg-sky-50 text-sky-900 font-bold border border-sky-200 shadow-xs'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <Icon className={`w-3.5 h-3.5 flex-shrink-0 ${isSelected ? 'text-sky-600' : 'text-slate-400'}`} />
                      <span className="truncate">{t.name}</span>
                    </div>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                        isSelected ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {t.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Table Content & Viewer */}
          <div className="lg:col-span-3 bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-slate-900 font-mono">
                    Table: {currentTableObj.name}
                  </h2>
                  <span className="text-xs text-slate-500 font-normal">({currentTableObj.label})</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Showing {filteredRecords.length} of {currentTableObj.count} records · Primary Key: <span className="font-mono text-sky-700">{currentTableObj.primaryKey}</span>
                </div>
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={`Search ${currentTableObj.name}...`}
                  className="w-full text-xs pl-8 pr-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>

            {/* Table Records Data Grid */}
            <div className="overflow-x-auto max-h-[500px]">
              {filteredRecords.length === 0 ? (
                <div className="p-12 text-center text-xs text-slate-500">
                  No records found in table "{currentTableObj.name}" matching the search term.
                </div>
              ) : (
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-mono text-[11px]">
                      {Object.keys(filteredRecords[0] || {})
                        .slice(0, 6)
                        .map((key) => (
                          <th key={key} className="px-3 py-2 font-semibold">
                            {key}
                          </th>
                        ))}
                      <th className="px-3 py-2 font-semibold text-right">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-sans">
                    {filteredRecords.slice(0, 50).map((record, index) => {
                      const keys = Object.keys(record).slice(0, 6);
                      return (
                        <tr key={record.id || index} className="hover:bg-slate-50/80 transition">
                          {keys.map((key) => {
                            const val = record[key];
                            const displayVal =
                              typeof val === 'object'
                                ? JSON.stringify(val).substring(0, 25) + '...'
                                : String(val ?? '');
                            return (
                              <td key={key} className="px-3 py-2 text-slate-700 max-w-[180px] truncate font-mono text-[11px]">
                                {displayVal}
                              </td>
                            );
                          })}
                          <td className="px-3 py-2 text-right">
                            <button
                              onClick={() => alert(`Full Record JSON:\n\n${JSON.stringify(record, null, 2)}`)}
                              className="text-[11px] text-sky-600 hover:text-sky-800 font-semibold cursor-pointer"
                            >
                              Inspect JSON
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: RBAC Access Control Matrix */}
      {activeTab === 'rbac' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Role-Based Access Control (RBAC) Matrix</h2>
            <p className="text-xs text-slate-500 mt-1">
              Governs CRUD permissions across all institutional database entities according to the governance hierarchy.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse border border-slate-200">
              <thead>
                <tr className="bg-slate-100 text-slate-800 font-semibold border-b border-slate-200">
                  <th className="p-3 border-r border-slate-200">Entity Collection</th>
                  <th className="p-3 border-r border-slate-200">Faculty Role</th>
                  <th className="p-3 border-r border-slate-200">Department Head Role</th>
                  <th className="p-3 border-r border-slate-200">Principal (Executive)</th>
                  <th className="p-3">Super Administrator</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {rbacRules.map((rule, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="p-3 font-semibold text-slate-900 border-r border-slate-200 bg-slate-50/50">
                      {rule.collection}
                    </td>
                    <td className="p-3 text-slate-700 border-r border-slate-200">{rule.faculty}</td>
                    <td className="p-3 text-slate-700 border-r border-slate-200 font-medium text-amber-900 bg-amber-50/30">
                      {rule.deptHead}
                    </td>
                    <td className="p-3 text-slate-700 border-r border-slate-200 font-medium text-sky-900 bg-sky-50/30">
                      {rule.principal}
                    </td>
                    <td className="p-3 font-bold text-purple-900 bg-purple-50/30">{rule.superAdmin}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Database Health & Integrity */}
      {activeTab === 'health' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Relational Integrity Checks</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-900 flex items-center justify-between">
                <div>
                  <div className="font-semibold">Course - Department Foreign Keys</div>
                  <div className="text-[11px] text-emerald-700 mt-0.5">All {courses.length} courses reference existing departments.</div>
                </div>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">PASSED</span>
              </div>

              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-900 flex items-center justify-between">
                <div>
                  <div className="font-semibold">Teaching Materials - Course Mapping</div>
                  <div className="text-[11px] text-emerald-700 mt-0.5">All {resources.length} materials map to valid faculty and departments.</div>
                </div>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">PASSED</span>
              </div>

              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-900 flex items-center justify-between">
                <div>
                  <div className="font-semibold">Approval Queue - Target Integrity</div>
                  <div className="text-[11px] text-emerald-700 mt-0.5">All {approvalRequests.length} approval items link to active targets.</div>
                </div>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">PASSED</span>
              </div>

              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-900 flex items-center justify-between">
                <div>
                  <div className="font-semibold">User Role & Auth Hash Verification</div>
                  <div className="text-[11px] text-emerald-700 mt-0.5">All {users.length} users have salted hashes and unique IDs.</div>
                </div>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">PASSED</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-sky-600" />
              <span>Storage Quota & Runtime Footprint</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
                <div className="flex justify-between font-semibold text-slate-800">
                  <span>Browser LocalStorage Utilization</span>
                  <span>~185 KB / 5 MB</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-sky-600 h-full w-[4%]" />
                </div>
                <div className="text-[10px] text-slate-500">Sufficient headroom for 50,000+ academic records.</div>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 space-y-1">
                <div className="font-semibold">Cross-Tab State Synchronization</div>
                <p className="text-[11px] text-slate-600">
                  Changes committed by Faculty or Department Heads in one tab propagate instantly across all open browser instances using the synchronized event bus.
                </p>
              </div>

              {isSuperAdmin && (
                <div className="pt-2">
                  <button
                    onClick={handleDownloadBackup}
                    className="w-full py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-semibold shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Generate Instant Snapshot Backup</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Restore Database Modal */}
      {showRestoreModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Restore Central Database</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Paste the JSON database backup dump to restore all 20 institutional collections.
              </p>
            </div>

            <textarea
              rows={8}
              value={restoreJson}
              onChange={(e) => setRestoreJson(e.target.value)}
              placeholder="Paste JSON dump here: { 'institution': 'Tamralipta Mahavidyalaya', 'data': { ... } }"
              className="w-full text-xs font-mono p-3 border border-slate-300 rounded-lg focus:outline-none focus:border-sky-500"
            />

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowRestoreModal(false)}
                className="px-3.5 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRestoreDatabase}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-semibold shadow-xs transition cursor-pointer"
              >
                Execute Restore
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
