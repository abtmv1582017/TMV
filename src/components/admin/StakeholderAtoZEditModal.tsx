import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { User, UserRole, AccountStatus, StakeholderEditLog } from '../../types';
import { AuthService } from '../../services/authService';
import {
  X,
  Save,
  User as UserIcon,
  GraduationCap,
  BookOpen,
  Building2,
  Users,
  Shield,
  HelpCircle,
  Briefcase,
  KeyRound,
  Lock,
  Unlock,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Sparkles,
  MapPin,
  Phone,
  Mail,
  Home,
  CreditCard,
  History,
  Check,
  Eye,
  EyeOff
} from 'lucide-react';

interface StakeholderAtoZEditModalProps {
  stakeholder: User | null;
  onClose: () => void;
  onSaved: (updatedUser: User) => void;
}

export const StakeholderAtoZEditModal: React.FC<StakeholderAtoZEditModalProps> = ({
  stakeholder,
  onClose,
  onSaved
}) => {
  const {
    departments,
    programmes,
    courses,
    currentUser,
    users
  } = useApp();

  if (!stakeholder) return null;

  // Active Tab: personal | academic | contact | guardian | security | financial | audit
  const [activeTab, setActiveTab] = useState<'personal' | 'academic' | 'contact' | 'guardian' | 'security' | 'financial' | 'audit'>('personal');

  // Working copy of stakeholder data
  const [formData, setFormData] = useState<User>({
    ...stakeholder,
    permanentAddress: stakeholder.permanentAddress || { street: '', city: 'Tamluk', district: 'Purba Medinipur', state: 'West Bengal', pinCode: '721636' },
    presentAddress: stakeholder.presentAddress || { street: '', city: 'Tamluk', district: 'Purba Medinipur', state: 'West Bengal', pinCode: '721636' },
    guardian: stakeholder.guardian || { fatherName: '', motherName: '', guardianName: '', relationship: 'Father', phone: '', email: '', occupation: '', annualIncome: '' },
    financial: stakeholder.financial || { feeStatus: 'paid', scholarshipName: '', scholarshipId: '', libraryCardNo: '', booksIssued: 0, hostelStatus: 'day_scholar', biometricId: '' },
    permissions: stakeholder.permissions || []
  });

  // Password override state
  const [overridePassword, setOverridePassword] = useState('');
  const [showOverridePassword, setShowOverridePassword] = useState(false);
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState(false);

  // Status message
  const [saveMessage, setSaveMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Helper for same address
  const [sameAsPermanent, setSameAsPermanent] = useState(false);

  const handleFieldChange = <K extends keyof User>(field: K, value: User[K]) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNestedChange = (
    section: 'permanentAddress' | 'presentAddress' | 'guardian' | 'financial',
    key: string,
    val: any
  ) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...(prev[section] as any),
        [key]: val
      }
    }));
  };

  const handleCopyPermanentToPresent = (checked: boolean) => {
    setSameAsPermanent(checked);
    if (checked && formData.permanentAddress) {
      setFormData((prev) => ({
        ...prev,
        presentAddress: { ...prev.permanentAddress }
      }));
    }
  };

  const handleToggleCourseAllocation = (courseId: string) => {
    const isStudent = formData.role === 'student';
    const listKey = isStudent ? 'enrolledCourseIds' : 'assignedCourseIds';
    const currentList = formData[listKey] || [];
    const nextList = currentList.includes(courseId)
      ? currentList.filter((id) => id !== courseId)
      : [...currentList, courseId];

    handleFieldChange(listKey, nextList);
  };

  const handleTogglePermission = (permKey: string) => {
    const currentPerms = formData.permissions || [];
    const nextPerms = currentPerms.includes(permKey)
      ? currentPerms.filter((p) => p !== permKey)
      : [...currentPerms, permKey];

    handleFieldChange('permissions', nextPerms);
  };

  const handleApplyDirectPasswordOverride = async () => {
    if (!overridePassword || overridePassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }
    const newHash = await AuthService.hashPassword(overridePassword);
    setFormData((prev) => ({
      ...prev,
      passwordHash: newHash,
      failedLoginAttempts: 0,
      lockoutUntil: null,
      accountStatus: prev.accountStatus === 'locked' ? 'active' : prev.accountStatus
    }));
    setPasswordChangeSuccess(true);
    setSaveMessage('Password override staged. Will be permanently saved when clicking "Save All Modifications".');
    setTimeout(() => setPasswordChangeSuccess(false), 3500);
  };

  const handleGenerateRandomPassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%';
    let res = 'TM@';
    for (let i = 0; i < 7; i++) {
      res += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setOverridePassword(res);
    setShowOverridePassword(true);
  };

  const handleSubmitAllChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSaveMessage('');
    setIsSubmitting(true);

    // Validation: Check duplicate institutionUserId if changed
    if (formData.institutionUserId !== stakeholder.institutionUserId) {
      const duplicate = users.find(
        (u) => u.id !== stakeholder.id && u.institutionUserId.toLowerCase() === formData.institutionUserId.trim().toLowerCase()
      );
      if (duplicate) {
        setIsSubmitting(false);
        setErrorMessage(`User ID "${formData.institutionUserId}" is already assigned to another stakeholder (${duplicate.name}).`);
        return;
      }
    }

    // Prepare audit log entry
    const newLog: StakeholderEditLog = {
      timestamp: new Date().toLocaleString(),
      modifiedBy: `${currentUser.name} (${currentUser.institutionUserId})`,
      changeSummary: `Modified A-to-Z profile records (Role: ${formData.role}, Status: ${formData.accountStatus})`
    };

    const updatedUser: User = {
      ...formData,
      institutionUserId: formData.institutionUserId.trim(),
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      isActive: formData.accountStatus === 'active',
      updatedAt: new Date().toISOString(),
      lastModifiedBy: currentUser.institutionUserId,
      editLogs: [newLog, ...(formData.editLogs || [])]
    };

    setIsSubmitting(false);
    onSaved(updatedUser);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Header */}
        <div className="bg-gradient-to-r from-[#0b1d3a] via-[#0f2942] to-[#1e1b4b] text-white p-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-inner border border-white/20">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-purple-300">
                  Master Admin · A to Z Stakeholder Editor
                </span>
                <span className="text-[10px] bg-purple-900/90 text-purple-200 px-2 py-0.5 rounded font-mono border border-purple-400/30">
                  {formData.institutionUserId}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight flex items-center gap-2">
                <span>{formData.name}</span>
                <span className="text-xs font-normal text-slate-300">({formData.role.replace('_', ' ')})</span>
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-white/10 transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs across A to Z sections */}
        <div className="bg-slate-100/90 border-b border-slate-200 px-4 flex items-center gap-1 overflow-x-auto text-xs font-semibold py-2 select-none">
          <button
            type="button"
            onClick={() => setActiveTab('personal')}
            className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'personal'
                ? 'bg-purple-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
            }`}
          >
            <UserIcon className="w-3.5 h-3.5" />
            <span>A-D. Personal & Identity</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('academic')}
            className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'academic'
                ? 'bg-purple-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>E-H. Academic & Role</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('contact')}
            className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'contact'
                ? 'bg-purple-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
            }`}
          >
            <Phone className="w-3.5 h-3.5" />
            <span>I-L. Contact & Address</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('guardian')}
            className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'guardian'
                ? 'bg-purple-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>M-P. Parent & Guardian</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('security')}
            className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'security'
                ? 'bg-purple-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>Q-T. Security & Password</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('financial')}
            className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'financial'
                ? 'bg-purple-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>U-X. Fees & Facilities</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('audit')}
            className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'audit'
                ? 'bg-purple-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Y-Z. Audit Trail</span>
          </button>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmitAllChanges} className="flex-1 flex flex-col min-h-0">
          <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-5">
            {errorMessage && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600" />
                <span>{errorMessage}</span>
              </div>
            )}

            {saveMessage && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-600" />
                <span>{saveMessage}</span>
              </div>
            )}

            {/* TAB 1: Personal & Demographics */}
            {activeTab === 'personal' && (
              <div className="space-y-4">
                <div className="border-b border-slate-100 pb-2">
                  <h3 className="text-sm font-bold text-slate-900">Personal Demographics & Legal Identity</h3>
                  <p className="text-xs text-slate-500">Government ID details, date of birth, and identity categorization.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Full Legal Name (English):</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => handleFieldChange('name', e.target.value)}
                      className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-purple-500 font-medium"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Bengali / Regional Script Name:</label>
                    <input
                      type="text"
                      value={formData.nameBengali || ''}
                      onChange={(e) => handleFieldChange('nameBengali', e.target.value)}
                      placeholder="e.g. সৌভিক জানা"
                      className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Date of Birth (DOB):</label>
                    <input
                      type="date"
                      value={formData.dob || ''}
                      onChange={(e) => handleFieldChange('dob', e.target.value)}
                      className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-purple-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Gender:</label>
                    <select
                      value={formData.gender || 'male'}
                      onChange={(e) => handleFieldChange('gender', e.target.value as any)}
                      className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other / Non-Binary</option>
                      <option value="prefer_not_to_say">Prefer not to say</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Blood Group:</label>
                    <select
                      value={formData.bloodGroup || 'O+'}
                      onChange={(e) => handleFieldChange('bloodGroup', e.target.value)}
                      className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white font-mono"
                    >
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Social Category:</label>
                    <select
                      value={formData.category || 'General'}
                      onChange={(e) => handleFieldChange('category', e.target.value as any)}
                      className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white"
                    >
                      <option value="General">General</option>
                      <option value="OBC-A">OBC-A</option>
                      <option value="OBC-B">OBC-B</option>
                      <option value="SC">Scheduled Caste (SC)</option>
                      <option value="ST">Scheduled Tribe (ST)</option>
                      <option value="EWS">Economically Weaker Section (EWS)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Aadhaar / National ID Card:</label>
                    <input
                      type="text"
                      value={formData.aadhaarNumber || ''}
                      onChange={(e) => handleFieldChange('aadhaarNumber', e.target.value)}
                      placeholder="e.g. 1234-5678-9012"
                      className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg font-mono focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Nationality & Religion:</label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={formData.nationality || 'Indian'}
                        onChange={(e) => handleFieldChange('nationality', e.target.value)}
                        placeholder="Nationality"
                        className="text-xs px-3 py-2 border border-slate-300 rounded-lg"
                      />
                      <input
                        type="text"
                        value={formData.religion || 'Hinduism'}
                        onChange={(e) => handleFieldChange('religion', e.target.value)}
                        placeholder="Religion"
                        className="text-xs px-3 py-2 border border-slate-300 rounded-lg"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Mother Tongue:</label>
                    <input
                      type="text"
                      value={formData.motherTongue || 'Bengali'}
                      onChange={(e) => handleFieldChange('motherTongue', e.target.value)}
                      className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg"
                    />
                  </div>

                  <div className="flex items-center gap-3 pt-6">
                    <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-slate-700 font-semibold">
                      <input
                        type="checkbox"
                        checked={formData.isPwd || false}
                        onChange={(e) => handleFieldChange('isPwd', e.target.checked)}
                        className="rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                      />
                      <span>Person with Benchmark Disability (PwD)</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: Academic & Institutional Role */}
            {activeTab === 'academic' && (
              <div className="space-y-4">
                <div className="border-b border-slate-100 pb-2">
                  <h3 className="text-sm font-bold text-slate-900">Institutional Role, Department & Curriculum</h3>
                  <p className="text-xs text-slate-500">Designation, roll numbers, academic programmes, and courses.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Stakeholder Role:</label>
                    <select
                      value={formData.role}
                      onChange={(e) => handleFieldChange('role', e.target.value as UserRole)}
                      className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white font-semibold text-purple-900"
                    >
                      <option value="student">Student</option>
                      <option value="faculty">Faculty Member</option>
                      <option value="dept_head">Department Head</option>
                      <option value="principal">Principal / Governing Authority</option>
                      <option value="super_admin">Super Administrator</option>
                      <option value="tech_support">Technical Support</option>
                      <option value="staff">Administrative / Non-Teaching Staff</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Unique Institutional User ID:
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.institutionUserId}
                      onChange={(e) => handleFieldChange('institutionUserId', e.target.value)}
                      className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg font-mono font-bold text-purple-950 focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Primary Department:</label>
                    <select
                      value={formData.departmentId || ''}
                      onChange={(e) => handleFieldChange('departmentId', e.target.value)}
                      className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white"
                    >
                      {departments.map((dept) => (
                        <option key={dept.id} value={dept.id}>
                          {dept.name} ({dept.code})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Academic Designation:</label>
                    <input
                      type="text"
                      value={formData.designation || ''}
                      onChange={(e) => handleFieldChange('designation', e.target.value)}
                      placeholder="e.g. Associate Professor, Student, Lab Assistant"
                      className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg"
                    />
                  </div>

                  {formData.role === 'student' ? (
                    <>
                      <div>
                        <label className="text-xs font-semibold text-slate-700 block mb-1">Academic Programme:</label>
                        <select
                          value={formData.programmeId || ''}
                          onChange={(e) => handleFieldChange('programmeId', e.target.value)}
                          className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white"
                        >
                          <option value="">None / Not Assigned</option>
                          {programmes.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-slate-700 block mb-1">Current Semester:</label>
                        <select
                          value={formData.semester || 1}
                          onChange={(e) => handleFieldChange('semester', parseInt(e.target.value) || 1)}
                          className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white font-mono"
                        >
                          {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                            <option key={s} value={s}>
                              Semester {s}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-slate-700 block mb-1">College Roll / Admission No:</label>
                        <input
                          type="text"
                          value={formData.rollNumber || ''}
                          onChange={(e) => handleFieldChange('rollNumber', e.target.value)}
                          placeholder="e.g. BSC/CS/2024/042"
                          className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg font-mono"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-slate-700 block mb-1">
                          Vidyasagar University Registration No:
                        </label>
                        <input
                          type="text"
                          value={formData.registrationNumber || ''}
                          onChange={(e) => handleFieldChange('registrationNumber', e.target.value)}
                          placeholder="e.g. VU-TM-2024-001982"
                          className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg font-mono"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <label className="text-xs font-semibold text-slate-700 block mb-1">Staff / Employee ID:</label>
                        <input
                          type="text"
                          value={formData.employeeId || ''}
                          onChange={(e) => handleFieldChange('employeeId', e.target.value)}
                          placeholder="e.g. TM-FAC-028"
                          className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg font-mono"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-slate-700 block mb-1">Office Room / Cabin Number:</label>
                        <input
                          type="text"
                          value={formData.officeRoom || ''}
                          onChange={(e) => handleFieldChange('officeRoom', e.target.value)}
                          placeholder="e.g. Science Building, Room 204"
                          className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="text-xs font-semibold text-slate-700 block mb-1">Highest Qualification:</label>
                        <input
                          type="text"
                          value={formData.qualification || ''}
                          onChange={(e) => handleFieldChange('qualification', e.target.value)}
                          placeholder="e.g. Ph.D. in Computer Science (Jadavpur), M.Tech, UGC-NET"
                          className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="text-xs font-semibold text-slate-700 block mb-1">Specialization & Research:</label>
                        <input
                          type="text"
                          value={formData.specialization || ''}
                          onChange={(e) => handleFieldChange('specialization', e.target.value)}
                          placeholder="e.g. Network Security, Cloud Architecture & Cryptography"
                          className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg"
                        />
                      </div>
                    </>
                  )}
                </div>

                {/* Course Allocations Checklist */}
                <div className="pt-2">
                  <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                    {formData.role === 'student' ? 'Enrolled Courses:' : 'Assigned Teaching Courses:'}
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto p-2 border border-slate-200 rounded-xl bg-slate-50">
                    {courses.map((c) => {
                      const isAssigned = (formData.role === 'student'
                        ? formData.enrolledCourseIds || []
                        : formData.assignedCourseIds || []
                      ).includes(c.id);

                      return (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => handleToggleCourseAllocation(c.id)}
                          className={`p-2 rounded-lg text-left text-xs border flex items-center justify-between transition cursor-pointer ${
                            isAssigned
                              ? 'bg-purple-100/70 border-purple-300 text-purple-900 font-semibold'
                              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          <div className="truncate">
                            <span className="font-mono text-[10px] text-purple-800 mr-1.5">{c.code}</span>
                            <span>{c.title}</span>
                          </div>
                          {isAssigned && <Check className="w-3.5 h-3.5 text-purple-700 flex-shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: Contact & Address */}
            {activeTab === 'contact' && (
              <div className="space-y-4">
                <div className="border-b border-slate-100 pb-2">
                  <h3 className="text-sm font-bold text-slate-900">Communication & Postal Addresses</h3>
                  <p className="text-xs text-slate-500">Official email, personal phone, emergency contacts, and residential addresses.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Official Institutional Email:</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => handleFieldChange('email', e.target.value)}
                      className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg font-mono font-medium focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Personal / Alternate Email:</label>
                    <input
                      type="email"
                      value={formData.alternateEmail || ''}
                      onChange={(e) => handleFieldChange('alternateEmail', e.target.value)}
                      placeholder="e.g. personal@gmail.com"
                      className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Primary Mobile Number:</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => handleFieldChange('phone', e.target.value)}
                      className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg font-mono font-medium focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Alternate / WhatsApp Contact:</label>
                    <input
                      type="tel"
                      value={formData.alternatePhone || ''}
                      onChange={(e) => handleFieldChange('alternatePhone', e.target.value)}
                      placeholder="+91 "
                      className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Emergency Contact Person:</label>
                    <input
                      type="text"
                      value={formData.emergencyContactName || ''}
                      onChange={(e) => handleFieldChange('emergencyContactName', e.target.value)}
                      placeholder="e.g. Subhas Jana (Father)"
                      className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Emergency Contact Number:</label>
                    <input
                      type="tel"
                      value={formData.emergencyContactPhone || ''}
                      onChange={(e) => handleFieldChange('emergencyContactPhone', e.target.value)}
                      placeholder="+91 94348 00000"
                      className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg font-mono"
                    />
                  </div>
                </div>

                {/* Permanent Address */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                  <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Home className="w-3.5 h-3.5 text-purple-700" />
                    <span>Permanent Residential Address</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-3">
                      <label className="text-[11px] font-semibold text-slate-600 block mb-0.5">Street Address / Village / Post Office:</label>
                      <input
                        type="text"
                        value={formData.permanentAddress?.street || ''}
                        onChange={(e) => handleNestedChange('permanentAddress', 'street', e.target.value)}
                        placeholder="Street, Holding No, Area"
                        className="w-full text-xs px-3 py-1.5 border border-slate-300 rounded-lg bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-0.5">City / Town:</label>
                      <input
                        type="text"
                        value={formData.permanentAddress?.city || 'Tamluk'}
                        onChange={(e) => handleNestedChange('permanentAddress', 'city', e.target.value)}
                        className="w-full text-xs px-3 py-1.5 border border-slate-300 rounded-lg bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-0.5">District & State:</label>
                      <input
                        type="text"
                        value={formData.permanentAddress?.district || 'Purba Medinipur'}
                        onChange={(e) => handleNestedChange('permanentAddress', 'district', e.target.value)}
                        className="w-full text-xs px-3 py-1.5 border border-slate-300 rounded-lg bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-0.5">PIN Code:</label>
                      <input
                        type="text"
                        value={formData.permanentAddress?.pinCode || '721636'}
                        onChange={(e) => handleNestedChange('permanentAddress', 'pinCode', e.target.value)}
                        className="w-full text-xs px-3 py-1.5 border border-slate-300 rounded-lg bg-white font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Present Correspondence Address */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-purple-700" />
                      <span>Present / Correspondence Address</span>
                    </h4>
                    <label className="flex items-center gap-1.5 text-xs text-purple-700 font-semibold cursor-pointer">
                      <input
                        type="checkbox"
                        checked={sameAsPermanent}
                        onChange={(e) => handleCopyPermanentToPresent(e.target.checked)}
                        className="rounded border-slate-300 text-purple-600"
                      />
                      <span>Same as Permanent</span>
                    </label>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-3">
                      <label className="text-[11px] font-semibold text-slate-600 block mb-0.5">Street Address:</label>
                      <input
                        type="text"
                        value={formData.presentAddress?.street || ''}
                        onChange={(e) => handleNestedChange('presentAddress', 'street', e.target.value)}
                        className="w-full text-xs px-3 py-1.5 border border-slate-300 rounded-lg bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-0.5">City:</label>
                      <input
                        type="text"
                        value={formData.presentAddress?.city || 'Tamluk'}
                        onChange={(e) => handleNestedChange('presentAddress', 'city', e.target.value)}
                        className="w-full text-xs px-3 py-1.5 border border-slate-300 rounded-lg bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-0.5">District:</label>
                      <input
                        type="text"
                        value={formData.presentAddress?.district || 'Purba Medinipur'}
                        onChange={(e) => handleNestedChange('presentAddress', 'district', e.target.value)}
                        className="w-full text-xs px-3 py-1.5 border border-slate-300 rounded-lg bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-0.5">PIN Code:</label>
                      <input
                        type="text"
                        value={formData.presentAddress?.pinCode || '721636'}
                        onChange={(e) => handleNestedChange('presentAddress', 'pinCode', e.target.value)}
                        className="w-full text-xs px-3 py-1.5 border border-slate-300 rounded-lg bg-white font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: Guardian & Family Details */}
            {activeTab === 'guardian' && (
              <div className="space-y-4">
                <div className="border-b border-slate-100 pb-2">
                  <h3 className="text-sm font-bold text-slate-900">Parental & Guardian Information</h3>
                  <p className="text-xs text-slate-500">Primary contact for student welfare, emergency dispatches, and scholarships.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Father's Legal Name:</label>
                    <input
                      type="text"
                      value={formData.guardian?.fatherName || ''}
                      onChange={(e) => handleNestedChange('guardian', 'fatherName', e.target.value)}
                      placeholder="e.g. Subhas Chandra Jana"
                      className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Mother's Legal Name:</label>
                    <input
                      type="text"
                      value={formData.guardian?.motherName || ''}
                      onChange={(e) => handleNestedChange('guardian', 'motherName', e.target.value)}
                      placeholder="e.g. Aparna Jana"
                      className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Official Guardian Name:</label>
                    <input
                      type="text"
                      value={formData.guardian?.guardianName || ''}
                      onChange={(e) => handleNestedChange('guardian', 'guardianName', e.target.value)}
                      placeholder="Guardian name if different"
                      className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Relationship to Stakeholder:</label>
                    <input
                      type="text"
                      value={formData.guardian?.relationship || 'Father'}
                      onChange={(e) => handleNestedChange('guardian', 'relationship', e.target.value)}
                      className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Guardian Contact Phone:</label>
                    <input
                      type="tel"
                      value={formData.guardian?.phone || ''}
                      onChange={(e) => handleNestedChange('guardian', 'phone', e.target.value)}
                      placeholder="+91 "
                      className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Guardian Email Address:</label>
                    <input
                      type="email"
                      value={formData.guardian?.email || ''}
                      onChange={(e) => handleNestedChange('guardian', 'email', e.target.value)}
                      placeholder="guardian@example.com"
                      className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Guardian Occupation:</label>
                    <input
                      type="text"
                      value={formData.guardian?.occupation || ''}
                      onChange={(e) => handleNestedChange('guardian', 'occupation', e.target.value)}
                      placeholder="e.g. Government Service, Agriculture, Business"
                      className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Annual Family Income:</label>
                    <input
                      type="text"
                      value={formData.guardian?.annualIncome || ''}
                      onChange={(e) => handleNestedChange('guardian', 'annualIncome', e.target.value)}
                      placeholder="e.g. ₹ 3,20,000"
                      className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg font-mono"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: Security, Credentials & Account Lifecycle */}
            {activeTab === 'security' && (
              <div className="space-y-4">
                <div className="border-b border-slate-100 pb-2">
                  <h3 className="text-sm font-bold text-slate-900">Security Policies, Status & Master Password Reset</h3>
                  <p className="text-xs text-slate-500">
                    Master Admin has executive power to override passwords, unlock locked accounts, or change permissions.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Account Operational Status:</label>
                    <select
                      value={formData.accountStatus}
                      onChange={(e) => handleFieldChange('accountStatus', e.target.value as AccountStatus)}
                      className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white font-semibold"
                    >
                      <option value="active">Active (Normal Access)</option>
                      <option value="locked">Temporarily Locked (Excessive Failed Logins)</option>
                      <option value="deactivated">Deactivated (Access Revoked)</option>
                      <option value="pending_activation">Pending First-Time Activation</option>
                      <option value="suspended">Suspended (Disciplinary Review)</option>
                      <option value="on_leave">On Sabbatical / Leave</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Failed Login Attempts:</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min={0}
                        value={formData.failedLoginAttempts}
                        onChange={(e) => handleFieldChange('failedLoginAttempts', parseInt(e.target.value) || 0)}
                        className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => handleFieldChange('failedLoginAttempts', 0)}
                        className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold whitespace-nowrap"
                      >
                        Reset to 0
                      </button>
                    </div>
                  </div>
                </div>

                {/* Direct Master Password Override Box */}
                <div className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <KeyRound className="w-4 h-4 text-purple-700" />
                      <span className="text-xs font-bold text-purple-950">
                        Master Admin Direct Password Override
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={handleGenerateRandomPassword}
                      className="text-[11px] font-semibold text-purple-700 hover:text-purple-900 flex items-center gap-1 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Random Passkey</span>
                    </button>
                  </div>
                  <p className="text-[11px] text-purple-900 leading-relaxed">
                    As Master Administrator, you can assign a new password directly to this stakeholder without requiring email or OTP verification.
                  </p>

                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <input
                        type={showOverridePassword ? 'text' : 'password'}
                        value={overridePassword}
                        onChange={(e) => setOverridePassword(e.target.value)}
                        placeholder="Enter new password (e.g. Tamralipta@2026)"
                        className="w-full text-xs px-3 pr-10 py-2 border border-purple-300 rounded-xl bg-white font-medium focus:outline-none focus:border-purple-600"
                      />
                      <button
                        type="button"
                        onClick={() => setShowOverridePassword(!showOverridePassword)}
                        className="absolute right-3 top-2 text-slate-400 hover:text-slate-700"
                      >
                        {showOverridePassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={handleApplyDirectPasswordOverride}
                      className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-xs font-bold shadow-xs transition cursor-pointer"
                    >
                      Apply Override
                    </button>
                  </div>
                </div>

                {/* Checkbox Toggles for Security Lifecycle */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <label className="flex items-center gap-2 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.forcePasswordChange || false}
                      onChange={(e) => handleFieldChange('forcePasswordChange', e.target.checked)}
                      className="rounded text-purple-600 focus:ring-purple-500"
                    />
                    <span>Force Password Change on Next Login</span>
                  </label>

                  <label className="flex items-center gap-2 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.twoFactorEnabled || false}
                      onChange={(e) => handleFieldChange('twoFactorEnabled', e.target.checked)}
                      className="rounded text-purple-600 focus:ring-purple-500"
                    />
                    <span>Two-Factor Authentication (2FA) Mandatory</span>
                  </label>

                  <label className="flex items-center gap-2 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.emailVerified}
                      onChange={(e) => handleFieldChange('emailVerified', e.target.checked)}
                      className="rounded text-purple-600 focus:ring-purple-500"
                    />
                    <span>Official Institutional Email Verified</span>
                  </label>

                  <label className="flex items-center gap-2 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.mobileVerified}
                      onChange={(e) => handleFieldChange('mobileVerified', e.target.checked)}
                      className="rounded text-purple-600 focus:ring-purple-500"
                    />
                    <span>Mobile SMS Verified</span>
                  </label>
                </div>

                {/* RBAC Granular Permissions Matrix */}
                <div className="pt-2">
                  <label className="text-xs font-bold text-slate-800 block mb-1.5">
                    Granular Stakeholder Privilege Matrix:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {[
                      { key: 'manage_materials', label: 'Upload & Manage Teaching Materials' },
                      { key: 'evaluate_submissions', label: 'Evaluate Submissions & Grade Papers' },
                      { key: 'approve_materials', label: 'Approve Syllabus & Teaching Content' },
                      { key: 'institutional_documents', label: 'Publish College Circulars & Gazettes' },
                      { key: 'moderate_discussions', label: 'Moderate Student Discussion Forums' },
                      { key: 'support_tickets', label: 'Respond to IT & Helpdesk Tickets' },
                      { key: 'database_manage', label: 'Database Explorer & Backup Privileges' },
                      { key: 'stakeholder_edit', label: 'Full Master Stakeholder A-to-Z Edit Rights' }
                    ].map((p) => {
                      const hasPerm = (formData.permissions || []).includes(p.key);
                      return (
                        <button
                          key={p.key}
                          type="button"
                          onClick={() => handleTogglePermission(p.key)}
                          className={`p-2 rounded-xl text-left border flex items-center justify-between transition cursor-pointer ${
                            hasPerm
                              ? 'bg-purple-50 border-purple-300 text-purple-900 font-semibold'
                              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          <span>{p.label}</span>
                          {hasPerm ? (
                            <Check className="w-3.5 h-3.5 text-purple-700 flex-shrink-0" />
                          ) : (
                            <span className="text-[10px] text-slate-400 font-mono">OFF</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 6: Fees & Campus Facilities */}
            {activeTab === 'financial' && (
              <div className="space-y-4">
                <div className="border-b border-slate-100 pb-2">
                  <h3 className="text-sm font-bold text-slate-900">Campus Facilities, Fees & Scholarships</h3>
                  <p className="text-xs text-slate-500">Semester tuition status, state scholarships, library access, and biometric ID.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Semester Fee Status:</label>
                    <select
                      value={formData.financial?.feeStatus || 'paid'}
                      onChange={(e) => handleNestedChange('financial', 'feeStatus', e.target.value)}
                      className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white font-semibold"
                    >
                      <option value="paid">Fee Fully Paid (Receipt Verified)</option>
                      <option value="pending">Tuition Fee Pending / Dues</option>
                      <option value="scholarship">Full Scholarship Concession</option>
                      <option value="exempted">Institutionally Exempted (Merit)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Biometric Attendance Punch ID:</label>
                    <input
                      type="text"
                      value={formData.financial?.biometricId || ''}
                      onChange={(e) => handleNestedChange('financial', 'biometricId', e.target.value)}
                      placeholder="e.g. BIO-STD-042"
                      className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Scholarship Scheme Name:</label>
                    <input
                      type="text"
                      value={formData.financial?.scholarshipName || ''}
                      onChange={(e) => handleNestedChange('financial', 'scholarshipName', e.target.value)}
                      placeholder="e.g. Swami Vivekananda (SVMCM) / Kanyashree K2"
                      className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Government Scholarship Application ID:</label>
                    <input
                      type="text"
                      value={formData.financial?.scholarshipId || ''}
                      onChange={(e) => handleNestedChange('financial', 'scholarshipId', e.target.value)}
                      placeholder="e.g. SVMCM-2024-WB-883921"
                      className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Central Library Card Number:</label>
                    <input
                      type="text"
                      value={formData.financial?.libraryCardNo || ''}
                      onChange={(e) => handleNestedChange('financial', 'libraryCardNo', e.target.value)}
                      placeholder="e.g. TM-LIB-STD-2024-042"
                      className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Campus Residence Status:</label>
                    <select
                      value={formData.financial?.hostelStatus || 'day_scholar'}
                      onChange={(e) => handleNestedChange('financial', 'hostelStatus', e.target.value)}
                      className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white"
                    >
                      <option value="day_scholar">Day Scholar (Commuting from Home)</option>
                      <option value="hostel_resident">College Hostel Resident</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 7: Audit Trail & Edit Logs */}
            {activeTab === 'audit' && (
              <div className="space-y-4">
                <div className="border-b border-slate-100 pb-2">
                  <h3 className="text-sm font-bold text-slate-900">Stakeholder Modification History & Forensics</h3>
                  <p className="text-xs text-slate-500">Immutable record of changes made by administrative personnel.</p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="text-[10px] text-slate-500 uppercase font-semibold">Created At</div>
                    <div className="text-xs font-mono font-medium text-slate-800 mt-0.5">
                      {formData.createdAt ? new Date(formData.createdAt).toLocaleDateString() : 'Initial Seed'}
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="text-[10px] text-slate-500 uppercase font-semibold">Last Login</div>
                    <div className="text-xs font-mono font-medium text-slate-800 mt-0.5">
                      {formData.lastLogin || 'Never'}
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="text-[10px] text-slate-500 uppercase font-semibold">Last Modified By</div>
                    <div className="text-xs font-mono font-medium text-slate-800 mt-0.5">
                      {formData.lastModifiedBy || 'System Seed'}
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="text-[10px] text-slate-500 uppercase font-semibold">Audit Logs Count</div>
                    <div className="text-xs font-bold text-purple-700 mt-0.5">
                      {(formData.editLogs || []).length} Recorded Edits
                    </div>
                  </div>
                </div>

                {/* Edit Logs Table */}
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <table className="w-full text-xs text-left text-slate-700">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                      <tr>
                        <th className="py-2.5 px-3">Timestamp</th>
                        <th className="py-2.5 px-3">Modified By</th>
                        <th className="py-2.5 px-3">Change Summary</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {(formData.editLogs && formData.editLogs.length > 0) ? (
                        formData.editLogs.map((log, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/50">
                            <td className="py-2.5 px-3 font-mono text-slate-600 whitespace-nowrap">{log.timestamp}</td>
                            <td className="py-2.5 px-3 font-semibold text-purple-900">{log.modifiedBy}</td>
                            <td className="py-2.5 px-3 text-slate-700">{log.changeSummary}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={3} className="py-6 text-center text-slate-400">
                            No prior manual modifications recorded for this stakeholder.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Footer Save & Actions */}
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
            <div className="text-xs text-slate-500 hidden sm:block">
              Authorized Action · All modifications recorded under Master Admin Audit Trail.
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2.5 bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-800 hover:to-indigo-800 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{isSubmitting ? 'Saving All A-Z Data...' : 'Save All Modifications'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
