import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Upload, Layers, DollarSign, TrendingUp, BarChart3,
  Key, ShieldCheck, Sparkles, CheckCircle2, Clock, AlertCircle,
  Download, Copy, Check, ExternalLink, ArrowUpRight,
  ChevronRight, LogOut, FileText, ShoppingBag, Lock, Sliders,
  HelpCircle, Laptop, Menu, X, Home, BookOpen, MessageSquare,
  Mail, Send, Crown, CheckCheck
} from 'lucide-react';
import { onAuthStateChanged, signOut, User as FirebaseUser } from 'firebase/auth';
import { auth } from '../services/firebase';
import BrandMark from '../components/BrandMark';
import { FONT_CATALOG, FontItem, SellerFontSubmission } from '../services/fontData';
import { getCurrentUser, UserRecord } from '../services/authManager';
import PendingApprovalView from '../components/PendingApprovalView';
import FontSecurityModal from '../components/FontSecurityModal';
import { soundFx } from '../services/soundFx';
import { FOUNDRY_CONTACT, createWhatsAppDealUrl, createEmailDealUrl } from '../services/contact';

export const SellerPortal: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'portfolio' | 'submit' | 'keys' | 'royalties' | 'curation'>('portfolio');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Font Security & DRM Modal State
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [securityTargetKey, setSecurityTargetKey] = useState('AX-COMM-8921-9482-XN');

  // Auth State
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

  // Real Seller Font Submissions (Loaded from localStorage, no fake pre-populated sales)
  const [sellerFonts, setSellerFonts] = useState<SellerFontSubmission[]>(() => {
    const saved = localStorage.getItem('alphaxen_seller_fonts');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {}
    }
    return [];
  });

  // Upload Form State
  const [newFont, setNewFont] = useState({
    fontName: '',
    designerName: 'Independent Type Designer',
    category: 'display',
    stylesCount: 6,
    personalPrice: 45,
    commercialPrice: 89,
    description: '',
    sampleText: 'THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG',
    isVariable: false
  });

  // Direct Client Keys State
  const [clientLicenses, setClientLicenses] = useState<Array<{ key: string, client: string, font: string, date: string, tier: string }>>(() => {
    const saved = localStorage.getItem('alphaxen_client_keys');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {}
    }
    return [];
  });

  const [newClientName, setNewClientName] = useState('');
  const [newLicenseFont, setNewLicenseFont] = useState('Abdullah Martel');
  const [newLicenseTier, setNewLicenseTier] = useState('Commercial');

  useEffect(() => {
    localStorage.setItem('alphaxen_seller_fonts', JSON.stringify(sellerFonts));
  }, [sellerFonts]);

  useEffect(() => {
    localStorage.setItem('alphaxen_client_keys', JSON.stringify(clientLicenses));
  }, [clientLicenses]);

  const totalGrossRevenue = sellerFonts.reduce((acc, f) => acc + (f.grossRevenue || 0), 0);
  const totalNetPayout = Math.round(totalGrossRevenue * 0.85);
  const totalUnitsSold = sellerFonts.reduce((acc, f) => acc + (f.salesCount || 0), 0);

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFont.fontName.trim()) return;

    const submission: SellerFontSubmission = {
      id: `seller-font-${Date.now()}`,
      fontName: newFont.fontName,
      category: newFont.category,
      stylesCount: Number(newFont.stylesCount),
      designerName: newFont.designerName,
      description: newFont.description || 'Modern digital typography typeface submitted for curation.',
      commercialPrice: Number(newFont.commercialPrice),
      personalPrice: Number(newFont.personalPrice),
      submissionDate: new Date().toISOString().split('T')[0],
      status: 'active',
      salesCount: 0,
      grossRevenue: 0
    };

    setSellerFonts([submission, ...sellerFonts]);
    setUploadSuccess(true);
    soundFx.play('success');

    // Also trigger WhatsApp message for fast review
    const customMessage = `Hello Alphaxen Curation Team! 👋\n\nI have submitted a new typeface for distribution on Alphaxen:\n\n🔤 Typeface Name: ${newFont.fontName}\n🎨 Category: ${newFont.category}\n📐 Style Weights: ${newFont.stylesCount}\n💰 Suggested Commercial Price: $${newFont.commercialPrice}\n📝 Description: ${newFont.description || 'N/A'}\n\nPlease review and let me know the distribution onboarding steps.`;
    
    window.open(createWhatsAppDealUrl({ customMessage }), '_blank');

    setTimeout(() => {
      setUploadSuccess(false);
      setActiveTab('portfolio');
    }, 1500);
  };

  const handleGenerateDirectLicense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientName.trim()) return;

    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const key = `AX-${newLicenseTier.toUpperCase().slice(0, 4)}-${randomNum}-${newClientName.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 6) || 'CLIENT'}-XN`;

    const updated = [
      {
        key,
        client: newClientName,
        font: newLicenseFont,
        date: new Date().toISOString().split('T')[0],
        tier: newLicenseTier
      },
      ...clientLicenses
    ];

    setClientLicenses(updated);
    setNewClientName('');
    soundFx.play('pop');
  };

  const copyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    soundFx.play('success');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // If user is logged in and status is pending approval by admin
  if (currentUser && currentUser.status === 'pending') {
    return <PendingApprovalView user={currentUser} targetRole="seller" onApproved={() => setCurrentUser(getCurrentUser())} />;
  }

  return (
    <div className="min-h-screen bg-[#0b0e17] text-slate-100 selection:bg-purple-500/30 selection:text-purple-100 font-sans overflow-x-hidden">
      
      {/* Top Sticky Header */}
      <header className="sticky top-0 z-50 w-full bg-transparent max-md:border-transparent max-md:shadow-none md:bg-[#0b0e17]/98 md:backdrop-blur-xl md:border-b md:border-white/10 md:shadow-2xl">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 py-3.5 flex justify-between items-center">
          <BrandMark suffix="CREATOR STUDIO" />

          <div className="hidden md:flex items-center gap-3">
            <Link to="/" className="neu-btn px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 hover:text-white">
              HOME
            </Link>
            <Link to="/shop" className="neu-btn px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 hover:text-white">
              FONT CATALOG
            </Link>
            <Link to="/buyer" className="neu-btn px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-purple-300 hover:text-white">
              BUYER VAULT
            </Link>
            <Link to="/docs" className="neu-btn px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-purple-300 hover:text-white">
              DOCS
            </Link>

            {/* Direct Creator WhatsApp Line */}
            <a
              href={createWhatsAppDealUrl({ type: 'seller_submission', fontName: 'Creator Studio Inquiry' })}
              target="_blank"
              rel="noopener noreferrer"
              className="neu-btn-primary px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-white flex items-center gap-1.5 shadow-md hover:scale-105 transition-all"
            >
              <MessageSquare size={13} />
              CURATION DESK
            </a>

            <div className="h-4 w-px bg-white/15 mx-1" />

            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('submit')}
                className="neu-btn-primary px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-white shadow-lg flex items-center gap-1.5 cursor-pointer hover:scale-105 transition-all"
              >
                <Upload size={13} /> SUBMIT FONT
              </button>
              {currentUser && (
                <button
                  onClick={handleSignOut}
                  className="neu-btn px-3 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-rose-400 cursor-pointer"
                  title="Sign Out"
                >
                  <LogOut size={13} />
                </button>
              )}
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
          <div className="md:hidden px-6 pt-2 pb-4 border-t border-white/10 space-y-2 animate-slide-up bg-[#0b0e17]">
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
              <ShoppingBag size={16} className="text-purple-400" />
              <span>Font Catalog</span>
            </Link>
            <Link 
              to="/buyer" 
              className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-black/60 border border-white/10 text-xs font-black uppercase tracking-wider text-slate-200 hover:text-white"
              onClick={() => setIsMenuOpen(false)}
            >
              <Crown size={16} className="text-purple-400" />
              <span>Buyer Vault</span>
            </Link>
            <a 
              href={createWhatsAppDealUrl({ type: 'seller_submission', fontName: 'Type Designer' })}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-4 py-3 rounded-2xl neu-btn-primary text-xs font-black uppercase tracking-wider text-white shadow-lg"
              onClick={() => setIsMenuOpen(false)}
            >
              <MessageSquare size={16} />
              <span>WhatsApp Curation Desk</span>
            </a>
            <div className="pt-2 flex gap-2">
              <button
                onClick={() => { setActiveTab('submit'); setIsMenuOpen(false); }}
                className="neu-btn-primary flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-wider text-white flex items-center justify-center gap-2"
              >
                <Upload size={14} /> Submit Typeface
              </button>
              {currentUser && (
                <button
                  onClick={handleSignOut}
                  className="neu-btn px-4 py-3 rounded-xl text-xs font-black text-rose-400 flex items-center justify-center"
                >
                  <LogOut size={16} />
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-6 sm:px-12 pt-8 pb-24">
        
        {/* Hero Banner */}
        <div className="liquid-glass border border-white/20 p-8 sm:p-12 md:p-14 rounded-[2.5rem] mb-12 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="space-y-4 max-w-2xl">
              <div className="inline-flex items-center gap-3 py-1.5 px-5 rounded-full bg-[#141414] border border-purple-500/40 text-[10px] font-black uppercase tracking-[0.25em] text-purple-300 shadow-md">
                <span className="flex h-2 w-2 rounded-full bg-purple-400 animate-pulse shadow-[0_0_10px_rgba(139,92,246,1)]" />
                FOUNDRY CREATOR STUDIO
              </div>
              <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-white font-grotesk leading-tight">
                TYPE DESIGNER <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-300 to-sky-400">
                  DISTRIBUTION.
                </span>
              </h1>
              <p className="text-slate-200 text-sm sm:text-base font-semibold leading-relaxed">
                SUBMIT YOUR TYPEFACES FOR GLOBAL COMMERCIAL DISTRIBUTION, EARN AN UNMATCHED 85% CREATOR ROYALTY SPLIT, AND ISSUE DIRECT ENTERPRISE LICENSE KEYS.
              </p>
            </div>

            {/* Real Creator Stats */}
            <div className="flex flex-wrap sm:flex-nowrap items-stretch gap-2 sm:gap-4 bg-[#0b0e17] border border-white/20 p-3.5 sm:p-5 rounded-3xl shadow-inner w-full lg:w-auto shrink-0">
              <div className="flex-1 min-w-[120px] text-center px-3 sm:px-5 border-r border-white/15 flex flex-col justify-center">
                <div className="text-xl sm:text-2xl md:text-3xl lg:text-3xl font-black text-purple-400 font-mono tracking-tight whitespace-nowrap overflow-hidden text-ellipsis">
                  85%
                </div>
                <div className="text-[9px] sm:text-[10px] text-slate-300 uppercase font-black tracking-wider sm:tracking-widest mt-1 whitespace-nowrap">
                  CREATOR SPLIT
                </div>
              </div>
              <div className="flex-1 min-w-[80px] text-center px-3 sm:px-5 border-r border-white/15 flex flex-col justify-center">
                <div className="text-xl sm:text-2xl md:text-3xl lg:text-3xl font-black text-white font-mono tracking-tight whitespace-nowrap">
                  {sellerFonts.length}
                </div>
                <div className="text-[9px] sm:text-[10px] text-slate-300 uppercase font-black tracking-wider sm:tracking-widest mt-1 whitespace-nowrap">
                  SUBMISSIONS
                </div>
              </div>
              <div className="flex-1 min-w-[90px] text-center px-3 sm:px-5 flex flex-col justify-center">
                <div className="text-xl sm:text-2xl md:text-3xl lg:text-3xl font-black text-purple-300 font-mono tracking-tight whitespace-nowrap">
                  24H
                </div>
                <div className="text-[9px] sm:text-[10px] text-slate-300 uppercase font-black tracking-wider sm:tracking-widest mt-1 whitespace-nowrap">
                  REVIEW SPEED
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation (Seller Exclusive Sections) */}
        <div className="flex items-center gap-3 border-b border-white/15 pb-6 mb-12 overflow-x-auto custom-scrollbar">
          {[
            { id: 'portfolio', label: 'MY TYPEFACE RELEASES', icon: <Layers size={16} className="text-purple-400" />, count: sellerFonts.length },
            { id: 'submit', label: 'SUBMIT TYPEFACE (Foundry Review)', icon: <Upload size={16} className="text-purple-400" /> },
            { id: 'keys', label: 'ISSUE CLIENT LICENSE KEYS', icon: <Key size={16} className="text-purple-400" />, count: clientLicenses.length },
            { id: 'royalties', label: '85% CREATOR SPLIT & PAYOUTS', icon: <DollarSign size={16} className="text-purple-400" /> },
            { id: 'curation', label: 'FOUNDRY CURATION DESK', icon: <MessageSquare size={16} className="text-purple-400" /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-6 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-2.5 whitespace-nowrap cursor-pointer ${
                activeTab === tab.id
                  ? 'neu-btn-primary text-white shadow-xl scale-105 border-white/40'
                  : 'bg-[#121212] border border-white/15 text-zinc-200 hover:text-white hover:bg-[#1a1a1a] hover:border-purple-500/40 shadow-md'
              }`}
            >
              {tab.icon}
              <span className="font-extrabold">{tab.label}</span>
              {tab.count !== undefined && (
                <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-mono font-black ${
                  activeTab === tab.id ? 'bg-black/60 text-white border border-white/20' : 'bg-white/15 text-white'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* TAB 1: MY SUBMISSIONS & PORTFOLIO */}
        {activeTab === 'portfolio' && (
          <div className="space-y-8">
            {sellerFonts.length === 0 ? (
              <div className="liquid-glass border border-white/20 p-12 sm:p-16 rounded-[2.5rem] text-center space-y-6 shadow-2xl">
                <div className="w-16 h-16 rounded-2xl bg-purple-500/20 text-purple-300 border border-purple-500/40 flex items-center justify-center mx-auto shadow-lg">
                  <Layers size={32} />
                </div>
                <div className="max-w-md mx-auto space-y-2">
                  <h3 className="text-2xl font-black uppercase text-white font-grotesk">NO RELEASES SUBMITTED YET</h3>
                  <p className="text-xs text-slate-300 leading-relaxed font-medium">
                    Ready to distribute your typefaces to global agencies? Submit your OTF/TTF files using the pipeline tab or send directly via WhatsApp/Email.
                  </p>
                </div>
                <div className="flex flex-wrap justify-center gap-4">
                  <button
                    onClick={() => setActiveTab('submit')}
                    className="neu-btn-primary px-8 py-3.5 rounded-xl text-xs font-black uppercase tracking-widest text-white shadow-xl hover:scale-105 transition-all cursor-pointer"
                  >
                    SUBMIT YOUR FIRST TYPEFACE
                  </button>
                  <a
                    href={createWhatsAppDealUrl({ type: 'seller_submission' })}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="neu-btn px-8 py-3.5 rounded-xl text-xs font-black uppercase tracking-widest text-slate-200 hover:text-white transition-all flex items-center gap-2"
                  >
                    <MessageSquare size={14} className="text-purple-400" /> SUBMIT ON WHATSAPP
                  </a>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {sellerFonts.map((font) => (
                  <div
                    key={font.id}
                    className="liquid-glass border border-white/20 p-7 rounded-[2.5rem] space-y-4 shadow-xl"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 uppercase">
                          {font.category}
                        </span>
                        <h4 className="text-xl font-black uppercase text-white mt-1">{font.fontName}</h4>
                      </div>
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase">
                        {font.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 line-clamp-2">{font.description}</p>

                    <div className="bg-black p-4 rounded-2xl border border-white/10 space-y-1.5 text-xs">
                      <div className="flex justify-between text-slate-300">
                        <span>Commercial Price:</span>
                        <strong className="text-white font-mono">${font.commercialPrice}</strong>
                      </div>
                      <div className="flex justify-between text-slate-300">
                        <span>Styles Count:</span>
                        <strong className="text-white font-mono">{font.stylesCount} weights</strong>
                      </div>
                      <div className="flex justify-between text-slate-300">
                        <span>Date Submitted:</span>
                        <strong className="text-purple-300 font-mono">{font.submissionDate}</strong>
                      </div>
                    </div>

                    <a
                      href={createWhatsAppDealUrl({ customMessage: `Hello Alphaxen Curation! Inquiring about status for my submitted font: ${font.fontName}` })}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full neu-btn py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider text-slate-200 hover:text-white flex items-center justify-center gap-1.5"
                    >
                      <MessageSquare size={13} className="text-purple-400" /> INQUIRE WITH CURATOR
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: SUBMIT TYPEFACE */}
        {activeTab === 'submit' && (
          <div className="liquid-glass border border-white/20 p-8 sm:p-12 md:p-14 rounded-[2.5rem] max-w-3xl mx-auto space-y-8 shadow-2xl">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#141414] border border-purple-500/40 text-purple-300 text-[10px] font-black uppercase tracking-widest mb-3">
                <Upload size={13} /> CREATOR DISTRIBUTION PIPELINE
              </div>
              <h3 className="text-3xl font-black uppercase tracking-tight text-white font-grotesk">SUBMIT A NEW TYPEFACE FAMILY</h3>
              <p className="text-xs sm:text-sm text-slate-200 mt-1 font-medium">
                Submit your compiled OTF/TTF files for automated catalog onboarding and specimen indexing.
              </p>
            </div>

            {uploadSuccess && (
              <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 size={16} />
                <span>Typeface submitted successfully! Opening WhatsApp Curation Desk...</span>
              </div>
            )}

            <form onSubmit={handleUploadSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300">Typeface Family Name *</label>
                  <input
                    type="text"
                    required
                    value={newFont.fontName}
                    onChange={e => setNewFont({ ...newFont, fontName: e.target.value })}
                    placeholder="e.g. Abdullah Horizon Grotesk"
                    className="w-full bg-[#0b0e17] border border-white/20 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300">Designer / Studio Name *</label>
                  <input
                    type="text"
                    required
                    value={newFont.designerName}
                    onChange={e => setNewFont({ ...newFont, designerName: e.target.value })}
                    placeholder="e.g. Abdullah Foundry Lab"
                    className="w-full bg-[#0b0e17] border border-white/20 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300">Category</label>
                  <select
                    value={newFont.category}
                    onChange={e => setNewFont({ ...newFont, category: e.target.value })}
                    className="w-full bg-[#0b0e17] border border-white/20 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="display">Display Titling</option>
                    <option value="serif">Haute Serif</option>
                    <option value="sans-serif">Grotesk / Sans</option>
                    <option value="luxury">Luxury / Chiseled</option>
                    <option value="variable">Variable Font</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300">Total Styles/Weights</label>
                  <input
                    type="number"
                    min="1"
                    max="64"
                    value={newFont.stylesCount}
                    onChange={e => setNewFont({ ...newFont, stylesCount: Number(e.target.value) })}
                    className="w-full bg-[#0b0e17] border border-white/20 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300">Commercial Price ($)</label>
                  <input
                    type="number"
                    min="10"
                    value={newFont.commercialPrice}
                    onChange={e => setNewFont({ ...newFont, commercialPrice: Number(e.target.value) })}
                    className="w-full bg-[#0b0e17] border border-white/20 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300">Typeface Design Description</label>
                <textarea
                  rows={3}
                  value={newFont.description}
                  onChange={e => setNewFont({ ...newFont, description: e.target.value })}
                  placeholder="Describe your typeface inspiration, glyph counts, ligatures, and target applications..."
                  className="w-full bg-[#0b0e17] border border-white/20 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <button
                  type="submit"
                  className="flex-1 neu-btn-primary py-4 rounded-xl text-xs font-black uppercase tracking-widest text-white flex items-center justify-center gap-2 shadow-xl hover:scale-105 transition-all cursor-pointer"
                >
                  <Upload size={16} /> SUBMIT &amp; CONNECT ON WHATSAPP
                </button>

                <a
                  href={createEmailDealUrl({ type: 'seller_submission', fontName: newFont.fontName || 'New Typeface' })}
                  className="neu-btn px-6 py-4 rounded-xl text-xs font-black uppercase tracking-widest text-slate-200 hover:text-white flex items-center justify-center gap-2"
                >
                  <Mail size={16} className="text-purple-400" /> SUBMIT VIA EMAIL
                </a>
              </div>
            </form>
          </div>
        )}

        {/* TAB 3: ISSUE CLIENT LICENSE KEYS */}
        {activeTab === 'keys' && (
          <div className="liquid-glass border border-white/20 p-8 sm:p-12 md:p-14 rounded-[2.5rem] shadow-2xl space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white font-grotesk">DIRECT CLIENT LICENSE GENERATOR</h3>
                <p className="text-xs sm:text-sm text-slate-200 mt-1 font-medium">
                  Issue unique, tamper-proof commercial DRM license keys directly to your private commissioned clients.
                </p>
              </div>
            </div>

            <form onSubmit={handleGenerateDirectLicense} className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-[#0b0e17] p-6 rounded-2xl border border-white/15">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Client / Company Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Vogue Global Media"
                  value={newClientName}
                  onChange={e => setNewClientName(e.target.value)}
                  className="w-full bg-black border border-white/20 rounded-xl px-4 py-2.5 text-xs text-white uppercase focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Typeface Family</label>
                <select
                  value={newLicenseFont}
                  onChange={e => setNewLicenseFont(e.target.value)}
                  className="w-full bg-black border border-white/20 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
                >
                  {FONT_CATALOG.map(f => (
                    <option key={f.id} value={f.name}>{f.name}</option>
                  ))}
                  {sellerFonts.map(f => (
                    <option key={f.id} value={f.fontName}>{f.fontName} (My Submission)</option>
                  ))}
                </select>
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full neu-btn-primary py-2.5 rounded-xl text-xs font-black uppercase tracking-widest text-white flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Key size={14} /> GENERATE KEY
                </button>
              </div>
            </form>

            {/* Issued Keys List */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">ISSUED CLIENT LICENSES</h4>
              {clientLicenses.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500 font-mono bg-[#0b0e17] rounded-2xl border border-white/10">
                  No private client keys generated yet. Use the tool above to issue your first license key.
                </div>
              ) : (
                clientLicenses.map(lic => (
                  <div key={lic.key} className="bg-[#0b0e17] border border-white/15 p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <strong className="text-white text-sm">{lic.client}</strong>
                        <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 uppercase">
                          {lic.tier}
                        </span>
                      </div>
                      <div className="text-xs font-mono text-slate-400 mt-0.5">
                        {lic.font} • Key: <span className="text-purple-300 font-bold">{lic.key}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => copyText(lic.key, lic.key)}
                      className="neu-btn px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider text-slate-200 hover:text-white flex items-center gap-1.5 cursor-pointer"
                    >
                      {copiedKey === lic.key ? <Check size={12} className="text-purple-400" /> : <Copy size={12} />}
                      <span>{copiedKey === lic.key ? 'COPIED' : 'COPY KEY'}</span>
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 4: 85% CREATOR SPLIT & PAYOUTS */}
        {activeTab === 'royalties' && (
          <div className="liquid-glass border border-white/20 p-8 sm:p-12 md:p-14 rounded-[2.5rem] shadow-2xl space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white font-grotesk">85% CREATOR ROYALTY SPLIT</h3>
                <p className="text-xs sm:text-sm text-slate-200 mt-1 font-medium">
                  We maintain the highest creator payout ratio in the font industry. 85% of gross revenue is directly disbursed to type designers.
                </p>
              </div>

              <a
                href={createWhatsAppDealUrl({ customMessage: "Hello Alphaxen Finance! I would like to inquire about creator royalty settlement methods and payout options." })}
                target="_blank"
                rel="noopener noreferrer"
                className="neu-btn-primary px-6 py-3 rounded-xl text-xs font-black uppercase tracking-wider text-white flex items-center gap-2"
              >
                <MessageSquare size={14} /> FOUNDRY FINANCE LINE
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-[#0b0e17] border border-white/20 p-6 rounded-2xl space-y-2">
                <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider">CREATOR ROYALTY SHARE</span>
                <div className="text-3xl sm:text-4xl font-black text-purple-400 font-mono">85%</div>
                <p className="text-[11px] text-slate-400">Direct creator share on all commercial and extended tiers.</p>
              </div>

              <div className="bg-[#0b0e17] border border-white/20 p-6 rounded-2xl space-y-2">
                <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider">PAYOUT DISBURSEMENT</span>
                <div className="text-3xl sm:text-4xl font-black text-white font-mono">WEEKLY</div>
                <p className="text-[11px] text-slate-400">Automatic weekly payouts via Bank Wire, Stripe, USDC, or bKash.</p>
              </div>

              <div className="bg-[#0b0e17] border border-white/20 p-6 rounded-2xl space-y-2">
                <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider">IP OWNERSHIP</span>
                <div className="text-3xl sm:text-4xl font-black text-purple-300 font-mono">100% YOURS</div>
                <p className="text-[11px] text-slate-400">You retain 100% full intellectual property and master copyright.</p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: FOUNDRY CURATION DESK */}
        {activeTab === 'curation' && (
          <div className="liquid-glass border border-white/20 p-8 sm:p-12 md:p-14 rounded-[2.5rem] shadow-2xl space-y-8">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#141414] border border-purple-500/40 text-purple-300 text-[10px] font-black uppercase tracking-widest mb-3">
                <MessageSquare size={13} /> ART DIRECTION &amp; MASTERING
              </div>
              <h3 className="text-3xl font-black uppercase tracking-tight text-white font-grotesk">DIRECT FOUNDRY CURATION DESK</h3>
              <p className="text-xs sm:text-sm text-slate-200 mt-1 font-medium">
                Connect directly with Alphaxen type directors on WhatsApp or Email for font mastering, OpenType kerning reviews, and fast-track catalog approval.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-[#0b0e17] border border-white/15 p-8 rounded-3xl space-y-4 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-purple-600/20 text-purple-400 flex items-center justify-center">
                    <MessageSquare size={24} />
                  </div>
                  <h4 className="text-xl font-black uppercase text-white">WhatsApp Fast-Track Desk</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Chat in real-time with our curation team. Send font specimens, zip archives, or ask questions regarding pricing and licensing.
                  </p>
                </div>
                <a
                  href={`https://wa.me/${FOUNDRY_CONTACT.whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="neu-btn-primary py-3.5 rounded-xl text-xs font-black uppercase tracking-wider text-white flex items-center justify-center gap-2 shadow-xl hover:scale-105 transition-all"
                >
                  <MessageSquare size={15} /> CHAT ON WHATSAPP: {FOUNDRY_CONTACT.phone}
                </a>
              </div>

              <div className="bg-[#0b0e17] border border-white/15 p-8 rounded-3xl space-y-4 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-purple-600/20 text-purple-400 flex items-center justify-center">
                    <Mail size={24} />
                  </div>
                  <h4 className="text-xl font-black uppercase text-white">Direct Email Submissions</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Submit OTF/TTF font families with complete PDF type specimen books for in-depth geometric review and catalog contracts.
                  </p>
                </div>
                <a
                  href={`mailto:${FOUNDRY_CONTACT.email}`}
                  className="neu-btn py-3.5 rounded-xl text-xs font-black uppercase tracking-wider text-slate-200 hover:text-white flex items-center justify-center gap-2"
                >
                  <Mail size={15} className="text-purple-400" /> EMAIL: {FOUNDRY_CONTACT.email}
                </a>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* FOOTER */}
      <footer className="footer-vertex-gradient pt-16 pb-28 sm:pb-16 px-6 sm:px-12 relative z-10 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 lg:col-span-2">
              <Link to="/" className="flex items-center gap-3 mb-6 w-fit">
                <BrandMark mode="default" />
              </Link>
              <p className="text-slate-400 text-xs font-semibold tracking-wider uppercase mb-8 max-w-md leading-relaxed">
                EMPOWERING INDEPENDENT TYPE DESIGNERS WITH 85% CREATOR ROYALTIES AND DIRECT CLIENT LICENSING SYSTEMS.
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
                  CREATOR STUDIO
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
                  TERMS OF SERVICE &amp; EULA
                </Link>
                <Link to="/admin" className="text-xs font-bold text-slate-400 hover:text-white transition-colors uppercase tracking-wider w-fit">
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
        <div className="liquid-glass px-4 py-2.5 rounded-3xl border border-white/20 shadow-[0_15px_40px_rgba(0,0,0,0.9),_0_0_20px_rgba(139,92,246,0.25)] backdrop-blur-2xl flex items-center justify-between">
          <Link to="/" className="flex flex-col items-center gap-1 text-slate-400 hover:text-white p-1.5 transition-colors">
            <Home size={18} />
            <span className="text-[8px] font-black uppercase tracking-wider">Home</span>
          </Link>
          <Link to="/shop" className="flex flex-col items-center gap-1 text-slate-400 hover:text-white p-1.5 transition-colors">
            <ShoppingBag size={18} />
            <span className="text-[8px] font-black uppercase tracking-wider">Catalog</span>
          </Link>
          <Link to="/buyer" className="flex flex-col items-center gap-1 text-slate-400 hover:text-white p-1.5 transition-colors">
            <HardDrive size={18} />
            <span className="text-[8px] font-black uppercase tracking-wider">Buyer</span>
          </Link>
          <Link to="/seller" className="flex flex-col items-center gap-1 text-purple-400 p-1.5">
            <Layers size={18} />
            <span className="text-[8px] font-black uppercase tracking-wider">Seller</span>
          </Link>
        </div>
      </div>

    </div>
  );
};

export default SellerPortal;
