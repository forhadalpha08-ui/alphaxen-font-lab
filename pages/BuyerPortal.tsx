import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Download, Key, Globe, Shield, FileText, Plus, Copy,
  Check, RefreshCw, Layers, ArrowUpRight, Search,
  Sliders, Star, Sparkles, ExternalLink, HardDrive, CheckCircle2,
  Trash2, AlertCircle, ShoppingBag, Eye, Lock, ArrowLeft, LogOut,
  Menu, X, Home, Code, ShieldCheck, UserCheck, LayoutDashboard
} from 'lucide-react';
import { onAuthStateChanged, signOut, User as FirebaseUser } from 'firebase/auth';
import { auth } from '../services/firebase';
import BrandMark from '../components/BrandMark';
import { FONT_CATALOG, FontItem, PurchasedFontLicense } from '../services/fontData';
import { getCurrentUser, UserRecord } from '../services/authManager';
import PendingApprovalView from '../components/PendingApprovalView';
import FontSecurityModal from '../components/FontSecurityModal';
import { soundFx } from '../services/soundFx';

export const BuyerPortal: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'library' | 'licenses' | 'webfonts' | 'domains' | 'invoices' | 'wishlist'>('library');
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [newDomain, setNewDomain] = useState('');
  const [embedFormat, setEmbedFormat] = useState<'html' | 'css' | 'tailwind'>('html');
  const [downloadSuccessModal, setDownloadSuccessModal] = useState<{ fontName: string, format: string } | null>(null);
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

  const [purchasedLicenses, setPurchasedLicenses] = useState<PurchasedFontLicense[]>(() => {
    const saved = localStorage.getItem('alphaxen_buyer_licenses');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return [
      {
        licenseKey: 'AX-COMM-8921-9482-XN',
        fontId: 'abdullah-martel',
        fontName: 'Abdullah Martel (6 Styles + Color OTF)',
        tier: 'Commercial',
        purchaseDate: '2026-03-15',
        registeredTo: 'Studio Nova Labs Inc.',
        allowedDomains: ['novalabs.design', 'app.novalabs.design', 'localhost'],
        maxPageviews: '500,000 / month',
        pricePaid: 99,
        status: 'active',
        downloadFormats: ['OTF', 'TTF', 'WOFF', 'WOFF2', 'Color OTF']
      },
      {
        licenseKey: 'AX-COMM-4412-1088-XN',
        fontId: 'abdullah-metallic-chrome',
        fontName: 'Abdullah Metallic Chrome (5 Styles)',
        tier: 'Commercial',
        purchaseDate: '2026-03-20',
        registeredTo: 'Studio Nova Labs Inc.',
        allowedDomains: ['novalabs.design'],
        maxPageviews: '500,000 / month',
        pricePaid: 89,
        status: 'active',
        downloadFormats: ['OTF', 'TTF', 'WOFF2', 'Vector Mesh']
      },
      {
        licenseKey: 'AX-EXTD-1029-7734-XN',
        fontId: 'abdullah-moon-chrome',
        fontName: 'Abdullah Moon Chrome (5 Styles)',
        tier: 'Extended',
        purchaseDate: '2026-03-24',
        registeredTo: 'Studio Nova Labs Inc.',
        allowedDomains: ['*'],
        maxPageviews: 'Unlimited',
        pricePaid: 220,
        status: 'active',
        downloadFormats: ['OTF', 'TTF', 'WOFF', 'WOFF2', 'Color Edition']
      }
    ];
  });

  const [domains, setDomains] = useState<string[]>(['novalabs.design', 'app.novalabs.design', 'staging.novalabs.design', 'localhost']);
  const [wishlist, setWishlist] = useState<string[]>(['abdullah-molten-chrome', 'abdullah-stone-chrome']);

  useEffect(() => {
    localStorage.setItem('alphaxen_buyer_licenses', JSON.stringify(purchasedLicenses));
  }, [purchasedLicenses]);

  const copyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    soundFx.play('success');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleAddDomain = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDomain.trim()) return;
    const clean = newDomain.trim().toLowerCase().replace(/^https?:\/\//, '');
    if (!domains.includes(clean)) {
      setDomains([...domains, clean]);
      setNewDomain('');
      soundFx.play('pop');
    }
  };

  const handleRemoveDomain = (domainToRemove: string) => {
    setDomains(domains.filter(d => d !== domainToRemove));
    soundFx.play('click');
  };

  const handleDownloadFont = (fontName: string, format: string) => {
    soundFx.play('purchase');
    setDownloadSuccessModal({ fontName, format });
    
    // Map font name to real font binary if available
    let realFontPath = '/fonts/Abdullah%20Martel/Abdullah%20Martel-Regular.ttf';
    if (fontName.toLowerCase().includes('metallic')) {
      realFontPath = '/fonts/Abdullah%20Metallic%20Chrome/Abdullah%20Metallic%20Chrome-Regular.ttf';
    } else if (fontName.toLowerCase().includes('molten')) {
      realFontPath = '/fonts/Abdullah%20Molten%20Chrome/Abdullah%20Molten%20Chrome-Regular.ttf';
    } else if (fontName.toLowerCase().includes('moon chrome')) {
      realFontPath = '/fonts/Abdullah%20Moon%20Chrome/Abdullah%20Moon%20Chrome-Regular.ttf';
    } else if (fontName.toLowerCase().includes('stone chrome')) {
      realFontPath = '/fonts/Abdullah%20Stone%20Chrome/Abdullah%20Stone%20Chrome-Regular.ttf';
    } else if (fontName.toLowerCase().includes('stone moon')) {
      realFontPath = '/fonts/Abdullah%20Stone%20Moon/Abdullah%20Stone%20Moon-Regular.ttf';
    }

    const a = document.createElement('a');
    a.href = realFontPath;
    a.download = `${fontName.replace(/[^a-zA-Z0-9]/g, '-')}.${format.toLowerCase().includes('otf') ? 'otf' : 'ttf'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const filteredLicenses = purchasedLicenses.filter(lic =>
    lic.fontName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lic.licenseKey.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // If user is logged in and status is pending approval by admin
  if (currentUser && currentUser.status === 'pending') {
    return <PendingApprovalView user={currentUser} targetRole="buyer" onApproved={() => setCurrentUser(getCurrentUser())} />;
  }

  return (
    <div className="min-h-screen bg-[#070a13] text-slate-100 selection:bg-indigo-500/30 selection:text-indigo-100 font-sans overflow-x-hidden">
      
      {/* Top Sticky High-Definition Header */}
      <header className="sticky top-0 z-50 w-full bg-[#070a13]/98 backdrop-blur-xl border-b border-white/10 shadow-2xl">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 py-3.5 flex justify-between items-center">
          <BrandMark suffix="BUYER VAULT" />

          <div className="hidden md:flex items-center gap-3">
            <Link to="/" className="neu-btn px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 hover:text-white">
              HOME
            </Link>
            <Link to="/shop" className="neu-btn px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 hover:text-white">
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
              className="neu-btn px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-emerald-300 hover:text-white flex items-center gap-1.5 cursor-pointer"
            >
              <ShieldCheck size={12} className="text-emerald-400" />
              DRM &amp; SECURITY
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
              <Link
                to="/shop"
                className="neu-btn-primary px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-white shadow-lg flex items-center gap-1.5"
              >
                <ShoppingBag size={13} /> BROWSE STORE
              </Link>
              <button
                onClick={handleSignOut}
                className="neu-btn px-3 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-rose-400 cursor-pointer"
              >
                <LogOut size={13} />
              </button>
            </div>
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
              className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-black/60 border border-white/10 text-xs font-black uppercase tracking-wider text-slate-200 hover:text-white"
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
              className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-black/60 border border-white/10 text-xs font-black uppercase tracking-wider text-cyan-300 hover:text-white"
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
              <Code size={16} className="text-emerald-400" />
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
            
            <button 
              onClick={() => { setIsMenuOpen(false); handleSignOut(); }} 
              className="neu-btn text-xs font-bold uppercase tracking-widest text-rose-400 py-3 rounded-2xl w-full flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogOut size={16} /> Sign Out
            </button>
          </div>
        )}
      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-6 sm:px-12 pt-8 pb-24">
        
        {/* Header Hero Banner in Solid High-Contrast Obsidian */}
        <div className="bg-[#0b101d] border border-white/20 p-8 sm:p-12 md:p-14 rounded-[2.5rem] mb-12 shadow-2xl space-y-6 relative overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="space-y-4 max-w-2xl">
              <div className="inline-flex items-center gap-3 py-1.5 px-5 rounded-full bg-[#131b2e] border border-cyan-500/40 text-[10px] font-black uppercase tracking-[0.25em] text-cyan-300 shadow-md">
                <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_10px_rgba(6,182,212,1)]" />
                LICENSED BUYER VAULT
              </div>
              <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-white font-grotesk leading-tight">
                YOUR TYPEFACE <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 via-indigo-300 to-purple-400">
                  LIBRARY.
                </span>
              </h1>
              <p className="text-slate-200 text-sm sm:text-base font-semibold leading-relaxed">
                DOWNLOAD COMPILED WOFF2/OTF ASSET PACKAGES, COPY PRODUCTION CDN SNIPPETS, AND MANAGE PERPETUAL COMMERCIAL CERTIFICATES.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 sm:gap-4 bg-[#050814] border border-white/20 p-3.5 sm:p-6 rounded-3xl shadow-inner w-full lg:w-auto">
              <div className="text-center px-1 sm:px-5 border-r border-white/15">
                <div className="text-2xl sm:text-4xl font-black text-white font-mono">{purchasedLicenses.length}</div>
                <div className="text-[8px] min-[360px]:text-[9px] sm:text-[10px] text-slate-300 uppercase font-black tracking-wider sm:tracking-widest mt-1 truncate">FAMILIES</div>
              </div>
              <div className="text-center px-1 sm:px-5 border-r border-white/15">
                <div className="text-2xl sm:text-4xl font-black text-cyan-300 font-mono">44</div>
                <div className="text-[8px] min-[360px]:text-[9px] sm:text-[10px] text-slate-300 uppercase font-black tracking-wider sm:tracking-widest mt-1 truncate">STYLES</div>
              </div>
              <div className="text-center px-1 sm:px-5">
                <div className="text-2xl sm:text-4xl font-black text-emerald-400 font-mono">100%</div>
                <div className="text-[8px] min-[360px]:text-[9px] sm:text-[10px] text-slate-300 uppercase font-black tracking-wider sm:tracking-widest mt-1 truncate">PERPETUAL</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-3 border-b border-white/15 pb-6 mb-12 overflow-x-auto custom-scrollbar">
          {[
            { id: 'library', label: 'PURCHASED LIBRARY', icon: <HardDrive size={16} className="text-cyan-400" />, count: purchasedLicenses.length },
            { id: 'licenses', label: 'COMMERCIAL KEYS', icon: <Key size={16} className="text-purple-400" /> },
            { id: 'webfonts', label: 'WEBFONT CDN', icon: <Globe size={16} className="text-indigo-400" /> },
            { id: 'domains', label: 'ALLOWED DOMAINS', icon: <Shield size={16} className="text-emerald-400" />, count: domains.length },
            { id: 'invoices', label: 'INVOICES', icon: <FileText size={16} className="text-pink-400" /> },
            { id: 'wishlist', label: 'WISHLIST', icon: <Star size={16} className="text-cyan-300" />, count: wishlist.length }
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

        {/* TAB 1: PURCHASED LIBRARY */}
        {activeTab === 'library' && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="SEARCH YOUR FONT LIBRARY..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-[#050814] border border-white/20 rounded-2xl pl-11 pr-4 py-3.5 text-xs text-white placeholder-slate-400 font-bold uppercase tracking-wider focus:outline-none focus:border-cyan-500"
                />
              </div>

              <button
                onClick={() => handleDownloadFont('Alphaxen-Complete-Vault', 'ALL_FONTS_ZIP')}
                className="neu-btn-cyan h-12 px-6 rounded-xl font-black text-[10px] uppercase tracking-widest text-white shadow-lg flex items-center gap-2 cursor-pointer hover:scale-105 transition-all"
              >
                <Download size={14} /> DOWNLOAD COMPLETE VAULT (.ZIP)
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredLicenses.map((license) => {
                const fontDetails = FONT_CATALOG.find(f => f.id === license.fontId);
                return (
                  <div
                    key={license.licenseKey}
                    className="bg-[#0c101d] border border-white/20 hover:border-cyan-500/50 p-8 rounded-[2.5rem] flex flex-col justify-between space-y-6 shadow-2xl transition-all"
                  >
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-[10px] font-mono font-bold text-cyan-300 uppercase tracking-widest">
                            {license.tier} LICENSE
                          </span>
                          <h3 className="text-2xl font-black uppercase tracking-tight text-white mt-1 font-grotesk">
                            {license.fontName}
                          </h3>
                        </div>
                        <span className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                          <CheckCircle2 size={16} />
                        </span>
                      </div>

                      <div className="bg-[#050814] border border-white/15 p-5 rounded-2xl space-y-2">
                        <div
                          style={{
                            fontFamily: fontDetails?.fontFamily || 'sans-serif',
                            fontSize: '24px',
                            lineHeight: 1.2
                          }}
                          className="text-white truncate font-bold"
                        >
                          {fontDetails?.name || license.fontName}
                        </div>
                        <div className="text-[10px] font-mono text-slate-300 uppercase tracking-wider flex items-center justify-between">
                          <span>PURCHASED: {license.purchaseDate}</span>
                          <span className="text-cyan-300 font-bold">{license.downloadFormats.join(' • ')}</span>
                        </div>
                      </div>

                      <div className="space-y-1.5 text-xs font-mono text-slate-200 uppercase tracking-wider">
                        <div className="flex justify-between">
                          <span>KEY:</span>
                          <span className="text-cyan-300 font-bold">{license.licenseKey}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>ENTITY:</span>
                          <span className="text-white font-bold">{license.registeredTo}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-white/10 space-y-2">
                      <div className="text-[9px] font-black text-slate-300 uppercase tracking-widest">
                        DOWNLOAD FORMATS:
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {license.downloadFormats.map((fmt) => (
                          <button
                            key={fmt}
                            onClick={() => handleDownloadFont(license.fontName, fmt)}
                            className="neu-btn py-2.5 px-2 rounded-xl text-[10px] font-black uppercase tracking-wider text-slate-100 hover:text-white flex items-center justify-center gap-1 transition-all cursor-pointer"
                          >
                            <Download size={11} className="text-cyan-400" />
                            <span>{fmt}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: COMMERCIAL KEYS */}
        {activeTab === 'licenses' && (
          <div className="bg-[#0c101d] border border-white/20 p-8 sm:p-12 md:p-14 rounded-[2.5rem] shadow-2xl space-y-8">
            <div>
              <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white font-grotesk">COMMERCIAL LICENSE KEYS</h3>
              <p className="text-xs sm:text-sm text-slate-200 mt-1 font-medium">
                KEEP THESE KEYS ON FILE FOR APP STORE VALIDATION, CLIENT DEPLOYS, AND ENTERPRISE TRANSFERS.
              </p>
            </div>

            <div className="space-y-4">
              {purchasedLicenses.map((lic) => (
                <div
                  key={lic.licenseKey}
                  className="bg-[#050814] border border-white/15 p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-base font-bold text-white">{lic.fontName}</span>
                      <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-mono font-bold">
                        {lic.tier}
                      </span>
                    </div>
                    <div className="text-xs text-slate-300 font-mono">
                      KEY: <strong className="text-cyan-300 font-bold">{lic.licenseKey}</strong> • REGISTERED: <span className="text-white">{lic.registeredTo}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      onClick={() => {
                        setSecurityTargetKey(lic.licenseKey);
                        setShowSecurityModal(true);
                      }}
                      className="neu-btn px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-emerald-300 hover:text-white flex items-center gap-1.5 cursor-pointer border border-emerald-500/40"
                    >
                      <ShieldCheck size={14} className="text-emerald-400" />
                      <span>VERIFY DRM</span>
                    </button>

                    <button
                      onClick={() => copyText(lic.licenseKey, lic.licenseKey)}
                      className="neu-btn px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-100 hover:text-white flex items-center gap-1.5 cursor-pointer"
                    >
                      {copiedKey === lic.licenseKey ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                      <span>{copiedKey === lic.licenseKey ? 'COPIED' : 'COPY KEY'}</span>
                    </button>

                    <button
                      onClick={() => handleDownloadFont(lic.fontName, 'CERTIFICATE_PDF')}
                      className="neu-btn-cyan px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-white flex items-center gap-1.5 cursor-pointer"
                    >
                      <FileText size={14} />
                      <span>PDF EULA</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: WEBFONT CDN */}
        {activeTab === 'webfonts' && (
          <div className="bg-[#0c101d] border border-white/20 p-8 sm:p-12 md:p-14 rounded-[2.5rem] shadow-2xl space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white font-grotesk">WEBFONT CDN INTEGRATION</h3>
                <p className="text-xs sm:text-sm text-slate-200 mt-1 font-medium">
                  GLOBAL LOW-LATENCY EDGE CDN WITH AUTOMATED HTTP/3 CACHING AND UNICODE SUBSETTING.
                </p>
              </div>

              <div className="flex items-center p-1.5 bg-[#050814] rounded-2xl border border-white/20">
                {(['html', 'css', 'tailwind'] as const).map((fmt) => (
                  <button
                    key={fmt}
                    onClick={() => setEmbedFormat(fmt)}
                    className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer ${
                      embedFormat === fmt
                        ? 'neu-btn-primary text-white shadow-md'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    {fmt.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-[#050814] border border-white/15 p-6 rounded-2xl font-mono text-xs text-cyan-300 overflow-x-auto shadow-inner">
              {embedFormat === 'html' && (
                <code>
                  &lt;link rel="preconnect" href="https://cdn.alphaxen.com" crossorigin&gt;<br />
                  &lt;link rel="stylesheet" href="https://cdn.alphaxen.com/v1/fonts.css?family=Alphaxen+Grotesk:wght@400;600;700&display=swap"&gt;
                </code>
              )}
              {embedFormat === 'css' && (
                <code>
                  @import url('https://cdn.alphaxen.com/v1/fonts.css?family=Alphaxen+Grotesk:wght@400;600;700&display=swap');<br /><br />
                  body &#123;<br />
                  &nbsp;&nbsp;font-family: 'Alphaxen Grotesk', sans-serif;<br />
                  &#125;
                </code>
              )}
              {embedFormat === 'tailwind' && (
                <code>
                  // tailwind.config.js<br />
                  export default &#123;<br />
                  &nbsp;&nbsp;theme: &#123;<br />
                  &nbsp;&nbsp;&nbsp;&nbsp;extend: &#123;<br />
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;fontFamily: &#123;<br />
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;grotesk: ['"Alphaxen Grotesk"', 'sans-serif'],<br />
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#125;<br />
                  &nbsp;&nbsp;&nbsp;&nbsp;&#125;<br />
                  &nbsp;&nbsp;&#125;<br />
                  &#125;
                </code>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: ALLOWED DOMAINS */}
        {activeTab === 'domains' && (
          <div className="bg-[#0c101d] border border-white/20 p-8 sm:p-12 md:p-14 rounded-[2.5rem] shadow-2xl space-y-8">
            <div>
              <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white font-grotesk">PRODUCTION DOMAIN WHITELIST</h3>
              <p className="text-xs sm:text-sm text-slate-200 mt-1 font-medium">
                ADD PRODUCTION DOMAINS PERMITTED TO SERVE ALPHAXEN WEBFONTS.
              </p>
            </div>

            <form onSubmit={handleAddDomain} className="flex gap-4 max-w-lg">
              <input
                type="text"
                placeholder="YOURCLIENTWEBSITE.COM"
                value={newDomain}
                onChange={(e) => setNewDomain(e.target.value)}
                className="flex-1 bg-[#050814] border border-white/20 rounded-2xl px-4 py-3 text-xs text-white placeholder-slate-400 font-bold uppercase tracking-wider focus:outline-none focus:border-cyan-500"
              />
              <button
                type="submit"
                className="neu-btn-primary px-6 rounded-2xl font-black text-[10px] uppercase tracking-widest text-white shadow-md cursor-pointer hover:scale-102"
              >
                ADD DOMAIN
              </button>
            </form>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {domains.map((dom) => (
                <div
                  key={dom}
                  className="bg-[#050814] border border-white/15 p-4 rounded-2xl flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(6,182,212,1)]" />
                    <span className="text-xs font-mono font-bold text-white uppercase">{dom}</span>
                  </div>
                  {dom !== 'localhost' && (
                    <button
                      onClick={() => handleRemoveDomain(dom)}
                      className="p-1 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: INVOICES */}
        {activeTab === 'invoices' && (
          <div className="bg-[#0c101d] border border-white/20 p-8 sm:p-12 md:p-14 rounded-[2.5rem] shadow-2xl space-y-8">
            <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white font-grotesk">ORDER INVOICES</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/15 text-slate-300 uppercase tracking-widest text-[10px] font-black">
                    <th className="pb-4">INVOICE #</th>
                    <th className="pb-4">TYPEFACE</th>
                    <th className="pb-4">TIER</th>
                    <th className="pb-4">DATE</th>
                    <th className="pb-4">AMOUNT</th>
                    <th className="pb-4 text-right">RECEIPT</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10 font-mono">
                  {purchasedLicenses.map((lic, i) => (
                    <tr key={lic.licenseKey} className="hover:bg-white/[0.04]">
                      <td className="py-4 text-cyan-300 font-bold">INV-2026-00{i + 1}</td>
                      <td className="py-4 font-sans font-bold text-white">{lic.fontName}</td>
                      <td className="py-4 text-purple-300 uppercase font-bold">{lic.tier}</td>
                      <td className="py-4 text-slate-300">{lic.purchaseDate}</td>
                      <td className="py-4 font-bold text-white text-sm">${lic.pricePaid}.00</td>
                      <td className="py-4 text-right font-sans">
                        <button
                          onClick={() => handleDownloadFont(lic.fontName, `RECEIPT_INV_00${i + 1}`)}
                          className="neu-btn px-4 py-2 rounded-xl text-slate-100 hover:text-white text-[10px] font-black uppercase cursor-pointer"
                        >
                          PDF
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 6: WISHLIST */}
        {activeTab === 'wishlist' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {wishlist.map((fontId) => {
              const font = FONT_CATALOG.find(f => f.id === fontId);
              if (!font) return null;
              return (
                <div key={font.id} className="bg-[#0c101d] border border-white/20 hover:border-cyan-500/50 p-8 rounded-[2.5rem] flex flex-col justify-between space-y-6 shadow-2xl transition-all">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] font-mono text-cyan-300 uppercase font-bold">{font.foundry}</span>
                        <h3 className="text-2xl font-black uppercase tracking-tight text-white mt-1 font-grotesk">{font.name}</h3>
                      </div>
                      <span className="text-xl font-black font-mono text-cyan-300">${font.prices.commercial}</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-200 font-medium leading-relaxed">{font.description}</p>
                  </div>

                  <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                    <Link
                      to="/shop"
                      className="neu-btn-primary px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-white shadow-lg cursor-pointer hover:scale-105 transition-all"
                    >
                      LICENSE TYPEFACE
                    </Link>
                    <button
                      onClick={() => setWishlist(wishlist.filter(id => id !== fontId))}
                      className="text-xs text-slate-400 hover:text-rose-400 font-bold cursor-pointer transition-colors"
                    >
                      REMOVE
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* FOOTER */}
      <footer className="border-t border-white/[0.08] liquid-glass pt-16 pb-28 sm:pb-16 px-6 sm:px-8 relative z-10 overflow-hidden mt-20">
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
                <Link to="/buyer" className="text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors uppercase tracking-wider w-fit">
                  BUYER VAULT
                </Link>
                <Link to="/seller" className="text-xs font-bold text-slate-400 hover:text-white transition-colors uppercase tracking-wider w-fit">
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
          <Link to="/buyer" className="flex flex-col items-center gap-1 text-cyan-400 p-1.5">
            <span className="text-[8px] font-black uppercase tracking-wider">Vault</span>
          </Link>
          <Link to="/seller" className="flex flex-col items-center gap-1 text-slate-400 hover:text-white p-1.5 transition-colors">
            <span className="text-[8px] font-black uppercase tracking-wider">Studio</span>
          </Link>
        </div>
      </div>

      {/* Download Success Modal in Liquid Glass */}
      {downloadSuccessModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-2xl flex items-center justify-center p-4">
          <div className="liquid-glass p-8 sm:p-12 max-w-md w-full text-center space-y-6 shadow-2xl">
            <div className="w-16 h-16 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(6,182,212,0.4)]">
              <Check size={32} />
            </div>
            <h3 className="text-2xl font-black uppercase tracking-tight text-white font-grotesk">DOWNLOAD INITIALIZED</h3>
            <p className="text-xs text-slate-300 leading-relaxed font-medium">
              PACKAGE FOR <strong className="text-white">{downloadSuccessModal.fontName}</strong> ({downloadSuccessModal.format}) HAS BEEN BUNDLED.
            </p>
            <button
              onClick={() => setDownloadSuccessModal(null)}
              className="w-full neu-btn-primary h-14 rounded-2xl text-white font-black uppercase tracking-[0.25em] text-[11px]"
            >
              CONTINUE TO VAULT
            </button>
          </div>
        </div>
      )}

      {/* Cryptographic Font Security & DRM Inspector Modal */}
      <FontSecurityModal
        isOpen={showSecurityModal}
        onClose={() => setShowSecurityModal(false)}
        defaultKey={securityTargetKey}
      />
    </div>
  );
};

export default BuyerPortal;
