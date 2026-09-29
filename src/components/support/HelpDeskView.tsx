import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SupportTicket } from '../../types';
import {
  HelpCircle,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Send,
  BookOpen
} from 'lucide-react';

export const HelpDeskView: React.FC = () => {
  const {
    tickets,
    currentUser,
    createSupportTicket,
    replySupportTicket,
    updateTicketStatus,
    language
  } = useApp();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  // Ticket creation state
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState<SupportTicket['category']>('technical');
  const [priority, setPriority] = useState<SupportTicket['priority']>('medium');
  const [description, setDescription] = useState('');

  // FAQs data
  const faqs = [
    {
      q: 'What should I do if my internet connection drops during an online examination?',
      a: 'TM-LMS has offline resilience built-in. Your question responses are auto-saved to your browser cache every 5 seconds. When connection returns, click Resume Test to seamlessly restore your progress without data loss.'
    },
    {
      q: 'How are grades computed under Vidyasagar University CBCS regulations?',
      a: 'Course grading combines Continuous Internal Evaluation (Assignments + Online Quizzes = 50 Marks) and End-Semester/Midterm Examinations (50 Marks), mapped to 10-point SGPA/CGPA grade scale (O: 90-100%, A+: 80-89%, A: 70-79%).'
    },
    {
      q: 'Can I replace my assignment submission before the deadline?',
      a: 'Yes, if the assignment allows resubmissions, navigate to the Assignment module, click your submission, and upload the updated document before the closing timestamp.'
    }
  ];

  const userTickets =
    currentUser.role === 'tech_support' || currentUser.role === 'super_admin'
      ? tickets
      : tickets.filter((t) => t.userId === currentUser.id);

  const selectedTicket = tickets.find((t) => t.id === selectedTicketId) || userTickets[0];

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !description.trim()) return;

    createSupportTicket({
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: currentUser.role,
      userEmail: currentUser.email,
      category,
      subject: subject.trim(),
      description: description.trim(),
      priority,
      status: 'open'
    });

    setSubject('');
    setDescription('');
    setShowCreateModal(false);
  };

  const handleSendReply = () => {
    if (!replyText.trim() || !selectedTicket) return;
    replySupportTicket(selectedTicket.id, replyText.trim());
    setReplyText('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            {language === 'bn' ? 'সহায়তা কেন্দ্র ও প্রযুক্তিগত হেল্পডেস্ক' : 'Help Desk & User Support Center'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Tamralipta Mahavidyalaya · Issue Ticketing, FAQs & Technical Assistance
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-semibold shadow-xs transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Submit Support Ticket</span>
        </button>
      </div>

      {/* FAQs Section */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-sky-600" />
          Frequently Asked Questions (FAQs)
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {faqs.map((faq, i) => (
            <div key={i} className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/70 space-y-1.5">
              <div className="font-bold text-slate-900">{faq.q}</div>
              <p className="text-slate-600 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tickets Split Pane */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ticket List */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 mb-3">
            {currentUser.role === 'tech_support' ? 'All User Support Tickets' : 'Your Submitted Tickets'}
          </h3>

          <div className="space-y-2">
            {userTickets.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-400">
                No active support tickets found.
              </div>
            ) : (
              userTickets.map((t) => (
                <div
                  key={t.id}
                  onClick={() => setSelectedTicketId(t.id)}
                  className={`p-3 rounded-lg border text-xs cursor-pointer transition ${
                    selectedTicket?.id === t.id
                      ? 'border-sky-500 bg-sky-50/50'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] text-slate-500">{t.ticketNumber}</span>
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                        t.status === 'resolved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : t.status === 'in_progress'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {t.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="font-semibold text-slate-900 mt-1 line-clamp-1">{t.subject}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5 flex justify-between">
                    <span>{t.userName}</span>
                    <span>{t.createdAt.substring(0, 10)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Selected Ticket Thread */}
        {selectedTicket && (
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <div className="font-mono text-xs text-sky-700 font-semibold">
                    {selectedTicket.ticketNumber} · Category: {selectedTicket.category.toUpperCase()}
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mt-0.5">
                    {selectedTicket.subject}
                  </h3>
                  <div className="text-xs text-slate-500 mt-0.5">
                    By {selectedTicket.userName} ({selectedTicket.userEmail}) · {selectedTicket.createdAt}
                  </div>
                </div>

                <div>
                  <span
                    className={`px-2.5 py-1 rounded text-xs font-semibold ${
                      selectedTicket.status === 'resolved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : selectedTicket.status === 'in_progress'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    STATUS: {selectedTicket.status.toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl text-xs text-slate-800 border border-slate-100 leading-relaxed">
                <div className="font-semibold text-slate-900 mb-1">Issue Details:</div>
                <p>{selectedTicket.description}</p>
              </div>

              {selectedTicket.replies.length > 0 && (
                <div className="space-y-2.5">
                  <div className="text-xs font-semibold text-slate-700">Support Communication:</div>
                  {selectedTicket.replies.map((r) => (
                    <div
                      key={r.id}
                      className={`p-3 rounded-xl text-xs ${
                        r.isStaff
                          ? 'bg-sky-50 border border-sky-200/60 text-sky-950 ml-4'
                          : 'bg-slate-100 text-slate-800 mr-4'
                      }`}
                    >
                      <div className="flex items-center justify-between font-semibold text-[11px] mb-1">
                        <span>{r.author}</span>
                        <span className="text-[10px] text-slate-500 font-normal">{r.date}</span>
                      </div>
                      <p className="leading-relaxed">{r.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100">
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Post Message / Follow-up:
              </label>
              <div className="flex gap-2">
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type message or additional diagnostics..."
                  className="flex-1 text-xs border border-slate-300 rounded-lg p-2.5 focus:outline-none focus:border-sky-500"
                  rows={2}
                />
                <button
                  onClick={handleSendReply}
                  className="px-4 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-semibold transition self-end py-2"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Create Ticket Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h2 className="text-base font-bold text-slate-900 mb-1">File Support Request</h2>
            <form onSubmit={handleCreateTicket} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700">Subject / Problem Summary:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cannot download lecture PDF on mobile browser"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full text-xs mt-1 px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700">Category:</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as SupportTicket['category'])}
                    className="w-full text-xs mt-1 px-3 py-2 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="technical">Technical / Network</option>
                    <option value="course">Course & Materials</option>
                    <option value="quiz">Online Quiz Engine</option>
                    <option value="submission">Assignment Submission</option>
                    <option value="login">Account & Login</option>
                    <option value="other">Other Inquiry</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700">Priority:</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as SupportTicket['priority'])}
                    className="w-full text-xs mt-1 px-3 py-2 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700">Detailed Problem Description:</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Describe what occurred, any error messages, and browser/device details..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full text-xs mt-1 px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-semibold"
                >
                  Submit Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
