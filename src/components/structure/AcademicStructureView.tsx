import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Layers,
  Plus,
  Building2,
  Calendar,
  BookOpen,
  CheckCircle2,
  GraduationCap
} from 'lucide-react';

export const AcademicStructureView: React.FC = () => {
  const {
    sessions,
    departments,
    programmes,
    courses,
    addAcademicSession,
    addDepartment,
    addProgramme,
    language
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'sessions' | 'departments' | 'programmes'>('departments');

  // New session modal
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [sessionName, setSessionName] = useState('');
  const [sessionYear, setSessionYear] = useState('2026-2027');

  // New department modal
  const [showDeptModal, setShowDeptModal] = useState(false);
  const [deptCode, setDeptCode] = useState('');
  const [deptName, setDeptName] = useState('');
  const [deptNameBn, setDeptNameBn] = useState('');
  const [deptDesc, setDeptDesc] = useState('');

  // New programme modal
  const [showProgModal, setShowProgModal] = useState(false);
  const [progCode, setProgCode] = useState('');
  const [progName, setProgName] = useState('');
  const [progDeptId, setProgDeptId] = useState(departments[0]?.id || 'dept-cs');

  const handleCreateSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sessionName.trim()) return;
    addAcademicSession({
      name: sessionName.trim(),
      year: sessionYear.trim(),
      status: 'active',
      startDate: '2026-07-01',
      endDate: '2026-12-31',
      isCurrent: false
    });
    setSessionName('');
    setShowSessionModal(false);
  };

  const handleCreateDept = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deptCode.trim() || !deptName.trim()) return;
    addDepartment({
      code: deptCode.toUpperCase().trim(),
      name: deptName.trim(),
      nameBengali: deptNameBn.trim() || deptName.trim(),
      description: deptDesc.trim() || 'Academic Department at Tamralipta Mahavidyalaya.',
      totalStudents: 0,
      totalFaculty: 1
    });
    setDeptCode('');
    setDeptName('');
    setDeptNameBn('');
    setDeptDesc('');
    setShowDeptModal(false);
  };

  const handleCreateProg = (e: React.FormEvent) => {
    e.preventDefault();
    if (!progCode.trim() || !progName.trim()) return;
    addProgramme({
      code: progCode.toUpperCase().trim(),
      name: progName.trim(),
      departmentId: progDeptId,
      degreeType: 'UG',
      durationYears: 3,
      totalSemesters: 6
    });
    setProgCode('');
    setProgName('');
    setShowProgModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            {language === 'bn' ? 'প্রাতিষ্ঠানিক শিক্ষা কাঠামো' : 'Academic Structure Configuration'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Tamralipta Mahavidyalaya · Hierarchical Mapping of Sessions, Departments & Degree Programmes
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeSubTab === 'sessions' && (
            <button
              onClick={() => setShowSessionModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-semibold shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add Session</span>
            </button>
          )}
          {activeSubTab === 'departments' && (
            <button
              onClick={() => setShowDeptModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-semibold shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add Department</span>
            </button>
          )}
          {activeSubTab === 'programmes' && (
            <button
              onClick={() => setShowProgModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-semibold shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add Programme</span>
            </button>
          )}
        </div>
      </div>

      {/* Sub-tabs */}
      <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg w-fit">
        <button
          onClick={() => setActiveSubTab('departments')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition ${
            activeSubTab === 'departments' ? 'bg-white text-slate-900 font-semibold shadow-xs' : 'text-slate-600'
          }`}
        >
          Departments ({departments.length})
        </button>
        <button
          onClick={() => setActiveSubTab('programmes')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition ${
            activeSubTab === 'programmes' ? 'bg-white text-slate-900 font-semibold shadow-xs' : 'text-slate-600'
          }`}
        >
          Programmes ({programmes.length})
        </button>
        <button
          onClick={() => setActiveSubTab('sessions')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition ${
            activeSubTab === 'sessions' ? 'bg-white text-slate-900 font-semibold shadow-xs' : 'text-slate-600'
          }`}
        >
          Academic Sessions ({sessions.length})
        </button>
      </div>

      {/* Departments view */}
      {activeSubTab === 'departments' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {departments.map((d) => {
            const dCourses = courses.filter((c) => c.departmentId === d.id);
            return (
              <div key={d.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                    <span className="font-mono font-bold text-sky-800 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                      {d.code}
                    </span>
                    <span>{d.totalFaculty} Faculty Members</span>
                  </div>
                  <h3 className="font-bold text-base text-slate-900">{d.name}</h3>
                  <div className="text-xs text-slate-500 mt-0.5">{d.nameBengali}</div>
                  <p className="text-xs text-slate-600 mt-2 line-clamp-2">{d.description}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>HOD: <strong className="text-slate-800">{d.headFacultyName || 'To be appointed'}</strong></span>
                  <span className="font-semibold text-sky-800">{dCourses.length} Courses</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Programmes view */}
      {activeSubTab === 'programmes' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-700">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-4">Code</th>
                <th className="py-2.5 px-4">Degree Programme Name</th>
                <th className="py-2.5 px-4">Department</th>
                <th className="py-2.5 px-4 text-center">Type</th>
                <th className="py-2.5 px-4 text-center">Duration</th>
                <th className="py-2.5 px-4 text-right">Semesters</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {programmes.map((p) => {
                const dept = departments.find((d) => d.id === p.departmentId);
                return (
                  <tr key={p.id}>
                    <td className="py-3 px-4 font-mono font-bold text-sky-800">{p.code}</td>
                    <td className="py-3 px-4 font-semibold text-slate-900">{p.name}</td>
                    <td className="py-3 px-4 text-slate-600">{dept?.name}</td>
                    <td className="py-3 px-4 text-center font-medium">{p.degreeType}</td>
                    <td className="py-3 px-4 text-center">{p.durationYears} Years</td>
                    <td className="py-3 px-4 text-right font-bold text-slate-900">{p.totalSemesters} Semesters</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Sessions view */}
      {activeSubTab === 'sessions' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs divide-y divide-slate-100">
          {sessions.map((s) => (
            <div key={s.id} className="p-4 flex items-center justify-between text-xs">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-slate-900">{s.name}</span>
                  {s.isCurrent && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      CURRENT ACTIVE SESSION
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  Start: {s.startDate} · End: {s.endDate}
                </div>
              </div>

              <span className="font-semibold text-slate-600 capitalize bg-slate-100 px-2.5 py-1 rounded">
                {s.status}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Add Department Modal */}
      {showDeptModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h2 className="text-base font-bold text-slate-900 mb-1">Add Academic Department</h2>
            <form onSubmit={handleCreateDept} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700">Code:</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. BOT"
                    value={deptCode}
                    onChange={(e) => setDeptCode(e.target.value)}
                    className="w-full text-xs mt-1 px-3 py-2 border border-slate-300 rounded-lg uppercase"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700">Name (English):</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Department of Botany"
                    value={deptName}
                    onChange={(e) => setDeptName(e.target.value)}
                    className="w-full text-xs mt-1 px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700">Name (বাংলা / Bengali):</label>
                <input
                  type="text"
                  placeholder="e.g. উদ্ভিদবিদ্যা বিভাগ"
                  value={deptNameBn}
                  onChange={(e) => setDeptNameBn(e.target.value)}
                  className="w-full text-xs mt-1 px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700">Description:</label>
                <textarea
                  rows={2}
                  value={deptDesc}
                  onChange={(e) => setDeptDesc(e.target.value)}
                  placeholder="Academic scope, laboratories, and specializations..."
                  className="w-full text-xs mt-1 px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowDeptModal(false)}
                  className="px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-semibold"
                >
                  Save Department
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Programme Modal */}
      {showProgModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h2 className="text-base font-bold text-slate-900 mb-1">Add Degree Programme</h2>
            <form onSubmit={handleCreateProg} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700">Programme Code:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. BSC-PHY-H"
                  value={progCode}
                  onChange={(e) => setProgCode(e.target.value)}
                  className="w-full text-xs mt-1 px-3 py-2 border border-slate-300 rounded-lg uppercase"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700">Programme Title:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. B.Sc. (Honours) in Physics"
                  value={progName}
                  onChange={(e) => setProgName(e.target.value)}
                  className="w-full text-xs mt-1 px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700">Parent Department:</label>
                <select
                  value={progDeptId}
                  onChange={(e) => setProgDeptId(e.target.value)}
                  className="w-full text-xs mt-1 px-3 py-2 border border-slate-300 rounded-lg bg-white"
                >
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowProgModal(false)}
                  className="px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-semibold"
                >
                  Save Programme
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Session Modal */}
      {showSessionModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h2 className="text-base font-bold text-slate-900 mb-1">Create Academic Session</h2>
            <form onSubmit={handleCreateSession} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700">Session Name:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 2026-2027 (Odd Semester)"
                  value={sessionName}
                  onChange={(e) => setSessionName(e.target.value)}
                  className="w-full text-xs mt-1 px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700">Academic Year:</label>
                <input
                  type="text"
                  required
                  placeholder="2026-2027"
                  value={sessionYear}
                  onChange={(e) => setSessionYear(e.target.value)}
                  className="w-full text-xs mt-1 px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSessionModal(false)}
                  className="px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-semibold"
                >
                  Save Session
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
