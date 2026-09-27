import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag, Layers, Key, Download, Globe, HardDrive,
  ShieldCheck, FileText, Plus, Search, CheckCircle2,
  Copy, Check, Sparkles, DollarSign, TrendingUp, BarChart3,
  Trash2, Eye, ArrowUpRight, LogOut, Settings, Type, LayoutDashboard
} from 'lucide-react';
import { onAuthStateChanged, signOut, User as FirebaseUser } from 'firebase/auth';
import { auth } from '../services/firebase';
import BrandMark from '../components/BrandMark';
import { FONT_CATALOG, FontItem, PurchasedFontLicense, SellerFontSubmission } from '../services/fontData';
import FontTesterStudio from '../components/FontTesterStudio';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'buyer-vault' | 'seller-studio' | 'type-studio' | 'licenses' | 'invoices'>('buyer-vault');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // User State
  const [authUser, setAuthUser] = useState<FirebaseUser | null>(null);
  const [userEmail, setUserEmail] = useState<string>('studio@novalabs.design');

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (u && u.email) {
        setAuthUser(u);
        setUserEmail(u.email.toLowerCase());
      }
    });
    const stored = localStorage.getItem('alphaxen_user_email');
    if (stored) setUserEmail(stored.toLowerCase());
    return () => unsub();
  }, []);

  const handleSignOut = async () => {
    localStorage.removeItem('alphaxen_user_email');
    localStorage.removeItem('alphaxen_user_signed_in');
    try {
      await signOut(auth);
    } catch (e) {}
    setAuthUser(null);
    navigate('/');
  };

  // Buyer Licenses
  const [buyerLicenses, setBuyerLicenses] = useState<PurchasedFontLicense[]>(() => {
    const saved = localStorage.getItem('alphaxen_buyer_licenses');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return [
      {
        licenseKey: 'AX-COMM-8921-9482-XN',
        fontId: 'alphaxen-grotesk',
        fontName: 'Alphaxen Grotesk (18 Styles + Variable)',
        tier: 'Commercial',
        purchaseDate: '2026-03-15',
        registeredTo: 'Studio Nova Labs Inc.',
        allowedDomains: ['novalabs.design', 'app.novalabs.design', 'localhost'],
        maxPageviews: '500,000 / month',
        pricePaid: 59,
        status: 'active',
        downloadFormats: ['OTF', 'TTF', 'WOFF', 'WOFF2', 'Variable GX']
      },
      {
        licenseKey: 'AX-COMM-4412-1088-XN',
        fontId: 'xenon-display',
        fontName: 'Xenon Display Variable (12 Styles)',
        tier: 'Commercial',
        purchaseDate: '2026-03-20',
        registeredTo: 'Studio Nova Labs Inc.',
        allowedDomains: ['novalabs.design'],
        maxPageviews: '500,000 / month',
        pricePaid: 69,
        status: 'active',
        downloadFormats: ['OTF', 'TTF', 'WOFF2', 'Variable GX']
      },
      {
        licenseKey: 'AX-EXTD-1029-7734-XN',
        fontId: 'aethelgard-serif',
        fontName: 'Aethelgard Haute Serif (14 Styles)',
        tier: 'Extended',
        purchaseDate: '2026-03-24',
        registeredTo: 'Studio Nova Labs Inc.',
        allowedDomains: ['*'],
        maxPageviews: 'Unlimited',
        pricePaid: 155,
        status: 'active',
        downloadFormats: ['OTF', 'TTF', 'WOFF', 'WOFF2']
      }
    ];
  });

  // Seller Fonts
  const [sellerFonts] = useState<SellerFontSubmission[]>([
    {
      id: 'seller-font-1',
      fontName: 'Alphaxen Grotesk Pro',
      category: 'sans-serif',
      stylesCount: 18,
      designerName: 'Axen Design Lab',
      description: 'Neo-grotesk with deep ink traps and variable weight axis.',
      commercialPrice: 59,
      personalPrice: 29,
      submissionDate: '2026-01-10',
      status: 'active',
      salesCount: 312,
      grossRevenue: 18408
    },
    {
      id: 'seller-font-2',
      fontName: 'Xenon Display Variable',
      category: 'display',
      stylesCount: 12,
      designerName: 'Axen Design Lab',
      description: 'Avant-garde fashion display titling typeface.',
      commercialPrice: 69,
      personalPrice: 35,
      submissionDate: '2026-02-14',
      status: 'active',
      salesCount: 186,
      grossRevenue: 12834
    }
  ]);

  const copyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleDownloadFont = (fontName: string, format: string) => {
    const dummyData = `/* Alphaxen Type Foundry - ${fontName} (${format}) - Licensed Package */`;
    const blob = new Blob([dummyData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fontName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${format.toLowerCase()}.zip`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const filteredBuyerLicenses = buyerLicenses.filter(lic =>
    lic.fontName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lic.licenseKey.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#070a13] text-slate-100 selection:bg-indigo-500/30 selection:text-indigo-100 font-sans overflow-x-hidden">
      
      {/* Floating Liquid-Glass Navigation */}
      <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4">
        <nav className="w-full max-w-6xl liquid-glass py-3.5 px-8 rounded-full shadow-2xl">
          <div className="flex justify-between items-center">
            <BrandMark suffix="CENTRAL CONTROL" />

            <div className="hidden md:flex items-center gap-3">
              <Link to="/" className="neu-btn px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 hover:text-white">
                HOME
              </Link>
              <Link to="/shop" className="neu-btn px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 hover:text-white">
                FONT CATALOG
              </Link>

              <div className="h-4 w-px bg-white/15 mx-1" />

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-slate-300 font-mono hidden lg:inline-block px-3 py-1.5 liquid-glass-inset rounded-xl">
                  {userEmail}
                </span>
                <button
                  onClick={handleSignOut}
                  className="neu-btn px-3 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-rose-400 hover:text-rose-300"
                  title="Sign Out"
                >
                  <LogOut size={13} />
                </button>
              </div>
            </div>
          </div>
        </nav>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-6 sm:px-12 pt-36 pb-24">
        
        {/* Welcome Header */}
        <div className="liquid-glass p-10 md:p-14 rounded-[2.5rem] mb-12 shadow-2xl space-y-6 relative overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="space-y-4 max-w-2xl">
              <div className="inline-flex items-center gap-3 py-1.5 px-5 rounded-full liquid-glass-sm text-[9px] font-black uppercase tracking-[0.3em] text-cyan-300">
                <span className="flex h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(6,182,212,1)]" />
                CENTRAL TYPOGRAPHY DASHBOARD
              </div>
              <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-white font-grotesk">
                ALPHAXEN <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400">
                  MANAGEMENT HUB.
                </span>
              </h1>
              <p className="text-slate-300 text-xs sm:text-sm font-medium leading-relaxed">
                Direct access to your perpetual commercial licenses, compiled font kits (WOFF2/OTF), Webfont CDN credentials, and creator foundry analytics.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 liquid-glass-inset p-6 rounded-3xl">
              <div className="text-center px-4 border-r border-white/10">
                <div className="text-3xl font-black text-white font-mono">{buyerLicenses.length}</div>
                <div className="text-[9px] text-slate-400 uppercase font-bold tracking-widest mt-1">OWNED FONTS</div>
              </div>
              <div className="text-center px-4 border-r border-white/10">
                <div className="text-3xl font-black text-cyan-400 font-mono">44</div>
                <div className="text-[9px] text-slate-400 uppercase font-bold tracking-widest mt-1">TOTAL STYLES</div>
              </div>
              <div className="text-center px-4">
                <div className="text-3xl font-black text-purple-400 font-mono">85%</div>
                <div className="text-[9px] text-slate-400 uppercase font-bold tracking-widest mt-1">CREATOR SHARE</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-3 border-b border-white/10 pb-6 mb-12 overflow-x-auto custom-scrollbar">
          {[
            { id: 'buyer-vault', label: 'PURCHASED FONTS', icon: <HardDrive size={14} />, count: buyerLicenses.length },
            { id: 'seller-studio', label: 'SELLER STUDIO', icon: <Layers size={14} /> },
            { id: 'type-studio', label: 'LIVE TYPE TESTER', icon: <Type size={14} /> },
            { id: 'licenses', label: 'COMMERCIAL CERTIFICATES', icon: <Key size={14} /> },
            { id: 'invoices', label: 'INVOICES & RECEIPTS', icon: <FileText size={14} /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-5 py-3 rounded-2xl text-[9px] font-black uppercase tracking-[0.25em] transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                activeTab === tab.id
                  ? 'neu-btn-primary text-white shadow-lg'
                  : 'neu-btn text-slate-400 hover:text-white'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className={`px-2 py-0.5 rounded-full text-[8px] font-mono font-black ${
                  activeTab === tab.id ? 'bg-black/40 text-white' : 'bg-white/10 text-slate-300'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* TAB 1: BUYER VAULT */}
        {activeTab === 'buyer-vault' && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  placeholder="SEARCH YOUR FONT LIBRARY..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full liquid-glass-inset rounded-2xl pl-11 pr-4 py-3.5 text-xs text-white placeholder-slate-500 font-bold uppercase tracking-wider focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex items-center gap-3">
                <Link
                  to="/shop"
                  className="neu-btn px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-200 hover:text-white"
                >
                  <Plus size={13} className="inline mr-1" /> BROWSE MORE FONTS
                </Link>
                <button
                  onClick={() => handleDownloadFont('Alphaxen-Complete-Library', 'ALL_FONTS_ZIP')}
                  className="neu-btn-cyan h-12 px-6 rounded-xl font-black text-[10px] uppercase tracking-widest text-white shadow-lg flex items-center gap-2"
                >
                  <Download size={14} /> DOWNLOAD ALL (.ZIP)
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredBuyerLicenses.map((license) => {
                const fontDetails = FONT_CATALOG.find(f => f.id === license.fontId);
                return (
                  <div
                    key={license.licenseKey}
                    className="liquid-glass-interactive p-8 rounded-[2.5rem] flex flex-col justify-between space-y-6"
                  >
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-[9px] font-mono font-bold text-cyan-400 uppercase tracking-widest">
                            {license.tier} LICENSE
                          </span>
                          <h3 className="text-2xl font-black uppercase tracking-tight text-white mt-1 font-grotesk">
                            {license.fontName}
                          </h3>
                        </div>
                        <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          <CheckCircle2 size={16} />
                        </span>
                      </div>

                      <div className="liquid-glass-inset p-5 rounded-2xl space-y-2">
                        <div
                          style={{
                            fontFamily: fontDetails?.fontFamily || 'sans-serif',
                            fontSize: '24px',
                            lineHeight: 1.2
                          }}
                          className="text-white truncate"
                        >
                          {fontDetails?.name || license.fontName}
                        </div>
                        <div className="text-[9px] font-mono text-slate-400 uppercase tracking-wider flex items-center justify-between">
                          <span>PURCHASED: {license.purchaseDate}</span>
                          <span>{license.downloadFormats.join(' • ')}</span>
                        </div>
                      </div>

                      <div className="space-y-1 text-[10px] font-mono text-slate-300 uppercase tracking-wider">
                        <div className="flex justify-between">
                          <span>KEY:</span>
                          <span className="text-cyan-400 font-bold">{license.licenseKey}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>ENTITY:</span>
                          <span className="text-white">{license.registeredTo}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-white/10 space-y-2">
                      <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest">
                        DOWNLOAD FORMATS:
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {license.downloadFormats.map((fmt) => (
                          <button
                            key={fmt}
                            onClick={() => handleDownloadFont(license.fontName, fmt)}
                            className="neu-btn py-2 px-2 rounded-xl text-[9px] font-black uppercase tracking-wider text-slate-200 hover:text-white flex items-center justify-center gap-1 transition-all cursor-pointer"
                          >
                            <Download size={10} className="text-cyan-400" />
                            <span>{fmt}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: SELLER STUDIO */}
        {activeTab === 'seller-studio' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="liquid-glass-interactive p-8 rounded-[2rem] space-y-2">
                <span className="text-[10px] text-purple-400 font-bold uppercase tracking-wider">TOTAL CREATOR ROYALTIES</span>
                <div className="text-3xl font-black text-white font-mono">$26,555.70</div>
                <div className="text-xs text-slate-400">85% creator payout rate</div>
              </div>
              <div className="liquid-glass-interactive p-8 rounded-[2rem] space-y-2">
                <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">ACTIVE TYPEFACES</span>
                <div className="text-3xl font-black text-cyan-400 font-mono">{sellerFonts.length} Families</div>
                <div className="text-xs text-slate-400">Available on Alphaxen Marketplace</div>
              </div>
              <div className="liquid-glass-interactive p-8 rounded-[2rem] space-y-2">
                <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">TOTAL UNITS LICENSED</span>
                <div className="text-3xl font-black text-emerald-400 font-mono">498 Units</div>
                <div className="text-xs text-slate-400">Commercial & Enterprise tiers</div>
              </div>
            </div>

            <div className="liquid-glass p-8 rounded-[2.5rem] space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-black uppercase tracking-tight text-white font-grotesk">PUBLISHED TYPEFACES</h3>
                <Link
                  to="/seller"
                  className="neu-btn-primary px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-white"
                >
                  OPEN SELLER STUDIO
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {sellerFonts.map(font => (
                  <div key={font.id} className="liquid-glass-inset p-6 rounded-2xl space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[9px] font-mono text-purple-400 uppercase font-bold">{font.category}</span>
                        <h4 className="text-xl font-bold text-white font-grotesk">{font.fontName}</h4>
                      </div>
                      <span className="text-xs font-mono font-bold text-emerald-400">${font.grossRevenue.toLocaleString()}</span>
                    </div>
                    <p className="text-xs text-slate-400">{font.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: LIVE TYPE TESTER */}
        {activeTab === 'type-studio' && (
          <FontTesterStudio />
        )}

        {/* TAB 4: LICENSES */}
        {activeTab === 'licenses' && (
          <div className="liquid-glass p-10 rounded-[2.5rem] shadow-2xl space-y-6">
            <h3 className="text-2xl font-black uppercase tracking-tight text-white font-grotesk">COMMERCIAL LICENSE CERTIFICATES</h3>
            <div className="space-y-4">
              {buyerLicenses.map((lic) => (
                <div key={lic.licenseKey} className="liquid-glass-inset p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">{lic.fontName}</span>
                      <span className="text-[9px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-mono font-bold">{lic.tier}</span>
                    </div>
                    <div className="text-xs text-slate-400 font-mono">KEY: <strong className="text-cyan-400">{lic.licenseKey}</strong> • REGISTERED: {lic.registeredTo}</div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => copyText(lic.licenseKey, lic.licenseKey)}
                      className="neu-btn px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-200 hover:text-white flex items-center gap-1.5"
                    >
                      {copiedKey === lic.licenseKey ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                      <span>COPY KEY</span>
                    </button>
                    <button
                      onClick={() => handleDownloadFont(lic.fontName, 'CERTIFICATE_PDF')}
                      className="neu-btn-cyan px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest text-white flex items-center gap-1.5"
                    >
                      <FileText size={12} />
                      <span>PDF EULA</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: INVOICES */}
        {activeTab === 'invoices' && (
          <div className="liquid-glass p-10 rounded-[2.5rem] shadow-2xl space-y-6">
            <h3 className="text-2xl font-black uppercase tracking-tight text-white font-grotesk">BILLING & INVOICE RECORDS</h3>
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-white/10 text-slate-400 uppercase tracking-widest text-[9px] font-black font-sans">
                  <th className="pb-4">INVOICE #</th>
                  <th className="pb-4">TYPEFACE</th>
                  <th className="pb-4">TIER</th>
                  <th className="pb-4">DATE</th>
                  <th className="pb-4">AMOUNT</th>
                  <th className="pb-4 text-right font-sans">RECEIPT</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {buyerLicenses.map((lic, i) => (
                  <tr key={lic.licenseKey} className="hover:bg-white/[0.02]">
                    <td className="py-4 text-cyan-400 font-bold">INV-2026-00{i + 1}</td>
                    <td className="py-4 font-sans font-bold text-white">{lic.fontName}</td>
                    <td className="py-4 text-purple-300 uppercase">{lic.tier}</td>
                    <td className="py-4 text-slate-400">{lic.purchaseDate}</td>
                    <td className="py-4 font-bold text-white">${lic.pricePaid}.00</td>
                    <td className="py-4 text-right font-sans">
                      <button
                        onClick={() => handleDownloadFont(lic.fontName, `RECEIPT_INV_00${i + 1}`)}
                        className="neu-btn px-3 py-1.5 rounded-lg text-slate-200 text-[9px] font-black uppercase"
                      >
                        PDF
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
