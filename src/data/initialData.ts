import {
  User,
  AcademicSession,
  Department,
  Programme,
  Course,
  LearningResource,
  Assignment,
  AssignmentSubmission,
  Assessment,
  AssessmentAttempt,
  GradeItem,
  AttendanceRecord,
  Announcement,
  DiscussionThread,
  SupportTicket,
  InstitutionalSettings,
  CalendarEvent,
  AuditLog,
  InstitutionalDocument,
  ApprovalRequest,
  ClassSwapRequest
} from '../types';

export const initialSettings: InstitutionalSettings = {
  collegeName: 'Tamralipta Mahavidyalaya',
  collegeBengaliName: 'তাম্রলিপ্ত মহাবিদ্যালয়',
  tagline: 'Learn, Connect, and Grow Together',
  location: 'Tamluk, Purba Medinipur, West Bengal - 721636',
  address: 'Abashbari, P.O. - Tamluk, Dist. - Purba Medinipur, West Bengal, India',
  contactEmail: 'admin@tamraliptamahavidyalaya.org',
  contactPhone: '+91 (03228) 266054',
  establishedYear: 1948,
  affiliation: 'Affiliated to Vidyasagar University, Paschim Medinipur',
  naacGrade: 'Grade A Accredited',
  currentSessionId: 'session-2025-2026',
  gradingScale: [
    { grade: 'O', minPercent: 90, gpa: 10.0, description: 'Outstanding' },
    { grade: 'A+', minPercent: 80, gpa: 9.0, description: 'Excellent' },
    { grade: 'A', minPercent: 70, gpa: 8.0, description: 'Very Good' },
    { grade: 'B+', minPercent: 60, gpa: 7.0, description: 'Good' },
    { grade: 'B', minPercent: 55, gpa: 6.0, description: 'Above Average' },
    { grade: 'C', minPercent: 50, gpa: 5.0, description: 'Average' },
    { grade: 'P', minPercent: 40, gpa: 4.0, description: 'Pass' },
    { grade: 'F', minPercent: 0, gpa: 0.0, description: 'Fail / Arrear' }
  ]
};

export const initialSessions: AcademicSession[] = [
  {
    id: 'session-2025-2026',
    name: '2025-2026 (Odd Semester)',
    year: '2025-2026',
    status: 'active',
    startDate: '2025-07-01',
    endDate: '2025-12-31',
    isCurrent: true
  },
  {
    id: 'session-2024-2025',
    name: '2024-2025 (Full Academic Year)',
    year: '2024-2025',
    status: 'archived',
    startDate: '2024-07-01',
    endDate: '2025-06-30',
    isCurrent: false
  }
];

export const initialDepartments: Department[] = [
  {
    id: 'dept-cs',
    code: 'CS',
    name: 'Department of Computer Science',
    nameBengali: 'কম্পিউটার সায়েন্স বিভাগ',
    headFacultyId: 'user-hod-cs',
    headFacultyName: 'Dr. Anupam Mukherjee',
    description: 'Offering undergraduate education in algorithms, systems, software engineering, and artificial intelligence.',
    totalStudents: 145,
    totalFaculty: 8
  },
  {
    id: 'dept-bng',
    code: 'BNG',
    name: 'Department of Bengali',
    nameBengali: 'বাংলা ভাষা ও সাহিত্য বিভাগ',
    headFacultyId: 'user-hod-bng',
    headFacultyName: 'Dr. Subhashree Sen',
    description: 'Specializing in classical, medieval, and modern Bengali literature, linguistics, and cultural studies.',
    totalStudents: 310,
    totalFaculty: 11
  },
  {
    id: 'dept-math',
    code: 'MATH',
    name: 'Department of Mathematics',
    nameBengali: 'গণিত বিভাগ',
    headFacultyId: 'user-hod-math',
    headFacultyName: 'Dr. Ramesh Chandra Pramanik',
    description: 'Rigorous training in pure mathematics, applied mathematics, computational analysis, and statistics.',
    totalStudents: 180,
    totalFaculty: 9
  },
  {
    id: 'dept-phy',
    code: 'PHY',
    name: 'Department of Physics',
    nameBengali: 'পদার্থবিদ্যা বিভাগ',
    headFacultyId: 'user-hod-phy',
    headFacultyName: 'Dr. Kalyan Kumar Mondal',
    description: 'Advanced experimental and theoretical physics, solid-state physics, and modern electronics.',
    totalStudents: 160,
    totalFaculty: 8
  },
  {
    id: 'dept-eng',
    code: 'ENG',
    name: 'Department of English',
    nameBengali: 'ইংরেজি বিভাগ',
    headFacultyId: 'user-hod-eng',
    headFacultyName: 'Prof. Debabrata Roy',
    description: 'British, American, postcolonial literature, academic writing, and critical theory.',
    totalStudents: 220,
    totalFaculty: 7
  },
  {
    id: 'dept-hist',
    code: 'HIST',
    name: 'Department of History',
    nameBengali: 'ইতিহাস বিভাগ',
    headFacultyId: 'user-hod-hist',
    headFacultyName: 'Dr. Tapas Kumar Sau',
    description: 'Ancient Indian history with special focus on ancient Tamralipta port heritage, modern Indian national movement.',
    totalStudents: 260,
    totalFaculty: 8
  }
];

export const initialProgrammes: Programme[] = [
  {
    id: 'prog-bsc-cs',
    code: 'BSC-CS-H',
    name: 'B.Sc. (Honours) in Computer Science',
    departmentId: 'dept-cs',
    degreeType: 'UG',
    durationYears: 3,
    totalSemesters: 6
  },
  {
    id: 'prog-ba-bng',
    code: 'BA-BNG-H',
    name: 'B.A. (Honours) in Bengali',
    departmentId: 'dept-bng',
    degreeType: 'UG',
    durationYears: 3,
    totalSemesters: 6
  },
  {
    id: 'prog-bsc-math',
    code: 'BSC-MATH-H',
    name: 'B.Sc. (Honours) in Mathematics',
    departmentId: 'dept-math',
    degreeType: 'UG',
    durationYears: 3,
    totalSemesters: 6
  }
];

export const initialUsers: User[] = [
  {
    id: 'user-super-admin',
    institutionUserId: 'TM-SADM-0001',
    name: 'Dr. Sisir Kumar Bhowmik',
    nameBengali: 'ডঃ শিশির কুমার ভৌমিক',
    email: 'admin@tamralipta.ac.in',
    phone: '+91 94340 12345',
    passwordHash: '8b429188e730872242a7b8c9d0e1f2',
    role: 'super_admin',
    departmentId: 'dept-cs',
    designation: 'System Administrator & Professor',
    employeeId: 'TM-ADM-001',
    isActive: true,
    accountStatus: 'active',
    failedLoginAttempts: 0,
    emailVerified: true,
    mobileVerified: true,
    lastLogin: '2026-09-29 10:15 AM'
  },
  {
    id: 'user-principal',
    institutionUserId: 'TM-ADM-0001',
    name: 'Prof. (Dr.) Pranab Kumar Mishra',
    nameBengali: 'অধ্যাপক (ডঃ) প্রণব কুমার মিশ্র',
    email: 'principal@tamralipta.ac.in',
    phone: '+91 94341 67890',
    passwordHash: '8b429188e730872242a7b8c9d0e1f2',
    role: 'principal',
    departmentId: 'dept-phy',
    designation: 'Principal, Tamralipta Mahavidyalaya',
    employeeId: 'TM-PRN-001',
    isActive: true,
    accountStatus: 'active',
    failedLoginAttempts: 0,
    emailVerified: true,
    mobileVerified: true,
    lastLogin: '2026-09-29 09:30 AM'
  },
  {
    id: 'user-hod-cs',
    institutionUserId: 'TM-HOD-0014',
    name: 'Dr. Anupam Mukherjee',
    nameBengali: 'ডঃ অনুপম মুখোপাধ্যায়',
    email: 'hod.cs@tamralipta.ac.in',
    phone: '+91 98302 34567',
    passwordHash: '8b429188e730872242a7b8c9d0e1f2',
    role: 'dept_head',
    departmentId: 'dept-cs',
    designation: 'Associate Professor & Head of Department',
    employeeId: 'TM-FAC-014',
    isActive: true,
    accountStatus: 'active',
    failedLoginAttempts: 0,
    emailVerified: true,
    mobileVerified: true,
    assignedCourseIds: ['course-cs-301'],
    lastLogin: '2026-09-29 11:00 AM'
  },
  {
    id: 'user-faculty-cs',
    institutionUserId: 'TM-FAC-0028',
    name: 'Prof. Tanmoy Banerjee',
    nameBengali: 'অধ্যাপক তন্ময় বন্দ্যোপাধ্যায়',
    email: 't.banerjee@tamralipta.ac.in',
    phone: '+91 97321 89012',
    passwordHash: '8b429188e730872242a7b8c9d0e1f2',
    role: 'faculty',
    departmentId: 'dept-cs',
    designation: 'Assistant Professor, Computer Science',
    employeeId: 'TM-FAC-028',
    isActive: true,
    accountStatus: 'active',
    failedLoginAttempts: 0,
    emailVerified: true,
    mobileVerified: true,
    assignedCourseIds: ['course-cs-301', 'course-cs-302'],
    lastLogin: '2026-09-29 11:20 AM'
  },
  {
    id: 'user-student-souvik',
    institutionUserId: 'TM-STD-2026-00042',
    name: 'Souvik Jana',
    nameBengali: 'সৌভিক জানা',
    email: 's.jana@student.tamralipta.ac.in',
    phone: '+91 89102 45678',
    passwordHash: '8b429188e730872242a7b8c9d0e1f2',
    role: 'student',
    departmentId: 'dept-cs',
    programmeId: 'prog-bsc-cs',
    semester: 3,
    rollNumber: 'BSC/CS/2024/042',
    registrationNumber: 'VU-TM-2024-001982',
    isActive: true,
    accountStatus: 'active',
    failedLoginAttempts: 0,
    emailVerified: true,
    mobileVerified: true,
    enrolledCourseIds: ['course-cs-301', 'course-cs-302', 'course-math-301'],
    lastLogin: '2026-09-29 11:35 AM'
  },
  {
    id: 'user-tech-support',
    institutionUserId: 'TM-ITS-0003',
    name: 'Biplab Maity',
    nameBengali: 'বিপ্লব মাইতি',
    email: 'support@tamralipta.ac.in',
    phone: '+91 94745 67891',
    passwordHash: '8b429188e730872242a7b8c9d0e1f2',
    role: 'tech_support',
    departmentId: 'dept-cs',
    designation: 'IT Systems & Network Administrator',
    employeeId: 'TM-TECH-003',
    isActive: true,
    accountStatus: 'active',
    failedLoginAttempts: 0,
    emailVerified: true,
    mobileVerified: true,
    lastLogin: '2026-09-29 08:45 AM'
  }
];

export const initialCourses: Course[] = [
  {
    id: 'course-cs-301',
    code: 'CMSA-CC-301',
    title: 'Data Structures & Algorithms',
    titleBengali: 'ডেটা স্ট্রাকচার ও অ্যালগরিদম',
    departmentId: 'dept-cs',
    programmeId: 'prog-bsc-cs',
    semester: 3,
    sessionId: 'session-2025-2026',
    facultyId: 'user-faculty-cs',
    facultyName: 'Prof. Tanmoy Banerjee',
    description: 'Comprehensive study of linear and non-linear data structures, asymptotic notation, sorting, searching, trees, and graphs with C/C++ implementations.',
    learningObjectives: [
      'Master time and space complexity using Big-O, Theta, and Omega notations.',
      'Implement Stacks, Queues, Linked Lists, Binary Search Trees, and AVL Trees.',
      'Analyze and formulate Graph algorithms including BFS, DFS, Dijkstra, and Kruskal.',
      'Apply dynamic programming paradigms to real-world computational bottlenecks.'
    ],
    syllabusSummary: 'Unit 1: Stacks, Queues, and Linked Lists. Unit 2: Non-linear Structures - Trees and Binary Search Trees. Unit 3: Graph Representations and Traversals. Unit 4: Sorting, Searching, and Hashing.',
    credits: 6,
    totalEnrolled: 42,
    status: 'published',
    units: [
      {
        id: 'u1',
        title: 'Unit 1: Linear Data Structures',
        order: 1,
        topics: ['Abstract Data Types', 'Singly & Doubly Linked Lists', 'Stack Implementation & Infix-to-Postfix', 'Circular Queues']
      },
      {
        id: 'u2',
        title: 'Unit 2: Trees and Balanced Hierarchies',
        order: 2,
        topics: ['Binary Trees and Traversals', 'Binary Search Tree Operations', 'AVL Tree Rotations', 'Heap Structures']
      },
      {
        id: 'u3',
        title: 'Unit 3: Graph Algorithms',
        order: 3,
        topics: ['Adjacency Matrix & Lists', 'Breadth-First and Depth-First Search', 'Minimum Spanning Trees', 'Shortest Paths (Dijkstra)']
      },
      {
        id: 'u4',
        title: 'Unit 4: Sorting, Searching & Hashing',
        order: 4,
        topics: ['Quick Sort & Merge Sort', 'Collision Resolution & Hash Functions', 'Time Complexity Lower Bounds']
      }
    ]
  },
  {
    id: 'course-cs-302',
    code: 'CMSA-CC-302',
    title: 'Operating Systems & Linux Architecture',
    titleBengali: 'অপারেটিং সিস্টেম ও লিনাক্স আর্কিটেকচার',
    departmentId: 'dept-cs',
    programmeId: 'prog-bsc-cs',
    semester: 3,
    sessionId: 'session-2025-2026',
    facultyId: 'user-faculty-cs',
    facultyName: 'Prof. Tanmoy Banerjee',
    description: 'Principles of modern computer operating systems including process scheduling, synchronization, deadlocks, memory management, and POSIX shell scripting.',
    learningObjectives: [
      'Understand kernel architecture and system call mechanics.',
      'Examine CPU scheduling algorithms and evaluate turnaround vs waiting time.',
      'Solve synchronization problems with semaphores and mutex locks.',
      'Configure virtual memory, paging, and page replacement algorithms.'
    ],
    syllabusSummary: 'Process management, concurrency, deadlocks, virtual memory management, file system implementation, Linux administration.',
    credits: 6,
    totalEnrolled: 42,
    status: 'published',
    units: [
      {
        id: 'u1',
        title: 'Unit 1: Process and Thread Management',
        order: 1,
        topics: ['Process States & PCB', 'Process Scheduling: FCFS, SJF, Round Robin', 'Multithreading Models']
      },
      {
        id: 'u2',
        title: 'Unit 2: Concurrency & Deadlocks',
        order: 2,
        topics: ['Critical Section Problem', 'Semaphores & Mutexes', 'Banker Algorithm for Deadlock Avoidance']
      },
      {
        id: 'u3',
        title: 'Unit 3: Memory Management',
        order: 3,
        topics: ['Logical vs Physical Address Space', 'Paging & Segmentation', 'Page Replacement Policies (FIFO, LRU)']
      }
    ]
  },
  {
    id: 'course-math-301',
    code: 'MATH-GE-301',
    title: 'Numerical Methods and Statistics',
    titleBengali: 'নিউমেরিক্যাল মেথডস ও স্ট্যাটিস্টিকস',
    departmentId: 'dept-math',
    programmeId: 'prog-bsc-math',
    semester: 3,
    sessionId: 'session-2025-2026',
    facultyId: 'user-hod-math',
    facultyName: 'Dr. Ramesh Chandra Pramanik',
    description: 'Numerical approximations, interpolation, numerical integration, differential equations, and probability distributions for computer science students.',
    learningObjectives: [
      'Estimate errors in computational algorithms.',
      'Apply Newton-Raphson, Bisection, and Regula-Falsi methods.',
      'Calculate numerical integrals via Trapezoidal and Simpson rules.'
    ],
    syllabusSummary: 'Errors and floating-point arithmetic, Root finding, Interpolation (Newton, Lagrange), Numerical calculus, Curve fitting.',
    credits: 6,
    totalEnrolled: 68,
    status: 'published',
    units: [
      {
        id: 'u1',
        title: 'Unit 1: Errors and Non-linear Equations',
        order: 1,
        topics: ['Truncation and Round-off Errors', 'Bisection Method', 'Newton-Raphson Formula']
      },
      {
        id: 'u2',
        title: 'Unit 2: Interpolation and Approximation',
        order: 2,
        topics: ['Newton Forward & Backward Differences', 'Lagrange Interpolation Polynomials']
      }
    ]
  },
  {
    id: 'course-bng-301',
    code: 'BNGA-CC-301',
    title: 'Medieval Bengali Literature & Port Culture',
    titleBengali: 'মধ্যযুগীয় বাংলা সাহিত্য ও তাম্রলিপ্তের সংস্কৃতি',
    departmentId: 'dept-bng',
    programmeId: 'prog-ba-bng',
    semester: 3,
    sessionId: 'session-2025-2026',
    facultyId: 'user-hod-bng',
    facultyName: 'Dr. Subhashree Sen',
    description: 'Charyapada, Mangalkavya traditions, Chaitanya literature, and the historical literary accounts of ancient Tamralipta as a premier trade port.',
    learningObjectives: [
      'Analyze socio-cultural evolution of Bengal across 12th to 18th centuries.',
      'Examine the representation of merchants and maritime trade in Chandimangal.',
      'Critique medieval linguistic shifts from Old Bengali to Middle Bengali.'
    ],
    syllabusSummary: 'চর্যাপদ ও আদি মধ্যযুগ, চৈতন্য জীবনীকাব্য, মঙ্গলকাব্য ও কবিকঙ্কণ মুকুন্দরাম চক্রবর্তী, তাম্রলিপ্তের সামুদ্রিক বাণিজ্যের সাহিত্যিক প্রতিফলন।',
    credits: 6,
    totalEnrolled: 55,
    status: 'published',
    units: [
      {
        id: 'u1',
        title: 'একক ১: আদি মধ্যযুগ ও বৈষ্ণব পদাবলী',
        order: 1,
        topics: ['চর্যাপদের সমাজচিত্র', 'শ্রীকৃষ্ণকীর্তন কাব্য', 'বিদ্যাপতি ও চণ্ডীদাস']
      },
      {
        id: 'u2',
        title: 'একক ২: মঙ্গলকাব্য ও তাম্রলিপ্তের বণিক ঐতিহ্য',
        order: 2,
        topics: ['চণ্ডীমঙ্গল কাব্যের বণিক খণ্ড', 'তাম্রলিপ্ত (তমলুক) বন্দরের ঐতিহাসিক বিবরণ']
      }
    ]
  }
];

export const initialResources: LearningResource[] = [
  {
    id: 'res-101',
    title: 'Lecture 03: AVL Trees & Self-Balancing Operations',
    titleBengali: 'লেকচার ০৩: এভিএল ট্রি ও সেলফ-ব্যালেন্সিং পদ্ধতি',
    courseId: 'course-cs-301',
    courseCode: 'CMSA-CC-301',
    departmentId: 'dept-cs',
    unitId: 'u2',
    category: 'course',
    fileType: 'pdf',
    fileSize: '2.4 MB',
    url: '/documents/cs301_unit2_avl_trees.pdf',
    uploadedBy: 'user-faculty-cs',
    uploadedByName: 'Prof. Tanmoy Banerjee',
    uploadedAt: '2026-09-24',
    downloadCount: 38,
    description: 'Complete slide deck with step-by-step single and double rotations diagrams and C++ implementation snippets.',
    isPublic: true
  },
  {
    id: 'res-102',
    title: 'Lab Manual: Data Structures Laboratory Exercises 2025-26',
    titleBengali: 'ল্যাব ম্যানুয়াল: ডেটা স্ট্রাকচার ল্যাবরেটরি নির্দেশিকা',
    courseId: 'course-cs-301',
    courseCode: 'CMSA-CC-301',
    departmentId: 'dept-cs',
    category: 'course',
    fileType: 'pdf',
    fileSize: '4.8 MB',
    url: '/documents/cs301_lab_manual_v3.pdf',
    uploadedBy: 'user-faculty-cs',
    uploadedByName: 'Prof. Tanmoy Banerjee',
    uploadedAt: '2026-09-18',
    downloadCount: 42,
    description: 'Vidyasagar University prescribed syllabus lab problem set for C Programming & Algorithms.',
    isPublic: true
  },
  {
    id: 'res-103',
    title: 'Linux Kernel Scheduling & System Calls Primer',
    titleBengali: 'লিনাক্স কার্নেল শিডিউলিং ও সিস্টেম কল সহায়িকা',
    courseId: 'course-cs-302',
    courseCode: 'CMSA-CC-302',
    departmentId: 'dept-cs',
    unitId: 'u1',
    category: 'course',
    fileType: 'pdf',
    fileSize: '1.9 MB',
    url: '/documents/cs302_linux_scheduling.pdf',
    uploadedBy: 'user-faculty-cs',
    uploadedByName: 'Prof. Tanmoy Banerjee',
    uploadedAt: '2026-09-20',
    downloadCount: 35,
    description: 'In-depth notes on Completely Fair Scheduler (CFS) and fork(), exec(), wait() process life cycle.',
    isPublic: true
  },
  {
    id: 'res-104',
    title: 'University Regulations for Choice Based Credit System (CBCS)',
    titleBengali: 'বিদ্যাসাগর বিশ্ববিদ্যালয় CBCS নিয়মাবলী ও পরীক্ষা বিধিমালা',
    departmentId: 'dept-cs',
    category: 'general',
    fileType: 'pdf',
    fileSize: '1.2 MB',
    url: '/documents/vu_cbcs_regulations_ug.pdf',
    uploadedBy: 'user-super-admin',
    uploadedByName: 'Dr. Sisir Kumar Bhowmik',
    uploadedAt: '2026-08-15',
    downloadCount: 154,
    description: 'Official Vidyasagar University academic calendar, evaluation criteria, and SGPA/CGPA computation formulas.',
    isPublic: true
  },
  {
    id: 'res-105',
    title: 'Ancient Tamralipta Port and Trade Routes in Bengal History',
    titleBengali: 'প্রাচীন তাম্রলিপ্ত বন্দর ও বাংলার বাণিজ্য পথসমূহ',
    departmentId: 'dept-bng',
    category: 'reference',
    fileType: 'pdf',
    fileSize: '3.6 MB',
    url: '/documents/tamralipta_port_heritage.pdf',
    uploadedBy: 'user-hod-bng',
    uploadedByName: 'Dr. Subhashree Sen',
    uploadedAt: '2026-09-10',
    downloadCount: 88,
    description: 'Archaeological and literary survey of Tamluk port connections with Southeast Asia and Ceylon.',
    isPublic: true
  }
];

export const initialAssignments: Assignment[] = [
  {
    id: 'asg-301-01',
    courseId: 'course-cs-301',
    courseCode: 'CMSA-CC-301',
    title: 'Assignment 1: Implementation of AVL Tree Balance & Deletion',
    instructions: 'Write a well-commented C/C++ program to construct an AVL Tree, implement insertion with height calculation, perform Left-Left and Left-Right rotations, and trace the tree state after deleting specified keys. Submit source code and sample output screenshot as a single PDF.',
    referenceFileName: 'AVL_Tree_Specifications.pdf',
    referenceFileUrl: '/documents/AVL_Tree_Specifications.pdf',
    maxMarks: 25,
    openDate: '2026-09-20',
    dueDate: '2026-10-05',
    allowLate: true,
    submissionFormat: 'pdf',
    status: 'published',
    createdByName: 'Prof. Tanmoy Banerjee'
  },
  {
    id: 'asg-301-02',
    courseId: 'course-cs-301',
    courseCode: 'CMSA-CC-301',
    title: 'Assignment 2: Graph Shortest Path & Topological Sorting',
    instructions: 'Given a directed acyclic graph representing university course prerequisites, write an algorithm to find the topological order and calculate the shortest paths using Dijkstra algorithm. Analyze worst-case complexities.',
    maxMarks: 20,
    openDate: '2026-09-27',
    dueDate: '2026-10-12',
    allowLate: false,
    submissionFormat: 'pdf',
    status: 'published',
    createdByName: 'Prof. Tanmoy Banerjee'
  },
  {
    id: 'asg-302-01',
    courseId: 'course-cs-302',
    courseCode: 'CMSA-CC-302',
    title: 'Practical Project: POSIX Multithreading & Producer-Consumer Solution',
    instructions: 'Implement the Producer-Consumer bounded buffer problem in C using POSIX pthreads and semaphores. Ensure no race conditions or deadlocks occur under high producer velocity.',
    maxMarks: 30,
    openDate: '2026-09-22',
    dueDate: '2026-10-08',
    allowLate: true,
    submissionFormat: 'pdf',
    status: 'published',
    createdByName: 'Prof. Tanmoy Banerjee'
  }
];

export const initialSubmissions: AssignmentSubmission[] = [
  {
    id: 'sub-001',
    assignmentId: 'asg-301-01',
    courseId: 'course-cs-301',
    studentId: 'user-student-souvik',
    studentName: 'Souvik Jana',
    studentRoll: 'BSC/CS/2024/042',
    submittedAt: '2026-09-28 04:30 PM',
    fileName: 'Souvik_Jana_AVL_Tree_Assignment1.pdf',
    fileUrl: '/uploads/Souvik_Jana_AVL_Tree_Assignment1.pdf',
    textContent: 'Completed all 4 test cases with AVL rotation tracing and C++ code listing attached.',
    status: 'evaluated',
    marksObtained: 24,
    feedback: 'Excellent work Souvik! The deletion rotation cases are handled cleanly and the complexity analysis is thorough.',
    evaluatedBy: 'Prof. Tanmoy Banerjee',
    evaluatedAt: '2026-09-29 09:15 AM'
  }
];

export const initialAssessments: Assessment[] = [
  {
    id: 'quiz-cs-301-mid',
    courseId: 'course-cs-301',
    courseCode: 'CMSA-CC-301',
    title: 'Mid-Semester Assessment: Data Structures & Algorithms',
    instructions: 'This is an official online timed assessment. Answer all questions within 20 minutes. Answers are auto-saved. Once submitted or time runs out, your score will be computed instantly.',
    timeLimitMinutes: 20,
    totalMarks: 20,
    passingMarks: 8,
    openDate: '2026-09-25',
    closeDate: '2026-10-15',
    randomizeQuestions: false,
    maxAttempts: 2,
    status: 'published',
    resultsPublished: true,
    createdByName: 'Prof. Tanmoy Banerjee',
    questions: [
      {
        id: 'q1',
        type: 'mcq',
        prompt: 'What is the worst-case time complexity of searching an element in an AVL Tree with N nodes?',
        options: ['O(1)', 'O(log N)', 'O(N)', 'O(N log N)'],
        correctAnswers: [1], // Index 1: O(log N)
        marks: 4,
        topic: 'Trees',
        difficulty: 'medium',
        explanation: 'Because AVL trees maintain strict height balancing where |h_L - h_R| <= 1, the maximum height is bounded by 1.44 log2(N), guaranteeing O(log N) search.'
      },
      {
        id: 'q2',
        type: 'true_false',
        prompt: 'A Breadth-First Search (BFS) on an unweighted graph always discovers the shortest path from the start vertex to any reachable vertex.',
        options: ['True', 'False'],
        correctAnswers: [0], // True
        marks: 4,
        topic: 'Graphs',
        difficulty: 'easy',
        explanation: 'BFS explores vertices level by level, ensuring that the first time a vertex is reached corresponds to the minimum number of edges.'
      },
      {
        id: 'q3',
        type: 'multiple_select',
        prompt: 'Which of the following sorting algorithms have an average-case time complexity of O(N log N)? (Select all that apply)',
        options: ['Merge Sort', 'Bubble Sort', 'Quick Sort', 'Heap Sort'],
        correctAnswers: [0, 2, 3], // Merge, Quick, Heap
        marks: 4,
        topic: 'Sorting',
        difficulty: 'medium',
        explanation: 'Merge Sort, Quick Sort, and Heap Sort all exhibit O(N log N) average case runtime, whereas Bubble Sort is O(N^2).'
      },
      {
        id: 'q4',
        type: 'fill_blank',
        prompt: 'The data structure predominantly utilized in resolving function calls and infix-to-postfix expression conversion is the ________.',
        correctAnswers: ['stack', 'Stack'],
        marks: 4,
        topic: 'Linear Structures',
        difficulty: 'easy',
        explanation: 'A Stack follows the Last-In First-Out (LIFO) order, which matches the semantics of nested function execution contexts and operator precedence.'
      },
      {
        id: 'q5',
        type: 'short_answer',
        prompt: 'State the minimum number of queues required to implement a standard stack data structure.',
        correctAnswers: ['2', 'two'],
        marks: 4,
        topic: 'Queues & Stacks',
        difficulty: 'medium',
        explanation: 'Two queues are required to simulate the LIFO push and pop operations of a stack.'
      }
    ]
  },
  {
    id: 'quiz-cs-302-mid',
    courseId: 'course-cs-302',
    courseCode: 'CMSA-CC-302',
    title: 'Quiz 1: CPU Scheduling & Process Synchronization',
    instructions: 'Assessment on process lifecycle, CPU scheduling criteria, mutexes, and deadlocks.',
    timeLimitMinutes: 15,
    totalMarks: 15,
    passingMarks: 6,
    openDate: '2026-09-28',
    closeDate: '2026-10-20',
    randomizeQuestions: false,
    maxAttempts: 1,
    status: 'published',
    resultsPublished: true,
    createdByName: 'Prof. Tanmoy Banerjee',
    questions: [
      {
        id: 'q-os-1',
        type: 'mcq',
        prompt: 'Which CPU scheduling algorithm may lead to process starvation if long processes are continuously preempted?',
        options: ['Shortest Job First (SJF) Preemptive', 'Round Robin', 'First-Come First-Served', 'FIFO'],
        correctAnswers: [0],
        marks: 5,
        topic: 'Scheduling',
        difficulty: 'medium',
        explanation: 'Shortest Remaining Time First (preemptive SJF) causes starvation when shorter jobs arrive continuously.'
      },
      {
        id: 'q-os-2',
        type: 'true_false',
        prompt: 'Deadlock avoidance using the Banker algorithm requires advance knowledge of the maximum resources each process may claim.',
        options: ['True', 'False'],
        correctAnswers: [0],
        marks: 5,
        topic: 'Deadlocks',
        difficulty: 'easy',
        explanation: 'Yes, the Banker algorithm relies on a priori knowledge of maximum demands.'
      },
      {
        id: 'q-os-3',
        type: 'mcq',
        prompt: 'The translation lookaside buffer (TLB) is primarily used to speed up which operating system subsystem?',
        options: ['Virtual Memory Page Translation', 'Disk I/O scheduling', 'Network packet routing', 'Thread context switching'],
        correctAnswers: [0],
        marks: 5,
        topic: 'Memory',
        difficulty: 'easy',
        explanation: 'TLB is a fast hardware associative cache that stores recently accessed virtual-to-physical address mappings.'
      }
    ]
  }
];

export const initialAttempts: AssessmentAttempt[] = [
  {
    id: 'att-souvik-01',
    assessmentId: 'quiz-cs-301-mid',
    studentId: 'user-student-souvik',
    studentName: 'Souvik Jana',
    studentRoll: 'BSC/CS/2024/042',
    startTime: '2026-09-26 10:00 AM',
    submittedTime: '2026-09-26 10:14 AM',
    status: 'graded',
    answers: {
      q1: 1,
      q2: 0,
      q3: [0, 2, 3],
      q4: 'Stack',
      q5: '2'
    },
    autoScore: 20,
    finalScore: 20,
    isGraded: true,
    facultyFeedback: 'Perfect score! Comprehensive grasp of theoretical concepts.'
  }
];

export const initialGrades: GradeItem[] = [
  {
    id: 'grd-001',
    studentId: 'user-student-souvik',
    studentName: 'Souvik Jana',
    studentRoll: 'BSC/CS/2024/042',
    courseId: 'course-cs-301',
    courseCode: 'CMSA-CC-301',
    courseTitle: 'Data Structures & Algorithms',
    assignmentMarks: 24,
    assignmentTotal: 25,
    quizMarks: 20,
    quizTotal: 20,
    midtermMarks: 45,
    midtermTotal: 50,
    finalGrade: 'O',
    gpa: 10.0,
    status: 'published',
    publishedDate: '2026-09-28'
  },
  {
    id: 'grd-002',
    studentId: 'user-student-souvik',
    studentName: 'Souvik Jana',
    studentRoll: 'BSC/CS/2024/042',
    courseId: 'course-cs-302',
    courseCode: 'CMSA-CC-302',
    courseTitle: 'Operating Systems & Linux Architecture',
    assignmentMarks: 26,
    assignmentTotal: 30,
    quizMarks: 14,
    quizTotal: 15,
    midtermMarks: 42,
    midtermTotal: 50,
    finalGrade: 'A+',
    gpa: 9.0,
    status: 'published',
    publishedDate: '2026-09-28'
  },
  {
    id: 'grd-003',
    studentId: 'user-student-souvik',
    studentName: 'Souvik Jana',
    studentRoll: 'BSC/CS/2024/042',
    courseId: 'course-math-301',
    courseCode: 'MATH-GE-301',
    courseTitle: 'Numerical Methods and Statistics',
    assignmentMarks: 22,
    assignmentTotal: 25,
    quizMarks: 18,
    quizTotal: 20,
    midtermMarks: 44,
    midtermTotal: 50,
    finalGrade: 'A+',
    gpa: 9.0,
    status: 'published',
    publishedDate: '2026-09-28'
  }
];

export const initialAttendance: AttendanceRecord[] = [
  {
    id: 'att-rec-1',
    courseId: 'course-cs-301',
    date: '2026-09-24',
    topicCovered: 'AVL Tree insertion and rotations',
    facultyId: 'user-faculty-cs',
    presentStudentIds: ['user-student-souvik', 'std-002', 'std-003', 'std-004'],
    absentStudentIds: ['std-005']
  },
  {
    id: 'att-rec-2',
    courseId: 'course-cs-301',
    date: '2026-09-22',
    topicCovered: 'Binary Search Trees & Traversal Algorithms',
    facultyId: 'user-faculty-cs',
    presentStudentIds: ['user-student-souvik', 'std-002', 'std-004', 'std-005'],
    absentStudentIds: ['std-003']
  },
  {
    id: 'att-rec-3',
    courseId: 'course-cs-301',
    date: '2026-09-17',
    topicCovered: 'Stack Applications: Infix to Postfix evaluation',
    facultyId: 'user-faculty-cs',
    presentStudentIds: ['user-student-souvik', 'std-002', 'std-003', 'std-004', 'std-005'],
    absentStudentIds: []
  },
  {
    id: 'att-rec-4',
    courseId: 'course-cs-302',
    date: '2026-09-23',
    topicCovered: 'Process scheduling: Round Robin vs Multi-level feedback queue',
    facultyId: 'user-faculty-cs',
    presentStudentIds: ['user-student-souvik', 'std-002', 'std-003'],
    absentStudentIds: ['std-004', 'std-005']
  }
];

export const initialAnnouncements: Announcement[] = [
  {
    id: 'ann-01',
    title: 'Vidyasagar University Semester III Form Fill-up & Examination Notice',
    titleBengali: 'বিদ্যাসাগর বিশ্ববিদ্যালয় ৩য় সেমিস্টার পরীক্ষার ফর্ম পূরণ সংক্রান্ত বিজ্ঞপ্তি',
    content: 'All undergraduate students of 3rd Semester (CBCS) are hereby notified that online examination form submission will commence on 10th October 2026. Please clear all departmental library clearances and verify your enrolled subjects prior to final submission.',
    authorName: 'Prof. (Dr.) Pranab Kumar Mishra',
    authorRole: 'Principal, Tamralipta Mahavidyalaya',
    targetAudience: 'all',
    priority: 'urgent',
    publishedAt: '2026-09-28',
    readBy: ['user-student-souvik', 'user-faculty-cs'],
    attachmentName: 'VU_Exam_Notice_Notification_2026.pdf'
  },
  {
    id: 'ann-02',
    title: 'Department of Computer Science: State-Level Seminar on Machine Learning',
    titleBengali: 'কম্পিউটার সায়েন্স বিভাগ: মেশিন লার্নিং বিষয়ক রাজ্যস্তরীয় আলোচনা সভা',
    content: 'The Department of Computer Science is organizing a one-day state-level seminar on "Practical Frontiers in Artificial Intelligence & High-Performance Computing" in the Golden Jubilee Auditorium on 14th October 2026. Registration is mandatory for all B.Sc. Honours students.',
    authorName: 'Dr. Anupam Mukherjee',
    authorRole: 'HOD, Computer Science',
    targetAudience: 'department',
    departmentId: 'dept-cs',
    priority: 'normal',
    publishedAt: '2026-09-27',
    readBy: ['user-student-souvik'],
    attachmentName: 'Seminar_Schedule_CS_Dept.pdf'
  },
  {
    id: 'ann-03',
    title: 'Puja Vacation Schedule and College Administrative Timing',
    titleBengali: 'পূজাবকাশ ও মহাবিদ্যালয়ের প্রশাসনিক সময়সূচি',
    content: 'The college academic departments will remain closed for Durga Puja and Lakshmi Puja from 18th October 2026 to 2nd November 2026. Online study resources and TM-LMS portal will remain functional 24x7 for all students.',
    authorName: 'Dr. Sisir Kumar Bhowmik',
    authorRole: 'Super Administrator',
    targetAudience: 'all',
    priority: 'info',
    publishedAt: '2026-09-26',
    readBy: []
  }
];

export const initialDiscussions: DiscussionThread[] = [
  {
    id: 'disc-01',
    courseId: 'course-cs-301',
    courseCode: 'CMSA-CC-301',
    title: 'Difference between Double Rotation (LR) and two single rotations in AVL?',
    content: 'In our lecture on AVL trees, why does an LR imbalance require left rotation on the child followed by right rotation on the parent, instead of just rotating the parent? Can someone clarify with an example?',
    authorId: 'user-student-souvik',
    authorName: 'Souvik Jana',
    authorRole: 'student',
    createdAt: '2026-09-25 02:15 PM',
    tags: ['AVL Trees', 'Rotations', 'Data Structures'],
    isPinned: true,
    replies: [
      {
        id: 'rep-01',
        threadId: 'disc-01',
        authorId: 'user-faculty-cs',
        authorName: 'Prof. Tanmoy Banerjee',
        authorRole: 'faculty',
        content: 'Great question Souvik. In an LR imbalance, the offending node is inserted into the RIGHT subtree of the LEFT child. Rotating the parent alone does not restore order property because the subtree root will be misplaced. The first left-rotation aligns the three nodes in a straight line (LL case), so the second right-rotation can balance them symmetrically.',
        createdAt: '2026-09-25 04:30 PM',
        isFacultyResponse: true
      },
      {
        id: 'rep-02',
        threadId: 'disc-01',
        authorId: 'user-student-souvik',
        authorName: 'Souvik Jana',
        authorRole: 'student',
        content: 'Thank you Sir! That makes the zig-zag alignment visual intuition very clear.',
        createdAt: '2026-09-25 05:00 PM'
      }
    ]
  },
  {
    id: 'disc-02',
    courseId: 'course-cs-302',
    courseCode: 'CMSA-CC-302',
    title: 'Handling producer buffer overflow with mutexes vs semaphores',
    content: 'When writing the bounded buffer assignment, is it sufficient to use only a pthread mutex without empty and full condition variables/semaphores?',
    authorId: 'user-student-souvik',
    authorName: 'Souvik Jana',
    authorRole: 'student',
    createdAt: '2026-09-27 11:20 AM',
    tags: ['Concurrency', 'Semaphores', 'Operating Systems'],
    replies: [
      {
        id: 'rep-03',
        threadId: 'disc-02',
        authorId: 'user-faculty-cs',
        authorName: 'Prof. Tanmoy Banerjee',
        authorRole: 'faculty',
        content: 'A mutex only provides mutual exclusion (one thread at a time in the critical section). It cannot manage count signaling! You must use two counting semaphores (empty and full) or condition variables with pthread_cond_wait() to prevent busy waiting.',
        createdAt: '2026-09-27 01:10 PM',
        isFacultyResponse: true
      }
    ]
  }
];

export const initialSupportTickets: SupportTicket[] = [
  {
    id: 'tick-001',
    ticketNumber: 'TKT-2026-089',
    userId: 'user-student-souvik',
    userName: 'Souvik Jana',
    userRole: 'student',
    userEmail: 's.jana@student.tamralipta.ac.in',
    category: 'quiz',
    subject: 'Temporary network disconnect during quiz attempt auto-save verification',
    description: 'During my test on 26th Sept, my local broadband disconnected for 40 seconds. I would like to verify that all my answers were restored safely by the offline cache.',
    priority: 'medium',
    status: 'resolved',
    createdAt: '2026-09-26 11:30 AM',
    updatedAt: '2026-09-26 01:45 PM',
    replies: [
      {
        id: 'tr-1',
        author: 'Biplab Maity (IT Support)',
        message: 'Hello Souvik, we reviewed your attempt audit record. TM-LMS offline sync stored and restored all 5 answers correctly before final submission at 10:14 AM. Your full score is safely recorded in the database.',
        date: '2026-09-26 01:45 PM',
        isStaff: true
      }
    ]
  },
  {
    id: 'tick-002',
    ticketNumber: 'TKT-2026-092',
    userId: 'user-faculty-cs',
    userName: 'Prof. Tanmoy Banerjee',
    userRole: 'faculty',
    userEmail: 't.banerjee@tamralipta.ac.in',
    category: 'course',
    subject: 'Request for increasing resource upload quota for video recordings',
    description: 'Planning to upload laboratory demonstration video files for Unit 3 Graph algorithms.',
    priority: 'low',
    status: 'in_progress',
    createdAt: '2026-09-28 03:00 PM',
    updatedAt: '2026-09-29 09:00 AM',
    replies: [
      {
        id: 'tr-2',
        author: 'Biplab Maity (IT Support)',
        message: 'Quota increased to 100MB per file for Department of Computer Science. You can now upload MP4 recordings directly.',
        date: '2026-09-29 09:00 AM',
        isStaff: true
      }
    ]
  }
];

export const initialCalendarEvents: CalendarEvent[] = [
  {
    id: 'ev-1',
    title: 'Assignment 1 Due: AVL Tree Implementation',
    date: '2026-10-05',
    type: 'assignment',
    description: 'Final submission deadline for CMSA-CC-301 Assignment 1 before midnight.',
    color: '#0284c7'
  },
  {
    id: 'ev-2',
    title: 'Practical Project Due: POSIX Producer-Consumer',
    date: '2026-10-08',
    type: 'assignment',
    description: 'CMSA-CC-302 Operating Systems practical assignment submission.',
    color: '#0284c7'
  },
  {
    id: 'ev-3',
    title: 'Vidyasagar University Examination Form Fill-up',
    date: '2026-10-10',
    endDate: '2026-10-16',
    type: 'admission',
    description: 'Online examination portal active for CBCS Semester 3 and Semester 5 students.',
    color: '#d97706'
  },
  {
    id: 'ev-4',
    title: 'State Seminar: Machine Learning & High-Performance Computing',
    date: '2026-10-14',
    type: 'seminar',
    description: 'Organized by Dept. of Computer Science in the Golden Jubilee Auditorium.',
    color: '#059669'
  },
  {
    id: 'ev-5',
    title: 'Durga Puja & Autumn Recess (College Closed)',
    date: '2026-10-18',
    endDate: '2026-11-02',
    type: 'holiday',
    description: 'Annual institutional vacation for Durga Puja, Lakshmi Puja, and Kali Puja.',
    color: '#dc2626'
  }
];

export const initialAuditLogs: AuditLog[] = [
  {
    id: 'log-01',
    timestamp: '2026-09-29 11:35:12',
    userName: 'Souvik Jana',
    userRole: 'student',
    action: 'USER_LOGIN',
    details: 'Authenticated via portal session credentials',
    ipAddress: '192.168.1.104'
  },
  {
    id: 'log-02',
    timestamp: '2026-09-29 09:15:40',
    userName: 'Prof. Tanmoy Banerjee',
    userRole: 'faculty',
    action: 'EVALUATE_ASSIGNMENT',
    details: 'Evaluated submission sub-001 (Souvik Jana), assigned 24/25 marks',
    ipAddress: '192.168.1.55'
  },
  {
    id: 'log-03',
    timestamp: '2026-09-28 16:30:20',
    userName: 'Souvik Jana',
    userRole: 'student',
    action: 'SUBMIT_ASSIGNMENT',
    details: 'Uploaded solution file Souvik_Jana_AVL_Tree_Assignment1.pdf for asg-301-01',
    ipAddress: '192.168.1.104'
  },
  {
    id: 'log-04',
    timestamp: '2026-09-28 14:00:10',
    userName: 'Prof. (Dr.) Pranab Kumar Mishra',
    userRole: 'principal',
    action: 'PUBLISH_ANNOUNCEMENT',
    details: 'Issued official notice ann-01 for Semester 3 examination form fill-up',
    ipAddress: '192.168.1.10'
  },
  {
    id: 'log-05',
    timestamp: '2026-09-26 10:14:35',
    userName: 'Souvik Jana',
    userRole: 'student',
    action: 'SUBMIT_QUIZ_ATTEMPT',
    details: 'Completed Mid-Semester Assessment quiz-cs-301-mid with auto-score 20/20',
    ipAddress: '192.168.1.104'
  }
];

export const initialInstitutionalDocs: InstitutionalDocument[] = [
  {
    id: 'doc-inst-01',
    title: 'Academic Calendar & Examination Schedule (Session 2025-2026)',
    titleBengali: 'প্রাতিষ্ঠানিক শিক্ষাবর্ষ দিনপঞ্জি ও পরীক্ষা সূচি ২০২৫-২০২৬',
    category: 'calendar',
    academicSession: '2025-2026',
    publicationDate: '2026-07-01',
    authorId: 'user-principal',
    authorName: 'Prof. (Dr.) Pranab Kumar Mishra',
    approvalStatus: 'approved',
    version: 1,
    targetAudience: 'all',
    attachmentName: 'Academic_Calendar_2025_2026_Approved.pdf',
    attachmentUrl: '/documents/Academic_Calendar_2025_2026_Approved.pdf',
    fileSize: '1.8 MB',
    fileType: 'pdf',
    description: 'Gazetted schedule of term start, Puja holidays, continuous assessments, and semester final exams.',
    approvedBy: 'Governing Body & Principal'
  },
  {
    id: 'doc-inst-02',
    title: 'University Regulations for CBCS & Continuous Internal Assessment',
    titleBengali: 'সিবিসিএস ও ধারাবাহিক অভ্যন্তরীণ মূল্যায়ন বিধিমালা',
    category: 'policy',
    academicSession: '2025-2026',
    publicationDate: '2026-07-15',
    authorId: 'user-principal',
    authorName: 'Prof. (Dr.) Pranab Kumar Mishra',
    approvalStatus: 'approved',
    version: 2,
    targetAudience: 'faculty',
    attachmentName: 'CBCS_Evaluation_Policy_VU.pdf',
    attachmentUrl: '/documents/CBCS_Evaluation_Policy_VU.pdf',
    fileSize: '2.4 MB',
    fileType: 'pdf',
    description: 'Mandatory guidelines for 75% attendance criteria, internal test schedules, and mark moderation.',
    approvedBy: 'Academic Council'
  },
  {
    id: 'doc-inst-03',
    title: 'Institutional Anti-Ragging Policy & Student Code of Conduct',
    titleBengali: 'অ্যান্টি-র‌্যাগিং নীতিমালা ও ছাত্র আচরণবিধি',
    category: 'student_instruction',
    academicSession: '2025-2026',
    publicationDate: '2026-08-01',
    authorId: 'user-principal',
    authorName: 'Prof. (Dr.) Pranab Kumar Mishra',
    approvalStatus: 'approved',
    version: 1,
    targetAudience: 'students',
    attachmentName: 'Student_Code_of_Conduct_Anti_Ragging.pdf',
    attachmentUrl: '/documents/Student_Code_of_Conduct_Anti_Ragging.pdf',
    fileSize: '950 KB',
    fileType: 'pdf',
    description: 'Supreme Court & UGC compliance document for safe campus environment with emergency helpline numbers.',
    approvedBy: 'Anti-Ragging Committee'
  },
  {
    id: 'doc-inst-04',
    title: 'NAAC Accreditation Criterion 1 & 2 Self-Study Dossier',
    titleBengali: 'ন্যাক সেলফ স্টাডি রিপোর্ট ক্রাইটেরিয়ন ১ ও ২',
    category: 'admin_guidelines',
    academicSession: '2025-2026',
    publicationDate: '2026-08-20',
    authorId: 'user-principal',
    authorName: 'Prof. (Dr.) Pranab Kumar Mishra',
    approvalStatus: 'approved',
    version: 1,
    targetAudience: 'department_heads',
    attachmentName: 'NAAC_Criterion_1_2_SSR_Brief.pdf',
    attachmentUrl: '/documents/NAAC_Criterion_1_2_SSR_Brief.pdf',
    fileSize: '4.2 MB',
    fileType: 'pdf',
    description: 'Institutional metrics on curricular aspects, teaching-learning resources, and faculty mentorship logs.',
    approvedBy: 'IQAC Coordinator'
  }
];

export const initialApprovalRequests: ApprovalRequest[] = [
  {
    id: 'appr-01',
    type: 'resource_approval',
    title: 'CS-301 Advanced Graph Algorithms & Dijkstra Lab Sheets',
    departmentId: 'dept-cs',
    courseId: 'course-cs-301',
    submittedBy: 'user-faculty-cs',
    submittedByName: 'Prof. Tanmoy Banerjee',
    submittedByRole: 'faculty',
    submittedAt: '2026-09-28 11:20:00',
    status: 'pending',
    targetId: 'res-pending-01',
    details: 'Uploaded modular lab guide containing directed graphs, adjacency list implementations, and shortest path proofs.'
  },
  {
    id: 'appr-02',
    type: 'class_swap',
    title: 'Class Swap: Theory Lecture on 2026-10-06 with Dr. Anupam Mukherjee',
    departmentId: 'dept-cs',
    courseId: 'course-cs-301',
    submittedBy: 'user-faculty-cs',
    submittedByName: 'Prof. Tanmoy Banerjee',
    submittedByRole: 'faculty',
    submittedAt: '2026-09-29 14:00:00',
    status: 'pending',
    targetId: 'swap-01',
    details: 'Prof. Banerjee attending National Computing Conference; requesting Dr. Mukherjee to cover Monday 11:30 AM slot.'
  },
  {
    id: 'appr-03',
    type: 'course_draft',
    title: 'Syllabus Proposal: CMSA-SEC-301 Web Design & Full Stack Engineering',
    departmentId: 'dept-cs',
    submittedBy: 'user-faculty-cs',
    submittedByName: 'Prof. Tanmoy Banerjee',
    submittedByRole: 'faculty',
    submittedAt: '2026-09-25 16:45:00',
    status: 'approved',
    targetId: 'course-cs-sec-301',
    details: 'Skill Enhancement Course proposal under Vidyasagar University curriculum guidelines with 2 credits.',
    reviewNotes: 'Reviewed and aligned with university contact hours. Approved for semester 3 rollout.',
    reviewedBy: 'user-hod-cs',
    reviewedByName: 'Dr. Anupam Mukherjee',
    reviewedAt: '2026-09-26 10:30:00'
  }
];

export const initialClassSwaps: ClassSwapRequest[] = [
  {
    id: 'swap-01',
    departmentId: 'dept-cs',
    requesterFacultyId: 'user-faculty-cs',
    requesterFacultyName: 'Prof. Tanmoy Banerjee',
    targetFacultyId: 'user-hod-cs',
    targetFacultyName: 'Dr. Anupam Mukherjee',
    courseId: 'course-cs-301',
    courseTitle: 'Data Structures and Algorithms',
    originalDate: '2026-10-06',
    originalTimeSlot: '11:30 AM - 12:30 PM (Room 204)',
    swapDate: '2026-10-08',
    swapTimeSlot: '02:00 PM - 03:00 PM (Lab 2)',
    reason: 'Attending UGC Sponsored National Seminar on Artificial Intelligence at Kolkata.',
    status: 'pending',
    submittedAt: '2026-09-29 14:00:00'
  }
];
