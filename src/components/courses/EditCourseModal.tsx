import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Course } from '../../types';
import {
  X,
  Save,
  BookOpen,
  Sparkles,
  Layers,
  GraduationCap,
  Users,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface EditCourseModalProps {
  course: Course;
  onClose: () => void;
  onSaved?: (updatedCourse: Course) => void;
}

export const EditCourseModal: React.FC<EditCourseModalProps> = ({
  course,
  onClose,
  onSaved
}) => {
  const { departments, users, updateCourse, language } = useApp();

  const [code, setCode] = useState(course.code);
  const [title, setTitle] = useState(course.title);
  const [titleBengali, setTitleBengali] = useState(course.titleBengali || '');
  const [departmentId, setDepartmentId] = useState(course.departmentId);
  const [semester, setSemester] = useState<number>(course.semester);
  const [credits, setCredits] = useState<number>(course.credits);
  const [facultyId, setFacultyId] = useState(course.facultyId);
  const [status, setStatus] = useState<Course['status']>(course.status);
  const [description, setDescription] = useState(course.description || '');
  const [syllabusSummary, setSyllabusSummary] = useState(course.syllabusSummary || '');

  const [courseType, setCourseType] = useState<'CC' | 'GE' | 'DSE' | 'SEC'>('CC');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Faculty list for assignment
  const facultyMembers = users.filter((u) => u.role === 'faculty' || u.role === 'dept_head');

  const handleAutoGenerateCourseCode = () => {
    const dept = departments.find((d) => d.id === departmentId);
    const deptPrefix = dept ? dept.code.toUpperCase() : 'GEN';
    // e.g., CMSA-CC-301 or MATH-GE-101
    const generated = `${deptPrefix}-${courseType}-${semester}0${Math.floor(Math.random() * 8) + 1}`;
    setCode(generated);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || !title.trim()) {
      setErrorMessage('Please provide both Course Code and Course Title.');
      return;
    }

    const assignedTeacher = facultyMembers.find((f) => f.id === facultyId) || {
      name: course.facultyName
    };

    const updated: Course = {
      ...course,
      code: code.trim().toUpperCase(),
      title: title.trim(),
      titleBengali: titleBengali.trim() || undefined,
      departmentId,
      semester: Number(semester),
      credits: Number(credits),
      facultyId,
      facultyName: assignedTeacher.name,
      status,
      description: description.trim(),
      syllabusSummary: syllabusSummary.trim()
    };

    updateCourse(updated);
    setSuccessMessage('Course details updated successfully!');
    if (onSaved) onSaved(updated);
    setTimeout(() => {
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0f2942] to-[#1e3a8a] text-white p-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-sky-300">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-semibold text-sky-300 uppercase tracking-wider">
                Course Catalog & Syllabus Editor
              </div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                Edit Course: {course.code}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-600" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Code & Auto Code Generator */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-700">Course Code / Identifier:</label>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-500">Auto Generator:</span>
                <select
                  value={courseType}
                  onChange={(e) => setCourseType(e.target.value as any)}
                  className="text-[11px] border border-slate-300 rounded px-1.5 py-0.5 bg-white font-mono"
                >
                  <option value="CC">Core Course (CC)</option>
                  <option value="GE">Generic Elective (GE)</option>
                  <option value="DSE">Discipline Specific (DSE)</option>
                  <option value="SEC">Skill Enhancement (SEC)</option>
                </select>
                <button
                  type="button"
                  onClick={handleAutoGenerateCourseCode}
                  className="text-xs font-bold text-sky-700 hover:text-sky-900 inline-flex items-center gap-1 cursor-pointer bg-sky-50 px-2 py-0.5 rounded border border-sky-200"
                >
                  <Sparkles className="w-3 h-3 text-sky-600" />
                  <span>Auto-Name Code</span>
                </button>
              </div>
            </div>
            <input
              type="text"
              required
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="e.g. CMSA-CC-301"
              className="w-full text-xs px-3.5 py-2.5 border border-slate-300 rounded-xl font-mono font-bold text-slate-900 focus:outline-none focus:border-sky-500"
            />
          </div>

          {/* Titles: English & Bengali */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Course Title (English):</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Data Structures & Algorithms"
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl font-medium focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Course Title (Bengali Script):</label>
              <input
                type="text"
                value={titleBengali}
                onChange={(e) => setTitleBengali(e.target.value)}
                placeholder="e.g. ডেটা স্ট্রাকচার ও অ্যালগরিদম"
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          {/* Department & Faculty */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Department:</label>
              <select
                value={departmentId}
                onChange={(e) => setDepartmentId(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl bg-white text-slate-700"
              >
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} ({d.code})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Assigned Teacher / Faculty:</label>
              <select
                value={facultyId}
                onChange={(e) => setFacultyId(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl bg-white text-slate-700"
              >
                {facultyMembers.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name} ({f.institutionUserId})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Semester, Credits & Status */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Semester:</label>
              <select
                value={semester}
                onChange={(e) => setSemester(Number(e.target.value))}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl bg-white font-mono"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                  <option key={s} value={s}>
                    Semester {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Academic Credits:</label>
              <select
                value={credits}
                onChange={(e) => setCredits(Number(e.target.value))}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl bg-white font-mono"
              >
                {[1, 2, 3, 4, 5, 6, 8].map((c) => (
                  <option key={c} value={c}>
                    {c} Credits
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Publication Status:</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl bg-white font-semibold"
              >
                <option value="published">Published</option>
                <option value="draft">Draft / Under Revision</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Course Description:</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short description of the course curriculum and objectives"
              className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:outline-none focus:border-sky-500"
            />
          </div>

          {/* Syllabus Summary */}
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Syllabus Summary & Unit Breakdown:</label>
            <textarea
              rows={3}
              value={syllabusSummary}
              onChange={(e) => setSyllabusSummary(e.target.value)}
              placeholder="Unit 1: Fundamentals. Unit 2: Core modules. Unit 3: Lab experiments."
              className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:outline-none focus:border-sky-500 font-mono text-[11px]"
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-200">
            <span className="text-[11px] text-slate-400">
              Synchronized with Vidyasagar University CBCS / NEP framework.
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center gap-1.5 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save Course Modifications</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
