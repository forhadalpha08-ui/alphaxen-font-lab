import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Search, MessageSquare, CheckSquare, Folder, Grid, 
  Send, Plus, Check, TrendingUp, Clock, Target, 
  ChevronRight, ArrowRight, User, Settings, HelpCircle, 
  Crown, LogOut, Code, Image as ImageIcon, FileText, 
  Languages, Video, Globe, File, MoreVertical, Wifi, 
  Battery, Signal, Compass, BookOpen, Shield, Bell, Moon,
  Smartphone, Monitor, Laptop, Play, Pause, RefreshCw, Key,
  Lock, Eye, Copy, Download, Share2, Activity, Cpu, HardDrive,
  Sliders, Zap, CheckCircle2, ChevronDown, CheckCheck,
  Type, SlidersHorizontal, Layers, ShoppingBag, Terminal, 
  Maximize2, Box, Palette, Award
} from 'lucide-react';
import { InstallAppModal } from './InstallAppModal';

export type ScreenId = 'welcome' | 'home' | 'chat' | 'tasks' | 'overview' | 'explore' | 'files' | 'profile';

interface ScreenTab {
  id: ScreenId;
  title: string;
  subtitle: string;
  badge?: string;
  icon: React.ReactNode;
}

const SCREENS: ScreenTab[] = [
  { id: 'welcome', title: '01. Splash Boot', subtitle: 'Biometric Foundry Core', badge: 'Core', icon: <Zap size={14} /> },
  { id: 'home', title: '02. Type Studio', subtitle: 'Live Mobile Font Tester', badge: 'Interactive', icon: <Type size={14} /> },
  { id: 'chat', title: '03. AI Type Copilot', subtitle: 'Pairing & CSS Generator', badge: 'AI', icon: <MessageSquare size={14} /> },
  { id: 'tasks', title: '04. Licensing & EULA', subtitle: 'Commercial Compliance', badge: 'Rights', icon: <Shield size={14} /> },
  { id: 'overview', title: '05. Glyph Telemetry', subtitle: 'Edge CDN Throughput', badge: 'Live', icon: <TrendingUp size={14} /> },
  { id: 'explore', title: '06. Variable Axes', subtitle: 'Multi-Axis Engine', badge: 'Engine', icon: <SlidersHorizontal size={14} /> },
  { id: 'files', title: '07. Font Locker', subtitle: 'WOFF2/OTF Vault', badge: 'Vault', icon: <Folder size={14} /> },
  { id: 'profile', title: '08. Creator Studio', subtitle: '85% Foundry Royalties', badge: 'Pro', icon: <Crown size={14} /> },
];

const FONTS_LIST = [
  { 
    name: 'Abdullah Martel', 
    family: "'Abdullah Martel', serif", 
    style: 'Monumental Haute Serif', 
    weights: '400-900', 
    designer: 'Abdullah Foundry Lab',
    gradient: 'linear-gradient(135deg, #ffffff 0%, #38bdf8 35%, #818cf8 65%, #c084fc 100%)',
    shadow: '0 0 20px rgba(56, 189, 248, 0.5)'
  },
  { 
    name: 'Abdullah Metallic Chrome', 
    family: "'Abdullah Metallic Chrome', sans-serif", 
    style: 'Polished Chrome Display', 
    weights: '400-800', 
    designer: 'Abdullah Foundry Lab',
    gradient: 'linear-gradient(180deg, #ffffff 0%, #cbd5e1 28%, #475569 50%, #94a3b8 72%, #ffffff 100%)',
    shadow: '0 0 20px rgba(56, 189, 248, 0.5)'
  },
  { 
    name: 'Abdullah Molten Chrome', 
    family: "'Abdullah Molten Chrome', sans-serif", 
    style: 'Liquid Metal Display', 
    weights: '400-800', 
    designer: 'Abdullah Foundry Lab',
    gradient: 'linear-gradient(135deg, #ffffff 0%, #818cf8 35%, #a855f7 65%, #38bdf8 100%)',
    shadow: '0 0 20px rgba(129, 140, 248, 0.5)'
  },
  { 
    name: 'Abdullah Moon Chrome', 
    family: "'Abdullah Moon Chrome', sans-serif", 
    style: 'Lunar Specular Chrome', 
    weights: '400-800', 
    designer: 'Abdullah Foundry Lab',
    gradient: 'linear-gradient(135deg, #ffffff 0%, #c084fc 30%, #38bdf8 65%, #f43f5e 100%)',
    shadow: '0 0 22px rgba(192, 132, 252, 0.55)'
  },
  { 
    name: 'Abdullah Stone Chrome', 
    family: "'Abdullah Stone Chrome', sans-serif", 
    style: 'Monolith Brutalist Display', 
    weights: '400-800', 
    designer: 'Abdullah Foundry Lab',
    gradient: 'linear-gradient(180deg, #ffffff 0%, #94a3b8 35%, #334155 60%, #38bdf8 100%)',
    shadow: '0 0 18px rgba(148, 163, 184, 0.45)'
  },
  { 
    name: 'Abdullah Stone Moon', 
    family: "'Abdullah Stone Moon', serif", 
    style: 'Celestial Architectural Serif', 
    weights: '400-800', 
    designer: 'Abdullah Foundry Lab',
    gradient: 'linear-gradient(135deg, #ffffff 0%, #c084fc 30%, #818cf8 60%, #38bdf8 100%)',
    shadow: '0 0 20px rgba(129, 140, 248, 0.5)'
  },
];

export const MobileDemoShowcase: React.FC = () => {
  const [activeScreen, setActiveScreen] = useState<ScreenId>('home');
  const [deviceChassis, setDeviceChassis] = useState<'iphone' | 'android'>('iphone');
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [islandExpanded, setIslandExpanded] = useState(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Interactive Typography State
  const [sampleText, setSampleText] = useState('DESIGN SYSTEM TYPOGRAPHY');
  const [selectedFontIndex, setSelectedFontIndex] = useState(0);
  const [fontWeight, setFontWeight] = useState(700);
  const [fontSize, setFontSize] = useState(24);
  const [letterSpacing, setLetterSpacing] = useState(1);
  const [isUppercase, setIsUppercase] = useState(true);

  // Variable Axes Playground
  const [axisWght, setAxisWght] = useState(650);
  const [axisSlnt, setAxisSlnt] = useState(0);
  const [axisOpsz, setAxisOpsz] = useState(32);

  // Dynamic Telemetry
  const [glyphRenders, setGlyphRenders] = useState(489240);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'1H' | '24H' | '7D' | '30D'>('24H');
  const [hwidDRMActive, setHwidDRMActive] = useState(true);

  // Licensing Checklist
  const [licenses, setLicenses] = useState([
    { id: 1, title: 'Perpetual Commercial EULA', category: 'Rights', done: true, tier: 'Worldwide' },
    { id: 2, title: 'Edge CDN WOFF2 Asset Serving', category: 'CDN', done: true, tier: 'Zero Latency' },
    { id: 3, title: 'Unlimited Desktop & Print Seats', category: 'Seats', done: true, tier: 'Enterprise' },
    { id: 4, title: 'Native App & PWA Font Embedding', category: 'Embedding', done: true, tier: 'Full Rights' },
    { id: 5, title: 'Hardware DRM Hash Verification', category: 'Security', done: false, tier: 'Active' },
  ]);

  // AI Typography Copilot Chat
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string; time: string; chips?: string[] }>>([
    { 
      sender: 'user', 
      text: 'Recommend a high-contrast variable font pairing for a luxury fintech mobile app.', 
      time: '09:41' 
    },
    { 
      sender: 'ai', 
      text: '✨ Recommended Pairing:\n\n• Primary Display: "Abdullah Martel" (Haute Luxury Serif, Weight 700/900)\n• Secondary Titling: "Abdullah Metallic Chrome" (Specular Display)\n• Editorial / Monolith: "Abdullah Stone Moon"\n\n⚡ Compiled OpenType & WOFF2 asset packages verified with perpetual commercial EULA rights.', 
      time: '09:42',
      chips: ['Copy @font-face CSS', 'Test Live in Studio', 'Download Font Kit']
    }
  ]);
  const [chatInput, setChatInput] = useState('');

  // Font Locker Files - Real Abdullah Font Packages
  const fontAssets = [
    { name: 'Abdullah-Martel-Bold.otf', size: '1.2 MB', format: 'OpenType', hash: 'SHA256:0x89F4...22C1' },
    { name: 'Abdullah-Metallic-Chrome.ttf', size: '840 KB', format: 'TrueType', hash: 'SHA256:0x71A9...99E0' },
    { name: 'Abdullah-Molten-Chrome.otf', size: '920 KB', format: 'OpenType', hash: 'SHA256:0x55E2...34B8' },
    { name: 'Abdullah-Moon-Chrome.otf', size: '1.1 MB', format: 'OpenType', hash: 'SHA256:0x12C0...77A4' },
    { name: 'Abdullah-Stone-Chrome.ttf', size: '800 KB', format: 'TrueType', hash: 'SHA256:0x34A1...56D2' },
    { name: 'Abdullah-Stone-Moon.otf', size: '2.8 MB', format: 'OpenType', hash: 'SHA256:0x98E2...11B4' }
  ];

  // Live Glyph Render Ticker
  useEffect(() => {
    const interval = setInterval(() => {
      setGlyphRenders(prev => prev + Math.floor(Math.random() * 12) + 3);
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  const toggleLicense = (id: number) => {
    setLicenses(prev => prev.map(l => l.id === id ? { ...l, done: !l.done } : l));
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    
    const userText = chatInput.trim();
    const newMsg = {
      sender: 'user' as const,
      text: userText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setChatMessages(prev => [...prev, newMsg]);
    setChatInput('');

    setTimeout(() => {
      setChatMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: `⚡ Alphaxen AI Studio: Generated custom typography specifications for "${userText}". Variable axis presets compiled with CSS @font-face rules ready for immediate deployment.`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          chips: ['Apply to Studio', 'Export CSS Package']
        }
      ]);
    }, 450);
  };

  const currentFont = FONTS_LIST[selectedFontIndex];
  const complianceScore = Math.round((licenses.filter(l => l.done).length / licenses.length) * 100);

  // Status Bar with Interactive Dynamic Island
  const renderStatusBar = () => (
    <div className="px-6 pt-3.5 pb-2 flex items-center justify-between text-[11px] font-semibold text-slate-300 select-none z-40 relative">
      <span className="font-bold tracking-tight text-white font-mono">09:41</span>

      {/* Dynamic Island Pill */}
      <div 
        onClick={() => setIslandExpanded(!islandExpanded)}
        className={`cursor-pointer transition-all duration-500 ease-out flex items-center justify-between px-3.5 border border-white/20 bg-black/95 shadow-[0_0_20px_rgba(0,0,0,0.9),_0_0_15px_rgba(99,102,241,0.2)] backdrop-blur-2xl ${
          islandExpanded 
            ? 'w-60 h-11 rounded-2xl' 
            : 'w-28 h-6 rounded-full'
        }`}
      >
        {islandExpanded ? (
          <div className="flex items-center justify-between w-full px-1 animate-fade-in text-[9px] text-white">
            <div className="flex items-center gap-1.5 font-bold">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#22d3ee]"></span>
              <span className="text-cyan-300 tracking-wider">AXEN CDN 12ms</span>
            </div>
            <span className="font-mono text-emerald-400 font-bold">WOFF2 ACTIVE</span>
          </div>
        ) : (
          <>
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(6,182,212,0.9)]" />
            <div className="text-[8px] font-mono font-bold text-slate-300 tracking-widest">ALPHAXEN</div>
            <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_6px_rgba(99,102,241,0.8)]" />
          </>
        )}
      </div>

      <div className="flex items-center gap-1.5 text-slate-300">
        <Signal size={12} />
        <Wifi size={12} />
        <Battery size={13} className="text-slate-100" />
      </div>
    </div>
  );

  // Bottom Navigation Bar
  const renderBottomNav = (currentTab: ScreenId) => (
    <div className="px-4 py-2.5 liquid-glass border-t border-white/10 flex items-center justify-between z-30 select-none mt-auto">
      <button 
        onClick={() => setActiveScreen('home')} 
        className={`neu-btn p-2 rounded-xl flex flex-col items-center gap-0.5 transition-all ${
          currentTab === 'home' ? 'neu-btn-cyan text-black shadow-md font-black scale-105' : 'text-slate-400 hover:text-white'
        }`}
      >
        <Type size={15} />
        <span className="text-[7.5px] font-black uppercase">Studio</span>
      </button>

      <button 
        onClick={() => setActiveScreen('explore')} 
        className={`neu-btn p-2 rounded-xl flex flex-col items-center gap-0.5 transition-all ${
          currentTab === 'explore' ? 'neu-btn-cyan text-black shadow-md font-black scale-105' : 'text-slate-400 hover:text-white'
        }`}
      >
        <SlidersHorizontal size={15} />
        <span className="text-[7.5px] font-black uppercase">Axes</span>
      </button>

      {/* Floating Center Glow AI Studio Button */}
      <button 
        onClick={() => setActiveScreen('chat')}
        className={`w-11 h-11 -mt-5 rounded-full flex items-center justify-center text-white shadow-2xl transition-all duration-300 ${
          currentTab === 'chat' 
            ? 'neu-btn-cyan text-black scale-110 shadow-cyan-500/50' 
            : 'neu-btn-primary hover:scale-105 active:scale-95 shadow-indigo-500/50'
        }`}
      >
        <Sparkles size={17} className="drop-shadow animate-pulse" />
      </button>

      <button 
        onClick={() => setActiveScreen('files')} 
        className={`neu-btn p-2 rounded-xl flex flex-col items-center gap-0.5 transition-all ${
          currentTab === 'files' ? 'neu-btn-cyan text-black shadow-md font-black scale-105' : 'text-slate-400 hover:text-white'
        }`}
      >
        <Folder size={15} />
        <span className="text-[7.5px] font-black uppercase">Vault</span>
      </button>

      <button 
        onClick={() => setActiveScreen('profile')} 
        className={`neu-btn p-2 rounded-xl flex flex-col items-center gap-0.5 transition-all ${
          currentTab === 'profile' ? 'neu-btn-cyan text-black shadow-md font-black scale-105' : 'text-slate-400 hover:text-white'
        }`}
      >
        <Crown size={15} />
        <span className="text-[7.5px] font-black uppercase">Creator</span>
      </button>
    </div>
  );

  return (
    <div className="w-full py-16 px-4 md:px-8 relative z-20">
      
      {/* Header Bar */}
      <div className="max-w-6xl mx-auto text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full liquid-glass-sm text-[11px] font-black uppercase tracking-[0.25em] text-cyan-300 mb-4 border border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
          <Sparkles size={14} className="text-cyan-400" />
          ALPHAXEN MOBILE FOUNDRY OS · ULTRA-SLEEK GLASSMORPHISM
        </div>

        <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white mb-4 uppercase font-grotesk">
          High-Precision Mobile Studio
        </h2>
        <p className="text-slate-300 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
          Experience Alphaxen as a native, tactile mobile application. Test real-time variable font axes, AI type pairings, cryptographic vault assets, and live CDN telemetry inside the interactive smartphone simulator below.
        </p>

        {/* Global Controls & Chassis Switcher */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
          <div className="liquid-glass-sm p-1.5 rounded-2xl flex items-center gap-2 border border-white/10">
            <button
              onClick={() => setDeviceChassis('iphone')}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all ${
                deviceChassis === 'iphone' ? 'neu-btn-primary text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Smartphone size={14} /> iPhone 16 Pro Max
            </button>
            <button
              onClick={() => setDeviceChassis('android')}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all ${
                deviceChassis === 'android' ? 'neu-btn-primary text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Smartphone size={14} /> Android Ultra
            </button>
          </div>

          <button
            onClick={() => setShowInstallModal(true)}
            className="neu-btn-cyan px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-cyan-500/20 hover:scale-105 transition-transform"
          >
            <Download size={14} /> Install Web App
          </button>
        </div>
      </div>

      {/* Screen Tabs Bar */}
      <div className="max-w-6xl mx-auto mb-10 overflow-x-auto custom-scrollbar pb-2">
        <div className="flex items-center justify-start md:justify-center gap-2 min-w-max">
          {SCREENS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveScreen(tab.id)}
              className={`px-4 py-3 rounded-2xl transition-all duration-300 flex items-center gap-2.5 text-xs font-bold ${
                activeScreen === tab.id
                  ? 'neu-btn-primary text-white shadow-xl scale-105'
                  : 'neu-btn text-slate-300 hover:text-white'
              }`}
            >
              <span className={activeScreen === tab.id ? 'text-white' : 'text-cyan-400'}>{tab.icon}</span>
              <span>{tab.title}</span>
              {tab.badge && (
                <span className="text-[8px] font-black uppercase px-2 py-0.5 rounded-full bg-white/10 text-white border border-white/20">
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Main Showcase Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Interactive Details Panel */}
        <div className="lg:col-span-4 space-y-4 order-2 lg:order-1">
          <div className="liquid-glass p-6 rounded-3xl space-y-4 border border-white/15 shadow-2xl">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-400">
                ACTIVE MOBILE MODULE
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold bg-white/10 text-white border border-white/15">
                {activeScreen.toUpperCase()}
              </span>
            </div>

            <h3 className="text-2xl font-black text-white tracking-tight">
              {SCREENS.find(s => s.id === activeScreen)?.subtitle}
            </h3>

            <p className="text-slate-300 text-xs leading-relaxed">
              {activeScreen === 'welcome' && 'Biometric cold boot initializing the WebAssembly variable font rendering engine and verifying cryptographic license keys.'}
              {activeScreen === 'home' && 'Live interactive font specimen studio. Type your own preview string, change font families, and drag weight/size sliders in real-time.'}
              {activeScreen === 'chat' && 'AI typography assistant trained on editorial font pairing, CSS @font-face optimization, and licensing advisory.'}
              {activeScreen === 'tasks' && 'Step-by-step EULA compliance tracker verifying perpetual commercial rights, CDN endpoints, and seat allocations.'}
              {activeScreen === 'overview' && 'Live global edge CDN telemetry monitoring glyph throughput, bandwidth efficiency, and sub-12ms response curves.'}
              {activeScreen === 'explore' && 'Multi-axis variable font playground with live controls for weight (wght), slant (slnt), and optical sizing (opsz).'}
              {activeScreen === 'files' && 'Encrypted asset locker providing instant access to WOFF2/OTF font packages, SHA-256 hashes, and embed snippets.'}
              {activeScreen === 'profile' && 'Type designer & foundry creator hub displaying 85% creator splits, monthly royalty distributions, and API tokens.'}
            </p>

            <div className="pt-3 border-t border-white/10 flex items-center justify-between">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Touch Engine</span>
              <span className="text-[10px] text-emerald-400 font-black uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                Live Interactive
              </span>
            </div>
          </div>

          {/* Quick Screen Selector Chips */}
          <div className="liquid-glass-sm p-4 rounded-3xl space-y-2.5">
            <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">
              Direct Screen Jump
            </div>
            <div className="grid grid-cols-2 gap-2">
              {SCREENS.map(s => (
                <button
                  key={s.id}
                  onClick={() => setActiveScreen(s.id)}
                  className={`p-2.5 rounded-xl text-left text-[11px] font-bold transition-all truncate ${
                    activeScreen === s.id
                      ? 'neu-btn-cyan text-black font-black'
                      : 'neu-btn text-slate-300 hover:text-white'
                  }`}
                >
                  {s.title.split('. ')[1]}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Center Mobile Phone Chassis */}
        <div className="lg:col-span-8 flex justify-center order-1 lg:order-2">
          
          <div className={`relative transition-all duration-500 mx-auto ${
            deviceChassis === 'iphone'
              ? 'w-full max-w-[360px] sm:max-w-[390px] h-[720px] sm:h-[780px] rounded-[48px] sm:rounded-[55px] p-3 sm:p-4 bg-[#080d19] shadow-[0_30px_90px_rgba(0,0,0,0.95),_0_0_50px_rgba(99,102,241,0.25)] border-[5px] sm:border-[6px] border-slate-700/60'
              : 'w-full max-w-[360px] sm:max-w-[390px] h-[720px] sm:h-[780px] rounded-[32px] sm:rounded-[36px] p-3 sm:p-3.5 bg-[#060a14] shadow-[0_30px_90px_rgba(0,0,0,0.95),_0_0_50px_rgba(6,182,212,0.25)] border-[4px] sm:border-[5px] border-slate-800'
          }`}>

            {/* Glossy Metallic Glass Edge Reflection */}
            <div className="absolute inset-0 rounded-[inherit] pointer-events-none border border-white/25 shadow-inner" />

            {/* Screen Viewport Container */}
            <div className="w-full h-full bg-[#050811] rounded-[42px] overflow-hidden flex flex-col relative border border-white/10 shadow-2xl">
              
              {/* Background Fluid Aura inside Phone */}
              <div className="absolute -top-24 -left-24 w-64 h-64 bg-indigo-600/25 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-cyan-500/25 rounded-full blur-3xl pointer-events-none" />

              {/* Status Bar */}
              {renderStatusBar()}

              {/* SCREEN 1: WELCOME / BOOT */}
              {activeScreen === 'welcome' && (
                <div className="flex-1 p-6 flex flex-col items-center justify-between text-center animate-fade-in relative z-20">
                  <div className="pt-6">
                    <div className="w-20 h-20 mx-auto neu-btn-primary rounded-3xl flex items-center justify-center mb-6 shadow-2xl shadow-indigo-500/40 relative">
                      <span className="text-2xl font-black tracking-tighter text-white">AX</span>
                      <div className="absolute -inset-1 rounded-3xl border border-white/40 animate-ping opacity-30" />
                    </div>
                    <h1 className="text-2xl font-black text-white tracking-tight uppercase font-grotesk">ALPHAXEN PRIME</h1>
                    <p className="text-cyan-300 text-xs font-bold uppercase tracking-[0.2em] mt-1">Digital Type Foundry OS</p>
                  </div>

                  <div className="liquid-glass p-5 rounded-3xl w-full space-y-3 border border-white/15">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400 font-semibold">Engine Boot Status</span>
                      <span className="text-emerald-400 font-black flex items-center gap-1">
                        <Check size={14} /> Ready (v2.4)
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400 font-semibold">Variable Axis Core</span>
                      <span className="text-cyan-300 font-mono font-bold">WASM-COMPILED</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400 font-semibold">Edge CDN Response</span>
                      <span className="text-purple-300 font-mono font-bold">11.8ms</span>
                    </div>
                  </div>

                  <div className="w-full space-y-3 pb-4">
                    <button
                      onClick={() => setActiveScreen('home')}
                      className="w-full neu-btn-primary py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg flex items-center justify-center gap-2 cursor-pointer hover:scale-105 transition-transform"
                    >
                      Enter Type Studio <ArrowRight size={14} />
                    </button>
                    <button
                      onClick={() => setShowInstallModal(true)}
                      className="w-full neu-btn py-3 rounded-2xl text-xs font-bold text-slate-300 hover:text-white flex items-center justify-center gap-2"
                    >
                      <Download size={14} /> Install Web App
                    </button>
                  </div>
                </div>
              )}

              {/* SCREEN 2: HOME / TYPE STUDIO (LIVE INTERACTIVE TESTER) */}
              {activeScreen === 'home' && (
                <div className="flex-1 p-4 overflow-y-auto custom-scrollbar space-y-3.5 animate-fade-in relative z-20">
                  
                  {/* Font Family Selector Pills */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
                    {FONTS_LIST.map((f, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedFontIndex(idx)}
                        className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase whitespace-nowrap transition-all ${
                          selectedFontIndex === idx 
                            ? 'neu-btn-cyan text-black shadow-md' 
                            : 'neu-btn text-slate-300 hover:text-white'
                        }`}
                      >
                        {f.name.split(' ')[0]}
                      </button>
                    ))}
                  </div>

                  {/* Live Interactive Specimen Canvas */}
                  <div className="liquid-glass p-4 rounded-3xl space-y-3 border border-white/15 relative overflow-hidden">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="font-bold text-cyan-300 uppercase tracking-wider">{currentFont.name}</span>
                      <span className="font-mono text-slate-400">{fontWeight}wt · {fontSize}px</span>
                    </div>

                    <div 
                      className="min-h-[90px] flex items-center justify-center text-center p-3 liquid-glass-inset rounded-2xl transition-all select-none overflow-hidden"
                      style={{
                        fontFamily: currentFont.family,
                        fontWeight: fontWeight,
                        fontSize: `${fontSize}px`,
                        letterSpacing: `${letterSpacing}px`,
                        textTransform: isUppercase ? 'uppercase' : 'none',
                        lineHeight: 1.15
                      }}
                    >
                      <span 
                        className="bg-clip-text text-transparent transition-all duration-300 font-extrabold"
                        style={{
                          backgroundImage: currentFont.gradient,
                          filter: `drop-shadow(${currentFont.shadow})`
                        }}
                      >
                        {sampleText || 'ALPHAXEN TYPE'}
                      </span>
                    </div>

                    {/* Live Sample Text Input */}
                    <input
                      type="text"
                      value={sampleText}
                      onChange={(e) => setSampleText(e.target.value)}
                      placeholder="Type custom preview text..."
                      className="w-full liquid-glass-inset px-3 py-2 rounded-xl text-[10px] text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400/50"
                    />
                  </div>

                  {/* Interactive Sliders */}
                  <div className="liquid-glass p-4 rounded-3xl space-y-3 border border-white/10">
                    <div className="space-y-1">
                      <div className="flex justify-between text-[9px] font-bold text-slate-400 uppercase">
                        <span>Weight (wght)</span>
                        <span className="text-cyan-300 font-mono">{fontWeight}</span>
                      </div>
                      <input 
                        type="range" 
                        min="100" 
                        max="900" 
                        step="50"
                        value={fontWeight} 
                        onChange={(e) => setFontWeight(Number(e.target.value))}
                        className="w-full accent-cyan-400 h-1.5 bg-black/40 rounded-lg cursor-pointer" 
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-[9px] font-bold text-slate-400 uppercase">
                        <span>Size</span>
                        <span className="text-indigo-300 font-mono">{fontSize}px</span>
                      </div>
                      <input 
                        type="range" 
                        min="14" 
                        max="48" 
                        value={fontSize} 
                        onChange={(e) => setFontSize(Number(e.target.value))}
                        className="w-full accent-indigo-400 h-1.5 bg-black/40 rounded-lg cursor-pointer" 
                      />
                    </div>
                  </div>

                  {/* Quick Action Buttons */}
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setActiveScreen('explore')}
                      className="neu-btn-primary p-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5 text-white"
                    >
                      <SlidersHorizontal size={13} /> Full Axes
                    </button>
                    <button
                      onClick={() => setActiveScreen('files')}
                      className="neu-btn-cyan p-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5 text-black"
                    >
                      <Download size={13} /> Get Kit
                    </button>
                  </div>

                </div>
              )}

              {/* SCREEN 3: AI COPILOT */}
              {activeScreen === 'chat' && (
                <div className="flex-1 p-4 flex flex-col justify-between animate-fade-in relative z-20">
                  <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-1">
                    <div className="liquid-glass p-3 rounded-2xl flex items-center gap-2.5 border border-indigo-500/30 mb-2">
                      <div className="w-7 h-7 neu-btn-primary rounded-xl flex items-center justify-center">
                        <Sparkles size={14} className="text-white" />
                      </div>
                      <div>
                        <div className="text-[11px] font-black text-white">Alphaxen AI Type Copilot</div>
                        <p className="text-[9px] text-cyan-300">Intelligent Pairing &amp; CSS Generator</p>
                      </div>
                    </div>

                    {chatMessages.map((msg, i) => (
                      <div key={i} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} space-y-1`}>
                        <div className={`p-3.5 rounded-2xl text-xs max-w-[88%] leading-relaxed ${
                          msg.sender === 'user'
                            ? 'neu-btn-primary text-white'
                            : 'liquid-glass text-slate-200 border border-white/15'
                        }`}>
                          <p className="whitespace-pre-line text-[11px]">{msg.text}</p>
                          {msg.chips && (
                            <div className="flex flex-wrap gap-1.5 mt-2.5 pt-2 border-t border-white/10">
                              {msg.chips.map((chip, ci) => (
                                <button 
                                  key={ci} 
                                  onClick={() => copyToClipboard(chip, `chip-${ci}`)}
                                  className="text-[8px] font-bold px-2 py-0.5 rounded-full bg-white/10 text-cyan-300 border border-cyan-400/30 hover:bg-cyan-500/20"
                                >
                                  {copiedText === `chip-${ci}` ? '✓ Copied' : chip}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                        <span className="text-[8px] text-slate-500 px-1">{msg.time}</span>
                      </div>
                    ))}
                  </div>

                  {/* Chat Input Box */}
                  <form onSubmit={handleSendMessage} className="mt-2 pt-2 border-t border-white/10 flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Ask AI for font pairings..."
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      className="flex-1 liquid-glass-inset px-3.5 py-2.5 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400/50"
                    />
                    <button type="submit" className="neu-btn-cyan p-2.5 rounded-xl text-black">
                      <Send size={14} />
                    </button>
                  </form>
                </div>
              )}

              {/* SCREEN 4: LICENSING & EULA */}
              {activeScreen === 'tasks' && (
                <div className="flex-1 p-4 overflow-y-auto custom-scrollbar space-y-3.5 animate-fade-in relative z-20">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-black text-white uppercase tracking-wider">Commercial EULA</h3>
                      <p className="text-[9px] text-slate-400">{licenses.filter(l => l.done).length} of {licenses.length} rights verified</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-xl neu-btn text-[10px] font-mono font-bold text-emerald-400">
                      {complianceScore}% Valid
                    </span>
                  </div>

                  <div className="space-y-2">
                    {licenses.map(lic => (
                      <div
                        key={lic.id}
                        onClick={() => toggleLicense(lic.id)}
                        className={`p-3 rounded-2xl cursor-pointer transition-all flex items-start gap-2.5 select-none ${
                          lic.done ? 'liquid-glass border-emerald-500/30' : 'liquid-glass-inset opacity-70'
                        }`}
                      >
                        <div className={`w-4 h-4 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                          lic.done ? 'bg-emerald-400 text-black shadow-[0_0_8px_#34d399]' : 'border border-white/30'
                        }`}>
                          {lic.done && <Check size={10} strokeWidth={3} />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-[8px] font-black uppercase tracking-wider text-slate-400">{lic.category}</span>
                            <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-white/10 text-cyan-300">{lic.tier}</span>
                          </div>
                          <p className={`text-xs mt-0.5 leading-snug font-semibold ${lic.done ? 'text-slate-200' : 'text-slate-400'}`}>
                            {lic.title}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="liquid-glass-sm p-3 rounded-2xl text-[9px] text-slate-300 space-y-1">
                    <span className="font-black text-cyan-300 block uppercase">Perpetual License ID</span>
                    <p className="font-mono text-[9px] text-slate-400">AXN-EULA-2026-UNLIMITED-SEAT</p>
                  </div>
                </div>
              )}

              {/* SCREEN 5: GLYPH TELEMETRY & OVERVIEW */}
              {activeScreen === 'overview' && (
                <div className="flex-1 p-4 overflow-y-auto custom-scrollbar space-y-3.5 animate-fade-in relative z-20">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-black text-white uppercase tracking-wider">Edge Telemetry</h3>
                      <p className="text-[9px] text-cyan-300 font-mono">Global CDN Glyph Stream</p>
                    </div>
                    {/* Timeframe switch */}
                    <div className="flex items-center gap-1 liquid-glass-inset p-1 rounded-xl text-[8px] font-bold">
                      {(['1H', '24H', '7D'] as const).map(tf => (
                        <button
                          key={tf}
                          onClick={() => setSelectedTimeframe(tf)}
                          className={`px-1.5 py-0.5 rounded ${selectedTimeframe === tf ? 'bg-cyan-500 text-black font-black' : 'text-slate-400'}`}
                        >
                          {tf}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Simulated Dynamic Wave Graph */}
                  <div className="liquid-glass p-3.5 rounded-3xl space-y-2.5 border border-white/10">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-slate-400 font-semibold">Glyphs Served Today</span>
                      <span className="text-emerald-400 font-mono font-bold">{glyphRenders.toLocaleString()}</span>
                    </div>

                    <div className="h-24 w-full flex items-end gap-1 pt-2">
                      {[35, 55, 40, 80, 95, 65, 75, 48, 88, 100, 70, 82, 90, 94].map((val, idx) => (
                        <div key={idx} className="flex-1 bg-white/5 rounded-t-sm h-full flex items-end overflow-hidden">
                          <div 
                            className="w-full bg-gradient-to-t from-indigo-500 via-purple-500 to-cyan-400 rounded-t-sm transition-all duration-500" 
                            style={{ height: `${val}%` }} 
                          />
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-between text-[7px] font-mono text-slate-500">
                      <span>00:00</span>
                      <span>06:00</span>
                      <span>12:00</span>
                      <span>18:00</span>
                      <span>NOW</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="liquid-glass-inset p-2.5 rounded-2xl">
                      <span className="text-[8px] text-slate-400 uppercase font-black tracking-wider">Avg CDN Latency</span>
                      <div className="text-base font-black text-cyan-300 font-mono mt-0.5">11.4 ms</div>
                    </div>
                    <div className="liquid-glass-inset p-2.5 rounded-2xl">
                      <span className="text-[8px] text-slate-400 uppercase font-black tracking-wider">Active Domains</span>
                      <div className="text-base font-black text-purple-300 font-mono mt-0.5">2,840+</div>
                    </div>
                  </div>
                </div>
              )}

              {/* SCREEN 6: VARIABLE AXES ENGINE */}
              {activeScreen === 'explore' && (
                <div className="flex-1 p-4 overflow-y-auto custom-scrollbar space-y-3.5 animate-fade-in relative z-20">
                  <div>
                    <h3 className="text-sm font-black text-white uppercase tracking-wider">Variable Axes Engine</h3>
                    <p className="text-[9px] text-slate-400">Continuous Multi-Dimensional Type</p>
                  </div>

                  <div className="liquid-glass p-3.5 rounded-3xl space-y-3 border border-white/10">
                    <div className="space-y-1">
                      <div className="flex justify-between text-[9px] font-bold text-slate-300 uppercase">
                        <span>Weight [wght]</span>
                        <span className="text-cyan-300 font-mono">{axisWght}</span>
                      </div>
                      <input 
                        type="range" 
                        min="100" 
                        max="900" 
                        value={axisWght} 
                        onChange={(e) => setAxisWght(Number(e.target.value))}
                        className="w-full accent-cyan-400 h-1 bg-black/40 rounded" 
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-[9px] font-bold text-slate-300 uppercase">
                        <span>Slant [slnt]</span>
                        <span className="text-purple-300 font-mono">{axisSlnt}°</span>
                      </div>
                      <input 
                        type="range" 
                        min="-15" 
                        max="15" 
                        value={axisSlnt} 
                        onChange={(e) => setAxisSlnt(Number(e.target.value))}
                        className="w-full accent-purple-400 h-1 bg-black/40 rounded" 
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-[9px] font-bold text-slate-300 uppercase">
                        <span>Optical Size [opsz]</span>
                        <span className="text-indigo-300 font-mono">{axisOpsz}pt</span>
                      </div>
                      <input 
                        type="range" 
                        min="8" 
                        max="72" 
                        value={axisOpsz} 
                        onChange={(e) => setAxisOpsz(Number(e.target.value))}
                        className="w-full accent-indigo-400 h-1 bg-black/40 rounded" 
                      />
                    </div>
                  </div>

                  {/* Render Output preview */}
                  <div className="liquid-glass-inset p-3 rounded-2xl text-center overflow-hidden">
                    <div 
                      className="text-xl tracking-tight leading-tight select-none bg-clip-text text-transparent font-extrabold transition-all duration-300"
                      style={{
                        fontFamily: currentFont.family,
                        fontWeight: axisWght,
                        transform: `skewX(${axisSlnt * -1}deg)`,
                        fontSize: `${Math.min(Math.max(axisOpsz, 16), 28)}px`,
                        backgroundImage: currentFont.gradient,
                        filter: `drop-shadow(${currentFont.shadow})`
                      }}
                    >
                      A B C G Q R 0 8 &
                    </div>
                  </div>
                </div>
              )}

              {/* SCREEN 7: FONT LOCKER VAULT */}
              {activeScreen === 'files' && (
                <div className="flex-1 p-4 overflow-y-auto custom-scrollbar space-y-3 animate-fade-in relative z-20">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-black text-white uppercase tracking-wider">Font Asset Locker</h3>
                      <p className="text-[9px] text-slate-400">WOFF2 &amp; OTF Production Packages</p>
                    </div>
                    <button 
                      onClick={() => alert('All licensed font assets synchronized with Edge CDN.')}
                      className="neu-btn p-1.5 rounded-xl text-cyan-300"
                    >
                      <RefreshCw size={13} />
                    </button>
                  </div>

                  <div className="space-y-2">
                    {fontAssets.map((asset, i) => (
                      <div key={i} className="liquid-glass p-2.5 rounded-2xl space-y-1 border border-white/10">
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="font-mono font-bold text-cyan-300 truncate max-w-[170px]">{asset.name}</span>
                          <span className="text-[8px] font-black uppercase text-slate-400">{asset.format}</span>
                        </div>
                        <div className="liquid-glass-inset p-1.5 rounded-xl flex items-center justify-between text-[9px]">
                          <span className="text-slate-400 font-mono">{asset.size}</span>
                          <button 
                            onClick={() => copyToClipboard(asset.hash, `hash-${i}`)}
                            className="text-slate-300 hover:text-white flex items-center gap-1 font-mono text-[8px]"
                          >
                            {copiedText === `hash-${i}` ? <Check size={10} className="text-emerald-400" /> : <Copy size={10} />}
                            <span>{asset.hash.substring(0, 14)}...</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SCREEN 8: CREATOR STUDIO & ROYALTIES */}
              {activeScreen === 'profile' && (
                <div className="flex-1 p-4 overflow-y-auto custom-scrollbar space-y-3.5 animate-fade-in relative z-20">
                  <div className="text-center pt-1">
                    <div className="w-14 h-14 mx-auto neu-btn-primary rounded-2xl flex items-center justify-center font-black text-lg text-white shadow-xl mb-2">
                      <Crown size={22} className="text-cyan-400" />
                    </div>
                    <h3 className="text-sm font-black text-white">Foundry Creator Studio</h3>
                    <p className="text-[9px] text-cyan-300 font-mono">Verified Studio: Forhad Type Labs</p>
                  </div>

                  <div className="liquid-glass p-3.5 rounded-3xl space-y-2.5 border border-white/15">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400 font-semibold">Royalty Split</span>
                      <span className="neu-btn-cyan px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase text-black">
                        85% CREATOR SHARE
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400 font-semibold">Current Month Payout</span>
                      <span className="font-mono text-xs text-emerald-400 font-black">$14,890.00</span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400 font-semibold">Active Type Licenses</span>
                      <span className="text-white font-mono font-bold">1,894 Sold</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowInstallModal(true)}
                    className="w-full neu-btn-cyan py-3 rounded-2xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg hover:scale-105 transition-transform"
                  >
                    <Download size={14} /> Install Web App (Desktop &amp; Android)
                  </button>
                </div>
              )}

              {/* Bottom Nav Bar */}
              {renderBottomNav(activeScreen)}

            </div>
          </div>

        </div>

      </div>

      {/* Global Install App Modal */}
      <InstallAppModal isOpen={showInstallModal} onClose={() => setShowInstallModal(false)} />

    </div>
  );
};

export default MobileDemoShowcase;
