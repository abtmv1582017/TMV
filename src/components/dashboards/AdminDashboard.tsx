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
  Download,
  CheckCircle2,
  Clock,
  Bell,
  Check,
  RotateCcw,
  Plus
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
    announcements,
    approvalRequests,
    institutionalDocs,
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

  const pendingApprovalsCount = approvalRequests.filter((r) => r.status === 'pending').length;

  const filteredDepts =
    selectedDeptFilter === 'all'
      ? departments
      : departments.filter((d) => d.id === selectedDeptFilter);

  // NAAC Compliance quick metrics
  const studentFacultyRatio = (totalStudents / Math.max(1, totalFaculty)).toFixed(1);
  const digitalResourceAdoption = `${Math.round((resources.length / Math.max(1, totalCourses)) * 10)}%`;

  return (
    <div className="space-y-6">
      {/* Principal Executive Institutional Banner */}
      <div className="bg-gradient-to-r from-[#0f2942] via-[#14324f] to-[#1e3a8a] text-white rounded-2xl p-6 shadow-xl border border-sky-900/60">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-sky-300">
              <Building2 className="w-4 h-4 text-sky-400" />
              <span>Office of the Principal & Chief Executive</span>
              <span aria-hidden="true">·</span>
              <span>{settings.affiliation}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold mt-1 tracking-tight">
              {language === 'bn' ? settings.collegeBengaliName : settings.collegeName}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Institutional Academic Operations, Statutory Compliance Oversight (NAAC 'A' Grade), Departmental Benchmarking, and Official College Communications.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <button
              onClick={() => setActiveTab('documents')}
              className="bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold px-3.5 py-2.5 rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>Official Documents</span>
            </button>
            <button
              onClick={() => setActiveTab('approvals')}
              className="relative bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold px-3.5 py-2.5 rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer"
            >
              <Clock className="w-4 h-4" />
              <span>Approval Desk</span>
              {pendingApprovalsCount > 0 && (
                <span className="bg-white text-amber-900 font-bold px-1.5 py-0.2 rounded-full text-[10px]">
                  {pendingApprovalsCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className="bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-3.5 py-2.5 rounded-xl border border-white/20 transition flex items-center gap-2 cursor-pointer"
            >
              <BarChart3 className="w-4 h-4" />
              <span>Compliance Packs</span>
            </button>
          </div>
        </div>
      </div>

      {/* Institutional Key Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Enrolled Students</span>
            <GraduationCap className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">{totalStudents}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Undergraduate & PG</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Faculty Members</span>
            <Users className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">{totalFaculty}</div>
          <div className="text-[11px] text-emerald-700 font-medium mt-0.5">Ratio 1:{studentFacultyRatio}</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Academic Depts</span>
            <Building2 className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-bold text-indigo-700 mt-2">{totalDepts}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Arts, Science, Commerce</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Active Courses</span>
            <BookOpen className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-purple-700 mt-2">{totalCourses}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">CBCS / NEP Syllabus</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Gazetted Docs</span>
            <FileText className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-amber-700 mt-2">{institutionalDocs.length}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Official Circulars</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Pending Approvals</span>
            <Clock className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-bold text-rose-600 mt-2">{pendingApprovalsCount}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Need Executive Action</div>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 8 Cols: Department Performance & Oversight */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Inter-Departmental Performance & Syllabus Monitoring
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Academic coordination across Arts, Science and Commerce departments
                </p>
              </div>

              <select
                value={selectedDeptFilter}
                onChange={(e) => setSelectedDeptFilter(e.target.value)}
                className="text-xs px-3 py-1.5 border border-slate-200 rounded-lg bg-white text-slate-700 focus:outline-none focus:border-sky-500"
              >
                <option value="all">All Departments ({departments.length})</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredDepts.map((dept) => {
                const deptCoursesList = courses.filter((c) => c.departmentId === dept.id);
                const deptStudentsList = users.filter((u) => u.role === 'student' && u.departmentId === dept.id);
                const deptFacultyList = users.filter((u) => (u.role === 'faculty' || u.role === 'dept_head') && u.departmentId === dept.id);
                const deptResourcesList = resources.filter((r) => r.departmentId === dept.id);

                return (
                  <div
                    key={dept.id}
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:border-slate-300 transition space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-bold text-sky-800 bg-sky-100 px-2 py-0.5 rounded">
                          {dept.code} Department
                        </span>
                        <h3 className="font-bold text-sm text-slate-900 mt-1">{dept.name}</h3>
                        <p className="text-xs text-slate-500 font-serif">{dept.nameBengali}</p>
                      </div>
                      <span className="text-xs font-semibold text-slate-600">
                        HOD: {dept.headFacultyName?.split(' ')[1] || 'Designated'}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center text-xs py-2 bg-white rounded-lg border border-slate-100">
                      <div>
                        <div className="font-bold text-slate-900">{deptCoursesList.length}</div>
                        <div className="text-[10px] text-slate-400">Courses</div>
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">{deptStudentsList.length}</div>
                        <div className="text-[10px] text-slate-400">Students</div>
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">{deptResourcesList.length}</div>
                        <div className="text-[10px] text-slate-400">Materials</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1">
                      <span className="text-emerald-700 font-semibold text-[11px]">
                        ✓ Syllabus on schedule (82%)
                      </span>
                      <button
                        onClick={() => setActiveTab('reports')}
                        className="text-sky-700 hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <span>Audit Pack</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Pending Approval Requests Panel */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-600" />
                Departmental Approval Requests Requiring Oversight
              </h3>
              <button
                onClick={() => setActiveTab('approvals')}
                className="text-xs text-sky-700 hover:underline font-semibold"
              >
                Go to Approvals Desk →
              </button>
            </div>

            <div className="space-y-2">
              {approvalRequests.slice(0, 3).map((req) => (
                <div
                  key={req.id}
                  className="p-3 rounded-lg border border-slate-100 bg-slate-50 flex items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="font-bold text-slate-900">{req.title}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Submitted by: <strong>{req.submittedByName}</strong> · {req.submittedAt}
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      req.status === 'pending'
                        ? 'bg-amber-100 text-amber-800'
                        : req.status === 'approved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {req.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 4 Cols: Official Circulars & NAAC / NIRF Compliance */}
        <div className="lg:col-span-4 space-y-6">
          {/* Institutional Official Repository Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-sky-700" />
                Official Gazette Repository
              </h3>
              <button
                onClick={() => setActiveTab('documents')}
                className="text-xs text-sky-700 hover:underline font-semibold"
              >
                Manage All →
              </button>
            </div>

            <div className="space-y-2 text-xs">
              {institutionalDocs.slice(0, 4).map((doc) => (
                <div key={doc.id} className="p-2.5 bg-slate-50 border border-slate-100 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 truncate max-w-[200px]">
                      {doc.title}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      v{doc.version}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1 flex justify-between items-center">
                    <span className="capitalize">{doc.category.replace(/_/g, ' ')}</span>
                    <span className="text-emerald-700 font-semibold">{doc.fileSize}</span>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setActiveTab('documents')}
              className="w-full py-2 bg-sky-50 hover:bg-sky-100 text-sky-800 font-semibold rounded-lg text-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Publish New Circular</span>
            </button>
          </div>

          {/* NAAC & University Regulatory Metrics */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Statutory Accreditation Dossier
            </h3>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                <span className="font-semibold text-slate-800 block">Criterion 1: Curricular Aspects</span>
                <p className="text-[11px] text-slate-500 mt-0.5">Choice Based Credit System (CBCS) & NEP 2020 syllabi mapped for 100% active programs.</p>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                <span className="font-semibold text-slate-800 block">Criterion 2: Teaching & Evaluation</span>
                <p className="text-[11px] text-slate-500 mt-0.5">Continuous Internal Assessments (CIA) logged with student-wise digital scorecards.</p>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                <span className="font-semibold text-slate-800 block">75% Attendance Compliance</span>
                <p className="text-[11px] text-slate-500 mt-0.5">Automated condonation review lists generated for Vidyasagar University examinations.</p>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('reports')}
              className="w-full py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold rounded-lg text-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export NAAC Audit Pack (PDF)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
