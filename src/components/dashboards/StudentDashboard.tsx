import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  BookOpen,
  FileCheck,
  Award,
  Calendar,
  Bell,
  Clock,
  Download,
  AlertCircle,
  CheckCircle2,
  FileText,
  ChevronRight,
  GraduationCap
} from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const {
    currentUser,
    courses,
    assignments,
    submissions,
    assessments,
    attempts,
    resources,
    announcements,
    grades,
    setActiveTab,
    setSelectedCourseId,
    setSelectedAssignmentId,
    setActiveQuizId,
    language
  } = useApp();

  const enrolledCourses = courses.filter((c) =>
    currentUser.enrolledCourseIds?.includes(c.id)
  );

  // Pending assignments: published and not submitted
  const pendingAssignments = assignments.filter((a) => {
    const isEnrolled = currentUser.enrolledCourseIds?.includes(a.courseId);
    if (!isEnrolled || a.status !== 'published') return false;
    const isSubmitted = submissions.some(
      (s) => s.assignmentId === a.id && s.studentId === currentUser.id
    );
    return !isSubmitted;
  });

  // Recent submissions
  const studentSubmissions = submissions.filter((s) => s.studentId === currentUser.id);

  // Available Assessments
  const availableAssessments = assessments.filter((a) => {
    return (
      a.status === 'published' &&
      currentUser.enrolledCourseIds?.includes(a.courseId)
    );
  });

  // Calculate SGPA from published grades
  const studentGrades = grades.filter((g) => g.studentId === currentUser.id && g.status === 'published');
  const avgGPA =
    studentGrades.length > 0
      ? (studentGrades.reduce((acc, curr) => acc + curr.gpa, 0) / studentGrades.length).toFixed(2)
      : '9.33';

  // Quick cards data
  const quickActions = [
    {
      title: language === 'bn' ? 'আমার কোর্সসমূহ' : 'My Courses',
      count: `${enrolledCourses.length} Courses`,
      icon: BookOpen,
      tab: 'courses',
      color: 'bg-blue-50 text-blue-700 border-blue-200'
    },
    {
      title: language === 'bn' ? 'পাঠ্যসামগ্রী' : 'Study Materials',
      count: `${resources.length} Files`,
      icon: FileText,
      tab: 'resources',
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    },
    {
      title: language === 'bn' ? 'অ্যাসাইনমেন্ট' : 'Assignments',
      count: `${pendingAssignments.length} Pending`,
      icon: FileCheck,
      tab: 'assignments',
      color: 'bg-amber-50 text-amber-700 border-amber-200'
    },
    {
      title: language === 'bn' ? 'অনলাইন পরীক্ষা' : 'Online Tests',
      count: `${availableAssessments.length} Active`,
      icon: Award,
      tab: 'assessments',
      color: 'bg-purple-50 text-purple-700 border-purple-200'
    },
    {
      title: language === 'bn' ? 'ফলাফল ও গ্রেড' : 'Results & Grades',
      count: `SGPA ${avgGPA}`,
      icon: GraduationCap,
      tab: 'grades',
      color: 'bg-indigo-50 text-indigo-700 border-indigo-200'
    },
    {
      title: language === 'bn' ? 'দিনপঞ্জিকা' : 'Academic Calendar',
      count: 'Upcoming Events',
      icon: Calendar,
      tab: 'calendar',
      color: 'bg-sky-50 text-sky-700 border-sky-200'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Student Profile Welcome Banner */}
      <div className="bg-gradient-to-r from-[#0f2942] to-[#1a446c] text-white rounded-2xl p-6 shadow-md border border-[#274f75] relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-sky-300">
              <span>Tamralipta Mahavidyalaya</span>
              <span aria-hidden="true">·</span>
              <span>Semester {currentUser.semester || 3}</span>
              <span aria-hidden="true">·</span>
              <span>Academic Session 2025-2026</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold mt-1 tracking-tight">
              {language === 'bn' ? `স্বাগতম, ${currentUser.nameBengali || currentUser.name}` : `Welcome back, ${currentUser.name}`}
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              B.Sc. (Honours) in Computer Science · Roll No: <span className="font-mono text-sky-300">{currentUser.rollNumber}</span> · Department of Computer Science
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('assignments')}
              className="bg-sky-500 hover:bg-sky-400 text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow transition flex items-center gap-2"
            >
              <FileCheck className="w-4 h-4" />
              <span>{language === 'bn' ? 'অ্যাসাইনমেন্ট জমা দিন' : 'Submit Assignment'}</span>
            </button>
            <button
              onClick={() => setActiveTab('grades')}
              className="bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-4 py-2.5 rounded-lg border border-white/20 transition flex items-center gap-2"
            >
              <GraduationCap className="w-4 h-4" />
              <span>{language === 'bn' ? 'গ্রেড কার্ড' : 'Grade Transcript'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 9 Quick-Access Action Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {quickActions.map((action, idx) => {
          const Icon = action.icon;
          return (
            <button
              key={idx}
              onClick={() => setActiveTab(action.tab)}
              className="bg-white p-3.5 rounded-xl border border-slate-200 hover:border-sky-400 hover:shadow-md transition text-left flex flex-col justify-between group"
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`p-2 rounded-lg ${action.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-sky-600 transition" />
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-900 group-hover:text-sky-700 line-clamp-1">
                  {action.title}
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5 font-medium">
                  {action.count}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Two Column Layout: Courses & Deadlines */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Enrolled Courses */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  {language === 'bn' ? 'আমার অন্তর্ভুক্ত কোর্সসমূহ' : 'Enrolled Academic Courses'}
                </h2>
                <p className="text-xs text-slate-500">
                  CBCS Curriculum · Vidyasagar University Syllabus
                </p>
              </div>
              <button
                onClick={() => setActiveTab('courses')}
                className="text-xs text-sky-700 hover:text-sky-900 font-semibold"
              >
                {language === 'bn' ? 'সকল দেখুন' : 'View All'} →
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {enrolledCourses.map((c) => (
                <div
                  key={c.id}
                  onClick={() => {
                    setSelectedCourseId(c.id);
                    setActiveTab('courses');
                  }}
                  className="border border-slate-200 rounded-xl p-4 hover:border-sky-300 hover:shadow-sm transition cursor-pointer bg-slate-50/50 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                      <span className="font-mono font-semibold text-sky-800">{c.code}</span>
                      <span>{c.credits} Credits</span>
                    </div>
                    <h3 className="font-bold text-sm text-slate-900 hover:text-sky-700 line-clamp-1">
                      {language === 'bn' && c.titleBengali ? c.titleBengali : c.title}
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-2 mt-1">
                      {c.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-500">
                    <span className="truncate">{c.facultyName}</span>
                    <span className="text-sky-700 font-medium flex items-center gap-1">
                      {c.units.length} Units
                      <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Study Materials uploaded */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  {language === 'bn' ? 'সাম্প্রতিক পাঠ্যসামগ্রী ও নোটস' : 'Recent Study Materials'}
                </h2>
                <p className="text-xs text-slate-500">
                  Handouts, lecture presentations, and reference material
                </p>
              </div>
              <button
                onClick={() => setActiveTab('resources')}
                className="text-xs text-sky-700 hover:text-sky-900 font-semibold"
              >
                {language === 'bn' ? 'সংগ্রহশালা দেখুন' : 'Browse Repository'} →
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {resources.slice(0, 4).map((res) => (
                <div
                  key={res.id}
                  className="py-3 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="p-2 rounded bg-sky-50 text-sky-700 flex-shrink-0 mt-0.5">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-slate-900 truncate">
                        {language === 'bn' && res.titleBengali ? res.titleBengali : res.title}
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                        <span className="font-mono text-sky-700">{res.courseCode || 'General'}</span>
                        <span aria-hidden="true">·</span>
                        <span>{res.fileSize}</span>
                        <span aria-hidden="true">·</span>
                        <span>{res.uploadedAt}</span>
                      </div>
                    </div>
                  </div>

                  <a
                    href={res.url}
                    onClick={(e) => {
                      e.preventDefault();
                      alert(`Downloading resource: ${res.title} (${res.fileSize})`);
                    }}
                    className="p-2 text-slate-500 hover:text-sky-700 hover:bg-slate-100 rounded-lg transition flex-shrink-0"
                    title="Download Resource"
                  >
                    <Download className="w-4 h-4" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Urgent Deadlines & Quizzes */}
        <div className="space-y-6">
          {/* Pending Assignments */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-600" />
                {language === 'bn' ? 'আসন্ন অ্যাসাইনমেন্টের সময়সীমা' : 'Upcoming Deadlines'}
              </h2>
              <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                {pendingAssignments.length} Pending
              </span>
            </div>

            {pendingAssignments.length === 0 ? (
              <div className="text-center py-6 text-xs text-slate-500">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                All active assignments submitted!
              </div>
            ) : (
              <div className="space-y-3">
                {pendingAssignments.map((asg) => (
                  <div
                    key={asg.id}
                    onClick={() => {
                      setSelectedAssignmentId(asg.id);
                      setActiveTab('assignments');
                    }}
                    className="p-3 border border-slate-200 rounded-lg hover:border-sky-300 hover:bg-slate-50/50 transition cursor-pointer text-xs"
                  >
                    <div className="flex items-center justify-between font-mono text-[11px] text-sky-800">
                      <span>{asg.courseCode}</span>
                      <span className="font-sans text-rose-600 font-semibold flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        Due {asg.dueDate}
                      </span>
                    </div>
                    <div className="font-semibold text-slate-900 mt-1 line-clamp-1">
                      {asg.title}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
                      <span>Max: {asg.maxMarks} Marks</span>
                      <span className="text-sky-700 font-medium">Submit Now →</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Online Quizzes / Exams Available */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Award className="w-4 h-4 text-purple-600" />
                {language === 'bn' ? 'অনলাইন পরীক্ষা ও কুইজ' : 'Online Assessments'}
              </h2>
            </div>

            <div className="space-y-3">
              {availableAssessments.map((quiz) => {
                const userAttempt = attempts.find(
                  (a) => a.assessmentId === quiz.id && a.studentId === currentUser.id
                );

                return (
                  <div
                    key={quiz.id}
                    className="p-3 border border-slate-200 rounded-lg text-xs"
                  >
                    <div className="flex items-center justify-between font-mono text-[11px] text-purple-800">
                      <span>{quiz.courseCode}</span>
                      <span className="font-sans text-slate-500">{quiz.timeLimitMinutes} Mins</span>
                    </div>
                    <div className="font-semibold text-slate-900 mt-1">
                      {quiz.title}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
                      <span>Total: {quiz.totalMarks} Marks</span>
                      {userAttempt ? (
                        <span className="text-emerald-700 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          Score: {userAttempt.finalScore}/{quiz.totalMarks}
                        </span>
                      ) : (
                        <button
                          onClick={() => {
                            setActiveQuizId(quiz.id);
                            setActiveTab('assessments');
                          }}
                          className="px-2.5 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded font-medium text-[11px] shadow-xs"
                        >
                          Start Quiz
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Institutional Notice preview */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Bell className="w-4 h-4 text-sky-600" />
                {language === 'bn' ? 'জরুরি নোটিশ' : 'College Notice'}
              </h2>
              <button
                onClick={() => setActiveTab('announcements')}
                className="text-xs text-sky-700 hover:text-sky-900 font-semibold"
              >
                All →
              </button>
            </div>

            {announcements.slice(0, 2).map((ann) => (
              <div key={ann.id} className="text-xs py-2 border-b border-slate-100 last:border-0">
                <div className="font-semibold text-slate-900 line-clamp-1">
                  {language === 'bn' && ann.titleBengali ? ann.titleBengali : ann.title}
                </div>
                <div className="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
                  <span>{ann.authorRole}</span>
                  <span>{ann.publishedAt}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
