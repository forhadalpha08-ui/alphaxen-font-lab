import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Download, Key, Globe, Shield, FileText, Plus, Copy,
  Check, RefreshCw, Layers, ArrowUpRight, Search,
  Sliders, Star, Sparkles, ExternalLink, HardDrive, CheckCircle2,
  Trash2, AlertCircle, ShoppingBag, Eye, Lock, ArrowLeft, LogOut,
  Menu, X, Home, Code, ShieldCheck, MessageSquare, Send, Mail,
  Phone, HelpCircle, Laptop, CheckCheck, Compass
} from 'lucide-react';
import { onAuthStateChanged, signOut, User as FirebaseUser } from 'firebase/auth';
import { auth } from '../services/firebase';
import BrandMark from '../components/BrandMark';
import { FONT_CATALOG, FontItem, PurchasedFontLicense } from '../services/fontData';
import { getCurrentUser, UserRecord } from '../services/authManager';
import PendingApprovalView from '../components/PendingApprovalView';
import FontSecurityModal from '../components/FontSecurityModal';
import { soundFx } from '../services/soundFx';
import { FOUNDRY_CONTACT, createWhatsAppDealUrl, createEmailDealUrl } from '../services/contact';

export const BuyerPortal: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'deals' | 'vault' | 'custom' | 'cdn' | 'eula'>('deals');
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [newDomain, setNewDomain] = useState('');
  const [embedFormat, setEmbedFormat] = useState<'html' | 'css' | 'tailwind'>('html');
  const [downloadSuccessModal, setDownloadSuccessModal] = useState<{ fontName: string, format: string } | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Selected License Tier for quick deals
  const [selectedTiers, setSelectedTiers] = useState<Record<string, 'personal' | 'commercial' | 'extended' | 'enterprise'>>({
    'abdullah-martel': 'commercial',
    'abdullah-metallic-chrome': 'commercial',
    'abdullah-molten-chrome': 'commercial',
    'abdullah-moon-chrome': 'commercial',
    'abdullah-stone-chrome': 'commercial',
    'abdullah-stone-moon': 'commercial'
  });

  // Custom Bespoke Commission Form
  const [commissionForm, setCommissionForm] = useState({
    name: '',
    email: '',
    company: '',
    projectType: 'Bespoke Brand Typeface',
    weightsCount: '4 Weights',
    budget: '$500 - $1,500',
    details: ''
  });
  const [commissionSent, setCommissionSent] = useState(false);

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

  // Real Purchased Licenses from LocalStorage (no fake records)
  const [purchasedLicenses, setPurchasedLicenses] = useState<PurchasedFontLicense[]>(() => {
    const saved = localStorage.getItem('alphaxen_buyer_licenses');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {}
    }
    return [];
  });

  const [domains, setDomains] = useState<string[]>(() => {
    const saved = localStorage.getItem('alphaxen_buyer_domains');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {}
    }
    return ['localhost'];
  });

  useEffect(() => {
    localStorage.setItem('alphaxen_buyer_licenses', JSON.stringify(purchasedLicenses));
  }, [purchasedLicenses]);

  useEffect(() => {
    localStorage.setItem('alphaxen_buyer_domains', JSON.stringify(domains));
  }, [domains]);

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

  const handleCommissionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const customMessage = `Hello Alphaxen Foundry! 👋\n\nI want to commission a *${commissionForm.projectType}*.\n\n👤 Name: ${commissionForm.name}\n📧 Email: ${commissionForm.email}\n🏢 Company: ${commissionForm.company || 'N/A'}\n📐 Scope: ${commissionForm.weightsCount}\n💵 Estimated Budget: ${commissionForm.budget}\n📝 Project Details: ${commissionForm.details || 'None provided'}`;
    
    window.open(createWhatsAppDealUrl({ customMessage }), '_blank');
    setCommissionSent(true);
  };

  const filteredCatalog = FONT_CATALOG.filter(f =>
    f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // If user is logged in and status is pending approval by admin
  if (currentUser && currentUser.status === 'pending') {
    return <PendingApprovalView user={currentUser} targetRole="buyer" onApproved={() => setCurrentUser(getCurrentUser())} />;
  }

  return (
    <div className="min-h-screen bg-[#0b0e17] text-slate-100 selection:bg-purple-500/30 selection:text-purple-100 font-sans overflow-x-hidden">
      
      {/* Top Sticky High-Definition Header */}
      <header className="sticky top-0 z-50 w-full bg-transparent max-md:border-transparent max-md:shadow-none md:bg-[#0b0e17]/98 md:backdrop-blur-xl md:border-b md:border-white/10 md:shadow-2xl">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 py-3.5 flex justify-between items-center">
          <BrandMark suffix="BUYER VAULT & DEALS" />

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
            <Link to="/docs" className="neu-btn px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-purple-300 hover:text-white">
              DOCS
            </Link>

            {/* Direct WhatsApp Contact Button */}
            <a
              href={createWhatsAppDealUrl({ type: 'general' })}
              target="_blank"
              rel="noopener noreferrer"
              className="neu-btn-primary px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-white flex items-center gap-1.5 shadow-md hover:scale-105 transition-all"
            >
              <MessageSquare size={13} />
              WHATSAPP DEAL
            </a>

            <div className="h-4 w-px bg-white/15 mx-1" />

            <div className="flex items-center gap-2">
              <Link
                to="/shop"
                className="neu-btn-primary px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-white shadow-lg flex items-center gap-1.5"
              >
                <ShoppingBag size={13} /> BROWSE STORE
              </Link>
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

          <button className="md:hidden text-white p-2.5 rounded-xl neu-btn cursor-pointer" onClick={() => setIsMenuOpen(!isMenuOpen)}>
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
              <span>Foundry Home</span>
            </Link>

            <Link 
              to="/shop" 
              className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-black/60 border border-white/10 text-xs font-black uppercase tracking-wider text-slate-200 hover:text-white"
              onClick={() => setIsMenuOpen(false)}
            >
              <ShoppingBag size={16} className="text-purple-400" />
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

            <a 
              href={createWhatsAppDealUrl({ type: 'general' })}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-4 py-3 rounded-2xl neu-btn-primary text-xs font-black uppercase tracking-wider text-white shadow-lg"
              onClick={() => setIsMenuOpen(false)}
            >
              <MessageSquare size={16} />
              <span>WhatsApp Direct Line</span>
            </a>

            <div className="h-px bg-white/10 my-2" />
            
            {currentUser && (
              <button 
                onClick={() => { setIsMenuOpen(false); handleSignOut(); }} 
                className="neu-btn text-xs font-bold uppercase tracking-widest text-rose-400 py-3 rounded-2xl w-full flex items-center justify-center gap-2 cursor-pointer"
              >
                <LogOut size={16} /> Sign Out
              </button>
            )}
          </div>
        )}
      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-6 sm:px-12 pt-8 pb-24">
        
        {/* Header Hero Banner */}
        <div className="liquid-glass border border-white/20 p-8 sm:p-12 md:p-14 rounded-[2.5rem] mb-12 shadow-2xl space-y-6 relative overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="space-y-4 max-w-2xl">
              <div className="inline-flex items-center gap-3 py-1.5 px-5 rounded-full bg-[#141414] border border-purple-500/40 text-[10px] font-black uppercase tracking-[0.25em] text-purple-300 shadow-md">
                <span className="flex h-2 w-2 rounded-full bg-purple-400 animate-pulse shadow-[0_0_10px_rgba(139,92,246,1)]" />
                BUYER &amp; AGENCY PORTAL
              </div>
              <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-white font-grotesk leading-tight">
                TYPEFACE DEALS &amp; <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-300 to-sky-400">
                  BUYER VAULT.
                </span>
              </h1>
              <p className="text-slate-200 text-sm sm:text-base font-semibold leading-relaxed">
                DEAL DIRECTLY FOR COMMERCIAL LICENSES VIA WHATSAPP OR EMAIL, DOWNLOAD REAL TTF/OTF ASSET PACKAGES, AND MANAGE PERPETUAL EULA CERTIFICATES.
              </p>
            </div>

            {/* Real Stats Box */}
            <div className="flex flex-wrap sm:flex-nowrap items-stretch gap-2 sm:gap-4 bg-[#0b0e17] border border-white/20 p-3.5 sm:p-5 rounded-3xl shadow-inner w-full lg:w-auto shrink-0">
              <div className="flex-1 min-w-[90px] text-center px-3 sm:px-5 border-r border-white/15 flex flex-col justify-center">
                <div className="text-xl sm:text-2xl md:text-3xl lg:text-3xl font-black text-white font-mono tracking-tight whitespace-nowrap overflow-hidden text-ellipsis">
                  {purchasedLicenses.length.toLocaleString()}
                </div>
                <div className="text-[9px] sm:text-[10px] text-slate-300 uppercase font-black tracking-wider sm:tracking-widest mt-1 whitespace-nowrap">
                  VAULT FONTS
                </div>
              </div>
              <div className="flex-1 min-w-[80px] text-center px-3 sm:px-5 border-r border-white/15 flex flex-col justify-center">
                <div className="text-xl sm:text-2xl md:text-3xl lg:text-3xl font-black text-purple-300 font-mono tracking-tight whitespace-nowrap">
                  {FONT_CATALOG.length}
                </div>
                <div className="text-[9px] sm:text-[10px] text-slate-300 uppercase font-black tracking-wider sm:tracking-widest mt-1 whitespace-nowrap">
                  CATALOG
                </div>
              </div>
              <div className="flex-1 min-w-[90px] text-center px-3 sm:px-5 flex flex-col justify-center">
                <div className="text-xl sm:text-2xl md:text-3xl lg:text-3xl font-black text-purple-400 font-mono tracking-tight whitespace-nowrap">
                  DIRECT
                </div>
                <div className="text-[9px] sm:text-[10px] text-slate-300 uppercase font-black tracking-wider sm:tracking-widest mt-1 whitespace-nowrap">
                  WHATSAPP DEAL
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation (Buyer Exclusive Sections) */}
        <div className="flex items-center gap-3 border-b border-white/15 pb-6 mb-12 overflow-x-auto custom-scrollbar">
          {[
            { id: 'deals', label: 'DIRECT WHATSAPP & EMAIL DEALS', icon: <MessageSquare size={16} className="text-purple-400" /> },
            { id: 'vault', label: 'MY LICENSED VAULT', icon: <HardDrive size={16} className="text-purple-400" />, count: purchasedLicenses.length },
            { id: 'custom', label: 'COMMISSION CUSTOM FONT', icon: <Sparkles size={16} className="text-purple-400" /> },
            { id: 'cdn', label: 'WEBFONT CDN SNIPPETS', icon: <Code size={16} className="text-purple-400" /> },
            { id: 'eula', label: 'ALLOWED DOMAINS & EULA', icon: <Shield size={16} className="text-purple-400" /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-6 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-2.5 whitespace-nowrap cursor-pointer ${
                activeTab === tab.id
                  ? 'neu-btn-primary text-white shadow-xl scale-105 border-white/40'
                  : 'bg-[#0e1424] border border-white/20 text-slate-100 hover:text-white hover:bg-[#162038] hover:border-purple-400/40 shadow-md'
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

        {/* TAB 1: DIRECT WHATSAPP & EMAIL DEALS */}
        {activeTab === 'deals' && (
          <div className="space-y-8">
            <div className="liquid-glass border border-white/20 p-6 sm:p-8 rounded-[2rem] shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-purple-400 uppercase">
                  <MessageSquare size={14} /> DIRECT FOUNDRY DESK
                </div>
                <h3 className="text-xl sm:text-2xl font-black uppercase text-white font-grotesk">
                  1-Click Direct Deal &amp; Immediate Font Delivery
                </h3>
                <p className="text-xs sm:text-sm text-slate-300">
                  Select your desired license tier below and click to deal instantly via WhatsApp or Email. We provide invoice and instant OTF/TTF delivery.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <a
                  href={`https://wa.me/${FOUNDRY_CONTACT.whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="neu-btn-primary px-6 py-3 rounded-xl text-xs font-black uppercase tracking-wider text-white flex items-center gap-2 shadow-xl hover:scale-105 transition-all"
                >
                  <MessageSquare size={15} /> WhatsApp: {FOUNDRY_CONTACT.phone}
                </a>
                <a
                  href={`mailto:${FOUNDRY_CONTACT.email}`}
                  className="neu-btn px-6 py-3 rounded-xl text-xs font-black uppercase tracking-wider text-slate-200 hover:text-white flex items-center gap-2"
                >
                  <Mail size={15} className="text-purple-400" /> {FOUNDRY_CONTACT.email}
                </a>
              </div>
            </div>

            {/* Font Catalog Deal Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCatalog.map((font) => {
                const activeTier = selectedTiers[font.id] || 'commercial';
                const activePrice = font.prices[activeTier];

                const whatsappUrl = createWhatsAppDealUrl({
                  fontName: font.name,
                  licenseTier: activeTier.toUpperCase(),
                  price: activePrice,
                  type: 'purchase'
                });

                const emailUrl = createEmailDealUrl({
                  fontName: font.name,
                  licenseTier: activeTier.toUpperCase(),
                  price: activePrice,
                  type: 'purchase'
                });

                return (
                  <div
                    key={font.id}
                    className="bg-[#0e0e0e]/95 backdrop-blur-xl border border-white/20 hover:border-purple-500/60 p-7 sm:p-8 rounded-[2.5rem] flex flex-col justify-between space-y-6 shadow-[0_20px_50px_rgba(0,0,0,0.95)] hover:shadow-[0_25px_60px_rgba(139,92,246,0.25)] transition-all duration-300"
                  >
                    <div className="space-y-4">
                      {/* Specimen Artwork */}
                      {font.specimenImage && (
                        <div className="relative rounded-2xl overflow-hidden border border-white/20 bg-[#000000] shadow-xl group/img">
                          <img
                            src={font.specimenImage}
                            alt={font.name}
                            onError={(e) => {
                              const target = e.currentTarget;
                              const currentSrc = target.getAttribute('src') || '';
                              if (currentSrc.startsWith('./')) {
                                target.src = currentSrc.replace('./', '/');
                              } else if (currentSrc.startsWith('/')) {
                                target.src = currentSrc.slice(1);
                              }
                            }}
                            className="w-full h-40 object-cover object-center group-hover/img:scale-105 transition-transform duration-500 select-none block"
                          />
                          <div className="absolute bottom-2 left-2.5 px-2.5 py-0.5 rounded-full bg-black/90 text-[8.5px] font-mono font-bold text-purple-300 uppercase tracking-wider border border-white/20 flex items-center gap-1 shadow-lg">
                            <Sparkles size={10} className="text-purple-400" />
                            <span>{font.stylesCount} STYLES INCLUDED</span>
                          </div>
                        </div>
                      )}

                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <span className="text-[10px] font-mono font-bold text-purple-400 uppercase tracking-widest bg-purple-500/15 px-2.5 py-0.5 rounded-md border border-purple-500/30">
                            {font.category}
                          </span>
                          <h3 className="text-2xl font-black uppercase tracking-tight text-white mt-1 font-grotesk">
                            {font.name}
                          </h3>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-black text-purple-400 font-mono">${activePrice}</div>
                          <div className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">PERPETUAL</div>
                        </div>
                      </div>

                      <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed font-medium">
                        {font.description}
                      </p>

                      {/* License Tier Selector */}
                      <div className="space-y-1.5 pt-2">
                        <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Select License Tier:</label>
                        <div className="grid grid-cols-4 gap-1.5 p-1 bg-black rounded-xl border border-white/10 text-[9px] font-mono font-bold text-center">
                          {(['personal', 'commercial', 'extended', 'enterprise'] as const).map(tier => (
                            <button
                              key={tier}
                              onClick={() => setSelectedTiers({ ...selectedTiers, [font.id]: tier })}
                              className={`py-1.5 rounded-lg uppercase transition-all cursor-pointer ${
                                activeTier === tier
                                  ? 'neu-btn-primary text-white font-black shadow-md'
                                  : 'text-slate-400 hover:text-white'
                              }`}
                            >
                              {tier.slice(0, 4)}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Quick Download TTF Binary (Included Free Specimen) */}
                      <button
                        onClick={() => handleDownloadFont(font.name, 'TTF')}
                        className="w-full neu-btn py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-300 hover:text-white flex items-center justify-center gap-1.5"
                      >
                        <Download size={12} className="text-purple-400" />
                        <span>TEST REAL TTF BINARY</span>
                      </button>
                    </div>

                    {/* Direct Contact Action Buttons */}
                    <div className="space-y-2 pt-4 border-t border-white/15">
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full neu-btn-primary py-3.5 rounded-xl text-xs font-black uppercase tracking-wider text-white flex items-center justify-center gap-2 shadow-xl hover:scale-105 transition-all"
                      >
                        <MessageSquare size={15} /> DEAL ON WHATSAPP (${activePrice})
                      </a>

                      <a
                        href={emailUrl}
                        className="w-full neu-btn py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider text-slate-300 hover:text-white flex items-center justify-center gap-1.5"
                      >
                        <Mail size={13} className="text-purple-400" /> ORDER VIA EMAIL
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: MY LICENSED VAULT */}
        {activeTab === 'vault' && (
          <div className="space-y-8">
            {purchasedLicenses.length === 0 ? (
              <div className="liquid-glass border border-white/20 p-12 sm:p-16 rounded-[2.5rem] text-center space-y-6 shadow-2xl">
                <div className="w-16 h-16 rounded-2xl bg-purple-500/20 text-purple-300 border border-purple-500/40 flex items-center justify-center mx-auto shadow-lg">
                  <HardDrive size={32} />
                </div>
                <div className="max-w-md mx-auto space-y-2">
                  <h3 className="text-2xl font-black uppercase text-white font-grotesk">YOUR VAULT IS READY</h3>
                  <p className="text-xs text-slate-300 leading-relaxed font-medium">
                    You do not have any purchased licenses saved yet. Browse our catalog below to acquire fonts directly via WhatsApp or Email.
                  </p>
                </div>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={() => setActiveTab('deals')}
                    className="neu-btn-primary px-8 py-3.5 rounded-xl text-xs font-black uppercase tracking-widest text-white shadow-xl hover:scale-105 transition-all cursor-pointer"
                  >
                    EXPLORE DIRECT DEALS
                  </button>
                  <Link
                    to="/shop"
                    className="neu-btn px-8 py-3.5 rounded-xl text-xs font-black uppercase tracking-widest text-slate-200 hover:text-white transition-all"
                  >
                    FULL FONT SHOP
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {purchasedLicenses.map((lic) => (
                  <div
                    key={lic.licenseKey}
                    className="bg-[#0e0e0e] border border-white/20 p-6 rounded-3xl space-y-4"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 uppercase">
                          {lic.tier}
                        </span>
                        <h4 className="text-lg font-black uppercase text-white mt-1">{lic.fontName}</h4>
                      </div>
                      <span className="text-xs font-mono font-bold text-purple-400">${lic.pricePaid}</span>
                    </div>

                    <div className="bg-black p-3 rounded-xl border border-white/10 text-xs font-mono text-slate-300 space-y-1">
                      <div>KEY: <span className="text-purple-300 font-bold">{lic.licenseKey}</span></div>
                      <div>DATE: {lic.purchaseDate}</div>
                    </div>

                    <button
                      onClick={() => handleDownloadFont(lic.fontName, 'TTF')}
                      className="w-full neu-btn-primary py-2.5 rounded-xl text-xs font-black uppercase tracking-wider text-white flex items-center justify-center gap-2"
                    >
                      <Download size={14} /> DOWNLOAD OTF/TTF ASSETS
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: COMMISSION CUSTOM FONT */}
        {activeTab === 'custom' && (
          <div className="liquid-glass border border-white/20 p-8 sm:p-12 md:p-14 rounded-[2.5rem] max-w-3xl mx-auto space-y-8 shadow-2xl">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#141414] border border-purple-500/40 text-purple-300 text-[10px] font-black uppercase tracking-widest mb-3">
                <Sparkles size={13} /> BESPOKE TYPE DESIGN
              </div>
              <h3 className="text-3xl font-black uppercase tracking-tight text-white font-grotesk">COMMISSION A CUSTOM TYPEFACE</h3>
              <p className="text-xs sm:text-sm text-slate-200 mt-1 font-medium">
                Need a proprietary bespoke brand typeface, logotype vectorization, or custom stylistic ligatures? Submit your request directly to our lead foundry masters.
              </p>
            </div>

            <form onSubmit={handleCommissionSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    value={commissionForm.name}
                    onChange={e => setCommissionForm({ ...commissionForm, name: e.target.value })}
                    placeholder="e.g. Abdullah Forhad"
                    className="w-full bg-[#0b0e17] border border-white/20 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={commissionForm.email}
                    onChange={e => setCommissionForm({ ...commissionForm, email: e.target.value })}
                    placeholder="name@company.com"
                    className="w-full bg-[#0b0e17] border border-white/20 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300">Company / Studio</label>
                  <input
                    type="text"
                    value={commissionForm.company}
                    onChange={e => setCommissionForm({ ...commissionForm, company: e.target.value })}
                    placeholder="e.g. Apex Interactive"
                    className="w-full bg-[#0b0e17] border border-white/20 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300">Project Type</label>
                  <select
                    value={commissionForm.projectType}
                    onChange={e => setCommissionForm({ ...commissionForm, projectType: e.target.value })}
                    className="w-full bg-[#0b0e17] border border-white/20 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="Bespoke Brand Typeface">Bespoke Brand Typeface</option>
                    <option value="Luxury Haute Serif">Luxury Haute Serif</option>
                    <option value="Specular Metallic Chrome Display">Specular Metallic Chrome Display</option>
                    <option value="Custom Wordmark / Logotype">Custom Wordmark / Logotype</option>
                    <option value="Variable Font Axis Engineering">Variable Font Axis Engineering</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300">Project Scope &amp; Brief</label>
                <textarea
                  rows={4}
                  value={commissionForm.details}
                  onChange={e => setCommissionForm({ ...commissionForm, details: e.target.value })}
                  placeholder="Describe your brand aesthetic, required weights, Latin/Arabic language requirements, and desired timeline..."
                  className="w-full bg-[#0b0e17] border border-white/20 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <button
                  type="submit"
                  className="flex-1 neu-btn-primary py-4 rounded-xl text-xs font-black uppercase tracking-widest text-white flex items-center justify-center gap-2 shadow-xl hover:scale-105 transition-all cursor-pointer"
                >
                  <MessageSquare size={16} /> SUBMIT &amp; CHAT ON WHATSAPP
                </button>

                <a
                  href={createEmailDealUrl({ type: 'custom_font' })}
                  className="neu-btn px-6 py-4 rounded-xl text-xs font-black uppercase tracking-widest text-slate-200 hover:text-white flex items-center justify-center gap-2"
                >
                  <Mail size={16} className="text-purple-400" /> SUBMIT VIA EMAIL
                </a>
              </div>
            </form>
          </div>
        )}

        {/* TAB 4: WEBFONT CDN SNIPPETS */}
        {activeTab === 'cdn' && (
          <div className="liquid-glass border border-white/20 p-8 sm:p-12 md:p-14 rounded-[2.5rem] shadow-2xl space-y-8">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#141414] border border-purple-500/40 text-purple-300 text-[10px] font-black uppercase tracking-widest mb-3">
                <Code size={13} /> PRODUCTION ASSETS
              </div>
              <h3 className="text-3xl font-black uppercase tracking-tight text-white font-grotesk">WEBFONT @FONT-FACE EMBED CODES</h3>
              <p className="text-xs sm:text-sm text-slate-200 mt-1 font-medium">
                Embed authentic Alphaxen fonts in your modern web applications, Next.js setups, or Tailwind stylesheets.
              </p>
            </div>

            <div className="space-y-6">
              {FONT_CATALOG.map((font) => {
                const codeSnippet = `@font-face {
  font-family: '${font.name}';
  src: url('/fonts/${encodeURIComponent(font.name)}/${encodeURIComponent(font.name)}-Regular.ttf') format('truetype');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}`;
                return (
                  <div key={font.id} className="bg-[#0b0e17] border border-white/15 p-6 rounded-2xl space-y-3">
                    <div className="flex justify-between items-center">
                      <h4 className="text-base font-black uppercase text-white font-mono">{font.name}</h4>
                      <button
                        onClick={() => copyText(codeSnippet, font.id)}
                        className="neu-btn px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider text-slate-200 hover:text-white flex items-center gap-1.5 cursor-pointer"
                      >
                        {copiedKey === font.id ? <Check size={12} className="text-purple-400" /> : <Copy size={12} />}
                        <span>{copiedKey === font.id ? 'COPIED' : 'COPY @FONT-FACE'}</span>
                      </button>
                    </div>

                    <pre className="p-4 rounded-xl bg-black border border-white/10 text-xs font-mono text-purple-300 overflow-x-auto custom-scrollbar">
                      <code>{codeSnippet}</code>
                    </pre>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 5: ALLOWED DOMAINS & EULA */}
        {activeTab === 'eula' && (
          <div className="liquid-glass border border-white/20 p-8 sm:p-12 md:p-14 rounded-[2.5rem] shadow-2xl space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white font-grotesk">COMMERCIAL EULA &amp; DOMAIN WHITELIST</h3>
                <p className="text-xs sm:text-sm text-slate-200 mt-1 font-medium">
                  Perpetual commercial licenses include unlimited web app embedding on your registered production domains.
                </p>
              </div>

              <a
                href={createWhatsAppDealUrl({ customMessage: "Hello Alphaxen! I need assistance with domain whitelist or enterprise commercial license extension." })}
                target="_blank"
                rel="noopener noreferrer"
                className="neu-btn-primary px-6 py-3 rounded-xl text-xs font-black uppercase tracking-wider text-white flex items-center gap-2"
              >
                <MessageSquare size={14} /> EULA SUPPORT DESK
              </a>
            </div>

            {/* Whitelist Management Form */}
            <form onSubmit={handleAddDomain} className="flex gap-3">
              <input
                type="text"
                placeholder="Enter domain (e.g. mysite.com)..."
                value={newDomain}
                onChange={e => setNewDomain(e.target.value)}
                className="flex-1 bg-[#0b0e17] border border-white/20 rounded-xl px-4 py-3 text-xs text-white uppercase font-mono focus:outline-none focus:border-purple-500"
              />
              <button
                type="submit"
                className="neu-btn-primary px-6 py-3 rounded-xl text-xs font-black uppercase tracking-wider text-white flex items-center gap-2 cursor-pointer"
              >
                <Plus size={14} /> ADD DOMAIN
              </button>
            </form>

            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">REGISTERED PRODUCTION DOMAINS</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {domains.map(domain => (
                  <div key={domain} className="bg-[#0b0e17] border border-white/15 p-4 rounded-xl flex items-center justify-between">
                    <span className="text-xs font-mono text-white font-bold">{domain}</span>
                    {domain !== 'localhost' && (
                      <button
                        onClick={() => handleRemoveDomain(domain)}
                        className="text-slate-500 hover:text-purple-400 p-1 cursor-pointer"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                ))}
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
                HIGH-PRECISION DIGITAL VARIABLE TYPEFACES &amp; PERPETUAL COMMERCIAL LICENSING DEALT DIRECTLY VIA WHATSAPP &amp; EMAIL.
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href={`https://wa.me/${FOUNDRY_CONTACT.whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="neu-btn-primary px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider text-white flex items-center gap-1.5"
                >
                  <MessageSquare size={13} /> WhatsApp: {FOUNDRY_CONTACT.phone}
                </a>
                <a
                  href={`mailto:${FOUNDRY_CONTACT.email}`}
                  className="neu-btn px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider text-slate-300 hover:text-white flex items-center gap-1.5"
                >
                  <Mail size={13} className="text-purple-400" /> {FOUNDRY_CONTACT.email}
                </a>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white">NAVIGATION</p>
              <div className="flex flex-col gap-3">
                <Link to="/shop" className="text-xs font-bold text-slate-400 hover:text-white transition-colors uppercase tracking-wider w-fit">
                  FONT CATALOG
                </Link>
                <Link to="/buyer" className="text-xs font-bold text-purple-400 hover:text-purple-300 transition-colors uppercase tracking-wider w-fit">
                  BUYER VAULT
                </Link>
                <Link to="/seller" className="text-xs font-bold text-slate-400 hover:text-white transition-colors uppercase tracking-wider w-fit">
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
          <Link to="/buyer" className="flex flex-col items-center gap-1 text-purple-400 p-1.5">
            <HardDrive size={18} />
            <span className="text-[8px] font-black uppercase tracking-wider">Buyer</span>
          </Link>
          <Link to="/seller" className="flex flex-col items-center gap-1 text-slate-400 hover:text-white p-1.5 transition-colors">
            <Layers size={18} />
            <span className="text-[8px] font-black uppercase tracking-wider">Seller</span>
          </Link>
        </div>
      </div>

      {/* Download Toast Modal */}
      {downloadSuccessModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0c0c0c] border border-purple-500/50 p-8 rounded-3xl max-w-sm w-full text-center space-y-4 shadow-2xl animate-scale-up">
            <div className="w-12 h-12 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center mx-auto">
              <CheckCircle2 size={24} />
            </div>
            <h4 className="text-lg font-black uppercase text-white">ASSET DOWNLOADED</h4>
            <p className="text-xs text-slate-300">
              {downloadSuccessModal.fontName} ({downloadSuccessModal.format}) has been delivered to your downloads folder.
            </p>
            <button
              onClick={() => setDownloadSuccessModal(null)}
              className="neu-btn-primary w-full py-2.5 rounded-xl text-xs font-black uppercase tracking-wider text-white"
            >
              CLOSE
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default BuyerPortal;
