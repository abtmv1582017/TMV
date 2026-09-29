import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserCheck, Mail, Smartphone, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';

interface ForgotUserIdModalProps {
  onClose: () => void;
  onUseUserId: (userId: string) => void;
}

export const ForgotUserIdModal: React.FC<ForgotUserIdModalProps> = ({
  onClose,
  onUseUserId
}) => {
  const { requestUserIdRetrieval, language } = useApp();

  const [contact, setContact] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successInfo, setSuccessInfo] = useState<{ message: string; userId?: string } | null>(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contact.trim()) return;

    setIsLoading(true);
    setError('');

    const res = await requestUserIdRetrieval(contact.trim());
    setIsLoading(false);

    if (res.success) {
      setSuccessInfo({ message: res.message, userId: res.foundUserId });
    } else {
      setError('Unable to retrieve User ID for the specified contact information.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center font-bold">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {language === 'bn' ? 'ইউজার আইডি পুনরুদ্ধার' : 'Forgot Institutional User ID?'}
              </h2>
              <p className="text-[11px] text-slate-500">Tamralipta Mahavidyalaya Stakeholder Verification</p>
            </div>
          </div>

          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1 text-xs">
            ✕
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {!successInfo ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Enter Registered Email Address or Mobile Number:
              </label>
              <input
                type="text"
                required
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="e.g. s.jana@student.tamralipta.ac.in or +91 89102 45678"
                className="w-full text-xs px-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:border-sky-500"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                The institutional directory will verify your contact details and securely communicate your User ID.
              </p>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={onClose}
                className="text-xs font-semibold text-slate-600 hover:text-slate-900"
              >
                ← Return to Login
              </button>

              <button
                type="submit"
                disabled={isLoading}
                className="px-5 py-2.5 bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white rounded-xl text-xs font-semibold shadow-xs"
              >
                {isLoading ? 'Verifying...' : 'Find My User ID'}
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4 text-center py-2">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-sm font-bold text-slate-900">User ID Identified</h3>
              <p className="text-xs text-slate-600 mt-1">{successInfo.message}</p>
            </div>

            {successInfo.userId && (
              <div className="p-3 bg-sky-50 border border-sky-200 rounded-xl">
                <div className="text-[11px] text-slate-500 font-medium">Your Institutional User ID:</div>
                <div className="font-mono text-base font-bold text-sky-900 mt-0.5">
                  {successInfo.userId}
                </div>
              </div>
            )}

            <button
              onClick={() => {
                if (successInfo.userId) onUseUserId(successInfo.userId);
                onClose();
              }}
              className="w-full py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center justify-center gap-1.5"
            >
              <span>Copy User ID to Login</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
