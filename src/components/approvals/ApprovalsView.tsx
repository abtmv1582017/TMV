import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ApprovalRequest } from '../../types';
import {
  CheckCircle2,
  XCircle,
  RotateCcw,
  Clock,
  Filter,
  FileText,
  Users,
  Building2,
  AlertCircle,
  MessageSquare,
  Search,
  Check,
  Calendar,
  Layers,
  Award,
  Shield,
  ArrowRight,
  Plus,
  HelpCircle,
  CheckSquare
} from 'lucide-react';

export const ApprovalsView: React.FC = () => {
  const {
    currentUser,
    approvalRequests,
    reviewApprovalRequest,
    classSwaps,
    reviewClassSwap,
    requestClassSwap,
    courses,
    users,
    departments,
    language
  } = useApp();

  const isFaculty = currentUser.role === 'faculty';
  const isDeptHead = currentUser.role === 'dept_head';
  const isPrincipal = currentUser.role === 'principal';
  const isSuperAdmin = currentUser.role === 'super_admin';

  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [activeQueueTab, setActiveQueueTab] = useState<'queue' | 'my_submissions' | 'hierarchy_guide'>(
    isFaculty ? 'my_submissions' : 'queue'
  );
  const [search, setSearch] = useState('');

  // Class swap modal state
  const [showSwapModal, setShowSwapModal] = useState(false);
  const [swapTargetFacultyId, setSwapTargetFacultyId] = useState('');
  const [swapCourseId, setSwapCourseId] = useState('');
  const [swapOriginalDate, setSwapOriginalDate] = useState('');
  const [swapOriginalTime, setSwapOriginalTime] = useState('11:00 AM - 12:00 PM');
  const [swapDate, setSwapDate] = useState('');
  const [swapTime, setSwapTime] = useState('02:00 PM - 03:00 PM');
  const [swapReason, setSwapReason] = useState('');

  // Return for correction modal state
  const [activeReqForReturn, setActiveReqForReturn] = useState<ApprovalRequest | null>(null);
  const [returnFeedback, setReturnFeedback] = useState('');

  // Available faculty in department for class swap
  const departmentFaculty = users.filter(
    (u) =>
      (u.role === 'faculty' || u.role === 'dept_head') &&
      u.departmentId === currentUser.departmentId &&
      u.id !== currentUser.id
  );

  const facultyCourses = courses.filter(
    (c) => c.facultyId === currentUser.id || currentUser.assignedCourseIds?.includes(c.id)
  );

  // Filter requests based on user role and queue tab
  const filteredRequests = approvalRequests.filter((req) => {
    // If viewing 'my_submissions'
    if (activeQueueTab === 'my_submissions') {
      if (req.submittedBy !== currentUser.id) return false;
    } else {
      // Viewing incoming queue
      if (isDeptHead) {
        if (req.departmentId && req.departmentId !== currentUser.departmentId) return false;
      }
    }

    const matchesType = filterType === 'all' || req.type === filterType;
    const matchesStatus = filterStatus === 'all' || req.status === filterStatus;
    const matchesSearch =
      req.title.toLowerCase().includes(search.toLowerCase()) ||
      req.submittedByName.toLowerCase().includes(search.toLowerCase()) ||
      req.details.toLowerCase().includes(search.toLowerCase());

    return matchesType && matchesStatus && matchesSearch;
  });

  const pendingCount = approvalRequests.filter((r) => {
    if (r.status !== 'pending') return false;
    if (isDeptHead) return !r.departmentId || r.departmentId === currentUser.departmentId;
    return true;
  }).length;

  const mySubmissionsPending = approvalRequests.filter(
    (r) => r.submittedBy === currentUser.id && r.status === 'pending'
  ).length;

  const handleApprove = (req: ApprovalRequest) => {
    const approverTitle = isDeptHead ? 'Department Head' : isPrincipal ? 'Principal' : 'Super Administrator';
    reviewApprovalRequest(req.id, 'approved', `Approved and ratified by ${approverTitle} (${currentUser.name})`);
    if (req.type === 'class_swap') {
      reviewClassSwap(req.targetId, 'approved', `Sanctioned by ${approverTitle} (${currentUser.name})`);
    }
  };

  const handleConfirmReturn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeReqForReturn || !returnFeedback.trim()) return;

    reviewApprovalRequest(activeReqForReturn.id, 'returned_for_correction', returnFeedback.trim());
    if (activeReqForReturn.type === 'class_swap') {
      reviewClassSwap(activeReqForReturn.targetId, 'rejected', returnFeedback.trim());
    }

    setActiveReqForReturn(null);
    setReturnFeedback('');
  };

  const handleCreateClassSwap = (e: React.FormEvent) => {
    e.preventDefault();
    const selCourse = courses.find((c) => c.id === swapCourseId) || facultyCourses[0];
    const targetFac = users.find((u) => u.id === swapTargetFacultyId) || departmentFaculty[0];

    if (!selCourse || !targetFac) {
      alert('Please select both a course and a target colleague faculty member.');
      return;
    }

    requestClassSwap({
      departmentId: currentUser.departmentId || selCourse.departmentId,
      requesterFacultyId: currentUser.id,
      requesterFacultyName: currentUser.name,
      targetFacultyId: targetFac.id,
      targetFacultyName: targetFac.name,
      courseId: selCourse.id,
      courseTitle: `${selCourse.code}: ${selCourse.title}`,
      originalDate: swapOriginalDate || new Date().toISOString().substring(0, 10),
      originalTimeSlot: swapOriginalTime,
      swapDate: swapDate || new Date().toISOString().substring(0, 10),
      swapTimeSlot: swapTime,
      reason: swapReason || 'Mutual academic lecture rescheduling'
    });

    setShowSwapModal(false);
    setSwapReason('');
    alert('Class swap request submitted to Department Head for academic coordination approval.');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#0f2942] to-[#1e3a8a] text-white rounded-2xl p-6 shadow-md border border-[#274f75]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-sky-300">
              <CheckSquare className="w-4 h-4 text-sky-400" />
              <span>Multi-Tier Academic Governance & Approval Queue</span>
              <span aria-hidden="true">·</span>
              <span>
                {isFaculty
                  ? 'Faculty Submission & Tracking'
                  : isDeptHead
                  ? 'Department Head Academic Coordination Desk'
                  : isPrincipal
                  ? 'Office of the Principal (Executive Approval Desk)'
                  : 'Technical Control & Workflow Oversight'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold mt-1 tracking-tight">
              Institutional Approval & Review Hierarchy
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Transparent multi-level approval workflow: Faculty independently initiate materials & swaps, Department Heads coordinate academic schedules, the Principal ratifies institutional directives, and the Super Admin maintains system integrity.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {isFaculty && (
              <button
                onClick={() => setShowSwapModal(true)}
                className="bg-sky-500 hover:bg-sky-400 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Request Class Swap</span>
              </button>
            )}

            <div className="flex items-center gap-3 bg-white/10 px-4 py-2.5 rounded-xl border border-white/20">
              <Clock className="w-5 h-5 text-amber-300" />
              <div>
                <div className="text-lg font-bold text-white">
                  {isFaculty ? mySubmissionsPending : pendingCount}
                </div>
                <div className="text-[10px] text-slate-300 uppercase">
                  {isFaculty ? 'My Pending' : 'Queue Pending'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Queue Navigation Tabs */}
        <div className="mt-5 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center bg-black/30 p-1 rounded-xl border border-white/10 text-xs">
            {!isFaculty && (
              <button
                onClick={() => setActiveQueueTab('queue')}
                className={`px-3.5 py-1.5 rounded-lg font-semibold transition flex items-center gap-2 ${
                  activeQueueTab === 'queue'
                    ? 'bg-sky-500 text-white shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>
                  {isDeptHead ? 'Departmental Queue' : 'Executive Queue'} ({pendingCount})
                </span>
              </button>
            )}

            <button
              onClick={() => setActiveQueueTab('my_submissions')}
              className={`px-3.5 py-1.5 rounded-lg font-semibold transition flex items-center gap-2 ${
                activeQueueTab === 'my_submissions'
                  ? 'bg-sky-500 text-white shadow-xs'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>
                {isFaculty ? 'My Submissions & Approvals' : 'My Requests'}{' '}
                ({approvalRequests.filter((r) => r.submittedBy === currentUser.id).length})
              </span>
            </button>

            <button
              onClick={() => setActiveQueueTab('hierarchy_guide')}
              className={`px-3.5 py-1.5 rounded-lg font-semibold transition flex items-center gap-2 ${
                activeQueueTab === 'hierarchy_guide'
                  ? 'bg-sky-500 text-white shadow-xs'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Hierarchy Architecture Guide</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tab: Hierarchy Architecture Guide */}
      {activeQueueTab === 'hierarchy_guide' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div>
            <h2 className="text-base font-bold text-slate-900">Tamralipta Mahavidyalaya Approval Hierarchy Architecture</h2>
            <p className="text-xs text-slate-500 mt-1">
              A 4-tier separation of concerns ensuring academic autonomy, departmental coordination, executive oversight, and technical control.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Level 1: Faculty */}
            <div className="p-4 rounded-xl border border-sky-200 bg-sky-50/50 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-sky-800 bg-sky-100 px-2 py-0.5 rounded font-mono">
                  LEVEL 1
                </span>
                <Users className="w-4 h-4 text-sky-700" />
              </div>
              <h3 className="font-bold text-sm text-slate-900">Faculty Members</h3>
              <div className="text-[11px] text-slate-600 space-y-1">
                <p>• <strong>Independent Materials:</strong> Publish lecture handouts, lab manuals, and notes directly to assigned courses.</p>
                <p>• <strong>Class Swaps:</strong> Request temporary lecture exchanges with department peers.</p>
                <p>• <strong>Continuous Evaluation:</strong> Grade assignments and quizzes for their papers.</p>
              </div>
            </div>

            {/* Level 2: HOD */}
            <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/50 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded font-mono">
                  LEVEL 2
                </span>
                <Building2 className="w-4 h-4 text-amber-700" />
              </div>
              <h3 className="font-bold text-sm text-slate-900">Department Heads (HOD)</h3>
              <div className="text-[11px] text-slate-600 space-y-1">
                <p>• <strong>Academic Coordination:</strong> Coordinate courses, syllabi, and faculty paper allocations.</p>
                <p>• <strong>Swap Approvals:</strong> Sanction or return peer lecture exchanges.</p>
                <p>• <strong>Marks Moderation:</strong> Review continuous evaluation marks before final publication.</p>
              </div>
            </div>

            {/* Level 3: Principal */}
            <div className="p-4 rounded-xl border border-indigo-200 bg-indigo-50/50 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-indigo-800 bg-indigo-100 px-2 py-0.5 rounded font-mono">
                  LEVEL 3
                </span>
                <Award className="w-4 h-4 text-indigo-700" />
              </div>
              <h3 className="font-bold text-sm text-slate-900">Principal (Executive)</h3>
              <div className="text-[11px] text-slate-600 space-y-1">
                <p>• <strong>Institutional Operations:</strong> Supervise college-wide academic operations & NAAC metrics.</p>
                <p>• <strong>Official Documents:</strong> Gazette institutional circulars, academic calendar, exam notices.</p>
                <p>• <strong>Final Ratification:</strong> Executive override and inter-departmental benchmarking.</p>
              </div>
            </div>

            {/* Level 4: Super Admin */}
            <div className="p-4 rounded-xl border border-purple-200 bg-purple-50/50 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-purple-800 bg-purple-100 px-2 py-0.5 rounded font-mono">
                  LEVEL 4
                </span>
                <Shield className="w-4 h-4 text-purple-700" />
              </div>
              <h3 className="font-bold text-sm text-slate-900">Super Administrator</h3>
              <div className="text-[11px] text-slate-600 space-y-1">
                <p>• <strong>Technical Control:</strong> Master common database maintenance, backups, and restores.</p>
                <p>• <strong>RBAC & Identity:</strong> User lifecycle, ID generation, lockout rules, password policies.</p>
                <p>• <strong>Security Audit:</strong> Comprehensive audit trail monitoring and system health diagnostics.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      {activeQueueTab !== 'hierarchy_guide' && (
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-3 py-1 rounded-md font-semibold transition ${
                  filterStatus === 'all' ? 'bg-slate-700 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterStatus('pending')}
                className={`px-3 py-1 rounded-md font-semibold transition ${
                  filterStatus === 'pending' ? 'bg-amber-500 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Pending ({approvalRequests.filter((r) => r.status === 'pending').length})
              </button>
              <button
                onClick={() => setFilterStatus('approved')}
                className={`px-3 py-1 rounded-md font-semibold transition ${
                  filterStatus === 'approved' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Approved
              </button>
              <button
                onClick={() => setFilterStatus('returned_for_correction')}
                className={`px-3 py-1 rounded-md font-semibold transition ${
                  filterStatus === 'returned_for_correction' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Returned
              </button>
            </div>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="text-xs px-3 py-1.5 border border-slate-200 rounded-lg bg-white text-slate-700 focus:outline-none focus:border-sky-500"
            >
              <option value="all">All Request Types</option>
              <option value="resource_approval">Course Material Reviews</option>
              <option value="class_swap">Class Swap Requests</option>
              <option value="course_draft">Course Draft Proposals</option>
              <option value="marks_moderation">Marks Moderation</option>
            </select>
          </div>

          <div className="relative w-full md:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search approvals..."
              className="w-full text-xs pl-8 pr-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500"
            />
          </div>
        </div>
      )}

      {/* Requests List */}
      {activeQueueTab !== 'hierarchy_guide' && (
        <div className="space-y-3">
          {filteredRequests.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-500">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-80" />
              <h3 className="text-sm font-bold text-slate-800">No requests in this queue</h3>
              <p className="text-xs mt-1">
                {activeQueueTab === 'my_submissions'
                  ? 'You have not submitted any approval or class swap requests yet.'
                  : 'All departmental items have been reviewed and acted upon.'}
              </p>
            </div>
          ) : (
            filteredRequests.map((req) => {
              const isPending = req.status === 'pending';
              const isApproved = req.status === 'approved';
              const isReturned = req.status === 'returned_for_correction';
              const isRejected = req.status === 'rejected';

              return (
                <div
                  key={req.id}
                  className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-slate-300 transition space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div className="flex items-start sm:items-center gap-2.5">
                      <div className="p-2 rounded-lg bg-sky-50 text-sky-700">
                        {req.type === 'resource_approval' && <FileText className="w-4 h-4" />}
                        {req.type === 'class_swap' && <Calendar className="w-4 h-4 text-amber-600" />}
                        {req.type === 'course_draft' && <Layers className="w-4 h-4 text-indigo-600" />}
                        {req.type === 'marks_moderation' && <Award className="w-4 h-4 text-emerald-600" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-sm text-slate-900">{req.title}</h3>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                              isPending
                                ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                : isApproved
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                : 'bg-rose-100 text-rose-800 border border-rose-200'
                            }`}
                          >
                            {req.status.replace(/_/g, ' ')}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          Submitted by: <strong className="text-slate-700">{req.submittedByName}</strong> ({req.submittedByRole}) · {req.submittedAt}
                        </div>
                      </div>
                    </div>

                    {/* Actions for HOD / Admin when in queue tab */}
                    {isPending && activeQueueTab === 'queue' && (isDeptHead || isPrincipal || isSuperAdmin) && (
                      <div className="flex items-center gap-2 self-end sm:self-auto flex-shrink-0">
                        <button
                          onClick={() => handleApprove(req)}
                          className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Approve & Authorize</span>
                        </button>

                        <button
                          onClick={() => {
                            setActiveReqForReturn(req);
                            setReturnFeedback('');
                          }}
                          className="px-3 py-1.5 bg-white hover:bg-rose-50 text-rose-700 border border-rose-200 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Return for Correction</span>
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="text-xs text-slate-600 leading-relaxed bg-slate-50/80 p-3 rounded-lg border border-slate-100">
                    {req.details}
                  </div>

                  {/* Review Notes from HOD/Principal if reviewed */}
                  {req.reviewNotes && (
                    <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg text-xs text-purple-900 flex items-start gap-2">
                      <MessageSquare className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <strong className="block text-[11px] text-purple-800 uppercase tracking-wider">
                          Reviewer Decision ({req.reviewedByName || 'Authorized Reviewer'} · {req.reviewedAt}):
                        </strong>
                        <span className="text-slate-700">{req.reviewNotes}</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Class Swap Request Modal */}
      {showSwapModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-sky-600" />
                <h2 className="text-base font-bold text-slate-900">Request Lecture / Class Swap</h2>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Coordinate lecture exchange with a departmental colleague. This will be routed to your Department Head for schedule authorization.
              </p>
            </div>

            <form onSubmit={handleCreateClassSwap} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700">Course / Lecture *</label>
                <select
                  value={swapCourseId}
                  onChange={(e) => setSwapCourseId(e.target.value)}
                  className="w-full text-xs mt-1 px-3 py-2 border border-slate-300 rounded-lg bg-white"
                  required
                >
                  <option value="">Select course...</option>
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.code}: {c.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700">Colleague Faculty *</label>
                <select
                  value={swapTargetFacultyId}
                  onChange={(e) => setSwapTargetFacultyId(e.target.value)}
                  className="w-full text-xs mt-1 px-3 py-2 border border-slate-300 rounded-lg bg-white"
                  required
                >
                  <option value="">Select department faculty...</option>
                  {departmentFaculty.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name} ({f.designation || 'Faculty'})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700">Original Date</label>
                  <input
                    type="date"
                    required
                    value={swapOriginalDate}
                    onChange={(e) => setSwapOriginalDate(e.target.value)}
                    className="w-full text-xs mt-1 px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700">Original Slot</label>
                  <input
                    type="text"
                    value={swapOriginalTime}
                    onChange={(e) => setSwapOriginalTime(e.target.value)}
                    className="w-full text-xs mt-1 px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700">Swap Date</label>
                  <input
                    type="date"
                    required
                    value={swapDate}
                    onChange={(e) => setSwapDate(e.target.value)}
                    className="w-full text-xs mt-1 px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700">Swap Slot</label>
                  <input
                    type="text"
                    value={swapTime}
                    onChange={(e) => setSwapTime(e.target.value)}
                    className="w-full text-xs mt-1 px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700">Reason</label>
                <textarea
                  rows={2}
                  required
                  value={swapReason}
                  onChange={(e) => setSwapReason(e.target.value)}
                  placeholder="e.g. University evaluation duty / emergency academic engagement"
                  className="w-full text-xs mt-1 px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSwapModal(false)}
                  className="px-3.5 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-semibold shadow-xs cursor-pointer"
                >
                  Submit Swap Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Return for Correction Modal */}
      {activeReqForReturn && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <RotateCcw className="w-5 h-5 text-rose-600" />
                Return Submission for Correction
              </h3>
              <button
                onClick={() => setActiveReqForReturn(null)}
                className="text-slate-400 hover:text-slate-700 text-xs p-1"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Provide constructive feedback to <strong>{activeReqForReturn.submittedByName}</strong> explaining what modifications or schedule adjustments are needed:
            </p>

            <form onSubmit={handleConfirmReturn} className="space-y-4">
              <textarea
                required
                rows={4}
                value={returnFeedback}
                onChange={(e) => setReturnFeedback(e.target.value)}
                placeholder="e.g. Please update references to align with Vidyasagar University CBCS 2025-26 guidelines."
                className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:outline-none focus:border-rose-500"
              />

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveReqForReturn(null)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold shadow-xs"
                >
                  Submit Feedback & Return
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
