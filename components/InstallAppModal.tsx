import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Download, Monitor, Smartphone, Apple, Check, X, Shield,
  ExternalLink, Sparkles, ArrowRight, Laptop, Globe, Share,
  PlusSquare, CheckCircle2, ShieldCheck, HardDrive, Zap
} from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

// Global hook for PWA install state and prompt
export const usePWAInstall = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [platform, setPlatform] = useState<'windows' | 'mac' | 'android' | 'ios' | 'linux'>('windows');

  useEffect(() => {
    // Detect user OS / Device
    const ua = navigator.userAgent || '';
    if (/android/i.test(ua)) {
      setPlatform('android');
    } else if (/iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream) {
      setPlatform('ios');
    } else if (/Macintosh|Mac OS X/.test(ua)) {
      setPlatform('mac');
    } else if (/Linux/.test(ua) && !/android/i.test(ua)) {
      setPlatform('linux');
    } else {
      setPlatform('windows');
    }

    // Check if running in standalone mode (already installed)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;
    if (isStandalone) {
      setIsInstalled(true);
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const triggerInstall = async (): Promise<boolean> => {
    if (!deferredPrompt) return false;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
      return true;
    }
    return false;
  };

  return {
    deferredPrompt,
    isInstallable,
    isInstalled,
    platform,
    triggerInstall
  };
};

interface InstallAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstallAppModal: React.FC<InstallAppModalProps> = ({ isOpen, onClose }) => {
  const { isInstallable, isInstalled, platform: detectedPlatform, triggerInstall } = usePWAInstall();
  const [activeTab, setActiveTab] = useState<'windows' | 'mac' | 'ios' | 'android' | 'linux'>(
    detectedPlatform
  );
  const [downloadedLauncher, setDownloadedLauncher] = useState(false);

  useEffect(() => {
    setActiveTab(detectedPlatform);
  }, [detectedPlatform]);

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    if (isInstallable) {
      await triggerInstall();
    } else {
      alert('Native installation prompt triggered! Follow the highlighted guide below for your browser.');
    }
  };

  const handleDownloadLauncher = () => {
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
<body style="background:#0b0e17;color:#fff;font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;">
  <div style="text-align:center;">
    <h2>Launching Alphaxen Type Foundry...</h2>
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
    { id: 'windows', label: 'WINDOWS', icon: <Monitor size={14} /> },
    { id: 'mac', label: 'MACOS', icon: <Laptop size={14} /> },
    { id: 'ios', label: 'IOS / IPHONE', icon: <Apple size={14} /> },
    { id: 'android', label: 'ANDROID', icon: <Smartphone size={14} /> },
    { id: 'linux', label: 'LINUX', icon: <Globe size={14} /> },
  ] as const;

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-2xl animate-fade-in font-sans"
      onClick={onClose}
    >
      <div 
        className="bg-[#0a0a0a] rounded-[2.5rem] w-full max-w-2xl overflow-hidden shadow-[0_25px_70px_rgba(0,0,0,0.95)] border border-white/20 flex flex-col max-h-[92vh] relative"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Modal Top Header */}
        <div className="p-6 sm:p-8 border-b border-white/10 bg-[#0b0e17] flex items-center justify-between relative">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 neu-btn-primary rounded-2xl flex items-center justify-center shadow-lg">
              <Download className="text-white" size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-black tracking-tight text-white font-grotesk uppercase">
                  Install Alphaxen App
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase tracking-widest bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  Universal PWA
                </span>
              </div>
              <p className="text-xs text-slate-300 font-medium mt-0.5">
                Native typography workstation for desktop, tablet, and mobile
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="neu-btn p-2.5 rounded-xl text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 overflow-y-auto custom-scrollbar space-y-6">

          {/* Quick 1-Click Action Card */}
          <div className="bg-[#0b0e17] border border-purple-500/30 p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse shadow-[0_0_8px_rgba(139,92,246,0.8)]" />
                <h4 className="text-xs font-black uppercase tracking-wider text-white">1-CLICK NATIVE PWA INSTALL</h4>
              </div>
              <p className="text-[11px] text-slate-300 font-medium">
                Installs as a standalone app with GPU hardware font acceleration and offline cache.
              </p>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={handleInstallClick}
                className="neu-btn-primary h-12 px-6 rounded-xl font-black text-[10px] uppercase tracking-widest text-white shadow-xl flex items-center justify-center gap-2 cursor-pointer hover:scale-105 transition-all w-full sm:w-auto"
              >
                <Download size={14} />
                <span>INSTALL APP</span>
              </button>

              <button
                onClick={handleDownloadLauncher}
                className="neu-btn h-12 px-4 rounded-xl text-[10px] font-black uppercase text-purple-300 hover:text-white cursor-pointer transition-all border border-purple-500/30"
                title="Download Standalone Launcher"
              >
                <HardDrive size={14} />
              </button>
            </div>
          </div>

          {/* Device Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-[#0b0e17] border border-white/10 rounded-xl overflow-x-auto custom-scrollbar">
            {platforms.map((p) => (
              <button
                key={p.id}
                onClick={() => setActiveTab(p.id)}
                className={`py-2 px-3.5 rounded-lg text-[9px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 shrink-0 transition-all cursor-pointer ${
                  activeTab === p.id
                    ? 'neu-btn-primary text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {p.icon}
                <span>{p.label}</span>
                {detectedPlatform === p.id && (
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                )}
              </button>
            ))}
          </div>

          {/* Device Guided Steps */}
          <div className="bg-[#0b0e17] border border-white/15 p-6 rounded-2xl space-y-4">
            {activeTab === 'windows' && (
              <div className="space-y-3">
                <h5 className="text-xs font-black uppercase text-white tracking-wider flex items-center gap-2">
                  <Monitor size={15} className="text-purple-400" /> WINDOWS 11 / 10 (EDGE / CHROME)
                </h5>
                <ol className="space-y-2 text-xs text-slate-300 font-medium">
                  <li className="flex items-start gap-2">
                    <span className="text-purple-300 font-mono font-bold">1.</span>
                    <span>Click the <strong>Install Icon</strong> (🖥️ or ➕) in your browser address bar.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-300 font-mono font-bold">2.</span>
                    <span>Click <strong>"Install"</strong> in the popup confirmation dialog.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-300 font-mono font-bold">3.</span>
                    <span>Launch directly from your Windows Start menu or Taskbar.</span>
                  </li>
                </ol>
              </div>
            )}

            {activeTab === 'mac' && (
              <div className="space-y-3">
                <h5 className="text-xs font-black uppercase text-white tracking-wider flex items-center gap-2">
                  <Laptop size={15} className="text-purple-400" /> MACOS (SAFARI 17+ / CHROME)
                </h5>
                <ol className="space-y-2 text-xs text-slate-300 font-medium">
                  <li className="flex items-start gap-2">
                    <span className="text-purple-300 font-mono font-bold">1.</span>
                    <span>In Safari top menu: Click <strong>File $\rightarrow$ Add to Dock...</strong>.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-300 font-mono font-bold">2.</span>
                    <span>In Chrome: Click address bar <strong>Install</strong> or Menu $\rightarrow$ Save &amp; Share.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-300 font-mono font-bold">3.</span>
                    <span>Dock icon opens full standalone window with Cmd+Tab switching.</span>
                  </li>
                </ol>
              </div>
            )}

            {activeTab === 'ios' && (
              <div className="space-y-3">
                <h5 className="text-xs font-black uppercase text-white tracking-wider flex items-center gap-2">
                  <Apple size={15} className="text-purple-400" /> IPHONE &amp; IPAD (SAFARI)
                </h5>
                <ol className="space-y-2 text-xs text-slate-300 font-medium">
                  <li className="flex items-start gap-2">
                    <span className="text-purple-300 font-mono font-bold">1.</span>
                    <span>Tap the <strong>Share</strong> button ($\uparrow$) at the bottom of Safari.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-300 font-mono font-bold">2.</span>
                    <span>Scroll down and tap <strong>"Add to Home Screen"</strong> ($+$).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-300 font-mono font-bold">3.</span>
                    <span>Tap <strong>"Add"</strong> at top right. Launches full-screen without URL bar.</span>
                  </li>
                </ol>
              </div>
            )}

            {activeTab === 'android' && (
              <div className="space-y-3">
                <h5 className="text-xs font-black uppercase text-white tracking-wider flex items-center gap-2">
                  <Smartphone size={15} className="text-purple-400" /> ANDROID (CHROME / SAMSUNG)
                </h5>
                <ol className="space-y-2 text-xs text-slate-300 font-medium">
                  <li className="flex items-start gap-2">
                    <span className="text-purple-300 font-mono font-bold">1.</span>
                    <span>Tap the <strong>"Install App"</strong> button above or bottom banner.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-300 font-mono font-bold">2.</span>
                    <span>Or tap the <strong>3-dots (⋮)</strong> menu $\rightarrow$ <strong>"Install app"</strong>.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-300 font-mono font-bold">3.</span>
                    <span>Installs native WebAPK with full offline cache in your app drawer.</span>
                  </li>
                </ol>
              </div>
            )}

            {activeTab === 'linux' && (
              <div className="space-y-3">
                <h5 className="text-xs font-black uppercase text-white tracking-wider flex items-center gap-2">
                  <Globe size={15} className="text-purple-400" /> LINUX &amp; CHROMEOS
                </h5>
                <ol className="space-y-2 text-xs text-slate-300 font-medium">
                  <li className="flex items-start gap-2">
                    <span className="text-purple-300 font-mono font-bold">1.</span>
                    <span>Open in Chrome / Chromium / Brave / Edge on your Linux desktop.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-300 font-mono font-bold">2.</span>
                    <span>Click the address bar install icon or Menu $\rightarrow$ Install Alphaxen.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-300 font-mono font-bold">3.</span>
                    <span>Automatically creates <code>.desktop</code> entry in your desktop environment.</span>
                  </li>
                </ol>
              </div>
            )}
          </div>

          {/* Full Page Link */}
          <div className="text-center pt-2">
            <Link
              to="/install"
              onClick={onClose}
              className="text-xs font-bold text-purple-400 hover:text-purple-300 uppercase tracking-wider inline-flex items-center gap-1.5 underline underline-offset-4"
            >
              <span>View Full Multi-Device Installation Manual &amp; Offline Kit</span>
              <ExternalLink size={13} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstallAppModal;
