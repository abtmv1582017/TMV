import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ArrowLeft,
  BookOpen,
  FileText,
  FileCheck,
  Award,
  MessageSquare,
  GraduationCap,
  Download,
  Plus,
  Clock,
  CheckCircle2,
  Users,
  Send,
  Upload,
  Calendar,
  Layers,
  Edit3
} from 'lucide-react';
import { EditCourseModal } from './EditCourseModal';

interface CourseDetailProps {
  courseId: string;
  onBack: () => void;
}

export const CourseDetail: React.FC<CourseDetailProps> = ({ courseId, onBack }) => {
  const {
    courses,
    resources,
    assignments,
    submissions,
    assessments,
    attempts,
    discussions,
    grades,
    currentUser,
    addResource,
    addAssignment,
    submitAssignment,
    addDiscussionThread,
    replyToDiscussion,
    publishCourseGrades,
    setActiveQuizId,
    language,
    t
  } = useApp();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'units' | 'materials' | 'assignments' | 'tests' | 'discussions' | 'grades'
  >('overview');

  const course = courses.find((c) => c.id === courseId);

  // Edit Course Modal state
  const [showEditModal, setShowEditModal] = useState(false);

  // Material upload state
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [resTitle, setResTitle] = useState('');
  const [resDesc, setResDesc] = useState('');
  const [resUnitId, setResUnitId] = useState('u1');

  // Assignment creation state
  const [showAddAsgModal, setShowAddAsgModal] = useState(false);
  const [asgTitle, setAsgTitle] = useState('');
  const [asgInstructions, setAsgInstructions] = useState('');
  const [asgMaxMarks, setAsgMaxMarks] = useState<number>(20);
  const [asgDueDate, setAsgDueDate] = useState('2026-10-15');

  // Discussion new thread
  const [newThreadTitle, setNewThreadTitle] = useState('');
  const [newThreadContent, setNewThreadContent] = useState('');
  const [showThreadForm, setShowThreadForm] = useState(false);
  const [replyContentMap, setReplyContentMap] = useState<Record<string, string>>({});

  // Student submission form state
  const [submittingAsgId, setSubmittingAsgId] = useState<string | null>(null);
  const [submissionFileName, setSubmissionFileName] = useState('');
  const [submissionComments, setSubmissionComments] = useState('');

  if (!course) {
    return (
      <div className="text-center py-12">
        <p className="text-sm text-slate-500">Course not found.</p>
        <button onClick={onBack} className="mt-3 text-xs text-sky-600 font-semibold">
          ← Back to Courses
        </button>
      </div>
    );
  }

  const isInstructor =
    currentUser.role === 'faculty' ||
    currentUser.role === 'dept_head' ||
    currentUser.role === 'super_admin';

  const courseResources = resources.filter((r) => r.courseId === course.id);
  const courseAssignments = assignments.filter((a) => a.courseId === course.id);
  const courseAssessments = assessments.filter((a) => a.courseId === course.id);
  const courseDiscussions = discussions.filter((d) => d.courseId === course.id);
  const courseGrades = grades.filter((g) => g.courseId === course.id);

  const handleUploadResource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resTitle.trim()) return;

    addResource({
      title: resTitle.trim(),
      courseId: course.id,
      courseCode: course.code,
      departmentId: course.departmentId,
      unitId: resUnitId,
      category: 'course',
      fileType: 'pdf',
      fileSize: '2.1 MB',
      url: `/documents/${course.code.toLowerCase()}_notes.pdf`,
      uploadedBy: currentUser.id,
      uploadedByName: currentUser.name,
      description: resDesc || 'Course learning note uploaded by faculty.'
    });

    setResTitle('');
    setResDesc('');
    setShowUploadModal(false);
  };

  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!asgTitle.trim()) return;

    addAssignment({
      courseId: course.id,
      courseCode: course.code,
      title: asgTitle.trim(),
      instructions: asgInstructions.trim(),
      maxMarks: Number(asgMaxMarks),
      openDate: new Date().toISOString().substring(0, 10),
      dueDate: asgDueDate,
      allowLate: true,
      submissionFormat: 'pdf',
      status: 'published',
      createdByName: currentUser.name
    });

    setAsgTitle('');
    setAsgInstructions('');
    setShowAddAsgModal(false);
  };

  const handleStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!submittingAsgId) return;

    submitAssignment({
      assignmentId: submittingAsgId,
      courseId: course.id,
      studentId: currentUser.id,
      studentName: currentUser.name,
      studentRoll: currentUser.rollNumber || 'BSC/CS/2024/042',
      fileName: submissionFileName || `${currentUser.name.replace(/\s+/g, '_')}_solution.pdf`,
      fileUrl: '/uploads/student_submission.pdf',
      textContent: submissionComments,
      status: 'submitted'
    });

    setSubmittingAsgId(null);
    setSubmissionFileName('');
    setSubmissionComments('');
  };

  const handleAddThread = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newThreadTitle.trim()) return;

    addDiscussionThread({
      courseId: course.id,
      courseCode: course.code,
      title: newThreadTitle.trim(),
      content: newThreadContent.trim(),
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorRole: currentUser.role,
      tags: ['Discussion', course.code]
    });

    setNewThreadTitle('');
    setNewThreadContent('');
    setShowThreadForm(false);
  };

  const handleReplyThread = (threadId: string) => {
    const text = replyContentMap[threadId];
    if (!text || !text.trim()) return;
    replyToDiscussion(threadId, text.trim());
    setReplyContentMap({ ...replyContentMap, [threadId]: '' });
  };

  return (
    <div className="space-y-6">
      {/* Back Button & Course Header */}
      <div>
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs text-sky-700 hover:text-sky-900 font-semibold mb-3 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{language === 'bn' ? 'কোর্স তালিকায় ফিরে যান' : 'Back to Course Directory'}</span>
        </button>

        <div className="bg-gradient-to-r from-[#0f2942] to-[#1e3a8a] text-white rounded-2xl p-6 shadow-md border border-[#274f75]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-sky-300">
                <span className="font-mono bg-sky-950/80 px-2 py-0.5 rounded border border-sky-400/30">
                  {course.code}
                </span>
                <span aria-hidden="true">·</span>
                <span>Semester {course.semester}</span>
                <span aria-hidden="true">·</span>
                <span>{course.credits} Credits</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold mt-1 tracking-tight">
                {language === 'bn' && course.titleBengali ? course.titleBengali : course.title}
              </h1>
              <p className="text-sm text-slate-300 mt-1">
                Faculty In-Charge: <span className="text-white font-medium">{course.facultyName}</span> · Enrolled Students: {course.totalEnrolled}
              </p>
            </div>

            <div className="flex items-center gap-2">
              {isInstructor && (
                <>
                  <button
                    onClick={() => setShowEditModal(true)}
                    className="bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-3.5 py-2.5 rounded-lg border border-white/20 transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                    title="Edit Course Name, Auto Code, Credits, Faculty, and Syllabus"
                  >
                    <Edit3 className="w-4 h-4 text-sky-300" />
                    <span>Edit Course Details & Code</span>
                  </button>
                  <button
                    onClick={() => setShowUploadModal(true)}
                    className="bg-sky-500 hover:bg-sky-400 text-white text-xs font-semibold px-3.5 py-2.5 rounded-lg shadow transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Upload Resource</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Course Sub-Navigation Tabs */}
      <div className="flex items-center gap-1 border-b border-slate-200 overflow-x-auto pb-1 text-xs">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-3.5 py-2 font-medium rounded-t-lg transition whitespace-nowrap ${
            activeTab === 'overview'
              ? 'bg-white border-b-2 border-sky-600 text-sky-900 font-semibold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Overview & Syllabus
        </button>
        <button
          onClick={() => setActiveTab('units')}
          className={`px-3.5 py-2 font-medium rounded-t-lg transition whitespace-nowrap ${
            activeTab === 'units'
              ? 'bg-white border-b-2 border-sky-600 text-sky-900 font-semibold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Learning Units ({course.units.length})
        </button>
        <button
          onClick={() => setActiveTab('materials')}
          className={`px-3.5 py-2 font-medium rounded-t-lg transition whitespace-nowrap ${
            activeTab === 'materials'
              ? 'bg-white border-b-2 border-sky-600 text-sky-900 font-semibold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Study Materials ({courseResources.length})
        </button>
        <button
          onClick={() => setActiveTab('assignments')}
          className={`px-3.5 py-2 font-medium rounded-t-lg transition whitespace-nowrap ${
            activeTab === 'assignments'
              ? 'bg-white border-b-2 border-sky-600 text-sky-900 font-semibold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Assignments ({courseAssignments.length})
        </button>
        <button
          onClick={() => setActiveTab('tests')}
          className={`px-3.5 py-2 font-medium rounded-t-lg transition whitespace-nowrap ${
            activeTab === 'tests'
              ? 'bg-white border-b-2 border-sky-600 text-sky-900 font-semibold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Online Tests ({courseAssessments.length})
        </button>
        <button
          onClick={() => setActiveTab('discussions')}
          className={`px-3.5 py-2 font-medium rounded-t-lg transition whitespace-nowrap ${
            activeTab === 'discussions'
              ? 'bg-white border-b-2 border-sky-600 text-sky-900 font-semibold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Discussion ({courseDiscussions.length})
        </button>
        <button
          onClick={() => setActiveTab('grades')}
          className={`px-3.5 py-2 font-medium rounded-t-lg transition whitespace-nowrap ${
            activeTab === 'grades'
              ? 'bg-white border-b-2 border-sky-600 text-sky-900 font-semibold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Grades & Roster
        </button>
      </div>

      {/* Tab Content 1: Overview */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">
                Course Description
              </h2>
              <p className="text-xs text-slate-700 leading-relaxed">
                {course.description}
              </p>

              {course.learningObjectives && course.learningObjectives.length > 0 && (
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                    Learning Objectives & Outcomes
                  </h3>
                  <ul className="space-y-1.5 text-xs text-slate-600 list-disc list-inside">
                    {course.learningObjectives.map((obj, i) => (
                      <li key={i}>{obj}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">
                Syllabus Summary
              </h2>
              <p className="text-xs text-slate-700 leading-relaxed">
                {course.syllabusSummary}
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
                Course Metadata
              </h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Course Code:</span>
                  <span className="font-mono font-semibold text-slate-800">{course.code}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Semester:</span>
                  <span className="font-semibold text-slate-800">Semester {course.semester}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Credits:</span>
                  <span className="font-semibold text-slate-800">{course.credits} Credits</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Session:</span>
                  <span className="font-semibold text-slate-800">2025-2026</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Curriculum:</span>
                  <span className="font-semibold text-slate-800">Vidyasagar University CBCS</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content 2: Learning Units */}
      {activeTab === 'units' && (
        <div className="space-y-4">
          {course.units.map((unit) => (
            <div
              key={unit.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-sky-600" />
                  {unit.title}
                </h3>
                <span className="text-xs text-slate-500">{unit.topics.length} Key Topics</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {unit.topics.map((topic, i) => (
                  <div
                    key={i}
                    className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-slate-700 flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-500 flex-shrink-0" />
                    <span>{topic}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab Content 3: Study Materials */}
      {activeTab === 'materials' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900">
              Prescribed Course Materials & Handouts
            </h2>
            {isInstructor && (
              <button
                onClick={() => setShowUploadModal(true)}
                className="px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                Upload New Document
              </button>
            )}
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-xs divide-y divide-slate-100">
            {courseResources.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500">
                No learning materials uploaded for this course yet.
              </div>
            ) : (
              courseResources.map((res) => (
                <div
                  key={res.id}
                  className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-sky-50 text-sky-700 flex-shrink-0 mt-0.5">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-sm">
                        {language === 'bn' && res.titleBengali ? res.titleBengali : res.title}
                      </div>
                      <p className="text-slate-600 text-xs mt-0.5">{res.description}</p>
                      <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-2">
                        <span>Size: {res.fileSize}</span>
                        <span aria-hidden="true">·</span>
                        <span>By {res.uploadedByName}</span>
                        <span aria-hidden="true">·</span>
                        <span>Date: {res.uploadedAt}</span>
                      </div>
                    </div>
                  </div>

                  <a
                    href={res.url}
                    onClick={(e) => {
                      e.preventDefault();
                      alert(`Downloading resource: ${res.title}`);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-sky-50 hover:text-sky-700 text-slate-700 rounded-lg font-medium self-start sm:self-auto transition"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </a>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Tab Content 4: Assignments */}
      {activeTab === 'assignments' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900">Course Assignments & Submissions</h2>
            {isInstructor && (
              <button
                onClick={() => setShowAddAsgModal(true)}
                className="px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                Create Assignment
              </button>
            )}
          </div>

          <div className="space-y-4">
            {courseAssignments.map((asg) => {
              const mySub = submissions.find(
                (s) => s.assignmentId === asg.id && s.studentId === currentUser.id
              );
              const allSubs = submissions.filter((s) => s.assignmentId === asg.id);

              return (
                <div
                  key={asg.id}
                  className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div>
                      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                        <span>Max Marks: {asg.maxMarks}</span>
                        <span aria-hidden="true">·</span>
                        <span className="text-rose-600 font-bold">Due Date: {asg.dueDate}</span>
                      </div>
                      <h3 className="font-bold text-base text-slate-900 mt-1">{asg.title}</h3>
                    </div>

                    <div>
                      {currentUser.role === 'student' ? (
                        mySub ? (
                          <div className="text-right">
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              {mySub.status === 'evaluated'
                                ? `Graded: ${mySub.marksObtained}/${asg.maxMarks}`
                                : 'Submitted'}
                            </span>
                          </div>
                        ) : (
                          <button
                            onClick={() => setSubmittingAsgId(asg.id)}
                            className="px-3.5 py-1.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold rounded-lg shadow-xs"
                          >
                            Submit Solution
                          </button>
                        )
                      ) : (
                        <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full">
                          {allSubs.length} Submissions Received
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                    {asg.instructions}
                  </p>

                  {/* If student has submitted, show details & feedback */}
                  {currentUser.role === 'student' && mySub && (
                    <div className="mt-3 p-3 bg-slate-50 rounded-lg text-xs space-y-1.5 border border-slate-100">
                      <div className="font-semibold text-slate-900">Your Submission:</div>
                      <div className="text-slate-600">
                        File: <span className="font-mono text-sky-700">{mySub.fileName}</span> (Submitted on {mySub.submittedAt})
                      </div>
                      {mySub.marksObtained !== undefined && (
                        <div className="text-emerald-700 font-semibold pt-1">
                          Score: {mySub.marksObtained} / {asg.maxMarks} Marks
                        </div>
                      )}
                      {mySub.feedback && (
                        <div className="text-slate-700 italic pt-1 border-t border-slate-200">
                          Teacher Feedback: "{mySub.feedback}"
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab Content 5: Online Tests */}
      {activeTab === 'tests' && (
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-slate-900">Course Examinations & Quizzes</h2>
          <div className="space-y-3">
            {courseAssessments.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500 bg-white rounded-xl border border-slate-200">
                No active tests scheduled for this course.
              </div>
            ) : (
              courseAssessments.map((quiz) => {
                const userAttempt = attempts.find(
                  (a) => a.assessmentId === quiz.id && a.studentId === currentUser.id
                );

                return (
                  <div
                    key={quiz.id}
                    className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="text-xs text-purple-700 font-semibold uppercase tracking-wider">
                        {quiz.timeLimitMinutes} Minutes · {quiz.questions.length} Questions · Total {quiz.totalMarks} Marks
                      </div>
                      <h3 className="font-bold text-base text-slate-900 mt-1">{quiz.title}</h3>
                      <p className="text-xs text-slate-600 mt-1">{quiz.instructions}</p>
                    </div>

                    <div>
                      {currentUser.role === 'student' ? (
                        userAttempt ? (
                          <div className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 text-center">
                            Score: {userAttempt.finalScore} / {quiz.totalMarks}
                          </div>
                        ) : (
                          <button
                            onClick={() => setActiveQuizId(quiz.id)}
                            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-semibold shadow-xs"
                          >
                            Start Online Exam
                          </button>
                        )
                      ) : (
                        <div className="text-xs font-medium text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg">
                          Teacher Mode Active
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Tab Content 6: Discussion Forum */}
      {activeTab === 'discussions' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900">Academic Query & Discussion Forum</h2>
            <button
              onClick={() => setShowThreadForm(!showThreadForm)}
              className="px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              Ask Question / Start Thread
            </button>
          </div>

          {showThreadForm && (
            <form onSubmit={handleAddThread} className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
              <h3 className="text-xs font-bold text-slate-900">Post New Academic Discussion Topic</h3>
              <input
                type="text"
                required
                placeholder="Topic Title or Question Summary..."
                value={newThreadTitle}
                onChange={(e) => setNewThreadTitle(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg"
              />
              <textarea
                rows={3}
                required
                placeholder="Provide comprehensive details or code snippet for faculty / peers..."
                value={newThreadContent}
                onChange={(e) => setNewThreadContent(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowThreadForm(false)}
                  className="px-3 py-1.5 border border-slate-300 text-xs rounded-lg text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-sky-600 text-white text-xs font-semibold rounded-lg hover:bg-sky-700"
                >
                  Publish Query
                </button>
              </div>
            </form>
          )}

          <div className="space-y-4">
            {courseDiscussions.map((th) => (
              <div key={th.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="font-semibold text-slate-800">{th.authorName} ({th.authorRole})</span>
                  <span>{th.createdAt}</span>
                </div>
                <h3 className="font-bold text-base text-slate-900">{th.title}</h3>
                <p className="text-xs text-slate-700 leading-relaxed">{th.content}</p>

                {/* Replies */}
                {th.replies.length > 0 && (
                  <div className="pt-3 border-t border-slate-100 space-y-2">
                    {th.replies.map((r) => (
                      <div
                        key={r.id}
                        className={`p-3 rounded-lg text-xs ${
                          r.isFacultyResponse
                            ? 'bg-sky-50 border border-sky-100 text-sky-950 ml-4'
                            : 'bg-slate-50 text-slate-800'
                        }`}
                      >
                        <div className="flex items-center justify-between font-semibold text-[11px] mb-1">
                          <span className={r.isFacultyResponse ? 'text-sky-800' : 'text-slate-700'}>
                            {r.authorName} {r.isFacultyResponse && '(Faculty Instructor)'}
                          </span>
                          <span className="text-[10px] text-slate-500 font-normal">{r.createdAt}</span>
                        </div>
                        <p>{r.content}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Reply box */}
                <div className="pt-2 flex gap-2">
                  <input
                    type="text"
                    placeholder="Write an academic response..."
                    value={replyContentMap[th.id] || ''}
                    onChange={(e) => setReplyContentMap({ ...replyContentMap, [th.id]: e.target.value })}
                    className="flex-1 text-xs px-3 py-1.5 border border-slate-300 rounded-lg"
                  />
                  <button
                    onClick={() => handleReplyThread(th.id)}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold flex items-center gap-1"
                  >
                    <Send className="w-3 h-3" />
                    <span>Reply</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab Content 7: Grades & Roster */}
      {activeTab === 'grades' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900">Course Assessment Marksheet & Enrollment</h2>
            {isInstructor && (
              <button
                onClick={() => {
                  publishCourseGrades(course.id);
                  alert('Grades published to enrolled students!');
                }}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                Publish Grades to Students
              </button>
            )}
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-x-auto">
            <table className="w-full text-xs text-left text-slate-700">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Student Name</th>
                  <th className="py-2.5 px-3">Roll Number</th>
                  <th className="py-2.5 px-3 text-center">Assignment</th>
                  <th className="py-2.5 px-3 text-center">Quiz</th>
                  <th className="py-2.5 px-3 text-center">Midterm</th>
                  <th className="py-2.5 px-3 text-center">Grade</th>
                  <th className="py-2.5 px-3 text-center">GPA</th>
                  <th className="py-2.5 px-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {courseGrades.map((g) => (
                  <tr key={g.id}>
                    <td className="py-3 px-3 font-semibold text-slate-900">{g.studentName}</td>
                    <td className="py-3 px-3 font-mono text-slate-500">{g.studentRoll}</td>
                    <td className="py-3 px-3 text-center">
                      {g.assignmentMarks} / {g.assignmentTotal}
                    </td>
                    <td className="py-3 px-3 text-center">
                      {g.quizMarks} / {g.quizTotal}
                    </td>
                    <td className="py-3 px-3 text-center">
                      {g.midtermMarks} / {g.midtermTotal}
                    </td>
                    <td className="py-3 px-3 text-center font-bold text-sky-800">{g.finalGrade}</td>
                    <td className="py-3 px-3 text-center font-semibold">{g.gpa.toFixed(1)}</td>
                    <td className="py-3 px-3 text-right">
                      <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[10px]">
                        {g.status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Upload Resource Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h2 className="text-base font-bold text-slate-900 mb-1">Upload Study Material</h2>
            <p className="text-xs text-slate-500 mb-4">
              Add lecture notes, syllabus handouts, or lab manuals to {course.code}.
            </p>

            <form onSubmit={handleUploadResource} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700">Document Title:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Unit 3 Dijkstra Shortest Path Notes"
                  value={resTitle}
                  onChange={(e) => setResTitle(e.target.value)}
                  className="w-full text-xs mt-1 px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700">Unit / Module:</label>
                <select
                  value={resUnitId}
                  onChange={(e) => setResUnitId(e.target.value)}
                  className="w-full text-xs mt-1 px-3 py-2 border border-slate-300 rounded-lg bg-white"
                >
                  {course.units.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700">Description:</label>
                <textarea
                  rows={2}
                  value={resDesc}
                  onChange={(e) => setResDesc(e.target.value)}
                  placeholder="Topic summary, readings, or problem set instructions..."
                  className="w-full text-xs mt-1 px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="p-3 border-2 border-dashed border-slate-300 rounded-lg text-center bg-slate-50">
                <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                <div className="text-xs font-semibold text-slate-700">PDF, DOCX, PPTX, or MP4</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Maximum file size: 50MB</div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-semibold"
                >
                  Upload Material
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Assignment Modal */}
      {showAddAsgModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h2 className="text-base font-bold text-slate-900 mb-1">Create Course Assignment</h2>
            <form onSubmit={handleCreateAssignment} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700">Assignment Title:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Assignment 3: B-Tree Balancing"
                  value={asgTitle}
                  onChange={(e) => setAsgTitle(e.target.value)}
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
                    value={asgMaxMarks}
                    onChange={(e) => setAsgMaxMarks(Number(e.target.value))}
                    className="w-full text-xs mt-1 px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700">Due Date:</label>
                  <input
                    type="date"
                    required
                    value={asgDueDate}
                    onChange={(e) => setAsgDueDate(e.target.value)}
                    className="w-full text-xs mt-1 px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700">Instructions:</label>
                <textarea
                  rows={3}
                  required
                  value={asgInstructions}
                  onChange={(e) => setAsgInstructions(e.target.value)}
                  placeholder="Provide problem specifications, constraints, and submission guidelines..."
                  className="w-full text-xs mt-1 px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddAsgModal(false)}
                  className="px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50"
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

      {/* Student Submit Assignment Modal */}
      {submittingAsgId && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h2 className="text-base font-bold text-slate-900 mb-1">Submit Assignment Work</h2>
            <p className="text-xs text-slate-500 mb-4">
              Upload your academic report, code listing, or solution file.
            </p>

            <form onSubmit={handleStudentSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700">File Name / Document Title:</label>
                <input
                  type="text"
                  placeholder="e.g. Souvik_Jana_Assignment2_Report.pdf"
                  value={submissionFileName}
                  onChange={(e) => setSubmissionFileName(e.target.value)}
                  className="w-full text-xs mt-1 px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700">Submission Comments / Notes:</label>
                <textarea
                  rows={3}
                  value={submissionComments}
                  onChange={(e) => setSubmissionComments(e.target.value)}
                  placeholder="Enter remarks or implementation notes for your professor..."
                  className="w-full text-xs mt-1 px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="p-4 border-2 border-dashed border-sky-300 rounded-xl bg-sky-50/50 text-center">
                <FileCheck className="w-6 h-6 text-sky-600 mx-auto mb-1" />
                <div className="text-xs font-semibold text-sky-900">Ready to Submit</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Timestamp will be officially recorded</div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSubmittingAsgId(null)}
                  className="px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-semibold"
                >
                  Submit Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Edit Course Modal */}
      {showEditModal && (
        <EditCourseModal
          course={course}
          onClose={() => setShowEditModal(false)}
        />
      )}
    </div>
  );
};
