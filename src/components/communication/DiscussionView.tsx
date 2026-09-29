import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DiscussionThread } from '../../types';
import {
  MessageSquare,
  Plus,
  Send,
  User,
  Filter,
  CheckCircle2,
  Tag
} from 'lucide-react';

export const DiscussionView: React.FC = () => {
  const {
    discussions,
    courses,
    currentUser,
    addDiscussionThread,
    replyToDiscussion,
    language
  } = useApp();

  const [courseFilter, setCourseFilter] = useState('all');
  const [showThreadModal, setShowThreadModal] = useState(false);

  // New thread form state
  const [courseId, setCourseId] = useState(courses[0]?.id || 'course-cs-301');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tag, setTag] = useState('');

  // Reply state: threadId -> text
  const [replyMap, setReplyMap] = useState<Record<string, string>>({});

  const filteredThreads = discussions.filter((th) => {
    if (courseFilter === 'all') return true;
    return th.courseId === courseFilter;
  });

  const handleCreateThread = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const selCourse = courses.find((c) => c.id === courseId) || courses[0];

    addDiscussionThread({
      courseId: selCourse.id,
      courseCode: selCourse.code,
      title: title.trim(),
      content: content.trim(),
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorRole: currentUser.role,
      tags: tag ? [tag.trim(), selCourse.code] : [selCourse.code]
    });

    setTitle('');
    setContent('');
    setTag('');
    setShowThreadModal(false);
  };

  const handleSendReply = (threadId: string) => {
    const text = replyMap[threadId];
    if (!text || !text.trim()) return;
    replyToDiscussion(threadId, text.trim());
    setReplyMap({ ...replyMap, [threadId]: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            {language === 'bn' ? 'একাডেমিক আলোচনা ও প্রশ্নোত্তর সভা' : 'Academic Discussion & Q&A Forum'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Tamralipta Mahavidyalaya · Collaborative Peer Discussions & Faculty Mentorship
          </p>
        </div>

        <button
          onClick={() => setShowThreadModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-semibold shadow-xs transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Ask New Question</span>
        </button>
      </div>

      {/* Course Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <label className="text-xs font-semibold text-slate-700">Course Subject:</label>
          <select
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
            className="text-xs border border-slate-300 rounded-lg px-3 py-2 bg-white text-slate-800"
          >
            <option value="all">All Courses ({discussions.length} Threads)</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.code}: {c.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Discussion Threads */}
      <div className="space-y-5">
        {filteredThreads.map((th) => (
          <div
            key={th.id}
            className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="font-mono text-sky-800 font-semibold text-xs bg-sky-50 px-2 py-0.5 rounded border border-sky-200/50">
                  {th.courseCode}
                </span>
                <span className="text-xs text-slate-600 font-medium">
                  {th.authorName} ({th.authorRole.replace('_', ' ')})
                </span>
              </div>
              <span className="text-xs text-slate-400">{th.createdAt}</span>
            </div>

            <div>
              <h3 className="font-bold text-base text-slate-900">{th.title}</h3>
              <p className="text-xs text-slate-700 leading-relaxed mt-2 whitespace-pre-line">
                {th.content}
              </p>
            </div>

            {/* Replies */}
            {th.replies.length > 0 && (
              <div className="space-y-3 pt-3 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Responses ({th.replies.length})
                </h4>

                {th.replies.map((r) => (
                  <div
                    key={r.id}
                    className={`p-3.5 rounded-xl text-xs space-y-1 ${
                      r.isFacultyResponse
                        ? 'bg-sky-50 border border-sky-200/70 text-sky-950 ml-4'
                        : 'bg-slate-50 border border-slate-200/70 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">
                        {r.authorName} {r.isFacultyResponse && <span className="text-sky-800 font-semibold">✓ (Faculty Instructor)</span>}
                      </span>
                      <span className="text-[10px] text-slate-500">{r.createdAt}</span>
                    </div>
                    <p className="leading-relaxed">{r.content}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Reply Input Box */}
            <div className="pt-2 flex gap-2">
              <input
                type="text"
                placeholder="Post your academic perspective or solution..."
                value={replyMap[th.id] || ''}
                onChange={(e) => setReplyMap({ ...replyMap, [th.id]: e.target.value })}
                className="flex-1 text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-sky-500"
              />
              <button
                onClick={() => handleSendReply(th.id)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Reply</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create Thread Modal */}
      {showThreadModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <h2 className="text-base font-bold text-slate-900 mb-1">Start New Discussion Thread</h2>
            <form onSubmit={handleCreateThread} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700">Course Subject:</label>
                <select
                  value={courseId}
                  onChange={(e) => setCourseId(e.target.value)}
                  className="w-full text-xs mt-1 px-3 py-2 border border-slate-300 rounded-lg bg-white"
                >
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.code}: {c.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700">Question / Topic Heading:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Asymptotic lower bound proof for comparison-based sorting"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-xs mt-1 px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700">Topic Tag (Optional):</label>
                <input
                  type="text"
                  placeholder="e.g. Sorting, Proofs"
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                  className="w-full text-xs mt-1 px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700">Detailed Query & Description:</label>
                <textarea
                  rows={4}
                  required
                  placeholder="State your question with context or code snippets..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full text-xs mt-1 px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowThreadModal(false)}
                  className="px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-semibold"
                >
                  Post Topic
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
