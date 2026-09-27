import React, { useState } from 'react';
import {
  ShieldCheck, ShieldAlert, Key, Globe, Lock, CheckCircle2,
  Copy, Check, Download, AlertTriangle, ExternalLink, RefreshCw, X, FileCode2, Terminal
} from 'lucide-react';
import { verifyFontLicense, LicenseVerificationResult, exportLicenseManifest, generateSRIHash } from '../services/fontSecurity';

interface FontSecurityModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultKey?: string;
}

export const FontSecurityModal: React.FC<FontSecurityModalProps> = ({
  isOpen,
  onClose,
  defaultKey = 'AX-COMM-8921-9482-XN'
}) => {
  const [inputKey, setInputKey] = useState(defaultKey);
  const [verifying, setVerifying] = useState(false);
  const [result, setResult] = useState<LicenseVerificationResult | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const handleVerify = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputKey.trim()) return;

    setVerifying(true);
    const res = await verifyFontLicense(inputKey);
    setTimeout(() => {
      setResult(res);
      setVerifying(false);
    }, 400);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-2xl flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="bg-[#0b101d] border border-white/20 p-6 sm:p-10 rounded-[2.5rem] max-w-3xl w-full shadow-[0_25px_70px_rgba(0,0,0,0.95),_0_0_30px_rgba(6,182,212,0.2)] space-y-6 relative animate-slide-up my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 py-1 px-4 rounded-full bg-cyan-500/10 border border-cyan-500/40 text-[10px] font-black uppercase tracking-[0.25em] text-cyan-300">
            <ShieldCheck size={14} className="text-cyan-400" />
            <span>ALPHAXEN CRYPTOGRAPHIC FONT DRM V2.0</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white font-grotesk">
            FONT LICENSE &amp; ASSET SECURITY INSPECTOR
          </h2>
          <p className="text-slate-200 text-xs sm:text-sm leading-relaxed font-medium">
            Verify SHA-256 digital license signatures, test domain CORS whitelist DRM, check sub-resource integrity (SRI), and export legal audit certificates.
          </p>
        </div>

        {/* Verification Form */}
        <form onSubmit={handleVerify} className="space-y-3">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-200 flex justify-between">
            <span>ENTER LICENSE KEY OR DRM HASH</span>
            <span className="text-cyan-300 font-bold">FORMAT: AX-[TIER]-[BLOCK1]-[BLOCK2]-[SIG]</span>
          </label>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Key size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400" />
              <input
                type="text"
                required
                value={inputKey}
                onChange={(e) => setInputKey(e.target.value)}
                placeholder="e.g. AX-COMM-8921-9482-XN"
                className="w-full bg-[#050814] border border-white/20 rounded-2xl pl-11 pr-4 py-3.5 text-xs text-white placeholder-slate-400 font-mono font-bold uppercase tracking-wider focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
              />
            </div>
            <button
              type="submit"
              disabled={verifying}
              className="neu-btn-cyan px-6 sm:px-8 rounded-2xl font-black text-[10px] uppercase tracking-widest text-white shadow-lg flex items-center gap-2 cursor-pointer hover:scale-105 transition-all shrink-0"
            >
              {verifying ? <RefreshCw size={14} className="animate-spin" /> : <ShieldCheck size={14} />}
              <span>VERIFY DRM</span>
            </button>
          </div>
        </form>

        {/* Verification Results Panel */}
        {result && (
          <div className="bg-[#050814] border border-white/15 p-6 rounded-3xl space-y-5 animate-fade-in">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                  result.isValid ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                }`}>
                  {result.isValid ? <CheckCircle2 size={22} /> : <AlertTriangle size={22} />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black uppercase text-white font-grotesk">{result.fontName}</span>
                    <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full font-bold uppercase ${
                      result.isValid ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    }`}>
                      {result.drmStatus}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-300 font-mono">
                    ISSUED TO: <strong className="text-white font-sans">{result.licensee}</strong> ({result.tier} License)
                  </div>
                </div>
              </div>

              {result.isValid && (
                <button
                  onClick={() => exportLicenseManifest(result)}
                  className="neu-btn px-3.5 py-2 rounded-xl text-[9px] font-black uppercase tracking-wider text-slate-100 hover:text-white flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Download size={12} className="text-cyan-400" />
                  <span>EXPORT .JSON SEAL</span>
                </button>
              )}
            </div>

            {/* Grid of Security Properties */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              <div className="bg-[#0c101d] border border-white/10 p-3.5 rounded-xl space-y-1">
                <div className="text-[9px] text-slate-400 uppercase font-bold">CRYPTOGRAPHIC SHA-256 SEAL</div>
                <div className="text-cyan-300 font-bold truncate flex items-center justify-between">
                  <span>{result.cryptographicHash}</span>
                  <button onClick={() => copyToClipboard(result.cryptographicHash, 'hash')} className="text-slate-400 hover:text-white">
                    {copied === 'hash' ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                  </button>
                </div>
              </div>

              <div className="bg-[#0c101d] border border-white/10 p-3.5 rounded-xl space-y-1">
                <div className="text-[9px] text-slate-400 uppercase font-bold">AUTHORIZED DOMAINS (CORS DRM)</div>
                <div className="text-emerald-400 font-bold truncate">
                  {result.allowedDomains.join(', ')}
                </div>
              </div>

              <div className="bg-[#0c101d] border border-white/10 p-3.5 rounded-xl space-y-1">
                <div className="text-[9px] text-slate-400 uppercase font-bold">MONTHLY PAGEVIEW CEILING</div>
                <div className="text-purple-300 font-bold">
                  {result.maxPageviews}
                </div>
              </div>

              <div className="bg-[#0c101d] border border-white/10 p-3.5 rounded-xl space-y-1">
                <div className="text-[9px] text-slate-400 uppercase font-bold">SUB-RESOURCE INTEGRITY (SRI)</div>
                <div className="text-slate-300 font-bold truncate flex items-center justify-between">
                  <span>{generateSRIHash(result.licenseKey)}</span>
                  <button onClick={() => copyToClipboard(generateSRIHash(result.licenseKey), 'sri')} className="text-slate-400 hover:text-white">
                    {copied === 'sri' ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                  </button>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-slate-300 leading-relaxed font-sans bg-[#0c101d] border border-white/10 p-3.5 rounded-xl">
              <strong className="text-cyan-300">Security Audit:</strong> {result.notes}
            </p>
          </div>
        )}

        {/* 3 Pillars of Advance Font Security */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="bg-[#050814] border border-white/15 p-4 rounded-2xl space-y-2">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
              <Lock size={16} />
            </div>
            <h4 className="text-xs font-black uppercase text-white font-grotesk">1. Binary Watermarking</h4>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Every compiled OTF/TTF download is invisibly tagged with the licensee's cryptographic identity, preventing illicit torrent redistributions.
            </p>
          </div>

          <div className="bg-[#050814] border border-white/15 p-4 rounded-2xl space-y-2">
            <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
              <Globe size={16} />
            </div>
            <h4 className="text-xs font-black uppercase text-white font-grotesk">2. Origin DRM &amp; CORS</h4>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Global CDN edge servers inspect HTTP `Sec-Fetch-Site` and origin domains, refusing font delivery to unauthorized non-whitelisted websites.
            </p>
          </div>

          <div className="bg-[#050814] border border-white/15 p-4 rounded-2xl space-y-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              <ShieldCheck size={16} />
            </div>
            <h4 className="text-xs font-black uppercase text-white font-grotesk">3. Perpetual EULA DRM</h4>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Perpetual irrevocable commercial rights verified on-chain and locally, granting immunity from subscription price hikes or retroactive licensing fees.
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="neu-btn-primary px-8 h-12 rounded-xl text-white font-black uppercase tracking-widest text-[10px] cursor-pointer hover:scale-102"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};

export default FontSecurityModal;
