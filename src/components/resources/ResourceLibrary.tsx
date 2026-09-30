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
  FileCheck,
  Edit,
  Trash2,
  Archive,
  RotateCcw,
  CheckCircle2,
  Clock,
  AlertCircle,
  Eye,
  Send,
  UploadCloud,
  History,
  Sparkles,
  ExternalLink
} from 'lucide-react';

export const ResourceLibrary: React.FC = () => {
  const {
    resources,
    courses,
    departments,
    currentUser,
    addResource,
    updateResource,
    deleteResource,
    archiveResource,
    restoreResource,
    submitResourceForApproval,
    uploadResourceNewVersion,
    incrementResourceDownload,
    language
  } = useApp();

  const isFaculty = currentUser.role === 'faculty';
  const isDeptHead = currentUser.role === 'dept_head';
  const isSuperAdmin = currentUser.role === 'super_admin';
  const canManage = isFaculty || isDeptHead || isSuperAdmin;

  // Active view: 'all' or 'my_materials'
  const [viewMode, setViewMode] = useState<'all' | 'my_materials'>(isFaculty ? 'my_materials' : 'all');
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [deptFilter, setDeptFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Modals
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [editingResource, setEditingResource] = useState<LearningResource | null>(null);
  const [versioningResource, setVersioningResource] = useState<LearningResource | null>(null);
  const [versionChangeSummary, setVersionChangeSummary] = useState('');

  // New resource modal state
  const [newTitle, setNewTitle] = useState('');
  const [newTitleBengali, setNewTitleBengali] = useState('');
  const [newCategory, setNewCategory] = useState<LearningResource['category']>('course');
  const [newCourseId, setNewCourseId] = useState(
    courses.find((c) => c.facultyId === currentUser.id)?.id || courses[0]?.id || ''
  );
  const [newDeptId, setNewDeptId] = useState(currentUser.departmentId || departments[0]?.id || '');
  const [newDesc, setNewDesc] = useState('');
  const [newFileType, setNewFileType] = useState<LearningResource['fileType']>('pdf');
  const [newPublishMode, setNewPublishMode] = useState<'direct' | 'review'>('direct');
  const [newTargetUnit, setNewTargetUnit] = useState<string>('');

  // Courses taught by this faculty or in department
  const facultyAssignedCourses = courses.filter(
    (c) => c.facultyId === currentUser.id || currentUser.assignedCourseIds?.includes(c.id)
  );

  const selectedCourseObj = courses.find((c) => c.id === newCourseId);

  // Filtered resources
  const filteredResources = resources.filter((res) => {
    // If viewing 'my_materials', filter to current faculty's uploads
    if (viewMode === 'my_materials') {
      if (res.uploadedBy !== currentUser.id) return false;
    }

    // Soft-deleted check
    if (res.isSoftDeleted) return false;

    // Status filter
    if (statusFilter !== 'all') {
      const resStatus = res.approvalStatus || 'approved';
      if (resStatus !== statusFilter) return false;
    }

    const matchesSearch =
      res.title.toLowerCase().includes(search.toLowerCase()) ||
      (res.titleBengali && res.titleBengali.toLowerCase().includes(search.toLowerCase())) ||
      (res.courseCode && res.courseCode.toLowerCase().includes(search.toLowerCase())) ||
      res.uploadedByName.toLowerCase().includes(search.toLowerCase());

    const matchesCategory = categoryFilter === 'all' || res.category === categoryFilter;
    const matchesDept = deptFilter === 'all' || res.departmentId === deptFilter;

    return matchesSearch && matchesCategory && matchesDept;
  });

  const myMaterialsCount = resources.filter((r) => r.uploadedBy === currentUser.id && !r.isSoftDeleted).length;

  const handleDownload = (res: LearningResource) => {
    incrementResourceDownload(res.id);
    alert(`Downloading "${res.title}" (${res.fileSize})\nFormat: ${res.fileType.toUpperCase()}`);
  };

  const handleCreateResource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const selCourse = courses.find((c) => c.id === newCourseId);

    // If direct publish: status is approved immediately (Faculty autonomy over teaching materials).
    // If review: status is pending_review for HOD review.
    const initialStatus = newPublishMode === 'direct' ? 'approved' : 'pending_review';

    addResource({
      title: newTitle.trim(),
      titleBengali: newTitleBengali.trim() || undefined,
      courseId: newCategory === 'course' ? selCourse?.id : undefined,
      courseCode: newCategory === 'course' ? selCourse?.code : undefined,
      departmentId: newDeptId || selCourse?.departmentId || currentUser.departmentId,
      category: newCategory,
      fileType: newFileType,
      fileSize: '3.4 MB',
      url: `/documents/${newTitle.toLowerCase().replace(/\s+/g, '_')}.${newFileType}`,
      uploadedBy: currentUser.id,
      uploadedByName: currentUser.name,
      description: newDesc || 'Digital lecture notes and study material for Tamralipta Mahavidyalaya students.',
      approvalStatus: initialStatus,
      version: 1,
      targetAudience: 'students'
    });

    // If review mode selected, trigger approval request
    if (newPublishMode === 'review') {
      // Find the created resource ID (last added)
      setTimeout(() => {
        const latest = resources[0];
        if (latest) {
          submitResourceForApproval(latest.id);
        }
      }, 100);
    }

    setNewTitle('');
    setNewTitleBengali('');
    setNewDesc('');
    setNewTargetUnit('');
    setShowUploadModal(false);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingResource) return;

    updateResource(editingResource);
    setEditingResource(null);
  };

  const handleConfirmNewVersion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!versioningResource) return;

    uploadResourceNewVersion(versioningResource.id, {
      fileName: `${versioningResource.title.replace(/\s+/g, '_')}_v${(versioningResource.version || 1) + 1}.${versioningResource.fileType}`,
      fileUrl: versioningResource.url,
      fileSize: '3.8 MB',
      changeSummary: versionChangeSummary.trim() || 'Updated revision by course instructor'
    });

    setVersioningResource(null);
    setVersionChangeSummary('');
  };

  const categories = [
    { id: 'all', label: 'All Categories' },
    { id: 'course', label: 'Course Handouts & Notes' },
    { id: 'syllabus', label: 'Syllabus & Lecture Plans' },
    { id: 'lab_manual', label: 'Lab Manuals & Practical' },
    { id: 'department', label: 'Departmental Notices' },
    { id: 'general', label: 'Institutional / CBCS' },
    { id: 'reference', label: 'Reference & Archives' }
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#0f2942] to-[#1e3a8a] text-white rounded-2xl p-6 shadow-md border border-[#274f75]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-sky-300">
              <span>Academic Resource Center</span>
              <span aria-hidden="true">·</span>
              <span>{isFaculty ? 'Faculty Teaching Materials Hub' : 'Institutional Repository'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold mt-1 tracking-tight">
              {language === 'bn' ? 'ডিজিটাল পাঠ্যসামগ্রী ও শিক্ষাদান ভাণ্ডার' : 'Teaching Materials & Learning Repository'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Faculty members have independent management over course materials, lecture handouts, lab guides, and versioning. Department Heads coordinate syllabus-level alignments.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {canManage && (
              <button
                onClick={() => setShowUploadModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-sky-500 hover:bg-sky-400 text-white rounded-xl text-xs font-semibold shadow-md transition cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Upload New Material</span>
              </button>
            )}
          </div>
        </div>

        {/* View Mode Switcher for Faculty & Dept Heads */}
        {canManage && (
          <div className="mt-5 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center bg-black/30 p-1 rounded-xl border border-white/10 text-xs">
              <button
                onClick={() => setViewMode('my_materials')}
                className={`px-3.5 py-1.5 rounded-lg font-semibold transition flex items-center gap-2 ${
                  viewMode === 'my_materials'
                    ? 'bg-sky-500 text-white shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>My Teaching Materials ({myMaterialsCount})</span>
              </button>
              <button
                onClick={() => setViewMode('all')}
                className={`px-3.5 py-1.5 rounded-lg font-semibold transition flex items-center gap-2 ${
                  viewMode === 'all'
                    ? 'bg-sky-500 text-white shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>All College Repository ({resources.length})</span>
              </button>
            </div>

            <div className="text-xs text-sky-200 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Independent Faculty Publishing Enabled</span>
            </div>
          </div>
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

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="text-xs px-3 py-2 border border-slate-200 rounded-lg bg-white text-slate-700 focus:outline-none focus:border-sky-500"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>

          {/* Department Filter */}
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="text-xs px-3 py-2 border border-slate-200 rounded-lg bg-white text-slate-700 focus:outline-none focus:border-sky-500"
          >
            <option value="all">All Departments</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>

          {/* Status filter if managing */}
          {canManage && (
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs px-3 py-2 border border-slate-200 rounded-lg bg-white text-slate-700 focus:outline-none focus:border-sky-500"
            >
              <option value="all">All Statuses</option>
              <option value="approved">Published / Active</option>
              <option value="pending_review">Pending Review</option>
              <option value="returned_for_correction">Returned for Correction</option>
              <option value="archived">Archived</option>
            </select>
          )}
        </div>
      </div>

      {/* Resource Cards Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs divide-y divide-slate-100">
        {filteredResources.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500">
            {viewMode === 'my_materials'
              ? 'You have not uploaded any teaching materials yet. Click "Upload New Material" to add your lecture notes or handouts.'
              : 'No study resources found matching the specified search criteria.'}
          </div>
        ) : (
          filteredResources.map((res) => {
            const isMyUpload = res.uploadedBy === currentUser.id;
            const status = res.approvalStatus || 'approved';
            const isApproved = status === 'approved' || status === 'published';
            const isPending = status === 'pending_review';
            const isReturned = status === 'returned_for_correction';
            const isArchived = res.isArchived || status === 'archived';

            return (
              <div
                key={res.id}
                className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs hover:bg-slate-50/60 transition"
              >
                <div className="flex items-start gap-3.5 min-w-0 flex-1">
                  <div className="p-3 rounded-xl bg-sky-50 text-sky-700 flex-shrink-0 mt-0.5 border border-sky-100">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm truncate">
                        {language === 'bn' && res.titleBengali ? res.titleBengali : res.title}
                      </span>

                      <span className="font-mono text-[10px] text-sky-800 uppercase bg-sky-50 px-2 py-0.5 rounded border border-sky-200 font-semibold">
                        {res.fileType}
                      </span>

                      {/* Version Tag */}
                      <span className="text-[10px] text-indigo-700 font-mono bg-indigo-50 border border-indigo-200 px-1.5 py-0.5 rounded">
                        v{res.version || 1}.0
                      </span>

                      {/* Approval Status Badge */}
                      {isApproved && (
                        <span className="text-[10px] text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Published & Active</span>
                        </span>
                      )}

                      {isPending && (
                        <span className="text-[10px] text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
                          <Clock className="w-3 h-3 text-amber-600" />
                          <span>Pending HOD Review</span>
                        </span>
                      )}

                      {isReturned && (
                        <span className="text-[10px] text-rose-800 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
                          <AlertCircle className="w-3 h-3 text-rose-600" />
                          <span>Returned for Correction</span>
                        </span>
                      )}

                      {isArchived && (
                        <span className="text-[10px] text-slate-600 bg-slate-100 border border-slate-300 px-2 py-0.5 rounded-full font-semibold">
                          Archived
                        </span>
                      )}
                    </div>

                    <p className="text-slate-600 text-xs mt-1.5 leading-relaxed">{res.description}</p>

                    {/* Review Feedback note if returned */}
                    {isReturned && res.reviewNotes && (
                      <div className="mt-2 p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-[11px] text-rose-900">
                        <strong className="font-semibold">Reviewer Feedback:</strong> {res.reviewNotes}
                      </div>
                    )}

                    <div className="text-[11px] text-slate-500 mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
                      {res.courseCode && (
                        <span className="font-mono text-sky-800 font-semibold bg-sky-50 px-1.5 py-0.2 rounded border border-sky-200">
                          {res.courseCode}
                        </span>
                      )}
                      <span>Size: {res.fileSize}</span>
                      <span aria-hidden="true">·</span>
                      <span>Uploaded by {res.uploadedByName}</span>
                      <span aria-hidden="true">·</span>
                      <span>Date: {res.uploadedAt}</span>
                      <span aria-hidden="true">·</span>
                      <span className="text-slate-700 font-semibold">{res.downloadCount} Student Downloads</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 self-start md:self-center flex-shrink-0">
                  <button
                    onClick={() => handleDownload(res)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-sky-50 hover:text-sky-700 text-slate-700 rounded-lg text-xs font-semibold transition cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>

                  {/* Independent Faculty Control Buttons */}
                  {(isMyUpload || isSuperAdmin) && (
                    <>
                      <button
                        onClick={() => setEditingResource(res)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 rounded-lg text-xs font-semibold transition cursor-pointer"
                        title="Edit material details"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>

                      <button
                        onClick={() => {
                          setVersioningResource(res);
                          setVersionChangeSummary('');
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-purple-50 hover:text-purple-700 text-slate-700 rounded-lg text-xs font-semibold transition cursor-pointer"
                        title="Upload revision or new edition"
                      >
                        <History className="w-3.5 h-3.5" />
                        <span>New Version</span>
                      </button>

                      {isArchived ? (
                        <button
                          onClick={() => restoreResource(res.id)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 rounded-lg text-xs font-semibold transition cursor-pointer"
                          title="Restore to active library"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Restore</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => archiveResource(res.id)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-amber-50 hover:text-amber-700 text-slate-700 rounded-lg text-xs font-semibold transition cursor-pointer"
                          title="Archive material"
                        >
                          <Archive className="w-3.5 h-3.5" />
                          <span>Archive</span>
                        </button>
                      )}

                      <button
                        onClick={() => {
                          if (window.confirm(`Are you sure you want to delete "${res.title}"?`)) {
                            deleteResource(res.id);
                          }
                        }}
                        className="inline-flex items-center p-1.5 bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-500 rounded-lg text-xs transition cursor-pointer"
                        title="Delete resource"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Upload Resource Modal (With Independent Publish vs Review Toggle) */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-slate-900">Upload Digital Teaching Material</h2>
                <span className="text-[10px] text-sky-800 bg-sky-50 font-bold px-2 py-0.5 rounded border border-sky-200">
                  Faculty Independent Publisher
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Upload lecture notes, slide decks, lab manuals, and supplementary reading for your courses.
              </p>
            </div>

            <form onSubmit={handleCreateResource} className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-slate-700">Material Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Graph Algorithms, BFS & DFS Lecture Notes"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full text-xs mt-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700">Bengali Title (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. গ্রাফ অ্যালগরিদম ও লেকচার নোটস"
                  value={newTitleBengali}
                  onChange={(e) => setNewTitleBengali(e.target.value)}
                  className="w-full text-xs mt-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700">Category *</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as LearningResource['category'])}
                    className="w-full text-xs mt-1 px-3 py-2 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="course">Course Handout / Notes</option>
                    <option value="lab_manual">Lab Manual / Practical</option>
                    <option value="syllabus">Syllabus / Curriculum</option>
                    <option value="department">Department General</option>
                    <option value="reference">Reference Text</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700">File Format *</label>
                  <select
                    value={newFileType}
                    onChange={(e) => setNewFileType(e.target.value as LearningResource['fileType'])}
                    className="w-full text-xs mt-1 px-3 py-2 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="pdf">PDF Document (.pdf)</option>
                    <option value="doc">Word Document (.docx)</option>
                    <option value="ppt">Presentation Slides (.pptx)</option>
                    <option value="video">MP4 Video Recording (.mp4)</option>
                    <option value="xls">Spreadsheet (.xlsx)</option>
                  </select>
                </div>
              </div>

              {/* Course Selection */}
              <div>
                <label className="text-xs font-semibold text-slate-700">Associated Course *</label>
                <select
                  value={newCourseId}
                  onChange={(e) => setNewCourseId(e.target.value)}
                  className="w-full text-xs mt-1 px-3 py-2 border border-slate-300 rounded-lg bg-white font-mono text-[11px]"
                >
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.code}: {c.title} {c.facultyId === currentUser.id ? '★ (Your Course)' : ''}
                    </option>
                  ))}
                </select>
              </div>

              {/* Learning Unit association */}
              {selectedCourseObj && selectedCourseObj.units && selectedCourseObj.units.length > 0 && (
                <div>
                  <label className="text-xs font-semibold text-slate-700">Target Curriculum Unit (Optional)</label>
                  <select
                    value={newTargetUnit}
                    onChange={(e) => setNewTargetUnit(e.target.value)}
                    className="w-full text-xs mt-1 px-3 py-2 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="">General Course Material</option>
                    {selectedCourseObj.units.map((u) => (
                      <option key={u.id} value={u.id}>
                        Unit {u.order}: {u.title}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Description */}
              <div>
                <label className="text-xs font-semibold text-slate-700">Description / Topic Outline</label>
                <textarea
                  rows={2}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Outline key topics, references, or suggested problems..."
                  className="w-full text-xs mt-1 px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              {/* Publishing Mode: Direct Publish vs Department Review */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <div className="text-xs font-bold text-slate-800">Publishing Mode & Governance</div>
                <div className="space-y-1.5 text-xs">
                  <label className="flex items-start gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="publishMode"
                      checked={newPublishMode === 'direct'}
                      onChange={() => setNewPublishMode('direct')}
                      className="mt-0.5 text-sky-600"
                    />
                    <div>
                      <span className="font-semibold text-slate-900">Direct Course Publication (Independent)</span>
                      <p className="text-[11px] text-slate-500">
                        Immediately accessible to enrolled students in your course without department review delay.
                      </p>
                    </div>
                  </label>

                  <label className="flex items-start gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="publishMode"
                      checked={newPublishMode === 'review'}
                      onChange={() => setNewPublishMode('review')}
                      className="mt-0.5 text-sky-600"
                    />
                    <div>
                      <span className="font-semibold text-slate-900">Submit for Department Head Review</span>
                      <p className="text-[11px] text-slate-500">
                        Pushes to the HOD's approval desk for departmental syllabus validation before broad release.
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-3.5 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-semibold shadow-xs cursor-pointer"
                >
                  Confirm & Upload
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Resource Modal */}
      {editingResource && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Edit Teaching Material</h2>
              <p className="text-xs text-slate-500 mt-0.5">Modify document title, category, or description.</p>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700">Title</label>
                <input
                  type="text"
                  required
                  value={editingResource.title}
                  onChange={(e) => setEditingResource({ ...editingResource, title: e.target.value })}
                  className="w-full text-xs mt-1 px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700">Category</label>
                <select
                  value={editingResource.category}
                  onChange={(e) =>
                    setEditingResource({ ...editingResource, category: e.target.value as LearningResource['category'] })
                  }
                  className="w-full text-xs mt-1 px-3 py-2 border border-slate-300 rounded-lg bg-white"
                >
                  <option value="course">Course Handout / Notes</option>
                  <option value="lab_manual">Lab Manual / Practical</option>
                  <option value="syllabus">Syllabus / Curriculum</option>
                  <option value="department">Department General</option>
                  <option value="reference">Reference Text</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700">Description</label>
                <textarea
                  rows={3}
                  value={editingResource.description}
                  onChange={(e) => setEditingResource({ ...editingResource, description: e.target.value })}
                  className="w-full text-xs mt-1 px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingResource(null)}
                  className="px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Version Upload Modal */}
      {versioningResource && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div>
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-purple-600" />
                <h2 className="text-base font-bold text-slate-900">Upload New Revision / Edition</h2>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Material: <strong className="text-slate-800">{versioningResource.title}</strong> (Current v
                {versioningResource.version || 1}.0)
              </p>
            </div>

            <form onSubmit={handleConfirmNewVersion} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700">Revision Summary / Change Notes *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Added Dijkstra algorithm code examples and updated practice problems for 2026."
                  value={versionChangeSummary}
                  onChange={(e) => setVersionChangeSummary(e.target.value)}
                  className="w-full text-xs mt-1 px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl text-xs text-purple-900">
                <span>The new revision will automatically become <strong>v{(versioningResource.version || 1) + 1}.0</strong>, preserving full version history for accreditation audits.</span>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setVersioningResource(null)}
                  className="px-3.5 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-semibold shadow-xs cursor-pointer"
                >
                  Publish New Version
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
