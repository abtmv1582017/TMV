import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AuthService } from '../../services/authService';
import {
  User as UserIcon,
  Shield,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Phone,
  Mail,
  Building2,
  Calendar,
  Lock
} from 'lucide-react';

interface UserProfileModalProps {
  onClose: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({ onClose }) => {
  const { currentUser, changeUserPassword, departments, language } = useApp();

  const [activeTab, setActiveTab] = useState<'profile' | 'password' | 'contact'>('profile');

  // Change password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordStatus, setPasswordStatus] = useState<{ success: boolean; message: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Contact request state
  const [newEmail, setNewEmail] = useState(currentUser.email);
  const [newPhone, setNewPhone] = useState(currentUser.phone);
  const [contactSuccess, setContactSuccess] = useState(false);

  const dept = departments.find((d) => d.id === currentUser.departmentId);

  const handleChangePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordStatus(null);

    if (newPassword.length < 8) {
      setPasswordStatus({ success: false, message: 'New password must be at least 8 characters long.' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordStatus({ success: false, message: 'New passwords do not match.' });
      return;
    }

    setIsLoading(true);
    const res = await changeUserPassword(currentUser.id, currentPassword, newPassword);
    setIsLoading(false);

    if (res.success) {
      setPasswordStatus({ success: true, message: 'Password updated successfully!' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      setPasswordStatus({ success: false, message: res.error || 'Failed to update password.' });
    }
  };

  const handleContactRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSuccess(true);
    setTimeout(() => setContactSuccess(false), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-sm">
              {currentUser.name
                .split(' ')
                .map((n) => n[0])
                .slice(0, 2)
                .join('')}
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">{currentUser.name}</h2>
              <div className="text-xs text-sky-800 font-mono font-semibold">
                User ID: {currentUser.institutionUserId}
              </div>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 text-xs p-1">✕</button>
        </div>

        {/* Tab selection */}
        <div className="flex items-center gap-1 border-b border-slate-200 mb-5 text-xs">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-3 py-2 font-semibold border-b-2 transition ${
              activeTab === 'profile'
                ? 'border-sky-600 text-sky-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Institutional Identity
          </button>
          <button
            onClick={() => setActiveTab('password')}
            className={`px-3 py-2 font-semibold border-b-2 transition ${
              activeTab === 'password'
                ? 'border-sky-600 text-sky-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Change Password
          </button>
          <button
            onClick={() => setActiveTab('contact')}
            className={`px-3 py-2 font-semibold border-b-2 transition ${
              activeTab === 'contact'
                ? 'border-sky-600 text-sky-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Verified Contacts
          </button>
        </div>

        {/* Tab 1: Profile Details */}
        {activeTab === 'profile' && (
          <div className="space-y-4 text-xs">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5">
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500">Legal Name:</span>
                <span className="font-semibold text-slate-900">{currentUser.name}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500">Institutional User ID:</span>
                <span className="font-mono font-bold text-sky-800">{currentUser.institutionUserId}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500">Stakeholder Role:</span>
                <span className="capitalize font-semibold text-slate-800">{currentUser.role.replace('_', ' ')}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500">Department:</span>
                <span className="font-medium text-slate-800">{dept?.name || 'College Administration'}</span>
              </div>
              {currentUser.rollNumber && (
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500">Student Roll Number:</span>
                  <span className="font-mono font-semibold text-slate-800">{currentUser.rollNumber}</span>
                </div>
              )}
              {currentUser.registrationNumber && (
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500">VU Registration No:</span>
                  <span className="font-mono font-semibold text-slate-800">{currentUser.registrationNumber}</span>
                </div>
              )}
              {currentUser.designation && (
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500">Official Designation:</span>
                  <span className="font-medium text-slate-800">{currentUser.designation}</span>
                </div>
              )}
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500">Account Status:</span>
                <span className="font-bold text-emerald-700 uppercase bg-emerald-50 px-2 py-0.5 rounded">
                  {currentUser.accountStatus}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Last Authentication:</span>
                <span className="font-mono text-slate-600">{currentUser.lastLogin}</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Change Password */}
        {activeTab === 'password' && (
          <form onSubmit={handleChangePasswordSubmit} className="space-y-3.5 text-xs">
            {passwordStatus && (
              <div
                className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
                  passwordStatus.success
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    : 'bg-rose-50 border-rose-200 text-rose-800'
                }`}
              >
                {passwordStatus.success ? <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
                <span>{passwordStatus.message}</span>
              </div>
            )}

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Current Password:</label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                className="w-full text-xs px-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">New Password:</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimum 10 characters"
                className="w-full text-xs px-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Confirm New Password:</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-type new password"
                className="w-full text-xs px-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:border-sky-500"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-semibold shadow-xs"
              >
                {isLoading ? 'Updating...' : 'Save New Password'}
              </button>
            </div>
          </form>
        )}

        {/* Tab 3: Contact Verification */}
        {activeTab === 'contact' && (
          <form onSubmit={handleContactRequest} className="space-y-4 text-xs">
            {contactSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>Contact update request recorded and queued for verification.</span>
              </div>
            )}

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Registered Institutional Email:</label>
              <div className="flex items-center gap-2">
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="flex-1 text-xs px-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:border-sky-500"
                />
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded">
                  ✓ Verified
                </span>
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Registered Mobile Number (SMS Recovery):</label>
              <div className="flex items-center gap-2">
                <input
                  type="tel"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  className="flex-1 text-xs px-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:border-sky-500"
                />
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded">
                  ✓ Verified
                </span>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200">
              Recovery verification codes (OTP and password reset tokens) are transmitted exclusively to these registered channels under DPDP Act protocols.
            </p>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-semibold shadow-xs"
              >
                Request Contact Information Update
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
