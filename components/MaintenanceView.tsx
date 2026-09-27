import React from 'react';
import { Hammer, RefreshCw, MessageSquare, ShieldAlert, Sparkles } from 'lucide-react';

interface MaintenanceViewProps {
  status?: string;
  message?: string;
  onRefresh?: () => void;
}

export const MaintenanceView: React.FC<MaintenanceViewProps> = ({ status, message, onRefresh }) => {
  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh();
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#090a0f] relative overflow-hidden px-4 select-none">
      {/* Background Animated Glows & Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(255,255,255,0.06),transparent_60%)] pointer-events-none" />
      <div 
        className="fixed inset-0 z-0 pointer-events-none opacity-[0.03]" 
        style={{ 
          backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', 
          backgroundSize: '40px 40px' 
        }} 
      />
      
      {/* Subtle Floating Ambient Blobs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" style={{ animationDelay: '1s' }} />

      {/* Main Glass Card */}
      <div className="relative z-10 max-w-lg w-full bg-[#11131a]/80 border border-white/10 backdrop-blur-2xl p-8 md:p-12 rounded-[2.5rem] shadow-[0_20px_70px_rgba(0,0,0,0.8)] text-center animate-fade-in">
        
        {/* Top Brand Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-sm">
          <span className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded tracking-tighter uppercase">AXN</span>
          <span className="text-[11px] font-bold tracking-widest text-white/70 uppercase">Foundry Maintenance</span>
        </div>

        {/* Animated Icon Container */}
        <div className="relative mb-8 flex justify-center items-center">
          <div className="absolute w-24 h-24 bg-white/5 rounded-full blur-xl animate-ping opacity-30" />
          <div className="relative w-20 h-20 rounded-3xl bg-gradient-to-b from-white/10 to-white/5 border border-white/20 flex items-center justify-center shadow-inner group">
            <Hammer className="w-10 h-10 text-white animate-bounce" style={{ animationDuration: '2s' }} />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-purple-500/20 border border-purple-500/40 flex items-center justify-center">
              <ShieldAlert className="w-3.5 h-3.5 text-purple-400" />
            </div>
          </div>
        </div>

        {/* Headline */}
        <h1 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight mb-3">
          Under Scheduled Maintenance
        </h1>

        {/* Sub-Status / Progress Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-purple-500/10 border border-purple-500/20 rounded-full mb-6">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
          </span>
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-purple-300">
            {status || 'Optimizing Glyph CDN & Font Rendering Engine'}
          </span>
        </div>

        {/* Custom Message Container */}
        <div className="bg-black/40 border border-white/5 rounded-2xl p-6 mb-8 text-left relative overflow-hidden">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">
            <Sparkles className="w-3 h-3 text-white/40" />
            <span>Administrator Notice</span>
          </div>
          <p className="text-sm md:text-base text-white/80 leading-relaxed font-medium whitespace-pre-line">
            {message && message.trim().length > 0 
              ? message 
              : "We are currently performing routine upgrades to improve your typography experience. All font licensing and CDN services will resume shortly."
            }
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
          <button
            onClick={handleRefresh}
            className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 py-3.5 px-6 bg-white hover:bg-white/90 text-black font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-lg active:scale-95"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh Status</span>
          </button>
          
          <a
            href="#/shop" 
            className="w-full sm:w-auto flex items-center justify-center gap-2 py-3.5 px-6 bg-white/5 hover:bg-white/10 text-white border border-white/10 font-black text-xs uppercase tracking-widest rounded-xl transition-all active:scale-95"
          >
            <span>Font Catalog</span>
          </a>
        </div>

        {/* Footer Note */}
        <div className="mt-8 pt-6 border-t border-white/5 text-[11px] text-white/30 font-medium tracking-wide">
          Alphaxen Digital Type Foundry &bull; High Precision Typography Architecture
        </div>
      </div>
    </div>
  );
};
