import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { User, UserRole, AccountStatus } from '../../types';
import { AuthService } from '../../services/authService';
import {
  Users,
  Plus,
  Search,
  Upload,
  UserCheck,
  CheckCircle2,
  XCircle,
  Shield,
  GraduationCap,
  KeyRound,
  ShieldAlert,
  FileSpreadsheet,
  AlertCircle
} from 'lucide-react';

export const UserManagementView: React.FC = () => {
  const {
    users,
    departments,
    addUser,
    updateUser,
    language,
    authPolicy,
    setActiveTab,
    unlockUserAccount
  } = useApp();

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);

  // New user form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+91 ');
  const [role, setRole] = useState<UserRole>('student');
  const [departmentId, setDepartmentId] = useState(departments[0]?.id || 'dept-cs');
  const [rollOrEmpId, setRollOrEmpId] = useState('');

  // Bulk CSV state
  const sampleCsvData = `Swagata Mandal,s.mandal@student.tamralipta.ac.in,+91 98311 22334,student,dept-cs,BSC/CS/2026/043
Priyanka Sen,p.sen@tamralipta.ac.in,+91 98322 33445,faculty,dept-bng,TM-FAC-031
Rupankar Das,r.das@student.tamralipta.ac.in,+91 98333 44556,student,dept-math,BSC/MATH/2026/012`;

  const [csvContent, setCsvContent] = useState(sampleCsvData);
  const [bulkImportSuccess, setBulkImportSuccess] = useState('');

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.institutionUserId.toLowerCase().includes(search.toLowerCase()) ||
      (u.rollNumber && u.rollNumber.toLowerCase().includes(search.toLowerCase())) ||
      (u.employeeId && u.employeeId.toLowerCase().includes(search.toLowerCase()));
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || (u.accountStatus || (u.isActive ? 'active' : 'deactivated')) === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    // Unique User ID generation
    const count = users.filter((u) => u.role === role).length + 1;
    const generatedUserId = AuthService.generateUserId(role, count, 2026, authPolicy);

    addUser({
      institutionUserId: generatedUserId,
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      passwordHash: '8b429188e730872242a7b8c9d0e1f2', // default Tamralipta@2026
      role,
      departmentId,
      rollNumber: role === 'student' ? rollOrEmpId : undefined,
      employeeId: role !== 'student' ? rollOrEmpId : undefined,
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
    setRollOrEmpId('');
    setShowAddModal(false);
  };

  const handleToggleActive = (user: User) => {
    const newStatus: AccountStatus = user.accountStatus === 'deactivated' ? 'active' : 'deactivated';
    updateUser({
      ...user,
      accountStatus: newStatus,
      isActive: newStatus === 'active'
    });
  };

  const handleProcessBulkImport = (e: React.FormEvent) => {
    e.preventDefault();
    const lines = csvContent.trim().split('\n');
    let importedCount = 0;

    lines.forEach((line) => {
      const parts = line.split(',').map((p) => p.trim());
      if (parts.length >= 4) {
        const [cName, cEmail, cPhone, cRole, cDept, cRoll] = parts;
        const validRole = (['student', 'faculty', 'dept_head', 'principal', 'super_admin', 'tech_support'].includes(cRole)
          ? cRole
          : 'student') as UserRole;

        const count = users.length + importedCount + 1;
        const generatedUserId = AuthService.generateUserId(validRole, count, 2026, authPolicy);

        addUser({
          institutionUserId: generatedUserId,
          name: cName,
          email: cEmail,
          phone: cPhone || '+91 98000 00000',
          passwordHash: '8b429188e730872242a7b8c9d0e1f2',
          role: validRole,
          departmentId: cDept || 'dept-cs',
          rollNumber: validRole === 'student' ? cRoll : undefined,
          employeeId: validRole !== 'student' ? cRoll : undefined,
          isActive: true,
          accountStatus: 'active',
          failedLoginAttempts: 0,
          emailVerified: true,
          mobileVerified: true,
          lastLogin: 'Never'
        });
        importedCount++;
      }
    });

    setBulkImportSuccess(`Successfully provisioned and assigned unique institutional User IDs to ${importedCount} stakeholder accounts.`);
    setTimeout(() => {
      setBulkImportSuccess('');
      setShowBulkModal(false);
    }, 2500);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            {language === 'bn' ? 'ব্যবহারকারী ও সদস্য পরিচালনা' : 'Institutional User & Identity Directory'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Tamralipta Mahavidyalaya · Role-Based Access Control (RBAC) & Automated User ID Generation
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab('master_admin')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-800 hover:to-indigo-800 text-white rounded-lg text-xs font-bold shadow-xs transition cursor-pointer"
          >
            <Shield className="w-4 h-4 text-purple-200" />
            <span>Master Admin A-to-Z Panel</span>
          </button>
          <button
            onClick={() => setActiveTab('auth_security')}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-semibold transition"
          >
            <Shield className="w-4 h-4 text-emerald-600" />
            <span>Auth & ID Policies</span>
          </button>
          <button
            onClick={() => setShowBulkModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition"
          >
            <Upload className="w-4 h-4" />
            <span>Bulk CSV Import</span>
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-semibold shadow-xs transition"
          >
            <Plus className="w-4 h-4" />
            <span>Create User Account</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by User ID, Name, Email, or Roll..."
            className="w-full text-xs pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-sky-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="text-xs border border-slate-300 rounded-lg px-3 py-2 bg-white text-slate-700"
          >
            <option value="all">All Roles ({users.length})</option>
            <option value="student">Students</option>
            <option value="faculty">Faculty Members</option>
            <option value="dept_head">Department Heads</option>
            <option value="principal">Principal</option>
            <option value="super_admin">Super Admins</option>
            <option value="tech_support">Tech Support</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs border border-slate-300 rounded-lg px-3 py-2 bg-white text-slate-700"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="locked">Temporarily Locked</option>
            <option value="deactivated">Deactivated</option>
            <option value="pending_activation">Pending Activation</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-x-auto">
        <table className="w-full text-xs text-left text-slate-700">
          <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
            <tr>
              <th className="py-2.5 px-4">User ID</th>
              <th className="py-2.5 px-4">User / Name</th>
              <th className="py-2.5 px-4">Role</th>
              <th className="py-2.5 px-4">Department</th>
              <th className="py-2.5 px-4">Roll / Identifier</th>
              <th className="py-2.5 px-4 text-center">Account Status</th>
              <th className="py-2.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredUsers.map((u) => {
              const dept = departments.find((d) => d.id === u.departmentId);
              const status = u.accountStatus || (u.isActive ? 'active' : 'deactivated');
              const isLocked = status === 'locked';

              return (
                <tr key={u.id} className="hover:bg-slate-50 transition">
                  <td className="py-3 px-4 font-mono font-bold text-sky-800 text-xs">
                    {u.institutionUserId}
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-900">
                    <div>{u.name}</div>
                    <div className="text-[11px] text-slate-500 font-normal">{u.email}</div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="capitalize font-semibold text-sky-900 bg-sky-50 px-2 py-0.5 rounded text-[11px] border border-sky-200/50">
                      {u.role.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-600">{dept?.name || 'Institutional'}</td>
                  <td className="py-3 px-4 font-mono text-slate-600">
                    {u.rollNumber || u.employeeId || 'N/A'}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {status === 'active' && (
                      <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded text-[11px] border border-emerald-200/60">
                        Active
                      </span>
                    )}
                    {status === 'locked' && (
                      <span className="text-rose-700 font-semibold bg-rose-50 px-2 py-0.5 rounded text-[11px] border border-rose-200/60">
                        Locked
                      </span>
                    )}
                    {status === 'pending_activation' && (
                      <span className="text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded text-[11px] border border-amber-200/60">
                        Pending
                      </span>
                    )}
                    {status === 'deactivated' && (
                      <span className="text-slate-600 font-semibold bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                        Deactivated
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {isLocked && (
                        <button
                          onClick={() => unlockUserAccount(u.id)}
                          className="text-xs font-semibold px-2 py-0.5 bg-amber-50 text-amber-800 border border-amber-300 rounded hover:bg-amber-100 transition"
                        >
                          Unlock
                        </button>
                      )}
                      <button
                        onClick={() => handleToggleActive(u)}
                        className={`text-xs font-semibold px-2 py-1 rounded transition ${
                          u.isActive
                            ? 'text-rose-600 hover:bg-rose-50'
                            : 'text-emerald-600 hover:bg-emerald-50'
                        }`}
                      >
                        {u.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Create User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h2 className="text-base font-bold text-slate-900 mb-1">Create Institutional Account</h2>
            <p className="text-xs text-slate-500 mb-4">
              A unique institutional User ID will be automatically generated.
            </p>
            <form onSubmit={handleCreateUser} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700">Full Legal Name:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Debabrata Samanta"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-xs mt-1 px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700">Institutional Email:</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. d.samanta@tamralipta.ac.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs mt-1 px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700">Mobile Number (SMS verification):</label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98000 12345"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full text-xs mt-1 px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700">User Role:</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    className="w-full text-xs mt-1 px-3 py-2 border border-slate-300 rounded-lg bg-white"
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
                  <label className="text-xs font-semibold text-slate-700">Department:</label>
                  <select
                    value={departmentId}
                    onChange={(e) => setDepartmentId(e.target.value)}
                    className="w-full text-xs mt-1 px-3 py-2 border border-slate-300 rounded-lg bg-white"
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
                <label className="text-xs font-semibold text-slate-700">
                  {role === 'student' ? 'Student Roll Number:' : 'Faculty / Staff Employee ID:'}
                </label>
                <input
                  type="text"
                  placeholder={role === 'student' ? 'BSC/CS/2026/099' : 'TM-FAC-035'}
                  value={rollOrEmpId}
                  onChange={(e) => setRollOrEmpId(e.target.value)}
                  className="w-full text-xs mt-1 px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-semibold"
                >
                  Register Account & Assign ID
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bulk Import CSV Modal */}
      {showBulkModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center gap-2 mb-2">
              <FileSpreadsheet className="w-5 h-5 text-sky-700" />
              <h2 className="text-base font-bold text-slate-900">Bulk Stakeholder Import (CSV)</h2>
            </div>
            <p className="text-xs text-slate-500 mb-3">
              Format: <span className="font-mono text-slate-700">Full Name, Email, Phone, Role, Department ID, Roll/Emp ID</span>
            </p>

            {bulkImportSuccess && (
              <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>{bulkImportSuccess}</span>
              </div>
            )}

            <form onSubmit={handleProcessBulkImport} className="space-y-3">
              <textarea
                rows={6}
                value={csvContent}
                onChange={(e) => setCsvContent(e.target.value)}
                className="w-full p-3 font-mono text-[11px] border border-slate-300 rounded-xl focus:outline-none focus:border-sky-500"
                placeholder="Paste CSV rows here..."
              />

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setCsvContent(sampleCsvData)}
                  className="text-xs text-sky-700 hover:underline font-medium"
                >
                  Load Sample Batch
                </button>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowBulkModal(false)}
                    className="px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-semibold"
                  >
                    Import & Auto-Generate IDs
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
