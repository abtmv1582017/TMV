import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Assessment, Question, QuestionType } from '../../types';
import {
  Award,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ChevronRight,
  BookOpen
} from 'lucide-react';
import { QuizPlayer } from './QuizPlayer';

export const QuizList: React.FC = () => {
  const {
    assessments,
    attempts,
    courses,
    currentUser,
    addAssessment,
    activeQuizId,
    setActiveQuizId,
    language
  } = useApp();

  const [showCreateModal, setShowCreateModal] = useState(false);

  // New assessment form state
  const [courseId, setCourseId] = useState(courses[0]?.id || 'course-cs-301');
  const [title, setTitle] = useState('');
  const [instructions, setInstructions] = useState('');
  const [timeLimit, setTimeLimit] = useState<number>(20);
  const [passingMarks, setPassingMarks] = useState<number>(8);

  // Questions builder state
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: 'q-new-1',
      type: 'mcq',
      prompt: 'Sample Question: State the primary condition for an AVL Tree balance factor.',
      options: ['|hL - hR| <= 1', '|hL - hR| = 0', 'hL > hR always', 'hL = 2 * hR'],
      correctAnswers: [0],
      marks: 4,
      topic: 'Trees'
    }
  ]);

  const canCreate =
    currentUser.role === 'faculty' ||
    currentUser.role === 'dept_head' ||
    currentUser.role === 'super_admin';

  if (activeQuizId) {
    return <QuizPlayer quizId={activeQuizId} onExit={() => setActiveQuizId(null)} />;
  }

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        id: `q-${Date.now()}`,
        type: 'mcq',
        prompt: 'New Question Prompt',
        options: ['Option A', 'Option B', 'Option C', 'Option D'],
        correctAnswers: [0],
        marks: 4,
        topic: 'General'
      }
    ]);
  };

  const handleCreateAssessment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const selCourse = courses.find((c) => c.id === courseId) || courses[0];
    const totalMarks = questions.reduce((acc, q) => acc + q.marks, 0);

    addAssessment({
      courseId: selCourse.id,
      courseCode: selCourse.code,
      title: title.trim(),
      instructions: instructions || 'Answer all questions within the allocated time.',
      timeLimitMinutes: Number(timeLimit),
      totalMarks,
      passingMarks: Number(passingMarks),
      openDate: new Date().toISOString().substring(0, 10),
      closeDate: '2026-10-31',
      randomizeQuestions: false,
      maxAttempts: 1,
      questions,
      status: 'published',
      resultsPublished: true,
      createdByName: currentUser.name
    });

    setTitle('');
    setInstructions('');
    setShowCreateModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            {language === 'bn' ? 'অনলাইন পরীক্ষা ও মূল্যায়ন' : 'Online Examination & Assessment Engine'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Tamralipta Mahavidyalaya · Timed Examinations, Automated Scoring & Review Keys
          </p>
        </div>

        {canCreate && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-semibold shadow-xs transition self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Create Online Quiz / Exam</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {assessments.map((quiz) => {
          const userAttempt = attempts.find(
            (a) => a.assessmentId === quiz.id && a.studentId === currentUser.id
          );

          return (
            <div
              key={quiz.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-purple-300 transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                  <span className="font-mono font-bold text-purple-800 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                    {quiz.courseCode}
                  </span>
                  <span className="flex items-center gap-1 font-medium text-slate-600">
                    <Clock className="w-3.5 h-3.5" />
                    {quiz.timeLimitMinutes} Mins
                  </span>
                </div>

                <h3 className="font-bold text-base text-slate-900 line-clamp-1">{quiz.title}</h3>
                <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                  {quiz.instructions}
                </p>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>{quiz.questions.length} Questions</span>
                  <span className="font-semibold text-slate-800">Total: {quiz.totalMarks} Marks</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100">
                {currentUser.role === 'student' ? (
                  userAttempt ? (
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Score: {userAttempt.finalScore} / {quiz.totalMarks}
                      </span>
                      <button
                        onClick={() => setActiveQuizId(quiz.id)}
                        className="text-xs text-purple-700 hover:text-purple-900 font-semibold"
                      >
                        Review Answers →
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setActiveQuizId(quiz.id)}
                      className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-semibold shadow-xs transition"
                    >
                      Start Online Exam
                    </button>
                  )
                ) : (
                  <button
                    onClick={() => setActiveQuizId(quiz.id)}
                    className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold transition"
                  >
                    Preview / Test Examination
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Assessment Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold text-slate-900 mb-1">Create Online Assessment</h2>
            <p className="text-xs text-slate-500 mb-4">
              Configure timed online quiz, objective question bank, and auto-scoring rubrics.
            </p>

            <form onSubmit={handleCreateAssessment} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
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
                  <label className="text-xs font-semibold text-slate-700">Time Limit (Minutes):</label>
                  <input
                    type="number"
                    min="5"
                    max="180"
                    value={timeLimit}
                    onChange={(e) => setTimeLimit(Number(e.target.value))}
                    className="w-full text-xs mt-1 px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700">Assessment Title:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mid-Term Evaluation on Tree Algorithms"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-xs mt-1 px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700">Instructions:</label>
                <textarea
                  rows={2}
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder="Rules, negative marking criteria (if any), and guidelines..."
                  className="w-full text-xs mt-1 px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              {/* Question list in builder */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-900 uppercase">
                    Questions ({questions.length})
                  </h3>
                  <button
                    type="button"
                    onClick={handleAddQuestion}
                    className="text-xs text-purple-700 hover:text-purple-900 font-semibold"
                  >
                    + Add Question
                  </button>
                </div>

                {questions.map((q, idx) => (
                  <div key={q.id} className="p-3 rounded-lg border border-slate-200 bg-slate-50 text-xs space-y-2">
                    <div className="flex items-center justify-between font-semibold">
                      <span>Question {idx + 1}</span>
                      <span>{q.marks} Marks</span>
                    </div>
                    <input
                      type="text"
                      value={q.prompt}
                      onChange={(e) => {
                        const updated = [...questions];
                        updated[idx].prompt = e.target.value;
                        setQuestions(updated);
                      }}
                      className="w-full text-xs p-2 border border-slate-300 rounded bg-white"
                    />
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-semibold"
                >
                  Save & Publish Quiz
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
