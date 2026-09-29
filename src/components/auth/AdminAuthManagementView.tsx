import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { User, UserRole, AccountStatus, AuthPolicy } from '../../types';
import { AuthService } from '../../services/authService';
import {
  Shield,
  KeyRound,
  Lock,
  Unlock,
  Plus,
  Search,
  CheckCircle2,
  AlertCircle,
  Settings,
  Mail,
  Smartphone,
  Save,
  Clock,
  RotateCcw
} from 'lucide-react';

export const AdminAuthManagementView: React.FC = () => {
  const {
    users,
    departments,
    addUser,
    updateUser,
    unlockUserAccount,
    requestPasswordReset,
    authPolicy,
    updateAuthPolicy,
    currentUser,
    language
  } = useApp();

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeTab, setActiveTab] = useState<'accounts' | 'policies'>('accounts');

  // Policy form
  const [policyForm, setPolicyForm] = useState<AuthPolicy>({ ...authPolicy });
  const [policySaved, setPolicySaved] = useState(false);

  // New account modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+91 ');
  const [role, setRole] = useState<UserRole>('student');
  const [departmentId, setDepartmentId] = useState(departments[0]?.id || 'dept-cs');
  const [rollOrEmp, setRollOrEmp] = useState('');

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.institutionUserId.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || u.accountStatus === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    // Generate unique sequential User ID
    const count = users.filter((u) => u.role === role).length + 1;
    const newUserId = AuthService.generateUserId(role, count, 2026, authPolicy);

    addUser({
      institutionUserId: newUserId,
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      passwordHash: '8b429188e730872242a7b8c9d0e1f2', // default Tamralipta@2026
      role,
      departmentId,
      rollNumber: role === 'student' ? rollOrEmp : undefined,
      employeeId: role !== 'student' ? rollOrEmp : undefined,
      isActive: true,
      accountStatus: 'active',
      failedLoginAttempts: 0,
      emailVerified: true,
      mobileVerified: true,
      lastLogin: 'Never'
    });

    setName('');
    setEmail('');
    setPhone('+91 ');
    setRollOrEmp('');
    setShowAddModal(false);
  };

  const handleTriggerReset = async (u: User) => {
    const res = await requestPasswordReset(u.institutionUserId, 'email');
    alert(`Password reset instructions dispatched to registered email ${u.email}`);
  };

  const handleToggleDeactivate = (u: User) => {
    const newStatus: AccountStatus = u.accountStatus === 'deactivated' ? 'active' : 'deactivated';
    updateUser({
      ...u,
      accountStatus: newStatus,
      isActive: newStatus === 'active'
    });
  };

  const handleSavePolicy = (e: React.FormEvent) => {
    e.preventDefault();
    updateAuthPolicy(policyForm);
    setPolicySaved(true);
    setTimeout(() => setPolicySaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            {language === 'bn' ? 'অথেনটিকেশন ও নিরাপত্তা প্রশাসন' : 'Authentication & Security Administration'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Tamralipta Mahavidyalaya · User ID Provisioning, Lockout Policies, & Credentials Governance
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'accounts' && (
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-semibold shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Create Stakeholder Account</span>
            </button>
          )}
        </div>
      </div>

      {/* Sub tabs */}
      <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg w-fit">
        <button
          onClick={() => setActiveTab('accounts')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition ${
            activeTab === 'accounts' ? 'bg-white text-slate-900 font-semibold shadow-xs' : 'text-slate-600'
          }`}
        >
          Stakeholder Accounts ({users.length})
        </button>
        <button
          onClick={() => setActiveTab('policies')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition ${
            activeTab === 'policies' ? 'bg-white text-slate-900 font-semibold shadow-xs' : 'text-slate-600'
          }`}
        >
          Auth & Password Policies
        </button>
      </div>

      {activeTab === 'accounts' && (
        <div className="space-y-4">
          {/* Filters */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by User ID, Name, or Email..."
                className="w-full text-xs pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-sky-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="text-xs border border-slate-300 rounded-lg px-2.5 py-1.5 bg-white text-slate-700"
              >
                <option value="all">All Roles</option>
                <option value="student">Student</option>
                <option value="faculty">Faculty</option>
                <option value="dept_head">Dept Head</option>
                <option value="principal">Principal</option>
                <option value="super_admin">Super Admin</option>
                <option value="tech_support">Tech Support</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-xs border border-slate-300 rounded-lg px-2.5 py-1.5 bg-white text-slate-700"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="locked">Locked</option>
                <option value="deactivated">Deactivated</option>
                <option value="pending_activation">Pending Activation</option>
              </select>
            </div>
          </div>

          {/* Accounts Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-x-auto">
            <table className="w-full text-xs text-left text-slate-700">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-4">User ID</th>
                  <th className="py-2.5 px-4">Name & Role</th>
                  <th className="py-2.5 px-4">Registered Contact</th>
                  <th className="py-2.5 px-4 text-center">Status</th>
                  <th className="py-2.5 px-4 text-center">Failed Logins</th>
                  <th className="py-2.5 px-4 text-right">Security Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((u) => {
                  const isLocked = u.accountStatus === 'locked';

                  return (
                    <tr key={u.id} className="hover:bg-slate-50 transition">
                      <td className="py-3 px-4 font-mono font-bold text-sky-800 text-xs">
                        {u.institutionUserId}
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-900">
                        <div>{u.name}</div>
                        <div className="text-[11px] text-slate-500 capitalize font-normal">
                          {u.role.replace('_', ' ')}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        <div>{u.email}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{u.phone}</div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            u.accountStatus === 'active'
                              ? 'bg-emerald-100 text-emerald-800'
                              : u.accountStatus === 'locked'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {u.accountStatus}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center font-mono">
                        {u.failedLoginAttempts || 0} / {authPolicy.maxFailedAttempts}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {isLocked ? (
                            <button
                              onClick={() => unlockUserAccount(u.id)}
                              className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 rounded font-semibold text-[11px] flex items-center gap-1"
                              title="Unlock account"
                            >
                              <Unlock className="w-3 h-3" />
                              <span>Unlock</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => handleTriggerReset(u)}
                              className="px-2.5 py-1 bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-300 rounded font-semibold text-[11px] flex items-center gap-1"
                              title="Send password reset link"
                            >
                              <KeyRound className="w-3 h-3" />
                              <span>Reset Link</span>
                            </button>
                          )}

                          <button
                            onClick={() => handleToggleDeactivate(u)}
                            className="px-2 py-1 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded text-[11px]"
                          >
                            {u.accountStatus === 'deactivated' ? 'Activate' : 'Deactivate'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Policy configuration */}
      {activeTab === 'policies' && (
        <form onSubmit={handleSavePolicy} className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">Institutional Security & Lockout Parameters</h2>
              <p className="text-xs text-slate-500">Configure brute-force defense, OTP validity, and User ID format prefixes.</p>
            </div>
            {policySaved && (
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                Policies updated
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Minimum Password Length:</label>
              <input
                type="number"
                min="8"
                max="32"
                value={policyForm.minPasswordLength}
                onChange={(e) => setPolicyForm({ ...policyForm, minPasswordLength: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Max Failed Login Attempts before Lockout:</label>
              <input
                type="number"
                min="3"
                max="10"
                value={policyForm.maxFailedAttempts}
                onChange={(e) => setPolicyForm({ ...policyForm, maxFailedAttempts: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Lockout Duration (Minutes):</label>
              <input
                type="number"
                min="5"
                max="60"
                value={policyForm.lockoutDurationMinutes}
                onChange={(e) => setPolicyForm({ ...policyForm, lockoutDurationMinutes: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Mobile OTP Validity (Minutes):</label>
              <input
                type="number"
                min="2"
                max="15"
                value={policyForm.otpExpiryMinutes}
                onChange={(e) => setPolicyForm({ ...policyForm, otpExpiryMinutes: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">Institutional User ID Prefix Formats</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="font-medium text-slate-600 block mb-1">Student Prefix:</label>
                <input
                  type="text"
                  value={policyForm.studentIdPrefix}
                  onChange={(e) => setPolicyForm({ ...policyForm, studentIdPrefix: e.target.value })}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded font-mono uppercase"
                />
              </div>
              <div>
                <label className="font-medium text-slate-600 block mb-1">Faculty Prefix:</label>
                <input
                  type="text"
                  value={policyForm.facultyIdPrefix}
                  onChange={(e) => setPolicyForm({ ...policyForm, facultyIdPrefix: e.target.value })}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded font-mono uppercase"
                />
              </div>
              <div>
                <label className="font-medium text-slate-600 block mb-1">HOD Prefix:</label>
                <input
                  type="text"
                  value={policyForm.hodIdPrefix}
                  onChange={(e) => setPolicyForm({ ...policyForm, hodIdPrefix: e.target.value })}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded font-mono uppercase"
                />
              </div>
              <div>
                <label className="font-medium text-slate-600 block mb-1">Principal / Admin Prefix:</label>
                <input
                  type="text"
                  value={policyForm.adminIdPrefix}
                  onChange={(e) => setPolicyForm({ ...policyForm, adminIdPrefix: e.target.value })}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded font-mono uppercase"
                />
              </div>
              <div>
                <label className="font-medium text-slate-600 block mb-1">Super Admin Prefix:</label>
                <input
                  type="text"
                  value={policyForm.sadmIdPrefix}
                  onChange={(e) => setPolicyForm({ ...policyForm, sadmIdPrefix: e.target.value })}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded font-mono uppercase"
                />
              </div>
              <div>
                <label className="font-medium text-slate-600 block mb-1">Tech Support Prefix:</label>
                <input
                  type="text"
                  value={policyForm.techIdPrefix}
                  onChange={(e) => setPolicyForm({ ...policyForm, techIdPrefix: e.target.value })}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded font-mono uppercase"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-semibold shadow-xs"
            >
              <Save className="w-4 h-4" />
              <span>Save Security Policy Configuration</span>
            </button>
          </div>
        </form>
      )}

      {/* Create Account Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h2 className="text-base font-bold text-slate-900 mb-1">Provision Stakeholder Account</h2>
            <p className="text-xs text-slate-500 mb-4">
              A unique institutional User ID will be automatically generated.
            </p>

            <form onSubmit={handleCreateAccount} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Full Legal Name:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Swarup Ghosh"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Institutional Email:</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. s.ghosh@student.tamralipta.ac.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Mobile Number (SMS recovery):</label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98000 12345"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Role Category:</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="student">Student</option>
                    <option value="faculty">Faculty Member</option>
                    <option value="dept_head">Department Head</option>
                    <option value="principal">Principal</option>
                    <option value="super_admin">Super Administrator</option>
                    <option value="tech_support">Technical Support</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Department:</label>
                  <select
                    value={departmentId}
                    onChange={(e) => setDepartmentId(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                  >
                    {departments.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  {role === 'student' ? 'Student Roll Number:' : 'Faculty Employee ID:'}
                </label>
                <input
                  type="text"
                  placeholder={role === 'student' ? 'BSC/CS/2026/099' : 'TM-FAC-035'}
                  value={rollOrEmp}
                  onChange={(e) => setRollOrEmp(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg font-semibold shadow-xs"
                >
                  Create & Generate User ID
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
