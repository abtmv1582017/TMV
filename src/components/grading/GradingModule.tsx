import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { GradeItem } from '../../types';
import {
  GraduationCap,
  Printer,
  CheckCircle2,
  Download,
  Building2,
  Award,
  Filter
} from 'lucide-react';

export const GradingModule: React.FC = () => {
  const {
    grades,
    courses,
    users,
    currentUser,
    publishCourseGrades,
    settings,
    language
  } = useApp();

  const [selectedCourseFilter, setSelectedCourseFilter] = useState('all');
  const [showPrintModal, setShowPrintModal] = useState(false);

  const canPublish =
    currentUser.role === 'faculty' ||
    currentUser.role === 'dept_head' ||
    currentUser.role === 'super_admin' ||
    currentUser.role === 'principal';

  const filteredGrades = grades.filter((g) => {
    if (currentUser.role === 'student') {
      return g.studentId === currentUser.id && g.status === 'published';
    }
    if (selectedCourseFilter === 'all') return true;
    return g.courseId === selectedCourseFilter;
  });

  const studentGrades = grades.filter((g) => g.studentId === currentUser.id && g.status === 'published');
  const sgpa =
    studentGrades.length > 0
      ? (studentGrades.reduce((acc, curr) => acc + curr.gpa, 0) / studentGrades.length).toFixed(2)
      : '9.33';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            {language === 'bn' ? 'একাডেমিক গ্রেড ও ফলাফল' : 'Academic Grading & Results Transcript'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Tamralipta Mahavidyalaya · Choice Based Credit System (CBCS) / Vidyasagar University Scale
          </p>
        </div>

        <div className="flex items-center gap-2">
          {currentUser.role === 'student' && (
            <button
              onClick={() => setShowPrintModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-semibold shadow-xs transition"
            >
              <Printer className="w-4 h-4" />
              <span>Official Grade Card (Print)</span>
            </button>
          )}

          {canPublish && (
            <button
              onClick={() => {
                if (selectedCourseFilter !== 'all') {
                  publishCourseGrades(selectedCourseFilter);
                } else {
                  courses.forEach((c) => publishCourseGrades(c.id));
                }
                alert('Marks published successfully to student portals!');
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs transition"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Publish All Grades</span>
            </button>
          )}
        </div>
      </div>

      {/* Student Summary Card */}
      {currentUser.role === 'student' && (
        <div className="bg-gradient-to-r from-[#0f2942] to-[#1e3a8a] text-white rounded-2xl p-6 shadow-md border border-[#274f75]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-semibold text-sky-300 uppercase tracking-wider">
                Official Semester Transcript
              </span>
              <h2 className="text-2xl font-bold mt-1">{currentUser.name}</h2>
              <div className="text-xs text-slate-300 mt-1 flex flex-wrap items-center gap-2">
                <span>Roll: <strong className="font-mono text-white">{currentUser.rollNumber}</strong></span>
                <span aria-hidden="true">·</span>
                <span>B.Sc. (Honours) Computer Science</span>
                <span aria-hidden="true">·</span>
                <span>Semester 3</span>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-xs p-4 rounded-xl border border-white/20 text-center sm:text-right">
              <div className="text-xs text-slate-300">Semester SGPA</div>
              <div className="text-3xl font-extrabold text-sky-300 mt-0.5">{sgpa}</div>
              <div className="text-[11px] text-emerald-300 font-semibold mt-0.5">First Class with Distinction</div>
            </div>
          </div>
        </div>
      )}

      {/* Faculty Filter Bar */}
      {canPublish && (
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
            <Filter className="w-4 h-4 text-slate-400" />
            <span>Filter Course Marksheet:</span>
          </div>

          <select
            value={selectedCourseFilter}
            onChange={(e) => setSelectedCourseFilter(e.target.value)}
            className="text-xs border border-slate-300 rounded-lg px-3 py-2 bg-white text-slate-700"
          >
            <option value="all">All Courses</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.code}: {c.title}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Grade Items Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-x-auto">
        <table className="w-full text-xs text-left text-slate-700">
          <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
            <tr>
              <th className="py-3 px-4">Course</th>
              {currentUser.role !== 'student' && (
                <>
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Roll Number</th>
                </>
              )}
              <th className="py-3 px-4 text-center">Assignments (30)</th>
              <th className="py-3 px-4 text-center">Online Quizzes (20)</th>
              <th className="py-3 px-4 text-center">Mid-Term Exam (50)</th>
              <th className="py-3 px-4 text-center">Total (100)</th>
              <th className="py-3 px-4 text-center">Letter Grade</th>
              <th className="py-3 px-4 text-center">Grade Point</th>
              <th className="py-3 px-4 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredGrades.map((g) => {
              const totalScore = g.assignmentMarks + g.quizMarks + g.midtermMarks;
              return (
                <tr key={g.id} className="hover:bg-slate-50 transition">
                  <td className="py-3.5 px-4 font-semibold text-slate-900">
                    <div className="font-mono text-sky-800 text-xs">{g.courseCode}</div>
                    <div className="text-[11px] text-slate-500 font-normal">{g.courseTitle}</div>
                  </td>
                  {currentUser.role !== 'student' && (
                    <>
                      <td className="py-3.5 px-4 font-medium text-slate-900">{g.studentName}</td>
                      <td className="py-3.5 px-4 font-mono text-slate-500">{g.studentRoll}</td>
                    </>
                  )}
                  <td className="py-3.5 px-4 text-center">
                    {g.assignmentMarks} / {g.assignmentTotal}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    {g.quizMarks} / {g.quizTotal}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    {g.midtermMarks} / {g.midtermTotal}
                  </td>
                  <td className="py-3.5 px-4 text-center font-bold text-slate-900">
                    {totalScore} / 100
                  </td>
                  <td className="py-3.5 px-4 text-center font-bold text-sky-900 text-sm">
                    {g.finalGrade}
                  </td>
                  <td className="py-3.5 px-4 text-center font-semibold text-slate-800">
                    {g.gpa.toFixed(1)}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <span className="font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded text-[10px]">
                      {g.status.toUpperCase()}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Official Grade Card Modal (Print Ready) */}
      {showPrintModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto print:p-0 print:border-0 print:shadow-none">
            {/* Header */}
            <div className="text-center border-b-2 border-slate-800 pb-4 mb-6">
              <h2 className="text-xl font-bold uppercase tracking-tight text-slate-900">
                Tamralipta Mahavidyalaya
              </h2>
              <div className="text-xs text-slate-600 font-medium">
                Tamluk, Purba Medinipur, West Bengal - 721636
              </div>
              <div className="text-[11px] text-slate-500">
                Affiliated to Vidyasagar University · Grade A Accredited by NAAC
              </div>
              <div className="mt-3 font-bold text-sm text-sky-900 bg-sky-50 py-1 rounded">
                STATEMENT OF SEMESTER ACADEMIC PERFORMANCE (GRADE CARD)
              </div>
            </div>

            {/* Student Info */}
            <div className="grid grid-cols-2 gap-4 text-xs mb-6 border-b border-slate-200 pb-4">
              <div>
                <div>Name of Student: <strong>{currentUser.name}</strong></div>
                <div className="mt-1">Roll & Number: <strong className="font-mono">{currentUser.rollNumber}</strong></div>
                <div className="mt-1">Department: <strong>Computer Science</strong></div>
              </div>
              <div>
                <div>Programme: <strong>B.Sc. (Honours)</strong></div>
                <div className="mt-1">Semester: <strong>Semester 3 (CBCS)</strong></div>
                <div className="mt-1">Academic Session: <strong>2025-2026</strong></div>
              </div>
            </div>

            {/* Marks Table */}
            <table className="w-full text-xs text-left text-slate-800 mb-6">
              <thead className="bg-slate-100 border-b border-slate-300">
                <tr>
                  <th className="py-2 px-3">Course Code</th>
                  <th className="py-2 px-3">Course Title</th>
                  <th className="py-2 px-3 text-center">Marks (100)</th>
                  <th className="py-2 px-3 text-center">Letter Grade</th>
                  <th className="py-2 px-3 text-center">Grade Point</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {studentGrades.map((g) => (
                  <tr key={g.id}>
                    <td className="py-2 px-3 font-mono font-semibold">{g.courseCode}</td>
                    <td className="py-2 px-3">{g.courseTitle}</td>
                    <td className="py-2 px-3 text-center font-semibold">
                      {g.assignmentMarks + g.quizMarks + g.midtermMarks}
                    </td>
                    <td className="py-2 px-3 text-center font-bold text-sky-900">{g.finalGrade}</td>
                    <td className="py-2 px-3 text-center font-semibold">{g.gpa.toFixed(1)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* SGPA Summary & Signatures */}
            <div className="flex items-center justify-between border-t-2 border-slate-800 pt-4 text-xs">
              <div>
                <div className="font-bold text-slate-900 text-sm">Semester SGPA: {sgpa}</div>
                <div className="text-[11px] text-slate-600">Result: PASSED IN FIRST CLASS WITH DISTINCTION</div>
                <div className="text-[10px] text-slate-400 mt-1">Date of Publication: 28th September 2026</div>
              </div>

              <div className="text-center">
                <div className="h-10 border-b border-slate-400 w-36 mb-1" />
                <div className="text-[11px] font-semibold text-slate-800">Controller of Examinations</div>
                <div className="text-[10px] text-slate-500">Tamralipta Mahavidyalaya</div>
              </div>
            </div>

            {/* Print & Close Controls */}
            <div className="flex justify-end gap-2 mt-8 pt-4 border-t border-slate-200 print:hidden">
              <button
                onClick={() => setShowPrintModal(false)}
                className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Close
              </button>
              <button
                onClick={handlePrint}
                className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>Print Document</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
