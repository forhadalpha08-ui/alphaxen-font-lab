import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, FileText, Scale, Lock, Globe, ShoppingBag, LayoutDashboard, Home, BookOpen, Layers, Menu, X } from 'lucide-react';
import BrandMark from '../components/BrandMark';

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

export const TOS: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0b0e17] text-slate-100 selection:bg-purple-500/30 font-sans overflow-x-hidden">
      
      {/* Top Sticky High-Definition Header */}
      <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${isMenuOpen ? 'bg-[#0b0e17]/98 backdrop-blur-xl border-b border-white/10' : 'bg-transparent max-md:border-transparent max-md:shadow-none md:bg-[#0b0e17]/98 md:backdrop-blur-xl md:border-b md:border-white/10 md:shadow-2xl'}`}>
        <div className="max-w-7xl mx-auto px-6 sm:px-12 py-3.5 flex justify-between items-center">
          <BrandMark suffix="EULA & TERMS" />
          
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
            <Link to="/buyer" className="neu-btn px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 hover:text-white">
              BUYER VAULT
            </Link>
            <Link to="/docs" className="neu-btn-primary px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-white shadow-lg">
              DOCS
            </Link>
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
              <LayoutDashboard size={16} className="text-purple-400" />
              <span>Buyer Vault &amp; Licenses</span>
            </Link>
            <Link 
              to="/docs" 
              className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-black/60 border border-white/10 text-xs font-black uppercase tracking-wider text-slate-200 hover:text-white"
              onClick={() => setIsMenuOpen(false)}
            >
              <BookOpen size={16} className="text-purple-400" />
              <span>Documentation &amp; CDN</span>
            </Link>
          </div>
        )}
      </header>

      {/* Main Container */}
      <div className="max-w-4xl mx-auto px-6 sm:px-8 pt-8 pb-24 space-y-10 animate-slide-up">
        
        {/* Header Hero */}
        <div className="space-y-4">
          <Link to="/" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-purple-400 hover:text-white transition-colors">
            <ArrowLeft size={14} /> BACK TO HOME
          </Link>
          <div className="inline-flex items-center gap-3 py-1.5 px-5 rounded-full liquid-glass-sm text-[9px] font-black uppercase tracking-[0.3em] text-purple-300">
            <span className="flex h-1.5 w-1.5 rounded-full bg-purple-400 animate-pulse shadow-[0_0_8px_rgba(139,92,246,1)]" />
            LEGAL COMPLIANCE & COMMERCIAL EULA
          </div>
          <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-white font-grotesk leading-none">
            TERMS OF SERVICE <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-300 to-sky-400">
              & EULA AGREEMENT.
            </span>
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm font-semibold uppercase tracking-wider leading-relaxed">
            END USER LICENSE AGREEMENT GOVERNING THE PURCHASE, DEPLOYMENT, AND DISTRIBUTION OF ALPHAXEN TYPE SOFTWARE.
          </p>
        </div>

        {/* EULA Clauses */}
        <div className="liquid-glass p-8 sm:p-12 rounded-[2.5rem] shadow-2xl space-y-8 text-slate-200 text-xs leading-relaxed">
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-purple-400 font-black text-sm uppercase tracking-wider">
              <ShieldCheck size={18} />
              <h2>1. PERPETUAL COMMERCIAL LICENSE GRANT</h2>
            </div>
            <p className="text-slate-300 leading-relaxed font-medium">
              Upon completing a typeface purchase through the Alphaxen Marketplace, Alphaxen grants the purchaser a perpetual, worldwide, non-exclusive license to utilize the licensed font files (OTF, TTF, WOFF, WOFF2) in accordance with the selected licensing tier (Personal, Commercial, Extended, or Enterprise).
            </p>
          </section>

          <section className="space-y-3">
            <div className="flex items-center gap-2 text-purple-400 font-black text-sm uppercase tracking-wider">
              <Scale size={18} />
              <h2>2. FOUNDRY CREATOR ROYALTIES & 85% SPLIT</h2>
            </div>
            <p className="text-slate-300 leading-relaxed font-medium">
              Independent font designers and type foundries who publish on Alphaxen retain all underlying intellectual property rights to their glyph designs and receive an industry-leading 85% net royalty payout on all retail sales and direct enterprise client licenses.
            </p>
          </section>

          <section className="space-y-3">
            <div className="flex items-center gap-2 text-purple-400 font-black text-sm uppercase tracking-wider">
              <Globe size={18} />
              <h2>3. WEBFONT EMBEDDING & DOMAIN WHITELISTING</h2>
            </div>
            <p className="text-slate-300 leading-relaxed font-medium">
              Webfont embedding via the Alphaxen Global Edge CDN or self-hosted WOFF2 files is authorized for production websites and applications registered in your Central Buyer Vault. Cross-origin font access is cryptographically protected to protect typography assets.
            </p>
          </section>

          <section className="space-y-3">
            <div className="flex items-center gap-2 text-purple-400 font-black text-sm uppercase tracking-wider">
              <Lock size={18} />
              <h2>4. RESTRICTIONS & PROHIBITED USES</h2>
            </div>
            <p className="text-slate-300 leading-relaxed font-medium">
              Licensees may not reverse engineer, decompile, resell, redistribute, or sub-license the raw font binaries to unauthorized third parties without an explicit Extended or Enterprise Multi-Seat EULA agreement.
            </p>
          </section>
        </div>
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
                EMPOWERING DESIGNERS & TYPE STUDIOS WITH HIGH-PRECISION DIGITAL VARIABLE TYPEFACES AND PERPETUAL COMMERCIAL LICENSING.
              </p>
              <div className="flex flex-wrap gap-3">
                <a href="https://www.facebook.com/profile.php?id=61580779565120" target="_blank" rel="noreferrer" title="Facebook Profile" className="neu-btn-circle text-purple-400 hover:text-white">
                  <FacebookIcon size={18} />
                </a>
                <a href="https://wa.me/8801342900364" target="_blank" rel="noreferrer" title="WhatsApp: +8801342900364" className="neu-btn-circle text-purple-400 hover:text-white">
                  <WhatsappIcon size={18} />
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
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white">RESOURCES</p>
              <div className="flex flex-col gap-3">
                <Link to="/docs" className="text-xs font-bold text-slate-400 hover:text-white transition-colors uppercase tracking-wider w-fit">
                  DOCUMENTATION
                </Link>
                <Link to="/tos" className="text-xs font-bold text-purple-400 hover:text-purple-300 transition-colors uppercase tracking-wider w-fit">
                  TERMS OF SERVICE & EULA
                </Link>
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
          </div>
        </div>
      </footer>

      {/* Mobile Floating Bottom Dock */}
      <div className="md:hidden fixed bottom-4 inset-x-4 z-40">
        <div className="liquid-glass px-4 py-2.5 rounded-3xl border border-white/20 shadow-[0_15px_40px_rgba(0,0,0,0.9),_0_0_20px_rgba(139,92,246,0.2)] backdrop-blur-2xl flex items-center justify-between">
          <Link to="/" className="flex flex-col items-center gap-1 text-slate-400 hover:text-white p-1.5 transition-colors">
            <Home size={18} />
            <span className="text-[8px] font-black uppercase tracking-wider">Home</span>
          </Link>
          <Link to="/shop" className="flex flex-col items-center gap-1 text-slate-400 hover:text-white p-1.5 transition-colors">
            <ShoppingBag size={18} />
            <span className="text-[8px] font-black uppercase tracking-wider">Fonts</span>
          </Link>
          <Link to="/buyer" className="flex flex-col items-center gap-1 text-slate-400 hover:text-white p-1.5 transition-colors">
            <LayoutDashboard size={18} />
            <span className="text-[8px] font-black uppercase tracking-wider">Vault</span>
          </Link>
          <Link to="/tos" className="flex flex-col items-center gap-1 text-purple-400 p-1.5">
            <FileText size={18} />
            <span className="text-[8px] font-black uppercase tracking-wider">EULA</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TOS;
