import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { InstitutionalDocument } from '../../types';
import {
  FileText,
  Search,
  Download,
  Plus,
  Building2,
  Calendar,
  Shield,
  Layers,
  CheckCircle2,
  Clock,
  Filter,
  Eye,
  Trash2,
  Edit,
  ExternalLink
} from 'lucide-react';

export const InstitutionalDocumentsView: React.FC = () => {
  const {
    currentUser,
    institutionalDocs,
    addInstitutionalDoc,
    deleteInstitutionalDoc,
    settings,
    language
  } = useApp();

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [audienceFilter, setAudienceFilter] = useState<string>('all');
  const [showUploadModal, setShowUploadModal] = useState(false);

  // New Document Form
  const [newTitle, setNewTitle] = useState('');
  const [newTitleBengali, setNewTitleBengali] = useState('');
  const [newCategory, setNewCategory] = useState<InstitutionalDocument['category']>('circular');
  const [newAudience, setNewAudience] = useState<InstitutionalDocument['targetAudience']>('all');
  const [newDesc, setNewDesc] = useState('');
  const [newAttachmentName, setNewAttachmentName] = useState('');

  const canManage = currentUser.role === 'principal' || currentUser.role === 'super_admin';

  const categories = [
    { id: 'all', label: 'All Documents' },
    { id: 'calendar', label: 'Academic Calendars' },
    { id: 'circular', label: 'Gazetted Circulars' },
    { id: 'exam_notice', label: 'Examination Notices' },
    { id: 'policy', label: 'Institutional Policies' },
    { id: 'approved_syllabus', label: 'Approved Syllabi' },
    { id: 'admin_guidelines', label: 'NAAC / Admin Guidelines' },
    { id: 'student_instruction', label: 'Student Directives' }
  ];

  const filteredDocs = institutionalDocs.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(search.toLowerCase()) ||
      (doc.titleBengali && doc.titleBengali.toLowerCase().includes(search.toLowerCase())) ||
      doc.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || doc.category === categoryFilter;
    const matchesAudience = audienceFilter === 'all' || doc.targetAudience === audienceFilter || doc.targetAudience === 'all';
    return matchesSearch && matchesCategory && matchesAudience;
  });

  const handleCreateDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    addInstitutionalDoc({
      title: newTitle.trim(),
      titleBengali: newTitleBengali.trim() || undefined,
      category: newCategory,
      academicSession: settings.currentSessionId || '2025-2026',
      authorId: currentUser.id,
      authorName: currentUser.name,
      approvalStatus: 'approved',
      version: 1,
      targetAudience: newAudience,
      attachmentName: newAttachmentName || `${newTitle.replace(/\s+/g, '_')}_Approved.pdf`,
      attachmentUrl: `/documents/${newTitle.toLowerCase().replace(/\s+/g, '_')}.pdf`,
      fileSize: '1.5 MB',
      fileType: 'pdf',
      description: newDesc || 'Official document gazetted by Tamralipta Mahavidyalaya administration.',
      approvedBy: 'Principal & Governing Body'
    });

    setNewTitle('');
    setNewTitleBengali('');
    setNewDesc('');
    setNewAttachmentName('');
    setShowUploadModal(false);
  };

  const handleDownload = (doc: InstitutionalDocument) => {
    alert(`Downloading verified institutional document: "${doc.attachmentName}" (${doc.fileSize})`);
  };

  return (
    <div className="space-y-6">
      {/* Institutional Document Repository Banner */}
      <div className="bg-gradient-to-r from-[#0f2942] to-[#1e3a8a] text-white rounded-2xl p-6 shadow-md border border-[#274f75]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-sky-300">
              <Building2 className="w-4 h-4" />
              <span>Tamralipta Mahavidyalaya Central Archive</span>
              <span aria-hidden="true">·</span>
              <span>Official Institutional Documents</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold mt-1 tracking-tight">
              Institutional Document & Policy Repository
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Authoritative gazetted circulars, academic calendars, anti-ragging codes of conduct, Vidyasagar University CBCS regulations, and NAAC accreditation documentation.
            </p>
          </div>

          {canManage && (
            <button
              onClick={() => setShowUploadModal(true)}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow-md transition flex items-center gap-2 cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Publish Official Document</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="text-xs px-3 py-1.5 border border-slate-200 rounded-lg bg-white text-slate-700 focus:outline-none focus:border-sky-500"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>

          <select
            value={audienceFilter}
            onChange={(e) => setAudienceFilter(e.target.value)}
            className="text-xs px-3 py-1.5 border border-slate-200 rounded-lg bg-white text-slate-700 focus:outline-none focus:border-sky-500"
          >
            <option value="all">All Audiences</option>
            <option value="students">Students Only</option>
            <option value="faculty">Faculty Members Only</option>
            <option value="department_heads">Department Heads</option>
          </select>
        </div>

        <div className="relative w-full md:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search documents or circulars..."
            className="w-full text-xs pl-8 pr-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500"
          />
        </div>
      </div>

      {/* Document Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredDocs.length === 0 ? (
          <div className="col-span-2 bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-500">
            <FileText className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-800">No documents found</h3>
            <p className="text-xs mt-1">Try refining your search query or category filters.</p>
          </div>
        ) : (
          filteredDocs.map((doc) => (
            <div
              key={doc.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-slate-300 transition flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-sky-50 text-sky-800 border border-sky-100">
                    {doc.category.replace(/_/g, ' ')}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    Edition v{doc.version} · {doc.publicationDate}
                  </span>
                </div>

                <h3 className="font-bold text-sm text-slate-900 leading-snug">
                  {doc.title}
                </h3>
                {doc.titleBengali && (
                  <p className="text-xs text-slate-500 font-serif mt-0.5">
                    {doc.titleBengali}
                  </p>
                )}

                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  {doc.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div className="text-[11px] text-slate-500">
                  <span>Target: <strong className="capitalize text-slate-700">{doc.targetAudience}</strong></span>
                  {doc.approvedBy && (
                    <span> · Authorized by: <strong>{doc.approvedBy}</strong></span>
                  )}
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button
                    onClick={() => handleDownload(doc)}
                    className="px-3 py-1.5 bg-sky-50 hover:bg-sky-100 text-sky-800 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download ({doc.fileSize})</span>
                  </button>

                  {canManage && (
                    <button
                      onClick={() => deleteInstitutionalDoc(doc.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                      title="Delete official document"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Upload Official Document Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-sky-700" />
                Publish Official Institutional Document
              </h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-slate-400 hover:text-slate-700 text-xs p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateDocument} className="space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Document Title (English):
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Gazetted Exam Schedule for Sem 3 (2025-26)"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Title in Bengali (Optional):
                </label>
                <input
                  type="text"
                  value={newTitleBengali}
                  onChange={(e) => setNewTitleBengali(e.target.value)}
                  placeholder="e.g. সেমিস্টার ৩ পরীক্ষার সময়সূচি বিজ্ঞপ্তি"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-sky-500 font-serif"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Document Category:
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="calendar">Academic Calendar</option>
                    <option value="circular">Gazetted Circular</option>
                    <option value="exam_notice">Examination Notice</option>
                    <option value="policy">Institutional Policy</option>
                    <option value="approved_syllabus">Approved Syllabus</option>
                    <option value="admin_guidelines">Admin Guidelines / NAAC</option>
                    <option value="student_instruction">Student Instruction</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Target Audience:
                  </label>
                  <select
                    value={newAudience}
                    onChange={(e) => setNewAudience(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="all">All Stakeholders</option>
                    <option value="students">Students</option>
                    <option value="faculty">Faculty Members</option>
                    <option value="department_heads">Department Heads</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Attachment File Name:
                </label>
                <input
                  type="text"
                  value={newAttachmentName}
                  onChange={(e) => setNewAttachmentName(e.target.value)}
                  placeholder="e.g. Examination_Notification_Sem3_VU.pdf"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Description & Context:
                </label>
                <textarea
                  rows={3}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Summary of circular, reference numbers, and instructions..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-sky-700 hover:bg-sky-800 text-white rounded-lg font-semibold shadow-xs"
                >
                  Publish & Gazetted
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
