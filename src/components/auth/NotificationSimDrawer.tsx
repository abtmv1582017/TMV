import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Mail, MessageSquare, X, ExternalLink, KeyRound, Bell } from 'lucide-react';

export const NotificationSimDrawer: React.FC = () => {
  const { dispatchedNotifications, dismissNotification, setActiveAuthModal } = useApp();
  const [isOpen, setIsOpen] = useState(true);

  if (dispatchedNotifications.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm w-full space-y-2 pointer-events-none">
      {dispatchedNotifications.slice(0, 3).map((notif) => (
        <div
          key={notif.id}
          className="pointer-events-auto bg-slate-900 text-white rounded-xl p-4 shadow-2xl border border-slate-700 space-y-2 animate-in fade-in slide-in-from-bottom-2"
        >
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 font-bold text-sky-400">
              {notif.type === 'email' ? <Mail className="w-3.5 h-3.5" /> : <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />}
              <span>{notif.type === 'email' ? 'Dispatched Institutional Email' : 'Dispatched SMS Gateway'}</span>
            </span>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-400 font-mono">{notif.timestamp}</span>
              <button
                onClick={() => dismissNotification(notif.id)}
                className="text-slate-400 hover:text-white p-0.5"
                title="Dismiss"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="text-xs">
            <div className="text-slate-300 font-mono text-[11px]">To: {notif.destination}</div>
            <div className="font-semibold text-white mt-1">{notif.subject}</div>
            <p className="text-slate-300 text-[11px] mt-1 leading-relaxed bg-slate-800/80 p-2 rounded-lg border border-slate-700/60 font-mono">
              {notif.message}
            </p>
          </div>

          {notif.otpCode && (
            <div className="flex items-center justify-between bg-sky-950/60 p-2 rounded-lg border border-sky-600/30 text-xs">
              <span className="text-sky-300 text-[11px] font-mono">One-Time Code:</span>
              <span className="font-mono font-bold text-sky-200 text-sm tracking-widest">{notif.otpCode}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
