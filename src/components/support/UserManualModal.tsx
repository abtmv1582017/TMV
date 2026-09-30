import React, { useState } from 'react';
import {
  FileText,
  Download,
  Printer,
  X,
  Search,
  BookOpen,
  GraduationCap,
  Users,
  Building2,
  Shield,
  LifeBuoy,
  KeyRound,
  Lock,
  Smartphone,
  Mail,
  CheckCircle,
  AlertTriangle,
  Info,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  downloadStakeholderManualPDF,
  generateDynamicRoleSummaryPDF,
  openStakeholderManualInNewTab
} from '../../services/manualPdfGenerator';

interface UserManualModalProps {
  onClose: () => void;
  initialRoleFilter?: string;
}

export const UserManualModal: React.FC<UserManualModalProps> = ({
  onClose,
  initialRoleFilter = 'all'
}) => {
  const { currentUser, language } = useApp();
  const [activeCategory, setActiveCategory] = useState<string>(initialRoleFilter);
  const [searchQuery, setSearchQuery] = useState('');
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleDownloadPdf = () => {
    downloadStakeholderManualPDF(currentUser);
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 4000);
  };

  const handlePrint = () => {
    window.print();
  };

  const categories = [
    { id: 'all', label: 'All Stakeholders', bengaliLabel: 'সকল অংশীদার', icon: BookOpen },
    { id: 'student', label: 'Student (TM-STD)', bengaliLabel: 'শিক্ষার্থী', icon: GraduationCap },
    { id: 'faculty', label: 'Faculty (TM-FAC)', bengaliLabel: 'শিক্ষকমণ্ডলী', icon: BookOpen },
    { id: 'dept_head', label: 'Dept Head (TM-HOD)', bengaliLabel: 'বিভাগীয় প্রধান', icon: Users },
    { id: 'principal', label: 'Principal (TM-ADM)', bengaliLabel: 'অধ্যক্ষ ও প্রশাসন', icon: Building2 },
    { id: 'super_admin', label: 'Super Admin (TM-SADM)', bengaliLabel: 'সুপার অ্যাডমিন', icon: Shield },
    { id: 'tech_support', label: 'Tech Support (TM-ITS)', bengaliLabel: 'কারিগরি সহায়তা', icon: LifeBuoy },
    { id: 'security', label: 'Security & Recovery', bengaliLabel: 'নিরাপত্তা ও পাসওয়ার্ড পুনরুদ্ধার', icon: Lock }
  ];

  const manualSections = [
    {
      id: 'sec-overview',
      category: 'all',
      title: '1.0 Institutional Overview & Architecture',
      bengaliTitle: 'প্রাতিষ্ঠানিক পরিচিতি ও সিস্টেম আর্কিটেকচার',
      badge: 'General',
      content: (
        <div className="space-y-3 text-xs leading-relaxed text-slate-600">
          <p>
            <strong>Tamralipta Mahavidyalaya (TM-LMS)</strong> is a centralized academic learning and administrative management platform affiliated with Vidyasagar University and accredited with NAAC ‘A’ Grade. The platform connects students, teachers, departmental administrators, and college executives into an integrated digital campus.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 py-2">
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="font-semibold text-slate-800 block text-xs">Zero Plain-Text Passwords</span>
              <p className="text-[11px] text-slate-500 mt-0.5">Encrypted with salted hash algorithms. Passwords cannot be viewed by staff or developers.</p>
            </div>
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="font-semibold text-slate-800 block text-xs">Deterministic Institutional IDs</span>
              <p className="text-[11px] text-slate-500 mt-0.5">Safe, standardized IDs that contain no personal contact info or sensitive tokens.</p>
            </div>
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="font-semibold text-slate-800 block text-xs">DPDP Act (2023) Aligned</span>
              <p className="text-[11px] text-slate-500 mt-0.5">Complete consent management, data minimization, and immutable audit logs.</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'sec-id-schema',
      category: 'all',
      title: '2.0 Institutional User ID Schema & Credentials',
      bengaliTitle: 'প্রাতিষ্ঠানিক ইউজার আইডি ফরম্যাট ও পরিচয়পত্র',
      badge: 'Credentials',
      content: (
        <div className="space-y-3 text-xs leading-relaxed text-slate-600">
          <p>
            Tamralipta Mahavidyalaya enforces unique, non-reusable institutional IDs across all 6 stakeholder categories.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse border border-slate-200 text-xs">
              <thead className="bg-slate-100 text-slate-700 font-semibold">
                <tr>
                  <th className="p-2 border border-slate-200">Stakeholder</th>
                  <th className="p-2 border border-slate-200">Standard ID Format</th>
                  <th className="p-2 border border-slate-200">Sample Assigned ID</th>
                  <th className="p-2 border border-slate-200">Authorized Access</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-[11px]">
                <tr>
                  <td className="p-2 font-medium text-slate-800">Student</td>
                  <td className="p-2 font-mono text-sky-800">TM-STD-YYYY-XXXXX</td>
                  <td className="p-2 font-mono">TM-STD-2026-00042</td>
                  <td className="p-2">Courses, lecture notes, assignments, attendance, CIA tests</td>
                </tr>
                <tr>
                  <td className="p-2 font-medium text-slate-800">Faculty Member</td>
                  <td className="p-2 font-mono text-emerald-800">TM-FAC-XXXX</td>
                  <td className="p-2 font-mono">TM-FAC-0028</td>
                  <td className="p-2">Syllabus delivery, digital attendance, assignment grading</td>
                </tr>
                <tr>
                  <td className="p-2 font-medium text-slate-800">Department Head</td>
                  <td className="p-2 font-mono text-blue-800">TM-HOD-XXXX</td>
                  <td className="p-2 font-mono">TM-HOD-0014</td>
                  <td className="p-2">Workload planning, syllabus audit, class swap approval</td>
                </tr>
                <tr>
                  <td className="p-2 font-medium text-slate-800">Principal / Admin</td>
                  <td className="p-2 font-mono text-amber-800">TM-ADM-XXXX</td>
                  <td className="p-2 font-mono">TM-ADM-0001</td>
                  <td className="p-2">Executive analytics, NAAC audit pack, college notices</td>
                </tr>
                <tr>
                  <td className="p-2 font-medium text-slate-800">Super Administrator</td>
                  <td className="p-2 font-mono text-purple-800">TM-SADM-XXXX</td>
                  <td className="p-2 font-mono">TM-SADM-0001</td>
                  <td className="p-2">Global ID rule engine, CSV batch provisioning, security policy</td>
                </tr>
                <tr>
                  <td className="p-2 font-medium text-slate-800">Technical Support</td>
                  <td className="p-2 font-mono text-rose-800">TM-ITS-XXXX</td>
                  <td className="p-2 font-mono">TM-ITS-0003</td>
                  <td className="p-2">Identity verification, manual account unlock, OTP diagnostics</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )
    },
    {
      id: 'sec-activation',
      category: 'security',
      title: '3.0 First-Time Account Activation Protocol',
      bengaliTitle: 'প্রথমবার লগইন ও অ্যাকাউন্ট সক্রিয়করণ',
      badge: 'Account Setup',
      content: (
        <div className="space-y-3 text-xs text-slate-600">
          <p>
            To prevent credential harvesting, Tamralipta Mahavidyalaya does <strong>NOT</strong> dispatch default or initial passwords over paper, spreadsheets, or open channels. Every stakeholder activates their account personally:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
            <div className="bg-sky-50 border border-sky-100 rounded-lg p-2.5">
              <span className="font-bold text-sky-900 block text-xs">Step 1: Initiate</span>
              <p className="text-[11px] text-sky-800 mt-1">Click "Activate Account" on the LMS login page.</p>
            </div>
            <div className="bg-sky-50 border border-sky-100 rounded-lg p-2.5">
              <span className="font-bold text-sky-900 block text-xs">Step 2: Enter ID & Code</span>
              <p className="text-[11px] text-sky-800 mt-1">Provide your assigned User ID and the 6-digit activation code sent to your registered contact.</p>
            </div>
            <div className="bg-sky-50 border border-sky-100 rounded-lg p-2.5">
              <span className="font-bold text-sky-900 block text-xs">Step 3: Define Password</span>
              <p className="text-[11px] text-sky-800 mt-1">Set a confidential, personal password satisfying institutional complexity criteria.</p>
            </div>
            <div className="bg-sky-50 border border-sky-100 rounded-lg p-2.5">
              <span className="font-bold text-sky-900 block text-xs">Step 4: Instant Activation</span>
              <p className="text-[11px] text-sky-800 mt-1">Account shifts from "Pending Activation" to "Active" immediately.</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'sec-recovery',
      category: 'security',
      title: '4.0 Password Recovery & Brute-Force Safeguards',
      bengaliTitle: 'পাসওয়ার্ড পুনরুদ্ধার ও সুরক্ষা নীতিমালা',
      badge: 'Recovery',
      content: (
        <div className="space-y-3 text-xs text-slate-600">
          <p>If you forget your password, you can recover access via two cryptographically secured self-service methods:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="border border-slate-200 bg-slate-50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1.5">
                <Mail className="w-4 h-4 text-sky-600" />
                <span className="font-semibold text-slate-800 text-xs">Method A: Institutional Email Token Link</span>
              </div>
              <ul className="list-disc pl-4 space-y-1 text-[11px] text-slate-600">
                <li>Input User ID or registered email address on the login portal.</li>
                <li>Generates a cryptographically signed reset link valid for <strong>15 minutes</strong>.</li>
                <li>Single-use token: invalidated immediately upon password update.</li>
                <li>Confirmation email dispatched upon successful reset.</li>
              </ul>
            </div>
            <div className="border border-slate-200 bg-slate-50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1.5">
                <Smartphone className="w-4 h-4 text-emerald-600" />
                <span className="font-semibold text-slate-800 text-xs">Method B: Mobile SMS OTP</span>
              </div>
              <ul className="list-disc pl-4 space-y-1 text-[11px] text-slate-600">
                <li>Input User ID or registered 10-digit mobile number.</li>
                <li>Dispatches a secure 6-digit numeric OTP valid for <strong>5 minutes</strong>.</li>
                <li>Maximum 3 incorrect attempts permitted before security cooldown.</li>
                <li>Verification enables immediate password reconfiguration.</li>
              </ul>
            </div>
          </div>
          <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg flex items-start gap-2 text-rose-800">
            <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <div className="text-[11px]">
              <strong>5-Attempt Lockout Defense:</strong> Entering 5 consecutive incorrect passwords automatically locks the account for 15 minutes to thwart brute-force attacks. An alert notification is dispatched to your registered email. Technical support (TM-ITS) can manually unlock accounts upon identity verification.
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'sec-student',
      category: 'student',
      title: '5.0 Student Operations Guide (TM-STD)',
      bengaliTitle: 'শিক্ষার্থী ব্যবহার নির্দেশিকা',
      badge: 'Student Portal',
      content: (
        <div className="space-y-3 text-xs text-slate-600">
          <p>
            Your student portal centralizes day-to-day academic workflows from enrollment to graduation:
          </p>
          <div className="space-y-2">
            <div className="p-2 bg-slate-50 rounded border border-slate-200">
              <span className="font-semibold text-slate-800">5.1 Enrolled Courses & Learning Materials:</span>
              <p className="text-[11px] mt-0.5">Access syllabi, lecture slides, recorded webinars, and reading lists uploaded by your course professors under the "Courses" tab.</p>
            </div>
            <div className="p-2 bg-slate-50 rounded border border-slate-200">
              <span className="font-semibold text-slate-800">5.2 Assignment Submission & Feedback:</span>
              <p className="text-[11px] mt-0.5">Upload assignment answers in PDF, DOCX, or ZIP format before the cut-off deadline. View graded rubrics and faculty comments upon evaluation.</p>
            </div>
            <div className="p-2 bg-slate-50 rounded border border-slate-200">
              <span className="font-semibold text-slate-800">5.3 Real-Time Attendance Tracker (75% Minimum Requirement):</span>
              <p className="text-[11px] mt-0.5">Monitors overall and course-wise lecture attendance. The portal automatically flags when attendance dips below the statutory 75% Vidyasagar University exam eligibility threshold.</p>
            </div>
            <div className="p-2 bg-slate-50 rounded border border-slate-200">
              <span className="font-semibold text-slate-800">5.4 Continuous Internal Assessments (CIA) & Grade Cards:</span>
              <p className="text-[11px] mt-0.5">Take timed objective quizzes, internal evaluations, and review provisional semester SGPA/CGPA grade sheets.</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'sec-faculty',
      category: 'faculty',
      title: '6.0 Faculty Operations Guide (TM-FAC)',
      bengaliTitle: 'শিক্ষকমণ্ডলী পরিচালনা নির্দেশিকা',
      badge: 'Faculty Portal',
      content: (
        <div className="space-y-3 text-xs text-slate-600">
          <p>The faculty interface empowers professors and lecturers to manage instruction, evaluation, and student engagement:</p>
          <div className="space-y-2">
            <div className="p-2 bg-slate-50 rounded border border-slate-200">
              <span className="font-semibold text-slate-800">6.1 Digital Attendance Register:</span>
              <p className="text-[11px] mt-0.5">Mark daily lecture attendance with one click per student or through batch selection. Generates university compliance sheets automatically.</p>
            </div>
            <div className="p-2 bg-slate-50 rounded border border-slate-200">
              <span className="font-semibold text-slate-800">6.2 Syllabus Tracking & Resource Publishing:</span>
              <p className="text-[11px] mt-0.5">Upload modular course materials, lecture notes, video links, and keep syllabus completion meters updated for departmental review.</p>
            </div>
            <div className="p-2 bg-slate-50 rounded border border-slate-200">
              <span className="font-semibold text-slate-800">6.3 Digital Assignment Grading & Question Banks:</span>
              <p className="text-[11px] mt-0.5">Grade digital submissions against customizable rubrics, provide written feedback, and author timed question sets for internal tests.</p>
            </div>
            <div className="p-2 bg-slate-50 rounded border border-slate-200">
              <span className="font-semibold text-slate-800">6.4 Mentee Monitoring & Early Academic Warnings:</span>
              <p className="text-[11px] mt-0.5">Identify struggling students with low attendance or test scores, and dispatch academic warning alerts directly to student and guardian contacts.</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'sec-hod',
      category: 'dept_head',
      title: '7.0 Department Head Operations Guide (TM-HOD)',
      bengaliTitle: 'বিভাগীয় প্রধান পরিচালনা নির্দেশিকা',
      badge: 'HOD Portal',
      content: (
        <div className="space-y-3 text-xs text-slate-600">
          <p>Department Heads govern academic curriculum progress, faculty workload allocation, and department circulars:</p>
          <div className="space-y-2">
            <div className="p-2 bg-slate-50 rounded border border-slate-200">
              <span className="font-semibold text-slate-800">7.1 Workload & Course Allocation:</span>
              <p className="text-[11px] mt-0.5">Assign theory and laboratory papers across departmental faculty in accordance with UGC contact hour guidelines.</p>
            </div>
            <div className="p-2 bg-slate-50 rounded border border-slate-200">
              <span className="font-semibold text-slate-800">7.2 Syllabus Completion Monitoring & Class Swaps:</span>
              <p className="text-[11px] mt-0.5">Review faculty syllabus milestones weekly and authorize class swap requests when faculty are attending academic conferences.</p>
            </div>
            <div className="p-2 bg-slate-50 rounded border border-slate-200">
              <span className="font-semibold text-slate-800">7.3 Internal Marks Moderation & Locking:</span>
              <p className="text-[11px] mt-0.5">Audit continuous assessment marks submitted by faculty members to ensure scoring equity prior to university portal transmission.</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'sec-principal',
      category: 'principal',
      title: '8.0 Principal & Executive Admin Guide (TM-ADM)',
      bengaliTitle: 'অধ্যক্ষ ও কলেজ প্রশাসন নির্দেশিকা',
      badge: 'Principal Portal',
      content: (
        <div className="space-y-3 text-xs text-slate-600">
          <p>Provides institution-wide governance, regulatory compliance, and executive decision-making tools:</p>
          <div className="space-y-2">
            <div className="p-2 bg-slate-50 rounded border border-slate-200">
              <span className="font-semibold text-slate-800">8.1 Executive Institutional Analytics:</span>
              <p className="text-[11px] mt-0.5">Real-time overview of student enrollment totals, campus-wide daily attendance trends, and departmental syllabus completion rates.</p>
            </div>
            <div className="p-2 bg-slate-50 rounded border border-slate-200">
              <span className="font-semibold text-slate-800">8.2 NAAC, NIRF & Vidyasagar University Compliance Packs:</span>
              <p className="text-[11px] mt-0.5">Export verified Criterion 1 & 2 audit packs containing student-faculty ratios, mentor logs, and assessment compliance reports with one click.</p>
            </div>
            <div className="p-2 bg-slate-50 rounded border border-slate-200">
              <span className="font-semibold text-slate-800">8.3 Gazetted College Circulars & Emergency Broadcasts:</span>
              <p className="text-[11px] mt-0.5">Issue official holiday notifications, exam rosters, and advisory alerts with mandatory read-receipt banner alerts across all portals.</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'sec-sadm',
      category: 'super_admin',
      title: '9.0 Super Administrator Operations Guide (TM-SADM)',
      bengaliTitle: 'সুপার অ্যাডমিন পরিচালনা নির্দেশিকা',
      badge: 'Super Admin Portal',
      content: (
        <div className="space-y-3 text-xs text-slate-600">
          <p>Responsible for foundational user provisioning, ID prefix policy, and cryptographic security settings:</p>
          <div className="space-y-2">
            <div className="p-2 bg-slate-50 rounded border border-slate-200">
              <span className="font-semibold text-slate-800">9.1 Institutional ID Policy Engine:</span>
              <p className="text-[11px] mt-0.5">Configure deterministic prefixes (TM-STD, TM-FAC, etc.), sequential roll padding, and admission year tokens in the Auth Policy console.</p>
            </div>
            <div className="p-2 bg-slate-50 rounded border border-slate-200">
              <span className="font-semibold text-slate-800">9.2 Bulk CSV User Provisioning:</span>
              <p className="text-[11px] mt-0.5">Import bulk student and faculty cohorts with real-time email, phone, and roll uniqueness validation with zero collision risk.</p>
            </div>
            <div className="p-2 bg-slate-50 rounded border border-slate-200">
              <span className="font-semibold text-slate-800">9.3 Security Policy & Lockout Parameters:</span>
              <p className="text-[11px] mt-0.5">Set failed password lockout thresholds (default: 5), temporary lockout minutes (default: 15), and session expiration timers.</p>
            </div>
            <div className="p-2 bg-slate-50 rounded border border-slate-200">
              <span className="font-semibold text-slate-800">9.4 Global Directory & Account Status Management:</span>
              <p className="text-[11px] mt-0.5">Search and modify user accounts across all roles: activate, temporarily suspend, deactivate, or force password updates.</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'sec-tech',
      category: 'tech_support',
      title: '10.0 Technical Support & IT Helpdesk Protocols (TM-ITS)',
      bengaliTitle: 'কারিগরি সহায়তা ও হেল্পডেস্ক প্রোটোকল',
      badge: 'IT Support',
      content: (
        <div className="space-y-3 text-xs text-slate-600">
          <p>Ensures platform reliability, identity verification, and rapid diagnostic response:</p>
          <div className="space-y-2">
            <div className="p-2 bg-slate-50 rounded border border-slate-200">
              <span className="font-semibold text-slate-800">10.1 Manual Account Unlock Protocol:</span>
              <p className="text-[11px] mt-0.5">When a user is locked out due to repeated failed logins, verify their identity via physical College ID Card or registered mobile before clicking "Unlock Account".</p>
            </div>
            <div className="p-2 bg-slate-50 rounded border border-slate-200">
              <span className="font-semibold text-slate-800">10.2 OTP Delivery Diagnostics:</span>
              <p className="text-[11px] mt-0.5">Access the Notification Dispatch drawer to inspect sent SMS OTPs, token timestamps, and verify mobile gateway status.</p>
            </div>
            <div className="p-2 bg-slate-50 rounded border border-slate-200">
              <span className="font-semibold text-slate-800">10.3 Immutable Security Audit Log Review:</span>
              <p className="text-[11px] mt-0.5">Audit every sign-in attempt, IP address, password reset, and role transition for statutory forensic compliance.</p>
            </div>
          </div>
          <div className="p-3 bg-slate-100 rounded-lg text-[11px] text-slate-700">
            <strong>IT Cell Contact Details:</strong><br />
            Tamralipta Mahavidyalaya Computer & IT Cell, Tamluk, Purba Medinipur, WB - 721636<br />
            Email: <a href="mailto:itsupport@tmv.ac.in" className="text-sky-600 underline">itsupport@tmv.ac.in</a> | Phone: +91 (03228) 266054 / +91 94340 12345
          </div>
        </div>
      )
    }
  ];

  const filteredSections = manualSections.filter((sec) => {
    const matchesCategory =
      activeCategory === 'all' ||
      sec.category === activeCategory ||
      (activeCategory === 'security' && (sec.category === 'security' || sec.id === 'sec-activation' || sec.id === 'sec-recovery'));

    if (!matchesCategory) return false;

    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const titleMatch = sec.title.toLowerCase().includes(q) || sec.bengaliTitle.toLowerCase().includes(q);
    const badgeMatch = sec.badge.toLowerCase().includes(q);
    return titleMatch || badgeMatch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/75 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col max-h-[92vh] overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Top Institutional Header */}
        <div className="bg-[#0f2942] text-white px-5 sm:px-8 py-4.5 border-b border-[#1e3e5e] flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-md border border-white/20">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold tracking-tight text-white">
                  TM-LMS Stakeholder User Manual
                </h2>
                <span className="text-[11px] bg-sky-950/80 text-sky-300 font-semibold px-2 py-0.5 rounded border border-sky-400/30">
                  Edition v2.4 (2026-27)
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Tamralipta Mahavidyalaya · Official Operational & Governance Guide for All 6 Stakeholders
              </p>
            </div>
          </div>

          {/* Action Buttons: Download PDF & Print */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadPdf}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs transition cursor-pointer"
              title="Download Complete 10-Page Official Institutional Manual (PDF)"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Download PDF (10 Pages)</span>
              <span className="sm:hidden">PDF</span>
            </button>

            <button
              onClick={handlePrint}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-xs font-medium transition cursor-pointer"
              title="Print or Save as High-Resolution PDF via Browser Print"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Download Success Alert Bar */}
        {downloadSuccess && (
          <div className="bg-emerald-50 border-b border-emerald-200 px-6 py-2 flex items-center justify-between text-xs text-emerald-800">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>The 10-page official institutional PDF manual (<strong>TM-LMS-Stakeholder-User-Manual.pdf</strong>) has been downloaded.</span>
            </div>
            <button
              onClick={() => openStakeholderManualInNewTab(currentUser)}
              className="font-semibold underline hover:text-emerald-950 flex items-center gap-1 cursor-pointer"
            >
              Open in new tab <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* Search & Filter Bar */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row gap-3 items-center justify-between">
          {/* Stakeholder Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
            {categories.map((c) => {
              const Icon = c.icon;
              const isActive = activeCategory === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => setActiveCategory(c.id)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition cursor-pointer ${
                    isActive
                      ? 'bg-sky-700 text-white shadow-xs font-semibold'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{c.label}</span>
                </button>
              );
            })}
          </div>

          {/* Quick Search */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search manual (e.g. OTP, Lockout)..."
              className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
        </div>

        {/* Manual Content Scroll Area */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6 bg-slate-50/50 print:bg-white print:p-0">
          {/* Quick PDF Banner */}
          <div className="bg-gradient-to-r from-sky-50 via-teal-50 to-blue-50 border border-sky-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-sky-600 text-white rounded-lg shadow-xs mt-0.5">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-sky-950">
                  Looking for the Official Printed PDF User Manual?
                </h3>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  Includes comprehensive cover page, table of contents, credential schemas, 6-role workflows, and DPDP compliance statement formatted in high-resolution A4.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={handleDownloadPdf}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-700 hover:bg-sky-800 text-white rounded-lg text-xs font-semibold shadow-xs transition cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download PDF</span>
              </button>
              {currentUser && (
                <button
                  onClick={() => generateDynamicRoleSummaryPDF(currentUser.role, currentUser)}
                  className="flex items-center gap-1 px-2.5 py-1.5 bg-white text-slate-700 hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-medium shadow-xs transition cursor-pointer"
                  title="Generate a 1-page personalized brief tailored to your assigned role"
                >
                  <span>My Role Brief</span>
                </button>
              )}
            </div>
          </div>

          {/* Section Cards */}
          {filteredSections.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <p className="text-xs">No sections found matching "{searchQuery}".</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('all');
                }}
                className="mt-2 text-xs text-sky-600 hover:underline font-semibold"
              >
                Clear search and filter
              </button>
            </div>
          ) : (
            filteredSections.map((sec) => (
              <div
                key={sec.id}
                className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs hover:border-slate-300 transition"
              >
                <div className="flex items-start justify-between gap-3 mb-3 border-b border-slate-100 pb-2.5">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                      {sec.title}
                    </h3>
                    <p className="text-xs text-slate-500 font-serif">
                      {sec.bengaliTitle}
                    </p>
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                    {sec.badge}
                  </span>
                </div>
                {sec.content}
              </div>
            ))
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 sm:px-6 bg-white border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <div className="flex items-center gap-2 text-[11px]">
            <span>Tamralipta Mahavidyalaya LMS</span>
            <span aria-hidden="true">·</span>
            <span>Document Ref: TM/LMS/MANUAL/2026/01</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-700 font-medium">DPDP Act (2023) Verified</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadPdf}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF (10 Pages)</span>
            </button>
            <span className="text-slate-300">|</span>
            <button
              onClick={onClose}
              className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
