import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Upload, DollarSign, TrendingUp, BarChart3, Plus,
  Layers, CheckCircle2, AlertCircle, Edit, Trash2,
  FileText, Shield, Key, ArrowUpRight, Copy, Check,
  Download, Eye, Sparkles, Filter, RefreshCw, ShoppingCart, LogOut,
  Menu, X, Home, ShoppingBag, LayoutDashboard, BookOpen, ShieldCheck
} from 'lucide-react';
import { onAuthStateChanged, signOut, User as FirebaseUser } from 'firebase/auth';
import { auth } from '../services/firebase';
import BrandMark from '../components/BrandMark';
import { FONT_CATALOG, FontItem, SellerFontSubmission } from '../services/fontData';
import { getCurrentUser, UserRecord } from '../services/authManager';
import PendingApprovalView from '../components/PendingApprovalView';
import FontSecurityModal from '../components/FontSecurityModal';
import { generateLicenseKey } from '../services/fontSecurity';

export const SellerPortal: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'catalog' | 'upload' | 'licenses' | 'payouts'>('overview');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Font Security & DRM Modal State
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [securityTargetKey, setSecurityTargetKey] = useState('AX-COMM-8921-9482-XN');

  // Auth & Admin Approval State
  const [authUser, setAuthUser] = useState<FirebaseUser | null>(null);
  const [currentUser, setCurrentUser] = useState<UserRecord | null>(() => getCurrentUser());
  const [localUserEmail, setLocalUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setAuthUser(u));
    const user = getCurrentUser();
    setCurrentUser(user);
    const stored = localStorage.getItem('alphaxen_user_email') || localStorage.getItem('subCustomerEmailKey');
    setLocalUserEmail(stored ? stored.toLowerCase() : null);
    return () => unsub();
  }, []);

  const handleSignOut = async () => {
    localStorage.removeItem('alphaxen_user_email');
    localStorage.removeItem('alphaxen_user_signed_in');
    localStorage.removeItem('alphaxen_current_user');
    setLocalUserEmail(null);
    setCurrentUser(null);
    try {
      await signOut(auth);
    } catch (e) {}
    setAuthUser(null);
    navigate('/');
  };

  // Seller Font Submissions stored in localStorage for persistence
  const [sellerFonts, setSellerFonts] = useState<SellerFontSubmission[]>(() => {
    const saved = localStorage.getItem('alphaxen_seller_fonts');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return [
      {
        id: 'seller-font-1',
        fontName: 'Abdullah Martel',
        category: 'serif',
        stylesCount: 6,
        designerName: 'Abdullah Foundry Lab',
        description: 'Monumental haute luxury serif with chiseled Roman numerals and color OpenType.',
        commercialPrice: 99,
        personalPrice: 49,
        submissionDate: '2026-01-10',
        status: 'active',
        salesCount: 342,
        grossRevenue: 28734
      },
      {
        id: 'seller-font-2',
        fontName: 'Abdullah Metallic Chrome',
        category: 'display',
        stylesCount: 5,
        designerName: 'Abdullah Foundry Lab',
        description: 'Liquid titanium chrome titling typeface with specular contours.',
        commercialPrice: 89,
        personalPrice: 45,
        submissionDate: '2026-02-14',
        status: 'active',
        salesCount: 226,
        grossRevenue: 18114
      },
      {
        id: 'seller-font-3',
        fontName: 'Abdullah Molten Chrome',
        category: 'display',
        stylesCount: 5,
        designerName: 'Abdullah Foundry Lab',
        description: 'Fluid mercury and molten metal character geometry.',
        commercialPrice: 89,
        personalPrice: 45,
        submissionDate: '2026-03-01',
        status: 'active',
        salesCount: 195,
        grossRevenue: 15605
      }
    ];
  });

  // Upload Form State
  const [newFont, setNewFont] = useState({
    fontName: '',
    designerName: 'Abdullah Foundry Lab',
    category: 'display',
    stylesCount: 6,
    personalPrice: 45,
    commercialPrice: 89,
    description: '',
    sampleText: 'THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG',
    isVariable: false
  });

  // Direct License Generation State
  const [clientLicenses, setClientLicenses] = useState<Array<{ key: string, client: string, font: string, date: string, tier: string }>>([
    { key: 'AX-ENT-7821-CLIENT-XN', client: 'Vogue Global Media', font: 'Abdullah Martel', date: '2026-03-18', tier: 'Enterprise' },
    { key: 'AX-COMM-9932-CLIENT-XN', client: 'Apex Interactive', font: 'Abdullah Metallic Chrome', date: '2026-03-22', tier: 'Commercial' }
  ]);

  const [newClientName, setNewClientName] = useState('');
  const [newLicenseFont, setNewLicenseFont] = useState('Abdullah Martel');
  const [newLicenseTier, setNewLicenseTier] = useState('Commercial');

  useEffect(() => {
    localStorage.setItem('alphaxen_seller_fonts', JSON.stringify(sellerFonts));
  }, [sellerFonts]);

  const totalGrossRevenue = sellerFonts.reduce((acc, f) => acc + f.grossRevenue, 0);
  const totalNetPayout = totalGrossRevenue * 0.85;
  const totalUnitsSold = sellerFonts.reduce((acc, f) => acc + f.salesCount, 0);

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFont.fontName.trim()) return;

    const submission: SellerFontSubmission = {
      id: `seller-font-${Date.now()}`,
      fontName: newFont.fontName,
      category: newFont.category,
      stylesCount: Number(newFont.stylesCount),
      designerName: newFont.designerName,
      description: newFont.description || 'Modern digital typography typeface.',
      commercialPrice: Number(newFont.commercialPrice),
      personalPrice: Number(newFont.personalPrice),
      submissionDate: new Date().toISOString().split('T')[0],
      status: 'active',
      salesCount: 0,
      grossRevenue: 0
    };

    setSellerFonts([submission, ...sellerFonts]);
    setUploadSuccess(true);
    setTimeout(() => {
      setUploadSuccess(false);
      setActiveTab('catalog');
    }, 1500);
  };

  const handleGenerateDirectLicense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientName.trim()) return;

    const key = generateLicenseKey(newLicenseFont, newClientName, newLicenseTier);

    setClientLicenses([
      {
        key,
        client: newClientName,
        font: newLicenseFont,
        date: new Date().toISOString().split('T')[0],
        tier: newLicenseTier
      },
      ...clientLicenses
    ]);

    setNewClientName('');
  };

  const copyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // If user is logged in and status is pending approval by admin
  if (currentUser && currentUser.status === 'pending') {
    return <PendingApprovalView user={currentUser} targetRole="seller" onApproved={() => setCurrentUser(getCurrentUser())} />;
  }

  return (
    <div className="min-h-screen bg-[#070a13] text-slate-100 selection:bg-purple-500/30 selection:text-purple-100 font-sans overflow-x-hidden">
      
      {/* Top Sticky High-Definition Header */}
      <header className="sticky top-0 z-50 w-full bg-[#070a13]/98 backdrop-blur-xl border-b border-white/10 shadow-2xl">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 py-3.5 flex justify-between items-center">
          <BrandMark suffix="SELLER STUDIO" />

          <div className="hidden md:flex items-center gap-3">
            <Link to="/" className="neu-btn px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 hover:text-white">
              HOME
            </Link>
            <Link to="/shop" className="neu-btn px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 hover:text-white">
              FONT CATALOG
            </Link>
            <Link to="/buyer" className="neu-btn px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-indigo-300 hover:text-white">
              BUYER VAULT
            </Link>
            <Link to="/docs" className="neu-btn px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-cyan-300 hover:text-white">
              DOCS
            </Link>
            <button
              onClick={() => {
                setSecurityTargetKey('AX-COMM-8921-9482-XN');
                setShowSecurityModal(true);
              }}
              className="neu-btn px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-emerald-300 hover:text-white flex items-center gap-1.5 cursor-pointer"
            >
              <ShieldCheck size={12} className="text-emerald-400" />
              DRM ENGINE
            </button>
            <Link
              to="/install"
              className="neu-btn-cyan px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-white flex items-center gap-1.5 shadow-md hover:scale-105 transition-all"
            >
              <Download size={13} />
              INSTALL APP
            </Link>

            <div className="h-4 w-px bg-white/15 mx-1" />

            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('upload')}
                className="neu-btn-primary px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-white shadow-lg flex items-center gap-1.5 cursor-pointer hover:scale-105 transition-all"
              >
                <Upload size={13} /> PUBLISH
              </button>
              <button
                onClick={handleSignOut}
                className="neu-btn px-3 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-rose-400 cursor-pointer"
                title="Sign Out"
              >
                <LogOut size={13} />
              </button>
            </div>
          </div>

          <button 
            className="md:hidden text-white p-2 rounded-xl neu-btn cursor-pointer" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle Navigation Menu"
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Animated Drawer */}
        {isMenuOpen && (
          <div className="md:hidden px-6 pt-2 pb-4 border-t border-white/10 space-y-2 animate-slide-up bg-[#070a13]">
            <Link 
              to="/" 
              className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-black/60 border border-white/10 text-xs font-black uppercase tracking-wider text-slate-200 hover:text-white"
              onClick={() => setIsMenuOpen(false)}
            >
              <Home size={16} className="text-purple-400" />
              <span>Home</span>
            </Link>
            <Link 
              to="/shop" 
              className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-black/60 border border-white/10 text-xs font-black uppercase tracking-wider text-slate-200 hover:text-white"
              onClick={() => setIsMenuOpen(false)}
            >
              <ShoppingBag size={16} className="text-cyan-400" />
              <span>Font Catalog</span>
            </Link>
            <Link 
              to="/buyer" 
              className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-black/60 border border-white/10 text-xs font-black uppercase tracking-wider text-slate-200 hover:text-white"
              onClick={() => setIsMenuOpen(false)}
            >
              <LayoutDashboard size={16} className="text-indigo-400" />
              <span>Buyer Vault</span>
            </Link>
            <Link 
              to="/docs" 
              className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-black/60 border border-white/10 text-xs font-black uppercase tracking-wider text-slate-200 hover:text-white"
              onClick={() => setIsMenuOpen(false)}
            >
              <BookOpen size={16} className="text-cyan-400" />
              <span>Documentation &amp; CDN</span>
            </Link>
            <Link 
              to="/tos" 
              className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-black/60 border border-white/10 text-xs font-black uppercase tracking-wider text-slate-200 hover:text-white"
              onClick={() => setIsMenuOpen(false)}
            >
              <ShieldCheck size={16} className="text-emerald-400" />
              <span>Terms &amp; EULA</span>
            </Link>
            <div className="pt-2 flex gap-2">
              <button
                onClick={() => { setActiveTab('upload'); setIsMenuOpen(false); }}
                className="neu-btn-primary flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-wider text-white flex items-center justify-center gap-2"
              >
                <Upload size={14} /> Publish Font
              </button>
              <button
                onClick={handleSignOut}
                className="neu-btn px-4 py-3 rounded-xl text-xs font-black text-rose-400 flex items-center justify-center"
              >
                <LogOut size={16} />
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-6 sm:px-12 pt-8 pb-24">
        
        {/* Hero Banner in Solid High-Contrast Obsidian */}
        <div className="bg-[#0b101d] border border-white/20 p-8 sm:p-12 md:p-14 rounded-[2.5rem] mb-12 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="space-y-4 max-w-2xl">
              <div className="inline-flex items-center gap-3 py-1.5 px-5 rounded-full bg-[#131b2e] border border-purple-500/40 text-[10px] font-black uppercase tracking-[0.25em] text-purple-300 shadow-md">
                <span className="flex h-2 w-2 rounded-full bg-purple-400 animate-pulse shadow-[0_0_10px_rgba(168,85,247,1)]" />
                FOUNDRY CREATOR STUDIO
              </div>
              <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-white font-grotesk leading-tight">
                TYPE DESIGNER <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-indigo-300 to-cyan-300">
                  STUDIO.
                </span>
              </h1>
              <p className="text-slate-200 text-sm sm:text-base font-semibold leading-relaxed">
                PUBLISH TYPEFACE FAMILIES, ISSUE DIRECT ENTERPRISE LICENSE KEYS, AND TRACK YOUR 85% CREATOR ROYALTIES IN REAL TIME.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 sm:gap-4 bg-[#050814] border border-white/20 p-3.5 sm:p-6 rounded-3xl shadow-inner w-full lg:w-auto">
              <div className="text-center px-1 sm:px-5 border-r border-white/15">
                <div className="text-2xl sm:text-4xl font-black text-emerald-400 font-mono">${totalNetPayout.toLocaleString()}</div>
                <div className="text-[8px] min-[360px]:text-[9px] sm:text-[10px] text-slate-300 uppercase font-black tracking-wider sm:tracking-widest mt-1 truncate">ROYALTIES (85%)</div>
              </div>
              <div className="text-center px-1 sm:px-5 border-r border-white/15">
                <div className="text-2xl sm:text-4xl font-black text-cyan-300 font-mono">{totalUnitsSold}</div>
                <div className="text-[8px] min-[360px]:text-[9px] sm:text-[10px] text-slate-300 uppercase font-black tracking-wider sm:tracking-widest mt-1 truncate">SALES</div>
              </div>
              <div className="text-center px-1 sm:px-5">
                <div className="text-2xl sm:text-4xl font-black text-purple-300 font-mono">{sellerFonts.length}</div>
                <div className="text-[8px] min-[360px]:text-[9px] sm:text-[10px] text-slate-300 uppercase font-black tracking-wider sm:tracking-widest mt-1 truncate">RELEASES</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-3 border-b border-white/15 pb-6 mb-12 overflow-x-auto custom-scrollbar">
          {[
            { id: 'overview', label: 'SALES & ANALYTICS', icon: <BarChart3 size={16} className="text-indigo-400" /> },
            { id: 'catalog', label: 'PUBLISHED FONTS', icon: <Layers size={16} className="text-purple-400" />, count: sellerFonts.length },
            { id: 'upload', label: 'UPLOAD TYPEFACE', icon: <Upload size={16} className="text-cyan-400" /> },
            { id: 'licenses', label: 'DIRECT CLIENT KEYS', icon: <Key size={16} className="text-emerald-400" />, count: clientLicenses.length },
            { id: 'payouts', label: 'EARNINGS & PAYOUTS', icon: <DollarSign size={16} className="text-pink-400" /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-6 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-2.5 whitespace-nowrap cursor-pointer ${
                activeTab === tab.id
                  ? 'neu-btn-primary text-white shadow-xl scale-105 border-white/40'
                  : 'bg-[#0e1424] border border-white/20 text-slate-100 hover:text-white hover:bg-[#162038] hover:border-cyan-400/40 shadow-md'
              }`}
            >
              {tab.icon}
              <span className="font-extrabold">{tab.label}</span>
              {tab.count !== undefined && (
                <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-mono font-black ${
                  activeTab === tab.id ? 'bg-black/50 text-white border border-white/20' : 'bg-white/15 text-white'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-12">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-6">
              {[
                { label: 'GROSS SALES', val: `$${totalGrossRevenue.toLocaleString()}`, color: 'text-purple-300', icon: <DollarSign size={18} className="text-purple-400 shrink-0" /> },
                { label: 'CREATOR NET (85%)', val: `$${totalNetPayout.toLocaleString()}`, color: 'text-cyan-300', icon: <Sparkles size={18} className="text-cyan-400 shrink-0" /> },
                { label: 'UNITS SOLD', val: `${totalUnitsSold}`, color: 'text-emerald-300', icon: <ShoppingCart size={18} className="text-emerald-400 shrink-0" /> },
                { label: 'CDN HITS', val: '14.2M', color: 'text-indigo-300', icon: <BarChart3 size={18} className="text-indigo-400 shrink-0" /> }
              ].map((stat, i) => (
                <div
                  key={i}
                  className="bg-[#0c101d] border border-white/20 hover:border-purple-500/50 p-4 sm:p-6 md:p-8 rounded-[1.75rem] sm:rounded-[2rem] space-y-2 sm:space-y-3 shadow-xl transition-all hover:translate-y-[-2px] overflow-hidden flex flex-col justify-between"
                >
                  <div className={`flex justify-between items-center text-[8.5px] min-[360px]:text-[9.5px] sm:text-xs font-black uppercase tracking-wider ${stat.color}`}>
                    <span className="truncate">{stat.label}</span>
                    {stat.icon}
                  </div>
                  <div className="text-base min-[360px]:text-lg sm:text-2xl md:text-3xl lg:text-4xl font-black text-white font-mono leading-tight break-words">
                    {stat.val}
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-[#0c101d] border border-white/20 p-10 rounded-[2.5rem] shadow-2xl space-y-6">
              <h3 className="text-2xl font-black uppercase tracking-tight text-white font-grotesk">TYPEFACE REVENUE SHARE</h3>
              <div className="space-y-4">
                {sellerFonts.map((font) => {
                  const percent = (font.grossRevenue / totalGrossRevenue) * 100;
                  return (
                    <div key={font.id} className="space-y-2">
                      <div className="flex justify-between text-xs font-black uppercase">
                        <span className="text-white text-sm">{font.fontName}</span>
                        <span className="font-mono text-cyan-300 font-bold">${font.grossRevenue.toLocaleString()} ({font.salesCount} sales)</span>
                      </div>
                      <div className="w-full h-3 bg-[#050814] border border-white/10 rounded-full overflow-hidden p-0.5">
                        <div style={{ width: `${percent}%` }} className="h-full bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-400 rounded-full" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CATALOG */}
        {activeTab === 'catalog' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sellerFonts.map((font) => (
              <div
                key={font.id}
                className="bg-[#0c101d] border border-white/20 hover:border-purple-500/50 p-8 rounded-[2.5rem] flex flex-col justify-between space-y-6 shadow-2xl transition-all"
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-purple-300 uppercase tracking-widest">
                        {font.category} • {font.stylesCount} STYLES
                      </span>
                      <h4 className="text-2xl font-black uppercase tracking-tight text-white mt-1 font-grotesk">{font.fontName}</h4>
                    </div>
                    <span className="text-[9px] px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold uppercase">
                      {font.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-200 font-medium line-clamp-2 leading-relaxed">
                    {font.description}
                  </p>

                  <div className="bg-[#050814] border border-white/15 p-4 rounded-2xl space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-300 uppercase text-[10px] font-bold">COMMERCIAL PRICE:</span>
                      <strong className="text-white font-mono text-sm">${font.commercialPrice}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-300 uppercase text-[10px] font-bold">TOTAL SALES:</span>
                      <strong className="text-cyan-300 font-mono text-sm">{font.salesCount} units</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-300 uppercase text-[10px] font-bold">GROSS ROYALTIES:</span>
                      <strong className="text-emerald-400 font-mono text-sm">${font.grossRevenue.toLocaleString()}</strong>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <Link
                    to="/shop"
                    className="neu-btn px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-purple-300 hover:text-white flex items-center gap-1.5"
                  >
                    <span>VIEW IN SHOP</span>
                    <ArrowUpRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: UPLOAD */}
        {activeTab === 'upload' && (
          <div className="bg-[#0c101d] border border-white/20 p-8 sm:p-12 md:p-14 rounded-[2.5rem] max-w-3xl mx-auto space-y-8 shadow-2xl">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#131b2e] border border-purple-500/40 text-purple-300 text-[10px] font-black uppercase tracking-widest mb-3">
                <Upload size={13} /> FOUNDRY PIPELINE
              </div>
              <h3 className="text-3xl font-black uppercase tracking-tight text-white font-grotesk">PUBLISH A NEW TYPEFACE</h3>
              <p className="text-xs sm:text-sm text-slate-200 mt-1 font-medium">
                UPLOAD COMPILED OTF/TTF/WOFF2 FILES FOR AUTOMATED SPECIMEN GENERATION.
              </p>
            </div>

            {uploadSuccess && (
              <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                <CheckCircle2 size={16} />
                <span>TYPEFACE FAMILY PUBLISHED TO MARKETPLACE!</span>
              </div>
            )}

            {/* Cryptographic DRM Protection Notice */}
            <div className="p-5 rounded-2xl bg-[#050814] border border-cyan-500/30 flex items-start gap-4 shadow-lg">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5">
                <ShieldCheck size={20} />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-black uppercase tracking-wider text-cyan-300">AUTOMATED CRYPTOGRAPHIC WATERMARKING &amp; DRM</h4>
                <p className="text-[11px] text-slate-300 leading-relaxed font-medium">
                  Every typeface file published through Alphaxen is automatically sealed with our proprietary binary font watermarker. Downloads are embedded with buyer-specific SHA-256 signatures, OpenType `name` table licenses, and CORS-enforced Webfont tokens to prevent unauthorized redistribution.
                </p>
              </div>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-200">
                    FONT FAMILY NAME *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="ALPHAXEN NEO-SERIF"
                    value={newFont.fontName}
                    onChange={(e) => setNewFont({ ...newFont, fontName: e.target.value })}
                    className="w-full bg-[#050814] border border-white/20 rounded-2xl px-4 py-3.5 text-xs text-white placeholder-slate-400 font-bold uppercase tracking-wider focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-200">
                    STUDIO / FOUNDRY NAME *
                  </label>
                  <input
                    type="text"
                    required
                    value={newFont.designerName}
                    onChange={(e) => setNewFont({ ...newFont, designerName: e.target.value })}
                    className="w-full bg-[#050814] border border-white/20 rounded-2xl px-4 py-3.5 text-xs text-white placeholder-slate-400 font-bold uppercase tracking-wider focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-200">
                    CLASSIFICATION
                  </label>
                  <select
                    value={newFont.category}
                    onChange={(e) => setNewFont({ ...newFont, category: e.target.value })}
                    className="w-full bg-[#050814] border border-white/20 rounded-2xl px-4 py-3.5 text-xs text-white focus:outline-none focus:border-purple-500 uppercase font-black"
                  >
                    <option value="sans-serif">SANS-SERIF</option>
                    <option value="serif">SERIF</option>
                    <option value="display">DISPLAY</option>
                    <option value="monospace">MONOSPACE</option>
                    <option value="luxury">LUXURY</option>
                    <option value="variable">VARIABLE</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-200">
                    TOTAL STYLES
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="64"
                    value={newFont.stylesCount}
                    onChange={(e) => setNewFont({ ...newFont, stylesCount: Number(e.target.value) })}
                    className="w-full bg-[#050814] border border-white/20 rounded-2xl px-4 py-3.5 text-xs text-white focus:outline-none focus:border-purple-500 font-mono font-bold"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-200">
                    PRICE ($)
                  </label>
                  <input
                    type="number"
                    min="10"
                    max="999"
                    value={newFont.commercialPrice}
                    onChange={(e) => setNewFont({ ...newFont, commercialPrice: Number(e.target.value) })}
                    className="w-full bg-[#050814] border border-white/20 rounded-2xl px-4 py-3.5 text-xs text-white focus:outline-none focus:border-purple-500 font-mono font-bold"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-200">
                  CONCEPT & DESCRIPTION
                </label>
                <textarea
                  rows={3}
                  placeholder="OPTICAL CURVATURE, INK TRAPS, INSPIRATION..."
                  value={newFont.description}
                  onChange={(e) => setNewFont({ ...newFont, description: e.target.value })}
                  className="w-full bg-[#050814] border border-white/20 rounded-2xl p-4 text-xs text-white placeholder-slate-400 font-bold uppercase tracking-wider focus:outline-none focus:border-purple-500 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full neu-btn-primary h-14 rounded-2xl text-white font-black uppercase tracking-[0.25em] text-[11px] shadow-2xl cursor-pointer hover:scale-105 transition-all"
              >
                PUBLISH TO ALPHAXEN MARKETPLACE
              </button>
            </form>
          </div>
        )}

        {/* TAB 4: DIRECT KEYS */}
        {activeTab === 'licenses' && (
          <div className="bg-[#0c101d] border border-white/20 p-8 sm:p-12 md:p-14 rounded-[2.5rem] shadow-2xl space-y-8">
            <div>
              <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white font-grotesk">DIRECT ENTERPRISE LICENSE GENERATOR</h3>
              <p className="text-xs sm:text-sm text-slate-200 mt-1 font-medium">
                ISSUE CUSTOM COMMERCIAL CERTIFICATES DIRECTLY TO ENTERPRISE CLIENTS.
              </p>
            </div>

            <form onSubmit={handleGenerateDirectLicense} className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-5 rounded-2xl bg-[#050814] border border-white/20">
              <input
                type="text"
                required
                placeholder="CLIENT OR AGENCY"
                value={newClientName}
                onChange={(e) => setNewClientName(e.target.value)}
                className="bg-[#0c101d] border border-white/15 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-400 font-bold uppercase tracking-wider focus:outline-none focus:border-purple-500"
              />
              <select
                value={newLicenseFont}
                onChange={(e) => setNewLicenseFont(e.target.value)}
                className="bg-[#0c101d] border border-white/15 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-purple-500 font-bold uppercase"
              >
                {sellerFonts.map(f => (
                  <option key={f.id} value={f.fontName}>{f.fontName}</option>
                ))}
              </select>
              <select
                value={newLicenseTier}
                onChange={(e) => setNewLicenseTier(e.target.value)}
                className="bg-[#0c101d] border border-white/15 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-purple-500 font-bold uppercase"
              >
                <option value="Commercial">COMMERCIAL (500K)</option>
                <option value="Extended">EXTENDED STUDIO</option>
                <option value="Enterprise">ENTERPRISE (UNLIMITED)</option>
              </select>
              <button
                type="submit"
                className="neu-btn-primary h-12 rounded-xl text-white font-black text-[10px] uppercase tracking-widest shadow-md cursor-pointer hover:scale-102"
              >
                GENERATE KEY
              </button>
            </form>

            <div className="space-y-4">
              {clientLicenses.map((item) => (
                <div
                  key={item.key}
                  className="bg-[#050814] border border-white/15 p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-base font-bold text-white">{item.client}</span>
                      <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-mono font-bold">
                        {item.tier}
                      </span>
                    </div>
                    <div className="text-xs text-slate-300 font-mono">
                      TYPEFACE: <strong className="text-white">{item.font}</strong> • KEY: <span className="text-cyan-300 font-bold">{item.key}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => {
                        setSecurityTargetKey(item.key);
                        setShowSecurityModal(true);
                      }}
                      className="neu-btn px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-emerald-300 hover:text-white flex items-center gap-1.5 cursor-pointer border border-emerald-500/40"
                    >
                      <ShieldCheck size={14} className="text-emerald-400" />
                      <span>VERIFY DRM</span>
                    </button>

                    <button
                      onClick={() => copyText(item.key, item.key)}
                      className="neu-btn px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-100 hover:text-white flex items-center gap-1.5 cursor-pointer"
                    >
                      {copiedKey === item.key ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                      <span>{copiedKey === item.key ? 'COPIED' : 'COPY KEY'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: PAYOUTS */}
        {activeTab === 'payouts' && (
          <div className="bg-[#0c101d] border border-white/20 p-8 sm:p-12 md:p-14 rounded-[2.5rem] shadow-2xl space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white font-grotesk">EARNINGS & PAYOUT SETTLEMENT</h3>
                <p className="text-xs sm:text-sm text-slate-200 mt-1 font-medium">
                  ROYALTIES ARE DISBURSED WEEKLY VIA STRIPE, BANK WIRE, OR USDC.
                </p>
              </div>

              <button
                onClick={() => alert(`Payout request of $${totalNetPayout.toLocaleString()} submitted!`)}
                className="neu-btn-primary h-12 px-8 rounded-xl text-white font-black text-[10px] uppercase tracking-widest shadow-xl hover:scale-105 transition-all cursor-pointer"
              >
                REQUEST PAYOUT (${totalNetPayout.toLocaleString()})
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-[#050814] border border-white/20 p-6 rounded-2xl space-y-1">
                <span className="text-[10px] text-slate-300 font-black uppercase tracking-wider">AVAILABLE BALANCE</span>
                <div className="text-3xl sm:text-4xl font-black text-emerald-400 font-mono">${totalNetPayout.toLocaleString()}</div>
              </div>
              <div className="bg-[#050814] border border-white/20 p-6 rounded-2xl space-y-1">
                <span className="text-[10px] text-slate-300 font-black uppercase tracking-wider">PENDING CLEARANCE</span>
                <div className="text-3xl sm:text-4xl font-black text-white font-mono">$1,420.00</div>
              </div>
              <div className="bg-[#050814] border border-white/20 p-6 rounded-2xl space-y-1">
                <span className="text-[10px] text-slate-300 font-black uppercase tracking-wider">LIFETIME PAID OUT</span>
                <div className="text-3xl sm:text-4xl font-black text-purple-300 font-mono">$45,890.00</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* FOOTER */}
      <footer className="border-t border-white/[0.08] liquid-glass pt-16 pb-28 sm:pb-16 px-6 sm:px-8 relative z-10 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 lg:col-span-2">
              <Link to="/" className="flex items-center gap-3 mb-6 w-fit">
                <BrandMark mode="default" />
              </Link>
              <p className="text-slate-400 text-xs font-semibold tracking-wider uppercase mb-8 max-w-md leading-relaxed">
                EMPOWERING DESIGNERS & TYPE STUDIOS WITH HIGH-PRECISION DIGITAL VARIABLE TYPEFACES AND PERPETUAL COMMERCIAL LICENSING.
              </p>
            </div>

            <div className="space-y-4">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white">NAVIGATION</p>
              <div className="flex flex-col gap-3">
                <Link to="/shop" className="text-xs font-bold text-slate-400 hover:text-white transition-colors uppercase tracking-wider w-fit">
                  FONT CATALOG
                </Link>
                <Link to="/buyer" className="text-xs font-bold text-slate-400 hover:text-white transition-colors uppercase tracking-wider w-fit">
                  BUYER VAULT
                </Link>
                <Link to="/seller" className="text-xs font-bold text-purple-400 hover:text-purple-300 transition-colors uppercase tracking-wider w-fit">
                  SELLER STUDIO
                </Link>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white">RESOURCES</p>
              <div className="flex flex-col gap-3">
                <Link to="/docs" className="text-xs font-bold text-slate-400 hover:text-white transition-colors uppercase tracking-wider w-fit">
                  DOCUMENTATION
                </Link>
                <Link to="/tos" className="text-xs font-bold text-slate-400 hover:text-white transition-colors uppercase tracking-wider w-fit">
                  TERMS OF SERVICE & EULA
                </Link>
                <Link to="/admin" className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors uppercase tracking-wider w-fit">
                  ADMIN CONSOLE
                </Link>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-white/[0.08] flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500">
              © 2026 ALPHAXEN TYPE FOUNDRY. ALL RIGHTS RESERVED.
            </p>
          </div>
        </div>
      </footer>

      {/* Mobile Floating Bottom Dock */}
      <div className="md:hidden fixed bottom-4 inset-x-4 z-40">
        <div className="liquid-glass px-4 py-2.5 rounded-3xl border border-white/20 shadow-[0_15px_40px_rgba(0,0,0,0.9),_0_0_20px_rgba(99,102,241,0.2)] backdrop-blur-2xl flex items-center justify-between">
          <Link to="/" className="flex flex-col items-center gap-1 text-slate-400 hover:text-white p-1.5 transition-colors">
            <span className="text-[8px] font-black uppercase tracking-wider">Home</span>
          </Link>
          <Link to="/shop" className="flex flex-col items-center gap-1 text-slate-400 hover:text-white p-1.5 transition-colors">
            <span className="text-[8px] font-black uppercase tracking-wider">Fonts</span>
          </Link>
          <Link to="/buyer" className="flex flex-col items-center gap-1 text-slate-400 hover:text-white p-1.5 transition-colors">
            <span className="text-[8px] font-black uppercase tracking-wider">Vault</span>
          </Link>
          <Link to="/seller" className="flex flex-col items-center gap-1 text-purple-400 p-1.5">
            <span className="text-[8px] font-black uppercase tracking-wider">Studio</span>
          </Link>
        </div>
      </div>
      {/* Cryptographic Font Security & DRM Inspector Modal */}
      <FontSecurityModal
        isOpen={showSecurityModal}
        onClose={() => setShowSecurityModal(false)}
        defaultKey={securityTargetKey}
      />
    </div>
  );
};

export default SellerPortal;
