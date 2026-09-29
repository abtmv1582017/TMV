import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { LearningResource } from '../../types';
import {
  FileText,
  Search,
  Filter,
  Download,
  Plus,
  Building2,
  BookOpen,
  Calendar,
  Layers,
  FileCheck
} from 'lucide-react';

export const ResourceLibrary: React.FC = () => {
  const { resources, courses, departments, currentUser, addResource, incrementResourceDownload, language } = useApp();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [deptFilter, setDeptFilter] = useState<string>('all');
  const [showUploadModal, setShowUploadModal] = useState(false);

  // New resource modal state
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<LearningResource['category']>('course');
  const [newCourseId, setNewCourseId] = useState(courses[0]?.id || '');
  const [newDeptId, setNewDeptId] = useState(departments[0]?.id || '');
  const [newDesc, setNewDesc] = useState('');
  const [newFileType, setNewFileType] = useState<LearningResource['fileType']>('pdf');

  const canUpload =
    currentUser.role === 'faculty' ||
    currentUser.role === 'dept_head' ||
    currentUser.role === 'super_admin';

  const filteredResources = resources.filter((res) => {
    const matchesSearch =
      res.title.toLowerCase().includes(search.toLowerCase()) ||
      (res.titleBengali && res.titleBengali.toLowerCase().includes(search.toLowerCase())) ||
      (res.courseCode && res.courseCode.toLowerCase().includes(search.toLowerCase())) ||
      res.uploadedByName.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || res.category === categoryFilter;
    const matchesDept = deptFilter === 'all' || res.departmentId === deptFilter;
    return matchesSearch && matchesCategory && matchesDept;
  });

  const handleDownload = (res: LearningResource) => {
    incrementResourceDownload(res.id);
    alert(`Downloading "${res.title}" (${res.fileSize})`);
  };

  const handleCreateResource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const selCourse = courses.find((c) => c.id === newCourseId);

    addResource({
      title: newTitle.trim(),
      courseId: newCategory === 'course' ? selCourse?.id : undefined,
      courseCode: newCategory === 'course' ? selCourse?.code : undefined,
      departmentId: newDeptId || selCourse?.departmentId,
      category: newCategory,
      fileType: newFileType,
      fileSize: '3.2 MB',
      url: `/documents/${newTitle.toLowerCase().replace(/\s+/g, '_')}.${newFileType}`,
      uploadedBy: currentUser.id,
      uploadedByName: currentUser.name,
      description: newDesc || 'Digital learning material uploaded for Tamralipta Mahavidyalaya students.'
    });

    setNewTitle('');
    setNewDesc('');
    setShowUploadModal(false);
  };

  const categories = [
    { id: 'all', label: 'All Resources' },
    { id: 'course', label: 'Course Notes' },
    { id: 'department', label: 'Departmental' },
    { id: 'general', label: 'Institutional / CBCS' },
    { id: 'reference', label: 'Reference & Heritage' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            {language === 'bn' ? 'ডিজিটাল পাঠ্যসামগ্রী ভাণ্ডার' : 'Digital Learning Resource Repository'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Tamralipta Mahavidyalaya · Centralized Lecture Handouts, Lab Manuals & Reference Texts
          </p>
        </div>

        {canUpload && (
          <button
            onClick={() => setShowUploadModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-semibold shadow-xs transition self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Upload New Material</span>
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by topic, course code, or faculty..."
            className="w-full text-xs pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-sky-500"
          />
        </div>

        {/* Category Pills (Functional Tab Buttons) */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg overflow-x-auto w-full md:w-auto">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(cat.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition ${
                categoryFilter === cat.id
                  ? 'bg-white text-slate-900 font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Resource Cards Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs divide-y divide-slate-100">
        {filteredResources.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500">
            No study resources found matching the specified search criteria.
          </div>
        ) : (
          filteredResources.map((res) => (
            <div
              key={res.id}
              className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs hover:bg-slate-50/60 transition"
            >
              <div className="flex items-start gap-3 min-w-0">
                <div className="p-2.5 rounded-lg bg-sky-50 text-sky-700 flex-shrink-0 mt-0.5">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm truncate">
                      {language === 'bn' && res.titleBengali ? res.titleBengali : res.title}
                    </span>
                    <span className="font-mono text-[10px] text-sky-800 uppercase bg-sky-50 px-1.5 py-0.5 rounded border border-sky-200/50">
                      {res.fileType}
                    </span>
                  </div>

                  <p className="text-slate-600 text-xs mt-1 line-clamp-1">{res.description}</p>

                  <div className="text-[11px] text-slate-500 mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5">
                    {res.courseCode && (
                      <>
                        <span className="font-mono text-sky-800 font-semibold">{res.courseCode}</span>
                        <span aria-hidden="true">·</span>
                      </>
                    )}
                    <span>Size: {res.fileSize}</span>
                    <span aria-hidden="true">·</span>
                    <span>Uploaded by {res.uploadedByName}</span>
                    <span aria-hidden="true">·</span>
                    <span>{res.uploadedAt}</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-slate-700">{res.downloadCount} Downloads</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleDownload(res)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-sky-50 hover:text-sky-700 text-slate-700 rounded-lg text-xs font-semibold self-start sm:self-auto transition flex-shrink-0"
              >
                <Download className="w-4 h-4" />
                <span>Download</span>
              </button>
            </div>
          ))
        )}
      </div>

      {/* Upload Resource Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h2 className="text-base font-bold text-slate-900 mb-1">Upload Digital Study Material</h2>
            <p className="text-xs text-slate-500 mb-4">
              Materials will be instantly catalogued in the college learning repository.
            </p>

            <form onSubmit={handleCreateResource} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700">Document Title:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Graph Algorithms & Shortest Path Lecture Slide Deck"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full text-xs mt-1 px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700">Category:</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as LearningResource['category'])}
                    className="w-full text-xs mt-1 px-3 py-2 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="course">Course Handout</option>
                    <option value="department">Department Material</option>
                    <option value="general">Institutional / CBCS</option>
                    <option value="reference">Reference / Heritage</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700">File Format:</label>
                  <select
                    value={newFileType}
                    onChange={(e) => setNewFileType(e.target.value as LearningResource['fileType'])}
                    className="w-full text-xs mt-1 px-3 py-2 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="pdf">PDF Document</option>
                    <option value="doc">Word DOC / DOCX</option>
                    <option value="ppt">PowerPoint PPTX</option>
                    <option value="video">MP4 Video Lecture</option>
                  </select>
                </div>
              </div>

              {newCategory === 'course' && (
                <div>
                  <label className="text-xs font-semibold text-slate-700">Associated Course:</label>
                  <select
                    value={newCourseId}
                    onChange={(e) => setNewCourseId(e.target.value)}
                    className="w-full text-xs mt-1 px-3 py-2 border border-slate-300 rounded-lg bg-white"
                  >
                    {courses.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.code}: {c.title}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="text-xs font-semibold text-slate-700">Description:</label>
                <textarea
                  rows={2}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Summary of topics, suggested readings, or lab tasks..."
                  className="w-full text-xs mt-1 px-3 py-2 border border-slate-300 rounded-lg"
                />
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
                  Confirm Upload
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
