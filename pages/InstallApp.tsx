import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Download, Monitor, Smartphone, Apple, Check, X, Shield,
  ExternalLink, Sparkles, ArrowRight, Laptop, Globe, Share,
  PlusSquare, ArrowLeft, CheckCircle2, ShieldCheck, HardDrive,
  Layers, ShoppingBag, Eye, Copy, Zap, RefreshCw, Cpu
} from 'lucide-react';
import BrandMark from '../components/BrandMark';
import { usePWAInstall } from '../components/InstallAppModal';
import { soundFx } from '../services/soundFx';

export const InstallApp: React.FC = () => {
  const { isInstallable, isInstalled, platform: detectedPlatform, triggerInstall } = usePWAInstall();
  const [activeTab, setActiveTab] = useState<'windows' | 'mac' | 'ios' | 'android' | 'linux'>(() => {
    const ua = navigator.userAgent || '';
    if (/android/i.test(ua)) return 'android';
    if (/iPad|iPhone|iPod/.test(ua)) return 'ios';
    if (/Macintosh|Mac OS X/.test(ua)) return 'mac';
    if (/Linux/.test(ua) && !/android/i.test(ua)) return 'linux';
    return 'windows';
  });

  const [installSuccess, setInstallSuccess] = useState(false);
  const [downloadedLauncher, setDownloadedLauncher] = useState(false);

  const handleNativeInstall = async () => {
    soundFx.play('pop');
    if (isInstallable) {
      const accepted = await triggerInstall();
      if (accepted) {
        soundFx.play('success');
        setInstallSuccess(true);
      }
    } else {
      // Trigger a visual notification or scroll to manual step
      alert('Native install prompt initialized! Follow the highlighted steps below for your browser.');
    }
  };

  const handleDownloadStandaloneLauncher = () => {
    soundFx.play('purchase');
    const launcherHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Alphaxen Type Foundry Desktop</title>
  <meta http-equiv="refresh" content="0; url=https://alphaxen.com/#/">
  <script>
    window.location.href = window.location.origin ? window.location.origin + "/#/" : "https://alphaxen.com/#/";
  </script>
</head>
<body style="background:#070a13;color:#fff;font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;">
  <div style="text-align:center;">
    <h2>Launching Alphaxen Type Foundry...</h2>
    <p>Opening your typography workstation in standalone window.</p>
  </div>
</body>
</html>`;

    const blob = new Blob([launcherHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Alphaxen-App-Launcher.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setDownloadedLauncher(true);
    setTimeout(() => setDownloadedLauncher(false), 3000);
  };

  const platforms = [
    { id: 'windows', label: 'WINDOWS PC', icon: <Monitor size={16} />, detected: activeTab === 'windows' },
    { id: 'mac', label: 'MACOS / MAC', icon: <Laptop size={16} />, detected: activeTab === 'mac' },
    { id: 'ios', label: 'IPHONE & IPAD', icon: <Apple size={16} />, detected: activeTab === 'ios' },
    { id: 'android', label: 'ANDROID', icon: <Smartphone size={16} />, detected: activeTab === 'android' },
    { id: 'linux', label: 'LINUX & CHROMEOS', icon: <Globe size={16} />, detected: activeTab === 'linux' },
  ] as const;

  return (
    <div className="min-h-screen bg-[#070a13] text-slate-100 selection:bg-cyan-500/30 font-sans overflow-x-hidden">
      
      {/* Top Sticky Header */}
      <header className="sticky top-0 z-50 w-full bg-[#070a13]/98 backdrop-blur-xl border-b border-white/10 shadow-2xl">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 py-3.5 flex justify-between items-center">
          <BrandMark suffix="APP DOWNLOAD & INSTALL" />
          
          <div className="flex items-center gap-3">
            <Link to="/" className="neu-btn px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 hover:text-white">
              HOME
            </Link>
            <Link to="/shop" className="neu-btn px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 hover:text-white">
              FONT CATALOG
            </Link>
            <Link to="/buyer" className="neu-btn px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-indigo-300 hover:text-white">
              BUYER VAULT
            </Link>
            <Link to="/seller" className="neu-btn px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-purple-300 hover:text-white">
              STUDIO
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-8 pt-10 pb-24 space-y-12 animate-slide-up">
        
        {/* Hero Banner */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <Link to="/" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-cyan-400 hover:text-white transition-colors mb-2">
            <ArrowLeft size={14} /> BACK TO HOME MARKETPLACE
          </Link>
          <div className="inline-flex items-center gap-2 py-1.5 px-5 rounded-full bg-[#131b2e] border border-cyan-500/40 text-[10px] font-black uppercase tracking-[0.25em] text-cyan-300 shadow-md">
            <Download size={13} className="text-cyan-400" />
            <span>UNIVERSAL PROGRESSIVE WEB APPLICATION (PWA)</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-white font-grotesk leading-tight">
            INSTALL ALPHAXEN <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-400 to-indigo-400">
              ON ANY DEVICE.
            </span>
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm font-medium leading-relaxed max-w-2xl mx-auto">
            Experience ultra-low latency font testing, offline typography licensing vaults, and standalone desktop window performance across Windows, Mac, iOS, Android, and Linux.
          </p>
        </div>

        {/* Primary 1-Click Action Bar */}
        <div className="bg-[#0c101d] border border-white/20 p-6 sm:p-8 rounded-[2.5rem] shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_rgba(52,211,153,1)]" />
              <span className="text-xs font-black uppercase tracking-wider text-emerald-300">
                {isInstalled ? 'ALPHAXEN INSTALLED & READY' : '1-CLICK NATIVE PWA INSTALLATION'}
              </span>
            </div>
            <p className="text-xs text-slate-300 font-medium">
              Runs in an isolated window with zero address-bar clutter, hardware GPU acceleration, and offline font caching.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={handleNativeInstall}
              className="neu-btn-primary h-14 px-8 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] text-white shadow-2xl flex items-center gap-2.5 cursor-pointer hover:scale-105 transition-all"
            >
              <Download size={16} />
              <span>{isInstalled ? 'APP ALREADY INSTALLED' : 'INSTALL DESKTOP / MOBILE APP'}</span>
            </button>

            <button
              onClick={handleDownloadStandaloneLauncher}
              className="neu-btn h-14 px-6 rounded-2xl font-black uppercase tracking-[0.15em] text-[10px] text-cyan-300 hover:text-white flex items-center gap-2 cursor-pointer transition-all border border-cyan-500/40"
              title="Download standalone launcher file"
            >
              <HardDrive size={15} />
              <span>{downloadedLauncher ? 'LAUNCHER SAVED!' : 'DESKTOP LAUNCHER'}</span>
            </button>
          </div>
        </div>

        {/* Platform Selection Tabs */}
        <div className="space-y-6">
          <div className="flex items-center justify-center gap-2 p-1.5 bg-[#050814] border border-white/20 rounded-2xl overflow-x-auto custom-scrollbar">
            {platforms.map((p) => (
              <button
                key={p.id}
                onClick={() => setActiveTab(p.id)}
                className={`py-3 px-5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                  activeTab === p.id
                    ? 'neu-btn-primary text-white shadow-lg scale-102 border-white/40'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {p.icon}
                <span>{p.label}</span>
                {detectedPlatform === p.id && (
                  <span className="px-2 py-0.5 rounded-full text-[8px] font-black uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    DETECTED
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Platform Specific Step-by-Step Installation Cards */}
          <div className="bg-[#0c101d] border border-white/20 p-8 sm:p-12 rounded-[2.5rem] shadow-2xl space-y-8">
            
            {/* WINDOWS TAB */}
            {activeTab === 'windows' && (
              <div className="space-y-8 animate-fade-in">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center">
                      <Monitor size={24} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black uppercase tracking-tight text-white font-grotesk">
                        WINDOWS 11 / 10 APP INSTALLATION
                      </h3>
                      <p className="text-xs text-slate-400 font-medium">
                        Install via Microsoft Edge, Google Chrome, Brave, or Opera
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleNativeInstall}
                    className="neu-btn-cyan px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-white cursor-pointer hover:scale-105"
                  >
                    TRIGGER INSTALL
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-[#050814] border border-white/15 p-6 rounded-2xl space-y-3">
                    <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-300 font-mono font-black flex items-center justify-center text-sm">
                      1
                    </div>
                    <h4 className="text-sm font-black uppercase text-white">OPEN IN EDGE OR CHROME</h4>
                    <p className="text-xs text-slate-300 leading-relaxed font-medium">
                      Navigate to <code className="text-cyan-300 bg-black/40 px-1.5 py-0.5 rounded">alphaxen.com</code> in any Chromium browser on your PC.
                    </p>
                  </div>

                  <div className="bg-[#050814] border border-white/15 p-6 rounded-2xl space-y-3">
                    <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-300 font-mono font-black flex items-center justify-center text-sm">
                      2
                    </div>
                    <h4 className="text-sm font-black uppercase text-white">CLICK INSTALL IN ADDRESS BAR</h4>
                    <p className="text-xs text-slate-300 leading-relaxed font-medium">
                      Look for the <strong className="text-white">Install Icon</strong> (🖥️ or ➕) on the right side of your browser URL bar, or click the 3-dots menu $\rightarrow$ <strong className="text-white">Install Alphaxen</strong>.
                    </p>
                  </div>

                  <div className="bg-[#050814] border border-white/15 p-6 rounded-2xl space-y-3">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-300 font-mono font-black flex items-center justify-center text-sm">
                      3
                    </div>
                    <h4 className="text-sm font-black uppercase text-white">PIN TO TASKBAR / START</h4>
                    <p className="text-xs text-slate-300 leading-relaxed font-medium">
                      Alphaxen launches in a high-precision standalone window with direct Windows Start menu and Taskbar shortcuts.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* MACOS TAB */}
            {activeTab === 'mac' && (
              <div className="space-y-8 animate-fade-in">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center justify-center">
                      <Laptop size={24} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black uppercase tracking-tight text-white font-grotesk">
                        MACOS (SONOMA / VENTURA / SEQUOIA)
                      </h3>
                      <p className="text-xs text-slate-400 font-medium">
                        Native Dock Integration with Safari 17+ or Google Chrome
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-[#050814] border border-white/15 p-6 rounded-2xl space-y-3">
                    <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-300 font-mono font-black flex items-center justify-center text-sm">
                      1
                    </div>
                    <h4 className="text-sm font-black uppercase text-white">IN SAFARI: FILE MENU</h4>
                    <p className="text-xs text-slate-300 leading-relaxed font-medium">
                      In the top Mac menu bar, click <strong className="text-white">File</strong> and select <strong className="text-cyan-300">"Add to Dock..."</strong>.
                    </p>
                  </div>

                  <div className="bg-[#050814] border border-white/15 p-6 rounded-2xl space-y-3">
                    <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-300 font-mono font-black flex items-center justify-center text-sm">
                      2
                    </div>
                    <h4 className="text-sm font-black uppercase text-white">OR IN CHROME: INSTALL</h4>
                    <p className="text-xs text-slate-300 leading-relaxed font-medium">
                      Click the <strong className="text-white">Install</strong> icon in the address bar or go to Chrome Menu $\rightarrow$ <strong className="text-purple-300">Save and Share $\rightarrow$ Install Alphaxen</strong>.
                    </p>
                  </div>

                  <div className="bg-[#050814] border border-white/15 p-6 rounded-2xl space-y-3">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-300 font-mono font-black flex items-center justify-center text-sm">
                      3
                    </div>
                    <h4 className="text-sm font-black uppercase text-white">DOCK & STAGE MANAGER</h4>
                    <p className="text-xs text-slate-300 leading-relaxed font-medium">
                      The app appears directly in your macOS Dock with full Cmd+Tab multitasking and Stage Manager support.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* IOS TAB */}
            {activeTab === 'ios' && (
              <div className="space-y-8 animate-fade-in">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center">
                    <Apple size={24} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black uppercase tracking-tight text-white font-grotesk">
                      IPHONE & IPAD (SAFARI)
                    </h3>
                    <p className="text-xs text-slate-400 font-medium">
                      Add directly to your iOS Home Screen with full-screen native experience
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-[#050814] border border-white/15 p-6 rounded-2xl space-y-3">
                    <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-300 font-mono font-black flex items-center justify-center text-sm">
                      1
                    </div>
                    <h4 className="text-sm font-black uppercase text-white flex items-center gap-2">
                      <Share size={16} className="text-cyan-400" />
                      <span>TAP SHARE BUTTON</span>
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed font-medium">
                      Open <code className="text-cyan-300 bg-black/40 px-1.5 py-0.5 rounded">alphaxen.com</code> in Safari, then tap the <strong className="text-white">Share</strong> icon at the bottom of the screen.
                    </p>
                  </div>

                  <div className="bg-[#050814] border border-white/15 p-6 rounded-2xl space-y-3">
                    <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-300 font-mono font-black flex items-center justify-center text-sm">
                      2
                    </div>
                    <h4 className="text-sm font-black uppercase text-white flex items-center gap-2">
                      <PlusSquare size={16} className="text-purple-400" />
                      <span>ADD TO HOME SCREEN</span>
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed font-medium">
                      Scroll down in the action sheet and tap <strong className="text-purple-300">"Add to Home Screen"</strong>.
                    </p>
                  </div>

                  <div className="bg-[#050814] border border-white/15 p-6 rounded-2xl space-y-3">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-300 font-mono font-black flex items-center justify-center text-sm">
                      3
                    </div>
                    <h4 className="text-sm font-black uppercase text-white flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-emerald-400" />
                      <span>TAP ADD</span>
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed font-medium">
                      Tap <strong className="text-white">"Add"</strong> in the top right corner. Alphaxen will launch with a dedicated native app icon and zero Safari URL bar chrome.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* ANDROID TAB */}
            {activeTab === 'android' && (
              <div className="space-y-8 animate-fade-in">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
                      <Smartphone size={24} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black uppercase tracking-tight text-white font-grotesk">
                        ANDROID (CHROME / SAMSUNG / EDGE)
                      </h3>
                      <p className="text-xs text-slate-400 font-medium">
                        Instant 1-Click Native WebAPK Installation
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleNativeInstall}
                    className="neu-btn-primary px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-white cursor-pointer hover:scale-105"
                  >
                    INSTALL NOW
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-[#050814] border border-white/15 p-6 rounded-2xl space-y-3">
                    <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-300 font-mono font-black flex items-center justify-center text-sm">
                      1
                    </div>
                    <h4 className="text-sm font-black uppercase text-white">TAP INSTALL PROMPT</h4>
                    <p className="text-xs text-slate-300 leading-relaxed font-medium">
                      Tap the <strong className="text-cyan-300">"Install App"</strong> button above, or check the install banner at the bottom of Chrome.
                    </p>
                  </div>

                  <div className="bg-[#050814] border border-white/15 p-6 rounded-2xl space-y-3">
                    <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-300 font-mono font-black flex items-center justify-center text-sm">
                      2
                    </div>
                    <h4 className="text-sm font-black uppercase text-white">OR TAP 3-DOTS MENU</h4>
                    <p className="text-xs text-slate-300 leading-relaxed font-medium">
                      If the prompt is hidden, tap the browser <strong className="text-white">3-dots (⋮)</strong> menu $\rightarrow$ <strong className="text-purple-300">"Install app"</strong> or <strong className="text-purple-300">"Add to Home screen"</strong>.
                    </p>
                  </div>

                  <div className="bg-[#050814] border border-white/15 p-6 rounded-2xl space-y-3">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-300 font-mono font-black flex items-center justify-center text-sm">
                      3
                    </div>
                    <h4 className="text-sm font-black uppercase text-white">NATIVE WEBAPK READY</h4>
                    <p className="text-xs text-slate-300 leading-relaxed font-medium">
                      Android automatically compiles a native WebAPK with full splash screen, app drawer icon, and offline storage.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* LINUX TAB */}
            {activeTab === 'linux' && (
              <div className="space-y-8 animate-fade-in">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
                      <Globe size={24} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black uppercase tracking-tight text-white font-grotesk">
                        LINUX &amp; CHROMEOS WORKSTATIONS
                      </h3>
                      <p className="text-xs text-slate-400 font-medium">
                        Universal Chromium Desktop PWA Integration
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-[#050814] border border-white/15 p-6 rounded-2xl space-y-3">
                    <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-300 font-mono font-black flex items-center justify-center text-sm">
                      1
                    </div>
                    <h4 className="text-sm font-black uppercase text-white">OPEN IN CHROMIUM</h4>
                    <p className="text-xs text-slate-300 leading-relaxed font-medium">
                      Open Alphaxen in Chrome, Chromium, Brave, or Edge on your Linux desktop.
                    </p>
                  </div>

                  <div className="bg-[#050814] border border-white/15 p-6 rounded-2xl space-y-3">
                    <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-300 font-mono font-black flex items-center justify-center text-sm">
                      2
                    </div>
                    <h4 className="text-sm font-black uppercase text-white">CLICK INSTALL APP</h4>
                    <p className="text-xs text-slate-300 leading-relaxed font-medium">
                      Click the install icon in the address bar or select <strong className="text-purple-300">Menu $\rightarrow$ More Tools $\rightarrow$ Create Shortcut... (Open as window)</strong>.
                    </p>
                  </div>

                  <div className="bg-[#050814] border border-white/15 p-6 rounded-2xl space-y-3">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-300 font-mono font-black flex items-center justify-center text-sm">
                      3
                    </div>
                    <h4 className="text-sm font-black uppercase text-white">APP LAUNCHER INTEGRATED</h4>
                    <p className="text-xs text-slate-300 leading-relaxed font-medium">
                      Creates an official <code className="text-emerald-300 font-mono text-[11px]">.desktop</code> entry in your GNOME / KDE / XFCE app drawer.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* NATIVE APP CAPABILITIES MATRIX */}
        <div className="bg-[#0c101d] border border-white/20 p-8 sm:p-12 rounded-[2.5rem] shadow-2xl space-y-8">
          <div>
            <div className="inline-block px-4 py-1 rounded-full bg-[#131b2e] border border-cyan-500/30 text-cyan-300 text-[9px] font-black uppercase tracking-widest mb-2">
              WHY INSTALL ALPHAXEN APP?
            </div>
            <h3 className="text-3xl font-black uppercase tracking-tight text-white font-grotesk">
              NATIVE CAPABILITIES &amp; PERFORMANCE
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-[#050814] border border-white/15 p-6 rounded-2xl space-y-2">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 flex items-center justify-center">
                <Zap size={20} />
              </div>
              <h4 className="text-xs font-black uppercase tracking-wider text-white">0ms INSTANT LAUNCH</h4>
              <p className="text-[11px] text-slate-300 leading-relaxed font-medium">
                Launches immediately from your desktop, taskbar, dock, or home screen without loading browser tabs.
              </p>
            </div>

            <div className="bg-[#050814] border border-white/15 p-6 rounded-2xl space-y-2">
              <div className="w-10 h-10 rounded-xl bg-purple-500/15 text-purple-400 border border-purple-500/30 flex items-center justify-center">
                <Cpu size={20} />
              </div>
              <h4 className="text-xs font-black uppercase tracking-wider text-white">GPU FONT ENGINE</h4>
              <p className="text-[11px] text-slate-300 leading-relaxed font-medium">
                Hardware-accelerated glyph rasterization for 60fps variable axis and specimen waterfall rendering.
              </p>
            </div>

            <div className="bg-[#050814] border border-white/15 p-6 rounded-2xl space-y-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
                <HardDrive size={20} />
              </div>
              <h4 className="text-xs font-black uppercase tracking-wider text-white">OFFLINE VAULT CACHE</h4>
              <p className="text-[11px] text-slate-300 leading-relaxed font-medium">
                Access your licensed font family metadata, specimen waterfalls, and character sets even when offline.
              </p>
            </div>

            <div className="bg-[#050814] border border-white/15 p-6 rounded-2xl space-y-2">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
                <ShieldCheck size={20} />
              </div>
              <h4 className="text-xs font-black uppercase tracking-wider text-white">SECURE DRM VAULT</h4>
              <p className="text-[11px] text-slate-300 leading-relaxed font-medium">
                Sandbox isolation ensures your cryptographic license keys and font assets are safely stored on device.
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* FOOTER */}
      <footer className="border-t border-white/[0.08] bg-[#050814] pt-16 pb-28 sm:pb-16 px-6 sm:px-8 relative z-10 overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <Link to="/">
            <BrandMark mode="default" />
          </Link>
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500">
            © 2026 ALPHAXEN TYPE FOUNDRY. UNIVERSAL PWA APP ECOSYSTEM.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default InstallApp;
