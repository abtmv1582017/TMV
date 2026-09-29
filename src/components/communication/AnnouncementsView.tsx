import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Announcement } from '../../types';
import {
  Bell,
  Plus,
  Calendar,
  AlertTriangle,
  Info,
  CheckCircle2,
  Download,
  Building2
} from 'lucide-react';

export const AnnouncementsView: React.FC = () => {
  const {
    announcements,
    departments,
    currentUser,
    publishAnnouncement,
    markAnnouncementRead,
    language
  } = useApp();

  const [filterAudience, setFilterAudience] = useState<string>('all');
  const [showPublishModal, setShowPublishModal] = useState<boolean>(false);

  // New announcement form state
  const [title, setTitle] = useState('');
  const [titleBengali, setTitleBengali] = useState('');
  const [content, setContent] = useState('');
  const [targetAudience, setTargetAudience] = useState<Announcement['targetAudience']>('all');
  const [priority, setPriority] = useState<Announcement['priority']>('normal');

  const canPublish =
    currentUser.role === 'principal' ||
    currentUser.role === 'super_admin' ||
    currentUser.role === 'dept_head' ||
    currentUser.role === 'faculty';

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    publishAnnouncement({
      title: title.trim(),
      titleBengali: titleBengali.trim() || undefined,
      content: content.trim(),
      authorName: currentUser.name,
      authorRole: `${currentUser.role.replace('_', ' ').toUpperCase()}, Tamralipta Mahavidyalaya`,
      targetAudience,
      priority
    });

    setTitle('');
    setTitleBengali('');
    setContent('');
    setShowPublishModal(false);
  };

  const filteredAnnouncements = announcements.filter((a) => {
    if (filterAudience === 'all') return true;
    return a.targetAudience === filterAudience;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            {language === 'bn' ? 'প্রাতিষ্ঠানিক নোটিশ ও বিজ্ঞপ্তি' : 'Centralized Academic Circulars & Notices'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Tamralipta Mahavidyalaya · Official Directives, Examination Notices & Departmental Updates
          </p>
        </div>

        {canPublish && (
          <button
            onClick={() => setShowPublishModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-semibold shadow-xs transition self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Publish Circular / Notice</span>
          </button>
        )}
      </div>

      <div className="space-y-4">
        {filteredAnnouncements.map((ann) => {
          const isRead = ann.readBy.includes(currentUser.id);

          return (
            <div
              key={ann.id}
              onClick={() => markAnnouncementRead(ann.id)}
              className={`bg-white rounded-xl border p-5 shadow-xs transition space-y-3 cursor-pointer ${
                !isRead ? 'border-sky-300 bg-sky-50/20' : 'border-slate-200'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  {ann.priority === 'urgent' ? (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 uppercase flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      Urgent Notice
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-100 text-sky-800 uppercase">
                      Circular
                    </span>
                  )}
                  <span className="text-xs text-slate-500">
                    Audience: <strong className="capitalize text-slate-700">{ann.targetAudience}</strong>
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span>Published: {ann.publishedAt}</span>
                  {!isRead && (
                    <span className="w-2 h-2 rounded-full bg-sky-500" title="Unread notice" />
                  )}
                </div>
              </div>

              <div>
                <h3 className="font-bold text-base text-slate-900">
                  {language === 'bn' && ann.titleBengali ? ann.titleBengali : ann.title}
                </h3>
                <p className="text-xs text-slate-700 leading-relaxed mt-2 whitespace-pre-line">
                  {ann.content}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>By: <strong className="text-slate-800">{ann.authorName}</strong> ({ann.authorRole})</span>
                {ann.attachmentName && (
                  <span className="font-mono text-sky-700 text-[11px] flex items-center gap-1">
                    <Download className="w-3.5 h-3.5" />
                    {ann.attachmentName}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Publish Modal */}
      {showPublishModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <h2 className="text-base font-bold text-slate-900 mb-1">Issue Official Notice</h2>
            <form onSubmit={handlePublish} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700">Notice Title (English):</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Schedule of Vidyasagar University Form Fill-up"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-xs mt-1 px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700">Notice Title (বাংলা / Bengali Optional):</label>
                <input
                  type="text"
                  placeholder="e.g. পরীক্ষার ফর্ম পূরণ সংক্রান্ত বিজ্ঞপ্তি"
                  value={titleBengali}
                  onChange={(e) => setTitleBengali(e.target.value)}
                  className="w-full text-xs mt-1 px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700">Target Audience:</label>
                  <select
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value as Announcement['targetAudience'])}
                    className="w-full text-xs mt-1 px-3 py-2 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="all">Entire College (All)</option>
                    <option value="students">Students Only</option>
                    <option value="faculty">Faculty & Staff</option>
                    <option value="department">Department Specific</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700">Priority Level:</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as Announcement['priority'])}
                    className="w-full text-xs mt-1 px-3 py-2 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="normal">Normal</option>
                    <option value="urgent">Urgent</option>
                    <option value="info">Informational</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700">Notice Text Content:</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Official notification directives, requirements, and dates..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full text-xs mt-1 px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPublishModal(false)}
                  className="px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-semibold"
                >
                  Publish Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
