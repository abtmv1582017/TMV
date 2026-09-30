import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Course } from '../../types';
import {
  BookOpen,
  Plus,
  Search,
  Filter,
  Users,
  Layers,
  ChevronRight,
  Sparkles,
  Edit3
} from 'lucide-react';
import { EditCourseModal } from './EditCourseModal';

interface CourseListProps {
  onSelectCourse: (courseId: string) => void;
}

export const CourseList: React.FC<CourseListProps> = ({ onSelectCourse }) => {
  const { courses, departments, currentUser, addCourse, language, t } = useApp();
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('all');
  const [selectedSemester, setSelectedSemester] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  // New course form state
  const [newCode, setNewCode] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newDeptId, setNewDeptId] = useState(departments[0]?.id || 'dept-cs');
  const [newSemester, setNewSemester] = useState<number>(3);
  const [newCredits, setNewCredits] = useState<number>(6);
  const [newDesc, setNewDesc] = useState('');
  const [newSyllabus, setNewSyllabus] = useState('');

  const canCreate =
    currentUser.role === 'faculty' ||
    currentUser.role === 'dept_head' ||
    currentUser.role === 'super_admin' ||
    currentUser.role === 'principal';

  const filteredCourses = courses.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.code.toLowerCase().includes(search.toLowerCase()) ||
      c.facultyName.toLowerCase().includes(search.toLowerCase());
    const matchesDept = selectedDept === 'all' || c.departmentId === selectedDept;
    const matchesSem =
      selectedSemester === 'all' || String(c.semester) === selectedSemester;
    return matchesSearch && matchesDept && matchesSem;
  });

  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode.trim() || !newTitle.trim()) return;

    addCourse({
      code: newCode.toUpperCase().trim(),
      title: newTitle.trim(),
      departmentId: newDeptId,
      programmeId: 'prog-bsc-cs',
      semester: Number(newSemester),
      sessionId: 'session-2025-2026',
      facultyId: currentUser.id,
      facultyName: currentUser.name,
      description: newDesc || 'Core academic curriculum as prescribed by Vidyasagar University.',
      syllabusSummary: newSyllabus || 'Unit 1: Fundamentals. Unit 2: Core Applications. Unit 3: Advanced Topics.',
      credits: Number(newCredits),
      status: 'published',
      units: [
        { id: 'u1', title: 'Unit 1: Core Concepts & Principles', order: 1, topics: ['Introduction', 'Mathematical Foundations'] },
        { id: 'u2', title: 'Unit 2: Applied Methodologies', order: 2, topics: ['Algorithms & Practical Implementation'] }
      ]
    });

    setNewCode('');
    setNewTitle('');
    setNewDesc('');
    setNewSyllabus('');
    setShowCreateModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            {language === 'bn' ? 'কোর্স বিবরণী ও পাঠ্যতালিকা' : 'Academic Courses Directory'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Tamralipta Mahavidyalaya · Choice Based Credit System (CBCS) / NEP Modules
          </p>
        </div>

        {canCreate && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-semibold shadow-xs transition self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>{language === 'bn' ? 'নতুন কোর্স যোগ করুন' : 'Create New Course'}</span>
          </button>
        )}
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by code, title, or teacher..."
            className="w-full text-xs pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-sky-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="text-xs border border-slate-300 rounded-lg px-3 py-2 bg-white text-slate-700"
          >
            <option value="all">All Departments</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>

          <select
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
            className="text-xs border border-slate-300 rounded-lg px-3 py-2 bg-white text-slate-700"
          >
            <option value="all">All Semesters</option>
            <option value="1">Semester 1</option>
            <option value="2">Semester 2</option>
            <option value="3">Semester 3</option>
            <option value="4">Semester 4</option>
            <option value="5">Semester 5</option>
            <option value="6">Semester 6</option>
          </select>
        </div>
      </div>

      {/* Course Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCourses.map((c) => {
          const dept = departments.find((d) => d.id === c.departmentId);
          return (
            <div
              key={c.id}
              onClick={() => onSelectCourse(c.id)}
              className="bg-white rounded-xl border border-slate-200 hover:border-sky-400 hover:shadow-md transition cursor-pointer flex flex-col justify-between overflow-hidden group"
            >
              <div className="p-5">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                  <span className="font-mono font-bold text-sky-800 bg-sky-50 px-2 py-0.5 rounded border border-sky-200/60">
                    {c.code}
                  </span>
                  <span>Semester {c.semester} · {c.credits} Credits</span>
                </div>

                <h3 className="font-bold text-base text-slate-900 group-hover:text-sky-700 transition line-clamp-1">
                  {language === 'bn' && c.titleBengali ? c.titleBengali : c.title}
                </h3>

                <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                  {c.description}
                </p>

                <div className="text-[11px] text-slate-500 mt-3 flex items-center gap-1.5">
                  <span className="font-medium text-slate-700">{dept?.name || 'Department'}</span>
                </div>
              </div>

              <div className="px-5 py-3 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="truncate font-medium text-slate-700">{c.facultyName}</span>
                <div className="flex items-center gap-2">
                  {canCreate && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingCourse(c);
                      }}
                      className="p-1 hover:bg-slate-200/80 rounded-md text-slate-500 hover:text-sky-700 transition cursor-pointer"
                      title="Edit Course Name, Code & Details"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <span className="text-sky-700 font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition">
                    {c.units.length} Units
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Course Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <h2 className="text-lg font-bold text-slate-900 mb-1">
              Add New Academic Course
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              Specify course details in accordance with Vidyasagar University curriculum.
            </p>

            <form onSubmit={handleCreateCourse} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700">Course Code:</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CMSA-CC-303"
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value)}
                    className="w-full text-xs mt-1 px-3 py-2 border border-slate-300 rounded-lg uppercase"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700">Credits:</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={newCredits}
                    onChange={(e) => setNewCredits(Number(e.target.value))}
                    className="w-full text-xs mt-1 px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700">Course Title:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Database Management Systems"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full text-xs mt-1 px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700">Department:</label>
                  <select
                    value={newDeptId}
                    onChange={(e) => setNewDeptId(e.target.value)}
                    className="w-full text-xs mt-1 px-3 py-2 border border-slate-300 rounded-lg bg-white"
                  >
                    {departments.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700">Semester:</label>
                  <select
                    value={newSemester}
                    onChange={(e) => setNewSemester(Number(e.target.value))}
                    className="w-full text-xs mt-1 px-3 py-2 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value={1}>Semester 1</option>
                    <option value={2}>Semester 2</option>
                    <option value={3}>Semester 3</option>
                    <option value={4}>Semester 4</option>
                    <option value={5}>Semester 5</option>
                    <option value={6}>Semester 6</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700">Course Description:</label>
                <textarea
                  rows={2}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Summary of course scope and academic prerequisites..."
                  className="w-full text-xs mt-1 px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700">Syllabus Overview:</label>
                <textarea
                  rows={2}
                  value={newSyllabus}
                  onChange={(e) => setNewSyllabus(e.target.value)}
                  placeholder="Units and core syllabus topics covered..."
                  className="w-full text-xs mt-1 px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-semibold"
                >
                  Save Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Edit Course Modal */}
      {editingCourse && (
        <EditCourseModal
          course={editingCourse}
          onClose={() => setEditingCourse(null)}
        />
      )}
    </div>
  );
};
