import { jsPDF } from 'jspdf';
import { User } from '../types';

export const buildCompleteStakeholderManualPDF = (currentUser?: User | null): jsPDF => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 16;
  const contentWidth = pageWidth - margin * 2;

  // Institutional Color Palette
  const PRIMARY: [number, number, number] = [15, 76, 129];     // Deep Navy #0F4C81
  const SECONDARY: [number, number, number] = [13, 148, 136];  // Emerald Teal #0D9488
  const TEXT_DARK: [number, number, number] = [30, 41, 59];    // Slate 800
  const TEXT_MUTED: [number, number, number] = [100, 116, 139];// Slate 500
  const BG_LIGHT: [number, number, number] = [248, 250, 252];  // Slate 50
  const BORDER: [number, number, number] = [226, 232, 240];    // Slate 200
  const ACCENT: [number, number, number] = [217, 119, 6];      // Amber 600

  let currentPage = 1;

  const drawHeaderFooter = (pageTitle = 'USER MANUAL & STAKEHOLDER GUIDE') => {
    if (currentPage === 1) return; // Skip cover page

    // Header
    doc.setFillColor(...BG_LIGHT);
    doc.rect(0, 0, pageWidth, 12, 'F');
    doc.setDrawColor(...BORDER);
    doc.setLineWidth(0.3);
    doc.line(0, 12, pageWidth, 12);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(...PRIMARY);
    doc.text('TAMRALIPTA MAHAVIDYALAYA (TM-LMS)', margin, 8);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(...TEXT_MUTED);
    doc.text(pageTitle, pageWidth - margin, 8, { align: 'right' });

    // Footer
    doc.setDrawColor(...BORDER);
    doc.line(0, pageHeight - 12, pageWidth, pageHeight - 12);
    doc.setFontSize(7.5);
    doc.setTextColor(...TEXT_MUTED);
    doc.text('Institutional Portal: https://tmv.ac.in | IT Cell: itsupport@tmv.ac.in', margin, pageHeight - 6);
    doc.text(`Page ${currentPage} of 10`, pageWidth - margin, pageHeight - 6, { align: 'right' });
  };

  // ==========================================
  // PAGE 1: COVER PAGE
  // ==========================================
  // Top Header Banner
  doc.setFillColor(...PRIMARY);
  doc.rect(0, 0, pageWidth, 56, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(21);
  doc.text('TAMRALIPTA MAHAVIDYALAYA', pageWidth / 2, 21, { align: 'center' });

  doc.setFontSize(10.5);
  doc.setFont('helvetica', 'normal');
  doc.text('ESTABLISHED 1948 | AFFILIATED TO VIDYASAGAR UNIVERSITY', pageWidth / 2, 29, { align: 'center' });
  doc.text('NAAC ACCREDITED WITH "A" GRADE | TAMLUK, PURBA MEDINIPUR, WB - 721636', pageWidth / 2, 35, { align: 'center' });

  doc.setDrawColor(...SECONDARY);
  doc.setLineWidth(0.8);
  doc.line(margin + 20, 42, pageWidth - margin - 20, 42);

  doc.setFontSize(9.5);
  doc.setTextColor(204, 251, 241);
  doc.text('SMART LEARNING MANAGEMENT SYSTEM (TM-LMS) · STAKEHOLDER MANUAL', pageWidth / 2, 48, { align: 'center' });

  // Title Box
  let y = 74;
  doc.setFillColor(...BG_LIGHT);
  doc.setDrawColor(...BORDER);
  doc.roundedRect(margin, y, contentWidth, 54, 3, 3, 'FD');

  doc.setDrawColor(...PRIMARY);
  doc.setLineWidth(0.6);
  doc.line(margin + 6, y + 16, margin + contentWidth - 6, y + 16);

  doc.setTextColor(...PRIMARY);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(17);
  doc.text('COMPREHENSIVE STAKEHOLDER USER MANUAL', margin + 8, y + 11);

  doc.setTextColor(...TEXT_DARK);
  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'normal');
  doc.text('Official Operational Guide for Authentication, Security Protocol, Course Delivery,', margin + 8, y + 25);
  doc.text('Attendance Tracking, Examination Administration, and Governance Workflows.', margin + 8, y + 31);
  doc.text('Covers all 6 Institutional Stakeholder Categories under DPDP Act 2023 & NEP 2020 Framework.', margin + 8, y + 37);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...SECONDARY);
  doc.text('Edition: v2.4 (Academic Year 2026-2027) | Document Ref: TM/LMS/MANUAL/2026/01', margin + 8, y + 47);

  // Target Stakeholders Grid
  y = 138;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(...PRIMARY);
  doc.text('TARGET STAKEHOLDER CATEGORIES', margin, y);
  y += 6;

  const roles = [
    { role: 'Student (TM-STD)', bengali: 'শিক্ষার্থী', desc: 'Online classes, syllabus progress, assignments, attendance, transcripts' },
    { role: 'Faculty Member (TM-FAC)', bengali: 'শিক্ষক / অধ্যাপিকা', desc: 'Curriculum delivery, digital attendance, assignment grading, mentoring' },
    { role: 'Department Head (TM-HOD)', bengali: 'বিভাগীয় প্রধান', desc: 'Course allocation, syllabus audit, faculty workload & department notices' },
    { role: 'Principal / Admin (TM-ADM)', bengali: 'অধ্যক্ষ ও প্রশাসন', desc: 'Institutional analytics, NAAC audit metrics, regulatory compliance, college notices' },
    { role: 'Super Administrator (TM-SADM)', bengali: 'প্রধান প্রশাসক', desc: 'ID generation rule engine, bulk CSV provisioning, role security & lockout controls' },
    { role: 'Technical Support (TM-ITS)', bengali: 'কারিগরি সহায়তা', desc: 'Identity verification, credential reset diagnostic, audit trail monitoring' },
  ];

  roles.forEach((r, idx) => {
    const col = idx % 2;
    const row = Math.floor(idx / 2);
    const cardW = (contentWidth - 6) / 2;
    const cardX = margin + col * (cardW + 6);
    const cardY = y + row * 24;

    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(...BORDER);
    doc.roundedRect(cardX, cardY, cardW, 20, 2, 2, 'FD');

    // Accent bar
    doc.setFillColor(...PRIMARY);
    doc.rect(cardX, cardY, 2.5, 20, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(...PRIMARY);
    doc.text(`${r.role} • ${r.bengali}`, cardX + 6, cardY + 6);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(...TEXT_MUTED);
    const splitDesc = doc.splitTextToSize(r.desc, cardW - 10);
    doc.text(splitDesc, cardX + 6, cardY + 11);
  });

  // Cover Footer Box
  y = 224;
  doc.setFillColor(...BG_LIGHT);
  doc.roundedRect(margin, y, contentWidth, 40, 2, 2, 'FD');
  doc.setDrawColor(...BORDER);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(...TEXT_DARK);
  doc.text('Institutional Compliance & Governance Statement', margin + 6, y + 8);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...TEXT_MUTED);
  const notice = 'This manual is issued under the authority of the Governing Body and Principal, Tamralipta Mahavidyalaya. All authorized users must adhere strictly to the Digital Personal Data Protection (DPDP) Act, 2023, UGC Cyber Security Guidelines, and institutional IT policies. No plain text passwords are stored or distributed.';
  doc.text(doc.splitTextToSize(notice, contentWidth - 12), margin + 6, y + 15);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...PRIMARY);
  doc.text('Official Portal: https://tmv-dusky.vercel.app | IT Cell: itsupport@tmv.ac.in', margin + 6, y + 33);

  // ==========================================
  // PAGE 2: TABLE OF CONTENTS & SYSTEM OVERVIEW
  // ==========================================
  doc.addPage();
  currentPage++;
  drawHeaderFooter('SYSTEM ARCHITECTURE & TABLE OF CONTENTS');

  y = 22;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.setTextColor(...PRIMARY);
  doc.text('Table of Contents & Core Architecture', margin, y);

  y += 8;
  const tocItems = [
    { sec: '1.0', title: 'System Access & Institutional Credentials Schema', page: '03' },
    { sec: '2.0', title: 'First-Time Account Activation Workflow', page: '03' },
    { sec: '3.0', title: 'Password Recovery Protocols (Email Link & Mobile OTP)', page: '04' },
    { sec: '4.0', title: 'Student Operations Manual (TM-STD)', page: '05' },
    { sec: '5.0', title: 'Faculty Operations Manual (TM-FAC)', page: '06' },
    { sec: '6.0', title: 'Department Head Operations Manual (TM-HOD)', page: '07' },
    { sec: '7.0', title: 'Principal & Executive Administration Manual (TM-ADM)', page: '08' },
    { sec: '8.0', title: 'Super Administrator & Security Policy Governance (TM-SADM)', page: '09' },
    { sec: '9.0', title: 'Technical Support & Helpdesk Protocols (TM-ITS)', page: '10' },
    { sec: '10.0', title: 'Data Privacy (DPDP 2023), Audit Logs & Incident Management', page: '10' },
  ];

  tocItems.forEach((item) => {
    doc.setFillColor(...BG_LIGHT);
    doc.rect(margin, y - 4, contentWidth, 7, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(...PRIMARY);
    doc.text(item.sec, margin + 3, y + 1);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...TEXT_DARK);
    doc.text(item.title, margin + 18, y + 1);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...SECONDARY);
    doc.text(`Page ${item.page}`, pageWidth - margin - 3, y + 1, { align: 'right' });

    doc.setDrawColor(...BORDER);
    doc.setLineWidth(0.2);
    doc.line(margin + 18, y + 2.5, pageWidth - margin - 20, y + 2.5);

    y += 8.5;
  });

  y += 4;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(...PRIMARY);
  doc.text('System Architecture & Security Model', margin, y);

  y += 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(...TEXT_DARK);
  const archText = 'TM-LMS utilizes a Zero-Trust Role-Based Access Control (RBAC) architecture built specifically for higher education institutions. The system decouples frontend presentation from authorization decisions: access rights are evaluated strictly against verified institutional records.';
  doc.text(doc.splitTextToSize(archText, contentWidth), margin, y);

  y += 18;
  doc.setFillColor(240, 253, 250);
  doc.setDrawColor(...SECONDARY);
  doc.roundedRect(margin, y, contentWidth, 50, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...SECONDARY);
  doc.text('Key Security & Architectural Standards', margin + 6, y + 8);

  const tenets = [
    '• Non-Reusable Institutional User IDs: IDs are deterministic, unique, and contain zero confidential information.',
    '• Cryptographic Salted Hashing: User passwords are encrypted with industry-standard bcrypt/PBKDF2; never plain text.',
    '• Dual-Channel Account Recovery: Secure verification via registered email (15-min token) and mobile SMS OTP (5-min token).',
    '• Brute-Force Rate Limiting: 5 consecutive failed login attempts trigger an immediate 15-minute temporary lockout.',
    '• Immutable Audit Logs: All authentication attempts, lockouts, resets, and role assignments are immutably logged.',
    '• DPDP Act (2023) Compliance: Explicit consent, data minimization, and right to rectification built in.'
  ];

  let tenetY = y + 15;
  tenets.forEach(t => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...TEXT_DARK);
    doc.text(t, margin + 6, tenetY);
    tenetY += 5.5;
  });

  // ==========================================
  // PAGE 3: CREDENTIALS & ACCOUNT ACTIVATION
  // ==========================================
  doc.addPage();
  currentPage++;
  drawHeaderFooter('CREDENTIAL SCHEMA & ACCOUNT ACTIVATION');

  y = 22;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(...PRIMARY);
  doc.text('1.0 Institutional User ID Schema', margin, y);

  y += 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(...TEXT_DARK);
  doc.text('Tamralipta Mahavidyalaya assigns standardized institutional User IDs based on stakeholder category:', margin, y);

  y += 7;
  const schemas = [
    ['Category', 'User ID Format', 'Example', 'Description'],
    ['Student', 'TM-STD-YYYY-XXXXX', 'TM-STD-2026-00042', 'Institutional prefix, year of admission, sequential roll'],
    ['Faculty', 'TM-FAC-XXXX', 'TM-FAC-0028', 'Faculty cadre prefix and permanent employee serial'],
    ['Department Head', 'TM-HOD-XXXX', 'TM-HOD-0014', 'Department Head designation code'],
    ['Principal / Admin', 'TM-ADM-XXXX', 'TM-ADM-0001', 'Executive leadership and college administration'],
    ['Super Admin', 'TM-SADM-XXXX', 'TM-SADM-0001', 'Global IT system administration'],
    ['Technical Support', 'TM-ITS-XXXX', 'TM-ITS-0003', 'Helpdesk and systems maintenance staff']
  ];

  schemas.forEach((row, rIdx) => {
    const isHeader = rIdx === 0;
    const rowH = 7;
    doc.setFillColor(isHeader ? PRIMARY[0] : (rIdx % 2 === 0 ? BG_LIGHT[0] : 255), isHeader ? PRIMARY[1] : (rIdx % 2 === 0 ? BG_LIGHT[1] : 255), isHeader ? PRIMARY[2] : (rIdx % 2 === 0 ? BG_LIGHT[2] : 255));
    doc.rect(margin, y, contentWidth, rowH, 'F');
    doc.setDrawColor(...BORDER);
    doc.rect(margin, y, contentWidth, rowH, 'S');

    doc.setFont('helvetica', isHeader ? 'bold' : 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(isHeader ? 255 : TEXT_DARK[0], isHeader ? 255 : TEXT_DARK[1], isHeader ? 255 : TEXT_DARK[2]);

    doc.text(row[0], margin + 3, y + 4.8);
    doc.text(row[1], margin + 34, y + 4.8);
    doc.text(row[2], margin + 74, y + 4.8);
    doc.text(row[3], margin + 110, y + 4.8);

    y += rowH;
  });

  y += 8;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(...PRIMARY);
  doc.text('2.0 First-Time Account Activation Workflow', margin, y);

  y += 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(...TEXT_DARK);
  const actDesc = 'New students and newly appointed faculty members receive their provisional User ID and an institutional activation code upon admission/onboarding. Accounts are in "Pending Activation" state until verified.';
  doc.text(doc.splitTextToSize(actDesc, contentWidth), margin, y);

  y += 12;
  const steps = [
    { step: 'Step 1: Initiation', detail: 'Visit the TM-LMS Login page and click "Activate Account". Select your stakeholder category.' },
    { step: 'Step 2: Verification', detail: 'Enter your assigned User ID (or university roll) and the 6-digit activation code sent via SMS/Email.' },
    { step: 'Step 3: Password Setup', detail: 'Configure a confidential password (minimum 8 chars with uppercase, lowercase, number & symbol).' },
    { step: 'Step 4: Confirmation', detail: 'Account immediately transitions to "Active". A security confirmation notification is dispatched.' }
  ];

  steps.forEach((s, idx) => {
    const boxW = (contentWidth - 6) / 2;
    const col = idx % 2;
    const row = Math.floor(idx / 2);
    const bx = margin + col * (boxW + 6);
    const by = y + row * 24;

    doc.setFillColor(...BG_LIGHT);
    doc.setDrawColor(...BORDER);
    doc.roundedRect(bx, by, boxW, 20, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(...SECONDARY);
    doc.text(s.step, bx + 5, by + 6);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(...TEXT_DARK);
    doc.text(doc.splitTextToSize(s.detail, boxW - 10), bx + 5, by + 12);
  });

  y += 54;
  doc.setFillColor(254, 243, 199);
  doc.setDrawColor(...ACCENT);
  doc.roundedRect(margin, y, contentWidth, 24, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(146, 64, 14);
  doc.text('Important Security Note on Default Credentials:', margin + 6, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(180, 83, 9);
  const notePass = 'Tamralipta Mahavidyalaya never transmits default or permanent passwords via paper slips, plain emails, or public notice boards. All initial setups mandate personal password generation by the stakeholder.';
  doc.text(doc.splitTextToSize(notePass, contentWidth - 12), margin + 6, y + 12);

  // ==========================================
  // PAGE 4: PASSWORD RECOVERY & MFA
  // ==========================================
  doc.addPage();
  currentPage++;
  drawHeaderFooter('PASSWORD RECOVERY & MFA PROTOCOLS');

  y = 22;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(...PRIMARY);
  doc.text('3.0 Self-Service Password Recovery Protocols', margin, y);

  y += 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(...TEXT_DARK);
  const recIntro = 'If a stakeholder forgets their password, they can recover access through two independent channels. The system defends against account enumeration by always providing neutral feedback on user lookups.';
  doc.text(doc.splitTextToSize(recIntro, contentWidth), margin, y);

  y += 12;
  const colW = (contentWidth - 6) / 2;

  // Left Box: Email Recovery
  doc.setFillColor(...BG_LIGHT);
  doc.setDrawColor(...PRIMARY);
  doc.roundedRect(margin, y, colW, 85, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...PRIMARY);
  doc.text('Method A: Email Token Link', margin + 6, y + 9);

  const emailSteps = [
    '1. Click "Forgot Password" on login portal.',
    '2. Select "Institutional Email" option.',
    '3. Input registered User ID or college email.',
    '4. System generates cryptographically signed single-use reset token (15-minute expiry).',
    '5. Check your inbox and click the secure link.',
    '6. Enter your new strong password & confirm.',
    '7. Token is immediately revoked and invalidated.',
    '8. Security alert email dispatched confirming reset.'
  ];

  let eY = y + 17;
  emailSteps.forEach(st => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(...TEXT_DARK);
    doc.text(doc.splitTextToSize(st, colW - 12), margin + 6, eY);
    eY += 7.8;
  });

  // Right Box: Mobile OTP
  const rX = margin + colW + 6;
  doc.setFillColor(...BG_LIGHT);
  doc.setDrawColor(...SECONDARY);
  doc.roundedRect(rX, y, colW, 85, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...SECONDARY);
  doc.text('Method B: Mobile SMS OTP', rX + 6, y + 9);

  const mobileSteps = [
    '1. Click "Forgot Password" on login portal.',
    '2. Select "Mobile OTP" option.',
    '3. Input registered User ID or 10-digit mobile.',
    '4. System dispatches 6-digit numeric OTP with 5-minute validity period.',
    '5. Maximum of 3 attempts permitted before lockout.',
    '6. Enter OTP on screen to verify phone identity.',
    '7. Set new confidential password and confirm.',
    '8. Event logged to Audit Trail with IP & timestamp.'
  ];

  let mY = y + 17;
  mobileSteps.forEach(st => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(...TEXT_DARK);
    doc.text(doc.splitTextToSize(st, colW - 12), rX + 6, mY);
    mY += 7.8;
  });

  y += 94;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(...PRIMARY);
  doc.text('Forgot User ID Workflow', margin, y);

  y += 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(...TEXT_DARK);
  const idRetr = 'If a user forgets their institutional User ID, they can click "Forgot User ID?" on the login page. By supplying either their verified institutional email or registered mobile number, the system will match records and dispatch their designated User ID directly to their verified communication channel.';
  doc.text(doc.splitTextToSize(idRetr, contentWidth), margin, y);

  y += 20;
  // Account Lockout policies
  doc.setFillColor(254, 242, 242);
  doc.setDrawColor(239, 68, 68);
  doc.roundedRect(margin, y, contentWidth, 38, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(185, 28, 28);
  doc.text('Account Lockout & Brute-Force Safeguards', margin + 6, y + 8);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(153, 27, 27);
  const lockRules = [
    '• 5 Consecutive Failed Attempts: Triggers automatic account lock for 15 minutes to thwart automated dictionary attacks.',
    '• Automated Lockout Notification: Dispatched to the user\'s registered email specifying the timestamp and client IP.',
    '• Emergency Unlocking: Can be performed immediately by authorized Technical Support (TM-ITS) or Super Admin (TM-SADM).',
    '• Self-Unlock: Occurs automatically upon timer expiration without requiring administrative intervention.'
  ];

  let lockY = y + 15;
  lockRules.forEach(lr => {
    doc.text(lr, margin + 6, lockY);
    lockY += 5.2;
  });

  // ==========================================
  // PAGE 5: STUDENT USER MANUAL (TM-STD)
  // ==========================================
  doc.addPage();
  currentPage++;
  drawHeaderFooter('STUDENT USER GUIDE (TM-STD)');

  y = 22;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.setTextColor(...PRIMARY);
  doc.text('4.0 Student Operations Manual (TM-STD)', margin, y);

  y += 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(...TEXT_DARK);
  doc.text('Designated for undergraduate and postgraduate students enrolled at Tamralipta Mahavidyalaya.', margin, y);

  y += 8;
  const studentSections = [
    {
      title: '4.1 Accessing the Student Portal',
      content: 'Log in with your TM-STD-YYYY-XXXXX credential. Your dashboard displays today\'s schedule, upcoming assignment deadlines, real-time semester attendance percentage, and college notice board.'
    },
    {
      title: '4.2 Course Syllabus & Lecture Repository',
      content: 'Navigate to "My Courses". Each enrolled course features downloadable lecture slides, recommended e-textbooks, video lecture archives, and reference notes categorized by Unit/Module.'
    },
    {
      title: '4.3 Assignment Submissions & Plagiarism Check',
      content: 'Submit assignments before the designated cut-off date in PDF, DOCX, or ZIP formats. Once evaluated by the faculty, grades and detailed rubric feedback become instantly accessible.'
    },
    {
      title: '4.4 Real-Time Attendance Monitoring',
      content: 'UGC and Vidyasagar University mandate 75% minimum attendance for semester exam eligibility. The portal visually calculates your overall and course-wise percentage, warning you if your attendance dips below 75%.'
    },
    {
      title: '4.5 Online Quizzes & Continuous Internal Assessments (CIA)',
      content: 'Participate in scheduled objective assessments and term tests. The system enforces anti-tamper controls and auto-submits upon timer expiration. Instant scores and answer keys display upon publication.'
    },
    {
      title: '4.6 Semester Results & Digital Grade Cards',
      content: 'Access SGPA/CGPA breakdowns, credit point accumulation, and provisional grade cards. Submit grade re-verification requests directly to the Examination Cell through the portal.'
    }
  ];

  studentSections.forEach(sec => {
    doc.setFillColor(...BG_LIGHT);
    doc.setDrawColor(...BORDER);
    doc.roundedRect(margin, y, contentWidth, 23, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(...PRIMARY);
    doc.text(sec.title, margin + 5, y + 6);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...TEXT_DARK);
    doc.text(doc.splitTextToSize(sec.content, contentWidth - 10), margin + 5, y + 12);

    y += 26;
  });

  // ==========================================
  // PAGE 6: FACULTY OPERATIONS MANUAL (TM-FAC)
  // ==========================================
  doc.addPage();
  currentPage++;
  drawHeaderFooter('FACULTY OPERATIONS GUIDE (TM-FAC)');

  y = 22;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.setTextColor(...PRIMARY);
  doc.text('5.0 Faculty Operations Manual (TM-FAC)', margin, y);

  y += 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(...TEXT_DARK);
  doc.text('Designated for professors, associate professors, assistant professors, and guest lecturers.', margin, y);

  y += 8;
  const facultySections = [
    {
      title: '5.1 Class Schedule & Timetable Management',
      content: 'View assigned class routines, room allocations, and laboratory schedules. Faculty can mark rescheduled classes or request lecture swaps with departmental colleagues with one click.'
    },
    {
      title: '5.2 Digital Attendance Register',
      content: 'Mark daily lecture attendance student-by-student or through quick batch marking. Generates automated monthly attendance statements required for university examination submission.'
    },
    {
      title: '5.3 Courseware & Learning Asset Distribution',
      content: 'Upload syllabus progress notes, weekly assignments, reading links, and lecture slide decks. Group learning materials into pedagogical modules aligned with the CBCS/NEP syllabus structure.'
    },
    {
      title: '5.4 Assignment Evaluation & Grading Rubrics',
      content: 'Review digital student submissions online. Use in-app annotations, assign marks against structured rubrics, and provide qualitative feedback. Export evaluation spreadsheets for institutional records.'
    },
    {
      title: '5.5 Internal Assessment & Practical Marks Entry',
      content: 'Conduct continuous assessments, mid-semester exams, and viva-voce tests. Submit finalized internal marks directly to the Department Head with digital verification.'
    },
    {
      title: '5.6 Student Mentorship & Academic Warning Dispatch',
      content: 'Monitor assigned mentee batches. Send direct academic warning notifications to students (and registered parent contacts) whose attendance or performance falls below departmental thresholds.'
    }
  ];

  facultySections.forEach(sec => {
    doc.setFillColor(...BG_LIGHT);
    doc.setDrawColor(...BORDER);
    doc.roundedRect(margin, y, contentWidth, 23, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(...SECONDARY);
    doc.text(sec.title, margin + 5, y + 6);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...TEXT_DARK);
    doc.text(doc.splitTextToSize(sec.content, contentWidth - 10), margin + 5, y + 12);

    y += 26;
  });

  // ==========================================
  // PAGE 7: DEPARTMENT HEAD MANUAL (TM-HOD)
  // ==========================================
  doc.addPage();
  currentPage++;
  drawHeaderFooter('DEPARTMENT HEAD GUIDE (TM-HOD)');

  y = 22;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.setTextColor(...PRIMARY);
  doc.text('6.0 Department Head Operations Manual (TM-HOD)', margin, y);

  y += 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(...TEXT_DARK);
  doc.text('Designated for Heads of Academic Departments across Arts, Science, and Commerce streams.', margin, y);

  y += 8;
  const hodSections = [
    {
      title: '6.1 Departmental Workload & Course Allocation',
      content: 'Distribute theory and practical papers among department faculty according to UGC workload norms. Monitor weekly contact hours, tutorial batches, and lab instructor assignments.'
    },
    {
      title: '6.2 Syllabus Coverage Audit & Lesson Plans',
      content: 'Review real-time syllabus completion statistics submitted by departmental faculty. Identify curriculum bottlenecks and ensure syllabus completion ahead of semester final examinations.'
    },
    {
      title: '6.3 Class Swap & Faculty Leave Coverage Approvals',
      content: 'Review and approve intra-departmental class exchange requests and substitute arrangements when faculty members are on academic leave or official university duty.'
    },
    {
      title: '6.4 Departmental Attendance & Performance Oversight',
      content: 'Analyze department-wide student attendance analytics. Authorize condonation review lists for eligible medical cases prior to forwarding to the Principal and Academic Council.'
    },
    {
      title: '6.5 Internal Marks Moderation & University Submission',
      content: 'Moderate internal assessment marks submitted by faculty members to ensure grading consistency and compliance with university benchmarks prior to final locking.'
    },
    {
      title: '6.6 Departmental Notices & Circular Dispatch',
      content: 'Broadcast department-specific circulars regarding seminars, project submissions, practical exam rosters, and departmental meetings directly to faculty and student dashboards.'
    }
  ];

  hodSections.forEach(sec => {
    doc.setFillColor(...BG_LIGHT);
    doc.setDrawColor(...BORDER);
    doc.roundedRect(margin, y, contentWidth, 23, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(...PRIMARY);
    doc.text(sec.title, margin + 5, y + 6);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...TEXT_DARK);
    doc.text(doc.splitTextToSize(sec.content, contentWidth - 10), margin + 5, y + 12);

    y += 26;
  });

  // ==========================================
  // PAGE 8: PRINCIPAL & ADMIN MANUAL (TM-ADM)
  // ==========================================
  doc.addPage();
  currentPage++;
  drawHeaderFooter('PRINCIPAL & EXECUTIVE ADMIN GUIDE (TM-ADM)');

  y = 22;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.setTextColor(...PRIMARY);
  doc.text('7.0 Principal & Executive Admin Manual (TM-ADM)', margin, y);

  y += 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(...TEXT_DARK);
  doc.text('Designated for the Principal, Vice-Principal, Bursar, and Executive Academic Administrators.', margin, y);

  y += 8;
  const admSections = [
    {
      title: '7.1 Executive Institutional Analytics & KPI Overview',
      content: 'High-level dashboard visualizing aggregate enrollment numbers, daily campus attendance trends, department-wise syllabus progress, and faculty instructional compliance metrics.'
    },
    {
      title: '7.2 NAAC, NIRF & Vidyasagar University Compliance Reports',
      content: 'Generate institutional audit data packs (Criterion 1 & 2) with verified student-faculty ratios, mentor-mentee logs, continuous internal assessment records, and digital resource usage metrics.'
    },
    {
      title: '7.3 College-Wide Urgent Broadcasts & Gazetted Circulars',
      content: 'Publish authoritative college notices, holiday declarations, examination schedules, and regulatory circulars with read-receipt confirmations and priority banner alerts across all portals.'
    },
    {
      title: '7.4 Academic Calendar & Semester Milestone Governance',
      content: 'Establish the institutional academic calendar: semester commencement, mid-term evaluation windows, exam registration periods, and vacation schedules.'
    },
    {
      title: '7.5 Inter-Departmental Performance Comparisons',
      content: 'Benchmark academic departments against historical pass percentages, research output, library usage, and digital teaching material adoption rates.'
    },
    {
      title: '7.6 Grievance Redressal & Disciplinary Oversight',
      content: 'Access escalated academic complaints, student appeals, and disciplinary committee dockets with complete timeline audit logs and resolution tracking.'
    }
  ];

  admSections.forEach(sec => {
    doc.setFillColor(...BG_LIGHT);
    doc.setDrawColor(...BORDER);
    doc.roundedRect(margin, y, contentWidth, 23, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(...SECONDARY);
    doc.text(sec.title, margin + 5, y + 6);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...TEXT_DARK);
    doc.text(doc.splitTextToSize(sec.content, contentWidth - 10), margin + 5, y + 12);

    y += 26;
  });

  // ==========================================
  // PAGE 9: SUPER ADMIN MANUAL (TM-SADM)
  // ==========================================
  doc.addPage();
  currentPage++;
  drawHeaderFooter('SUPER ADMIN & SECURITY POLICY (TM-SADM)');

  y = 22;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.setTextColor(...PRIMARY);
  doc.text('8.0 Super Administrator Manual (TM-SADM)', margin, y);

  y += 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(...TEXT_DARK);
  doc.text('Designated for Senior IT Systems Administrators managing institutional access policies and core databases.', margin, y);

  y += 8;
  const sadmSections = [
    {
      title: '8.1 Institutional User ID Generation Policy Engine',
      content: 'Configure prefix rules for all stakeholder tiers (e.g. TM-STD, TM-FAC). The engine guarantees deterministic, non-reusable IDs, sequential padding, and admission year tokens.'
    },
    {
      title: '8.2 Single User Creation & Automated Credentials',
      content: 'Create individual accounts with instant schema verification. System assigns sequential User ID, creates pending activation token, and notifies stakeholder.'
    },
    {
      title: '8.3 Bulk User CSV Provisioning & Validation',
      content: 'Upload batch student/staff CSV records. Built-in validation checks email syntax, mobile number validity, duplicate roll numbers, and assigns bulk sequential IDs with zero collisions.'
    },
    {
      title: '8.4 Security Policy Configuration & Lockout Rules',
      content: 'Set global security parameters: maximum failed password attempts before lockout (default: 5), lockout duration (default: 15 min), session timeout TTL, and password complexity rules.'
    },
    {
      title: '8.5 Global User Directory & Instant Account Controls',
      content: 'Filter users across all 6 stakeholder categories. Perform instant account status updates: Activate, Suspend, Deactivate, or Force Password Reset across the institution.'
    },
    {
      title: '8.6 Immutable Security Audit Log Inspection',
      content: 'Inspect comprehensive audit logs capturing all login events, IP addresses, failed password triggers, account locks, unlock operations, and policy modifications.'
    }
  ];

  sadmSections.forEach(sec => {
    doc.setFillColor(...BG_LIGHT);
    doc.setDrawColor(...BORDER);
    doc.roundedRect(margin, y, contentWidth, 23, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(...PRIMARY);
    doc.text(sec.title, margin + 5, y + 6);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...TEXT_DARK);
    doc.text(doc.splitTextToSize(sec.content, contentWidth - 10), margin + 5, y + 12);

    y += 26;
  });

  // ==========================================
  // PAGE 10: TECH SUPPORT, DPDP ACT & HELPDESK
  // ==========================================
  doc.addPage();
  currentPage++;
  drawHeaderFooter('TECHNICAL SUPPORT & DPDP ACT COMPLIANCE');

  y = 22;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(...PRIMARY);
  doc.text('9.0 Technical Support & Helpdesk Protocols (TM-ITS)', margin, y);

  y += 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...TEXT_DARK);
  const itsDesc = [
    '• Identity Verification Protocol: Verify stakeholder identity through college ID card or registered mobile before performing manual unlocks.',
    '• Account Unlocking: Access the Security Audit Console to unlock accounts locked due to repeated incorrect password entries.',
    '• OTP Diagnostic Assistance: Inspect simulation logs and gateway delivery logs if a user experiences network delays receiving SMS OTPs.',
    '• Browser & Device Troubleshooting: Ensure users use modern evergreen browsers (Chrome 120+, Firefox 120+, Safari 17+, Edge 120+).'
  ];
  itsDesc.forEach(d => {
    doc.text(d, margin, y);
    y += 5.2;
  });

  y += 4;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(...PRIMARY);
  doc.text('10.0 Data Privacy (DPDP Act, 2023) & Governance', margin, y);

  y += 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  const dpdpPoints = [
    '• Purpose Limitation: Personal data (mobile, email, roll) is processed exclusively for academic operations, attendance, and evaluation.',
    '• Consent Architecture: Stakeholders provide explicit institutional consent during initial account activation.',
    '• Zero Plaintext Password Policy: Passwords are encrypted using one-way cryptographic algorithms; administrators cannot view plain passwords.',
    '• Audit Trail Retention: All authentication actions and security events are archived for statutory compliance and forensic review.'
  ];
  dpdpPoints.forEach(p => {
    doc.text(p, margin, y);
    y += 5.2;
  });

  y += 8;
  // Institutional Contact Box
  doc.setFillColor(...PRIMARY);
  doc.roundedRect(margin, y, contentWidth, 42, 2, 2, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(255, 255, 255);
  doc.text('TAMRALIPTA MAHAVIDYALAYA — IT HELPDESK & SUPPORT', margin + 6, y + 8);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(226, 232, 240);
  doc.text('Campus Address: Tamluk, Purba Medinipur, West Bengal, Pin - 721636', margin + 6, y + 16);
  doc.text('Email Inquiries: itsupport@tmv.ac.in | principal@tmv.ac.in', margin + 6, y + 22);
  doc.text('Helpdesk Helpline: +91 3228 266054 / +91 94340 12345 (Office Hours: 10:00 AM - 5:00 PM IST)', margin + 6, y + 28);
  doc.text('Official Portal: https://tmv.ac.in | LMS Web App: https://tmv-dusky.vercel.app', margin + 6, y + 34);

  return doc;
};

/**
 * Downloads the complete 10-page official institutional manual PDF directly in the browser.
 * This utilizes client-side jsPDF blob generation, guaranteeing that it NEVER makes an external
 * network request that could return an HTML fallback or "Failed to load PDF document" error.
 */
export const downloadStakeholderManualPDF = (currentUser?: User | null) => {
  try {
    const doc = buildCompleteStakeholderManualPDF(currentUser);
    doc.save('TM-LMS-Stakeholder-User-Manual.pdf');
  } catch (err) {
    console.error('Client-side PDF generation error, falling back to static URL:', err);
    const link = document.createElement('a');
    link.href = '/tm-lms-stakeholder-manual.pdf';
    link.download = 'TM-LMS-Stakeholder-User-Manual.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

/**
 * Opens the 10-page official PDF directly in a new browser tab using an in-memory Blob URL.
 * Guarantees that the browser's native PDF reader receives binary PDF content (application/pdf),
 * completely eliminating "Failed to load PDF document" caused by server HTML rewrites.
 */
export const openStakeholderManualInNewTab = (currentUser?: User | null) => {
  try {
    const doc = buildCompleteStakeholderManualPDF(currentUser);
    const blob = doc.output('blob');
    const blobUrl = URL.createObjectURL(blob);
    window.open(blobUrl, '_blank');
  } catch (err) {
    console.error('Error opening PDF blob:', err);
    window.open('/tm-lms-stakeholder-manual.pdf', '_blank');
  }
};

/**
 * Generates a tailored 1-page quick reference summary for the specific role.
 */
export const generateDynamicRoleSummaryPDF = (role: string, user?: User | null) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 16;
  const contentWidth = pageWidth - margin * 2;

  // Header Banner
  doc.setFillColor(15, 76, 129); // #0F4C81
  doc.rect(0, 0, pageWidth, 38, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('TAMRALIPTA MAHAVIDYALAYA (TM-LMS)', pageWidth / 2, 16, { align: 'center' });

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Quick Reference Guide & Stakeholder Operating Manual', pageWidth / 2, 24, { align: 'center' });
  doc.text('Tamluk, Purba Medinipur, WB · NAAC Grade "A" · Affiliated to Vidyasagar University', pageWidth / 2, 30, { align: 'center' });

  let y = 48;

  // User details box if available
  if (user) {
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(203, 213, 225);
    doc.roundedRect(margin, y, contentWidth, 22, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(15, 76, 129);
    doc.text(`Issued To: ${user.name}`, margin + 5, y + 7);
    doc.text(`User ID: ${user.id}`, margin + 5, y + 14);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    doc.text(`Designation: ${user.role.toUpperCase()}`, margin + 80, y + 7);
    doc.text(`Department: ${user.departmentId || 'Academic Division'}`, margin + 80, y + 14);

    y += 28;
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(15, 76, 129);
  doc.text(`Role Operations Guide: ${role.toUpperCase()}`, margin, y);

  y += 7;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85);
  doc.text('This tailored operational brief provides essential workflows, security rules, and daily procedures.', margin, y);

  y += 10;
  const guidelines = [
    { title: '1. Institutional Authentication', desc: 'Always sign in using your designated Tamralipta Mahavidyalaya User ID and secret password. Never share passwords.' },
    { title: '2. Session Governance', desc: 'Sessions automatically expire after period of inactivity. Always use "Sign Out" when on public lab workstations.' },
    { title: '3. Password Recovery', desc: 'In case of forgotten credentials, use the registered Mobile SMS OTP or Institutional Email reset workflow.' },
    { title: '4. Academic Records & Compliance', desc: 'All marks entries, attendance records, and submissions carry digital timestamps for statutory compliance.' },
    { title: '5. Helpdesk Support', desc: 'Contact IT Cell at itsupport@tmv.ac.in or phone +91 (03228) 266054 for identity re-verification.' }
  ];

  guidelines.forEach(g => {
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(margin, y, contentWidth, 18, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(13, 148, 136); // Teal
    doc.text(g.title, margin + 4, y + 6);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(51, 65, 85);
    doc.text(doc.splitTextToSize(g.desc, contentWidth - 8), margin + 4, y + 12);

    y += 21;
  });

  // Footer note
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text('Tamralipta Mahavidyalaya LMS · Compliant with DPDP Act, 2023 · Generated from Web Portal', pageWidth / 2, 280, { align: 'center' });

  doc.save(`TM-LMS-${role.toUpperCase()}-Manual-Brief.pdf`);
};
