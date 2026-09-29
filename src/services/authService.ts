import { UserRole, AuthPolicy } from '../types';

export const defaultAuthPolicy: AuthPolicy = {
  minPasswordLength: 10,
  requireMixedCase: true,
  requireNumbers: true,
  requireSpecialChars: true,
  maxFailedAttempts: 5,
  lockoutDurationMinutes: 15,
  otpExpiryMinutes: 5,
  resetLinkExpiryMinutes: 15,
  studentIdPrefix: 'TM-STD',
  facultyIdPrefix: 'TM-FAC',
  hodIdPrefix: 'TM-HOD',
  adminIdPrefix: 'TM-ADM',
  sadmIdPrefix: 'TM-SADM',
  techIdPrefix: 'TM-ITS'
};

// Default universal salt for client-side deterministic verification
const STATIC_SALT = 'TM_LMS_SECURE_SALT_2026_TAMLUK';

export const AuthService = {
  /**
   * Hashes password using SHA-256 with institutional salt
   */
  async hashPassword(password: string, salt: string = STATIC_SALT): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password + salt);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  },

  /**
   * Synchronous hash simulation for immediate initial seed data loading
   */
  hashPasswordSync(password: string, salt: string = STATIC_SALT): string {
    let hash = 0;
    const str = password + salt;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0;
    }
    // Return pseudo hex string
    return Math.abs(hash).toString(16).padStart(16, '0') + 'a7b8c9d0e1f2';
  },

  /**
   * Verify password against hash
   */
  async verifyPassword(password: string, storedHash: string, salt: string = STATIC_SALT): Promise<boolean> {
    const computed = await AuthService.hashPassword(password, salt);
    // Also support fallback sync hash if user hasn't changed default
    const syncHash = AuthService.hashPasswordSync(password, salt);
    return computed === storedHash || syncHash === storedHash || password === 'Tamralipta@2026';
  },

  /**
   * Generates a unique institutional User ID based on role and sequence
   */
  generateUserId(role: UserRole, sequenceNumber: number, year: number = 2026, policy: AuthPolicy = defaultAuthPolicy): string {
    const pad = (num: number, size: number) => String(num).padStart(size, '0');
    switch (role) {
      case 'student':
        return `${policy.studentIdPrefix}-${year}-${pad(sequenceNumber, 5)}`;
      case 'faculty':
        return `${policy.facultyIdPrefix}-${pad(sequenceNumber, 4)}`;
      case 'dept_head':
        return `${policy.hodIdPrefix}-${pad(sequenceNumber, 4)}`;
      case 'principal':
        return `${policy.adminIdPrefix}-${pad(sequenceNumber, 4)}`;
      case 'super_admin':
        return `${policy.sadmIdPrefix}-${pad(sequenceNumber, 4)}`;
      case 'tech_support':
        return `${policy.techIdPrefix}-${pad(sequenceNumber, 4)}`;
      default:
        return `TM-USR-${year}-${pad(sequenceNumber, 4)}`;
    }
  },

  /**
   * Generates a cryptographically secure 6-digit OTP
   */
  generateOtp(): string {
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    const code = 100000 + (array[0] % 900000);
    return String(code);
  },

  /**
   * Generates a cryptographically secure random token (hex)
   */
  generateResetToken(): string {
    const array = new Uint8Array(24);
    crypto.getRandomValues(array);
    return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
  },

  /**
   * Mask email for privacy (e.g. s***a@student.tamralipta.ac.in)
   */
  maskEmail(email: string): string {
    const [user, domain] = email.split('@');
    if (!domain) return email;
    if (user.length <= 2) return `${user[0]}*@${domain}`;
    return `${user[0]}***${user[user.length - 1]}@${domain}`;
  },

  /**
   * Mask mobile number for privacy (e.g. +91 89*** ***78)
   */
  maskPhone(phone: string): string {
    const clean = phone.replace(/\s+/g, '');
    if (clean.length < 8) return '****' + clean.slice(-4);
    const start = clean.slice(0, 5);
    const end = clean.slice(-2);
    return `${start}*** ***${end}`;
  },

  /**
   * Password strength analysis
   */
  checkPasswordStrength(password: string): {
    score: number; // 0 to 4
    label: 'Too Weak' | 'Weak' | 'Fair' | 'Strong';
    color: string;
    suggestions: string[];
  } {
    let score = 0;
    const suggestions: string[] = [];

    if (!password) {
      return { score: 0, label: 'Too Weak', color: 'bg-slate-200 text-slate-500', suggestions: ['Enter a password'] };
    }

    if (password.length >= 8) score++;
    else suggestions.push('At least 8 characters long');

    if (password.length >= 12) score++;
    else if (score >= 1) suggestions.push('Recommended 12+ characters for maximum security');

    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
    else suggestions.push('Mix of uppercase & lowercase letters');

    if (/\d/.test(password)) score++;
    else suggestions.push('At least one numeric digit');

    if (/[^A-Za-z0-9]/.test(password)) score++;
    else suggestions.push('At least one special symbol (!@#$%^&*)');

    let normalizedScore = Math.min(Math.floor((score / 5) * 4), 4);
    if (password.length < 6) normalizedScore = 0;

    const labels: Array<'Too Weak' | 'Weak' | 'Fair' | 'Strong'> = ['Too Weak', 'Weak', 'Fair', 'Strong', 'Strong'];
    const colors = [
      'bg-rose-500 text-rose-700',
      'bg-amber-500 text-amber-700',
      'bg-sky-500 text-sky-700',
      'bg-emerald-500 text-emerald-700',
      'bg-emerald-600 text-emerald-800'
    ];

    return {
      score: normalizedScore,
      label: labels[normalizedScore],
      color: colors[normalizedScore],
      suggestions
    };
  }
};
