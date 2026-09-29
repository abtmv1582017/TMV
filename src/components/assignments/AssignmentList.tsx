import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Assignment, AssignmentSubmission } from '../../types';
import {
  FileCheck,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Download,
  Calendar,
  Send,
  User
} from 'lucide-react';

export const AssignmentList: React.FC = () => {
  const {
    assignments,
    submissions,
    courses,
    currentUser,
    addAssignment,
    submitAssignment,
    evaluateSubmission,
    selectedAssignmentId,
    setSelectedAssignmentId,
    language
  } = useApp();

  const [filter, setFilter] = useState<'all' | 'pending' | 'submitted' | 'evaluated'>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // New assignment form state
  const [courseId, setCourseId] = useState(courses[0]?.id || 'course-cs-301');
  const [title, setTitle] = useState('');
  const [instructions, setInstructions] = useState('');
  const [maxMarks, setMaxMarks] = useState<number>(25);
  const [dueDate, setDueDate] = useState('2026-10-15');

  // Student submission form state
  const [submittingAsgId, setSubmittingAsgId] = useState<string | null>(null);
  const [fileName, setFileName] = useState('');
  const [textContent, setTextContent] = useState('');

  // Faculty evaluation state
  const [evaluatingSubId, setEvaluatingSubId] = useState<string | null>(null);
  const [evalMarks, setEvalMarks] = useState<number>(20);
  const [evalFeedback, setEvalFeedback] = useState<string>('Good comprehension and clear diagrams.');

  const canCreate =
    currentUser.role === 'faculty' ||
    currentUser.role === 'dept_head' ||
    currentUser.role === 'super_admin';

  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const selCourse = courses.find((c) => c.id === courseId) || courses[0];

    addAssignment({
      courseId: selCourse.id,
      courseCode: selCourse.code,
      title: title.trim(),
      instructions: instructions.trim(),
      maxMarks: Number(maxMarks),
      openDate: new Date().toISOString().substring(0, 10),
      dueDate,
      allowLate: true,
      submissionFormat: 'pdf',
      status: 'published',
      createdByName: currentUser.name
    });

    setTitle('');
    setInstructions('');
    setShowAddModal(false);
  };

  const handleStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!submittingAsgId) return;

    const asg = assignments.find((a) => a.id === submittingAsgId);

    submitAssignment({
      assignmentId: submittingAsgId,
      courseId: asg?.courseId || 'course-cs-301',
      studentId: currentUser.id,
      studentName: currentUser.name,
      studentRoll: currentUser.rollNumber || 'BSC/CS/2024/042',
      fileName: fileName || `${currentUser.name.replace(/\s+/g, '_')}_solution.pdf`,
      fileUrl: '/uploads/student_submission.pdf',
      textContent,
      status: 'submitted'
    });

    setSubmittingAsgId(null);
    setFileName('');
    setTextContent('');
  };

  const handleFacultyEvaluate = (subId: string) => {
    evaluateSubmission(subId, evalMarks, evalFeedback);
    setEvaluatingSubId(null);
  };

  const filteredAssignments = assignments.filter((asg) => {
    if (currentUser.role === 'student') {
      const mySub = submissions.find(
        (s) => s.assignmentId === asg.id && s.studentId === currentUser.id
      );
      if (filter === 'pending') return !mySub;
      if (filter === 'submitted') return mySub && mySub.status === 'submitted';
      if (filter === 'evaluated') return mySub && mySub.status === 'evaluated';
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            {language === 'bn' ? 'অ্যাসাইনমেন্ট পরিচালনা' : 'Academic Assignment Management'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Tamralipta Mahavidyalaya · Submission, Deadlines, Evaluation & Faculty Feedback
          </p>
        </div>

        {canCreate && (
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-semibold shadow-xs transition self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Create Assignment</span>
          </button>
        )}
      </div>

      {/* Filter Tabs for Students */}
      {currentUser.role === 'student' && (
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg w-fit">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition ${
              filter === 'all' ? 'bg-white text-slate-900 font-semibold shadow-xs' : 'text-slate-600'
            }`}
          >
            All Assignments
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition ${
              filter === 'pending' ? 'bg-white text-slate-900 font-semibold shadow-xs' : 'text-slate-600'
            }`}
          >
            Pending Submission
          </button>
          <button
            onClick={() => setFilter('evaluated')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition ${
              filter === 'evaluated' ? 'bg-white text-slate-900 font-semibold shadow-xs' : 'text-slate-600'
            }`}
          >
            Evaluated & Graded
          </button>
        </div>
      )}

      {/* Assignments List */}
      <div className="space-y-4">
        {filteredAssignments.map((asg) => {
          const mySub = submissions.find(
            (s) => s.assignmentId === asg.id && s.studentId === currentUser.id
          );
          const asgSubmissions = submissions.filter((s) => s.assignmentId === asg.id);

          return (
            <div
              key={asg.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold">
                    <span className="font-mono text-sky-800 bg-sky-50 px-2 py-0.5 rounded border border-sky-200/50">
                      {asg.courseCode}
                    </span>
                    <span aria-hidden="true" className="text-slate-300">·</span>
                    <span className="text-slate-600">Max Marks: {asg.maxMarks}</span>
                    <span aria-hidden="true" className="text-slate-300">·</span>
                    <span className="text-rose-600 font-bold flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      Due: {asg.dueDate}
                    </span>
                  </div>
                  <h3 className="font-bold text-base text-slate-900 mt-1">{asg.title}</h3>
                </div>

                <div>
                  {currentUser.role === 'student' ? (
                    mySub ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
                        <CheckCircle2 className="w-4 h-4" />
                        {mySub.status === 'evaluated'
                          ? `Evaluated: ${mySub.marksObtained}/${asg.maxMarks} Marks`
                          : 'Submitted (Pending Review)'}
                      </span>
                    ) : (
                      <button
                        onClick={() => setSubmittingAsgId(asg.id)}
                        className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-semibold shadow-xs"
                      >
                        Submit Assignment Work
                      </button>
                    )
                  ) : (
                    <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg">
                      {asgSubmissions.length} Submissions Received
                    </span>
                  )}
                </div>
              </div>

              <div className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                {asg.instructions}
              </div>

              {/* Student Personal Submission Details */}
              {currentUser.role === 'student' && mySub && (
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/70 text-xs space-y-2">
                  <div className="flex items-center justify-between font-semibold text-slate-800">
                    <span>Your Submitted Work:</span>
                    <span className="text-slate-500 font-normal">Submitted: {mySub.submittedAt}</span>
                  </div>
                  <div className="text-slate-600">
                    File: <span className="font-mono text-sky-800 font-medium">{mySub.fileName}</span>
                  </div>
                  {mySub.textContent && (
                    <div className="text-slate-600 italic">Notes: "{mySub.textContent}"</div>
                  )}

                  {mySub.status === 'evaluated' && (
                    <div className="pt-2 border-t border-slate-200 space-y-1">
                      <div className="text-emerald-700 font-bold text-sm">
                        Score Awarded: {mySub.marksObtained} / {asg.maxMarks} Marks
                      </div>
                      {mySub.feedback && (
                        <div className="text-slate-700 bg-white p-2.5 rounded-lg border border-slate-200">
                          <span className="font-semibold text-slate-900">Faculty Remarks: </span>
                          {mySub.feedback}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Faculty Evaluation Accordion for this assignment */}
              {canCreate && asgSubmissions.length > 0 && (
                <div className="mt-3 pt-3 border-t border-slate-100">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                    Student Submissions ({asgSubmissions.length})
                  </h4>

                  <div className="space-y-2">
                    {asgSubmissions.map((sub) => (
                      <div
                        key={sub.id}
                        className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div>
                          <div className="font-semibold text-slate-900">
                            {sub.studentName} <span className="font-mono text-slate-500 font-normal">({sub.studentRoll})</span>
                          </div>
                          <div className="text-[11px] text-slate-600 mt-0.5">
                            File: <span className="font-mono text-sky-700">{sub.fileName}</span> · Submitted {sub.submittedAt}
                          </div>
                          {sub.feedback && (
                            <div className="text-[11px] text-slate-600 italic mt-0.5">
                              Feedback: "{sub.feedback}"
                            </div>
                          )}
                        </div>

                        <div>
                          {sub.status === 'evaluated' ? (
                            <span className="font-bold text-emerald-700 bg-emerald-100/70 px-2.5 py-1 rounded">
                              Graded: {sub.marksObtained} / {asg.maxMarks}
                            </span>
                          ) : evaluatingSubId === sub.id ? (
                            <div className="p-3 bg-white border border-slate-300 rounded-lg space-y-2">
                              <div className="flex items-center gap-2">
                                <label className="text-[11px] font-semibold text-slate-700">Marks:</label>
                                <input
                                  type="number"
                                  min="0"
                                  max={asg.maxMarks}
                                  value={evalMarks}
                                  onChange={(e) => setEvalMarks(Number(e.target.value))}
                                  className="w-16 px-2 py-1 border border-slate-300 rounded text-xs"
                                />
                              </div>
                              <input
                                type="text"
                                value={evalFeedback}
                                onChange={(e) => setEvalFeedback(e.target.value)}
                                placeholder="Feedback..."
                                className="w-full px-2 py-1 border border-slate-300 rounded text-xs"
                              />
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleFacultyEvaluate(sub.id)}
                                  className="px-3 py-1 bg-emerald-600 text-white rounded text-xs font-semibold"
                                >
                                  Save Grade
                                </button>
                                <button
                                  onClick={() => setEvaluatingSubId(null)}
                                  className="px-2 py-1 bg-slate-200 text-slate-700 rounded text-xs"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <button
                              onClick={() => {
                                setEvaluatingSubId(sub.id);
                                setEvalMarks(asg.maxMarks - 2);
                              }}
                              className="px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded text-xs font-semibold"
                            >
                              Grade Work
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Student Submit Modal */}
      {submittingAsgId && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h2 className="text-base font-bold text-slate-900 mb-1">Submit Assignment Response</h2>
            <p className="text-xs text-slate-500 mb-4">
              Upload your academic report, code listing, or solution file.
            </p>

            <form onSubmit={handleStudentSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700">Document / File Name:</label>
                <input
                  type="text"
                  placeholder="e.g. Souvik_Jana_Assignment_Report.pdf"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  className="w-full text-xs mt-1 px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700">Submission Remarks:</label>
                <textarea
                  rows={3}
                  value={textContent}
                  onChange={(e) => setTextContent(e.target.value)}
                  placeholder="Notes, test cases completed, or explanation for faculty..."
                  className="w-full text-xs mt-1 px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSubmittingAsgId(null)}
                  className="px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-semibold"
                >
                  Submit Final Work
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Assignment Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h2 className="text-base font-bold text-slate-900 mb-1">Create Course Assignment</h2>
            <form onSubmit={handleCreateAssignment} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700">Course:</label>
                <select
                  value={courseId}
                  onChange={(e) => setCourseId(e.target.value)}
                  className="w-full text-xs mt-1 px-3 py-2 border border-slate-300 rounded-lg bg-white"
                >
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.code}: {c.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700">Assignment Title:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Implementation of Graph Shortest Paths"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-xs mt-1 px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700">Max Marks:</label>
                  <input
                    type="number"
                    min="5"
                    max="100"
                    value={maxMarks}
                    onChange={(e) => setMaxMarks(Number(e.target.value))}
                    className="w-full text-xs mt-1 px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700">Due Date:</label>
                  <input
                    type="date"
                    required
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full text-xs mt-1 px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700">Instructions:</label>
                <textarea
                  rows={3}
                  required
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder="Provide specifications, edge cases, and submission formatting rules..."
                  className="w-full text-xs mt-1 px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-semibold"
                >
                  Publish Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
