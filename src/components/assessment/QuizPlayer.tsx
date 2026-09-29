import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Assessment, Question } from '../../types';
import {
  Clock,
  AlertTriangle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Send,
  RotateCcw,
  Sparkles
} from 'lucide-react';

interface QuizPlayerProps {
  quizId: string;
  onExit: () => void;
}

export const QuizPlayer: React.FC<QuizPlayerProps> = ({ quizId, onExit }) => {
  const { assessments, attempts, currentUser, submitQuizAttempt, language } = useApp();
  const quiz = assessments.find((a) => a.id === quizId);

  // If already attempted, show completed review
  const existingAttempt = attempts.find(
    (a) => a.assessmentId === quizId && a.studentId === currentUser.id
  );

  const [hasStarted, setHasStarted] = useState(false);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [lastSavedTime, setLastSavedTime] = useState<string>('');
  const [calculatedScore, setCalculatedScore] = useState<number>(0);

  useEffect(() => {
    if (quiz) {
      setTimeLeft(quiz.timeLimitMinutes * 60);

      // Check local cache for ongoing attempt recovery (Network Resilience requirement)
      const cached = localStorage.getItem(`tm_lms_quiz_draft_${quiz.id}_${currentUser.id}`);
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (parsed.answers) setAnswers(parsed.answers);
          if (parsed.timeLeft && parsed.timeLeft > 0) setTimeLeft(parsed.timeLeft);
          setHasStarted(true);
        } catch (e) {
          console.error('Failed to parse cached quiz answers', e);
        }
      }
    }
  }, [quiz, currentUser.id]);

  // Periodic Auto-save & Timer countdown
  useEffect(() => {
    if (!hasStarted || isSubmitted || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [hasStarted, isSubmitted, timeLeft]);

  // Auto-save to localStorage every 5 seconds
  useEffect(() => {
    if (!hasStarted || isSubmitted || !quiz) return;

    const autoSaveInterval = setInterval(() => {
      localStorage.setItem(
        `tm_lms_quiz_draft_${quiz.id}_${currentUser.id}`,
        JSON.stringify({ answers, timeLeft, timestamp: Date.now() })
      );
      setLastSavedTime(new Date().toLocaleTimeString());
    }, 5000);

    return () => clearInterval(autoSaveInterval);
  }, [hasStarted, isSubmitted, answers, timeLeft, quiz, currentUser.id]);

  if (!quiz) {
    return (
      <div className="text-center py-12">
        <p className="text-xs text-slate-500">Assessment not found.</p>
        <button onClick={onExit} className="mt-2 text-xs text-sky-600 font-semibold">
          Return
        </button>
      </div>
    );
  }

  // Answer handler
  const handleAnswerChange = (qId: string, value: any) => {
    setAnswers((prev) => ({
      ...prev,
      [qId]: value
    }));
  };

  const handleMultipleSelectToggle = (qId: string, optIndex: number) => {
    const current = (answers[qId] as number[]) || [];
    if (current.includes(optIndex)) {
      handleAnswerChange(
        qId,
        current.filter((i) => i !== optIndex)
      );
    } else {
      handleAnswerChange(qId, [...current, optIndex].sort());
    }
  };

  const handleSubmitQuiz = () => {
    // Calculate auto score
    let score = 0;
    quiz.questions.forEach((q) => {
      const studentAns = answers[q.id];
      if (studentAns === undefined || studentAns === null) return;

      if (q.type === 'mcq' || q.type === 'true_false') {
        if (Number(studentAns) === Number(q.correctAnswers[0])) {
          score += q.marks;
        }
      } else if (q.type === 'multiple_select') {
        const studentArr = Array.isArray(studentAns) ? studentAns : [];
        const correctArr = q.correctAnswers.map(Number);
        if (
          studentArr.length === correctArr.length &&
          studentArr.every((v) => correctArr.includes(Number(v)))
        ) {
          score += q.marks;
        }
      } else if (q.type === 'fill_blank' || q.type === 'short_answer') {
        const strAns = String(studentAns).trim().toLowerCase();
        const matches = q.correctAnswers.some((ans) => String(ans).trim().toLowerCase() === strAns);
        if (matches) {
          score += q.marks;
        }
      }
    });

    setCalculatedScore(score);
    setIsSubmitted(true);
    localStorage.removeItem(`tm_lms_quiz_draft_${quiz.id}_${currentUser.id}`);

    submitQuizAttempt({
      assessmentId: quiz.id,
      studentId: currentUser.id,
      studentName: currentUser.name,
      studentRoll: currentUser.rollNumber || 'BSC/CS/2024/042',
      startTime: new Date().toISOString(),
      submittedTime: new Date().toISOString(),
      status: 'graded',
      answers,
      autoScore: score,
      finalScore: score,
      isGraded: true,
      facultyFeedback: 'Automated evaluation completed based on answer key.'
    });
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const isTimeCritical = timeLeft < 180; // less than 3 minutes

  // Review existing attempt screen
  if (existingAttempt || isSubmitted) {
    const finalScore = isSubmitted ? calculatedScore : existingAttempt?.finalScore || 0;
    const isPassed = finalScore >= quiz.passingMarks;

    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm text-center">
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Examination Completed</h2>
          <p className="text-xs text-slate-500 mt-1">
            {quiz.courseCode} · {quiz.title}
          </p>

          <div className="mt-6 p-4 bg-slate-50 rounded-xl inline-block border border-slate-200 min-w-64">
            <div className="text-xs text-slate-500">Official Score Awarded</div>
            <div className="text-3xl font-extrabold text-slate-900 mt-1">
              {finalScore} <span className="text-base text-slate-400 font-normal">/ {quiz.totalMarks}</span>
            </div>
            <div className="mt-2 text-xs font-semibold">
              {isPassed ? (
                <span className="text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded">
                  QUALIFIED / PASSED (Passing Mark: {quiz.passingMarks})
                </span>
              ) : (
                <span className="text-rose-700 bg-rose-100/70 px-2 py-0.5 rounded">
                  NOT QUALIFIED
                </span>
              )}
            </div>
          </div>

          <div className="mt-6 flex justify-center gap-3">
            <button
              onClick={onExit}
              className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-semibold"
            >
              Return to Course / Assessments
            </button>
          </div>
        </div>

        {/* Detailed Question Review */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-2">
            Assessment Question Key & Explanations
          </h3>

          <div className="space-y-4">
            {quiz.questions.map((q, idx) => {
              const studentAns = (existingAttempt ? existingAttempt.answers[q.id] : answers[q.id]);

              return (
                <div key={q.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">Question {idx + 1} ({q.marks} Marks)</span>
                    <span className="font-mono text-slate-500 uppercase">{q.type.replace('_', ' ')}</span>
                  </div>
                  <p className="font-medium text-slate-900 text-sm">{q.prompt}</p>

                  {q.options && (
                    <div className="space-y-1 pl-2">
                      {q.options.map((opt, optIdx) => (
                        <div
                          key={optIdx}
                          className={`p-2 rounded ${
                            q.correctAnswers.includes(optIdx)
                              ? 'bg-emerald-100/80 text-emerald-900 font-semibold border border-emerald-300'
                              : 'text-slate-600'
                          }`}
                        >
                          {String.fromCharCode(65 + optIdx)}. {opt}
                          {q.correctAnswers.includes(optIdx) && ' ✓ (Correct Answer)'}
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="text-[11px] text-slate-600 pt-2 border-t border-slate-200">
                    <span className="font-semibold text-slate-700">Your Response: </span>
                    <span className="font-mono text-sky-800 font-semibold">
                      {studentAns !== undefined && studentAns !== null
                        ? Array.isArray(studentAns)
                          ? studentAns.map((i) => String.fromCharCode(65 + Number(i))).join(', ')
                          : q.options && typeof studentAns === 'number'
                          ? `${String.fromCharCode(65 + studentAns)}. ${q.options[studentAns]}`
                          : String(studentAns)
                        : 'No answer recorded'}
                    </span>
                  </div>

                  {q.explanation && (
                    <div className="text-[11px] text-slate-600 bg-white p-2.5 rounded-lg border border-slate-200 italic">
                      <span className="font-semibold text-slate-800 not-italic">Explanation: </span>
                      {q.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Pre-Start Examination Instructions
  if (!hasStarted) {
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-purple-700 uppercase">
            <span>Tamralipta Mahavidyalaya Online Examination</span>
            <span aria-hidden="true">·</span>
            <span>{quiz.courseCode}</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 mt-1">{quiz.title}</h1>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-500">Duration</span>
            <div className="font-bold text-slate-900 text-sm mt-0.5">{quiz.timeLimitMinutes} Minutes</div>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-500">Total Marks</span>
            <div className="font-bold text-slate-900 text-sm mt-0.5">{quiz.totalMarks} Marks</div>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-500">Passing Marks</span>
            <div className="font-bold text-slate-900 text-sm mt-0.5">{quiz.passingMarks} Marks</div>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-500">Questions</span>
            <div className="font-bold text-slate-900 text-sm mt-0.5">{quiz.questions.length} Items</div>
          </div>
        </div>

        <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-2">
          <div className="font-bold flex items-center gap-1.5 text-amber-800">
            <AlertTriangle className="w-4 h-4" />
            <span>Important Examination Guidelines:</span>
          </div>
          <ul className="list-disc list-inside space-y-1 text-amber-800/90 leading-relaxed">
            <li>Once you click <strong>"Begin Examination"</strong>, the timer starts immediately.</li>
            <li>Your answers are continuously <strong>auto-saved</strong> locally to safeguard against momentary network interruptions.</li>
            <li>Do not refresh or close the examination tab until you click Submit.</li>
            <li>Upon expiry of time, any recorded answers will be automatically submitted.</li>
          </ul>
        </div>

        <div className="flex items-center justify-between pt-2">
          <button
            onClick={onExit}
            className="px-4 py-2 text-xs border border-slate-300 rounded-lg text-slate-700 font-semibold hover:bg-slate-50"
          >
            Cancel & Return
          </button>
          <button
            onClick={() => setHasStarted(true)}
            className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-semibold shadow-xs"
          >
            Begin Examination Now →
          </button>
        </div>
      </div>
    );
  }

  // Active Quiz Interface
  const currentQ = quiz.questions[currentQIndex];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Sticky Top Quiz Control Header */}
      <div className="bg-[#0f2942] text-white rounded-2xl p-4 shadow-md flex items-center justify-between">
        <div>
          <div className="text-xs text-sky-300 font-medium font-mono">{quiz.courseCode}</div>
          <h2 className="font-bold text-sm truncate max-w-sm sm:max-w-md">{quiz.title}</h2>
        </div>

        <div className="flex items-center gap-4">
          {/* Offline Cache status */}
          <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-slate-300">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Auto-saving active</span>
            {lastSavedTime && <span className="font-mono text-slate-400">({lastSavedTime})</span>}
          </div>

          {/* Countdown Clock */}
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-mono font-bold text-sm ${
              isTimeCritical ? 'bg-rose-600 text-white animate-pulse' : 'bg-slate-800 text-sky-300'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left 3 Cols: Active Question */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between min-h-[380px]">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-500 border-b border-slate-100 pb-3 mb-4">
              <span className="font-bold text-slate-800">
                Question {currentQIndex + 1} of {quiz.questions.length}
              </span>
              <span className="font-semibold text-purple-700 font-mono">
                {currentQ.marks} Marks · {currentQ.type.replace('_', ' ').toUpperCase()}
              </span>
            </div>

            <h3 className="font-semibold text-slate-900 text-sm sm:text-base leading-relaxed mb-6">
              {currentQ.prompt}
            </h3>

            {/* MCQ & True/False Single Choice */}
            {(currentQ.type === 'mcq' || currentQ.type === 'true_false') && currentQ.options && (
              <div className="space-y-2.5">
                {currentQ.options.map((opt, optIdx) => {
                  const isChecked = answers[currentQ.id] === optIdx;
                  return (
                    <label
                      key={optIdx}
                      className={`flex items-center gap-3 p-3 rounded-xl border text-xs cursor-pointer transition ${
                        isChecked
                          ? 'border-sky-500 bg-sky-50 text-sky-950 font-semibold'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <input
                        type="radio"
                        name={`q_${currentQ.id}`}
                        checked={isChecked}
                        onChange={() => handleAnswerChange(currentQ.id, optIdx)}
                        className="text-sky-600 focus:ring-sky-500"
                      />
                      <span>
                        <strong>{String.fromCharCode(65 + optIdx)}.</strong> {opt}
                      </span>
                    </label>
                  );
                })}
              </div>
            )}

            {/* Multiple Select */}
            {currentQ.type === 'multiple_select' && currentQ.options && (
              <div className="space-y-2.5">
                <p className="text-[11px] text-slate-500 mb-2 italic">
                  Select all options that apply:
                </p>
                {currentQ.options.map((opt, optIdx) => {
                  const isChecked = ((answers[currentQ.id] as number[]) || []).includes(optIdx);
                  return (
                    <label
                      key={optIdx}
                      className={`flex items-center gap-3 p-3 rounded-xl border text-xs cursor-pointer transition ${
                        isChecked
                          ? 'border-sky-500 bg-sky-50 text-sky-950 font-semibold'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleMultipleSelectToggle(currentQ.id, optIdx)}
                        className="text-sky-600 rounded focus:ring-sky-500"
                      />
                      <span>
                        <strong>{String.fromCharCode(65 + optIdx)}.</strong> {opt}
                      </span>
                    </label>
                  );
                })}
              </div>
            )}

            {/* Fill in the blank / Short answer */}
            {(currentQ.type === 'fill_blank' || currentQ.type === 'short_answer') && (
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700">Enter Your Answer:</label>
                <input
                  type="text"
                  value={answers[currentQ.id] || ''}
                  onChange={(e) => handleAnswerChange(currentQ.id, e.target.value)}
                  placeholder="Type exact answer..."
                  className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:outline-none focus:border-sky-500"
                />
              </div>
            )}

            {/* Descriptive */}
            {currentQ.type === 'descriptive' && (
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700">Descriptive Explanation:</label>
                <textarea
                  rows={5}
                  value={answers[currentQ.id] || ''}
                  onChange={(e) => handleAnswerChange(currentQ.id, e.target.value)}
                  placeholder="Formulate your detailed answer here..."
                  className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:outline-none focus:border-sky-500"
                />
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-100 mt-6">
            <button
              disabled={currentQIndex === 0}
              onClick={() => setCurrentQIndex((prev) => prev - 1)}
              className="inline-flex items-center gap-1 px-3.5 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            {currentQIndex === quiz.questions.length - 1 ? (
              <button
                onClick={handleSubmitQuiz}
                className="inline-flex items-center gap-1.5 px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Final Exam</span>
              </button>
            ) : (
              <button
                onClick={() => setCurrentQIndex((prev) => prev + 1)}
                className="inline-flex items-center gap-1 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-semibold shadow-xs"
              >
                <span>Next Question</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Right Col: Question Navigation Palette */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
          <h3 className="font-bold text-xs text-slate-900 uppercase tracking-wider">
            Question Palette
          </h3>

          <div className="grid grid-cols-4 gap-2">
            {quiz.questions.map((q, idx) => {
              const isAnswered = answers[q.id] !== undefined && answers[q.id] !== '';
              const isCurrent = currentQIndex === idx;

              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentQIndex(idx)}
                  className={`h-9 rounded-lg font-mono text-xs font-bold transition flex items-center justify-center ${
                    isCurrent
                      ? 'border-2 border-purple-600 bg-purple-50 text-purple-900'
                      : isAnswered
                      ? 'bg-emerald-500 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          <div className="space-y-1.5 pt-3 border-t border-slate-100 text-[11px] text-slate-600">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-emerald-500" />
              <span>Answered</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-slate-100 border border-slate-300" />
              <span>Not Answered</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded border-2 border-purple-600 bg-purple-50" />
              <span>Current Question</span>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100">
            <button
              onClick={handleSubmitQuiz}
              className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition shadow-xs"
            >
              Submit Examination
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
