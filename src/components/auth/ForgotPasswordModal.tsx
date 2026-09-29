import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { AuthService } from '../../services/authService';
import {
  KeyRound,
  Mail,
  Smartphone,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  ShieldCheck,
  Clock,
  RotateCcw
} from 'lucide-react';

interface ForgotPasswordModalProps {
  onClose: () => void;
  onSuccessReturnToLogin: () => void;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  onClose,
  onSuccessReturnToLogin
}) => {
  const {
    requestPasswordReset,
    verifyOtp,
    completePasswordReset,
    authPolicy,
    language,
    t
  } = useApp();

  // Recovery method: 'email' | 'mobile_otp'
  const [method, setMethod] = useState<'email' | 'mobile_otp'>('email');
  const [step, setStep] = useState<'request' | 'verify_otp' | 'new_password' | 'success'>('request');

  // Request form state
  const [identifier, setIdentifier] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  // Active session state
  const [activeToken, setActiveToken] = useState<string>('');
  const [maskedTarget, setMaskedTarget] = useState<string>('');
  const [enteredOtp, setEnteredOtp] = useState<string>('');
  const [otpAttemptsLeft, setOtpAttemptsLeft] = useState<number>(3);
  const [resendCooldown, setResendCooldown] = useState<number>(0);

  // New password form state
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Countdown for resend cooldown
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const interval = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [resendCooldown]);

  const strength = AuthService.checkPasswordStrength(newPassword);

  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) return;

    setIsLoading(true);
    setErrorMessage('');

    const res = await requestPasswordReset(identifier.trim(), method);
    setIsLoading(false);

    if (res.record) {
      setActiveToken(res.record.token);
      setMaskedTarget(res.record.targetContact);

      if (method === 'mobile_otp') {
        setStep('verify_otp');
        setResendCooldown(60);
      } else {
        // Email link mode - show email notification and provide direct link to new_password
        setStatusMessage(res.message);
        setStep('new_password');
      }
    } else {
      // Safe enumeration prevention message
      setStatusMessage('If an account matches this identifier, instructions have been dispatched.');
      setStep('new_password');
    }
  };

  const handleVerifyOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!enteredOtp.trim()) return;

    setIsLoading(true);
    setErrorMessage('');

    const res = await verifyOtp(activeToken, enteredOtp.trim());
    setIsLoading(false);

    if (res.success) {
      setStep('new_password');
    } else {
      setErrorMessage(res.error || 'Invalid OTP code.');
    }
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0) return;
    setErrorMessage('');
    const res = await requestPasswordReset(identifier.trim(), 'mobile_otp');
    if (res.record) {
      setActiveToken(res.record.token);
      setResendCooldown(60);
      setStatusMessage('New verification code dispatched via SMS.');
    }
  };

  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (newPassword.length < authPolicy.minPasswordLength) {
      setErrorMessage(`Password must be at least ${authPolicy.minPasswordLength} characters.`);
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter.');
      return;
    }

    setIsLoading(true);
    const res = await completePasswordReset(activeToken, newPassword);
    setIsLoading(false);

    if (res.success) {
      setStep('success');
    } else {
      setErrorMessage(res.error || 'Failed to update password.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
        {/* Step Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center font-bold">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {language === 'bn' ? 'পাসওয়ার্ড পুনরুদ্ধার' : 'Account Password Recovery'}
              </h2>
              <p className="text-[11px] text-slate-500">Tamralipta Mahavidyalaya Security Cell</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-lg text-xs"
          >
            ✕
          </button>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* STEP 1: Method & Identifier input */}
        {step === 'request' && (
          <form onSubmit={handleRequestSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-2">
                Choose Verification Channel:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setMethod('email')}
                  className={`p-3 rounded-xl border text-xs font-semibold flex items-center gap-2.5 transition ${
                    method === 'email'
                      ? 'border-sky-600 bg-sky-50 text-sky-900 shadow-xs'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Mail className="w-4 h-4 text-sky-600" />
                  <div className="text-left">
                    <div>Registered Email</div>
                    <div className="text-[10px] text-slate-400 font-normal">Reset Link</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setMethod('mobile_otp')}
                  className={`p-3 rounded-xl border text-xs font-semibold flex items-center gap-2.5 transition ${
                    method === 'mobile_otp'
                      ? 'border-sky-600 bg-sky-50 text-sky-900 shadow-xs'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Smartphone className="w-4 h-4 text-emerald-600" />
                  <div className="text-left">
                    <div>Mobile OTP</div>
                    <div className="text-[10px] text-slate-400 font-normal">6-digit Code</div>
                  </div>
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                {method === 'email' ? 'Enter User ID or Registered Email Address:' : 'Enter User ID or Registered Mobile Number:'}
              </label>
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder={
                  method === 'email'
                    ? 'e.g. TM-STD-2026-00042 or s.jana@student.tamralipta.ac.in'
                    : 'e.g. TM-STD-2026-00042 or +91 89102 45678'
                }
                className="w-full text-xs px-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Your contact will receive a single-use verification code valid for {authPolicy.resetLinkExpiryMinutes} minutes.
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
                className="px-5 py-2.5 bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white rounded-xl text-xs font-semibold shadow-xs transition"
              >
                {isLoading ? 'Verifying...' : 'Dispatch Recovery Code →'}
              </button>
            </div>
          </form>
        )}

        {/* STEP 2: Mobile OTP Entry */}
        {step === 'verify_otp' && (
          <form onSubmit={handleVerifyOtpSubmit} className="space-y-4">
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs">
              <div className="text-slate-500">Recovery SMS Dispatched To:</div>
              <div className="font-bold text-slate-900 font-mono text-sm mt-0.5">{maskedTarget}</div>
              <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                <span>Code expires in 5 minutes</span>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Enter 6-Digit Verification Code (OTP):
              </label>
              <input
                type="text"
                required
                maxLength={6}
                value={enteredOtp}
                onChange={(e) => setEnteredOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="6-digit code"
                className="w-full text-center text-lg font-mono tracking-widest font-bold px-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:border-sky-500"
              />
            </div>

            <div className="flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={resendCooldown > 0}
                className="text-sky-700 font-semibold disabled:text-slate-400 hover:underline flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Code'}</span>
              </button>

              <button
                type="submit"
                disabled={isLoading || enteredOtp.length < 6}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-xs font-semibold shadow-xs"
              >
                {isLoading ? 'Verifying...' : 'Validate Code →'}
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: Create New Password */}
        {step === 'new_password' && (
          <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
            {maskedTarget && (
              <div className="p-3 bg-sky-50 border border-sky-200 rounded-xl text-xs text-sky-900">
                Identity verified via <strong>{maskedTarget}</strong>. Please define your new institutional password.
              </div>
            )}

            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1">
                <span>Create New Password:</span>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-500 hover:text-slate-800 flex items-center gap-1"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{showPassword ? 'Hide' : 'Show'}</span>
                </button>
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 10 characters"
                className="w-full text-xs px-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:border-sky-500"
              />

              {/* Password Strength Indicator */}
              {newPassword && (
                <div className="mt-2 space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">Password Strength:</span>
                    <span className="font-semibold text-slate-800">{strength.label}</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-1.5 transition-all duration-300 ${
                        strength.score <= 1
                          ? 'w-1/4 bg-rose-500'
                          : strength.score === 2
                          ? 'w-2/4 bg-amber-500'
                          : strength.score === 3
                          ? 'w-3/4 bg-sky-500'
                          : 'w-full bg-emerald-600'
                      }`}
                    />
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Confirm New Password:
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                className="w-full text-xs px-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:border-sky-500"
              />
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600 space-y-1">
              <div className="font-semibold text-slate-800">Password Policy Criteria:</div>
              <div>• Minimum {authPolicy.minPasswordLength} characters long</div>
              <div>• Uppercase & lowercase letters, numerals, and special symbols</div>
              <div>• Passwords are encrypted using SHA-256 with institutional salting</div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={isLoading || newPassword.length < authPolicy.minPasswordLength}
                className="w-full py-2.5 bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white rounded-xl text-xs font-semibold shadow-xs"
              >
                {isLoading ? 'Updating Security Credentials...' : 'Save New Password & Complete'}
              </button>
            </div>
          </form>
        )}

        {/* STEP 4: Success confirmation */}
        {step === 'success' && (
          <div className="text-center py-4 space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900">Password Reset Successfully</h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed max-w-sm mx-auto">
                {t('auth_reset_success')}
              </p>
            </div>

            <div className="pt-2">
              <button
                onClick={onSuccessReturnToLogin}
                className="w-full py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-semibold shadow-xs transition"
              >
                Sign In With New Password →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
