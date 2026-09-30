import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AuthService } from '../../services/authService';
import { ShieldCheck, CheckCircle2, AlertCircle, Eye, EyeOff } from 'lucide-react';

interface AccountActivationModalProps {
  onClose: () => void;
  onSuccess: (userId: string) => void;
}

export const AccountActivationModal: React.FC<AccountActivationModalProps> = ({
  onClose,
  onSuccess
}) => {
  const { activateAccount, authPolicy, language } = useApp();

  const [userId, setUserId] = useState('');
  const [activationCode, setActivationCode] = useState('TM-ACTIVATE');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isDone, setIsDone] = useState(false);

  const strength = AuthService.checkPasswordStrength(newPassword);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword.length < authPolicy.minPasswordLength) {
      setError(`Password must be at least ${authPolicy.minPasswordLength} characters.`);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    const res = await activateAccount(userId.trim(), activationCode.trim(), newPassword);
    setIsLoading(false);

    if (res.success) {
      setIsDone(true);
    } else {
      setError(res.error || 'Activation failed.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {language === 'bn' ? 'অ্যাকাউন্ট সক্রিয়করণ' : 'First-Time Account Activation'}
              </h2>
              <p className="text-[11px] text-slate-500">Tamralipta Mahavidyalaya Security Onboarding</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 text-xs p-1">✕</button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {!isDone ? (
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-700 block">
                  Institutional User ID:
                </label>
                <span className="text-[10px] text-slate-400">Select or enter below</span>
              </div>
              <input
                type="text"
                required
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="e.g. TM-STD-2026-00042 or registered email"
                className="w-full text-xs px-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:border-sky-500"
              />
              {/* Quick Persona Suggestions */}
              <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                <span className="text-[10px] text-slate-400">Quick-pick:</span>
                <button
                  type="button"
                  onClick={() => setUserId('TM-STD-2026-00042')}
                  className="px-2 py-0.5 bg-slate-100 hover:bg-sky-100 hover:text-sky-800 text-[10px] font-mono text-slate-700 rounded-md transition cursor-pointer"
                >
                  Student (TM-STD)
                </button>
                <button
                  type="button"
                  onClick={() => setUserId('TM-FAC-0028')}
                  className="px-2 py-0.5 bg-slate-100 hover:bg-sky-100 hover:text-sky-800 text-[10px] font-mono text-slate-700 rounded-md transition cursor-pointer"
                >
                  Faculty (TM-FAC)
                </button>
                <button
                  type="button"
                  onClick={() => setUserId('TM-HOD-0014')}
                  className="px-2 py-0.5 bg-slate-100 hover:bg-sky-100 hover:text-sky-800 text-[10px] font-mono text-slate-700 rounded-md transition cursor-pointer"
                >
                  HOD (TM-HOD)
                </button>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-700 block">
                  Activation Key / Verification Code:
                </label>
                <span className="text-[10px] text-emerald-600 font-medium">Pre-filled default</span>
              </div>
              <input
                type="text"
                required
                value={activationCode}
                onChange={(e) => setActivationCode(e.target.value)}
                placeholder="From your admission notice (e.g. TM-ACTIVATE)"
                className="w-full text-xs px-3.5 py-2.5 border border-slate-300 rounded-xl font-mono focus:outline-none focus:border-sky-500 bg-slate-50"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                Official institutional activation key is <code>TM-ACTIVATE</code>.
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1">
                <span>Set Personal Password:</span>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-500 text-[11px] cursor-pointer"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 10 characters (e.g. Tamralipta@2026)"
                className="w-full text-xs px-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:border-sky-500"
              />

              <div className="mt-1 flex items-center justify-between text-[11px]">
                <span className={`text-[10px] ${newPassword.length >= 10 ? 'text-emerald-600 font-medium' : 'text-slate-400'}`}>
                  ✓ Minimum 10 characters ({newPassword.length}/10)
                </span>
                {newPassword && (
                  <span className="font-semibold text-slate-800 text-[10px]">{strength.label}</span>
                )}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Confirm Password:
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                className="w-full text-xs px-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:border-sky-500"
              />
              {confirmPassword && confirmPassword !== newPassword && (
                <p className="text-[10px] text-rose-500 mt-1">Passwords do not match</p>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs"
              >
                {isLoading ? 'Activating...' : 'Activate & Save Password'}
              </button>
            </div>
          </form>
        ) : (
          <div className="text-center py-4 space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900">Account Activated Successfully</h3>
              <p className="text-xs text-slate-600 mt-1">
                Your institutional login credentials are now active.
              </p>
            </div>
            <button
              onClick={() => {
                onSuccess(userId);
                onClose();
              }}
              className="w-full py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-semibold shadow-xs"
            >
              Sign In Now →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
