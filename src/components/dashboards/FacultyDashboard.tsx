import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  BookOpen,
  FileCheck,
  Award,
  Upload,
  Clock,
  PlusCircle,
  Bell,
  CheckCircle2,
  Users,
  ChevronRight
} from 'lucide-react';

export const FacultyDashboard: React.FC = () => {
  const {
    currentUser,
    courses,
    assignments,
    submissions,
    assessments,
    setActiveTab,
    setSelectedCourseId,
    setSelectedAssignmentId,
    language,
    evaluateSubmission
  } = useApp();

  const [evaluatingSubId, setEvaluatingSubId] = useState<string | null>(null);
  const [evalMarks, setEvalMarks] = useState<number>(20);
  const [evalFeedback, setEvalFeedback] = useState<string>('Good comprehension of the topic.');

  // Courses assigned to this faculty member
  const facultyCourses = courses.filter(
    (c) => c.facultyId === currentUser.id || currentUser.assignedCourseIds?.includes(c.id)
  );

  // Submissions for courses taught by this faculty
  const facultyCourseIds = facultyCourses.map((c) => c.id);
  const pendingSubmissions = submissions.filter(
    (s) => facultyCourseIds.includes(s.courseId) && s.status === 'submitted'
  );
  const evaluatedSubmissions = submissions.filter(
    (s) => facultyCourseIds.includes(s.courseId) && s.status === 'evaluated'
  );

  const handleQuickEvaluate = (subId: string) => {
    evaluateSubmission(subId, evalMarks, evalFeedback);
    setEvaluatingSubId(null);
  };

  return (
    <div className="space-y-6">
      {/* Faculty Profile Welcome Banner */}
      <div className="bg-gradient-to-r from-[#0f2942] to-[#1e3a8a] text-white rounded-2xl p-6 shadow-md border border-[#274f75]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-sky-300">
              <span>Department of Computer Science</span>
              <span aria-hidden="true">·</span>
              <span>Employee ID: {currentUser.employeeId || 'TM-FAC-028'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold mt-1 tracking-tight">
              {language === 'bn' ? `স্বাগতম, ${currentUser.nameBengali || currentUser.name}` : `Welcome back, ${currentUser.name}`}
            </h1>
            <p className="text-sm text-slate-300 mt-1">
              Academic Session 2025-2026 · {facultyCourses.length} Assigned Active Courses · {pendingSubmissions.length} Submissions Pending Evaluation
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <button
              onClick={() => setActiveTab('resources')}
              className="bg-sky-500 hover:bg-sky-400 text-white text-xs font-semibold px-3.5 py-2.5 rounded-lg shadow transition flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              <span>{language === 'bn' ? 'নোটস আপলোড' : 'Upload Material'}</span>
            </button>
            <button
              onClick={() => setActiveTab('assignments')}
              className="bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-3.5 py-2.5 rounded-lg border border-white/20 transition flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{language === 'bn' ? 'অ্যাসাইনমেন্ট তৈরি' : 'New Assignment'}</span>
            </button>
            <button
              onClick={() => setActiveTab('attendance')}
              className="bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-3.5 py-2.5 rounded-lg border border-white/20 transition flex items-center gap-2"
            >
              <Clock className="w-4 h-4" />
              <span>{language === 'bn' ? 'উপস্থিতি নথিভুক্ত' : 'Mark Attendance'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Assigned Courses</span>
            <BookOpen className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">
            {facultyCourses.length}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">CBCS Honours Modules</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Enrolled Students</span>
            <Users className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">
            {facultyCourses.reduce((acc, c) => acc + c.totalEnrolled, 0)}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Across all sections</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Pending Evaluations</span>
            <FileCheck className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-amber-600 mt-2">
            {pendingSubmissions.length}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Needs review & marks</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Evaluated Submissions</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-emerald-600 mt-2">
            {evaluatedSubmissions.length}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Feedback published</div>
        </div>
      </div>

      {/* Main Grid: Courses & Evaluation Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Assigned Courses */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  {language === 'bn' ? 'দায়িত্বপ্রাপ্ত কোর্সসমূহ' : 'My Teaching Courses'}
                </h2>
                <p className="text-xs text-slate-500">Manage learning units, syllabus & resources</p>
              </div>
              <button
                onClick={() => setActiveTab('courses')}
                className="text-xs text-sky-700 hover:text-sky-900 font-semibold"
              >
                {language === 'bn' ? 'সকল কোর্স' : 'View Details'} →
              </button>
            </div>

            <div className="space-y-4">
              {facultyCourses.map((c) => (
                <div
                  key={c.id}
                  className="border border-slate-200 rounded-xl p-4 hover:border-sky-300 transition bg-slate-50/40"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 text-xs font-semibold text-sky-800">
                        <span className="font-mono">{c.code}</span>
                        <span aria-hidden="true">·</span>
                        <span>Semester {c.semester}</span>
                        <span aria-hidden="true">·</span>
                        <span>{c.credits} Credits</span>
                      </div>
                      <h3 className="font-bold text-base text-slate-900 mt-1">
                        {language === 'bn' && c.titleBengali ? c.titleBengali : c.title}
                      </h3>
                      <p className="text-xs text-slate-600 mt-1 line-clamp-1">
                        {c.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 sm:self-center">
                      <button
                        onClick={() => {
                          setSelectedCourseId(c.id);
                          setActiveTab('courses');
                        }}
                        className="px-3 py-1.5 bg-white border border-slate-300 text-xs font-medium text-slate-700 rounded-lg hover:bg-slate-50 shadow-xs"
                      >
                        Manage Course
                      </button>
                      <button
                        onClick={() => {
                          setActiveTab('attendance');
                        }}
                        className="px-3 py-1.5 bg-sky-50 text-sky-700 text-xs font-medium rounded-lg hover:bg-sky-100"
                      >
                        Attendance
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-200/70 flex items-center justify-between text-xs text-slate-500">
                    <span className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      {c.totalEnrolled} Students Enrolled
                    </span>
                    <span className="flex items-center gap-2">
                      <span>{c.units.length} Units Defined</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Assessments Created */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  {language === 'bn' ? 'অনলাইন মূল্যায়ন ও প্রশ্নব্যাঙ্ক' : 'Assessments & Quizzes'}
                </h2>
                <p className="text-xs text-slate-500">Scheduled tests, question banks, and auto-scoring</p>
              </div>
              <button
                onClick={() => setActiveTab('assessments')}
                className="text-xs text-sky-700 hover:text-sky-900 font-semibold"
              >
                Create Quiz +
              </button>
            </div>

            <div className="space-y-3">
              {assessments.map((quiz) => (
                <div
                  key={quiz.id}
                  className="p-3 border border-slate-200 rounded-lg flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-semibold text-slate-900">{quiz.title}</div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                      <span className="font-mono text-sky-800">{quiz.courseCode}</span>
                      <span aria-hidden="true">·</span>
                      <span>{quiz.timeLimitMinutes} Mins</span>
                      <span aria-hidden="true">·</span>
                      <span>{quiz.questions.length} Questions</span>
                      <span aria-hidden="true">·</span>
                      <span>Max {quiz.totalMarks} Marks</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveTab('assessments')}
                    className="text-xs text-purple-700 hover:text-purple-900 font-medium"
                  >
                    View Submissions →
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Submissions Evaluation Queue */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-amber-600" />
                {language === 'bn' ? 'মূল্যায়ন অপেক্ষমাণ' : 'Evaluation Queue'}
              </h2>
              <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                {pendingSubmissions.length} To Grade
              </span>
            </div>

            {pendingSubmissions.length === 0 ? (
              <div className="text-center py-6 text-xs text-slate-500">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                No pending assignment submissions right now.
              </div>
            ) : (
              <div className="space-y-3">
                {pendingSubmissions.map((sub) => (
                  <div
                    key={sub.id}
                    className="p-3 border border-slate-200 rounded-lg text-xs bg-slate-50/50 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-900">{sub.studentName}</span>
                      <span className="font-mono text-[11px] text-slate-500">{sub.studentRoll}</span>
                    </div>

                    <div className="text-[11px] text-slate-600">
                      File: <span className="font-mono text-sky-700">{sub.fileName || 'Online text submission'}</span>
                    </div>

                    {evaluatingSubId === sub.id ? (
                      <div className="pt-2 border-t border-slate-200 space-y-2">
                        <div>
                          <label className="text-[11px] font-semibold text-slate-700">Marks Awarded:</label>
                          <input
                            type="number"
                            value={evalMarks}
                            onChange={(e) => setEvalMarks(Number(e.target.value))}
                            className="w-full mt-1 px-2 py-1 border border-slate-300 rounded text-xs"
                            min="0"
                            max="30"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-semibold text-slate-700">Feedback:</label>
                          <textarea
                            value={evalFeedback}
                            onChange={(e) => setEvalFeedback(e.target.value)}
                            className="w-full mt-1 px-2 py-1 border border-slate-300 rounded text-xs"
                            rows={2}
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleQuickEvaluate(sub.id)}
                            className="px-3 py-1 bg-emerald-600 text-white rounded text-xs font-semibold hover:bg-emerald-700"
                          >
                            Save Grade
                          </button>
                          <button
                            onClick={() => setEvaluatingSubId(null)}
                            className="px-3 py-1 bg-slate-200 text-slate-700 rounded text-xs hover:bg-slate-300"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setEvaluatingSubId(sub.id)}
                        className="w-full mt-1 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded font-medium text-xs shadow-xs"
                      >
                        Evaluate & Give Feedback
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Notice Publisher */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Bell className="w-4 h-4 text-sky-600" />
                {language === 'bn' ? 'বিজ্ঞপ্তি প্রকাশ করুন' : 'Course Announcements'}
              </h2>
            </div>
            <p className="text-xs text-slate-500 mb-3">
              Send immediate circulars, rescheduled lecture alerts, or assignment guidelines to your students.
            </p>
            <button
              onClick={() => setActiveTab('announcements')}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold transition"
            >
              Post New Announcement →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
