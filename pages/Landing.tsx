import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Shield, Lock, Zap, Code, Cloud, BarChart3,
  ChevronRight, Menu, X, Github, ArrowRight,
  ShieldCheck, Activity, Cpu, Globe, Users,
  Terminal, Layers, MessageSquare, ExternalLink,
  ChevronDown, Monitor, CheckCircle2, ShoppingBag,
  Sparkles, Download, Eye, Key, LogOut, LayoutDashboard, Type, Home, Copy, Crown, Sliders
} from 'lucide-react';
import { onAuthStateChanged, signOut, User as FirebaseUser } from 'firebase/auth';
import { auth } from '../services/firebase';
import BrandMark from '../components/BrandMark';
import { AuthGateModal } from '../components/AuthGateModal';
import { MobileDemoShowcase } from '../components/MobileDemoShowcase';
import { InstallAppModal } from '../components/InstallAppModal';
import { FontTesterStudio } from '../components/FontTesterStudio';
import { FONT_CATALOG, FontItem } from '../services/fontData';
import { ref, get } from 'firebase/database';
import { db } from '../services/firebase';
import { getCurrentUser, UserRecord } from '../services/authManager';

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

export const Landing: React.FC = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [authUser, setAuthUser] = useState<FirebaseUser | null>(null);
  const [currentUser, setCurrentUser] = useState<UserRecord | null>(() => getCurrentUser());
  const [localUserEmail, setLocalUserEmail] = useState<string | null>(null);
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [socials, setSocials] = useState<Record<string, {name: string, url: string, iconName: string, id: string, imageUrl?: string}>>({});

  // Auth Gate Modal for "Sign In to Access Font"
  const [authGateOpen, setAuthGateOpen] = useState(false);
  const [targetFontName, setTargetFontName] = useState<string>('');

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    const unsub = onAuthStateChanged(auth, (u) => {
      setAuthUser(u);
    });

    const user = getCurrentUser();
    setCurrentUser(user);
    const stored = localStorage.getItem('alphaxen_user_email') || localStorage.getItem('subCustomerEmailKey');
    setLocalUserEmail(stored ? stored.toLowerCase() : null);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      unsub();
    };
  }, []);

  const isLoggedIn = !!(authUser || localUserEmail || currentUser);

  const handleSignOut = async () => {
    localStorage.removeItem('alphaxen_user_email');
    localStorage.removeItem('alphaxen_user_signed_in');
    localStorage.removeItem('alphaxen_current_user');
    localStorage.removeItem('subCustomerEmailKey');
    setLocalUserEmail(null);
    setCurrentUser(null);
    try {
      await signOut(auth);
    } catch (e) {}
    setAuthUser(null);
  };

  const handleAccessFont = (fontName: string) => {
    if (!isLoggedIn) {
      setTargetFontName(fontName);
      setAuthGateOpen(true);
    } else {
      navigate('/buyer');
    }
  };

  const showGlassHeader = isScrolled || isMenuOpen;

  return (
    <div className="min-h-screen vertex-bg-gradient text-slate-100 selection:bg-purple-500/30 selection:text-purple-100 font-sans overflow-x-hidden scroll-smooth relative">
      
      {/* Top Fixed Dynamic Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ${
          isMenuOpen
            ? 'bg-[#090b16]/95 backdrop-blur-2xl border-b border-white/10 shadow-2xl py-3.5'
            : isScrolled
            ? 'bg-transparent max-md:border-transparent max-md:shadow-none md:bg-[#090b16]/80 md:backdrop-blur-2xl md:border-b md:border-white/10 md:shadow-[0_12px_36px_rgba(0,0,0,0.85),0_0_25px_rgba(139,92,246,0.12)] py-3 sm:py-3.5'
            : 'bg-transparent border-b border-transparent shadow-none py-4 sm:py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-12 flex justify-between items-center">
          <BrandMark />

          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/shop"
              className="bg-[#121426]/80 hover:bg-[#1c203c] border border-white/10 px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider text-slate-300 hover:text-white transition-all shadow-sm"
            >
              FONT CATALOG
            </Link>

            <Link
              to="/tos"
              className="bg-[#121426]/80 hover:bg-[#1c203c] border border-white/10 px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider text-slate-300 hover:text-white transition-all shadow-sm"
            >
              TERMS
            </Link>

            <Link
              to="/docs"
              className="bg-[#121426]/80 hover:bg-[#1c203c] border border-white/10 px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider text-slate-300 hover:text-white transition-all shadow-sm"
            >
              DOCS
            </Link>

            <Link
              to="/install"
              className="btn-vertex-cyan px-5 py-2 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer text-white shadow-lg hover:scale-105 transition-all"
            >
              <Download size={14} /> INSTALL APP
            </Link>

            <div className="h-5 w-[1px] bg-white/20 mx-1.5" />

            {isLoggedIn ? (
              <div className="flex items-center gap-3">
                <Link
                  to={currentUser?.role === 'seller' ? '/seller' : '/buyer'}
                  className="btn-vertex-purple px-6 py-2 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-2 text-white shadow-lg hover:scale-105 transition-all"
                >
                  <LayoutDashboard size={14} /> DASHBOARD
                </Link>

                <button
                  onClick={handleSignOut}
                  className="bg-[#121426]/80 hover:bg-rose-950/40 border border-white/10 hover:border-rose-500/30 px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider text-slate-300 hover:text-rose-300 cursor-pointer flex items-center gap-1.5 transition-all shadow-sm"
                  title="Sign Out"
                >
                  <LogOut size={14} /> SIGN OUT
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="bg-[#121426]/80 hover:bg-[#1c203c] border border-white/10 px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider text-slate-200 hover:text-white transition-all shadow-sm"
                >
                  LOG IN
                </Link>
                <Link
                  to="/signup"
                  className="btn-vertex-purple px-6 py-2 rounded-full text-xs font-black uppercase tracking-wider text-white shadow-lg hover:scale-105 transition-all"
                >
                  SIGN UP
                </Link>
              </div>
            )}
          </div>

          <button className="md:hidden text-white p-2.5 rounded-xl neu-btn cursor-pointer" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Animated Liquid-Glass Drawer */}
        {isMenuOpen && (
          <div className="md:hidden pt-4 pb-2 border-t border-white/10 mt-3 space-y-2 animate-slide-up px-4">
            <Link 
              to="/shop" 
              className="flex items-center gap-3 px-4 py-3 rounded-2xl liquid-glass text-xs font-black uppercase tracking-wider text-slate-200 hover:text-white"
              onClick={() => setIsMenuOpen(false)}
            >
              <ShoppingBag size={16} className="text-purple-400" />
              <span>Font Catalog &amp; Shop</span>
            </Link>
            
            <Link 
              to="/seller" 
              className="flex items-center gap-3 px-4 py-3 rounded-2xl liquid-glass text-xs font-black uppercase tracking-wider text-purple-300 hover:text-white"
              onClick={() => setIsMenuOpen(false)}
            >
              <Layers size={16} className="text-purple-400" />
              <span>Creator Studio (85% Royalty)</span>
            </Link>

            <Link 
              to="/buyer" 
              className="flex items-center gap-3 px-4 py-3 rounded-2xl liquid-glass text-xs font-black uppercase tracking-wider text-slate-200 hover:text-white"
              onClick={() => setIsMenuOpen(false)}
            >
              <LayoutDashboard size={16} className="text-purple-400" />
              <span>Buyer Vault &amp; Licenses</span>
            </Link>

            <Link 
              to="/docs" 
              className="flex items-center gap-3 px-4 py-3 rounded-2xl liquid-glass text-xs font-black uppercase tracking-wider text-slate-200 hover:text-white"
              onClick={() => setIsMenuOpen(false)}
            >
              <Code size={16} className="text-purple-400" />
              <span>Developer Docs &amp; CDN</span>
            </Link>

            <Link 
              to="/tos" 
              className="flex items-center gap-3 px-4 py-3 rounded-2xl liquid-glass text-xs font-black uppercase tracking-wider text-slate-200 hover:text-white"
              onClick={() => setIsMenuOpen(false)}
            >
              <ShieldCheck size={16} className="text-purple-400" />
              <span>Commercial EULA Agreement</span>
            </Link>

            <button
              onClick={() => { setIsMenuOpen(false); setShowInstallModal(true); }}
              className="btn-vertex-cyan text-xs font-black uppercase tracking-widest py-3 px-4 rounded-2xl flex items-center justify-center gap-2.5 w-full text-white cursor-pointer"
            >
              <Download size={16} /> Install Web App
            </button>
            
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
                  className="btn-vertex-purple text-center py-3 rounded-2xl text-xs font-black uppercase tracking-wider text-white" 
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        )}
      </header>

      <main className="relative z-10">
        
        {/* HERO SECTION */}
        <section className="min-h-screen flex flex-col justify-center pt-40 sm:pt-48 lg:pt-48 pb-24 w-full">
          <div className="max-w-7xl mx-auto px-6 sm:px-12 w-full grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center translate-y-3 lg:translate-y-6">
            
            <div className="text-left animate-slide-up [animation-delay:200ms] relative">
              <div className="inline-flex items-center gap-2.5 py-1.5 px-4 rounded-full bg-[#0d0e1c]/80 border border-white/15 text-[8.5px] font-black uppercase tracking-[0.22em] text-slate-300 mb-5 shadow-lg backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-[#818cf8] shadow-[0_0_10px_#818cf8]" />
                DIGITAL TYPE FOUNDRY &amp; LICENSING V2.0
              </div>

              <h1 className="text-3xl min-[370px]:text-4xl sm:text-5xl md:text-5xl lg:text-[3.85rem] font-black tracking-tight mb-5 sm:mb-6 leading-[1.05] sm:leading-[0.98] uppercase font-grotesk">
                <span className="text-white block">NEXT–GEN</span>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#c084fc] via-[#93c5fd] to-[#38bdf8] block mt-1">
                  TYPE FOUNDRY
                </span>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#93c5fd] via-[#67e8f9] to-[#38bdf8] block mt-1">
                  ARCHITECTURE
                </span>
              </h1>

              <p className="text-slate-300 text-[11px] sm:text-xs tracking-[0.12em] uppercase max-w-lg mb-7 sm:mb-8 leading-[1.75] font-semibold">
                EXPLORE MONUMENTAL SERIFS, SPECULAR METALLIC CHROME DISPLAY TYPE, AND ARCHITECTURAL MONOSPACE FONTS. PERPETUAL COMMERCIAL EULA AND INSTANT OTF/TTF ASSETS.
              </p>

              <div className="flex flex-col sm:flex-row gap-3.5 justify-start items-center">
                <Link
                  to={isLoggedIn ? (currentUser?.role === 'seller' ? '/seller' : '/buyer') : '/shop'}
                  className="btn-vertex-purple h-11 sm:h-12 px-6 sm:px-7 rounded-xl font-black flex items-center gap-2 uppercase tracking-wider text-[11px] sm:text-xs text-white cursor-pointer shadow-2xl hover:scale-105 transition-all w-full sm:w-auto justify-center"
                >
                  <Sparkles size={14} />
                  <span>{isLoggedIn ? 'OPEN DASHBOARD' : 'EXPLORE FONT SHOP'}</span>
                  <ArrowRight size={14} />
                </Link>

                <Link
                  to="/install"
                  className="btn-vertex-cyan h-11 sm:h-12 px-6 sm:px-7 rounded-xl font-black uppercase tracking-wider text-[11px] sm:text-xs flex items-center gap-2 cursor-pointer text-white shadow-2xl hover:scale-105 transition-all w-full sm:w-auto justify-center"
                >
                  <Download size={14} />
                  <span>INSTALL WEB APP</span>
                </Link>
              </div>
            </div>

            {/* Exact Fixed 3D Perspective Dashboard Slate */}
            <div className="relative animate-slide-up mt-8 lg:mt-0 [animation-delay:400ms] [perspective:1400px]">
              {/* Decorative Ambient Aura Behind Card */}
              <div className="absolute -inset-6 rounded-[3.5rem] bg-gradient-to-tr from-purple-600/35 via-indigo-600/25 to-cyan-500/30 blur-3xl opacity-85 -z-10 pointer-events-none" />

              {/* 3D Distorted Dashboard Chassis (Outer Glass Bezel) */}
              <div className="hero-3d-card-distort relative p-2.5 sm:p-3 rounded-[2.4rem] bg-white/[0.04] border border-white/20 border-t-2 border-t-white/40 shadow-[0_40px_110px_-20px_rgba(0,0,0,0.98),0_0_70px_rgba(147,51,234,0.35)] backdrop-blur-xl">
                
                {/* Inner Slate Content */}
                <div
                  className="relative bg-[#090b16]/95 border border-white/15 p-3.5 sm:p-4 rounded-[1.8rem] text-slate-300 font-sans overflow-hidden cursor-default"
                >
                  {/* Diagonal Specular Sheen */}
                  <div className="absolute -inset-[150%] bg-gradient-to-tr from-transparent via-white/[0.04] to-transparent rotate-45 pointer-events-none" />
                  
                  {/* 1. Top Metrics Bar (Font Foundry Counters) */}
                  <div className="grid grid-cols-5 gap-2 mb-2.5">
                    {[
                      { label: 'TOTAL FAMILIES', val: '6', color: 'text-white' },
                      { label: 'ACTIVE STYLES', val: '32', color: 'text-cyan-400' },
                      { label: 'EULA LICENSES', val: '1,420', color: 'text-purple-400' },
                      { label: 'COMMERCIAL DRM', val: '100%', color: 'text-cyan-400' },
                      { label: 'OTF/TTF ASSETS', val: '64', color: 'text-emerald-400' },
                    ].map((stat, i) => (
                      <div key={i} className="bg-black/60 border border-white/10 p-1.5 sm:p-2 rounded-lg text-center space-y-0.5">
                        <div className="text-[6.5px] font-mono font-bold text-slate-400 uppercase tracking-wider truncate">
                          {stat.label}
                        </div>
                        <div className={`text-xs sm:text-sm font-black font-mono ${stat.color}`}>
                          {stat.val}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* 2. Main Dashboard Split View */}
                  <div className="grid grid-cols-12 gap-2.5">
                    
                    {/* Left Mini Sidebar */}
                    <div className="col-span-4 bg-black/60 border border-white/10 rounded-xl p-2 space-y-1.5 flex flex-col justify-between text-[7.5px] font-mono font-bold uppercase">
                      <div className="space-y-1">
                        {/* Brand Header */}
                        <div className="flex items-center gap-1.5 p-1 bg-purple-950/40 rounded-lg border border-purple-500/30 mb-1">
                          <div className="w-4 h-4 rounded-md bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white text-[8px] font-black">
                            AX
                          </div>
                          <div className="truncate">
                            <div className="text-[7.5px] text-white font-black leading-none">ALPHAXEN CORE</div>
                            <div className="text-[6px] text-purple-300">TYPE FOUNDRY</div>
                          </div>
                        </div>

                        {/* Nav Buttons */}
                        <Link to="/shop" className="px-2 py-1 rounded-md bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 flex items-center gap-1 font-black">
                          <Type size={9} className="text-cyan-400" />
                          <span>TYPE SPECIMEN</span>
                        </Link>
                        <Link to="/shop" className="px-2 py-0.5 rounded-md text-slate-400 hover:text-white flex items-center gap-1">
                          <ShoppingBag size={9} />
                          <span>FONT SHOP</span>
                        </Link>
                        <Link to="/tos" className="px-2 py-0.5 rounded-md text-slate-400 hover:text-white flex items-center gap-1">
                          <ShieldCheck size={9} />
                          <span>EULA LICENSES</span>
                        </Link>
                        <Link to="/seller" className="px-2 py-0.5 rounded-md text-slate-400 hover:text-white flex items-center gap-1">
                          <Crown size={9} />
                          <span>CREATOR STUDIO</span>
                        </Link>
                        <Link to="/#mobile-showcase" className="px-2 py-0.5 rounded-md text-slate-400 hover:text-white flex items-center gap-1">
                          <Sliders size={9} />
                          <span>VARIABLE AXES</span>
                        </Link>
                        <Link to="/docs" className="px-2 py-0.5 rounded-md text-slate-400 hover:text-white flex items-center gap-1">
                          <Globe size={9} />
                          <span>GLYPH CDN</span>
                        </Link>
                      </div>

                      <div className="px-2 py-1 rounded-md bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center gap-1 mt-1 text-[7px]">
                        <LogOut size={8} />
                        <span>SIGN OUT</span>
                      </div>
                    </div>

                    {/* Right Application Details Area */}
                    <div className="col-span-8 bg-black/60 border border-white/10 rounded-xl p-2.5 space-y-2 relative overflow-hidden flex flex-col justify-between">
                      
                      {/* Header */}
                      <div className="flex items-center justify-between pb-1.5 border-b border-white/10 text-[8px] font-mono font-bold">
                        <span className="flex items-center gap-1.5 text-slate-200 uppercase tracking-wider">
                          <Type size={10} className="text-cyan-400" />
                          <span>FOUNDRY RELEASE SPEC</span>
                        </span>
                        <span className="px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[6.5px] uppercase font-black">
                          VERIFIED EULA
                        </span>
                      </div>

                      {/* Form Fields Simulation */}
                      <div className="space-y-1.5 text-[7.5px] font-mono">
                        <div>
                          <div className="text-[6.5px] text-slate-400 uppercase font-bold mb-0.5">FLAGSHIP TYPEFACE</div>
                          <div className="px-2 py-1 bg-black/80 border border-white/15 rounded-md text-white font-bold flex items-center justify-between">
                            <span>Abdullah Martel (Haute-Serif)</span>
                            <Lock size={8} className="text-slate-500" />
                          </div>
                        </div>

                        <div>
                          <div className="text-[6.5px] text-slate-400 uppercase font-bold mb-0.5">PERPETUAL EULA HASH</div>
                          <div className="px-2 py-1 bg-black/80 border border-white/15 rounded-md text-cyan-300 font-bold flex items-center justify-between">
                            <span>EULA:SHA256:0x89F4...22C1</span>
                            <Copy size={8} className="text-cyan-400 cursor-pointer" />
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-0.5">
                          <div>
                            <div className="text-[6.5px] text-slate-400 uppercase font-bold">ACTIVE MASTER SUITE</div>
                            <div className="text-slate-300 font-bold text-[7.5px]">6 STYLES + 3D COLOR OTF</div>
                          </div>
                          <div className="flex items-center gap-1">
                            <Link to="/shop" className="btn-vertex-cyan px-2.5 py-0.5 rounded text-white font-black text-[7px] uppercase shadow">
                              DOWNLOAD ASSETS
                            </Link>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons Row */}
                      <div className="flex items-center gap-1.5 pt-1.5 border-t border-white/10 text-[6.5px] font-mono font-bold">
                        <Link to="/#studio" className="flex-1 py-0.5 rounded bg-purple-500/15 border border-purple-500/30 text-purple-300 uppercase text-center truncate">
                          TEST IN STUDIO
                        </Link>
                        <Link to="/#mobile-showcase" className="flex-1 py-0.5 rounded bg-purple-500/15 border border-purple-500/30 text-purple-300 uppercase text-center truncate">
                          VARIABLE AXES
                        </Link>
                        <Link to="/tos" className="flex-1 py-0.5 rounded bg-purple-500/15 border border-purple-500/30 text-purple-300 uppercase text-center truncate">
                          PERPETUAL EULA
                        </Link>
                      </div>
                    </div>

                  </div>
                </div>

                {/* 3. Floating Bottom-Right Purple Shield Badge */}
                <div
                  className="absolute -bottom-3 -right-3 w-14 h-14 sm:w-16 sm:h-16 rounded-2xl shield-badge-vertex flex items-center justify-center text-white z-20 shadow-2xl"
                  style={{ transform: 'translateZ(45px)' }}
                >
                  <ShieldCheck size={28} className="text-white drop-shadow-md" />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center mt-12 animate-bounce">
            <ChevronDown className="text-white/30" />
          </div>
        </section>

        {/* INTERACTIVE MOBILE DEMO SHOWCASE SECTION */}
        <section id="mobile-showcase" className="py-20 border-y border-white/[0.08] liquid-glass relative z-10">
          <MobileDemoShowcase />
        </section>

        {/* ECOSYSTEM MARQUEE */}
        <section className="py-20 border-y border-white/10 bg-black/20 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-6">
            <p className="text-center text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-10">
              ENGINEERED FOR MODERN DESIGN SYSTEMS & FRAMEWORKS
            </p>
            <div className="flex flex-wrap justify-center items-center gap-10 md:gap-16 opacity-60 hover:opacity-100 transition-opacity">
              {['WOFF2', 'VARIABLE GX', 'OPENTYPE', 'NEXT.JS', 'TAILWIND', 'FIGMA', 'WEBFLOW', 'IOS/ANDROID'].map((tool) => (
                <div key={tool} className="text-xl font-black italic tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400">
                  {tool}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* STATS METRIC GRID IN HIGH-CONTRAST OBSIDIAN */}
        <section className="py-16 sm:py-24 px-4 sm:px-12 max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-6">
            {[
              { label: 'TYPEFACES', val: '180+ STYLES', icon: <Type size={16} />, color: 'text-purple-300' },
              { label: 'CREATOR ROYALTY', val: '85% SPLIT', icon: <Sparkles size={16} />, color: 'text-purple-300' },
              { label: 'CDN LATENCY', val: '50ms EDGE', icon: <Cpu size={16} />, color: 'text-purple-300' },
              { label: 'COMMERCIAL EULA', val: 'PERPETUAL', icon: <ShieldCheck size={16} />, color: 'text-purple-300' },
            ].map((stat, i) => (
              <div
                key={i}
                className="liquid-glass-textbox p-4 sm:p-6 md:p-8 rounded-[1.75rem] sm:rounded-[2rem] space-y-2 sm:space-y-3 shadow-xl transition-all hover:translate-y-[-2px] overflow-hidden flex flex-col justify-between"
              >
                <div className={`flex items-center gap-1.5 sm:gap-2 text-[8px] min-[360px]:text-[9px] sm:text-[10px] font-black uppercase tracking-wider sm:tracking-[0.25em] ${stat.color} truncate`}>
                  <span className="shrink-0">{stat.icon}</span>
                  <span className="truncate">{stat.label}</span>
                </div>
                <div className="text-base min-[360px]:text-lg sm:text-2xl md:text-3xl lg:text-4xl font-black tracking-tight text-white font-mono leading-tight break-words">
                  {stat.val}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION: LIVE INTERACTIVE TYPE STUDIO */}
        <section id="studio" className="py-20 px-6 sm:px-12 max-w-7xl mx-auto relative z-10">
          <div className="mb-10 text-center space-y-3">
            <div className="inline-flex items-center gap-2 py-1.5 px-5 rounded-full liquid-glass-textbox text-[10px] font-black uppercase tracking-[0.25em] text-purple-300 shadow-md">
              <Sparkles size={14} className="text-purple-400" />
              <span>LIVE INTERACTIVE TYPE ENGINE</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white font-grotesk">
              TEST 6 AUTHENTIC FONTS LIVE.
            </h2>
            <p className="text-slate-200 text-xs sm:text-sm max-w-2xl mx-auto font-medium">
              Interact with genuine OpenType font binaries, adjust weights and letter spacing, test waterfall sizes, and inspect full glyph character sets.
            </p>
          </div>

          <FontTesterStudio onSelectLicense={(font) => handleAccessFont(font.name)} />
        </section>

        {/* SECTION: FEATURED FONT CATALOG */}
        <section className="py-24 px-6 sm:px-12 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
            <div className="space-y-2">
              <div className="inline-block px-5 py-2 rounded-full liquid-glass-textbox text-[10px] font-black uppercase tracking-[0.25em] text-purple-300 shadow-md">
                FEATURED FAMILIES
              </div>
              <h2 className="text-4xl sm:text-5xl font-black uppercase tracking-tight text-white font-grotesk">
                FOUNDRY RELEASES.
              </h2>
            </div>
            <Link
              to="/shop"
              className="neu-btn px-6 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.25em] text-purple-300 hover:text-white flex items-center gap-2 shadow-lg"
            >
              <span>VIEW ALL {FONT_CATALOG.length} TYPEFACES</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {FONT_CATALOG.slice(0, 6).map((font) => (
              <div
                key={font.id}
                className="liquid-glass-textbox p-8 rounded-[2.5rem] flex flex-col justify-between space-y-6 shadow-2xl transition-all"
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-purple-300 uppercase tracking-widest">
                        {font.foundry} • {font.category}
                      </span>
                      <h3 className="text-2xl font-black uppercase tracking-tight text-white mt-1 font-grotesk">
                        {font.name}
                      </h3>
                    </div>
                    {font.badge && (
                      <span className="text-[9px] font-black px-2.5 py-1 rounded-full bg-purple-500/30 text-purple-200 border border-purple-500/40 uppercase tracking-widest">
                        {font.badge}
                      </span>
                    )}
                  </div>

                  {font.specimenImage ? (
                    <div className="relative rounded-2xl overflow-hidden border border-white/15 group/img bg-[#0b0e17] shadow-inner">
                      <img
                        src={font.specimenImage}
                        alt={`${font.name} Specimen`}
                        onError={(e) => {
                          const target = e.currentTarget;
                          const currentSrc = target.getAttribute('src') || '';
                          if (currentSrc.startsWith('./')) {
                            target.src = currentSrc.replace('./', '/');
                          } else if (currentSrc.startsWith('/')) {
                            target.src = currentSrc.slice(1);
                          }
                        }}
                        className="w-full h-36 object-cover object-center group-hover/img:scale-105 transition-transform duration-500 pointer-events-none select-none"
                        loading="lazy"
                      />
                      {font.watermarkImage && (
                        <img
                          src={font.watermarkImage}
                          alt="Watermark"
                          onError={(e) => {
                            const target = e.currentTarget;
                            const currentSrc = target.getAttribute('src') || '';
                            if (currentSrc.startsWith('./')) {
                              target.src = currentSrc.replace('./', '/');
                            } else if (currentSrc.startsWith('/')) {
                              target.src = currentSrc.slice(1);
                            }
                          }}
                          className="absolute top-2.5 right-2.5 w-6 h-6 object-contain opacity-80 pointer-events-none drop-shadow-md"
                        />
                      )}
                      <div className="absolute bottom-2 left-2.5 px-2.5 py-0.5 rounded-full bg-black/80 backdrop-blur-md text-[8px] font-mono font-bold text-purple-300 uppercase tracking-wider border border-white/15">
                        AUTHENTIC SPECIMEN
                      </div>
                    </div>
                  ) : (
                    <div className="bg-[#0b0e17] border border-white/15 p-5 rounded-2xl min-h-[90px] flex items-center justify-center overflow-hidden">
                      <div
                        style={{
                          fontFamily: font.fontFamily,
                          fontSize: '26px',
                          lineHeight: 1.15,
                          backgroundImage: font.colorGradient,
                          filter: font.glowShadow ? `drop-shadow(${font.glowShadow})` : undefined
                        }}
                        className={`text-center truncate font-specimen-waterfall w-full font-bold ${
                          font.colorGradient ? 'bg-clip-text text-transparent' : 'text-white'
                        }`}
                      >
                        {font.name}
                      </div>
                    </div>
                  )}

                  <p className="text-slate-200 text-xs leading-[1.8] font-medium line-clamp-2">
                    {font.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold text-slate-300">
                      Personal: <strong className="text-white">${font.prices.personal}</strong>
                    </span>
                    <span className="text-slate-500">•</span>
                    <span className="text-[10px] font-mono font-bold text-purple-300">
                      Comm: <strong className="text-purple-200">${font.prices.commercial}</strong>
                    </span>
                  </div>
                  <button
                    onClick={() => handleAccessFont(font.name)}
                    className="neu-btn-primary px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider text-white shadow-md cursor-pointer hover:scale-105 transition-all"
                  >
                    {isLoggedIn ? 'LICENSE' : 'ACCESS FONT'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION: BUYER & SELLER PANELS */}
        <section className="py-24 px-6 sm:px-12 max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-3">
            <div className="inline-block px-5 py-2 rounded-full liquid-glass-textbox text-[10px] font-black uppercase tracking-[0.25em] text-purple-300 shadow-md">
              TWO-SIDED FOUNDRY PLATFORM
            </div>
            <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-white font-grotesk">
              BUILT FOR DESIGNERS <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-sky-400">
                & TYPE CREATORS.
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Buyer Panel Card */}
            <div className="liquid-glass-textbox p-10 md:p-12 rounded-[2.5rem] space-y-6 shadow-2xl">
              <div className="w-14 h-14 rounded-2xl neu-btn flex items-center justify-center text-purple-400 shadow-lg">
                <ShoppingBag size={26} />
              </div>

              <div>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-purple-300">FOR BRANDS & STUDIOS</span>
                <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-[0.05em] text-white mt-1 font-grotesk">THE BUYER PANEL & VAULT</h3>
              </div>

              <p className="text-slate-200 text-xs sm:text-sm leading-relaxed font-medium">
                MANAGE PERPETUAL COMMERCIAL LICENSES, DOWNLOAD COMPILED OTF/WOFF2 PACKAGES, COPY GLOBAL CDN WEBFONT EMBED CODES, AND WHITELIST PRODUCTION DOMAINS.
              </p>

              <ul className="space-y-3 text-xs sm:text-sm text-slate-200 font-semibold">
                <li className="flex items-center gap-3"><div className="w-2.5 h-2.5 rounded-full bg-purple-400 shadow-[0_0_8px_rgba(168,85,247,1)]" /> 1-CLICK WOFF2 & OTF DESKTOP/WEB KITS</li>
                <li className="flex items-center gap-3"><div className="w-2.5 h-2.5 rounded-full bg-purple-400 shadow-[0_0_8px_rgba(168,85,247,1)]" /> GLOBAL CDN SNIPPETS & TAILWIND CONFIG</li>
                <li className="flex items-center gap-3"><div className="w-2.5 h-2.5 rounded-full bg-purple-400 shadow-[0_0_8px_rgba(168,85,247,1)]" /> OFFICIAL PDF LICENSE CERTIFICATES</li>
              </ul>

              <button
                onClick={() => handleAccessFont('Buyer Vault')}
                className="neu-btn-cyan inline-flex h-14 px-8 rounded-xl font-black items-center gap-2 uppercase tracking-[0.25em] text-[10px] text-white shadow-xl cursor-pointer hover:scale-105 transition-all"
              >
                {isLoggedIn ? 'OPEN BUYER VAULT' : 'SIGN IN TO ACCESS'} <ArrowRight size={14} />
              </button>
            </div>

            {/* Seller Studio Card */}
            <div className="liquid-glass-textbox p-10 md:p-12 rounded-[2.5rem] space-y-6 shadow-2xl">
              <div className="w-14 h-14 rounded-2xl neu-btn flex items-center justify-center text-purple-400 shadow-lg">
                <Layers size={26} />
              </div>

              <div>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-purple-300">FOR TYPE FOUNDRIES</span>
                <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-[0.05em] text-white mt-1 font-grotesk">THE SELLER FOUNDRY STUDIO</h3>
              </div>

              <p className="text-slate-200 text-xs sm:text-sm leading-relaxed font-medium">
                PUBLISH YOUR TYPEFACES TO GLOBAL ART DIRECTORS, BENEFIT FROM AN INDUSTRY-LEADING 85% CREATOR PAYOUT RATE, AND ISSUE DIRECT ENTERPRISE KEYS.
              </p>

              <ul className="space-y-3 text-xs sm:text-sm text-slate-200 font-semibold">
                <li className="flex items-center gap-3"><div className="w-2.5 h-2.5 rounded-full bg-purple-400 shadow-[0_0_8px_rgba(168,85,247,1)]" /> 85% CREATOR ROYALTY SHARE (WEEKLY PAYOUTS)</li>
                <li className="flex items-center gap-3"><div className="w-2.5 h-2.5 rounded-full bg-purple-400 shadow-[0_0_8px_rgba(168,85,247,1)]" /> AUTOMATED VARIABLE GX SPECIMEN COMPILER</li>
                <li className="flex items-center gap-3"><div className="w-2.5 h-2.5 rounded-full bg-purple-400 shadow-[0_0_8px_rgba(168,85,247,1)]" /> DIRECT OFFLINE ENTERPRISE LICENSE GENERATOR</li>
              </ul>

              <button
                onClick={() => {
                  if (isLoggedIn) navigate('/seller');
                  else {
                    setTargetFontName('Seller Studio');
                    setAuthGateOpen(true);
                  }
                }}
                className="neu-btn-primary inline-flex h-14 px-8 rounded-xl font-black items-center gap-2 uppercase tracking-[0.25em] text-[10px] text-white shadow-xl cursor-pointer hover:scale-105 transition-all"
              >
                {isLoggedIn ? 'OPEN SELLER STUDIO' : 'SIGN IN AS CREATOR'} <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </section>

        {/* SECTION: CTA */}
        <section className="py-36 px-6 text-center relative overflow-hidden">
          <div className="max-w-4xl mx-auto space-y-8">
            <h2 className="text-5xl sm:text-7xl font-black uppercase tracking-tight leading-[0.9] text-white font-grotesk">
              ELEVATE YOUR <br /> <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-sky-400">DESIGN SYSTEM.</span>
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm tracking-[0.15em] uppercase max-w-xl mx-auto leading-loose font-semibold">
              JOIN THOUSANDS OF DESIGNERS AND FOUNDRIES USING ALPHAXEN FOR DIGITAL TYPOGRAPHY.
            </p>
            <Link
              to="/shop"
              className="neu-btn-primary inline-flex h-16 px-12 rounded-2xl text-white font-black items-center justify-center gap-3 uppercase tracking-[0.25em] text-xs shadow-2xl hover:scale-105 transition-all"
            >
              BROWSE FONT CATALOG <ChevronRight size={18} />
            </Link>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="footer-vertex-gradient pt-16 pb-28 sm:pb-16 px-6 sm:px-12 relative z-10 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 lg:col-span-2">
              <Link to="/" className="flex items-center gap-3 mb-6 w-fit">
                <BrandMark mode="default" />
              </Link>
              <p className="text-slate-400 text-xs font-semibold tracking-wider uppercase mb-8 max-w-md leading-relaxed">
                EMPOWERING DESIGNERS & TYPE STUDIOS WITH HIGH-PRECISION DIGITAL VARIABLE TYPEFACES AND PERPETUAL COMMERCIAL LICENSING.
              </p>
              <div className="flex flex-wrap gap-3">
                <a href="https://www.facebook.com/profile.php?id=61580779565120" target="_blank" rel="noreferrer" title="Facebook Profile" className="neu-btn-circle text-purple-400 hover:text-white">
                  <FacebookIcon size={18} />
                </a>
                <a href="https://wa.me/8801342900364" target="_blank" rel="noreferrer" title="WhatsApp: +8801342900364" className="neu-btn-circle text-purple-400 hover:text-white">
                  <WhatsappIcon size={18} />
                </a>
                <a href="https://github.com/forhad2008" target="_blank" rel="noreferrer" title="GitHub: forhad2008" className="neu-btn-circle text-slate-200 hover:text-white">
                  <Github size={18} />
                </a>
                <a href="https://forhad2008.github.io/portfolio/" target="_blank" rel="noreferrer" title="Portfolio & Web" className="neu-btn-circle text-purple-400 hover:text-white">
                  <Globe size={18} />
                </a>
              </div>
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
                <Link to="/seller" className="text-xs font-bold text-slate-400 hover:text-white transition-colors uppercase tracking-wider w-fit">
                  SELLER STUDIO
                </Link>
                <Link to="/docs" className="text-xs font-bold text-slate-400 hover:text-white transition-colors uppercase tracking-wider w-fit">
                  DOCUMENTATION
                </Link>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white">COMMUNITY & CONNECT</p>
              <div className="flex flex-col gap-3">
                <a href="https://www.facebook.com/profile.php?id=61580779565120" target="_blank" rel="noreferrer" className="text-xs font-bold text-slate-400 hover:text-white transition-colors uppercase tracking-wider w-fit flex items-center gap-2">
                  <FacebookIcon size={14} className="text-purple-400" /> FACEBOOK PROFILE
                </a>
                <a href="https://wa.me/8801342900364" target="_blank" rel="noreferrer" className="text-xs font-bold text-slate-400 hover:text-white transition-colors uppercase tracking-wider w-fit flex items-center gap-2">
                  <WhatsappIcon size={14} className="text-purple-400" /> WHATSAPP (+8801342900364)
                </a>
                <a href="https://forhad2008.github.io/portfolio/" target="_blank" rel="noreferrer" className="text-xs font-bold text-slate-400 hover:text-white transition-colors uppercase tracking-wider w-fit flex items-center gap-2">
                  <Globe size={14} className="text-purple-400" /> PORTFOLIO WEBSITE
                </a>
                <Link to="/admin" className="text-xs font-bold text-purple-400 hover:text-purple-300 transition-colors uppercase tracking-wider w-fit">
                  ADMIN CONSOLE
                </Link>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-white/[0.08] flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500">
              © 2026 ALPHAXEN TYPE FOUNDRY. ALL RIGHTS RESERVED.
            </p>
            <div className="flex items-center gap-6">
              <Link to="/tos" className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 hover:text-white transition-colors">
                PRIVACY POLICY
              </Link>
              <Link to="/tos" className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 hover:text-white transition-colors">
                TERMS OF SERVICE
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Mobile Floating Bottom Dock (Smartphones Only) */}
      <div className="md:hidden fixed bottom-4 inset-x-4 z-40">
        <div className="liquid-glass px-4 py-2.5 rounded-3xl border border-white/20 shadow-[0_15px_40px_rgba(0,0,0,0.9),_0_0_20px_rgba(139,92,246,0.2)] backdrop-blur-2xl flex items-center justify-between">
          <Link
            to="/"
            className="flex flex-col items-center gap-1 text-purple-400 p-1.5"
          >
            <Home size={18} />
            <span className="text-[8px] font-black uppercase tracking-wider">Home</span>
          </Link>
          <Link
            to="/shop"
            className="flex flex-col items-center gap-1 text-slate-400 hover:text-white p-1.5 transition-colors"
          >
            <ShoppingBag size={18} />
            <span className="text-[8px] font-black uppercase tracking-wider">Fonts</span>
          </Link>
          
          {/* Floating Center Explore Button */}
          <Link
            to="/shop"
            className="neu-btn-primary w-11 h-11 -mt-5 rounded-full flex items-center justify-center text-white shadow-xl shadow-purple-500/40 hover:scale-110 active:scale-95 transition-all"
            title="Explore Fonts"
          >
            <Sparkles size={18} />
          </Link>

          <Link
            to="/install"
            className="flex flex-col items-center gap-1 text-slate-400 hover:text-purple-300 p-1.5 transition-colors"
          >
            <Download size={18} />
            <span className="text-[8px] font-black uppercase tracking-wider">Install</span>
          </Link>
          
          {isLoggedIn ? (
            <Link
              to="/buyer"
              className="flex flex-col items-center gap-1 text-purple-300 hover:text-white p-1.5 transition-colors"
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

      {/* Auth Gate Modal for "Sign In to Access Font" */}
      <AuthGateModal
        isOpen={authGateOpen}
        onClose={() => setAuthGateOpen(false)}
        fontName={targetFontName}
        onSuccess={() => {
          setLocalUserEmail(localStorage.getItem('alphaxen_user_email'));
          navigate('/buyer');
        }}
      />

      {/* Floating Desktop Install App Button (Vertex Style) */}
      <Link
        to="/install"
        className="hidden md:flex fixed bottom-6 right-6 z-50 btn-vertex-cyan px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider items-center gap-2 text-white shadow-[0_10px_30px_rgba(6,182,212,0.55)] hover:scale-105 transition-all cursor-pointer"
        title="Install Alphaxen Web App"
      >
        <Download size={15} />
        <span>INSTALL APP</span>
      </Link>

      {/* PWA & Desktop Native Install Modal */}
      <InstallAppModal
        isOpen={showInstallModal}
        onClose={() => setShowInstallModal(false)}
      />
    </div>
  );
};

export default Landing;
