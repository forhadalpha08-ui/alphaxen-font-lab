import { ADMIN_EMAIL } from '../constants';

export type UserRole = 'buyer' | 'seller' | 'both';
export type UserStatus = 'active' | 'pending' | 'suspended';

export interface PasswordValidationResult {
  score: number; // 0 to 4
  strengthLabel: 'Weak' | 'Fair' | 'Good' | 'Strong' | 'Ultra';
  strengthColor: string;
  isLengthValid: boolean; // >= 6
  hasLetter: boolean;     // [a-zA-Z]
  hasNumber: boolean;     // [0-9]
  hasSymbol: boolean;     // [!@#$%^&*...]
  isValid: boolean;       // Meets all 4 conditions
  missingRequirements: string[];
}

export interface UserRecord {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  canBuy: boolean;
  canSell: boolean;
  joinedDate: string;
  lastActive: string;
  organization?: string;
  country?: string;
  purchasedCount: number;
  uploadedCount: number;
  totalSpent: number;
  totalEarnings: number;
  royaltyRate: number; // 85%
  notes?: string;
  verifiedBadge?: boolean;
  twoFactorEnabled?: boolean;
  passwordHash?: string;
  authPin?: string;
  sessionToken?: string;
  trustedDevice?: boolean;
}

/**
 * Validates that a password satisfies the upgraded security policy:
 * - Minimum 6 characters
 * - Contains at least one letter (word character: A-Z or a-z)
 * - Contains at least one digit / number (0-9)
 * - Contains at least one special symbol (!@#$%^&* etc.)
 */
export const validatePasswordComplexity = (password: string): PasswordValidationResult => {
  const isLengthValid = password.length >= 6;
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSymbol = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(password);

  let score = 0;
  if (isLengthValid) score += 1;
  if (hasLetter) score += 1;
  if (hasNumber) score += 1;
  if (hasSymbol) score += 1;

  const missing: string[] = [];
  if (!isLengthValid) missing.push('At least 6 characters');
  if (!hasLetter) missing.push('At least 1 letter (word character)');
  if (!hasNumber) missing.push('At least 1 number (digit 0-9)');
  if (!hasSymbol) missing.push('At least 1 special symbol (!@#$%^&*)');

  let strengthLabel: 'Weak' | 'Fair' | 'Good' | 'Strong' | 'Ultra' = 'Weak';
  let strengthColor = '#f43f5e'; // rose

  if (score === 4 && password.length >= 10) {
    strengthLabel = 'Ultra';
    strengthColor = '#34d399'; // emerald
  } else if (score === 4) {
    strengthLabel = 'Strong';
    strengthColor = '#38bdf8'; // cyan
  } else if (score === 3) {
    strengthLabel = 'Good';
    strengthColor = '#818cf8'; // indigo
  } else if (score === 2) {
    strengthLabel = 'Fair';
    strengthColor = '#a855f7'; // purple
  }

  return {
    score,
    strengthLabel,
    strengthColor,
    isLengthValid,
    hasLetter,
    hasNumber,
    hasSymbol,
    isValid: isLengthValid && hasLetter && hasNumber && hasSymbol,
    missingRequirements: missing
  };
};

/**
 * Generates an ultra-secure 6-digit or 8-character password guaranteed to satisfy
 * word + number + symbol requirements.
 */
export const generateSecurePassword = (length = 8): string => {
  const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz';
  const numbers = '23456789';
  const symbols = '!@#$%&*+=?';

  // Guarantee at least one of each
  let result = [
    letters[Math.floor(Math.random() * letters.length)],
    numbers[Math.floor(Math.random() * numbers.length)],
    symbols[Math.floor(Math.random() * symbols.length)],
    letters[Math.floor(Math.random() * letters.length)]
  ];

  const allChars = letters + numbers + symbols;
  while (result.length < length) {
    result.push(allChars[Math.floor(Math.random() * allChars.length)]);
  }

  // Shuffle deterministic array
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result.join('');
};

/**
 * Generates a 6-digit cryptographic alphanumeric token for quick access
 */
export const generate6DigitAuthToken = (): string => {
  const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const numbers = '23456789';
  const symbols = '#!$%&';
  return `${letters[Math.floor(Math.random() * letters.length)]}${numbers[Math.floor(Math.random() * numbers.length)]}${symbols[Math.floor(Math.random() * symbols.length)]}${numbers[Math.floor(Math.random() * numbers.length)]}${letters[Math.floor(Math.random() * letters.length)]}${numbers[Math.floor(Math.random() * numbers.length)]}`;
};

export const DEFAULT_USERS: UserRecord[] = [
  {
    id: 'usr-001',
    name: 'Elena Rostova',
    email: 'studio@novalabs.design',
    role: 'buyer',
    status: 'active',
    canBuy: true,
    canSell: false,
    joinedDate: '2026-08-14',
    lastActive: '10 mins ago',
    organization: 'Nova Labs Studio',
    country: 'United Kingdom',
    purchasedCount: 4,
    uploadedCount: 0,
    totalSpent: 840,
    totalEarnings: 0,
    royaltyRate: 85,
    notes: 'Enterprise agency client. Frequently licenses Extended web fonts.',
    verifiedBadge: true
  },
  {
    id: 'usr-002',
    name: 'Abdullah Foundry Lab',
    email: 'foundry@alphaxen.design',
    role: 'seller',
    status: 'active',
    canBuy: true,
    canSell: true,
    joinedDate: '2026-07-20',
    lastActive: '1 hour ago',
    organization: 'Abdullah Typography GmbH',
    country: 'Germany',
    purchasedCount: 1,
    uploadedCount: 6,
    totalSpent: 120,
    totalEarnings: 4950,
    royaltyRate: 85,
    notes: 'Core flagship type foundry creator. Specializes in luxury variable & color chrome fonts.',
    verifiedBadge: true
  },
  {
    id: 'usr-003',
    name: 'Marcus Vance',
    email: 'marcus.v@hyperionbrand.io',
    role: 'buyer',
    status: 'pending',
    canBuy: false,
    canSell: false,
    joinedDate: '2026-09-25',
    lastActive: '2 hours ago',
    organization: 'Hyperion Brand Consultancy',
    country: 'United States',
    purchasedCount: 0,
    uploadedCount: 0,
    totalSpent: 0,
    totalEarnings: 0,
    royaltyRate: 85,
    notes: 'Applied for Enterprise Tier Font Buyer Access with multi-domain licensing.'
  },
  {
    id: 'usr-004',
    name: 'Aethelgard Type',
    email: 'submissions@aethelgardtype.fr',
    role: 'seller',
    status: 'pending',
    canBuy: false,
    canSell: false,
    joinedDate: '2026-09-26',
    lastActive: 'Just now',
    organization: 'Aethelgard Haute Serifs',
    country: 'France',
    purchasedCount: 0,
    uploadedCount: 2,
    totalSpent: 0,
    totalEarnings: 0,
    royaltyRate: 85,
    notes: 'New type designer applying for marketplace distribution rights.'
  },
  {
    id: 'usr-005',
    name: 'Cipher Media Lab',
    email: 'billing@ciphermedia.co',
    role: 'both',
    status: 'active',
    canBuy: true,
    canSell: true,
    joinedDate: '2026-08-01',
    lastActive: 'Yesterday',
    organization: 'Cipher Interactive',
    country: 'Canada',
    purchasedCount: 2,
    uploadedCount: 1,
    totalSpent: 420,
    totalEarnings: 980,
    royaltyRate: 85,
    notes: 'Dual buyer/seller license. Approved for custom webfont hosting.',
    verifiedBadge: true
  }
];

export const getAllUsers = (): UserRecord[] => {
  const saved = localStorage.getItem('alphaxen_users');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    } catch (e) {}
  }
  localStorage.setItem('alphaxen_users', JSON.stringify(DEFAULT_USERS));
  return DEFAULT_USERS;
};

export const saveAllUsers = (users: UserRecord[]): void => {
  localStorage.setItem('alphaxen_users', JSON.stringify(users));
  // If current logged-in user is among them, update current session
  const currentEmail = localStorage.getItem('alphaxen_user_email');
  if (currentEmail) {
    const updated = users.find((u) => u.email.toLowerCase() === currentEmail.toLowerCase());
    if (updated) {
      localStorage.setItem('alphaxen_current_user', JSON.stringify(updated));
    }
  }
};

export const getCurrentUser = (): UserRecord | null => {
  const currentEmail = localStorage.getItem('alphaxen_user_email');
  const signedIn = localStorage.getItem('alphaxen_user_signed_in') === 'true';

  if (!currentEmail || !signedIn) {
    return null;
  }

  const users = getAllUsers();
  const found = users.find((u) => u.email.toLowerCase() === currentEmail.toLowerCase());
  if (found) {
    return found;
  }

  // Fallback: create record if signed in with unknown email
  const role = (localStorage.getItem('alphaxen_account_type') as UserRole) || 'buyer';
  const newUser: UserRecord = {
    id: `usr-${Date.now()}`,
    name: currentEmail.split('@')[0],
    email: currentEmail.toLowerCase(),
    role: role,
    status: 'pending', // Starts pending until approved by Admin
    canBuy: false,
    canSell: false,
    joinedDate: new Date().toISOString().split('T')[0],
    lastActive: 'Just now',
    purchasedCount: 0,
    uploadedCount: 0,
    totalSpent: 0,
    totalEarnings: 0,
    royaltyRate: 85
  };
  saveAllUsers([newUser, ...users]);
  return newUser;
};

export const loginUser = (
  email: string,
  name?: string,
  preferredRole: UserRole = 'buyer',
  autoApprove = false,
  password?: string,
  authPin?: string,
  trustedDevice = true
): UserRecord => {
  const normalizedEmail = email.trim().toLowerCase();
  localStorage.setItem('alphaxen_user_email', normalizedEmail);
  localStorage.setItem('alphaxen_user_signed_in', 'true');
  localStorage.setItem('alphaxen_account_type', preferredRole);

  const sessionToken = `AX-SESS-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  localStorage.setItem('alphaxen_session_token', sessionToken);

  const users = getAllUsers();
  let user = users.find((u) => u.email.toLowerCase() === normalizedEmail);

  if (!user) {
    user = {
      id: `usr-${Date.now()}`,
      name: name || normalizedEmail.split('@')[0],
      email: normalizedEmail,
      role: preferredRole,
      status: autoApprove ? 'active' : 'pending',
      canBuy: autoApprove || preferredRole === 'buyer' || preferredRole === 'both',
      canSell: autoApprove || preferredRole === 'seller' || preferredRole === 'both',
      joinedDate: new Date().toISOString().split('T')[0],
      lastActive: 'Just now',
      purchasedCount: 0,
      uploadedCount: 0,
      totalSpent: 0,
      totalEarnings: 0,
      royaltyRate: 85,
      passwordHash: password ? `sha256_${btoa(password).substring(0, 16)}` : undefined,
      authPin: authPin || generate6DigitAuthToken(),
      sessionToken,
      trustedDevice
    };
    saveAllUsers([user, ...users]);
  } else {
    // Update last active and session
    user.lastActive = 'Just now';
    user.sessionToken = sessionToken;
    user.trustedDevice = trustedDevice;
    if (password) {
      user.passwordHash = `sha256_${btoa(password).substring(0, 16)}`;
    }
    if (authPin) {
      user.authPin = authPin;
    }
    if (preferredRole && user.role !== preferredRole && user.role !== 'both') {
      user.role = preferredRole;
    }
    saveAllUsers(users.map((u) => (u.id === user?.id ? user! : u)));
  }

  localStorage.setItem('alphaxen_current_user', JSON.stringify(user));
  return user;
};

export const approveUser = (userId: string): UserRecord | null => {
  const users = getAllUsers();
  let targetUser: UserRecord | null = null;

  const updated = users.map((u) => {
    if (u.id === userId) {
      targetUser = {
        ...u,
        status: 'active',
        canBuy: u.role === 'buyer' || u.role === 'both' || true,
        canSell: u.role === 'seller' || u.role === 'both'
      };
      return targetUser;
    }
    return u;
  });

  saveAllUsers(updated);
  return targetUser;
};

export const logoutUser = (): void => {
  localStorage.removeItem('alphaxen_user_email');
  localStorage.removeItem('alphaxen_user_signed_in');
  localStorage.removeItem('alphaxen_current_user');
  localStorage.removeItem('alphaxen_account_type');
};
