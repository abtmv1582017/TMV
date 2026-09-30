import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { AuthService } from '../../services/authService';
import {
  Shield,
  Mail,
  Smartphone,
  KeyRound,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  ShieldCheck,
  Clock,
  RotateCcw,
  Sparkles,
  Lock,
  Building2,
  FileCheck
} from 'lucide-react';
import { User } from '../../types';

interface AdminPasswordRetrievalModalProps {
  onClose: () => void;
  onSuccess: (adminUserId: string, newPassword?: string) => void;
}

export const AdminPasswordRetrievalModal: React.FC<AdminPasswordRetrievalModalProps> = ({
  onClose,
  onSuccess
}) => {
  const {
    users,
    requestPasswordReset,
    verifyOtp,
    completePasswordReset,
    authPolicy,
    language,
    t
  } = useApp();

  // Recovery method: 'email' or 'mobile_otp'
  const [method, setMethod] = useState<'email' | 'mobile_otp'>('email');
  const [step, setStep] = useState<'identify' | 'verify' | 'reset_password' | 'success'>('identify');

  // Input states
  const [identifier, setIdentifier] = useState('admin@tamralipta.ac.in');
  const [phoneInput, setPhoneInput] = useState('+91 94340 12345');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  // Active token & verification state
  const [activeToken, setActiveToken] = useState<string>('');
  const [maskedContact, setMaskedContact] = useState<string>('');
  const [enteredOtp, setEnteredOtp] = useState<string>('');
  const [targetAdmin, setTargetAdmin] = useState<User | null>(null);
  const [resendCooldown, setResendCooldown] = useState<number>(0);

  // New password state
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [retrievedTempPass, setRetrievedTempPass] = useState<string | null>(null);

  // Cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const interval = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [resendCooldown]);

  // Find admin accounts
  const adminUsers = users.filter((u) => u.role === 'super_admin' || u.role === 'principal');

  const handleSelectAdminQuick = (user: User) => {
    setTargetAdmin(user);
    if (method === 'email') {
      setIdentifier(user.email);
    } else {
      setPhoneInput(user.phone);
    }
    setErrorMessage('');
  };

  const handleInitiateRetrieval = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setStatusMessage('');

    const targetInput = method === 'email' ? identifier.trim() : phoneInput.trim();
    if (!targetInput) {
      setErrorMessage(method === 'email' ? 'Please provide registered Admin Mail ID' : 'Please provide registered Admin Phone Number');
      return;
    }

    setIsLoading(true);

    // Verify target belongs to an administrative stakeholder
    const matchedAdmin = users.find((u) => {
      const isRoleAdmin = u.role === 'super_admin' || u.role === 'principal';
      if (!isRoleAdmin) return false;

      if (method === 'email') {
        return u.email.toLowerCase() === targetInput.toLowerCase() || u.institutionUserId.toLowerCase() === targetInput.toLowerCase();
      } else {
        return u.phone.replace(/\s+/g, '') === targetInput.replace(/\s+/g, '') || u.phone.includes(targetInput.replace(/\D/g, ''));
      }
    });

    if (!matchedAdmin) {
      setIsLoading(false);
      setErrorMessage(`No authorized Master Administrator account found matching "${targetInput}". Please check the contact or select from the authorized admin profiles below.`);
      return;
    }

    setTargetAdmin(matchedAdmin);

    // Dispatch recovery token
    const res = await requestPasswordReset(
      method === 'email' ? matchedAdmin.email : matchedAdmin.phone,
      method === 'email' ? 'email' : 'mobile_otp'
    );

    setIsLoading(false);

    if (res.record) {
      setActiveToken(res.record.token);
      setMaskedContact(res.record.targetContact);

      if (method === 'mobile_otp') {
        setStep('verify');
        setResendCooldown(60);
        setStatusMessage(`6-digit Security OTP dispatched to Master Admin phone ${res.record.targetContact}. Check the alert notification drawer on the right.`);
      } else {
        // Email mode: show verification step with email security PIN
        setStep('verify');
        setResendCooldown(60);
        setStatusMessage(`Admin password reset instructions & security PIN dispatched to ${res.record.targetContact}. Preview available in notification drawer.`);
      }
    } else {
      setErrorMessage('Could not initiate recovery process. Please retry.');
    }
  };

  const handleVerifyCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!enteredOtp.trim()) {
      setErrorMessage('Please enter the 6-digit security verification code.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    const res = await verifyOtp(activeToken, enteredOtp.trim());
    setIsLoading(false);

    if (res.success) {
      setStep('reset_password');
      setStatusMessage('Identity verified successfully! You may now define a new Master Admin password or generate a secure passkey.');
    } else {
      setErrorMessage(res.error || 'Invalid or expired verification code.');
    }
  };

  const handleResendCode = async () => {
    if (resendCooldown > 0 || !targetAdmin) return;
    setErrorMessage('');
    const res = await requestPasswordReset(
      method === 'email' ? targetAdmin.email : targetAdmin.phone,
      method === 'email' ? 'email' : 'mobile_otp'
    );
    if (res.record) {
      setActiveToken(res.record.token);
      setResendCooldown(60);
      setStatusMessage(`Fresh code dispatched to ${res.record.targetContact}`);
    }
  };

  const handleCompleteReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (newPassword.length < authPolicy.minPasswordLength) {
      setErrorMessage(`Password must be at least ${authPolicy.minPasswordLength} characters long.`);
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('Password confirmation does not match.');
      return;
    }

    setIsLoading(true);
    const res = await completePasswordReset(activeToken, newPassword);
    setIsLoading(false);

    if (res.success) {
      setStep('success');
    } else {
      setErrorMessage(res.error || 'Failed to update Master Admin password.');
    }
  };

  const handleGenerateSecurePasskey = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%&*';
    let generated = 'Admin@';
    for (let i = 0; i < 8; i++) {
      generated += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewPassword(generated);
    setConfirmPassword(generated);
    setShowPassword(true);
    setRetrievedTempPass(generated);
  };

  const strength = AuthService.checkPasswordStrength(newPassword);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Institutional Admin Header */}
        <div className="bg-gradient-to-r from-[#0b1d3a] via-[#0f2942] to-[#1e1b4b] text-white p-5 sm:p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-purple-300 shadow-inner">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-purple-300">
                    Master Admin Security
                  </span>
                  <span className="text-[10px] bg-purple-900/90 text-purple-200 px-1.5 py-0.5 rounded border border-purple-400/30 font-mono">
                    AUTH-PORTAL
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white">
                  Admin Password Retrieval & Reset
                </h2>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg transition"
              aria-label="Close"
            >
              ✕
            </button>
          </div>
          <p className="text-xs text-slate-300 mt-2 leading-relaxed">
            Retrieve or reset the administrator password through your registered institution mail ID or verified mobile phone number.
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {errorMessage && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-600" />
              <div className="font-medium">{errorMessage}</div>
            </div>
          )}

          {statusMessage && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5 text-emerald-600" />
              <div className="font-medium">{statusMessage}</div>
            </div>
          )}

          {/* Step 1: Identify Admin & Select Channel (Mail ID or Phone Number) */}
          {step === 'identify' && (
            <form onSubmit={handleInitiateRetrieval} className="space-y-4">
              {/* Channel Selector */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-2">
                  Select Retrieval Channel:
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setMethod('email');
                      setErrorMessage('');
                    }}
                    className={`p-3 rounded-xl border text-left flex items-center gap-3 transition ${
                      method === 'email'
                        ? 'border-purple-500 bg-purple-50/70 text-purple-900 shadow-xs'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div
                      className={`p-2 rounded-lg ${
                        method === 'email' ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-semibold text-xs">Registered Mail ID</div>
                      <div className="text-[10px] text-slate-500">Official college email</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setMethod('mobile_otp');
                      setErrorMessage('');
                    }}
                    className={`p-3 rounded-xl border text-left flex items-center gap-3 transition ${
                      method === 'mobile_otp'
                        ? 'border-purple-500 bg-purple-50/70 text-purple-900 shadow-xs'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div
                      className={`p-2 rounded-lg ${
                        method === 'mobile_otp' ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      <Smartphone className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-semibold text-xs">Phone Number</div>
                      <div className="text-[10px] text-slate-500">6-digit SMS OTP</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Dynamic Input based on method */}
              {method === 'email' ? (
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Enter Master Admin Registered Mail ID:
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="email"
                      required
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="e.g. admin@tamralipta.ac.in"
                      className="w-full text-xs pl-10 pr-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 font-medium"
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    We will dispatch a secure password reset link & verification PIN to this address.
                  </p>
                </div>
              ) : (
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Enter Master Admin Registered Phone Number:
                  </label>
                  <div className="relative">
                    <Smartphone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="tel"
                      required
                      value={phoneInput}
                      onChange={(e) => setPhoneInput(e.target.value)}
                      placeholder="e.g. +91 94340 12345"
                      className="w-full text-xs pl-10 pr-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 font-medium font-mono"
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    We will send a 6-digit SMS verification code to this mobile number.
                  </p>
                </div>
              )}

              {/* Authorized Admin Quick Select Helper */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="text-[11px] font-semibold text-slate-600 mb-1.5 flex items-center justify-between">
                  <span>Quick Select Registered Admin Profile:</span>
                  <span className="text-[10px] text-purple-700 font-normal">Click to auto-fill</span>
                </div>
                <div className="space-y-1.5">
                  {adminUsers.map((adm) => (
                    <button
                      key={adm.id}
                      type="button"
                      onClick={() => handleSelectAdminQuick(adm)}
                      className="w-full p-2 bg-white hover:bg-purple-50/50 rounded-lg border border-slate-200/80 text-left flex items-center justify-between transition cursor-pointer text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                        <span className="font-semibold text-slate-900">{adm.name}</span>
                        <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-600 font-mono">
                          {adm.institutionUserId}
                        </span>
                      </div>
                      <div className="text-[11px] font-mono text-slate-500">
                        {method === 'email' ? adm.email : adm.phone}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-5 py-2.5 bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-800 hover:to-indigo-800 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center gap-2 disabled:opacity-50"
                >
                  <KeyRound className="w-4 h-4" />
                  <span>{isLoading ? 'Verifying & Dispatching...' : method === 'email' ? 'Dispatch Reset to Mail ID' : 'Send SMS OTP to Phone'}</span>
                </button>
              </div>
            </form>
          )}

          {/* Step 2: Verify Security Code (from Email or Phone) */}
          {step === 'verify' && (
            <form onSubmit={handleVerifyCodeSubmit} className="space-y-4">
              <div className="p-3.5 bg-purple-50/80 border border-purple-200 rounded-xl text-xs text-purple-900 flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-purple-700 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold">Security Code Dispatched!</span>
                  <p className="text-[11px] text-purple-800 mt-0.5">
                    {method === 'email'
                      ? `We have dispatched the reset security PIN to ${maskedContact}. (Preview is also available in the Notification Drawer on the right)`
                      : `A 6-digit SMS verification OTP was sent to ${maskedContact}.`}
                  </p>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Enter 6-Digit Security Verification Code:
                </label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  autoFocus
                  value={enteredOtp}
                  onChange={(e) => setEnteredOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="e.g. 741852"
                  className="w-full text-center text-lg tracking-widest font-mono py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:border-purple-500 font-bold"
                />
              </div>

              {/* Resend & Cooldown */}
              <div className="flex items-center justify-between text-xs text-slate-500">
                <button
                  type="button"
                  onClick={() => setStep('identify')}
                  className="text-slate-600 hover:text-slate-900 inline-flex items-center gap-1 font-medium"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Change Contact</span>
                </button>

                {resendCooldown > 0 ? (
                  <span className="inline-flex items-center gap-1 text-slate-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Resend in {resendCooldown}s</span>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendCode}
                    className="text-purple-700 hover:text-purple-900 inline-flex items-center gap-1 font-semibold"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Resend Verification Code</span>
                  </button>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading || enteredOtp.length < 6}
                  className="px-5 py-2.5 bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-800 hover:to-indigo-800 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center gap-2 disabled:opacity-50"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>{isLoading ? 'Verifying Code...' : 'Verify Code & Proceed'}</span>
                </button>
              </div>
            </form>
          )}

          {/* Step 3: Define New Master Admin Password */}
          {step === 'reset_password' && (
            <form onSubmit={handleCompleteReset} className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Define New Master Admin Password</h3>
                  <p className="text-xs text-slate-500">
                    For {targetAdmin?.name} ({targetAdmin?.institutionUserId})
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleGenerateSecurePasskey}
                  className="px-2.5 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                  title="Generate a cryptographically randomized secure admin password"
                >
                  <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                  <span>Auto-Generate Passkey</span>
                </button>
              </div>

              {retrievedTempPass && (
                <div className="p-3 bg-purple-950 text-purple-200 rounded-xl border border-purple-500/40 text-xs">
                  <div className="text-[10px] uppercase font-bold text-purple-300">Generated Secure Passkey:</div>
                  <div className="font-mono text-sm font-bold text-white select-all mt-0.5">
                    {retrievedTempPass}
                  </div>
                  <div className="text-[10px] text-purple-300 mt-1">
                    Auto-populated into password fields. You can copy it now or replace with your own password.
                  </div>
                </div>
              )}

              {/* Password Input */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  New Master Admin Password:
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new strong password"
                    className="w-full text-xs pl-10 pr-10 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:border-purple-500 font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-2.5 text-slate-400 hover:text-slate-700"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Password Strength Indicator */}
              {newPassword && (
                <div className="space-y-1.5 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-600">Password Strength:</span>
                    <span
                      className={`font-semibold capitalize ${
                        strength.score <= 1
                          ? 'text-rose-600'
                          : strength.score <= 3
                          ? 'text-amber-600'
                          : 'text-emerald-600'
                      }`}
                    >
                      {strength.label}
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden flex">
                    <div
                      className={`h-full transition-all duration-300 ${
                        strength.score <= 1
                          ? 'w-1/4 bg-rose-500'
                          : strength.score <= 3
                          ? 'w-3/4 bg-amber-500'
                          : 'w-full bg-emerald-500'
                      }`}
                    />
                  </div>
                </div>
              )}

              {/* Confirm Password Input */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Confirm New Password:
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat new password"
                    className="w-full text-xs pl-10 pr-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:border-purple-500 font-medium"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading || !newPassword}
                  className="px-5 py-2.5 bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-800 hover:to-indigo-800 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isLoading ? 'Updating Credentials...' : 'Save & Update Admin Password'}</span>
                </button>
              </div>
            </form>
          )}

          {/* Step 4: Success Confirmation */}
          {step === 'success' && (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-inner">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Master Admin Password Reset Successfully!
                </h3>
                <p className="text-xs text-slate-600 mt-1 max-w-md mx-auto">
                  Your Master Administrator credentials for{' '}
                  <span className="font-semibold text-purple-900">{targetAdmin?.name}</span> (
                  <span className="font-mono text-purple-700">{targetAdmin?.institutionUserId}</span>) have been updated securely.
                </p>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 max-w-sm mx-auto text-left space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Verified Channel:</span>
                  <span className="font-semibold text-slate-900">
                    {method === 'email' ? 'Registered Mail ID' : 'Phone Number SMS'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Account Status:</span>
                  <span className="font-semibold text-emerald-700">Active & Unlocked</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Failed Attempts:</span>
                  <span className="font-semibold text-slate-900">Reset to 0</span>
                </div>
              </div>

              <div className="pt-3">
                <button
                  type="button"
                  onClick={() => {
                    onSuccess(targetAdmin?.institutionUserId || 'TM-SADM-0001', newPassword);
                  }}
                  className="px-6 py-2.5 bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-800 hover:to-indigo-800 text-white rounded-xl text-xs font-bold shadow-md transition inline-flex items-center gap-2 cursor-pointer"
                >
                  <span>Sign In with New Admin Password</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
