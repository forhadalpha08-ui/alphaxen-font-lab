import React, { useState, useEffect } from 'react';
import { FONT_CATALOG, FontItem, getAssetUrl } from '../services/fontData';
import {
  Type, Copy, Check, RotateCcw,
  ShieldCheck, ArrowRight, Sparkles, Download, Layers, Eye
} from 'lucide-react';
import { soundFx } from '../services/soundFx';

interface FontTesterStudioProps {
  initialFontId?: string;
  onSelectLicense?: (font: FontItem) => void;
  onAddToCart?: (font: FontItem, tier?: string) => void;
}

const PRESET_PHRASES = [
  'MONUMENTAL HAUTE COUTURE',
  'THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG',
  'ALPHAXEN METALLIC SPECULAR CHROMATIC',
  'ABCDEFGHIJKLMNOPQRSTUVWXYZ 0123456789',
  '0123456789 &@$!#%*+='
];

// Pure Blue and Purple Theme mapping
const FONT_THEME_COLORS: Record<string, { primary: string; secondary: string; glow: string }> = {
  'abdullah-martel': { primary: '#38bdf8', secondary: '#818cf8', glow: 'rgba(56, 189, 248, 0.4)' },
  'abdullah-metallic-chrome': { primary: '#60a5fa', secondary: '#c084fc', glow: 'rgba(96, 165, 250, 0.4)' },
  'abdullah-molten-chrome': { primary: '#818cf8', secondary: '#a855f7', glow: 'rgba(129, 140, 248, 0.4)' },
  'abdullah-moon-chrome': { primary: '#c084fc', secondary: '#38bdf8', glow: 'rgba(192, 132, 252, 0.4)' },
  'abdullah-stone-chrome': { primary: '#38bdf8', secondary: '#a855f7', glow: 'rgba(56, 189, 248, 0.4)' },
  'abdullah-stone-moon': { primary: '#a855f7', secondary: '#60a5fa', glow: 'rgba(168, 85, 247, 0.4)' }
};

export const FontTesterStudio: React.FC<FontTesterStudioProps> = ({
  initialFontId,
  onSelectLicense
}) => {
  const [selectedFont, setSelectedFont] = useState<FontItem>(() => {
    return FONT_CATALOG.find(f => f.id === initialFontId) || FONT_CATALOG[0];
  });

  // Mode: 'texture' (3D Photorealistic Color Glyphs) vs 'vector' (Pure OTF/TTF Multi-Weight Outlines)
  const [renderMode, setRenderMode] = useState<'texture' | 'vector'>('texture');

  // Input text
  const [customText, setCustomText] = useState(selectedFont.sampleText || 'ALPHAXEN');

  // Sizing
  const [glyphSize, setGlyphSize] = useState(64);
  const [vectorFontSize, setVectorFontSize] = useState(52);

  // Vector weight & format
  const [vectorWeight, setVectorWeight] = useState<number>(400);
  const [formatMode, setFormatMode] = useState<'OTF' | 'TTF'>('OTF');

  // Glyph lookup map for 3D Photorealistic mode
  const [glyphMap, setGlyphMap] = useState<Record<string, string>>({});
  const [loadingGlyphs, setLoadingGlyphs] = useState(false);

  // UI state
  const [copied, setCopied] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const currentTheme = FONT_THEME_COLORS[selectedFont.id] || {
    primary: '#38bdf8',
    secondary: '#a855f7',
    glow: 'rgba(56, 189, 248, 0.4)'
  };

  // Load 3D glyph maps when font changes
  useEffect(() => {
    let isCancelled = false;
    setLoadingGlyphs(true);

    fetch(getAssetUrl(`/fonts_data/${selectedFont.id}.json`))
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((data: Record<string, string>) => {
        if (!isCancelled) {
          setGlyphMap(data);
          setLoadingGlyphs(false);
        }
      })
      .catch(err => {
        console.warn('Failed to load glyph data for', selectedFont.id, err);
        if (!isCancelled) {
          setLoadingGlyphs(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [selectedFont.id]);

  useEffect(() => {
    if (initialFontId) {
      const found = FONT_CATALOG.find(f => f.id === initialFontId);
      if (found) {
        setSelectedFont(found);
        setCustomText(found.sampleText || 'ALPHAXEN');
      }
    }
  }, [initialFontId]);

  const handleFontSelect = (font: FontItem) => {
    setSelectedFont(font);
    setCustomText(font.sampleText || 'ALPHAXEN');
    soundFx.play('tab');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(customText);
    setCopied(true);
    soundFx.play('success');
    setTimeout(() => setCopied(false), 1500);
  };

  const handleDirectDownload = (type: 'current' | 'zip') => {
    soundFx.play('purchase');
    const fontFolder = encodeURIComponent(selectedFont.name);
    let fileName = '';
    let downloadUrl = '';

    if (type === 'zip') {
      const cleanName = selectedFont.name.replace(/\s+/g, '');
      fileName = `${cleanName}-Font-Family.zip`;
      downloadUrl = getAssetUrl(`/fonts/${fontFolder}/${encodeURIComponent(fileName)}`);
    } else {
      const ext = formatMode.toLowerCase();
      const weightLabel = vectorWeight === 700 ? 'Bold' : vectorWeight === 600 ? 'SemiBold' : 'Regular';
      const cleanName = selectedFont.name.replace(/\s+/g, '');
      
      if (renderMode === 'texture') {
        fileName = `${cleanName}-Color.${ext}`;
      } else {
        fileName = `${cleanName}-${weightLabel}.${ext}`;
      }
      downloadUrl = getAssetUrl(`/fonts/${fontFolder}/${encodeURIComponent(fileName)}`);
    }

    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2200);
  };

  return (
    <div className="w-full bg-[#070914] border border-blue-500/20 rounded-[2rem] overflow-hidden shadow-2xl relative text-slate-200">
      
      {/* Top Pure Blue-to-Purple Cosmic Accent Bar */}
      <div 
        className="h-1.5 w-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 transition-all duration-300"
      />

      {/* 1. TYPEFACE SELECTOR BAR */}
      <div className="p-4 sm:p-6 bg-black/60 border-b border-blue-500/15">
        <div className="flex items-center justify-between mb-3 text-[10px] font-mono font-bold uppercase tracking-wider">
          <span className="flex items-center gap-1.5 text-cyan-400">
            <Sparkles size={12} className="text-purple-400" />
            <span>REAL OPEN-TYPE / TRUE-TYPE TYPEFACES:</span>
          </span>
          <span className="text-purple-300/80 hidden sm:inline font-mono">6 AUTHENTIC FAMILIES</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {FONT_CATALOG.map((font) => {
            const isSelected = selectedFont.id === font.id;
            const theme = FONT_THEME_COLORS[font.id] || { primary: '#38bdf8', secondary: '#a855f7' };
            return (
              <button
                key={font.id}
                onClick={() => handleFontSelect(font)}
                className={`p-3 rounded-xl border text-left transition-all duration-150 cursor-pointer ${
                  isSelected
                    ? 'bg-blue-950/40 border-cyan-400 shadow-lg shadow-cyan-500/10 scale-[1.02]'
                    : 'border-white/10 bg-white/[0.02] hover:bg-white/[0.06] hover:border-blue-400/30'
                }`}
                style={isSelected ? { borderColor: theme.primary } : {}}
              >
                <div className="flex items-center justify-between mb-1">
                  <span 
                    className="w-2.5 h-2.5 rounded-full shadow-sm"
                    style={{ backgroundColor: theme.primary }}
                  />
                  <span className="text-[9px] font-mono font-bold text-cyan-400">
                    ${font.prices.commercial}
                  </span>
                </div>
                <div className="text-xs font-black text-white uppercase tracking-tight truncate font-grotesk">
                  {font.name.replace('Abdullah ', '')}
                </div>
                <div className="text-[9px] text-purple-300/70 uppercase font-medium truncate mt-0.5">
                  {font.category}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. MODE & CONTROL TOOLBAR */}
      <div className="p-4 sm:p-5 bg-[#090c1e] border-b border-blue-500/15 flex flex-wrap items-center justify-between gap-4 text-xs">
        
        {/* Render Mode Switcher (Pure Blue & Purple Pill Buttons) */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">MODE:</span>
          <div className="flex items-center p-1 bg-black/80 rounded-xl border border-blue-500/20">
            <button
              onClick={() => setRenderMode('texture')}
              className={`px-3.5 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
                renderMode === 'texture'
                  ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-black shadow-md shadow-cyan-500/20 font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Eye size={12} />
              <span>3D Color Texture</span>
            </button>
            <button
              onClick={() => setRenderMode('vector')}
              className={`px-3.5 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
                renderMode === 'vector'
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md shadow-purple-500/20 font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Type size={12} />
              <span>Vector Outlines</span>
            </button>
          </div>
        </div>

        {/* Vector Weights (If in Vector Mode) or Size Slider (If in Texture Mode) */}
        {renderMode === 'vector' ? (
          <div className="flex items-center gap-3">
            {/* Format OTF/TTF */}
            <div className="flex items-center gap-1.5 bg-black/60 p-1 rounded-xl border border-blue-500/20">
              <button
                onClick={() => setFormatMode('OTF')}
                className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                  formatMode === 'OTF' ? 'bg-cyan-500 text-black font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                .OTF
              </button>
              <button
                onClick={() => setFormatMode('TTF')}
                className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                  formatMode === 'TTF' ? 'bg-purple-500 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                .TTF
              </button>
            </div>

            {/* Weights */}
            <div className="flex items-center gap-1">
              {[
                { label: 'Regular', weight: 400 },
                { label: 'Semi-Bold', weight: 600 },
                { label: 'Bold', weight: 700 }
              ].map(w => (
                <button
                  key={w.weight}
                  onClick={() => setVectorWeight(w.weight)}
                  className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                    vectorWeight === w.weight
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-black shadow-md'
                      : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {w.label}
                </button>
              ))}
            </div>

            {/* Font Size Slider */}
            <div className="flex items-center gap-2 ml-2">
              <span className="text-[10px] font-mono text-slate-400">SIZE:</span>
              <input
                type="range"
                min="20"
                max="90"
                value={vectorFontSize}
                onChange={(e) => setVectorFontSize(Number(e.target.value))}
                className="w-24 bg-white/10 h-1.5 rounded-lg cursor-pointer accent-cyan-400"
              />
              <span className="text-[10px] font-mono font-bold w-8 text-right text-cyan-400">
                {vectorFontSize}px
              </span>
            </div>
          </div>
        ) : (
          /* Texture Glyph Size Slider (Pure Blue/Purple Slider) */
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">GLYPH SCALE:</span>
            <input
              type="range"
              min="32"
              max="110"
              value={glyphSize}
              onChange={(e) => setGlyphSize(Number(e.target.value))}
              className="w-28 sm:w-40 bg-white/10 h-1.5 rounded-lg cursor-pointer accent-cyan-400"
            />
            <span className="text-xs font-mono font-bold w-10 text-right text-cyan-400">
              {glyphSize}px
            </span>
          </div>
        )}
      </div>

      {/* 3. PRESET SAMPLES & QUICK INPUT BAR */}
      <div className="px-4 sm:px-6 py-2.5 bg-black/60 border-b border-blue-500/15 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar flex-1">
          <span className="text-[9px] font-bold uppercase tracking-wider text-purple-300/70 whitespace-nowrap">
            SAMPLE:
          </span>
          {PRESET_PHRASES.map((phrase, idx) => (
            <button
              key={idx}
              onClick={() => setCustomText(phrase)}
              className="px-2.5 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider bg-white/5 border border-white/10 text-slate-300 hover:text-cyan-300 hover:border-cyan-500/30 hover:bg-blue-950/30 whitespace-nowrap transition-colors cursor-pointer"
            >
              {phrase.length > 22 ? phrase.substring(0, 22) + '...' : phrase}
            </button>
          ))}
        </div>

        <button
          onClick={() => {
            setCustomText(selectedFont.sampleText || 'ALPHAXEN');
            setGlyphSize(64);
            setVectorFontSize(52);
          }}
          className="p-1 text-slate-400 hover:text-cyan-300 cursor-pointer flex items-center gap-1 text-[9px] uppercase font-bold"
          title="Reset"
        >
          <RotateCcw size={11} />
          <span>RESET</span>
        </button>
      </div>

      {/* 4. MAIN LIVE INTERACTIVE RENDERING STAGE */}
      <div className="p-6 sm:p-10 min-h-[300px] bg-[#03050c] flex flex-col justify-center items-center relative overflow-hidden">
        
        {renderMode === 'texture' ? (
          /* =========================================================================
             MODE 1: 3D PHOTOREALISTIC TEXTURE COLOR MODE
             Renders character by character using the author's real 3D texture glyphs
             ========================================================================= */
          <div className="w-full flex flex-col items-center justify-center space-y-6">
            
            {/* Live Interactive 3D Glyphs Stage */}
            <div className="w-full min-h-[160px] p-6 rounded-2xl bg-[#060815] border border-blue-500/20 flex flex-wrap items-center justify-center gap-x-1 gap-y-3 relative overflow-hidden shadow-inner">
              {loadingGlyphs ? (
                <div className="text-cyan-300 font-mono text-xs flex items-center gap-2">
                  <Sparkles size={14} className="animate-spin text-purple-400" />
                  <span>Loading authentic 3D photorealistic glyphs...</span>
                </div>
              ) : customText.length === 0 ? (
                <span className="text-slate-600 font-mono text-sm italic">Type in the box below to preview 3D glyphs...</span>
              ) : (
                customText.split('').map((char, index) => {
                  if (char === ' ') {
                    return (
                      <span
                        key={index}
                        style={{ width: `${Math.round(glyphSize * 0.38)}px`, display: 'inline-block' }}
                      />
                    );
                  }
                  
                  const glyphB64 = glyphMap[char] || glyphMap[char.toUpperCase()];
                  if (glyphB64) {
                    return (
                      <img
                        key={index}
                        src={glyphB64}
                        alt={char}
                        style={{ height: `${glyphSize}px`, objectFit: 'contain' }}
                        className="inline-block transition-transform duration-100 hover:scale-110 select-none pointer-events-none"
                      />
                    );
                  }

                  // Fallback for unmapped characters using authentic font-face in blue/purple
                  return (
                    <span
                      key={index}
                      style={{
                        fontFamily: `'${selectedFont.name}', serif`,
                        fontSize: `${Math.round(glyphSize * 0.8)}px`,
                        color: currentTheme.primary,
                        lineHeight: 1
                      }}
                      className="inline-block font-bold"
                    >
                      {char}
                    </span>
                  );
                })
              )}
            </div>

            {/* Live Free Text Input for 3D Mode */}
            <div className="w-full max-w-2xl flex items-center gap-3 bg-black/70 border border-blue-500/30 rounded-xl px-4 py-2.5 shadow-lg shadow-blue-500/5">
              <span className="text-[10px] font-mono font-bold uppercase text-cyan-400 whitespace-nowrap">
                TYPE LIVE:
              </span>
              <input
                type="text"
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder="Type here to render 3D texture glyphs..."
                className="w-full bg-transparent border-none outline-none font-mono text-sm font-bold text-white placeholder-slate-600"
                style={{ color: currentTheme.primary }}
              />
              <span className="text-[10px] font-mono text-purple-300/60 whitespace-nowrap">
                {customText.length} CHS
              </span>
            </div>
          </div>
        ) : (
          /* =========================================================================
             MODE 2: VECTOR MULTI-WEIGHT OUTLINES MODE
             Renders real .OTF / .TTF font files with crisp outlines in Pure Blue & Purple
             ========================================================================= */
          <div className="w-full flex flex-col items-center justify-center">
            <textarea
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              rows={2}
              spellCheck={false}
              className="w-full bg-transparent border-none outline-none resize-none overflow-hidden select-text text-center focus:outline-none"
              style={{
                fontFamily: `'${selectedFont.name}', serif`,
                fontSize: `${vectorFontSize}px`,
                fontWeight: vectorWeight,
                color: currentTheme.primary,
                lineHeight: 1.25,
                letterSpacing: '0.02em',
                transition: 'font-size 0.1s ease'
              }}
              placeholder="Type with the genuine vector font..."
            />
          </div>
        )}

        {/* Font Info & Direct Download / Copy Bar */}
        <div className="w-full pt-6 mt-6 border-t border-blue-500/15 flex flex-wrap items-center justify-between text-[10px] font-mono text-slate-400 gap-3">
          <div className="flex items-center gap-2.5 font-bold uppercase tracking-wider">
            <span>TYPEFACE: <strong className="text-white">{selectedFont.name}</strong></span>
            <span>•</span>
            <span>MODE: <strong className="text-cyan-400">{renderMode === 'texture' ? '3D PHOTOREALISTIC COLOR' : `REAL .${formatMode} VECTOR`}</strong></span>
            <span>•</span>
            <span>STATUS: <strong className="text-purple-400">AUTHENTIC SUITE</strong></span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleDirectDownload('current')}
              className="px-3 py-1.5 rounded-lg border border-cyan-500/40 bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20 flex items-center gap-1.5 font-bold text-[9px] uppercase tracking-wider transition-all cursor-pointer"
              title="Download selected font binary"
            >
              {downloadSuccess ? <Check size={12} className="text-emerald-400" /> : <Download size={12} />}
              <span>{downloadSuccess ? 'DOWNLOADED' : `GET .${formatMode}`}</span>
            </button>

            <button
              onClick={() => handleDirectDownload('zip')}
              className="px-3 py-1.5 rounded-lg border border-purple-500/40 bg-purple-500/10 text-purple-300 hover:bg-purple-500/20 flex items-center gap-1.5 font-bold text-[9px] uppercase tracking-wider transition-all cursor-pointer"
              title="Download complete ZIP suite"
            >
              <Layers size={12} />
              <span>GET .ZIP PACKAGE</span>
            </button>

            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-lg border border-white/15 bg-white/5 text-white hover:bg-white/10 flex items-center gap-1.5 font-bold text-[9px] uppercase tracking-wider transition-all cursor-pointer"
            >
              {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
              <span>{copied ? 'COPIED' : 'COPY TEXT'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 5. BOTTOM DIRECT ACTION & LICENSING BAR (Pure Blue to Purple Gradient) */}
      <div className="p-4 sm:p-6 border-t border-blue-500/20 bg-black/80 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 text-xs">
          <div>
            <span className="text-purple-300/80 uppercase font-bold text-[9px] tracking-wider block">PERPETUAL COMMERCIAL LICENSE</span>
            <strong className="text-white text-xl font-mono">${selectedFont.prices.commercial}</strong>
            <span className="text-slate-400 text-[10px]"> / PERPETUAL</span>
          </div>
          <div className="h-7 w-px bg-white/10" />
          <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
            <span>FILES: </span>
            <strong className="text-cyan-300">AUTHENTIC OTF + TTF + 3D COLOR SUITE</strong>
          </div>
        </div>

        <button
          onClick={() => {
            if (onSelectLicense) {
              onSelectLicense(selectedFont);
            } else {
              window.location.hash = '#/shop';
            }
          }}
          className="h-11 px-7 rounded-xl font-black uppercase tracking-[0.18em] text-[10px] text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 flex items-center gap-2 cursor-pointer shadow-lg shadow-purple-500/25 hover:scale-105 transition-all w-full sm:w-auto justify-center"
        >
          <ShieldCheck size={14} className="text-cyan-300" />
          <span>LICENSE {selectedFont.name.toUpperCase()}</span>
          <ArrowRight size={13} />
        </button>
      </div>

    </div>
  );
};

export default FontTesterStudio;
