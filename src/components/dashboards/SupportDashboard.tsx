import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  HelpCircle,
  Clock,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Activity,
  Server,
  HardDrive
} from 'lucide-react';
import { SupportTicket } from '../../types';

export const SupportDashboard: React.FC = () => {
  const { tickets, updateTicketStatus, replySupportTicket, setActiveTab } = useApp();
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [replyMessage, setReplyMessage] = useState('');

  const openTickets = tickets.filter((t) => t.status === 'open');
  const inProgressTickets = tickets.filter((t) => t.status === 'in_progress');
  const resolvedTickets = tickets.filter((t) => t.status === 'resolved');

  const selectedTicket = tickets.find((t) => t.id === selectedTicketId) || tickets[0];

  const handleSendReply = () => {
    if (!replyMessage.trim() || !selectedTicket) return;
    replySupportTicket(selectedTicket.id, replyMessage);
    setReplyMessage('');
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-[#0f2942] to-[#1e3a8a] text-white rounded-2xl p-6 shadow-md border border-[#274f75]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-sky-300">
              <span>IT & Technical Operations Cell</span>
              <span aria-hidden="true">·</span>
              <span>Tamralipta Mahavidyalaya</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold mt-1 tracking-tight">
              Technical Help Desk & System Health
            </h1>
            <p className="text-sm text-slate-300 mt-1">
              User assistance, ticket resolution, session integrity, and audit diagnostics
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 px-3 py-2 rounded-lg">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Core LMS Engine Operational (100% Uptime)</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Open Tickets</span>
            <AlertCircle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-bold text-rose-600 mt-2">{openTickets.length}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Needs IT response</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>In Progress</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-amber-600 mt-2">{inProgressTickets.length}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Being investigated</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Resolved Tickets</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-emerald-600 mt-2">{resolvedTickets.length}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Successfully closed</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Offline Sync Status</span>
            <HardDrive className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-2xl font-bold text-sky-700 mt-2">Active</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Zero Data-Loss Mode</div>
        </div>
      </div>

      {/* Ticket Management Split Pane */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <h2 className="text-sm font-bold text-slate-900 mb-3">Support Queue</h2>
          <div className="space-y-2">
            {tickets.map((t) => (
              <div
                key={t.id}
                onClick={() => setSelectedTicketId(t.id)}
                className={`p-3 rounded-lg border text-xs cursor-pointer transition ${
                  (selectedTicket?.id === t.id)
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
                <div className="text-[11px] text-slate-500 mt-0.5">{t.userName} ({t.userRole})</div>
              </div>
            ))}
          </div>
        </div>

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
                    From {selectedTicket.userName} ({selectedTicket.userEmail}) · {selectedTicket.createdAt}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={selectedTicket.status}
                    onChange={(e) =>
                      updateTicketStatus(selectedTicket.id, e.target.value as SupportTicket['status'])
                    }
                    className="text-xs border border-slate-300 rounded px-2 py-1 font-semibold"
                  >
                    <option value="open">OPEN</option>
                    <option value="in_progress">IN PROGRESS</option>
                    <option value="waiting">WAITING</option>
                    <option value="resolved">RESOLVED</option>
                    <option value="closed">CLOSED</option>
                  </select>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg text-xs text-slate-800 border border-slate-100">
                <div className="font-semibold text-slate-900 mb-1">Issue Description:</div>
                <p>{selectedTicket.description}</p>
              </div>

              {selectedTicket.replies.length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-slate-700">Communication History:</div>
                  {selectedTicket.replies.map((r) => (
                    <div
                      key={r.id}
                      className={`p-3 rounded-lg text-xs ${
                        r.isStaff
                          ? 'bg-sky-50 border border-sky-100 text-sky-950 ml-4'
                          : 'bg-slate-100 text-slate-800 mr-4'
                      }`}
                    >
                      <div className="flex items-center justify-between font-semibold text-[11px] mb-1">
                        <span>{r.author}</span>
                        <span className="text-[10px] text-slate-500 font-normal">{r.date}</span>
                      </div>
                      <p>{r.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100">
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Post Technical Staff Resolution / Response:
              </label>
              <div className="flex gap-2">
                <textarea
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  placeholder="Provide resolution steps or technical confirmation..."
                  className="flex-1 text-xs border border-slate-300 rounded-lg p-2.5 focus:outline-none focus:border-sky-500"
                  rows={2}
                />
                <button
                  onClick={handleSendReply}
                  className="px-4 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-semibold transition self-end py-2"
                >
                  Send Reply
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
