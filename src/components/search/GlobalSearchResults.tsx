import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  BookOpen,
  FileText,
  FileCheck,
  Bell,
  Users,
  Search,
  ArrowRight
} from 'lucide-react';

export const GlobalSearchResults: React.FC = () => {
  const {
    globalSearchQuery,
    setGlobalSearchQuery,
    courses,
    resources,
    assignments,
    announcements,
    users,
    setSelectedCourseId,
    setActiveTab
  } = useApp();

  const q = globalSearchQuery.trim().toLowerCase();

  const matchedCourses = courses.filter(
    (c) =>
      c.title.toLowerCase().includes(q) ||
      c.code.toLowerCase().includes(q) ||
      c.facultyName.toLowerCase().includes(q)
  );

  const matchedResources = resources.filter(
    (r) =>
      r.title.toLowerCase().includes(q) ||
      (r.courseCode && r.courseCode.toLowerCase().includes(q)) ||
      r.uploadedByName.toLowerCase().includes(q)
  );

  const matchedAssignments = assignments.filter(
    (a) =>
      a.title.toLowerCase().includes(q) ||
      a.courseCode.toLowerCase().includes(q) ||
      a.instructions.toLowerCase().includes(q)
  );

  const matchedAnnouncements = announcements.filter(
    (an) => an.title.toLowerCase().includes(q) || an.content.toLowerCase().includes(q)
  );

  const matchedUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      (u.rollNumber && u.rollNumber.toLowerCase().includes(q))
  );

  const totalResults =
    matchedCourses.length +
    matchedResources.length +
    matchedAssignments.length +
    matchedAnnouncements.length +
    matchedUsers.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Search Results for "<span className="text-sky-700">{globalSearchQuery}</span>"
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Found {totalResults} institutional records matching query
          </p>
        </div>
        <button
          onClick={() => setGlobalSearchQuery('')}
          className="text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg"
        >
          Clear Search
        </button>
      </div>

      {totalResults === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8">
          <Search className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="font-bold text-slate-800 text-sm">No matches found</h3>
          <p className="text-xs text-slate-500 mt-1">
            Try searching for terms like "Algorithms", "AVL", "CMSA", "Jana", "Notice", or "Exam".
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Courses */}
          {matchedCourses.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-sky-600" />
                Academic Courses ({matchedCourses.length})
              </h3>
              <div className="divide-y divide-slate-100">
                {matchedCourses.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => {
                      setSelectedCourseId(c.id);
                      setActiveTab('courses');
                      setGlobalSearchQuery('');
                    }}
                    className="py-3 flex items-center justify-between hover:bg-slate-50 cursor-pointer rounded-lg px-2 text-xs"
                  >
                    <div>
                      <div className="font-bold text-slate-900">
                        <span className="font-mono text-sky-800 mr-2">{c.code}</span>
                        {c.title}
                      </div>
                      <div className="text-slate-500 mt-0.5">
                        {c.facultyName} · Semester {c.semester} · {c.credits} Credits
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Resources */}
          {matchedResources.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-600" />
                Study Materials & Handouts ({matchedResources.length})
              </h3>
              <div className="divide-y divide-slate-100">
                {matchedResources.map((r) => (
                  <div
                    key={r.id}
                    onClick={() => {
                      setActiveTab('resources');
                      setGlobalSearchQuery('');
                    }}
                    className="py-3 flex items-center justify-between hover:bg-slate-50 cursor-pointer rounded-lg px-2 text-xs"
                  >
                    <div>
                      <div className="font-bold text-slate-900">{r.title}</div>
                      <div className="text-slate-500 mt-0.5">
                        {r.courseCode} · {r.fileSize} · Uploaded by {r.uploadedByName}
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Assignments */}
          {matchedAssignments.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-amber-600" />
                Assignments ({matchedAssignments.length})
              </h3>
              <div className="divide-y divide-slate-100">
                {matchedAssignments.map((a) => (
                  <div
                    key={a.id}
                    onClick={() => {
                      setActiveTab('assignments');
                      setGlobalSearchQuery('');
                    }}
                    className="py-3 flex items-center justify-between hover:bg-slate-50 cursor-pointer rounded-lg px-2 text-xs"
                  >
                    <div>
                      <div className="font-bold text-slate-900">{a.title}</div>
                      <div className="text-slate-500 mt-0.5">
                        {a.courseCode} · Max Marks: {a.maxMarks} · Due {a.dueDate}
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Announcements */}
          {matchedAnnouncements.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Bell className="w-4 h-4 text-rose-600" />
                Announcements & Circulars ({matchedAnnouncements.length})
              </h3>
              <div className="divide-y divide-slate-100">
                {matchedAnnouncements.map((an) => (
                  <div
                    key={an.id}
                    onClick={() => {
                      setActiveTab('announcements');
                      setGlobalSearchQuery('');
                    }}
                    className="py-3 flex items-center justify-between hover:bg-slate-50 cursor-pointer rounded-lg px-2 text-xs"
                  >
                    <div>
                      <div className="font-bold text-slate-900">{an.title}</div>
                      <div className="text-slate-500 mt-0.5 line-clamp-1">{an.content}</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
