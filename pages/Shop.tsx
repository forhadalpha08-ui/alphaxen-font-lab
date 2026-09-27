import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search, Sliders, Type, ShieldCheck, Download,
  Check, Sparkles, Filter, Eye, ShoppingBag, ArrowRight,
  Star, Layers, FileText, CheckCircle2, ChevronDown, X, LogOut, Menu,
  Home, Key, LayoutDashboard, UserCheck, Clock, Shield,
  AlignLeft, AlignCenter, AlignRight, RefreshCw, Tag,
  Cpu, Copy, Terminal, ExternalLink, Zap
} from 'lucide-react';
import { onAuthStateChanged, signOut, User as FirebaseUser } from 'firebase/auth';
import { auth } from '../services/firebase';
import BrandMark from '../components/BrandMark';
import { FONT_CATALOG, FontItem, PurchasedFontLicense } from '../services/fontData';
import FontTesterStudio from '../components/FontTesterStudio';
import { AuthGateModal } from '../components/AuthGateModal';
import { getCurrentUser, UserRecord } from '../services/authManager';
import FontSecurityModal from '../components/FontSecurityModal';
import { generateLicenseKey } from '../services/fontSecurity';
import { soundFx } from '../services/soundFx';

const FacebookIcon = ({ size = 20, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const WhatsappIcon = ({ size = 20, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
  </svg>
);

export const Shop: React.FC = () => {
  const navigate = useNavigate();
  const [fonts] = useState<FontItem[]>(FONT_CATALOG);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [globalSampleText, setGlobalSampleText] = useState('The quick brown fox jumps over the lazy dog');
  const [fontSize, setFontSize] = useState(36);
  const [letterSpacing, setLetterSpacing] = useState(0);
  const [textAlign, setTextAlign] = useState<'left' | 'center' | 'right'>('center');
  const [variableOnly, setVariableOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'popular' | 'price-asc' | 'price-desc' | 'name'>('popular');
  const [viewMode, setViewMode] = useState<'grid' | 'studio'>('grid');
  const [cardSelectedWeights, setCardSelectedWeights] = useState<Record<string, number>>({});

  // Auth & Role state
  const [authUser, setAuthUser] = useState<FirebaseUser | null>(null);
  const [currentUser, setCurrentUser] = useState<UserRecord | null>(() => getCurrentUser());
  const [localUserEmail, setLocalUserEmail] = useState<string | null>(null);
  const [authGateOpen, setAuthGateOpen] = useState(false);
  const [targetFontName, setTargetFontName] = useState<string>('');

  // Checkout Modal State
  const [selectedFontForPurchase, setSelectedFontForPurchase] = useState<FontItem | null>(null);
  const [selectedTier, setSelectedTier] = useState<'personal' | 'commercial' | 'extended' | 'enterprise'>('commercial');
  const [companyName, setCompanyName] = useState('Studio Nova Labs');
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);

  // Quick Specimen Modal
  const [inspectFont, setInspectFont] = useState<FontItem | null>(null);
  const [inspectTab, setInspectTab] = useState<'waterfall' | 'glyphs' | 'features' | 'studio'>('waterfall');

  // Font Security & DRM Inspector Modal
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [securityTargetKey, setSecurityTargetKey] = useState('AX-COMM-8921-9482-XN');

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setAuthUser(u));
    const user = getCurrentUser();
    setCurrentUser(user);
    const stored = localStorage.getItem('alphaxen_user_email') || localStorage.getItem('subCustomerEmailKey');
    setLocalUserEmail(stored ? stored.toLowerCase() : null);
    return () => unsub();
  }, []);

  const isLoggedIn = !!(authUser || localUserEmail || currentUser);

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
  };

  const handleOpenPurchase = (font: FontItem, tier: 'personal' | 'commercial' = 'commercial') => {
    soundFx.play('pop');
    if (!isLoggedIn) {
      setTargetFontName(font.name);
      setAuthGateOpen(true);
      return;
    }
    setSelectedTier(tier);
    setSelectedFontForPurchase(font);
  };

  const copyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    soundFx.play('success');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleDownloadSpecimen = (font: FontItem) => {
    soundFx.play('watermark');
    if (!isLoggedIn) {
      setTargetFontName(font.name);
      setAuthGateOpen(true);
      return;
    }

    const specimenSheet = `========================================================================
ALPHAXEN DIGITAL TYPE FOUNDRY • AUTHENTIC SPECIMEN SHEET
========================================================================
TYPEFACE: ${font.name.toUpperCase()}
DESIGNER: ${font.designer}
FOUNDRY: ${font.foundry}
CATEGORY: ${font.category.toUpperCase()}
RELEASE YEAR: ${font.releaseYear}
TOTAL GLYPHS: ${font.glyphCount}
AVAILABLE STYLES (${font.stylesCount}): ${font.styles.map(s => s.name).join(', ')}
FORMATS: OTF, TTF, WOFF, WOFF2, COLOR OPENTYPE

------------------------------------------------------------------------
DESCRIPTION:
${font.description}

------------------------------------------------------------------------
TYPOGRAPHIC FEATURES & OPENTYPE LIGATURES:
${font.features.map(f => `• ${f}`).join('\n')}

------------------------------------------------------------------------
SAMPLE CSS @FONT-FACE EMBED:
@font-face {
  font-family: '${font.name}';
  src: url('/fonts/${encodeURIComponent(font.name)}/${encodeURIComponent(font.name)}-Regular.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

------------------------------------------------------------------------
EULA COMMERCIAL RIGHTS:
• Personal License: $${font.prices.personal} (Non-commercial portfolios, staging, prototypes)
• Commercial License: $${font.prices.commercial} (Perpetual commercial web & desktop branding)
• Extended License: $${font.prices.extended} (Unlimited broadcast, SaaS & physical product packaging)
• Enterprise License: $${font.prices.enterprise} (Worldwide perpetual license with source access)

(c) 2026 Alphaxen Type Foundry. All rights reserved.
========================================================================`;

    const blob = new Blob([specimenSheet], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${font.id}-authentic-specimen-sheet.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const filteredFonts = fonts.filter(font => {
    const matchesCat = selectedCategory === 'all' || 
      (selectedCategory === 'luxury' && (font.category === 'luxury' || font.tags.includes('Luxury') || font.tags.includes('Haute-Serif') || font.tags.includes('Serif Display'))) ||
      (selectedCategory === 'chrome' && (font.tags.includes('Chrome') || font.tags.includes('Metallic') || font.tags.includes('Cyber-Luxe'))) ||
      (selectedCategory === 'molten' && (font.tags.includes('Molten') || font.tags.includes('Monolith') || font.tags.includes('Liquid Metal')));
    const matchesSearch = font.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          font.designer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          font.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          font.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesVar = !variableOnly || font.isVariable;
    return matchesCat && matchesSearch && matchesVar;
  }).sort((a, b) => {
    if (sortBy === 'popular') return b.downloads - a.downloads;
    if (sortBy === 'price-asc') return a.prices.commercial - b.prices.commercial;
    if (sortBy === 'price-desc') return b.prices.commercial - a.prices.commercial;
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    return 0;
  });

  const handlePurchase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFontForPurchase) return;

    const licenseKey = generateLicenseKey(selectedTier, selectedFontForPurchase.id, companyName);
    const pricePaid = selectedFontForPurchase.prices[selectedTier];

    const newLicense: PurchasedFontLicense = {
      licenseKey,
      fontId: selectedFontForPurchase.id,
      fontName: `${selectedFontForPurchase.name} (${selectedFontForPurchase.stylesCount} Styles)`,
      tier: selectedTier.charAt(0).toUpperCase() + selectedTier.slice(1) as any,
      purchaseDate: new Date().toISOString().split('T')[0],
      registeredTo: companyName,
      allowedDomains: ['yourdomain.com', 'localhost'],
      maxPageviews: selectedTier === 'personal' ? 'Non-commercial' : selectedTier === 'commercial' ? '500,000 / mo' : 'Unlimited',
      pricePaid,
      status: 'active',
      downloadFormats: ['OTF', 'TTF', 'WOFF', 'WOFF2', ...(selectedFontForPurchase.isVariable ? ['Variable GX'] : [])]
    };

    let existing: PurchasedFontLicense[] = [];
    try {
      const parsed = JSON.parse(localStorage.getItem('alphaxen_buyer_licenses') || '[]');
      if (Array.isArray(parsed)) existing = parsed;
    } catch (e) {}
    localStorage.setItem('alphaxen_buyer_licenses', JSON.stringify([newLicense, ...existing]));

    soundFx.play('purchase');
    setPurchaseSuccess(true);
    setTimeout(() => {
      setPurchaseSuccess(false);
      setSelectedFontForPurchase(null);
      navigate('/buyer');
    }, 1800);
  };

  const samplePresets = [
    { label: 'Pangram', text: 'The quick brown fox jumps over the lazy dog' },
    { label: 'Headline', text: 'ALPHAXEN DIGITAL TYPE FOUNDRY 2026' },
    { label: 'Alphabet', text: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz' },
    { label: 'Numerals & Glyphs', text: '0123456789 § & @ # % $ € £ * ! ? + = / ( ) [ ]' },
    { label: 'Cyber-Luxe', text: 'SPECULAR TITANIUM // HYPER-POLISHED METALLIC VELOCITY' },
  ];

  return (
    <div className="min-h-screen bg-[#070a13] text-slate-100 selection:bg-indigo-500/30 selection:text-indigo-100 font-sans overflow-x-hidden">
      
      {/* Sticky High-Definition Top Navigation Bar (Solid Background - Never Overlaps Content) */}
      <header className="sticky top-0 z-50 w-full bg-[#070a13]/98 backdrop-blur-xl border-b border-white/10 shadow-2xl">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 py-3.5 flex justify-between items-center">
          <BrandMark suffix="FONT CATALOG" />

          <div className="hidden md:flex items-center gap-3">
            <Link to="/" className="neu-btn px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 hover:text-white">
              HOME
            </Link>
            
            <Link to="/shop" className="neu-btn-primary px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-white">
              FONT CATALOG
            </Link>

            <Link to="/seller" className="neu-btn px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-purple-300 hover:text-white">
              CREATOR STUDIO
            </Link>

            <Link to="/docs" className="neu-btn px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-cyan-300 hover:text-white">
              DOCS
            </Link>

            <button
              onClick={() => {
                setSecurityTargetKey('AX-COMM-8921-9482-XN');
                setShowSecurityModal(true);
              }}
              className="neu-btn px-3.5 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400 hover:text-white flex items-center gap-1.5 cursor-pointer hover:border-emerald-500/50"
            >
              <ShieldCheck size={13} />
              <span>DRM &amp; SECURITY</span>
            </button>

            <Link
              to="/install"
              className="neu-btn-cyan px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-white flex items-center gap-1.5 shadow-md hover:scale-105 transition-all"
            >
              <Download size={13} />
              <span>INSTALL APP</span>
            </Link>

            <div className="h-4 w-px bg-white/15 mx-1" />

            {isLoggedIn ? (
              <div className="flex items-center gap-2">
                {currentUser?.status === 'pending' ? (
                  <Link
                    to="/buyer"
                    className="px-4 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-[0.15em] bg-purple-500/20 text-purple-300 border border-purple-500/40 flex items-center gap-1.5 shadow-lg animate-pulse"
                  >
                    <Clock size={12} /> PENDING APPROVAL
                  </Link>
                ) : currentUser?.role === 'seller' ? (
                  <Link
                    to="/seller"
                    className="neu-btn-primary px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-white shadow-lg flex items-center gap-1.5"
                  >
                    <Layers size={13} /> STUDIO
                  </Link>
                ) : currentUser?.role === 'both' ? (
                  <div className="flex items-center gap-1.5">
                    <Link
                      to="/buyer"
                      className="neu-btn-cyan px-3.5 py-2 rounded-xl text-[9px] font-black uppercase tracking-wider text-white"
                    >
                      VAULT
                    </Link>
                    <Link
                      to="/seller"
                      className="neu-btn px-3.5 py-2 rounded-xl text-[9px] font-black uppercase tracking-wider text-purple-300 hover:text-white"
                    >
                      STUDIO
                    </Link>
                  </div>
                ) : (
                  <Link
                    to="/buyer"
                    className="neu-btn-cyan px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-white shadow-lg flex items-center gap-1.5"
                  >
                    <ShoppingBag size={13} /> VAULT
                  </Link>
                )}

                <button
                  onClick={handleSignOut}
                  className="neu-btn px-3 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-rose-400 cursor-pointer hover:scale-105 transition-all"
                  title="Sign Out"
                >
                  <LogOut size={13} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <Link to="/login" className="neu-btn px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-slate-200 hover:text-white">
                  LOG IN
                </Link>
                <Link to="/signup" className="neu-btn-primary px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.25em] text-white shadow-lg">
                  SIGN UP
                </Link>
              </div>
            )}
          </div>

          <button className="md:hidden text-white p-2.5 rounded-xl neu-btn cursor-pointer" onClick={() => setIsMenuOpen(!isMenuOpen)}>
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
              <Home size={16} className="text-cyan-400" />
              <span>Foundry Home</span>
            </Link>

            <Link 
              to="/shop" 
              className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-black/60 border border-white/10 text-xs font-black uppercase tracking-wider text-cyan-300 hover:text-white"
              onClick={() => setIsMenuOpen(false)}
            >
              <ShoppingBag size={16} className="text-cyan-400" />
              <span>Font Catalog &amp; Shop</span>
            </Link>
            
            <Link 
              to="/seller" 
              className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-black/60 border border-white/10 text-xs font-black uppercase tracking-wider text-purple-300 hover:text-white"
              onClick={() => setIsMenuOpen(false)}
            >
              <Layers size={16} className="text-purple-400" />
              <span>Creator Studio (85% Royalty)</span>
            </Link>

            <Link 
              to="/buyer" 
              className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-black/60 border border-white/10 text-xs font-black uppercase tracking-wider text-slate-200 hover:text-white"
              onClick={() => setIsMenuOpen(false)}
            >
              <LayoutDashboard size={16} className="text-indigo-400" />
              <span>Buyer Vault &amp; Licenses</span>
            </Link>

            <Link 
              to="/docs" 
              className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-black/60 border border-white/10 text-xs font-black uppercase tracking-wider text-slate-200 hover:text-white"
              onClick={() => setIsMenuOpen(false)}
            >
              <FileText size={16} className="text-emerald-400" />
              <span>Developer Docs &amp; CDN</span>
            </Link>

            <Link 
              to="/tos" 
              className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-black/60 border border-white/10 text-xs font-black uppercase tracking-wider text-slate-200 hover:text-white"
              onClick={() => setIsMenuOpen(false)}
            >
              <ShieldCheck size={16} className="text-purple-400" />
              <span>Commercial EULA Agreement</span>
            </Link>

            <div className="h-px bg-white/10 my-2" />
            
            {isLoggedIn ? (
              <div className="space-y-2">
                <button 
                  onClick={() => { setIsMenuOpen(false); handleSignOut(); }} 
                  className="neu-btn text-xs font-bold uppercase tracking-widest text-rose-400 py-3 rounded-2xl w-full flex items-center justify-center gap-2 cursor-pointer"
                >
                  <LogOut size={16} /> Sign Out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link 
                  to="/login" 
                  className="neu-btn text-center py-3 rounded-2xl text-xs font-black uppercase tracking-wider text-white" 
                  onClick={() => setIsMenuOpen(false)}
                >
                  Log In
                </Link>
                <Link 
                  to="/signup" 
                  className="neu-btn-primary text-center py-3 rounded-2xl text-xs font-black uppercase tracking-wider text-white shadow-lg" 
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 sm:px-12 pt-8 pb-28">
        
        {/* Header Hero Section */}
        <div className="mb-10 space-y-4">
          <div className="inline-flex items-center gap-2.5 py-1.5 px-4 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-[10px] font-black uppercase tracking-[0.25em] text-cyan-300 shadow-sm">
            <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_10px_rgba(6,182,212,1)]" />
            AUTHENTIC DIGITAL TYPE CATALOG
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="space-y-2">
              <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-white font-grotesk drop-shadow-md">
                EXCLUSIVE <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400">
                  TYPEFACES.
                </span>
              </h1>
              <p className="text-slate-300 text-xs sm:text-sm tracking-[0.08em] uppercase max-w-2xl leading-relaxed font-semibold">
                HIGH-PRECISION VARIABLE FONTS, MONUMENTAL HAUTE SERIFS, AND SPECULAR CHROME DISPLAY SYSTEMS. TEST WITH REAL GLYPHS AND OBTAIN PERPETUAL LICENSES.
              </p>
            </div>

            {/* Quick Metrics Bar */}
            <div className="flex items-center gap-3 bg-[#0c101d] p-3 rounded-2xl border border-white/15 shadow-xl shrink-0">
              <div className="px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-center">
                <div className="text-xl font-black text-cyan-300 font-mono">6</div>
                <div className="text-[8px] uppercase tracking-widest text-slate-400 font-bold">Families</div>
              </div>
              <div className="px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-center">
                <div className="text-xl font-black text-purple-300 font-mono">31</div>
                <div className="text-[8px] uppercase tracking-widest text-slate-400 font-bold">Weights</div>
              </div>
              <div className="px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-center">
                <div className="text-xl font-black text-indigo-300 font-mono">3,800+</div>
                <div className="text-[8px] uppercase tracking-widest text-slate-400 font-bold">Glyphs</div>
              </div>
            </div>
          </div>
        </div>

        {/* Global Live Interactive Type Bar (High-Contrast Solid Obsidian) */}
        <div className="bg-[#0c101d] border border-white/15 p-6 sm:p-8 rounded-[2.5rem] mb-12 shadow-[0_20px_60px_rgba(0,0,0,0.85)] space-y-6">
          
          {/* Row 1: Search & Live Text Input */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
            {/* Search Input */}
            <div className="lg:col-span-4 relative">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400" />
              <input
                type="text"
                placeholder="SEARCH 6 MASTER FAMILIES..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#050813] border border-white/15 rounded-2xl pl-11 pr-4 py-3.5 text-xs font-black uppercase tracking-wider text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
              />
            </div>

            {/* Live Custom Text Input */}
            <div className="lg:col-span-8 relative">
              <Type size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400" />
              <input
                type="text"
                placeholder="TYPE CUSTOM TEXT TO PREVIEW ALL FONTS IN REAL TIME..."
                value={globalSampleText}
                onChange={(e) => setGlobalSampleText(e.target.value)}
                className="w-full bg-[#050813] border border-white/15 rounded-2xl pl-11 pr-4 py-3.5 text-xs font-black uppercase tracking-wider text-white placeholder-slate-500 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition-all"
              />
            </div>
          </div>

          {/* Row 2: Typography Controls & Quick Presets */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center pt-2">
            {/* Quick Text Presets */}
            <div className="md:col-span-7 flex flex-wrap items-center gap-2">
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 mr-1">PRESETS:</span>
              {samplePresets.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => setGlobalSampleText(preset.text)}
                  className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                    globalSampleText === preset.text
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-md shadow-cyan-500/20'
                      : 'bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:border-white/30'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            {/* Slider Controls (Size, Spacing, Alignment) */}
            <div className="md:col-span-5 flex items-center justify-end gap-4">
              {/* Font Size Slider */}
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-300">
                <span>SIZE:</span>
                <input
                  type="range"
                  min="16"
                  max="72"
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className="w-20 accent-cyan-400 cursor-pointer bg-white/20 h-1.5 rounded-lg appearance-none"
                />
                <span className="font-mono text-cyan-300 w-8 text-right font-bold">{fontSize}PX</span>
              </div>

              {/* Letter Spacing Slider */}
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-300">
                <span>TRACK:</span>
                <input
                  type="range"
                  min="-2"
                  max="10"
                  value={letterSpacing}
                  onChange={(e) => setLetterSpacing(Number(e.target.value))}
                  className="w-16 accent-purple-400 cursor-pointer bg-white/20 h-1.5 rounded-lg appearance-none"
                />
                <span className="font-mono text-purple-300 w-6 text-right font-bold">{letterSpacing}PX</span>
              </div>

              {/* Alignment Buttons */}
              <div className="flex items-center gap-1 p-1 bg-[#050813] border border-white/10 rounded-xl">
                <button
                  onClick={() => setTextAlign('left')}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${textAlign === 'left' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400 hover:text-white'}`}
                  title="Left Align"
                >
                  <AlignLeft size={13} />
                </button>
                <button
                  onClick={() => setTextAlign('center')}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${textAlign === 'center' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400 hover:text-white'}`}
                  title="Center Align"
                >
                  <AlignCenter size={13} />
                </button>
                <button
                  onClick={() => setTextAlign('right')}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${textAlign === 'right' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400 hover:text-white'}`}
                  title="Right Align"
                >
                  <AlignRight size={13} />
                </button>
              </div>

              <button
                onClick={() => {
                  setGlobalSampleText('The quick brown fox jumps over the lazy dog');
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setFontSize(36);
                  setLetterSpacing(0);
                  setTextAlign('center');
                }}
                className="neu-btn px-2.5 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-300 hover:text-white cursor-pointer"
                title="Reset Controls"
              >
                <RefreshCw size={12} />
              </button>
            </div>
          </div>

          {/* Row 3: Filter Chips & View Mode Switcher */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/10">
            <div className="flex flex-wrap items-center gap-2">
              {[
                { id: 'all', label: `ALL TYPEFACES (${fonts.length})` },
                { id: 'luxury', label: 'HAUTE LUXURY SERIF (2)' },
                { id: 'chrome', label: 'SPECULAR CHROME (2)' },
                { id: 'molten', label: 'MOLTEN & STONE (2)' }
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] transition-all cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'neu-btn-primary text-white shadow-lg shadow-indigo-500/30'
                      : 'neu-btn text-slate-300 hover:text-white'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-slate-300 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={variableOnly}
                  onChange={(e) => setVariableOnly(e.target.checked)}
                  className="accent-cyan-400 rounded cursor-pointer"
                />
                <span>VARIABLE ONLY</span>
              </label>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="neu-btn px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest text-white focus:outline-none cursor-pointer"
              >
                <option value="popular">MOST POPULAR</option>
                <option value="price-asc">PRICE: LOW TO HIGH</option>
                <option value="price-desc">PRICE: HIGH TO LOW</option>
                <option value="name">ALPHABETICAL</option>
              </select>

              {/* Dual Mode Switcher */}
              <div className="flex items-center gap-1.5 p-1 bg-[#050813] border border-white/10 rounded-xl">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-[0.15em] transition-all flex items-center gap-1.5 cursor-pointer ${
                    viewMode === 'grid'
                      ? 'neu-btn-primary text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Layers size={11} />
                  <span>GRID</span>
                </button>

                <button
                  onClick={() => setViewMode('studio')}
                  className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-[0.15em] transition-all flex items-center gap-1.5 cursor-pointer ${
                    viewMode === 'studio'
                      ? 'neu-btn-cyan text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Type size={11} />
                  <span>STUDIO</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* View Mode: Studio */}
        {viewMode === 'studio' ? (
          <FontTesterStudio 
            onSelectLicense={(font) => handleOpenPurchase(font, 'commercial')} 
            onAddToCart={(font) => handleOpenPurchase(font, 'commercial')}
          />
        ) : (
          /* Font Cards Grid in High-Contrast Obsidian Glass */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredFonts.map((font) => {
              const activeWeight = cardSelectedWeights[font.id] || 400;

              return (
                <div
                  key={font.id}
                  className="bg-[#0c101e] border border-white/15 hover:border-indigo-500/40 p-7 sm:p-9 rounded-[2.5rem] flex flex-col justify-between space-y-6 shadow-[0_20px_50px_rgba(0,0,0,0.85)] hover:shadow-[0_25px_60px_rgba(79,70,229,0.25)] transition-all duration-300"
                >
                  <div className="space-y-4">
                    
                    {/* Header Row: Title, Foundry, and Prices */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] font-mono font-bold text-cyan-300 uppercase tracking-widest bg-cyan-500/10 px-2.5 py-0.5 rounded-md border border-cyan-500/25">
                            {font.foundry} • {font.category}
                          </span>
                          {font.badge && (
                            <span className="text-[9px] font-black px-2.5 py-0.5 rounded-md bg-purple-500/20 text-purple-200 border border-purple-500/40 uppercase tracking-widest">
                              {font.badge}
                            </span>
                          )}
                          <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-white/5 text-slate-300 border border-white/10 uppercase">
                            {font.releaseYear}
                          </span>
                        </div>

                        <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white font-grotesk pt-1 drop-shadow-sm">
                          {font.name}
                        </h3>
                      </div>

                      {/* Pricing Chips */}
                      <div className="text-right flex items-center gap-2 shrink-0">
                        <div className="text-right px-3 py-1.5 rounded-xl bg-[#060914] border border-white/10 shadow-inner">
                          <div className="text-sm font-black text-slate-100 font-mono">
                            ${font.prices.personal}
                          </div>
                          <span className="text-[8px] text-slate-400 uppercase font-black tracking-widest block">PERSONAL</span>
                        </div>

                        <div className="text-right px-3.5 py-1.5 rounded-xl bg-cyan-500/15 border border-cyan-500/40 shadow-inner">
                          <div className="text-sm font-black text-cyan-300 font-mono">
                            ${font.prices.commercial}
                          </div>
                          <span className="text-[8px] text-cyan-300 uppercase font-black tracking-widest block">COMMERCIAL</span>
                        </div>
                      </div>
                    </div>

                    {/* Weight Switcher Pills */}
                    <div className="flex flex-wrap items-center gap-1.5 py-1">
                      <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 mr-1">STYLES:</span>
                      {font.styles.slice(0, 5).map((st) => (
                        <button
                          key={st.name}
                          onClick={() => setCardSelectedWeights({ ...cardSelectedWeights, [font.id]: st.weight })}
                          className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                            activeWeight === st.weight
                              ? 'bg-purple-500/30 text-purple-200 border border-purple-500/60 shadow-md shadow-purple-500/20'
                              : 'bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10'
                          }`}
                        >
                          {st.name} ({st.weight})
                        </button>
                      ))}
                    </div>

                    {/* Real Specimen Artwork & Live Interactive Canvas */}
                    <div className="space-y-3">
                      {font.specimenImage && (
                        <div className="relative rounded-2xl overflow-hidden border border-white/15 group/img bg-[#04060d] shadow-inner">
                          <img
                            src={font.specimenImage}
                            alt={`${font.name} Master Specimen Artwork`}
                            className="w-full h-44 object-cover object-center group-hover/img:scale-105 transition-transform duration-500 pointer-events-none select-none"
                            loading="lazy"
                          />
                          {font.watermarkImage && (
                            <img
                              src={font.watermarkImage}
                              alt="Foundry Emblem"
                              className="absolute top-3 right-3 w-8 h-8 object-contain opacity-90 pointer-events-none drop-shadow-md"
                            />
                          )}
                          <div className="absolute bottom-2 left-3 px-3 py-0.5 rounded-full bg-black/85 backdrop-blur-md text-[9px] font-mono font-bold text-cyan-300 uppercase tracking-wider border border-white/15 flex items-center gap-1.5 shadow-md">
                            <Sparkles size={11} className="text-cyan-400" />
                            <span>AUTHENTIC TYPE SPECIMEN</span>
                          </div>
                        </div>
                      )}

                      {/* Live Type Area with Dynamic Weight & Spacing (Solid High-Contrast Background) */}
                      <div className="bg-[#050814] border border-cyan-500/25 p-5 rounded-2xl min-h-[110px] flex items-center justify-center overflow-hidden shadow-inner">
                        <div
                          style={{
                            fontFamily: font.fontFamily,
                            fontSize: `${fontSize}px`,
                            fontWeight: activeWeight,
                            letterSpacing: `${letterSpacing}px`,
                            textAlign: textAlign,
                            lineHeight: 1.25,
                            backgroundImage: font.colorGradient,
                            filter: font.glowShadow ? `drop-shadow(${font.glowShadow})` : undefined
                          }}
                          className={`truncate font-specimen-waterfall w-full transition-all ${
                            font.colorGradient ? 'bg-clip-text text-transparent' : 'text-white'
                          }`}
                        >
                          {globalSampleText || font.sampleText}
                        </div>
                      </div>
                    </div>

                    {/* Description & Tags */}
                    <p className="text-slate-200 text-xs leading-relaxed font-medium line-clamp-2">
                      {font.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {font.tags.map((tag, i) => (
                        <span key={i} className="text-[9px] font-bold uppercase px-2.5 py-0.5 rounded-md bg-white/5 text-slate-300 border border-white/10">
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Specs & DRM Row */}
                    <div className="flex items-center justify-between text-[11px] font-mono text-slate-300 pt-2 border-t border-white/10">
                      <span className="font-semibold">{font.stylesCount} STYLES ({font.isVariable ? 'VARIABLE GX' : 'STATIC MASTER'})</span>
                      
                      <button
                        onClick={() => {
                          setSecurityTargetKey(`AX-COMM-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}-${font.name.replace(/[^A-Za-z]/g, '').substring(0, 4).toUpperCase()}`);
                          setShowSecurityModal(true);
                        }}
                        className="text-[9px] font-mono font-bold text-emerald-300 hover:text-white bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 px-2 py-0.5 rounded-lg flex items-center gap-1 transition-all cursor-pointer shadow-sm"
                        title="Inspect Cryptographic DRM & License Status"
                      >
                        <ShieldCheck size={11} className="text-emerald-400" />
                        <span>SHA-256 DRM</span>
                      </button>

                      <span className="text-cyan-300 font-bold">{font.glyphCount} GLYPHS</span>
                    </div>
                  </div>

                  {/* Action Buttons (Clear, Tactile, High-Contrast) */}
                  <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setInspectFont(font);
                          setInspectTab('waterfall');
                        }}
                        className="neu-btn px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider text-slate-200 hover:text-white flex items-center gap-1.5 cursor-pointer"
                      >
                        <Eye size={13} className="text-cyan-400" /> SPECIMEN
                      </button>

                      <button
                        onClick={() => handleDownloadSpecimen(font)}
                        className="neu-btn px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider text-slate-300 hover:text-white flex items-center gap-1.5 cursor-pointer"
                      >
                        <Download size={13} className="text-purple-400" /> SPEC SHEET
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenPurchase(font, 'personal')}
                        className="neu-btn px-4 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-wider text-slate-200 hover:text-white hover:border-white/30 cursor-pointer transition-all"
                      >
                        PERSONAL (${font.prices.personal})
                      </button>

                      <button
                        onClick={() => handleOpenPurchase(font, 'commercial')}
                        className="neu-btn-primary px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-wider text-white shadow-lg shadow-indigo-500/30 cursor-pointer hover:scale-105 transition-all"
                      >
                        COMMERCIAL (${font.prices.commercial})
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="border-t border-white/15 bg-[#090d1c] pt-16 pb-28 sm:pb-16 px-6 sm:px-8 relative z-10 mt-20 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 lg:col-span-2">
              <Link to="/" className="flex items-center gap-3 mb-6 w-fit">
                <BrandMark mode="default" />
              </Link>
              <p className="text-slate-300 text-xs font-semibold tracking-wider uppercase mb-8 max-w-md leading-relaxed">
                EMPOWERING DESIGNERS & TYPE STUDIOS WITH HIGH-PRECISION DIGITAL VARIABLE TYPEFACES AND PERPETUAL COMMERCIAL LICENSING.
              </p>
              <div className="flex flex-wrap gap-3">
                <a href="https://www.facebook.com/profile.php?id=61580779565120" target="_blank" rel="noreferrer" title="Facebook Profile" className="neu-btn-circle text-blue-400 hover:text-white">
                  <FacebookIcon size={18} />
                </a>
                <a href="https://wa.me/8801342900364" target="_blank" rel="noreferrer" title="WhatsApp: +8801342900364" className="neu-btn-circle text-emerald-400 hover:text-white">
                  <WhatsappIcon size={18} />
                </a>
                <a href="https://github.com/forhad2008" target="_blank" rel="noreferrer" title="GitHub: forhad2008" className="neu-btn-circle text-slate-200 hover:text-white">
                  <ExternalLink size={18} />
                </a>
                <a href="https://forhad2008.github.io/portfolio/" target="_blank" rel="noreferrer" title="Portfolio & Web" className="neu-btn-circle text-cyan-400 hover:text-white">
                  <Home size={18} />
                </a>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white">NAVIGATION</p>
              <div className="flex flex-col gap-3">
                <Link to="/shop" className="text-xs font-bold text-slate-300 hover:text-white transition-colors uppercase tracking-wider w-fit">
                  FONT CATALOG
                </Link>
                <Link to="/buyer" className="text-xs font-bold text-slate-300 hover:text-white transition-colors uppercase tracking-wider w-fit">
                  BUYER VAULT
                </Link>
                <Link to="/seller" className="text-xs font-bold text-slate-300 hover:text-white transition-colors uppercase tracking-wider w-fit">
                  CREATOR STUDIO
                </Link>
                <Link to="/docs" className="text-xs font-bold text-slate-300 hover:text-white transition-colors uppercase tracking-wider w-fit">
                  DOCUMENTATION & CDN
                </Link>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white">COMMUNITY & CONNECT</p>
              <div className="flex flex-col gap-3">
                <a href="https://www.facebook.com/profile.php?id=61580779565120" target="_blank" rel="noreferrer" className="text-xs font-bold text-slate-300 hover:text-white transition-colors uppercase tracking-wider w-fit flex items-center gap-2">
                  <FacebookIcon size={14} className="text-blue-400" /> FACEBOOK FOUNDRY
                </a>
                <a href="https://wa.me/8801342900364" target="_blank" rel="noreferrer" className="text-xs font-bold text-slate-300 hover:text-white transition-colors uppercase tracking-wider w-fit flex items-center gap-2">
                  <WhatsappIcon size={14} className="text-emerald-400" /> WHATSAPP (+8801342900364)
                </a>
                <a href="https://forhad2008.github.io/portfolio/" target="_blank" rel="noreferrer" className="text-xs font-bold text-slate-300 hover:text-white transition-colors uppercase tracking-wider w-fit flex items-center gap-2">
                  <ExternalLink size={14} className="text-cyan-400" /> PORTFOLIO WEBSITE
                </a>
                <Link to="/admin" className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors uppercase tracking-wider w-fit">
                  ADMIN CONSOLE
                </Link>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">
              © 2026 ALPHAXEN DIGITAL TYPE FOUNDRY. ALL RIGHTS RESERVED.
            </p>
            <div className="flex items-center gap-6">
              <Link to="/tos" className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 hover:text-white transition-colors">
                PRIVACY POLICY
              </Link>
              <Link to="/tos" className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 hover:text-white transition-colors">
                COMMERCIAL EULA
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Comprehensive Specimen & Character Map Modal */}
      {inspectFont && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-2xl flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0b0f1d] border border-white/20 p-8 sm:p-12 rounded-[2.5rem] max-w-5xl w-full space-y-6 shadow-2xl relative my-8">
            
            {/* Modal Header */}
            <div className="flex justify-between items-start gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-cyan-400 uppercase font-black tracking-widest">
                    FOUNDRY MASTER SPECIMEN: {inspectFont.foundry}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[8px] font-black uppercase bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    {inspectFont.category}
                  </span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white font-grotesk">{inspectFont.name}</h2>
                <p className="text-xs text-slate-300 max-w-2xl font-medium">{inspectFont.description}</p>
              </div>

              <button
                onClick={() => setInspectFont(null)}
                className="p-2.5 rounded-xl neu-btn text-slate-400 hover:text-white cursor-pointer shrink-0"
              >
                <X size={20} />
              </button>
            </div>

            {/* Specimen Inspector Tabs */}
            <div className="flex items-center gap-2 p-1.5 bg-[#050813] border border-white/10 rounded-2xl">
              <button
                onClick={() => setInspectTab('waterfall')}
                className={`flex-1 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                  inspectTab === 'waterfall' ? 'neu-btn-primary text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                Waterfall Scale
              </button>
              <button
                onClick={() => setInspectTab('glyphs')}
                className={`flex-1 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                  inspectTab === 'glyphs' ? 'neu-btn-primary text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                Glyphs &amp; Character Map
              </button>
              <button
                onClick={() => setInspectTab('features')}
                className={`flex-1 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                  inspectTab === 'features' ? 'neu-btn-primary text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                OpenType Features
              </button>
              <button
                onClick={() => setInspectTab('studio')}
                className={`flex-1 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                  inspectTab === 'studio' ? 'neu-btn-cyan text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                Interactive Studio
              </button>
            </div>

            {/* Tab 1: Waterfall Scale */}
            {inspectTab === 'waterfall' && (
              <div className="space-y-4 animate-fade-in">
                {inspectFont.specimenImage && (
                  <div className="relative rounded-3xl overflow-hidden border border-white/15 shadow-2xl bg-black max-h-56">
                    <img
                      src={inspectFont.specimenImage}
                      alt={`${inspectFont.name} Specimen`}
                      className="w-full h-56 object-cover object-center pointer-events-none select-none"
                    />
                    {inspectFont.watermarkImage && (
                      <img
                        src={inspectFont.watermarkImage}
                        alt="Watermark"
                        className="absolute top-4 right-4 w-9 h-9 object-contain opacity-90 drop-shadow-lg pointer-events-none"
                      />
                    )}
                    <div className="absolute bottom-3 left-4 px-3 py-1 rounded-full bg-black/85 backdrop-blur-md text-[9px] font-mono font-bold text-cyan-300 uppercase tracking-widest border border-white/15">
                      🔒 AUTHENTIC MASTER SPECIMEN • DRM PROTECTED
                    </div>
                  </div>
                )}

                <div className="bg-[#050813] border border-white/10 p-6 rounded-3xl space-y-4 max-h-80 overflow-y-auto custom-scrollbar shadow-inner">
                  {[64, 48, 36, 24, 18, 14].map((size) => (
                    <div key={size} className="space-y-1 pb-3 border-b border-white/10 last:border-0">
                      <div className="flex justify-between items-center text-[9px] font-mono text-slate-400 font-bold">
                        <span>{size}PX</span>
                        <span>{inspectFont.name}</span>
                      </div>
                      <div
                        style={{
                          fontFamily: inspectFont.fontFamily,
                          fontSize: `${size}px`,
                          lineHeight: 1.2,
                          backgroundImage: inspectFont.colorGradient
                        }}
                        className={`truncate font-specimen-waterfall font-bold ${
                          inspectFont.colorGradient ? 'bg-clip-text text-transparent' : 'text-white'
                        }`}
                      >
                        {globalSampleText || 'The quick brown fox jumps over the lazy dog'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 2: Glyphs & Character Map */}
            {inspectTab === 'glyphs' && (
              <div className="bg-[#050813] border border-white/10 p-6 rounded-3xl space-y-6 max-h-[420px] overflow-y-auto custom-scrollbar animate-fade-in shadow-inner">
                {/* Uppercase */}
                <div>
                  <div className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest mb-2.5">
                    UPPERCASE BASIC LATIN (A - Z)
                  </div>
                  <div className="grid grid-cols-6 sm:grid-cols-13 gap-2">
                    {'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map((char) => (
                      <div
                        key={char}
                        style={{ fontFamily: inspectFont.fontFamily }}
                        className="h-12 rounded-xl bg-[#0b0f1f] border border-white/15 flex items-center justify-center text-lg font-bold text-white hover:border-cyan-400 hover:text-cyan-300 transition-all cursor-default select-none shadow-sm"
                      >
                        {char}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Lowercase */}
                <div>
                  <div className="text-[10px] font-mono font-bold text-purple-400 uppercase tracking-widest mb-2.5">
                    LOWERCASE LATIN (a - z)
                  </div>
                  <div className="grid grid-cols-6 sm:grid-cols-13 gap-2">
                    {'abcdefghijklmnopqrstuvwxyz'.split('').map((char) => (
                      <div
                        key={char}
                        style={{ fontFamily: inspectFont.fontFamily }}
                        className="h-12 rounded-xl bg-[#0b0f1f] border border-white/15 flex items-center justify-center text-lg font-bold text-slate-200 hover:border-purple-400 hover:text-purple-300 transition-all cursor-default select-none shadow-sm"
                      >
                        {char}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Numerals & Symbols */}
                <div>
                  <div className="text-[10px] font-mono font-bold text-indigo-400 uppercase tracking-widest mb-2.5">
                    NUMERALS &amp; PUNCTUATION (0 - 9, &amp; @ # $ % ! ?)
                  </div>
                  <div className="grid grid-cols-6 sm:grid-cols-12 gap-2">
                    {'0123456789!@#$%&*()[]{}+-=/.,:;<>'.split('').map((char, i) => (
                      <div
                        key={i}
                        style={{ fontFamily: inspectFont.fontFamily }}
                        className="h-12 rounded-xl bg-[#0b0f1f] border border-white/15 flex items-center justify-center text-base font-bold text-cyan-200 hover:border-indigo-400 hover:text-white transition-all cursor-default select-none shadow-sm"
                      >
                        {char}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: OpenType Features */}
            {inspectTab === 'features' && (
              <div className="space-y-4 animate-fade-in">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-[#050813] border border-white/15 p-5 rounded-2xl space-y-3 shadow-inner">
                    <div className="flex items-center gap-2 text-cyan-400 font-black text-xs uppercase tracking-widest">
                      <Terminal size={16} />
                      <span>Technical Architecture</span>
                    </div>
                    <ul className="space-y-2 text-xs text-slate-300 font-mono">
                      <li>• <strong>Format:</strong> OTF, TTF, WOFF, WOFF2, GX Variable</li>
                      <li>• <strong>Glyph Count:</strong> {inspectFont.glyphCount} Unique Contours</li>
                      <li>• <strong>Weights:</strong> {inspectFont.stylesCount} Distinct Master Layers</li>
                      <li>• <strong>Release:</strong> {inspectFont.releaseYear} • {inspectFont.foundry}</li>
                      <li>• <strong>DRM Security:</strong> 256-Bit Hardware Token Bound</li>
                    </ul>
                  </div>

                  <div className="bg-[#050813] border border-white/15 p-5 rounded-2xl space-y-3 shadow-inner">
                    <div className="flex items-center gap-2 text-purple-400 font-black text-xs uppercase tracking-widest">
                      <Sparkles size={16} />
                      <span>OpenType Features</span>
                    </div>
                    <ul className="space-y-2 text-xs text-slate-300">
                      {inspectFont.features.map((feat, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <Check size={14} className="text-cyan-400 shrink-0" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="bg-[#050813] border border-white/15 p-5 rounded-2xl space-y-2 shadow-inner">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-300 uppercase tracking-wider">
                    <span>CSS @font-face Embed Snippet</span>
                    <button
                      onClick={() => copyText(`@font-face {\n  font-family: '${inspectFont.name}';\n  src: url('/fonts/${encodeURIComponent(inspectFont.name)}/${encodeURIComponent(inspectFont.name)}-Regular.woff2') format('woff2');\n  font-weight: 400;\n  font-style: normal;\n}`, 'css-code')}
                      className="neu-btn px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest text-cyan-400 flex items-center gap-1.5 cursor-pointer"
                    >
                      {copiedKey === 'css-code' ? <Check size={12} /> : <Copy size={12} />}
                      <span>{copiedKey === 'css-code' ? 'COPIED' : 'COPY CSS'}</span>
                    </button>
                  </div>
                  <pre className="p-3.5 rounded-xl bg-black border border-white/10 font-mono text-[11px] text-cyan-300 overflow-x-auto">
{`@font-face {
  font-family: '${inspectFont.name}';
  src: url('/fonts/${encodeURIComponent(inspectFont.name)}/${encodeURIComponent(inspectFont.name)}-Regular.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}`}
                  </pre>
                </div>
              </div>
            )}

            {/* Tab 4: Interactive Studio */}
            {inspectTab === 'studio' && (
              <div className="animate-fade-in">
                <FontTesterStudio initialFontId={inspectFont.id} onSelectLicense={(f) => {
                  setInspectFont(null);
                  handleOpenPurchase(f);
                }} />
              </div>
            )}

            {/* Modal Footer Actions */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/10">
              <button
                onClick={() => handleDownloadSpecimen(inspectFont)}
                className="neu-btn px-5 py-3 rounded-xl text-xs font-black uppercase tracking-wider text-slate-300 hover:text-white flex items-center gap-2 cursor-pointer"
              >
                <Download size={14} /> Download Specimen Sheet
              </button>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    const font = inspectFont;
                    setInspectFont(null);
                    handleOpenPurchase(font, 'personal');
                  }}
                  className="neu-btn px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-200 hover:text-white cursor-pointer"
                >
                  Personal License (${inspectFont.prices.personal})
                </button>

                <button
                  onClick={() => {
                    const font = inspectFont;
                    setInspectFont(null);
                    handleOpenPurchase(font, 'commercial');
                  }}
                  className="neu-btn-primary px-6 py-3 rounded-xl text-xs font-black uppercase tracking-wider text-white shadow-xl cursor-pointer hover:scale-105 transition-all"
                >
                  Buy Commercial License (${inspectFont.prices.commercial})
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* License Purchase Modal */}
      {selectedFontForPurchase && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-2xl flex items-center justify-center p-4">
          <div className="bg-[#0b0f1e] border border-white/20 p-8 sm:p-12 rounded-[2.5rem] max-w-lg w-full space-y-6 shadow-2xl relative">
            <button
              onClick={() => setSelectedFontForPurchase(null)}
              className="absolute top-6 right-6 p-2 rounded-xl neu-btn text-slate-400 hover:text-white cursor-pointer"
            >
              <X size={18} />
            </button>

            {purchaseSuccess ? (
              <div className="text-center py-8 space-y-4 animate-fade-in">
                <div className="w-16 h-16 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(6,182,212,0.4)]">
                  <CheckCircle2 size={32} />
                </div>
                <h3 className="text-2xl font-black uppercase tracking-tight text-white font-grotesk">LICENSE ISSUED!</h3>
                <p className="text-xs text-slate-300">
                  PERPETUAL RIGHTS GRANTED TO <strong className="text-white">{companyName}</strong>.
                </p>
                <div className="text-[10px] font-mono text-cyan-400">REDIRECTING TO YOUR BUYER VAULT...</div>
              </div>
            ) : (
              <form onSubmit={handlePurchase} className="space-y-6">
                <div>
                  <span className="text-[9px] font-mono text-cyan-400 uppercase font-black tracking-widest">
                    CHECKOUT &amp; PERPETUAL EULA ISSUANCE
                  </span>
                  <h3 className="text-2xl font-black uppercase tracking-tight text-white mt-1 font-grotesk">
                    {selectedFontForPurchase.name}
                  </h3>
                  <p className="text-xs text-slate-300">PERPETUAL COMMERCIAL RIGHTS WITH ZERO RECURRING SUBSCRIPTIONS.</p>
                </div>

                {/* Tier Selection */}
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">
                    SELECT LICENSE TIER:
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { id: 'personal', name: 'PERSONAL', desc: '1 User / Non-comm', price: selectedFontForPurchase.prices.personal },
                      { id: 'commercial', name: 'COMMERCIAL', desc: '5 Seats / 500k views', price: selectedFontForPurchase.prices.commercial },
                      { id: 'extended', name: 'EXTENDED', desc: 'Unlimited / SaaS & App', price: selectedFontForPurchase.prices.extended },
                      { id: 'enterprise', name: 'ENTERPRISE', desc: 'All Media / Global', price: selectedFontForPurchase.prices.enterprise }
                    ].map((tier) => (
                      <div
                        key={tier.id}
                        onClick={() => setSelectedTier(tier.id as any)}
                        className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                          selectedTier === tier.id
                            ? 'neu-btn-primary border-white/40 text-white shadow-xl'
                            : 'neu-btn text-slate-400 hover:text-white'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-black text-[10px] uppercase tracking-wider text-white">{tier.name}</span>
                          <span className="font-mono text-xs font-bold text-cyan-300">${tier.price}</span>
                        </div>
                        <div className="text-[9px] text-slate-300 mt-1 uppercase font-semibold">{tier.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Organization Name */}
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">
                    LICENSEE ENTITY NAME *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="STUDIO NOVA LABS"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full bg-[#050813] border border-white/15 rounded-2xl px-4 py-3 text-xs text-white placeholder-slate-500 font-bold uppercase tracking-wider focus:outline-none focus:border-cyan-400"
                  />
                </div>

                {/* Total */}
                <div className="p-4 rounded-2xl bg-[#050813] border border-white/10 flex justify-between items-center shadow-inner">
                  <div>
                    <div className="text-[9px] text-slate-400 uppercase font-black">TOTAL AMOUNT:</div>
                    <div className="text-2xl font-black text-cyan-400 font-mono">
                      ${selectedFontForPurchase.prices[selectedTier]}.00
                    </div>
                  </div>
                  <div className="text-right text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
                    PERPETUAL EULA • NO RECURRING FEES
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full neu-btn-primary h-14 rounded-2xl text-white font-black uppercase tracking-[0.25em] text-[11px] shadow-2xl cursor-pointer hover:scale-105 transition-all"
                >
                  CONFIRM &amp; ISSUE TO BUYER VAULT
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Mobile Floating Bottom Dock (Smartphones Only) */}
      <div className="md:hidden fixed bottom-4 inset-x-4 z-40">
        <div className="bg-[#080c18]/95 backdrop-blur-2xl px-4 py-2.5 rounded-3xl border border-white/20 shadow-[0_15px_40px_rgba(0,0,0,0.9),_0_0_20px_rgba(99,102,241,0.2)] flex items-center justify-between">
          <Link
            to="/"
            className="flex flex-col items-center gap-1 text-slate-400 hover:text-white p-1.5 transition-colors"
          >
            <Home size={18} />
            <span className="text-[8px] font-black uppercase tracking-wider">Home</span>
          </Link>
          <Link
            to="/shop"
            className="flex flex-col items-center gap-1 text-cyan-400 p-1.5"
          >
            <ShoppingBag size={18} />
            <span className="text-[8px] font-black uppercase tracking-wider">Fonts</span>
          </Link>
          
          {/* Floating Center Studio Button */}
          <button
            onClick={() => setViewMode(viewMode === 'grid' ? 'studio' : 'grid')}
            className="neu-btn-primary w-11 h-11 -mt-6 rounded-full flex items-center justify-center text-white shadow-xl shadow-indigo-500/40 hover:scale-110 active:scale-95 transition-all cursor-pointer"
          >
            <Type size={18} />
          </button>

          <Link
            to="/shop"
            className="flex flex-col items-center gap-1 text-slate-400 hover:text-cyan-300 p-1.5 transition-colors"
          >
            <Sparkles size={18} />
            <span className="text-[8px] font-black uppercase tracking-wider">Catalog</span>
          </Link>
          
          {isLoggedIn ? (
            <Link
              to="/buyer"
              className="flex flex-col items-center gap-1 text-indigo-300 hover:text-white p-1.5 transition-colors"
            >
              <LayoutDashboard size={18} />
              <span className="text-[8px] font-black uppercase tracking-wider">Vault</span>
            </Link>
          ) : (
            <Link
              to="/login"
              className="flex flex-col items-center gap-1 text-purple-300 hover:text-white p-1.5 transition-colors"
            >
              <Key size={18} />
              <span className="text-[8px] font-black uppercase tracking-wider">Log In</span>
            </Link>
          )}
        </div>
      </div>

      {/* Auth Gate Modal */}
      <AuthGateModal
        isOpen={authGateOpen}
        onClose={() => setAuthGateOpen(false)}
        fontName={targetFontName}
        onSuccess={() => {
          setLocalUserEmail(localStorage.getItem('alphaxen_user_email'));
          navigate('/buyer');
        }}
      />

      {/* Font Security & DRM Inspector Modal */}
      <FontSecurityModal
        isOpen={showSecurityModal}
        onClose={() => setShowSecurityModal(false)}
        defaultKey={securityTargetKey}
      />
    </div>
  );
};

export default Shop;
