import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { User, UserRole, AccountStatus } from '../../types';
import { AuthService } from '../../services/authService';
import {
  Shield,
  KeyRound,
  Users,
  Search,
  Plus,
  Download,
  Filter,
  Lock,
  Unlock,
  Edit3,
  CheckCircle2,
  AlertCircle,
  Eye,
  ShieldCheck,
  Building2,
  GraduationCap,
  BookOpen,
  HelpCircle,
  UserCheck,
  UserX,
  FileSpreadsheet,
  Mail,
  Phone,
  Sparkles,
  RefreshCw,
  Sliders,
  Layers,
  Clock
} from 'lucide-react';
import { StakeholderAtoZEditModal } from './StakeholderAtoZEditModal';
import { AdminPasswordRetrievalModal } from '../auth/AdminPasswordRetrievalModal';

export const MasterAdminStakeholderPanel: React.FC = () => {
  const {
    users,
    departments,
    programmes,
    addUser,
    updateUser,
    unlockUserAccount,
    currentUser,
    language,
    authPolicy,
    setActiveTab,
    setActiveAuthModal
  } = useApp();

  // Search & Filtering
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [deptFilter, setDeptFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Selected stakeholder for full A-to-Z editing modal
  const [editingStakeholder, setEditingStakeholder] = useState<User | null>(null);

  // New Stakeholder creation modal toggle
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Admin password recovery modal toggle
  const [showAdminRecoveryModal, setShowAdminRecoveryModal] = useState(false);

  // Notification banners
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  // Quick password override dialog state
  const [quickPasswordUser, setQuickPasswordUser] = useState<User | null>(null);
  const [newQuickPassword, setNewQuickPassword] = useState('');
  const [showQuickPass, setShowQuickPass] = useState(false);

  // Filtered users
  const filteredUsers = users.filter((u) => {
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      u.name.toLowerCase().includes(q) ||
      u.institutionUserId.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.phone.includes(q) ||
      (u.rollNumber && u.rollNumber.toLowerCase().includes(q)) ||
      (u.employeeId && u.employeeId.toLowerCase().includes(q)) ||
      (u.registrationNumber && u.registrationNumber.toLowerCase().includes(q)) ||
      (u.designation && u.designation.toLowerCase().includes(q));

    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    const matchesDept = deptFilter === 'all' || u.departmentId === deptFilter;
    const currentStatus = u.accountStatus || (u.isActive ? 'active' : 'deactivated');
    const matchesStatus = statusFilter === 'all' || currentStatus === statusFilter;

    return matchesSearch && matchesRole && matchesDept && matchesStatus;
  });

  // Role counts
  const countByRole = {
    all: users.length,
    student: users.filter((u) => u.role === 'student').length,
    faculty: users.filter((u) => u.role === 'faculty').length,
    dept_head: users.filter((u) => u.role === 'dept_head').length,
    principal: users.filter((u) => u.role === 'principal').length,
    super_admin: users.filter((u) => u.role === 'super_admin').length,
    tech_support: users.filter((u) => u.role === 'tech_support').length,
    staff: users.filter((u) => u.role === 'staff').length
  };

  const handleSaveStakeholderAtoZ = (updated: User) => {
    updateUser(updated);
    setEditingStakeholder(null);
    setFeedbackMessage(`Stakeholder records for ${updated.name} (${updated.institutionUserId}) successfully updated and synchronized across centralized database.`);
    setTimeout(() => setFeedbackMessage(null), 5000);
  };

  const handleToggleLockStatus = (u: User) => {
    const isCurrentlyLocked = u.accountStatus === 'locked';
    if (isCurrentlyLocked) {
      unlockUserAccount(u.id);
      setFeedbackMessage(`Account for ${u.name} has been unlocked successfully.`);
    } else {
      updateUser({
        ...u,
        accountStatus: 'locked',
        lockoutUntil: new Date(Date.now() + 86400000).toISOString()
      });
      setFeedbackMessage(`Account for ${u.name} (${u.institutionUserId}) has been locked by Master Admin.`);
    }
    setTimeout(() => setFeedbackMessage(null), 4000);
  };

  const handleToggleActiveDeactive = (u: User) => {
    const newStatus: AccountStatus = u.accountStatus === 'deactivated' ? 'active' : 'deactivated';
    updateUser({
      ...u,
      accountStatus: newStatus,
      isActive: newStatus === 'active'
    });
    setFeedbackMessage(`Account status for ${u.name} set to ${newStatus.toUpperCase()}.`);
    setTimeout(() => setFeedbackMessage(null), 4000);
  };

  const handleExecuteQuickPassword = async () => {
    if (!quickPasswordUser || !newQuickPassword.trim()) return;
    const newHash = await AuthService.hashPassword(newQuickPassword.trim());
    updateUser({
      ...quickPasswordUser,
      passwordHash: newHash,
      failedLoginAttempts: 0,
      accountStatus: quickPasswordUser.accountStatus === 'locked' ? 'active' : quickPasswordUser.accountStatus,
      lockoutUntil: null
    });
    setFeedbackMessage(`Password for ${quickPasswordUser.name} (${quickPasswordUser.institutionUserId}) was reset to "${newQuickPassword.trim()}".`);
    setQuickPasswordUser(null);
    setNewQuickPassword('');
    setTimeout(() => setFeedbackMessage(null), 5000);
  };

  const handleExportCSV = () => {
    const headers = [
      'User ID',
      'Name',
      'Bengali Name',
      'Role',
      'Department',
      'Designation',
      'Email',
      'Phone',
      'Roll / Emp ID',
      'Reg Number',
      'DOB',
      'Gender',
      'Blood Group',
      'Category',
      'Account Status',
      'Fee Status'
    ];

    const rows = filteredUsers.map((u) => {
      const dept = departments.find((d) => d.id === u.departmentId)?.name || 'General';
      return [
        u.institutionUserId,
        `"${u.name}"`,
        `"${u.nameBengali || ''}"`,
        u.role,
        `"${dept}"`,
        `"${u.designation || ''}"`,
        u.email,
        u.phone,
        u.rollNumber || u.employeeId || '',
        u.registrationNumber || '',
        u.dob || '',
        u.gender || '',
        u.bloodGroup || '',
        u.category || '',
        u.accountStatus,
        u.financial?.feeStatus || 'N/A'
      ].join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `tamralipta_all_stakeholders_${new Date().toISOString().substring(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Master Admin Header Banner */}
      <div className="bg-gradient-to-r from-[#0b1d3a] via-[#0f2942] to-[#1e1b4b] text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-purple-900/60 relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-purple-300 flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-purple-400" />
                <span>Executive Command Console</span>
              </span>
              <span className="text-[11px] bg-purple-900/90 text-purple-200 px-2 py-0.5 rounded font-mono border border-purple-400/40">
                MASTER ADMIN PANEL
              </span>
              <span className="text-[11px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/40 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>Encrypted AES-256</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Master Stakeholder A-to-Z Control Center
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
              Full authority to inspect, edit, modify, and provision complete A-to-Z records for every student, faculty member, department head, principal, support engineer, and administrative staff member in Tamralipta Mahavidyalaya.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* Admin Password Retrieval Button */}
            <button
              onClick={() => setShowAdminRecoveryModal(true)}
              className="px-4 py-2.5 bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-600 hover:to-indigo-600 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center gap-2 cursor-pointer border border-purple-400/30"
              title="Retrieve or reset Admin Password through registered Mail ID or Phone Number"
            >
              <KeyRound className="w-4 h-4 text-purple-300" />
              <span>Admin Password Retrieval</span>
            </button>

            {/* Export CSV */}
            <button
              onClick={handleExportCSV}
              className="px-3.5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold border border-white/20 transition flex items-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>

            {/* Create New Stakeholder */}
            <button
              onClick={() => {
                // Initialize default stakeholder skeleton
                const newSkeleton: User = {
                  id: `user-stakeholder-${Date.now()}`,
                  institutionUserId: AuthService.generateUserId('student', users.length + 1, 2026, authPolicy),
                  name: '',
                  email: '',
                  phone: '+91 ',
                  passwordHash: '8b429188e730872242a7b8c9d0e1f2',
                  role: 'student',
                  departmentId: departments[0]?.id || 'dept-cs',
                  isActive: true,
                  accountStatus: 'active',
                  failedLoginAttempts: 0,
                  emailVerified: true,
                  mobileVerified: true,
                  dob: '2005-01-01',
                  gender: 'male',
                  bloodGroup: 'O+',
                  category: 'General',
                  permanentAddress: { street: '', city: 'Tamluk', district: 'Purba Medinipur', state: 'West Bengal', pinCode: '721636' },
                  guardian: { fatherName: '', motherName: '', guardianName: '', relationship: 'Father', phone: '+91 ', occupation: '', annualIncome: '₹ 2,50,000' },
                  financial: { feeStatus: 'paid', libraryCardNo: '', booksIssued: 0, hostelStatus: 'day_scholar' },
                  createdAt: new Date().toISOString()
                };
                setEditingStakeholder(newSkeleton);
              }}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Register New Stakeholder</span>
            </button>
          </div>
        </div>

        {/* Quick Metrics Bar */}
        <div className="mt-6 pt-5 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 text-xs">
          <div className="bg-white/5 p-2.5 rounded-xl border border-white/10">
            <div className="text-slate-400 text-[10px] uppercase font-semibold">Total Stakeholders</div>
            <div className="text-lg font-bold text-white mt-0.5">{countByRole.all}</div>
          </div>
          <div className="bg-white/5 p-2.5 rounded-xl border border-white/10">
            <div className="text-slate-400 text-[10px] uppercase font-semibold">Students</div>
            <div className="text-lg font-bold text-sky-400 mt-0.5">{countByRole.student}</div>
          </div>
          <div className="bg-white/5 p-2.5 rounded-xl border border-white/10">
            <div className="text-slate-400 text-[10px] uppercase font-semibold">Faculty Members</div>
            <div className="text-lg font-bold text-indigo-400 mt-0.5">{countByRole.faculty}</div>
          </div>
          <div className="bg-white/5 p-2.5 rounded-xl border border-white/10">
            <div className="text-slate-400 text-[10px] uppercase font-semibold">Department Heads</div>
            <div className="text-lg font-bold text-purple-400 mt-0.5">{countByRole.dept_head}</div>
          </div>
          <div className="bg-white/5 p-2.5 rounded-xl border border-white/10">
            <div className="text-slate-400 text-[10px] uppercase font-semibold">Principal / Admin</div>
            <div className="text-lg font-bold text-emerald-400 mt-0.5">{countByRole.principal}</div>
          </div>
          <div className="bg-white/5 p-2.5 rounded-xl border border-white/10">
            <div className="text-slate-400 text-[10px] uppercase font-semibold">Tech Support</div>
            <div className="text-lg font-bold text-amber-400 mt-0.5">{countByRole.tech_support}</div>
          </div>
          <div className="bg-white/5 p-2.5 rounded-xl border border-white/10">
            <div className="text-slate-400 text-[10px] uppercase font-semibold">Campus Staff</div>
            <div className="text-lg font-bold text-rose-400 mt-0.5">{countByRole.staff}</div>
          </div>
        </div>
      </div>

      {feedbackMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-2xl text-xs flex items-center justify-between shadow-xs animate-in fade-in">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span className="font-semibold">{feedbackMessage}</span>
          </div>
          <button
            onClick={() => setFeedbackMessage(null)}
            className="text-emerald-700 hover:text-emerald-900 font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Filter and Search Console */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Name, User ID, Roll, Reg No, Email, Phone..."
            className="w-full text-xs pl-10 pr-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:border-purple-500 font-medium"
          />
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="text-xs border border-slate-300 rounded-xl px-3 py-2 bg-white text-slate-700 font-medium"
          >
            <option value="all">All Stakeholder Roles ({users.length})</option>
            <option value="student">Students ({countByRole.student})</option>
            <option value="faculty">Faculty ({countByRole.faculty})</option>
            <option value="dept_head">Department Heads ({countByRole.dept_head})</option>
            <option value="principal">Principal & Admin ({countByRole.principal})</option>
            <option value="super_admin">Super Admins ({countByRole.super_admin})</option>
            <option value="tech_support">Tech Support ({countByRole.tech_support})</option>
            <option value="staff">Staff ({countByRole.staff})</option>
          </select>

          {/* Department Filter */}
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="text-xs border border-slate-300 rounded-xl px-3 py-2 bg-white text-slate-700 font-medium"
          >
            <option value="all">All Departments</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>

          {/* Account Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs border border-slate-300 rounded-xl px-3 py-2 bg-white text-slate-700 font-medium"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Only</option>
            <option value="locked">Locked Accounts</option>
            <option value="deactivated">Deactivated</option>
            <option value="pending_activation">Pending Activation</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
      </div>

      {/* Stakeholders Master Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-purple-700" />
            <span className="font-bold text-xs text-slate-900">
              Stakeholder Directory ({filteredUsers.length} Records)
            </span>
          </div>
          <span className="text-[11px] text-slate-500">
            Click <span className="font-semibold text-purple-700">"Edit All A-to-Z"</span> on any stakeholder to modify complete profile records.
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-700">
            <thead className="bg-slate-50/80 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">User ID & Avatar</th>
                <th className="py-3 px-4">Stakeholder Name</th>
                <th className="py-3 px-4">Role & Designation</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Contact (Email & Phone)</th>
                <th className="py-3 px-4">Roll / Identifier</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Master Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((u) => {
                  const dept = departments.find((d) => d.id === u.departmentId);
                  const status = u.accountStatus || (u.isActive ? 'active' : 'deactivated');
                  const isLocked = status === 'locked';

                  return (
                    <tr key={u.id} className="hover:bg-slate-50/80 transition">
                      {/* ID and initials */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-800 font-bold flex items-center justify-center text-xs shadow-xs border border-purple-200">
                            {u.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-mono font-bold text-purple-950 text-xs">
                              {u.institutionUserId}
                            </div>
                            <div className="text-[10px] text-slate-400">
                              {u.gender ? `${u.gender} · ` : ''}{u.bloodGroup || 'Blood: N/A'}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Name */}
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{u.name}</div>
                        {u.nameBengali && (
                          <div className="text-[11px] text-slate-500">{u.nameBengali}</div>
                        )}
                        <div className="text-[10px] text-slate-400">
                          {u.category || 'General'} · {u.guardian?.fatherName ? `Father: ${u.guardian.fatherName}` : 'Parent/Guardian on file'}
                        </div>
                      </td>

                      {/* Role & Designation */}
                      <td className="py-3 px-4">
                        <span className="inline-block capitalize font-bold text-purple-900 bg-purple-50 px-2 py-0.5 rounded text-[11px] border border-purple-200">
                          {u.role.replace('_', ' ')}
                        </span>
                        <div className="text-[11px] text-slate-600 mt-0.5 font-medium truncate max-w-[160px]">
                          {u.designation || 'Institutional Member'}
                        </div>
                      </td>

                      {/* Department */}
                      <td className="py-3 px-4">
                        <div className="text-slate-800 font-medium">{dept?.name || 'Institutional Central'}</div>
                        {u.programmeId && (
                          <div className="text-[10px] text-purple-700">Sem {u.semester || 1}</div>
                        )}
                      </td>

                      {/* Contact */}
                      <td className="py-3 px-4 font-mono">
                        <div className="text-slate-800 text-[11px]">{u.email}</div>
                        <div className="text-slate-500 text-[10px]">{u.phone}</div>
                      </td>

                      {/* Identifier */}
                      <td className="py-3 px-4 font-mono text-slate-600 text-xs">
                        {u.rollNumber || u.employeeId || u.registrationNumber || 'N/A'}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4 text-center">
                        {status === 'active' && (
                          <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded text-[11px] border border-emerald-200">
                            Active
                          </span>
                        )}
                        {status === 'locked' && (
                          <span className="text-rose-700 font-semibold bg-rose-50 px-2 py-0.5 rounded text-[11px] border border-rose-200">
                            Locked
                          </span>
                        )}
                        {status === 'deactivated' && (
                          <span className="text-slate-600 font-semibold bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                            Deactivated
                          </span>
                        )}
                        {status === 'pending_activation' && (
                          <span className="text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded text-[11px] border border-amber-200">
                            Pending
                          </span>
                        )}
                        {status === 'suspended' && (
                          <span className="text-purple-700 font-semibold bg-purple-50 px-2 py-0.5 rounded text-[11px] border border-purple-200">
                            Suspended
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Quick Password Reset Key */}
                          <button
                            type="button"
                            onClick={() => {
                              setQuickPasswordUser(u);
                              setNewQuickPassword('Tamralipta@2026');
                              setShowQuickPass(false);
                            }}
                            className="p-1.5 text-slate-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg border border-slate-200 transition cursor-pointer"
                            title="Quick Password Override"
                          >
                            <KeyRound className="w-3.5 h-3.5" />
                          </button>

                          {/* Lock / Unlock Toggle */}
                          <button
                            type="button"
                            onClick={() => handleToggleLockStatus(u)}
                            className={`p-1.5 rounded-lg border transition cursor-pointer ${
                              isLocked
                                ? 'bg-amber-50 text-amber-700 border-amber-300 hover:bg-amber-100'
                                : 'text-slate-600 border-slate-200 hover:bg-slate-100'
                            }`}
                            title={isLocked ? 'Unlock Account' : 'Lock Account'}
                          >
                            {isLocked ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                          </button>

                          {/* Full A to Z Edit Button */}
                          <button
                            type="button"
                            onClick={() => setEditingStakeholder(u)}
                            className="px-2.5 py-1 bg-purple-700 hover:bg-purple-800 text-white rounded-lg text-xs font-bold shadow-xs transition flex items-center gap-1 cursor-pointer"
                            title="Edit Every Single A to Z Field of this Stakeholder"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Edit A-to-Z</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    No stakeholders matched the search and filter query.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Password Override Modal */}
      {quickPasswordUser && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-purple-700" />
              <h3 className="font-bold text-slate-900 text-sm">Quick Master Password Override</h3>
            </div>
            <p className="text-xs text-slate-500">
              Directly assign a new password for <span className="font-bold text-slate-800">{quickPasswordUser.name}</span> ({quickPasswordUser.institutionUserId}).
            </p>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">New Password:</label>
              <div className="relative">
                <input
                  type={showQuickPass ? 'text' : 'password'}
                  value={newQuickPassword}
                  onChange={(e) => setNewQuickPassword(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg pr-9 font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowQuickPass(!showQuickPass)}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  {showQuickPass ? <Eye className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setQuickPasswordUser(null)}
                className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteQuickPassword}
                className="px-4 py-1.5 bg-purple-700 hover:bg-purple-800 text-white rounded-lg text-xs font-bold shadow-xs"
              >
                Set Password
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Flagship A-to-Z Full Edit Modal */}
      {editingStakeholder && (
        <StakeholderAtoZEditModal
          stakeholder={editingStakeholder}
          onClose={() => setEditingStakeholder(null)}
          onSaved={handleSaveStakeholderAtoZ}
        />
      )}

      {/* Admin Password Retrieval Modal */}
      {showAdminRecoveryModal && (
        <AdminPasswordRetrievalModal
          onClose={() => setShowAdminRecoveryModal(false)}
          onSuccess={(adminId, newPass) => {
            setShowAdminRecoveryModal(false);
            setFeedbackMessage(`Master Admin password for ${adminId} has been reset successfully.`);
            setTimeout(() => setFeedbackMessage(null), 5000);
          }}
        />
      )}
    </div>
  );
};
