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
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);

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

  return (
    <div className="min-h-screen bg-[#070a13] text-slate-100 selection:bg-indigo-500/30 selection:text-indigo-100 font-sans overflow-x-hidden scroll-smooth relative">
      
      {/* Top Sticky High-Definition Header */}
      <header className="sticky top-0 z-50 w-full bg-[#070a13]/98 backdrop-blur-xl border-b border-white/10 shadow-2xl">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 py-3.5 flex justify-between items-center">
          <BrandMark />

            <div className="hidden md:flex items-center gap-3">
              <Link
                to="/shop"
                className="neu-btn px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 hover:text-white"
              >
                FONT CATALOG
              </Link>

              <Link
                to="/seller"
                className="neu-btn px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-purple-300 hover:text-white"
              >
                CREATOR STUDIO
              </Link>

              <Link
                to="/docs"
                className="neu-btn px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-cyan-300 hover:text-white"
              >
                DOCS
              </Link>

              <Link
                to="/install"
                className="neu-btn-cyan px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-1.5 shadow-md shadow-cyan-500/20 cursor-pointer hover:scale-105 transition-all text-white"
              >
                <Download size={13} /> INSTALL APP
              </Link>

              <div className="h-4 w-px bg-white/15 mx-1" />

              {isLoggedIn ? (
                <div className="flex items-center gap-2">
                  {currentUser?.status === 'pending' ? (
                    <Link
                      to="/buyer"
                      className="px-4 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-[0.15em] bg-purple-500/20 text-purple-300 border border-purple-500/40 flex items-center gap-1.5 shadow-lg animate-pulse"
                    >
                      <LayoutDashboard size={12} /> PENDING APPROVAL
                    </Link>
                  ) : currentUser?.role === 'seller' ? (
                    <Link
                      to="/seller"
                      className="neu-btn-primary px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-1.5 text-white shadow-lg"
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
                      className="neu-btn-primary px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-1.5 text-white shadow-lg"
                    >
                      <LayoutDashboard size={13} /> VAULT
                    </Link>
                  )}

                  <button
                    onClick={handleSignOut}
                    className="neu-btn px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-rose-400 hover:text-rose-300 cursor-pointer"
                    title="Sign Out"
                  >
                    <LogOut size={13} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2.5">
                  <Link
                    to="/login"
                    className="neu-btn px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-slate-200 hover:text-white"
                  >
                    LOG IN
                  </Link>
                  <Link
                    to="/signup"
                    className="neu-btn-primary px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.25em] text-white shadow-lg"
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
            <div className="md:hidden pt-4 pb-2 border-t border-white/10 mt-3 space-y-2 animate-slide-up">
              <Link 
                to="/shop" 
                className="flex items-center gap-3 px-4 py-3 rounded-2xl liquid-glass text-xs font-black uppercase tracking-wider text-slate-200 hover:text-white"
                onClick={() => setIsMenuOpen(false)}
              >
                <ShoppingBag size={16} className="text-cyan-400" />
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
                <LayoutDashboard size={16} className="text-indigo-400" />
                <span>Buyer Vault &amp; Licenses</span>
              </Link>

              <Link 
                to="/docs" 
                className="flex items-center gap-3 px-4 py-3 rounded-2xl liquid-glass text-xs font-black uppercase tracking-wider text-slate-200 hover:text-white"
                onClick={() => setIsMenuOpen(false)}
              >
                <Code size={16} className="text-emerald-400" />
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
                className="neu-btn-cyan text-xs font-black uppercase tracking-widest py-3 px-4 rounded-2xl flex items-center justify-center gap-2.5 w-full text-white shadow-lg shadow-cyan-500/20 cursor-pointer"
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

      <main className="relative z-10">
        
        {/* HERO SECTION */}
        <section className="min-h-screen flex flex-col justify-center pt-24 pb-16 px-4 sm:px-8 lg:px-12">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            <div className="text-center lg:text-left animate-slide-up [animation-delay:200ms]">
              <div className="inline-flex items-center gap-3 py-2 px-4 sm:px-6 rounded-full liquid-glass-sm text-[8.5px] sm:text-[9px] font-black uppercase tracking-[0.25em] sm:tracking-[0.3em] text-cyan-300 mb-8 mx-auto lg:mx-0 shadow-lg border border-cyan-500/20">
                <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_10px_rgba(6,182,212,1)]" />
                DIGITAL TYPE FOUNDRY &amp; LICENSING V2.0
              </div>

              <h1 className="text-[2.4rem] min-[370px]:text-4xl sm:text-6xl md:text-7xl lg:text-[5.2rem] font-black tracking-tight mb-8 leading-[1.05] sm:leading-[0.95] text-white uppercase font-grotesk">
                NEXT-GEN <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 animate-pulse-slow block mt-1.5 sm:mt-2">
                  TYPE FOUNDRY
                </span>
                ARCHITECTURE
              </h1>

              <p className="text-slate-300 text-xs sm:text-sm tracking-[0.12em] sm:tracking-[0.15em] uppercase max-w-xl mx-auto lg:mx-0 mb-12 leading-[1.9] sm:leading-[2] font-semibold">
                EXPLORE MONUMENTAL SERIFS, SPECULAR METALLIC CHROME DISPLAY TYPE, AND ARCHITECTURAL MONOSPACE FONTS. PERPETUAL COMMERCIAL EULA AND INSTANT OTF/TTF ASSETS.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center">
                <Link
                  to="/shop"
                  className="neu-btn-primary h-14 px-9 rounded-2xl font-black flex items-center gap-3 uppercase tracking-[0.2em] text-[11px] text-white shadow-2xl shadow-purple-500/30 hover:scale-105 transition-all cursor-pointer"
                >
                  <Sparkles size={15} />
                  <span>EXPLORE FONT SHOP</span>
                  <ArrowRight size={15} />
                </Link>

                <Link
                  to="/install"
                  className="neu-btn-cyan h-14 px-8 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] flex items-center gap-2 shadow-lg shadow-cyan-500/20 cursor-pointer hover:scale-105 transition-all text-white"
                >
                  <Download size={15} />
                  <span>INSTALL WEB APP</span>
                </Link>
              </div>
            </div>

            {/* Exact Fixed 3D Perspective Font Foundry Slate (Does not move) */}
            <div className="relative animate-slide-up mt-8 lg:mt-0 [animation-delay:400ms] [perspective:1400px]">
              {/* Cosmic ambient glow backdrop */}
              <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/20 via-purple-600/30 to-indigo-500/20 blur-[130px] opacity-70 -z-10" />
              
              {/* Static 3D Tilted Dashboard Slate */}
              <div
                className="relative bg-[#060814]/95 border border-purple-500/30 p-4 sm:p-5 rounded-[2rem] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.95),0_0_50px_rgba(168,85,247,0.25)] text-slate-300 font-sans transition-all duration-500 overflow-hidden"
                style={{
                  transform: 'perspective(1200px) rotateY(-13deg) rotateX(6deg) rotateZ(-2deg)',
                  transformStyle: 'preserve-3d',
                }}
              >
                {/* 1. Top Metrics Bar (Font Foundry Stats) */}
                <div className="grid grid-cols-5 gap-2 mb-3">
                  {[
                    { label: 'TOTAL FAMILIES', val: '6', color: 'text-cyan-400' },
                    { label: 'ACTIVE STYLES', val: '32', color: 'text-cyan-400' },
                    { label: 'EULA LICENSES', val: '1,420', color: 'text-purple-400' },
                    { label: 'COMMERCIAL DRM', val: '100%', color: 'text-cyan-400' },
                    { label: 'OTF/TTF ASSETS', val: '64', color: 'text-emerald-400' },
                  ].map((stat, i) => (
                    <div key={i} className="bg-black/60 border border-white/10 p-2.5 rounded-xl text-center space-y-0.5">
                      <div className="text-[7px] font-mono font-bold text-slate-400 uppercase tracking-wider truncate">
                        {stat.label}
                      </div>
                      <div className={`text-base font-black font-mono ${stat.color}`}>
                        {stat.val}
                      </div>
                    </div>
                  ))}
                </div>

                {/* 2. Main Dashboard Split View */}
                <div className="grid grid-cols-12 gap-3">
                  
                  {/* Left Mini Sidebar (Foundry Nav) */}
                  <div className="col-span-4 bg-black/60 border border-white/10 rounded-xl p-2.5 space-y-2 flex flex-col justify-between text-[8px] font-mono font-bold uppercase">
                    <div className="space-y-1.5">
                      {/* Brand Header */}
                      <div className="flex items-center gap-1.5 p-1.5 bg-blue-950/40 rounded-lg border border-cyan-500/30 mb-2">
                        <div className="w-5 h-5 rounded-md bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center text-white text-[9px] font-black">
                          AX
                        </div>
                        <div className="truncate">
                          <div className="text-[8px] text-white font-black leading-none">ALPHAXEN CORE</div>
                          <div className="text-[6.5px] text-cyan-300">TYPE FOUNDRY</div>
                        </div>
                      </div>

                      {/* Nav Buttons */}
                      <Link to="/shop" className="px-2 py-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 flex items-center gap-1.5 font-black">
                        <Type size={10} />
                        <span>TYPE SPECIMEN</span>
                      </Link>
                      <Link to="/shop" className="px-2 py-1 rounded-lg text-slate-400 hover:text-white flex items-center gap-1.5">
                        <ShoppingBag size={10} />
                        <span>FONT SHOP</span>
                      </Link>
                      <Link to="/tos" className="px-2 py-1 rounded-lg text-slate-400 hover:text-white flex items-center gap-1.5">
                        <ShieldCheck size={10} />
                        <span>EULA LICENSES</span>
                      </Link>
                      <Link to="/seller" className="px-2 py-1 rounded-lg text-slate-400 hover:text-white flex items-center gap-1.5">
                        <Crown size={10} />
                        <span>CREATOR STUDIO</span>
                      </Link>
                      <Link to="/#mobile-showcase" className="px-2 py-1 rounded-lg text-slate-400 hover:text-white flex items-center gap-1.5">
                        <Sliders size={10} />
                        <span>VARIABLE AXES</span>
                      </Link>
                      <Link to="/docs" className="px-2 py-1 rounded-lg text-slate-400 hover:text-white flex items-center gap-1.5">
                        <Globe size={10} />
                        <span>GLYPH CDN</span>
                      </Link>
                    </div>

                    <div className="px-2 py-1.5 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center gap-1 mt-2 text-[7.5px]">
                      <LogOut size={9} />
                      <span>SIGN OUT</span>
                    </div>
                  </div>

                  {/* Right Application Details Area (Typeface Details) */}
                  <div className="col-span-8 bg-black/60 border border-white/10 rounded-xl p-3 space-y-3 relative overflow-hidden flex flex-col justify-between">
                    
                    {/* Header */}
                    <div className="flex items-center justify-between pb-2 border-b border-white/10 text-[9px] font-mono font-bold">
                      <span className="flex items-center gap-1.5 text-cyan-300 uppercase tracking-wider">
                        <Type size={11} className="text-purple-400" />
                        <span>FOUNDRY RELEASE SPEC</span>
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[7px] uppercase font-black">
                        VERIFIED EULA
                      </span>
                    </div>

                    {/* Form Fields Simulation */}
                    <div className="space-y-2 text-[8px] font-mono">
                      <div>
                        <div className="text-[7px] text-slate-400 uppercase font-bold mb-0.5">FLAGSHIP TYPEFACE</div>
                        <div className="p-1.5 bg-black/80 border border-white/15 rounded-lg text-white font-bold flex items-center justify-between">
                          <span>Abdullah Martel (Haute-Serif)</span>
                          <Lock size={9} className="text-slate-500" />
                        </div>
                      </div>

                      <div>
                        <div className="text-[7px] text-slate-400 uppercase font-bold mb-0.5">PERPETUAL EULA HASH</div>
                        <div className="p-1.5 bg-black/80 border border-white/15 rounded-lg text-cyan-300 font-bold flex items-center justify-between">
                          <span>EULA:SHA256:0x89F4...22C1</span>
                          <Copy size={9} className="text-cyan-400 cursor-pointer" />
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <div>
                          <div className="text-[7px] text-slate-400 uppercase font-bold">ACTIVE MASTER SUITE</div>
                          <div className="text-slate-300 font-bold text-[8px]">6 STYLES + 3D COLOR OTF</div>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Link to="/shop" className="px-2.5 py-1 rounded-md bg-cyan-500 text-black font-black text-[7.5px] uppercase">
                            DOWNLOAD ASSETS
                          </Link>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons Row */}
                    <div className="flex items-center gap-1.5 pt-2 border-t border-white/10 text-[7px] font-mono font-bold">
                      <Link to="/#studio" className="flex-1 py-1 rounded-md bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 uppercase text-center">
                        TEST IN STUDIO
                      </Link>
                      <Link to="/#mobile-showcase" className="flex-1 py-1 rounded-md bg-blue-500/15 border border-blue-500/30 text-blue-300 uppercase text-center">
                        VARIABLE AXES
                      </Link>
                      <Link to="/tos" className="flex-1 py-1 rounded-md bg-purple-500/15 border border-purple-500/30 text-purple-300 uppercase text-center">
                        PERPETUAL EULA
                      </Link>
                    </div>
                  </div>

                </div>
              </div>

              {/* 3. Floating Bottom-Right Purple Shield Badge */}
              <div
                className="absolute -bottom-4 -right-4 w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-purple-500 flex items-center justify-center text-white shadow-[0_10px_35px_rgba(168,85,247,0.6)] border border-white/25 z-20"
                style={{ transform: 'translateZ(50px)' }}
              >
                <Shield size={28} className="text-white fill-white/20 drop-shadow-md" />
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
              { label: 'TYPEFACES', val: '180+ STYLES', icon: <Type size={16} />, color: 'text-cyan-300' },
              { label: 'CREATOR ROYALTY', val: '85% SPLIT', icon: <Sparkles size={16} />, color: 'text-purple-300' },
              { label: 'CDN LATENCY', val: '50ms EDGE', icon: <Cpu size={16} />, color: 'text-indigo-300' },
              { label: 'COMMERCIAL EULA', val: 'PERPETUAL', icon: <ShieldCheck size={16} />, color: 'text-emerald-300' },
            ].map((stat, i) => (
              <div
                key={i}
                className="bg-[#0c101d] border border-white/20 hover:border-purple-500/50 p-4 sm:p-6 md:p-8 rounded-[1.75rem] sm:rounded-[2rem] space-y-2 sm:space-y-3 shadow-xl transition-all hover:translate-y-[-2px] overflow-hidden flex flex-col justify-between"
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
            <div className="inline-flex items-center gap-2 py-1.5 px-5 rounded-full bg-[#131b2e] border border-cyan-500/40 text-[10px] font-black uppercase tracking-[0.25em] text-cyan-300 shadow-md">
              <Sparkles size={14} className="text-cyan-400" />
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
              <div className="inline-block px-5 py-2 rounded-full bg-[#131b2e] border border-purple-500/40 text-[10px] font-black uppercase tracking-[0.25em] text-purple-300 shadow-md">
                FEATURED FAMILIES
              </div>
              <h2 className="text-4xl sm:text-5xl font-black uppercase tracking-tight text-white font-grotesk">
                FOUNDRY RELEASES.
              </h2>
            </div>
            <Link
              to="/shop"
              className="neu-btn px-6 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.25em] text-cyan-300 hover:text-white flex items-center gap-2 shadow-lg"
            >
              <span>VIEW ALL {FONT_CATALOG.length} TYPEFACES</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {FONT_CATALOG.slice(0, 6).map((font) => (
              <div
                key={font.id}
                className="bg-[#0c101d] border border-white/20 hover:border-purple-500/50 p-8 rounded-[2.5rem] flex flex-col justify-between space-y-6 shadow-2xl transition-all"
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-cyan-300 uppercase tracking-widest">
                        {font.foundry} • {font.category}
                      </span>
                      <h3 className="text-2xl font-black uppercase tracking-tight text-white mt-1 font-grotesk">
                        {font.name}
                      </h3>
                    </div>
                    {font.badge && (
                      <span className="text-[9px] font-black px-2.5 py-1 rounded-full bg-indigo-500/30 text-indigo-200 border border-indigo-500/40 uppercase tracking-widest">
                        {font.badge}
                      </span>
                    )}
                  </div>

                  {font.specimenImage ? (
                    <div className="relative rounded-2xl overflow-hidden border border-white/15 group/img bg-[#050814] shadow-inner">
                      <img
                        src={font.specimenImage}
                        alt={`${font.name} Specimen`}
                        className="w-full h-36 object-cover object-center group-hover/img:scale-105 transition-transform duration-500 pointer-events-none select-none"
                        loading="lazy"
                      />
                      {font.watermarkImage && (
                        <img
                          src={font.watermarkImage}
                          alt="Watermark"
                          className="absolute top-2.5 right-2.5 w-6 h-6 object-contain opacity-80 pointer-events-none drop-shadow-md"
                        />
                      )}
                      <div className="absolute bottom-2 left-2.5 px-2.5 py-0.5 rounded-full bg-black/80 backdrop-blur-md text-[8px] font-mono font-bold text-cyan-300 uppercase tracking-wider border border-white/15">
                        AUTHENTIC SPECIMEN
                      </div>
                    </div>
                  ) : (
                    <div className="bg-[#050814] border border-white/15 p-5 rounded-2xl min-h-[90px] flex items-center justify-center overflow-hidden">
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
                    <span className="text-[10px] font-mono font-bold text-cyan-300">
                      Comm: <strong className="text-cyan-200">${font.prices.commercial}</strong>
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
            <div className="inline-block px-5 py-2 rounded-full bg-[#131b2e] border border-cyan-500/40 text-[10px] font-black uppercase tracking-[0.25em] text-cyan-300 shadow-md">
              TWO-SIDED FOUNDRY PLATFORM
            </div>
            <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-white font-grotesk">
              BUILT FOR DESIGNERS <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400">
                & TYPE CREATORS.
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Buyer Panel Card */}
            <div className="bg-[#0c101d] border border-white/20 p-10 md:p-12 rounded-[2.5rem] space-y-6 shadow-2xl">
              <div className="w-14 h-14 rounded-2xl neu-btn flex items-center justify-center text-cyan-400 shadow-lg">
                <ShoppingBag size={26} />
              </div>

              <div>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-300">FOR BRANDS & STUDIOS</span>
                <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-[0.05em] text-white mt-1 font-grotesk">THE BUYER PANEL & VAULT</h3>
              </div>

              <p className="text-slate-200 text-xs sm:text-sm leading-relaxed font-medium">
                MANAGE PERPETUAL COMMERCIAL LICENSES, DOWNLOAD COMPILED OTF/WOFF2 PACKAGES, COPY GLOBAL CDN WEBFONT EMBED CODES, AND WHITELIST PRODUCTION DOMAINS.
              </p>

              <ul className="space-y-3 text-xs sm:text-sm text-slate-200 font-semibold">
                <li className="flex items-center gap-3"><div className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,1)]" /> 1-CLICK WOFF2 & OTF DESKTOP/WEB KITS</li>
                <li className="flex items-center gap-3"><div className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,1)]" /> GLOBAL CDN SNIPPETS & TAILWIND CONFIG</li>
                <li className="flex items-center gap-3"><div className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,1)]" /> OFFICIAL PDF LICENSE CERTIFICATES</li>
              </ul>

              <button
                onClick={() => handleAccessFont('Buyer Vault')}
                className="neu-btn-cyan inline-flex h-14 px-8 rounded-xl font-black items-center gap-2 uppercase tracking-[0.25em] text-[10px] text-white shadow-xl cursor-pointer hover:scale-105 transition-all"
              >
                {isLoggedIn ? 'OPEN BUYER VAULT' : 'SIGN IN TO ACCESS'} <ArrowRight size={14} />
              </button>
            </div>

            {/* Seller Studio Card */}
            <div className="bg-[#0c101d] border border-white/20 p-10 md:p-12 rounded-[2.5rem] space-y-6 shadow-2xl">
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
              ELEVATE YOUR <br /> <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400">DESIGN SYSTEM.</span>
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
              <div className="flex flex-wrap gap-3">
                <a href="https://www.facebook.com/profile.php?id=61580779565120" target="_blank" rel="noreferrer" title="Facebook Profile" className="neu-btn-circle text-blue-400 hover:text-white">
                  <FacebookIcon size={18} />
                </a>
                <a href="https://wa.me/8801342900364" target="_blank" rel="noreferrer" title="WhatsApp: +8801342900364" className="neu-btn-circle text-emerald-400 hover:text-white">
                  <WhatsappIcon size={18} />
                </a>
                <a href="https://github.com/forhad2008" target="_blank" rel="noreferrer" title="GitHub: forhad2008" className="neu-btn-circle text-slate-200 hover:text-white">
                  <Github size={18} />
                </a>
                <a href="https://forhad2008.github.io/portfolio/" target="_blank" rel="noreferrer" title="Portfolio & Web" className="neu-btn-circle text-cyan-400 hover:text-white">
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
                  <FacebookIcon size={14} className="text-blue-400" /> FACEBOOK PROFILE
                </a>
                <a href="https://wa.me/8801342900364" target="_blank" rel="noreferrer" className="text-xs font-bold text-slate-400 hover:text-white transition-colors uppercase tracking-wider w-fit flex items-center gap-2">
                  <WhatsappIcon size={14} className="text-emerald-400" /> WHATSAPP (+8801342900364)
                </a>
                <a href="https://forhad2008.github.io/portfolio/" target="_blank" rel="noreferrer" className="text-xs font-bold text-slate-400 hover:text-white transition-colors uppercase tracking-wider w-fit flex items-center gap-2">
                  <Globe size={14} className="text-cyan-400" /> PORTFOLIO WEBSITE
                </a>
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

      {/* Floating Install App Quick Action Button (Desktop Only) */}
      <div className="hidden md:block fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setShowInstallModal(true)}
          className="neu-btn-cyan px-4 py-3 rounded-2xl text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-[0_10px_30px_rgba(6,182,212,0.4)] hover:scale-105 transition-all group cursor-pointer"
        >
          <Download size={16} className="text-black group-hover:animate-bounce" />
          <span>Install App</span>
        </button>
      </div>

      {/* Mobile Floating Bottom Dock (Smartphones Only) */}
      <div className="md:hidden fixed bottom-4 inset-x-4 z-40">
        <div className="liquid-glass px-4 py-2.5 rounded-3xl border border-white/20 shadow-[0_15px_40px_rgba(0,0,0,0.9),_0_0_20px_rgba(99,102,241,0.2)] backdrop-blur-2xl flex items-center justify-between">
          <Link
            to="/"
            className="flex flex-col items-center gap-1 text-cyan-400 p-1.5"
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
            className="neu-btn-primary w-11 h-11 -mt-5 rounded-full flex items-center justify-center text-white shadow-xl shadow-indigo-500/40 hover:scale-110 active:scale-95 transition-all"
            title="Explore Fonts"
          >
            <Sparkles size={18} />
          </Link>

          <Link
            to="/install"
            className="flex flex-col items-center gap-1 text-slate-400 hover:text-cyan-300 p-1.5 transition-colors"
          >
            <Download size={18} />
            <span className="text-[8px] font-black uppercase tracking-wider">Install</span>
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

      {/* PWA & Desktop Native Install Modal */}
      <InstallAppModal
        isOpen={showInstallModal}
        onClose={() => setShowInstallModal(false)}
      />
    </div>
  );
};

export default Landing;
