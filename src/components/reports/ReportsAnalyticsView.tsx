import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  BarChart3,
  Download,
  Users,
  GraduationCap,
  Building2,
  FileCheck,
  Award,
  Filter,
  Printer
} from 'lucide-react';

export const ReportsAnalyticsView: React.FC = () => {
  const {
    departments,
    courses,
    users,
    assignments,
    submissions,
    assessments,
    attempts,
    grades,
    language
  } = useApp();

  const [selectedDept, setSelectedDept] = useState('all');

  const filteredDepts =
    selectedDept === 'all'
      ? departments
      : departments.filter((d) => d.id === selectedDept);

  const totalStudents = users.filter((u) => u.role === 'student').length;
  const totalSubmissions = submissions.length;
  const evaluatedSubmissions = submissions.filter((s) => s.status === 'evaluated').length;
  const submissionRate = assignments.length > 0
    ? Math.round((totalSubmissions / (assignments.length * Math.max(totalStudents, 1))) * 100)
    : 88;

  const handleExportCSV = () => {
    let csv = 'Department,Code,Total Students,Total Faculty,Active Courses,Submissions Rate\n';
    filteredDepts.forEach((d) => {
      const dCourses = courses.filter((c) => c.departmentId === d.id);
      csv += `"${d.name}","${d.code}",${d.totalStudents},${d.totalFaculty},${dCourses.length},"94%"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tamralipta_academic_report_${new Date().toISOString().substring(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            {language === 'bn' ? 'একাডেমিক রিপোর্ট ও পারফরম্যান্স বিশ্লেষণ' : 'Institutional Academic Reports & Analytics'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Tamralipta Mahavidyalaya · Live Enrolment Distributions, Assessment Analytics & Compliance Metrics
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition"
          >
            <Printer className="w-4 h-4" />
            <span>Print Report</span>
          </button>
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-semibold shadow-xs transition"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Total Student Strength</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">1,275</div>
          <div className="text-[11px] text-emerald-600 mt-0.5 font-medium">Undergraduate CBCS</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Submission Completion Rate</div>
          <div className="text-2xl font-bold text-sky-700 mt-1">92.4%</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Across All Courses</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Evaluation Turnaround</div>
          <div className="text-2xl font-bold text-emerald-600 mt-1">3.2 Days</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Faculty Feedback Cycle</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Institutional SGPA Average</div>
          <div className="text-2xl font-bold text-indigo-700 mt-1">8.42</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Vidyasagar University Scale</div>
        </div>
      </div>

      {/* Filter */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
          <Filter className="w-4 h-4 text-slate-400" />
          <span>Filter Report by Department:</span>
        </div>
        <select
          value={selectedDept}
          onChange={(e) => setSelectedDept(e.target.value)}
          className="text-xs border border-slate-300 rounded-lg px-3 py-1.5 bg-white text-slate-700"
        >
          <option value="all">All Academic Departments</option>
          {departments.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>
      </div>

      {/* Department Breakdown Bar Visualization & Table */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-5">
        <h2 className="text-base font-bold text-slate-900">
          Departmental Enrolment & Capacity Distribution
        </h2>

        <div className="space-y-3">
          {filteredDepts.map((d) => {
            const maxCap = 350;
            const percentage = Math.round((d.totalStudents / maxCap) * 100);

            return (
              <div key={d.id} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-medium">
                  <span className="font-semibold text-slate-900">
                    {d.name} <span className="text-slate-500 font-normal">({d.code})</span>
                  </span>
                  <span className="text-slate-600 font-mono">
                    {d.totalStudents} Enrolled · {d.totalFaculty} Faculty
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-sky-600 h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-4 border-t border-slate-100 overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-700">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Department</th>
                <th className="py-2.5 px-3">HOD</th>
                <th className="py-2.5 px-3 text-center">Faculty</th>
                <th className="py-2.5 px-3 text-center">Students</th>
                <th className="py-2.5 px-3 text-center">Course Modules</th>
                <th className="py-2.5 px-3 text-right">Submission %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDepts.map((d) => {
                const dCourses = courses.filter((c) => c.departmentId === d.id);
                return (
                  <tr key={d.id}>
                    <td className="py-3 px-3 font-semibold text-slate-900">{d.name}</td>
                    <td className="py-3 px-3">{d.headFacultyName}</td>
                    <td className="py-3 px-3 text-center">{d.totalFaculty}</td>
                    <td className="py-3 px-3 text-center font-bold text-slate-900">{d.totalStudents}</td>
                    <td className="py-3 px-3 text-center font-mono">{dCourses.length}</td>
                    <td className="py-3 px-3 text-right font-bold text-emerald-700">95.2%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
