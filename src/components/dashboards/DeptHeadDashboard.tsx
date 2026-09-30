import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  BookOpen,
  FileCheck,
  Award,
  Clock,
  Layers,
  CheckCircle2,
  ChevronRight,
  Upload,
  Calendar,
  Bell,
  Check,
  RotateCcw,
  MessageSquare,
  AlertTriangle,
  FileText,
  Sliders,
  Send,
  UserCheck
} from 'lucide-react';

export const DeptHeadDashboard: React.FC = () => {
  const {
    currentUser,
    departments,
    courses,
    users,
    assignments,
    submissions,
    resources,
    approvalRequests,
    reviewApprovalRequest,
    classSwaps,
    reviewClassSwap,
    announcements,
    publishAnnouncement,
    setActiveTab,
    setSelectedCourseId,
    language
  } = useApp();

  const [activeTabSub, setActiveTabSub] = useState<'overview' | 'approvals' | 'faculty' | 'workload' | 'notices'>('overview');
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeContent, setNoticeContent] = useState('');
  const [noticePriority, setNoticePriority] = useState<'normal' | 'urgent'>('normal');

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
  const deptResources = resources.filter((r) => r.departmentId === myDept.id);

  // Department specific approval requests
  const deptApprovalRequests = approvalRequests.filter(
    (r) => r.departmentId === myDept.id || !r.departmentId
  );
  const pendingApprovals = deptApprovalRequests.filter((r) => r.status === 'pending');

  // Department class swap requests
  const deptClassSwaps = classSwaps.filter((s) => s.departmentId === myDept.id);

  const handlePostDeptNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeTitle.trim() || !noticeContent.trim()) return;

    publishAnnouncement({
      title: noticeTitle.trim(),
      content: noticeContent.trim(),
      authorName: currentUser.name,
      authorRole: 'Head of Department',
      targetAudience: 'department',
      departmentId: myDept.id,
      priority: noticePriority
    });

    setNoticeTitle('');
    setNoticeContent('');
    alert('Department circular published successfully to all faculty and students in ' + myDept.name);
  };

  return (
    <div className="space-y-6">
      {/* Department Head Welcome Banner */}
      <div className="bg-gradient-to-r from-[#0f2942] to-[#1e3a8a] text-white rounded-2xl p-6 shadow-md border border-[#274f75]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-sky-300">
              <span>Departmental Leadership & Academic Coordination</span>
              <span aria-hidden="true">·</span>
              <span>{myDept.code} Department</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold mt-1 tracking-tight">
              {language === 'bn' ? myDept.nameBengali : myDept.name}
            </h1>
            <p className="text-sm text-slate-300 mt-1">
              Head of Department: {currentUser.name} · Session 2025-2026 · {deptFaculty.length} Faculty Members · {deptCourses.length} Assigned Papers
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <button
              onClick={() => setActiveTab('approvals')}
              className="relative bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow transition flex items-center gap-2 cursor-pointer"
            >
              <Clock className="w-4 h-4" />
              <span>Approval Desk</span>
              {pendingApprovals.length > 0 && (
                <span className="bg-white text-amber-900 font-bold px-1.5 py-0.2 rounded-full text-[10px]">
                  {pendingApprovals.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('courses')}
              className="bg-sky-500 hover:bg-sky-400 text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow transition flex items-center gap-2 cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              <span>Courses & Syllabi</span>
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className="bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-4 py-2.5 rounded-lg border border-white/20 transition flex items-center gap-2 cursor-pointer"
            >
              <Award className="w-4 h-4" />
              <span>Marks Moderation</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metric Cards Grid */}
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
          <div className="text-[11px] text-slate-500 mt-0.5">CBCS & NEP Curriculum</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Enrolled Students</span>
            <Users className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">{myDept.totalStudents}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Semesters 1, 3, 5</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Pending Approvals</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-amber-600 mt-2">{pendingApprovals.length}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Materials & Class Swaps</div>
        </div>
      </div>

      {/* Department Coordination Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 8 Cols: Material Approval Queue & Faculty Workload Coordination */}
        <div className="lg:col-span-8 space-y-6">
          {/* Approval Queue Section */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-600" />
                <h2 className="text-sm font-bold text-slate-900">
                  Departmental Resource & Class Swap Approval Queue
                </h2>
              </div>
              <button
                onClick={() => setActiveTab('approvals')}
                className="text-xs text-sky-700 hover:underline font-semibold"
              >
                Open Full Approval Desk →
              </button>
            </div>

            {pendingApprovals.length === 0 ? (
              <div className="p-6 text-center text-slate-500 text-xs bg-slate-50 rounded-xl">
                <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto mb-1.5" />
                <span>All faculty teaching materials and class swaps in {myDept.code} have been reviewed.</span>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingApprovals.map((req) => (
                  <div
                    key={req.id}
                    className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{req.title}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 uppercase">
                          {req.type.replace(/_/g, ' ')}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-1">{req.details}</p>
                      <div className="text-[10px] text-slate-400 mt-1">
                        Submitted by: <strong>{req.submittedByName}</strong> · {req.submittedAt}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto flex-shrink-0">
                      <button
                        onClick={() => reviewApprovalRequest(req.id, 'approved', 'Authorized by HOD ' + currentUser.name)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1 cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Approve</span>
                      </button>
                      <button
                        onClick={() => setActiveTab('approvals')}
                        className="px-3 py-1.5 bg-white text-rose-700 border border-rose-200 hover:bg-rose-50 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Return for Note</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Faculty Workload & Course Allocation */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">
                Departmental Faculty Workload & Assigned Papers
              </h3>
              <span className="text-xs text-slate-500">UGC Norm: 16 Contact Hours/Week</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="p-2.5">Faculty Member</th>
                    <th className="p-2.5">Designation</th>
                    <th className="p-2.5">Assigned Courses</th>
                    <th className="p-2.5">Syllabus Progress</th>
                    <th className="p-2.5">Pending Grading</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-[11px]">
                  {deptFaculty.map((f) => {
                    const assignedList = deptCourses.filter((c) => c.facultyId === f.id);
                    const pendingGradingCount = submissions.filter(
                      (s) => assignedList.map((c) => c.id).includes(s.courseId) && s.status === 'submitted'
                    ).length;

                    return (
                      <tr key={f.id} className="hover:bg-slate-50/70">
                        <td className="p-2.5 font-semibold text-slate-900">{f.name}</td>
                        <td className="p-2.5 text-slate-600">{f.designation || 'Faculty Member'}</td>
                        <td className="p-2.5">
                          {assignedList.map((c) => (
                            <span key={c.id} className="inline-block px-1.5 py-0.5 rounded bg-sky-50 text-sky-800 font-mono text-[10px] mr-1">
                              {c.code}
                            </span>
                          ))}
                        </td>
                        <td className="p-2.5">
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-slate-200 rounded-full h-1.5 overflow-hidden">
                              <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: '85%' }} />
                            </div>
                            <span className="text-slate-500 text-[10px]">85%</span>
                          </div>
                        </td>
                        <td className="p-2.5 font-bold">
                          {pendingGradingCount > 0 ? (
                            <span className="text-amber-600">{pendingGradingCount} Pending</span>
                          ) : (
                            <span className="text-emerald-600">✓ Up to Date</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right 4 Cols: Departmental Notices & Class Swaps */}
        <div className="lg:col-span-4 space-y-6">
          {/* Post Department Notice */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
              <Bell className="w-4 h-4 text-sky-600" />
              Publish Department Notice
            </h3>

            <form onSubmit={handlePostDeptNotice} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Notice Title:</label>
                <input
                  type="text"
                  required
                  value={noticeTitle}
                  onChange={(e) => setNoticeTitle(e.target.value)}
                  placeholder="e.g. Lab Viva Schedule for Semester 3"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Notice Content:</label>
                <textarea
                  rows={3}
                  required
                  value={noticeContent}
                  onChange={(e) => setNoticeContent(e.target.value)}
                  placeholder="Details of laboratory examination, date, room allocation..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={noticePriority === 'urgent'}
                    onChange={(e) => setNoticePriority(e.target.checked ? 'urgent' : 'normal')}
                    className="rounded text-rose-600"
                  />
                  <span className="text-[11px] text-slate-700 font-semibold">Priority Alert</span>
                </label>

                <button
                  type="submit"
                  className="px-4 py-2 bg-sky-700 hover:bg-sky-800 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Broadcast</span>
                </button>
              </div>
            </form>
          </div>

          {/* Class Swaps Overview */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-600" />
              Recent Lecture Exchange Records
            </h3>

            {deptClassSwaps.length === 0 ? (
              <p className="text-xs text-slate-500 py-3 text-center">No class swap requests registered.</p>
            ) : (
              <div className="space-y-2 text-xs">
                {deptClassSwaps.map((s) => (
                  <div key={s.id} className="p-2.5 bg-slate-50 border border-slate-100 rounded-lg space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{s.courseTitle}</span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded uppercase bg-amber-100 text-amber-800">
                        {s.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600">
                      <strong>{s.requesterFacultyName}</strong> ↔ <strong>{s.targetFacultyName}</strong>
                    </p>
                    <p className="text-[10px] text-slate-400">
                      Date: {s.originalDate} ({s.originalTimeSlot})
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
