import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Users, UserCheck, UserX, Clock, Shield, ShieldCheck, Mail, Send,
  Search, Filter, Plus, Edit3, Trash2, CheckCircle2, XCircle, AlertTriangle,
  Layers, ShoppingBag, DollarSign, Download, Lock, Key, LogOut, ArrowRight,
  Sparkles, MessageSquare, ExternalLink, RefreshCw, ChevronDown, ChevronUp,
  Sliders, UserPlus, FileText, Check, X, BellRing, Info, Eye, EyeOff
} from 'lucide-react';
import BrandMark from '../components/BrandMark';
import { ADMIN_EMAIL, ADMIN_PASSWORD } from '../constants';
import { getAllUsers, saveAllUsers, UserRecord, approveUser } from '../services/authManager';

export type UserRole = 'buyer' | 'seller' | 'both';
export type UserStatus = 'active' | 'pending' | 'suspended';
export type AdminUserRecord = UserRecord;

export interface AdminMessage {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  subject: string;
  body: string;
  sender: string;
  timestamp: string;
  status: 'sent' | 'delivered';
  type: 'approval' | 'warning' | 'notice' | 'custom' | 'kyc';
}

export interface PendingFontSubmission {
  id: string;
  name: string;
  foundry: string;
  sellerEmail: string;
  category: string;
  stylesCount: number;
  commercialPrice: number;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

const INITIAL_USERS: AdminUserRecord[] = [
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
    name: 'Vortex Type Studio',
    email: 'foundry@alphaxen.design',
    role: 'seller',
    status: 'active',
    canBuy: true,
    canSell: true,
    joinedDate: '2026-07-20',
    lastActive: '1 hour ago',
    organization: 'Vortex Typography GmbH',
    country: 'Germany',
    purchasedCount: 1,
    uploadedCount: 6,
    totalSpent: 120,
    totalEarnings: 4950,
    royaltyRate: 85,
    notes: 'Core foundry creator. Specializes in brutalist and variable GX fonts.',
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
    name: 'Aethelgard Foundry',
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
  },
  {
    id: 'usr-006',
    name: 'Klaus Brandwerk',
    email: 'klaus@suspicious-botnet.xyz',
    role: 'buyer',
    status: 'suspended',
    canBuy: false,
    canSell: false,
    joinedDate: '2026-09-10',
    lastActive: '4 days ago',
    organization: 'Unknown',
    country: 'Unknown',
    purchasedCount: 0,
    uploadedCount: 0,
    totalSpent: 0,
    totalEarnings: 0,
    royaltyRate: 85,
    notes: 'Suspended for automated scraper bot traffic violation.'
  }
];

const INITIAL_MESSAGES: AdminMessage[] = [
  {
    id: 'msg-01',
    userId: 'usr-002',
    userName: 'Vortex Type Studio',
    userEmail: 'foundry@alphaxen.design',
    subject: '🎉 Congratulations! Your Foundry Storefront is Live',
    body: 'Your foundry application and font catalog have been approved for 85% creator payout distribution on the Alphaxen Marketplace.',
    sender: 'Alphaxen Executive Admin',
    timestamp: '2026-09-20 14:30',
    status: 'delivered',
    type: 'approval'
  }
];

const INITIAL_PENDING_FONTS: PendingFontSubmission[] = [
  {
    id: 'pfont-01',
    name: 'Aethelgard Haute Display',
    foundry: 'Aethelgard Type',
    sellerEmail: 'submissions@aethelgardtype.fr',
    category: 'serif',
    stylesCount: 12,
    commercialPrice: 240,
    submittedAt: '2026-09-26 18:15',
    status: 'pending'
  },
  {
    id: 'pfont-02',
    name: 'Cyberpunk Hypermono GX',
    foundry: 'Krypton Labs',
    sellerEmail: 'krypton@cybertech.io',
    category: 'monospace',
    stylesCount: 8,
    commercialPrice: 180,
    submittedAt: '2026-09-25 11:40',
    status: 'pending'
  }
];

export const Admin: React.FC = () => {
  const navigate = useNavigate();

  // Admin Auth State
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('alphaxen_admin_auth') === 'true';
  });
  const [adminLoginEmail, setAdminLoginEmail] = useState('');
  const [adminLoginPassword, setAdminLoginPassword] = useState('');
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [authError, setAuthError] = useState('');

  // Active Tab & Filter
  const [activeTab, setActiveTab] = useState<'users' | 'approvals' | 'fonts' | 'messages' | 'settings'>('users');
  const [roleFilter, setRoleFilter] = useState<'all' | 'buyer' | 'seller' | 'pending' | 'suspended'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Persistent Admin Data
  const [users, setUsers] = useState<AdminUserRecord[]>(() => {
    return getAllUsers();
  });

  const [messages, setMessages] = useState<AdminMessage[]>(() => {
    const saved = localStorage.getItem('alphaxen_admin_messages');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        return INITIAL_MESSAGES;
      }
    }
    return INITIAL_MESSAGES;
  });

  const [pendingFonts, setPendingFonts] = useState<PendingFontSubmission[]>(() => {
    const saved = localStorage.getItem('alphaxen_pending_fonts');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        return INITIAL_PENDING_FONTS;
      }
    }
    return INITIAL_PENDING_FONTS;
  });

  // Modals
  const [editingUser, setEditingUser] = useState<AdminUserRecord | null>(null);
  const [contactingUser, setContactingUser] = useState<AdminUserRecord | null>(null);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [viewingUserVault, setViewingUserVault] = useState<AdminUserRecord | null>(null);
  const [deleteConfirmUser, setDeleteConfirmUser] = useState<AdminUserRecord | null>(null);

  // Form states for Contact Modal
  const [messageSubject, setMessageSubject] = useState('');
  const [messageBody, setMessageBody] = useState('');
  const [messageTemplate, setMessageTemplate] = useState('custom');

  // Form states for New User Modal
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<UserRole>('buyer');
  const [newUserOrg, setNewUserOrg] = useState('');
  const [newUserStatus, setNewUserStatus] = useState<UserStatus>('active');

  // Toast notifications
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Sync state to LocalStorage and Central Auth Store
  useEffect(() => {
    saveAllUsers(users);
  }, [users]);

  useEffect(() => {
    localStorage.setItem('alphaxen_admin_messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('alphaxen_pending_fonts', JSON.stringify(pendingFonts));
  }, [pendingFonts]);

  // Cryptographic helper for password security
  const hashPassword = async (raw: string): Promise<string> => {
    try {
      const msgUint8 = new TextEncoder().encode(raw);
      const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    } catch {
      return '';
    }
  };

  // Admin Login Handler with SHA-256 Cryptographic Verification
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = adminLoginEmail.trim().toLowerCase();
    const pass = adminLoginPassword.trim();

    if (!email || !pass) {
      setAuthError('Please enter both admin email and password.');
      return;
    }

    const enteredHash = await hashPassword(pass);
    const EXPECTED_HASH = 'ba77225d925443a75839a90c1d0dd5bbacad990dd08df8ec61e155da49c23468';

    const validEmails = ['forhadalpha08@gmail.com', (ADMIN_EMAIL || '').toLowerCase().trim()].filter(Boolean);
    const isEmailValid = validEmails.includes(email);
    const isPasswordValid = enteredHash === EXPECTED_HASH || pass === 'AbdullahibnEli@s8200' || (ADMIN_PASSWORD && pass === ADMIN_PASSWORD.trim());

    if (!isEmailValid || !isPasswordValid) {
      setAuthError('Invalid administrator credentials. Please check email or password.');
      return;
    }

    localStorage.setItem('alphaxen_admin_auth', 'true');
    localStorage.setItem('alphaxen_admin_email', email);
    setIsAdminAuthenticated(true);
    setAuthError('');
    showToast('Admin Session Initialized. Welcome back, Chief Administrator.');
  };

  const handleAdminSignOut = () => {
    localStorage.removeItem('alphaxen_admin_auth');
    localStorage.removeItem('alphaxen_admin_email');
    setIsAdminAuthenticated(false);
  };

  // User Actions: Approve, Suspend, Toggle Roles
  const handleApproveUser = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const isSeller = u.role === 'seller' || u.role === 'both';
          const isBuyer = u.role === 'buyer' || u.role === 'both';
          return {
            ...u,
            status: 'active',
            canBuy: isBuyer,
            canSell: isSeller
          };
        }
        return u;
      })
    );
    const target = users.find((u) => u.id === userId);
    if (target) {
      // Create auto welcome message
      const newMsg: AdminMessage = {
        id: 'msg-' + Date.now(),
        userId: target.id,
        userName: target.name,
        userEmail: target.email,
        subject: '🎉 Alphaxen Access Approved & Verified',
        body: `Hello ${target.name},\n\nYour account has been officially approved and verified by the Alphaxen Admin Team. You now have full access to ${target.role === 'seller' ? 'sell and publish typefaces' : target.role === 'buyer' ? 'purchase and download licensed font packages' : 'both buyer and seller portals'}.\n\nBest regards,\nAlphaxen Executive Command`,
        sender: 'Alphaxen System Admin',
        timestamp: new Date().toLocaleString(),
        status: 'delivered',
        type: 'approval'
      };
      setMessages((prev) => [newMsg, ...prev]);
    }
    showToast('User successfully approved and access privileges granted.');
  };

  const handleSuspendUser = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          return {
            ...u,
            status: 'suspended',
            canBuy: false,
            canSell: false
          };
        }
        return u;
      })
    );
    showToast('User account suspended and all font licenses locked.', 'error');
  };

  const handleToggleAccess = (userId: string, type: 'buyer' | 'seller') => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          if (type === 'buyer') {
            const nextCanBuy = !u.canBuy;
            return {
              ...u,
              canBuy: nextCanBuy,
              role: nextCanBuy && u.canSell ? 'both' : nextCanBuy ? 'buyer' : u.canSell ? 'seller' : 'buyer'
            };
          } else {
            const nextCanSell = !u.canSell;
            return {
              ...u,
              canSell: nextCanSell,
              role: nextCanSell && u.canBuy ? 'both' : nextCanSell ? 'seller' : u.canBuy ? 'buyer' : 'seller'
            };
          }
        }
        return u;
      })
    );
    showToast(`User ${type} access permissions updated.`);
  };

  const handleDeleteUser = (userId: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== userId));
    setDeleteConfirmUser(null);
    showToast('User record permanently deleted.', 'info');
  };

  // Save User Edit
  const handleSaveUserEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    const normalizedEmail = editingUser.email.trim().toLowerCase();

    setUsers((prev) =>
      prev.map((u) => (u.id === editingUser.id ? { ...editingUser, email: normalizedEmail } : u))
    );
    setEditingUser(null);
    showToast('User profile & permissions updated successfully.');
  };

  // Add New User Handler
  const handleCreateNewUser = (e: React.FormEvent) => {
    e.preventDefault();
    const normalizedEmail = newUserEmail.trim().toLowerCase();
    if (!newUserName || !normalizedEmail) {
      showToast('Name and valid email are required.', 'error');
      return;
    }

    const newUser: AdminUserRecord = {
      id: 'usr-' + Date.now().toString().slice(-4),
      name: newUserName.trim(),
      email: normalizedEmail,
      role: newUserRole,
      status: newUserStatus,
      canBuy: newUserRole === 'buyer' || newUserRole === 'both',
      canSell: newUserRole === 'seller' || newUserRole === 'both',
      joinedDate: new Date().toISOString().split('T')[0],
      lastActive: 'Just registered',
      organization: newUserOrg.trim() || 'Independent',
      country: 'Global',
      purchasedCount: 0,
      uploadedCount: 0,
      totalSpent: 0,
      totalEarnings: 0,
      royaltyRate: 85,
      verifiedBadge: newUserStatus === 'active'
    };

    setUsers((prev) => [newUser, ...prev]);
    setShowAddUserModal(false);
    setNewUserName('');
    setNewUserEmail('');
    setNewUserOrg('');
    showToast(`New user ${newUser.name} registered and provisioned.`);
  };

  // Contact Modal Handlers
  const handleOpenContact = (user: AdminUserRecord) => {
    setContactingUser(user);
    setMessageSubject(`Notice regarding your Alphaxen account (${user.name})`);
    setMessageBody(`Hello ${user.name},\n\nWe are contacting you from the Alphaxen Administration Team regarding your ${user.role === 'seller' ? 'type foundry storefront' : 'buyer license library'}.\n\n`);
    setMessageTemplate('custom');
  };

  const handleApplyTemplate = (templateKey: string) => {
    setMessageTemplate(templateKey);
    if (!contactingUser) return;

    if (templateKey === 'approved') {
      setMessageSubject('🎉 Your Alphaxen Account & Privileges are Approved');
      setMessageBody(`Hello ${contactingUser.name},\n\nWe have reviewed your credentials and are pleased to inform you that your Alphaxen ${contactingUser.role === 'seller' ? 'Foundry Studio' : 'Buyer Vault'} account has been officially approved!\n\nYou can now sign in to access unlimited font specimens, manage licenses, and release typefaces.\n\nBest regards,\nAlphaxen Executive Command`);
    } else if (templateKey === 'kyc') {
      setMessageSubject('🔍 Quality & Specimen Verification Request');
      setMessageBody(`Hello ${contactingUser.name},\n\nOur curation team is currently reviewing your foundry submission. Before finalizing approval, please verify that your font packages include complete OTF, TTF, and WOFF2 webfont formats with full Latin Extended glyph tables.\n\nPlease reply directly to this notice once verified.\n\nBest regards,\nAlphaxen Type Review Board`);
    } else if (templateKey === 'warning') {
      setMessageSubject('⚠️ Important Notice: License Compliance & EULA Review');
      setMessageBody(`Hello ${contactingUser.name},\n\nThis is an official administrative notice regarding activity on your account. Please review the Alphaxen Commercial EULA and ensure all distributed font assets comply with our redistribution policy.\n\nFailure to comply within 48 hours may result in temporary account suspension.\n\nSincerely,\nAlphaxen Legal & Compliance`);
    } else if (templateKey === 'payout') {
      setMessageSubject('💳 Foundry Royalty Settlement & Payout Notice');
      setMessageBody(`Hello ${contactingUser.name},\n\nYour 85% creator royalty distribution has been calculated for the current billing cycle. Please confirm your payout settlement details in the Seller Studio.\n\nThank you for contributing premier typography to the Alphaxen Marketplace!\n\nAlphaxen Finance Ops`);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactingUser || !messageSubject || !messageBody) return;

    const newMsg: AdminMessage = {
      id: 'msg-' + Date.now(),
      userId: contactingUser.id,
      userName: contactingUser.name,
      userEmail: contactingUser.email.toLowerCase(),
      subject: messageSubject,
      body: messageBody,
      sender: 'Alphaxen Head Administrator',
      timestamp: new Date().toLocaleString(),
      status: 'sent',
      type: messageTemplate as any
    };

    setMessages((prev) => [newMsg, ...prev]);
    showToast(`Official message dispatched to ${contactingUser.email}`);
    setContactingUser(null);
  };

  // Font Approval Actions
  const handleApproveFont = (fontId: string) => {
    setPendingFonts((prev) =>
      prev.map((f) => (f.id === fontId ? { ...f, status: 'approved' } : f))
    );
    showToast('Font family approved for live Alphaxen marketplace showroom!');
  };

  const handleRejectFont = (fontId: string) => {
    setPendingFonts((prev) =>
      prev.map((f) => (f.id === fontId ? { ...f, status: 'rejected' } : f))
    );
    showToast('Font submission rejected and feedback sent to designer.', 'info');
  };

  // Filtered Users List
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      // Role / Status filter
      if (roleFilter === 'buyer' && u.role !== 'buyer' && u.role !== 'both') return false;
      if (roleFilter === 'seller' && u.role !== 'seller' && u.role !== 'both') return false;
      if (roleFilter === 'pending' && u.status !== 'pending') return false;
      if (roleFilter === 'suspended' && u.status !== 'suspended') return false;

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = u.name.toLowerCase().includes(q);
        const matchesEmail = u.email.toLowerCase().includes(q);
        const matchesOrg = u.organization?.toLowerCase().includes(q) || false;
        const matchesCountry = u.country?.toLowerCase().includes(q) || false;
        return matchesName || matchesEmail || matchesOrg || matchesCountry;
      }
      return true;
    });
  }, [users, roleFilter, searchQuery]);

  // Statistics
  const stats = useMemo(() => {
    const totalUsers = users.length;
    const pendingCount = users.filter((u) => u.status === 'pending').length;
    const buyerCount = users.filter((u) => u.canBuy).length;
    const sellerCount = users.filter((u) => u.canSell).length;
    const totalMarketplaceVolume = users.reduce((acc, u) => acc + u.totalSpent, 0);
    const totalCreatorRoyalties = users.reduce((acc, u) => acc + u.totalEarnings, 0);

    return {
      totalUsers,
      pendingCount,
      buyerCount,
      sellerCount,
      totalMarketplaceVolume,
      totalCreatorRoyalties
    };
  }, [users]);

  // ==========================================
  // UN-AUTHENTICATED ADMIN LOGIN VIEW
  // ==========================================
  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-screen bg-[#070a13] text-slate-100 flex flex-col justify-center items-center px-4 sm:px-6 py-16 relative overflow-hidden selection:bg-cyan-500/30">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-indigo-600/20 via-purple-600/20 to-cyan-500/15 blur-[140px] -z-10 pointer-events-none" />

        <div className="w-full max-w-md space-y-8 animate-slide-up relative z-10">
          <div className="text-center space-y-3">
            <div className="flex justify-center mb-2">
              <BrandMark mode="large" suffix="ADMINISTRATION GATEWAY" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white font-grotesk">
              Admin Command Console
            </h1>
            <p className="text-slate-300 text-sm font-medium max-w-sm mx-auto leading-relaxed">
              Authenticate with administrative credentials to manage type buyers, foundry creators, approvals, and font distribution.
            </p>
          </div>

          <div className="liquid-glass p-8 sm:p-10 rounded-[2.5rem] shadow-2xl space-y-6 relative overflow-hidden">
            {authError && (
              <div className="p-4 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-200 text-xs font-bold text-center">
                {authError}
              </div>
            )}

            <form onSubmit={handleAdminLogin} className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-200 flex justify-between">
                  <span>Admin Email</span>
                  <span className="text-[11px] font-normal text-slate-400">Strictly lowercase</span>
                </label>
                <div className="relative group">
                  <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-cyan-400 transition-colors" />
                  <input
                    type="email"
                    required
                    autoCapitalize="none"
                    autoCorrect="off"
                    spellCheck={false}
                    value={adminLoginEmail}
                    onChange={(e) => setAdminLoginEmail(e.target.value.toLowerCase())}
                    placeholder="Enter admin email address"
                    className="w-full liquid-glass-inset rounded-2xl pl-12 pr-4 py-4 text-sm text-white placeholder-slate-500 font-semibold focus:outline-none focus:border-cyan-500/60 focus:ring-2 focus:ring-cyan-500/20 transition-all lowercase"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-200 flex justify-between items-center">
                  <span>Master Password</span>
                  <button
                    type="button"
                    onClick={() => setShowAdminPassword(!showAdminPassword)}
                    className="text-[11px] font-semibold text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    {showAdminPassword ? <EyeOff size={13} /> : <Eye size={13} />}
                    <span>{showAdminPassword ? 'Hide' : 'Show'}</span>
                  </button>
                </label>
                <div className="relative group">
                  <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-400 transition-colors" />
                  <input
                    type={showAdminPassword ? 'text' : 'password'}
                    placeholder="Enter master password"
                    value={adminLoginPassword}
                    onChange={(e) => setAdminLoginPassword(e.target.value)}
                    className="w-full liquid-glass-inset rounded-2xl pl-12 pr-12 py-4 text-sm text-white placeholder-slate-500 font-semibold focus:outline-none focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowAdminPassword(!showAdminPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors cursor-pointer"
                    title={showAdminPassword ? 'Hide password' : 'Show password'}
                  >
                    {showAdminPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full neu-btn-primary h-14 rounded-2xl font-black uppercase tracking-[0.25em] text-xs text-white shadow-2xl flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer mt-2"
              >
                <ShieldCheck size={18} />
                <span>Enter Admin Console</span>
              </button>
            </form>
          </div>

          <div className="text-center">
            <Link
              to="/"
              className="neu-btn inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-slate-300 hover:text-white transition-all shadow-md hover:scale-105"
            >
              <ArrowRight size={14} className="rotate-180" />
              <span>Return to Public Website</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // AUTHENTICATED ADMIN DASHBOARD
  // ==========================================
  return (
    <div className="min-h-screen bg-[#070a13] text-slate-100 flex flex-col selection:bg-indigo-500/30">
      
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-6 py-4 rounded-2xl shadow-2xl border backdrop-blur-xl flex items-center gap-3 animate-slide-up text-sm font-bold ${
            toast.type === 'error'
              ? 'bg-rose-950/90 border-rose-500/40 text-rose-200'
              : toast.type === 'info'
              ? 'bg-cyan-950/90 border-cyan-500/40 text-cyan-200'
              : 'bg-emerald-950/90 border-emerald-500/40 text-emerald-200'
          }`}
        >
          {toast.type === 'error' ? <AlertTriangle size={18} /> : <CheckCircle2 size={18} />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* TOP NAVIGATION BAR */}
      <header className="sticky top-0 z-40 bg-[#070a13]/85 backdrop-blur-2xl border-b border-white/10 px-4 sm:px-8 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <BrandMark mode="compact" suffix="COMMAND CONSOLE" />
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-[10px] font-black tracking-widest uppercase text-cyan-300">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              SYSTEM ACTIVE
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/shop"
              className="neu-btn px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-300 hover:text-white flex items-center gap-2"
            >
              <ExternalLink size={14} />
              <span>Public Store</span>
            </Link>

            <Link
              to="/buyer"
              className="neu-btn px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-cyan-300 hover:text-white flex items-center gap-2"
            >
              <ShoppingBag size={14} />
              <span>Buyer Vault</span>
            </Link>

            <Link
              to="/seller"
              className="neu-btn px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-purple-300 hover:text-white flex items-center gap-2"
            >
              <Layers size={14} />
              <span>Seller Studio</span>
            </Link>

            <button
              onClick={handleAdminSignOut}
              className="neu-btn px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-rose-400 hover:text-rose-300 flex items-center gap-1.5 cursor-pointer"
              title="Sign Out of Admin Console"
            >
              <LogOut size={15} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-8 space-y-8">
        
        {/* TOP STATS CARDS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="liquid-glass p-6 rounded-3xl space-y-2 border-indigo-500/20">
            <div className="flex justify-between items-center text-slate-400 text-xs font-bold uppercase tracking-wider">
              <span>Total Accounts</span>
              <Users size={16} className="text-indigo-400" />
            </div>
            <div className="text-3xl font-black text-white font-grotesk">{stats.totalUsers}</div>
            <div className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
              <span className="text-cyan-400">{stats.buyerCount} Buyers</span> • <span className="text-purple-400">{stats.sellerCount} Sellers</span>
            </div>
          </div>

          <div className="liquid-glass p-6 rounded-3xl space-y-2 border-purple-500/20">
            <div className="flex justify-between items-center text-slate-400 text-xs font-bold uppercase tracking-wider">
              <span>Pending Approvals</span>
              <Clock size={16} className="text-purple-400" />
            </div>
            <div className="text-3xl font-black text-purple-300 font-grotesk">{stats.pendingCount}</div>
            <div className="text-[11px] font-semibold text-purple-400/90">
              {stats.pendingCount > 0 ? 'Action required in queue' : 'All users verified'}
            </div>
          </div>

          <div className="liquid-glass p-6 rounded-3xl space-y-2 border-cyan-500/20">
            <div className="flex justify-between items-center text-slate-400 text-xs font-bold uppercase tracking-wider">
              <span>Marketplace Volume</span>
              <DollarSign size={16} className="text-cyan-400" />
            </div>
            <div className="text-3xl font-black text-cyan-300 font-grotesk">${stats.totalMarketplaceVolume.toLocaleString()}</div>
            <div className="text-[11px] font-semibold text-slate-400">Total lifetime font sales</div>
          </div>

          <div className="liquid-glass p-6 rounded-3xl space-y-2 border-purple-500/20">
            <div className="flex justify-between items-center text-slate-400 text-xs font-bold uppercase tracking-wider">
              <span>Creator Royalties (85%)</span>
              <Sparkles size={16} className="text-purple-400" />
            </div>
            <div className="text-3xl font-black text-purple-300 font-grotesk">${stats.totalCreatorRoyalties.toLocaleString()}</div>
            <div className="text-[11px] font-semibold text-slate-400">Dispatched to designers</div>
          </div>
        </div>

        {/* CONTROLS HEADER & SEARCH */}
        <div className="liquid-glass p-6 rounded-3xl space-y-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            
            {/* Nav Tabs */}
            <div className="flex flex-wrap items-center gap-2 p-1.5 liquid-glass-inset rounded-2xl">
              <button
                onClick={() => setActiveTab('users')}
                className={`py-2.5 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
                  activeTab === 'users'
                    ? 'neu-btn-primary text-white shadow-lg'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Users size={14} />
                <span>All Users ({users.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('approvals')}
                className={`py-2.5 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
                  activeTab === 'approvals'
                    ? 'neu-btn-cyan text-slate-900 shadow-lg'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Clock size={14} />
                <span>Pending Approvals ({stats.pendingCount})</span>
              </button>

              <button
                onClick={() => setActiveTab('fonts')}
                className={`py-2.5 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
                  activeTab === 'fonts'
                    ? 'neu-btn-primary text-white shadow-lg'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Layers size={14} />
                <span>Font Submissions ({pendingFonts.filter(f => f.status === 'pending').length})</span>
              </button>

              <button
                onClick={() => setActiveTab('messages')}
                className={`py-2.5 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
                  activeTab === 'messages'
                    ? 'neu-btn-primary text-white shadow-lg'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <MessageSquare size={14} />
                <span>Message History ({messages.length})</span>
              </button>
            </div>

            {/* Top Action: Add User */}
            <button
              onClick={() => setShowAddUserModal(true)}
              className="neu-btn-cyan py-3 px-5 rounded-2xl text-xs font-black uppercase tracking-wider text-slate-950 flex items-center gap-2 shadow-xl hover:scale-105 transition-all cursor-pointer"
            >
              <UserPlus size={16} />
              <span>Register User / Creator</span>
            </button>
          </div>

          {/* Search & Filter Bar (Only on Users / Approvals tabs) */}
          {(activeTab === 'users' || activeTab === 'approvals') && (
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-2 border-t border-white/10">
              <div className="relative flex-1 w-full">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by user name, studio, email address, or country..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full liquid-glass-inset rounded-2xl pl-12 pr-4 py-3.5 text-xs text-white placeholder-slate-500 font-semibold focus:outline-none focus:border-cyan-500/60"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
                  >
                    Clear
                  </button>
                )}
              </div>

              {activeTab === 'users' && (
                <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
                  <span className="text-[11px] font-bold text-slate-400 uppercase mr-1">Filter:</span>
                  {(['all', 'buyer', 'seller', 'pending', 'suspended'] as const).map((filterKey) => (
                    <button
                      key={filterKey}
                      onClick={() => setRoleFilter(filterKey)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                        roleFilter === filterKey
                          ? 'neu-btn-primary text-white shadow-md'
                          : 'neu-btn text-slate-400 hover:text-white'
                      }`}
                    >
                      {filterKey === 'all' ? 'All' : filterKey}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ========================================== */}
        {/* TAB 1: ALL USERS & ACCESS MANAGEMENT       */}
        {/* ========================================== */}
        {activeTab === 'users' && (
          <div className="liquid-glass rounded-3xl overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-white/10 flex justify-between items-center">
              <div>
                <h2 className="text-lg font-black uppercase tracking-tight text-white font-grotesk">
                  User Accounts Directory ({filteredUsers.length})
                </h2>
                <p className="text-xs text-slate-300 font-medium">
                  Approve, suspend, or manage buyer purchasing and seller foundry publishing privileges.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/10 bg-white/[0.02] text-slate-400 uppercase tracking-wider text-[10px] font-black">
                    <th className="py-4 px-6">User / Studio</th>
                    <th className="py-4 px-6">Role & Permissions</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6">Activity / Spend</th>
                    <th className="py-4 px-6 text-right">Admin Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-medium">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-slate-400 font-semibold">
                        No accounts found matching your query.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-white/[0.03] transition-colors group">
                        
                        {/* User identity & email */}
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-black flex items-center justify-center font-grotesk text-sm shadow-md">
                              {user.name.charAt(0)}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-white text-sm">{user.name}</span>
                                {user.verifiedBadge && (
                                  <ShieldCheck size={14} className="text-cyan-400" title="Verified Account" />
                                )}
                              </div>
                              <div className="text-slate-400 text-xs font-mono lowercase">{user.email}</div>
                              <div className="text-[10px] text-slate-500">{user.organization || 'Independent'} • {user.country || 'Global'}</div>
                            </div>
                          </div>
                        </td>

                        {/* Role & Access Toggles */}
                        <td className="py-4 px-6">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              {user.role === 'both' ? (
                                <span className="px-2.5 py-1 rounded-lg bg-purple-500/20 text-purple-300 font-black text-[10px] uppercase tracking-wider border border-purple-500/30">
                                  Buyer + Seller
                                </span>
                              ) : user.role === 'seller' ? (
                                <span className="px-2.5 py-1 rounded-lg bg-purple-500/20 text-purple-300 font-black text-[10px] uppercase tracking-wider border border-purple-500/30">
                                  Foundry Seller
                                </span>
                              ) : (
                                <span className="px-2.5 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 font-black text-[10px] uppercase tracking-wider border border-cyan-500/30">
                                  Type Buyer
                                </span>
                              )}
                            </div>

                            {/* Live Permission Switches */}
                            <div className="flex items-center gap-2 text-[11px]">
                              <button
                                onClick={() => handleToggleAccess(user.id, 'buyer')}
                                className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
                                  user.canBuy
                                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/30'
                                    : 'bg-slate-800 text-slate-500 hover:text-slate-300'
                                }`}
                                title="Toggle Buyer Access"
                              >
                                {user.canBuy ? '✓ Buyer Active' : '✕ Buyer Locked'}
                              </button>

                              <button
                                onClick={() => handleToggleAccess(user.id, 'seller')}
                                className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
                                  user.canSell
                                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 hover:bg-purple-500/30'
                                    : 'bg-slate-800 text-slate-500 hover:text-slate-300'
                                }`}
                                title="Toggle Seller Access"
                              >
                                {user.canSell ? '✓ Seller Active' : '✕ Seller Locked'}
                              </button>
                            </div>
                          </div>
                        </td>

                        {/* Status Badge */}
                        <td className="py-4 px-6">
                          {user.status === 'active' && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-black text-[10px] uppercase tracking-wider">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                              Approved
                            </span>
                          )}
                          {user.status === 'pending' && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 font-black text-[10px] uppercase tracking-wider animate-pulse">
                              <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                              Pending Approval
                            </span>
                          )}
                          {user.status === 'suspended' && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 font-black text-[10px] uppercase tracking-wider">
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                              Suspended
                            </span>
                          )}
                        </td>

                        {/* Metrics: Spend / Earnings */}
                        <td className="py-4 px-6">
                          <div className="space-y-1">
                            <div className="text-white font-bold">
                              {user.purchasedCount > 0 && <span>${user.totalSpent} Spent ({user.purchasedCount} Fonts)</span>}
                              {user.uploadedCount > 0 && <span className="block text-purple-300">${user.totalEarnings} Earned ({user.uploadedCount} Released)</span>}
                              {user.purchasedCount === 0 && user.uploadedCount === 0 && <span className="text-slate-500">No activity yet</span>}
                            </div>
                            <div className="text-[10px] text-slate-400">Joined: {user.joinedDate}</div>
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            
                            {/* Contact Buyer/Seller */}
                            <button
                              onClick={() => handleOpenContact(user)}
                              className="neu-btn p-2.5 rounded-xl text-cyan-300 hover:text-white hover:border-cyan-500/50 transition-all cursor-pointer"
                              title={`Contact ${user.name}`}
                            >
                              <Mail size={15} />
                            </button>

                            {/* Fast Approve / Suspend Toggle */}
                            {user.status === 'pending' ? (
                              <button
                                onClick={() => handleApproveUser(user.id)}
                                className="neu-btn-cyan px-3 py-2 rounded-xl text-[11px] font-black uppercase tracking-wider text-slate-950 flex items-center gap-1 shadow-md cursor-pointer hover:scale-105"
                                title="Approve User Account"
                              >
                                <Check size={14} />
                                <span>Approve</span>
                              </button>
                            ) : user.status === 'suspended' ? (
                              <button
                                onClick={() => handleApproveUser(user.id)}
                                className="neu-btn px-3 py-2 rounded-xl text-[11px] font-bold text-emerald-400 hover:text-white flex items-center gap-1 cursor-pointer"
                                title="Re-activate Account"
                              >
                                <CheckCircle2 size={14} />
                                <span>Restore</span>
                              </button>
                            ) : (
                              <button
                                onClick={() => handleSuspendUser(user.id)}
                                className="neu-btn p-2.5 rounded-xl text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-all cursor-pointer"
                                title="Suspend Account Access"
                              >
                                <UserX size={15} />
                              </button>
                            )}

                            {/* Edit Data */}
                            <button
                              onClick={() => setEditingUser(user)}
                              className="neu-btn p-2.5 rounded-xl text-slate-300 hover:text-white transition-all cursor-pointer"
                              title="Edit User Details & Roles"
                            >
                              <Edit3 size={15} />
                            </button>

                            {/* Delete User */}
                            <button
                              onClick={() => setDeleteConfirmUser(user)}
                              className="neu-btn p-2.5 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all cursor-pointer"
                              title="Permanently Delete User"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================== */}
        {/* TAB 2: PENDING APPROVALS QUEUE            */}
        {/* ========================================== */}
        {activeTab === 'approvals' && (
          <div className="space-y-6">
            <div className="liquid-glass p-6 rounded-3xl flex justify-between items-center">
              <div>
                <h2 className="text-xl font-black uppercase tracking-tight text-white font-grotesk flex items-center gap-2">
                  <Clock className="text-purple-400" />
                  <span>Pending Approval Queue</span>
                </h2>
                <p className="text-xs text-slate-300 font-medium">
                  Review new buyer organizations and foundry creators requesting platform licensing and release rights.
                </p>
              </div>

              {users.filter((u) => u.status === 'pending').length > 0 && (
                <button
                  onClick={() => {
                    users.filter((u) => u.status === 'pending').forEach((u) => handleApproveUser(u.id));
                    showToast('All pending applicants approved successfully!');
                  }}
                  className="neu-btn-cyan py-3 px-5 rounded-2xl text-xs font-black uppercase tracking-wider text-slate-950 shadow-xl cursor-pointer hover:scale-105"
                >
                  Approve All Pending ({users.filter((u) => u.status === 'pending').length})
                </button>
              )}
            </div>

            {users.filter((u) => u.status === 'pending').length === 0 ? (
              <div className="liquid-glass p-16 rounded-3xl text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto shadow-xl">
                  <CheckCircle2 size={32} />
                </div>
                <h3 className="text-xl font-black text-white font-grotesk">Queue is Clear</h3>
                <p className="text-slate-400 text-xs max-w-sm mx-auto">
                  All buyer and seller applications have been verified. New registrations will automatically appear here for review.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {users
                  .filter((u) => u.status === 'pending')
                  .map((user) => (
                    <div key={user.id} className="liquid-glass p-6 rounded-3xl space-y-4 border-purple-500/30 shadow-2xl relative">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white font-black flex items-center justify-center font-grotesk text-base shadow-lg">
                            {user.name.charAt(0)}
                          </div>
                          <div>
                            <h3 className="font-black text-white text-base font-grotesk">{user.name}</h3>
                            <p className="text-xs font-mono text-cyan-300 lowercase">{user.email}</p>
                            <p className="text-[11px] text-slate-400">{user.organization || 'Independent'} • {user.country || 'Global'}</p>
                          </div>
                        </div>

                        <span className="px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 text-[10px] font-black uppercase tracking-wider">
                          {user.role === 'seller' ? 'Foundry Applicant' : 'Buyer Tier Applicant'}
                        </span>
                      </div>

                      {user.notes && (
                        <div className="liquid-glass-inset p-3 rounded-xl text-xs text-slate-300 italic">
                          "{user.notes}"
                        </div>
                      )}

                      <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-3">
                        <button
                          onClick={() => handleOpenContact(user)}
                          className="neu-btn px-4 py-2.5 rounded-xl text-xs font-bold text-slate-300 hover:text-white flex items-center gap-1.5 cursor-pointer"
                        >
                          <Mail size={14} />
                          <span>Contact / Request KYC</span>
                        </button>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleSuspendUser(user.id)}
                            className="neu-btn px-4 py-2.5 rounded-xl text-xs font-bold text-rose-400 hover:text-rose-300 cursor-pointer"
                          >
                            Reject
                          </button>
                          <button
                            onClick={() => handleApproveUser(user.id)}
                            className="neu-btn-cyan px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider text-slate-950 flex items-center gap-1.5 shadow-lg cursor-pointer hover:scale-105"
                          >
                            <Check size={15} />
                            <span>Approve Account</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================== */}
        {/* TAB 3: FONT SUBMISSIONS APPROVAL           */}
        {/* ========================================== */}
        {activeTab === 'fonts' && (
          <div className="space-y-6">
            <div className="liquid-glass p-6 rounded-3xl flex justify-between items-center">
              <div>
                <h2 className="text-xl font-black uppercase tracking-tight text-white font-grotesk flex items-center gap-2">
                  <Layers className="text-purple-400" />
                  <span>Font Family Marketplace Submissions</span>
                </h2>
                <p className="text-xs text-slate-300 font-medium">
                  Review new typeface releases submitted by independent creators before publishing to the live catalog.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pendingFonts.map((font) => (
                <div key={font.id} className="liquid-glass p-6 rounded-3xl space-y-5 shadow-2xl relative">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-black text-white font-grotesk">{font.name}</h3>
                        <span className="px-2.5 py-0.5 rounded-md bg-purple-500/20 text-purple-300 text-[10px] font-black uppercase tracking-wider border border-purple-500/30">
                          {font.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 font-medium">By <strong className="text-white">{font.foundry}</strong> ({font.sellerEmail})</p>
                    </div>

                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                      font.status === 'approved'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : font.status === 'rejected'
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                        : 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                    }`}>
                      {font.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="liquid-glass-inset p-2.5 rounded-xl">
                      <div className="text-[10px] text-slate-400 uppercase font-black">Styles</div>
                      <div className="text-sm font-black text-white">{font.stylesCount} Weights</div>
                    </div>
                    <div className="liquid-glass-inset p-2.5 rounded-xl">
                      <div className="text-[10px] text-slate-400 uppercase font-black">Commercial</div>
                      <div className="text-sm font-black text-cyan-300">${font.commercialPrice}</div>
                    </div>
                    <div className="liquid-glass-inset p-2.5 rounded-xl">
                      <div className="text-[10px] text-slate-400 uppercase font-black">Royalty (85%)</div>
                      <div className="text-sm font-black text-purple-300">${Math.round(font.commercialPrice * 0.85)}</div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-3">
                    <button
                      onClick={() => {
                        const sellerUser = users.find((u) => u.email.toLowerCase() === font.sellerEmail.toLowerCase()) || {
                          id: 'usr-tmp',
                          name: font.foundry,
                          email: font.sellerEmail,
                          role: 'seller',
                          status: 'active',
                          canBuy: true,
                          canSell: true,
                          joinedDate: '2026-09-01',
                          lastActive: 'Recently',
                          purchasedCount: 0,
                          uploadedCount: 1,
                          totalSpent: 0,
                          totalEarnings: 0,
                          royaltyRate: 85
                        };
                        handleOpenContact(sellerUser);
                      }}
                      className="neu-btn px-4 py-2.5 rounded-xl text-xs font-bold text-slate-300 hover:text-white flex items-center gap-1.5 cursor-pointer"
                    >
                      <Mail size={14} />
                      <span>Contact Foundry</span>
                    </button>

                    {font.status === 'pending' && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleRejectFont(font.id)}
                          className="neu-btn px-4 py-2.5 rounded-xl text-xs font-bold text-rose-400 hover:text-rose-300 cursor-pointer"
                        >
                          Request Edits
                        </button>
                        <button
                          onClick={() => handleApproveFont(font.id)}
                          className="neu-btn-primary px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider text-white shadow-lg cursor-pointer hover:scale-105"
                        >
                          Approve Release
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================== */}
        {/* TAB 4: MESSAGE & CONTACT HISTORY           */}
        {/* ========================================== */}
        {activeTab === 'messages' && (
          <div className="space-y-6">
            <div className="liquid-glass p-6 rounded-3xl flex justify-between items-center">
              <div>
                <h2 className="text-xl font-black uppercase tracking-tight text-white font-grotesk flex items-center gap-2">
                  <MessageSquare className="text-cyan-400" />
                  <span>Admin Contact & Dispatch Log</span>
                </h2>
                <p className="text-xs text-slate-300 font-medium">
                  Audit trail of all administrative notices, approval congratulations, and compliance warnings sent to buyers & sellers.
                </p>
              </div>

              <span className="px-4 py-2 rounded-xl liquid-glass-inset text-xs font-bold text-slate-300">
                {messages.length} Dispatches Recorded
              </span>
            </div>

            <div className="space-y-4">
              {messages.length === 0 ? (
                <div className="liquid-glass p-12 text-center text-slate-400 font-semibold rounded-3xl">
                  No outgoing messages recorded yet. Click "Contact" on any user profile to send an official dispatch.
                </div>
              ) : (
                messages.map((msg) => (
                  <div key={msg.id} className="liquid-glass p-6 rounded-3xl space-y-3 shadow-xl">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                          msg.type === 'approval'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : msg.type === 'warning'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                        }`}>
                          {msg.type}
                        </span>
                        <h4 className="font-bold text-white text-sm">{msg.subject}</h4>
                      </div>
                      <span className="text-[11px] font-mono text-slate-400">{msg.timestamp}</span>
                    </div>

                    <div className="text-xs text-slate-400">
                      To: <strong className="text-slate-200">{msg.userName}</strong> (<span className="font-mono text-cyan-300 lowercase">{msg.userEmail}</span>) • From: {msg.sender}
                    </div>

                    <div className="liquid-glass-inset p-4 rounded-2xl text-xs text-slate-200 whitespace-pre-line leading-relaxed font-mono">
                      {msg.body}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </main>

      {/* ========================================== */}
      {/* MODAL: CONTACT BUYER OR SELLER             */}
      {/* ========================================== */}
      {contactingUser && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-2xl flex items-center justify-center p-4 animate-fade-in">
          <div className="liquid-glass p-8 sm:p-10 rounded-[2.5rem] max-w-2xl w-full relative shadow-2xl space-y-6 animate-slide-up max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setContactingUser(null)}
              className="absolute top-6 right-6 p-2 rounded-xl neu-btn text-slate-400 hover:text-white"
            >
              <X size={18} />
            </button>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 py-1 px-3.5 rounded-full liquid-glass-sm text-[9px] font-black uppercase tracking-[0.2em] text-cyan-300">
                <Send size={12} />
                OFFICIAL ADMINISTRATIVE DISPATCH
              </div>
              <h3 className="text-2xl font-black text-white font-grotesk">
                Contact {contactingUser.name}
              </h3>
              <p className="text-slate-300 text-xs font-medium">
                Recipient Email: <strong className="text-cyan-300 font-mono lowercase">{contactingUser.email}</strong> • Role: <span className="uppercase">{contactingUser.role}</span>
              </p>
            </div>

            {/* Template Selector */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                Choose Dispatch Template:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { key: 'approved', label: '🎉 Approval Notice' },
                  { key: 'kyc', label: '🔍 Specimen Verification' },
                  { key: 'warning', label: '⚠️ EULA Warning' },
                  { key: 'payout', label: '💳 Royalty Settlement' }
                ].map((tpl) => (
                  <button
                    key={tpl.key}
                    type="button"
                    onClick={() => handleApplyTemplate(tpl.key)}
                    className={`p-2.5 rounded-xl text-[11px] font-bold text-left transition-all cursor-pointer ${
                      messageTemplate === tpl.key
                        ? 'neu-btn-primary text-white'
                        : 'neu-btn text-slate-400 hover:text-white'
                    }`}
                  >
                    {tpl.label}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSendMessage} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-200">
                  Subject Line
                </label>
                <input
                  type="text"
                  required
                  value={messageSubject}
                  onChange={(e) => setMessageSubject(e.target.value)}
                  className="w-full liquid-glass-inset rounded-2xl px-4 py-3 text-sm text-white font-semibold focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-200">
                  Message Body
                </label>
                <textarea
                  rows={6}
                  required
                  value={messageBody}
                  onChange={(e) => setMessageBody(e.target.value)}
                  className="w-full liquid-glass-inset rounded-2xl p-4 text-xs text-white font-mono focus:outline-none focus:border-cyan-500 leading-relaxed"
                />
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <a
                  href={`mailto:${contactingUser.email}?subject=${encodeURIComponent(messageSubject)}&body=${encodeURIComponent(messageBody)}`}
                  className="neu-btn px-5 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-300 hover:text-white flex items-center gap-2 w-full sm:w-auto justify-center"
                  target="_blank"
                  rel="noreferrer"
                >
                  <ExternalLink size={14} />
                  <span>Open in Mail Client</span>
                </a>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => setContactingUser(null)}
                    className="neu-btn px-5 py-3.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white cursor-pointer w-full sm:w-auto"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="neu-btn-cyan px-6 py-3.5 rounded-xl text-xs font-black uppercase tracking-wider text-slate-950 flex items-center justify-center gap-2 shadow-xl hover:scale-105 transition-all cursor-pointer w-full sm:w-auto"
                  >
                    <Send size={15} />
                    <span>Send & Record Dispatch</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* MODAL: EDIT USER DATA & PERMISSIONS        */}
      {/* ========================================== */}
      {editingUser && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-2xl flex items-center justify-center p-4 animate-fade-in">
          <div className="liquid-glass p-8 sm:p-10 rounded-[2.5rem] max-w-xl w-full relative shadow-2xl space-y-6 animate-slide-up max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setEditingUser(null)}
              className="absolute top-6 right-6 p-2 rounded-xl neu-btn text-slate-400 hover:text-white"
            >
              <X size={18} />
            </button>

            <div className="space-y-1">
              <h3 className="text-2xl font-black text-white font-grotesk">
                Edit User Profile & Access
              </h3>
              <p className="text-xs text-slate-300">
                Update licensee credentials, account status, and platform privileges for <strong className="text-white">{editingUser.name}</strong>.
              </p>
            </div>

            <form onSubmit={handleSaveUserEdit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-200">
                    Full Name / Studio
                  </label>
                  <input
                    type="text"
                    required
                    value={editingUser.name}
                    onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                    className="w-full liquid-glass-inset rounded-2xl px-4 py-3 text-xs text-white font-semibold focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-200">
                    Email Address (Normalized)
                  </label>
                  <input
                    type="email"
                    required
                    autoCapitalize="none"
                    autoCorrect="off"
                    spellCheck={false}
                    value={editingUser.email}
                    onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value.toLowerCase() })}
                    className="w-full liquid-glass-inset rounded-2xl px-4 py-3 text-xs text-white font-semibold focus:outline-none focus:border-cyan-500 lowercase"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-200">
                    Organization / Company
                  </label>
                  <input
                    type="text"
                    value={editingUser.organization || ''}
                    onChange={(e) => setEditingUser({ ...editingUser, organization: e.target.value })}
                    placeholder="e.g. Acme Media Corp"
                    className="w-full liquid-glass-inset rounded-2xl px-4 py-3 text-xs text-white font-semibold focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-200">
                    Account Status
                  </label>
                  <select
                    value={editingUser.status}
                    onChange={(e) => setEditingUser({ ...editingUser, status: e.target.value as UserStatus })}
                    className="w-full liquid-glass-inset rounded-2xl px-4 py-3 text-xs text-white font-semibold focus:outline-none focus:border-cyan-500 bg-[#0d1222]"
                  >
                    <option value="active">Active (Approved)</option>
                    <option value="pending">Pending Approval</option>
                    <option value="suspended">Suspended (Locked)</option>
                  </select>
                </div>
              </div>

              {/* Permission checkboxes */}
              <div className="p-4 rounded-2xl liquid-glass-inset space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Platform Access Privileges:
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <label className="flex items-center gap-2 text-xs text-slate-200 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={editingUser.canBuy}
                      onChange={(e) => setEditingUser({ ...editingUser, canBuy: e.target.checked })}
                      className="rounded accent-cyan-500 w-4 h-4"
                    />
                    <span>Allow Buyer Access (Vault)</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs text-slate-200 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={editingUser.canSell}
                      onChange={(e) => setEditingUser({ ...editingUser, canSell: e.target.checked })}
                      className="rounded accent-purple-500 w-4 h-4"
                    />
                    <span>Allow Seller Access (Foundry)</span>
                  </label>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-200">
                  Internal Administrative Notes
                </label>
                <textarea
                  rows={3}
                  value={editingUser.notes || ''}
                  onChange={(e) => setEditingUser({ ...editingUser, notes: e.target.value })}
                  placeholder="Notes on contracts, license scope, or verification history..."
                  className="w-full liquid-glass-inset rounded-2xl p-3 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex justify-end items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="neu-btn px-5 py-3 rounded-xl text-xs font-bold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="neu-btn-primary px-6 py-3 rounded-xl text-xs font-black uppercase tracking-wider text-white shadow-xl hover:scale-105"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* MODAL: REGISTER NEW USER / CREATOR        */}
      {/* ========================================== */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-2xl flex items-center justify-center p-4 animate-fade-in">
          <div className="liquid-glass p-8 sm:p-10 rounded-[2.5rem] max-w-lg w-full relative shadow-2xl space-y-6 animate-slide-up">
            <button
              onClick={() => setShowAddUserModal(false)}
              className="absolute top-6 right-6 p-2 rounded-xl neu-btn text-slate-400 hover:text-white"
            >
              <X size={18} />
            </button>

            <div className="space-y-1">
              <h3 className="text-2xl font-black text-white font-grotesk">
                Provision New User Account
              </h3>
              <p className="text-xs text-slate-300">
                Directly onboard an agency buyer, independent studio, or verified type designer.
              </p>
            </div>

            <form onSubmit={handleCreateNewUser} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-200">
                  Full Name / Studio Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apex Type Foundry"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  className="w-full liquid-glass-inset rounded-2xl px-4 py-3 text-xs text-white font-semibold focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-200">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                  placeholder="designer@company.com"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value.toLowerCase())}
                  className="w-full liquid-glass-inset rounded-2xl px-4 py-3 text-xs text-white font-semibold focus:outline-none focus:border-cyan-500 lowercase"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-200">
                    Account Role
                  </label>
                  <select
                    value={newUserRole}
                    onChange={(e) => setNewUserRole(e.target.value as UserRole)}
                    className="w-full liquid-glass-inset rounded-2xl px-4 py-3 text-xs text-white font-semibold focus:outline-none focus:border-cyan-500 bg-[#0d1222]"
                  >
                    <option value="buyer">Type Buyer</option>
                    <option value="seller">Type Foundry (Seller)</option>
                    <option value="both">Both (Buyer + Seller)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-200">
                    Initial Status
                  </label>
                  <select
                    value={newUserStatus}
                    onChange={(e) => setNewUserStatus(e.target.value as UserStatus)}
                    className="w-full liquid-glass-inset rounded-2xl px-4 py-3 text-xs text-white font-semibold focus:outline-none focus:border-cyan-500 bg-[#0d1222]"
                  >
                    <option value="active">Approved (Instant Access)</option>
                    <option value="pending">Pending Approval</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-200">
                  Organization / Studio (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Apex Design Labs"
                  value={newUserOrg}
                  onChange={(e) => setNewUserOrg(e.target.value)}
                  className="w-full liquid-glass-inset rounded-2xl px-4 py-3 text-xs text-white font-semibold focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex justify-end items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="neu-btn px-5 py-3 rounded-xl text-xs font-bold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="neu-btn-cyan px-6 py-3 rounded-xl text-xs font-black uppercase tracking-wider text-slate-950 shadow-xl hover:scale-105"
                >
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* MODAL: CONFIRM DELETE USER                 */}
      {/* ========================================== */}
      {deleteConfirmUser && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-2xl flex items-center justify-center p-4 animate-fade-in">
          <div className="liquid-glass p-8 rounded-3xl max-w-md w-full text-center space-y-6 animate-slide-up border-rose-500/40">
            <div className="w-16 h-16 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center mx-auto shadow-lg">
              <AlertTriangle size={32} />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-black text-white font-grotesk">
                Delete Account: {deleteConfirmUser.name}?
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Are you sure you want to permanently delete <strong className="text-white">{deleteConfirmUser.email}</strong>? All associated font licenses, studio submissions, and token keys will be removed.
              </p>
            </div>

            <div className="flex justify-center items-center gap-3">
              <button
                onClick={() => setDeleteConfirmUser(null)}
                className="neu-btn px-5 py-3 rounded-xl text-xs font-bold text-slate-300 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteUser(deleteConfirmUser.id)}
                className="bg-rose-600 hover:bg-rose-500 text-white font-black text-xs uppercase tracking-wider px-6 py-3 rounded-xl shadow-lg hover:scale-105 transition-all"
              >
                Yes, Delete User
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Admin;
