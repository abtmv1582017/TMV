import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AttendanceRecord } from '../../types';
import {
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Calendar,
  Download,
  Plus,
  Users
} from 'lucide-react';

export const AttendanceModule: React.FC = () => {
  const { attendance, courses, users, currentUser, markAttendance, language } = useApp();

  const [selectedCourseId, setSelectedCourseId] = useState<string>(courses[0]?.id || 'course-cs-301');
  const [attDate, setAttDate] = useState<string>(new Date().toISOString().substring(0, 10));
  const [topicCovered, setTopicCovered] = useState<string>('');
  const [showMarkModal, setShowMarkModal] = useState<boolean>(false);

  const selectedCourse = courses.find((c) => c.id === selectedCourseId) || courses[0];
  const courseAttendance = attendance.filter((a) => a.courseId === selectedCourseId);

  // Enrolled students in this course
  const enrolledStudents = users.filter(
    (u) => u.role === 'student' && (u.enrolledCourseIds?.includes(selectedCourseId) || u.departmentId === selectedCourse.departmentId)
  );

  // State for recording attendance: studentId -> boolean (present/absent)
  const [presentMap, setPresentMap] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    enrolledStudents.forEach((s) => {
      initial[s.id] = true;
    });
    return initial;
  });

  const canMark =
    currentUser.role === 'faculty' ||
    currentUser.role === 'dept_head' ||
    currentUser.role === 'super_admin';

  const handleSaveAttendance = (e: React.FormEvent) => {
    e.preventDefault();
    const presentIds: string[] = [];
    const absentIds: string[] = [];

    enrolledStudents.forEach((s) => {
      if (presentMap[s.id]) {
        presentIds.push(s.id);
      } else {
        absentIds.push(s.id);
      }
    });

    markAttendance({
      courseId: selectedCourseId,
      date: attDate,
      topicCovered: topicCovered || 'Regular CBCS Lecture / Practical Session',
      facultyId: currentUser.id,
      presentStudentIds: presentIds,
      absentStudentIds: absentIds
    });

    setTopicCovered('');
    setShowMarkModal(false);
  };

  // Compute student attendance percentage in this course
  const totalClasses = courseAttendance.length;
  const getStudentStats = (studentId: string) => {
    if (totalClasses === 0) return { attended: 0, total: 0, percent: 100 };
    const attended = courseAttendance.filter((a) => a.presentStudentIds.includes(studentId)).length;
    const percent = Math.round((attended / totalClasses) * 100);
    return { attended, total: totalClasses, percent };
  };

  const handleExportCSV = () => {
    let csv = 'Student Name,Roll Number,Attended Classes,Total Classes,Attendance Percentage,Eligibility\n';
    enrolledStudents.forEach((s) => {
      const stats = getStudentStats(s.id);
      const eligible = stats.percent >= 75 ? 'Eligible' : 'Attendance Shortage (<75%)';
      csv += `"${s.name}","${s.rollNumber || ''}",${stats.attended},${stats.total},"${stats.percent}%","${eligible}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance_${selectedCourse.code}_${new Date().toISOString().substring(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            {language === 'bn' ? 'উপস্থিতি নথি ও নিরীক্ষণ' : 'Academic Attendance Tracker'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Tamralipta Mahavidyalaya · Vidyasagar University 75% Mandatory Attendance Norm
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition"
          >
            <Download className="w-4 h-4" />
            <span>Export Register (CSV)</span>
          </button>

          {canMark && (
            <button
              onClick={() => setShowMarkModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-semibold shadow-xs transition"
            >
              <Plus className="w-4 h-4" />
              <span>Record Daily Attendance</span>
            </button>
          )}
        </div>
      </div>

      {/* Course Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <label className="text-xs font-semibold text-slate-700">Selected Course:</label>
          <select
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(e.target.value)}
            className="text-xs border border-slate-300 rounded-lg px-3 py-2 bg-white text-slate-800 font-medium"
          >
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.code}: {c.title}
              </option>
            ))}
          </select>
        </div>

        <div className="text-xs text-slate-500 flex items-center gap-4">
          <span>Total Lectures Held: <strong className="text-slate-900">{totalClasses}</strong></span>
          <span>Enrolled Strength: <strong className="text-slate-900">{enrolledStudents.length}</strong></span>
        </div>
      </div>

      {/* Student Personal View if Student */}
      {currentUser.role === 'student' && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          {(() => {
            const stats = getStudentStats(currentUser.id);
            const isDeficient = stats.percent < 75;

            return (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Your Course Attendance Status</h3>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {selectedCourse.code}: {selectedCourse.title}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-2xl font-extrabold text-slate-900">{stats.percent}%</div>
                    <div className="text-[11px] text-slate-500">
                      {stats.attended} of {stats.total} Classes Attended
                    </div>
                  </div>

                  {isDeficient ? (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-lg">
                      <AlertTriangle className="w-4 h-4 text-rose-600" />
                      <span>Warning: Below 75% Threshold</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold rounded-lg">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Eligible for Semester Examination</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Attendance Roster Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-x-auto">
        <table className="w-full text-xs text-left text-slate-700">
          <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
            <tr>
              <th className="py-3 px-4">Student Name</th>
              <th className="py-3 px-4">Roll Number</th>
              <th className="py-3 px-4 text-center">Classes Attended</th>
              <th className="py-3 px-4 text-center">Attendance %</th>
              <th className="py-3 px-4 text-center">Eligibility (≥75%)</th>
              <th className="py-3 px-4 text-right">Remarks</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {enrolledStudents.map((s) => {
              const stats = getStudentStats(s.id);
              const isEligible = stats.percent >= 75;

              return (
                <tr key={s.id} className="hover:bg-slate-50 transition">
                  <td className="py-3 px-4 font-semibold text-slate-900">{s.name}</td>
                  <td className="py-3 px-4 font-mono text-slate-500">{s.rollNumber || 'BSC/CS/042'}</td>
                  <td className="py-3 px-4 text-center font-medium">
                    {stats.attended} / {stats.total}
                  </td>
                  <td className="py-3 px-4 text-center font-bold">
                    <span className={isEligible ? 'text-emerald-700' : 'text-rose-600'}>
                      {stats.percent}%
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    {isEligible ? (
                      <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Eligible
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded text-[11px]">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        Shortage
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right text-[11px] text-slate-500">
                    {isEligible ? 'Regular Attendance' : 'Condonation Fee / Medical Requisite'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Record Daily Attendance Modal */}
      {showMarkModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <h2 className="text-base font-bold text-slate-900 mb-1">
              Mark Class Attendance - {selectedCourse.code}
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              Toggle student presence for the scheduled lecture session.
            </p>

            <form onSubmit={handleSaveAttendance} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700">Date:</label>
                  <input
                    type="date"
                    required
                    value={attDate}
                    onChange={(e) => setAttDate(e.target.value)}
                    className="w-full text-xs mt-1 px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700">Topic Covered:</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Red-Black Trees balancing"
                    value={topicCovered}
                    onChange={(e) => setTopicCovered(e.target.value)}
                    className="w-full text-xs mt-1 px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="border border-slate-200 rounded-xl p-3 bg-slate-50 max-h-60 overflow-y-auto space-y-2">
                <div className="text-xs font-bold text-slate-700 mb-1">Student Attendance Checklist:</div>
                {enrolledStudents.map((s) => (
                  <div
                    key={s.id}
                    className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200 text-xs"
                  >
                    <div>
                      <span className="font-semibold text-slate-900">{s.name}</span>
                      <span className="font-mono text-[10px] text-slate-500 ml-2">{s.rollNumber}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setPresentMap({ ...presentMap, [s.id]: true })}
                        className={`px-2.5 py-1 rounded text-[11px] font-semibold transition ${
                          presentMap[s.id]
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        Present
                      </button>
                      <button
                        type="button"
                        onClick={() => setPresentMap({ ...presentMap, [s.id]: false })}
                        className={`px-2.5 py-1 rounded text-[11px] font-semibold transition ${
                          !presentMap[s.id]
                            ? 'bg-rose-600 text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        Absent
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowMarkModal(false)}
                  className="px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-semibold"
                >
                  Save Attendance Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
