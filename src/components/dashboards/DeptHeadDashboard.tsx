import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  BookOpen,
  FileCheck,
  Award,
  Clock,
  Layers,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';

export const DeptHeadDashboard: React.FC = () => {
  const {
    currentUser,
    departments,
    courses,
    users,
    assignments,
    submissions,
    setActiveTab,
    setSelectedCourseId,
    language
  } = useApp();

  const myDept = departments.find((d) => d.id === (currentUser.departmentId || 'dept-cs')) || departments[0];
  const deptCourses = courses.filter((c) => c.departmentId === myDept.id);
  const deptFaculty = users.filter(
    (u) => (u.role === 'faculty' || u.role === 'dept_head') && u.departmentId === myDept.id
  );
  const deptStudents = users.filter(
    (u) => u.role === 'student' && u.departmentId === myDept.id
  );

  const deptCourseIds = deptCourses.map((c) => c.id);
  const deptAssignments = assignments.filter((a) => deptCourseIds.includes(a.courseId));
  const deptSubmissions = submissions.filter((s) => deptCourseIds.includes(s.courseId));
  const pendingSubmissions = deptSubmissions.filter((s) => s.status === 'submitted');

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-[#0f2942] to-[#1e3a8a] text-white rounded-2xl p-6 shadow-md border border-[#274f75]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-sky-300">
              <span>Departmental Leadership</span>
              <span aria-hidden="true">·</span>
              <span>{myDept.code} Department</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold mt-1 tracking-tight">
              {language === 'bn' ? myDept.nameBengali : myDept.name}
            </h1>
            <p className="text-sm text-slate-300 mt-1">
              Head of Department: {currentUser.name} · Session 2025-2026
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('courses')}
              className="bg-sky-500 hover:bg-sky-400 text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow transition"
            >
              Add Course +
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className="bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-4 py-2.5 rounded-lg border border-white/20 transition"
            >
              Dept Analytics
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Faculty Members</span>
            <Users className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">{deptFaculty.length}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">{myDept.totalFaculty} Total Posts</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Active Courses</span>
            <BookOpen className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">{deptCourses.length}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">CBCS Curriculum</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Enrolled Students</span>
            <Users className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">{myDept.totalStudents}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Honours Enrolment</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Pending Evaluations</span>
            <FileCheck className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-amber-600 mt-2">{pendingSubmissions.length}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Awaiting teacher feedback</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <h2 className="text-base font-bold text-slate-900 mb-3">Department Courses & Syllabus Delivery</h2>
          <div className="space-y-3">
            {deptCourses.map((c) => (
              <div
                key={c.id}
                onClick={() => {
                  setSelectedCourseId(c.id);
                  setActiveTab('courses');
                }}
                className="p-3 border border-slate-200 rounded-lg hover:border-sky-300 transition cursor-pointer flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-semibold text-slate-900 text-sm">
                    {c.code}: {c.title}
                  </div>
                  <div className="text-slate-500 mt-0.5">
                    Faculty In-Charge: <span className="font-medium text-slate-700">{c.facultyName}</span> · {c.totalEnrolled} Students
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sky-700 font-semibold">
                  <span>{c.units.length} Units</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <h2 className="text-sm font-bold text-slate-900 mb-3">Department Faculty Members</h2>
          <div className="space-y-3">
            {deptFaculty.map((f) => (
              <div key={f.id} className="p-3 rounded-lg border border-slate-100 bg-slate-50/50 text-xs">
                <div className="font-semibold text-slate-900">{f.name}</div>
                <div className="text-[11px] text-slate-500">{f.email}</div>
                <div className="text-[10px] text-sky-800 font-mono mt-1">
                  ID: {f.employeeId || 'TM-FAC-014'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
