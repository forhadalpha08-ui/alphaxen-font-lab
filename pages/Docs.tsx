import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft, BookOpen, Code, Globe, Shield, Sparkles, Terminal,
  Type, Copy, Check, ExternalLink, Cpu, Layers, FileCode2, CheckCircle2,
  Download, ShoppingBag, LayoutDashboard, Key, Home, Menu, X, ShieldCheck
} from 'lucide-react';
import BrandMark from '../components/BrandMark';
import { FONT_CATALOG } from '../services/fontData';
import FontSecurityModal from '../components/FontSecurityModal';

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

export const Docs: React.FC = () => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showSecurityModal, setShowSecurityModal] = useState(false);

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0b0e17] text-slate-100 selection:bg-purple-500/30 font-sans overflow-x-hidden">
      
      {/* Top Sticky High-Definition Header */}
      <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${isMenuOpen ? 'bg-[#0b0e17]/98 backdrop-blur-xl border-b border-white/10' : 'bg-transparent max-md:border-transparent max-md:shadow-none md:bg-[#0b0e17]/98 md:backdrop-blur-xl md:border-b md:border-white/10 md:shadow-2xl'}`}>
        <div className="max-w-7xl mx-auto px-6 sm:px-12 py-3.5 flex justify-between items-center">
          <BrandMark suffix="DOCS & CDN" />
          
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
            <Link to="/buyer" className="neu-btn-primary px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-white shadow-lg">
              BUYER VAULT
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
              to="/tos" 
              className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-black/60 border border-white/10 text-xs font-black uppercase tracking-wider text-slate-200 hover:text-white"
              onClick={() => setIsMenuOpen(false)}
            >
              <ShieldCheck size={16} className="text-purple-400" />
              <span>Terms of Service &amp; EULA</span>
            </Link>
          </div>
        )}
      </header>

      {/* Main Container */}
      <div className="max-w-6xl mx-auto px-6 sm:px-12 pt-8 pb-24 space-y-12 animate-slide-up">
        
        {/* Header Hero */}
        <div className="space-y-4">
          <Link to="/" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-purple-400 hover:text-white transition-colors">
            <ArrowLeft size={14} /> BACK TO HOME
          </Link>
          <div className="inline-flex items-center gap-3 py-1.5 px-5 rounded-full liquid-glass-sm text-[9px] font-black uppercase tracking-[0.3em] text-purple-300">
            <span className="flex h-1.5 w-1.5 rounded-full bg-purple-400 animate-pulse shadow-[0_0_8px_rgba(139,92,246,1)]" />
            DOCUMENTATION & INTEGRATION MANUAL
          </div>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tight text-white font-grotesk leading-none">
            WEBFONT & API <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-300 to-sky-400">
              INTEGRATION.
            </span>
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm font-semibold uppercase tracking-wider max-w-2xl leading-relaxed">
            INTEGRATE ALPHAXEN TYPEFACES ACROSS NEXT.JS, TAILWIND CSS, VANILLA HTML/CSS, REACT, AND FIGMA DESIGN SYSTEMS.
          </p>
        </div>

        {/* SECTION 1: GLOBAL CSS @FONT-FACE */}
        <section className="liquid-glass p-8 sm:p-10 rounded-[2.5rem] shadow-2xl space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl neu-btn text-purple-400 flex items-center justify-center shadow-lg">
                <Globe size={22} />
              </div>
              <div>
                <span className="text-[9px] font-mono font-bold text-purple-400 uppercase tracking-widest">METHOD 1</span>
                <h2 className="text-2xl font-black uppercase tracking-tight text-white font-grotesk">GLOBAL HTML & CSS EMBED</h2>
              </div>
            </div>
            <button
              onClick={() => copyCode(`<link rel="stylesheet" href="/fonts/fonts.css" />`, 'html-link')}
              className="neu-btn px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-200 hover:text-white flex items-center gap-1.5"
            >
              {copiedKey === 'html-link' ? <Check size={12} className="text-purple-400" /> : <Copy size={12} />}
              <span>{copiedKey === 'html-link' ? 'COPIED' : 'COPY'}</span>
            </button>
          </div>

          <p className="text-slate-300 text-xs leading-relaxed font-medium">
            Link the compiled Alphaxen <code className="text-purple-300 font-mono bg-white/5 px-2 py-0.5 rounded">/fonts/fonts.css</code> bundle in your <code className="text-purple-300 font-mono bg-white/5 px-2 py-0.5 rounded">&lt;head&gt;</code> to access all 6 authentic font families locally and in production.
          </p>

          <div className="liquid-glass-inset p-5 rounded-2xl font-mono text-xs text-purple-300 overflow-x-auto">
            <code>
              &lt;!-- Include in HTML &lt;head&gt; --&gt;<br />
              &lt;link rel="stylesheet" href="/fonts/fonts.css" /&gt;
            </code>
          </div>
        </section>

        {/* SECTION 2: FONT CATALOG FAMILIES */}
        <section className="liquid-glass p-8 sm:p-10 rounded-[2.5rem] shadow-2xl space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl neu-btn text-purple-400 flex items-center justify-center shadow-lg">
              <Type size={22} />
            </div>
            <div>
              <span className="text-[9px] font-mono font-bold text-purple-400 uppercase tracking-widest">AVAILABLE FAMILIES</span>
              <h2 className="text-2xl font-black uppercase tracking-tight text-white font-grotesk">FONT-FAMILY DECLARATIONS</h2>
            </div>
          </div>

          <p className="text-slate-300 text-xs leading-relaxed font-medium">
            Use these font family names directly in your CSS or Tailwind stylesheet:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {FONT_CATALOG.map((font) => (
              <div key={font.id} className="liquid-glass-inset p-5 rounded-2xl space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-black text-white font-grotesk uppercase">{font.name}</span>
                  <span className="text-[9px] font-mono text-purple-400 uppercase">{font.category}</span>
                </div>
                <div className="font-mono text-[11px] text-purple-300 bg-black/40 p-2.5 rounded-xl flex items-center justify-between">
                  <code>font-family: '{font.name}', {font.category === 'serif' ? 'serif' : 'sans-serif'};</code>
                  <button
                    onClick={() => copyCode(`font-family: '${font.name}', ${font.category === 'serif' ? 'serif' : 'sans-serif'};`, font.id)}
                    className="ml-2 text-slate-400 hover:text-white"
                  >
                    {copiedKey === font.id ? <Check size={12} className="text-purple-400" /> : <Copy size={12} />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 3: TAILWIND CSS CONFIGURATION */}
        <section className="liquid-glass p-8 sm:p-10 rounded-[2.5rem] shadow-2xl space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl neu-btn text-purple-400 flex items-center justify-center shadow-lg">
                <FileCode2 size={22} />
              </div>
              <div>
                <span className="text-[9px] font-mono font-bold text-purple-400 uppercase tracking-widest">METHOD 2</span>
                <h2 className="text-2xl font-black uppercase tracking-tight text-white font-grotesk">TAILWIND CSS EXTENSION</h2>
              </div>
            </div>
            <button
              onClick={() => copyCode(`// tailwind.config.js\nmodule.exports = {\n  theme: {\n    extend: {\n      fontFamily: {\n        martel: ["'Abdullah Martel'", "serif"],\n        metallic: ["'Abdullah Metallic Chrome'", "sans-serif"],\n        molten: ["'Abdullah Molten Chrome'", "sans-serif"],\n        moon: ["'Abdullah Moon Chrome'", "sans-serif"],\n        stone: ["'Abdullah Stone Chrome'", "sans-serif"],\n        stonemoon: ["'Abdullah Stone Moon'", "sans-serif"]\n      }\n    }\n  }\n};`, 'tailwind-config')}
              className="neu-btn px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-200 hover:text-white flex items-center gap-1.5"
            >
              {copiedKey === 'tailwind-config' ? <Check size={12} className="text-purple-400" /> : <Copy size={12} />}
              <span>{copiedKey === 'tailwind-config' ? 'COPIED' : 'COPY CONFIG'}</span>
            </button>
          </div>

          <div className="liquid-glass-inset p-5 rounded-2xl font-mono text-xs text-purple-300 overflow-x-auto">
            <pre>
{`// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        martel: ["'Abdullah Martel'", "serif"],
        metallic: ["'Abdullah Metallic Chrome'", "sans-serif"],
        molten: ["'Abdullah Molten Chrome'", "sans-serif"],
        moon: ["'Abdullah Moon Chrome'", "sans-serif"],
        stone: ["'Abdullah Stone Chrome'", "sans-serif"],
        stonemoon: ["'Abdullah Stone Moon'", "sans-serif"]
      }
    }
  }
};`}
            </pre>
          </div>
        </section>

        {/* SECTION 4: PERPETUAL EULA RIGHTS & COMPLIANCE */}
        <section className="liquid-glass p-8 sm:p-10 rounded-[2.5rem] shadow-2xl space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl neu-btn text-purple-400 flex items-center justify-center shadow-lg">
              <Shield size={22} />
            </div>
            <div>
              <span className="text-[9px] font-mono font-bold text-purple-400 uppercase tracking-widest">LEGAL &amp; LICENSING</span>
              <h2 className="text-2xl font-black uppercase tracking-tight text-white font-grotesk">COMMERCIAL LICENSE RULES</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="liquid-glass-inset p-5 rounded-2xl space-y-2">
              <span className="text-xs font-black uppercase tracking-wider text-purple-400 block">PERSONAL</span>
              <p className="text-[11px] text-slate-300 leading-relaxed font-medium">
                Permitted for non-commercial student portfolios, local prototypes, and personal design explorations.
              </p>
            </div>
            <div className="liquid-glass-inset p-5 rounded-2xl space-y-2">
              <span className="text-xs font-black uppercase tracking-wider text-purple-400 block">COMMERCIAL</span>
              <p className="text-[11px] text-slate-300 leading-relaxed font-medium">
                Perpetual license for client branding, websites, web apps, SaaS UI, and up to 500,000 monthly pageviews.
              </p>
            </div>
            <div className="liquid-glass-inset p-5 rounded-2xl space-y-2">
              <span className="text-xs font-black uppercase tracking-wider text-purple-400 block">EXTENDED / ENTERPRISE</span>
              <p className="text-[11px] text-slate-300 leading-relaxed font-medium">
                Unlimited pageviews, broadcast TV, video games, native iOS/Android packaging, and global multi-seat distribution.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 5: ADVANCED CRYPTOGRAPHIC ASSET SECURITY & ORIGIN DRM */}
        <section className="liquid-glass p-8 sm:p-10 rounded-[2.5rem] shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl neu-btn text-purple-400 flex items-center justify-center shadow-lg">
                <ShieldCheck size={22} />
              </div>
              <div>
                <span className="text-[9px] font-mono font-bold text-purple-400 uppercase tracking-widest">ADVANCED CRYPTOGRAPHY</span>
                <h2 className="text-2xl font-black uppercase tracking-tight text-white font-grotesk">FONT ASSET SECURITY &amp; DRM</h2>
              </div>
            </div>
            <button
              onClick={() => setShowSecurityModal(true)}
              className="neu-btn px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-purple-300 hover:text-white flex items-center gap-1.5 cursor-pointer border border-purple-500/40"
            >
              <ShieldCheck size={14} className="text-purple-400" />
              <span>LAUNCH DRM INSPECTOR</span>
            </button>
          </div>

          <p className="text-slate-300 text-xs leading-relaxed font-medium">
            Alphaxen implements multi-layer cryptographic font protection to secure creator intellectual property and prevent unauthorized font extraction or redistribution:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="liquid-glass-inset p-5 rounded-2xl space-y-2">
              <span className="text-xs font-black uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
                <Cpu size={14} /> 1. BINARY OPEN-TYPE WATERMARKING
              </span>
              <p className="text-[11px] text-slate-300 leading-relaxed font-medium">
                Every compiled OpenType binary is dynamically stamped with cryptographic licensee records in table record 0x000D. Any pirated font file can be traced back to its unique license key and transaction timestamp.
              </p>
            </div>

            <div className="liquid-glass-inset p-5 rounded-2xl space-y-2">
              <span className="text-xs font-black uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
                <Globe size={14} /> 2. ORIGIN DOMAIN RESTRICTIONS &amp; CORS
              </span>
              <p className="text-[11px] text-slate-300 leading-relaxed font-medium">
                Alphaxen Webfont CDN endpoints strictly enforce HTTP Origin headers. Webfont packages will not render when served from non-whitelisted competitor domains.
              </p>
            </div>

            <div className="liquid-glass-inset p-5 rounded-2xl space-y-2">
              <span className="text-xs font-black uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
                <Shield size={14} /> 3. SUB-RESOURCE INTEGRITY (SRI) HASHING
              </span>
              <p className="text-[11px] text-slate-300 leading-relaxed font-medium">
                All CDN stylesheet embeds support SHA-384 cryptographic digests (`integrity="sha384-..."`) guaranteeing zero man-in-the-middle font tampering.
              </p>
            </div>

            <div className="liquid-glass-inset p-5 rounded-2xl space-y-2">
              <span className="text-xs font-black uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
                <Key size={14} /> 4. SHA-256 EULA LICENSE SEALS
              </span>
              <p className="text-[11px] text-slate-300 leading-relaxed font-medium">
                Purchased commercial licenses include deterministic SHA-256 validation signatures accepted by legal audit departments and enterprise compliance teams.
              </p>
            </div>
          </div>

          <div className="liquid-glass-inset p-5 rounded-2xl space-y-3 font-mono text-xs">
            <div className="text-[10px] font-black uppercase tracking-widest text-slate-300">SECURE SRI WEBFONT EMBED EXAMPLE</div>
            <code className="text-purple-300 block overflow-x-auto whitespace-pre">
{`<link
  rel="stylesheet"
  href="https://cdn.alphaxen.com/v1/fonts.css?license=AX-COMM-8921-9482-XN"
  integrity="sha384-ax9f8b2c4d6e1a0f8b3c5d7e9a1b3c5d7e9a1b3c5d7e9a1b3c5d7e9a1b3c5d7e"
  crossorigin="anonymous"
/>`}
            </code>
          </div>
        </section>

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
                <Link to="/docs" className="text-xs font-bold text-purple-400 hover:text-purple-300 transition-colors uppercase tracking-wider w-fit">
                  DOCUMENTATION
                </Link>
                <Link to="/tos" className="text-xs font-bold text-slate-400 hover:text-white transition-colors uppercase tracking-wider w-fit">
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
          <Link to="/docs" className="flex flex-col items-center gap-1 text-purple-400 p-1.5">
            <BookOpen size={18} />
            <span className="text-[8px] font-black uppercase tracking-wider">Docs</span>
          </Link>
        </div>
      </div>
      {/* Cryptographic Font Security & DRM Inspector Modal */}
      <FontSecurityModal
        isOpen={showSecurityModal}
        onClose={() => setShowSecurityModal(false)}
        defaultKey="AX-COMM-8921-9482-XN"
      />
    </div>
  );
};

export default Docs;
