import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  GraduationCap,
  Building2,
  BookOpen,
  FileText,
  BarChart3,
  Layers,
  Settings,
  ShieldAlert,
  ArrowUpRight,
  Database,
  FileCheck,
  Download
} from 'lucide-react';
import { StorageService } from '../../services/storage';

export const AdminDashboard: React.FC = () => {
  const {
    currentUser,
    departments,
    courses,
    users,
    resources,
    assignments,
    submissions,
    auditLogs,
    settings,
    setActiveTab,
    language
  } = useApp();

  const [selectedDeptFilter, setSelectedDeptFilter] = useState<string>('all');

  const totalStudents = users.filter((u) => u.role === 'student').length;
  const totalFaculty = users.filter((u) => u.role === 'faculty' || u.role === 'dept_head').length;
  const totalDepts = departments.length;
  const totalCourses = courses.length;

  const filteredDepts =
    selectedDeptFilter === 'all'
      ? departments
      : departments.filter((d) => d.id === selectedDeptFilter);

  const handleExportBackup = () => {
    const backupJson = StorageService.exportDatabaseBackup();
    const blob = new Blob([backupJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tamralipta_lms_backup_${new Date().toISOString().substring(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Institutional Header Banner */}
      <div className="bg-gradient-to-r from-[#0f2942] to-[#1e3a8a] text-white rounded-2xl p-6 shadow-md border border-[#274f75]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-sky-300">
              <span>{settings.affiliation}</span>
              <span aria-hidden="true">·</span>
              <span>{settings.naacGrade}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold mt-1 tracking-tight">
              {language === 'bn' ? settings.collegeBengaliName : settings.collegeName}
            </h1>
            <p className="text-sm text-slate-300 mt-1">
              Institutional Governance & Academic Administration Portal · Session: 2025-2026
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <button
              onClick={() => setActiveTab('reports')}
              className="bg-sky-500 hover:bg-sky-400 text-white text-xs font-semibold px-3.5 py-2.5 rounded-lg shadow transition flex items-center gap-2"
            >
              <BarChart3 className="w-4 h-4" />
              <span>Academic Reports</span>
            </button>
            <button
              onClick={() => setActiveTab('structure')}
              className="bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-3.5 py-2.5 rounded-lg border border-white/20 transition flex items-center gap-2"
            >
              <Layers className="w-4 h-4" />
              <span>Academic Structure</span>
            </button>
            <button
              onClick={handleExportBackup}
              className="bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-3.5 py-2.5 rounded-lg border border-white/20 transition flex items-center gap-2"
              title="Download full LMS database state JSON"
            >
              <Download className="w-4 h-4" />
              <span>Database Backup</span>
            </button>
          </div>
        </div>
      </div>

      {/* Institutional Key Performance Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Departments</span>
            <Building2 className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">{totalDepts}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Arts, Science, Commerce</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Registered Students</span>
            <GraduationCap className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">{totalStudents}</div>
          <div className="text-[11px] text-emerald-600 mt-0.5 font-medium">Active Enrollees</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Faculty Members</span>
            <Users className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">{totalFaculty}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Professors & Lecturers</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Active Courses</span>
            <BookOpen className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">{totalCourses}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">CBCS Modules</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Learning Files</span>
            <FileText className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">{resources.length}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">PDFs, Manuals, Slides</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Submissions</span>
            <FileCheck className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">{submissions.length}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">{assignments.length} Assignments</div>
        </div>
      </div>

      {/* Main Grid: Departments Breakdown & Recent Audit Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Departments Breakdown */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  {language === 'bn' ? 'বিভাগীয় বিবরণ ও সক্ষমতা' : 'Academic Departments Overview'}
                </h2>
                <p className="text-xs text-slate-500">Student enrollment, faculty strength & HOD leadership</p>
              </div>

              <select
                value={selectedDeptFilter}
                onChange={(e) => setSelectedDeptFilter(e.target.value)}
                className="text-xs border border-slate-300 rounded-lg px-2.5 py-1.5 bg-white text-slate-700"
              >
                <option value="all">All Departments ({departments.length})</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left text-slate-700">
                <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Department</th>
                    <th className="py-2.5 px-3">HOD / In-Charge</th>
                    <th className="py-2.5 px-3 text-center">Faculty</th>
                    <th className="py-2.5 px-3 text-center">Students</th>
                    <th className="py-2.5 px-3 text-right">Courses Active</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredDepts.map((dept) => {
                    const deptCourses = courses.filter((c) => c.departmentId === dept.id);
                    return (
                      <tr key={dept.id} className="hover:bg-slate-50/70 transition">
                        <td className="py-3 px-3 font-semibold text-slate-900">
                          <div>{dept.name}</div>
                          <div className="text-[11px] text-slate-500 font-normal">
                            Code: <span className="font-mono">{dept.code}</span> · {dept.nameBengali}
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <span className="font-medium text-slate-800">{dept.headFacultyName}</span>
                        </td>
                        <td className="py-3 px-3 text-center font-medium">
                          {dept.totalFaculty}
                        </td>
                        <td className="py-3 px-3 text-center font-medium">
                          {dept.totalStudents}
                        </td>
                        <td className="py-3 px-3 text-right font-mono font-semibold text-sky-700">
                          {deptCourses.length}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Action Matrix for Institutional Admins */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button
              onClick={() => setActiveTab('structure')}
              className="bg-white p-4 rounded-xl border border-slate-200 hover:border-sky-400 hover:shadow-xs transition text-left group"
            >
              <Layers className="w-5 h-5 text-sky-600 mb-2 group-hover:scale-110 transition" />
              <div className="font-bold text-slate-900 text-sm">Academic Structure</div>
              <p className="text-xs text-slate-500 mt-1">Configure Sessions, Programmes & Semesters</p>
            </button>

            <button
              onClick={() => setActiveTab('users')}
              className="bg-white p-4 rounded-xl border border-slate-200 hover:border-sky-400 hover:shadow-xs transition text-left group"
            >
              <Users className="w-5 h-5 text-indigo-600 mb-2 group-hover:scale-110 transition" />
              <div className="font-bold text-slate-900 text-sm">User Directory</div>
              <p className="text-xs text-slate-500 mt-1">Student, Faculty & Staff Account Management</p>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className="bg-white p-4 rounded-xl border border-slate-200 hover:border-sky-400 hover:shadow-xs transition text-left group"
            >
              <Settings className="w-5 h-5 text-amber-600 mb-2 group-hover:scale-110 transition" />
              <div className="font-bold text-slate-900 text-sm">Institutional Setup</div>
              <p className="text-xs text-slate-500 mt-1">College branding, grading policy & backup</p>
            </button>
          </div>
        </div>

        {/* Right Col: System Health & Audit Trail */}
        <div className="space-y-6">
          {/* Institutional Compliance & Audit Trail */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-sky-700" />
                <span>Recent System Audit Trail</span>
              </h2>
              <button
                onClick={() => setActiveTab('audit')}
                className="text-xs text-sky-700 hover:text-sky-900 font-semibold"
              >
                Full Log →
              </button>
            </div>

            <div className="space-y-3">
              {auditLogs.slice(0, 5).map((log) => (
                <div key={log.id} className="p-2.5 rounded-lg border border-slate-100 bg-slate-50/70 text-xs">
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span className="font-semibold text-slate-800">{log.userName}</span>
                    <span className="font-mono text-[10px]">{log.timestamp.substring(11, 16)}</span>
                  </div>
                  <div className="font-mono text-[11px] text-sky-800 font-semibold mt-0.5">
                    {log.action}
                  </div>
                  <p className="text-[11px] text-slate-600 mt-0.5 line-clamp-1">
                    {log.details}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Notice Dispatcher */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <h2 className="text-sm font-bold text-slate-900 mb-2">Publish College Circular</h2>
            <p className="text-xs text-slate-500 mb-3">
              Broadcast official administrative or examination directives to all departments.
            </p>
            <button
              onClick={() => setActiveTab('announcements')}
              className="w-full py-2 bg-[#0f2942] hover:bg-[#1a3d5e] text-white rounded-lg text-xs font-semibold transition"
            >
              Open Notice Center →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
