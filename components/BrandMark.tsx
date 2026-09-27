import React from 'react';
import { Link } from 'react-router-dom';

type BrandMarkProps = {
  mode?: 'default' | 'compact' | 'large';
  suffix?: string;
  className?: string;
  disableLink?: boolean;
};

const BrandMark: React.FC<BrandMarkProps> = ({ mode = 'default', suffix, className = '', disableLink = false }) => {
  const compact = mode === 'compact';
  const large = mode === 'large';

  const content = (
    <div className={`flex items-center gap-3 select-none group ${className}`.trim()}>
      <div className={`relative overflow-hidden flex items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 via-purple-500 to-cyan-600 p-[1.5px] shadow-[0_0_20px_rgba(6,182,212,0.35)] group-hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] transition-all duration-500 ${
        compact ? 'w-8 h-8 rounded-lg' : large ? 'w-12 h-12 rounded-2xl' : 'w-10 h-10 rounded-xl'
      }`}>
        <div className="w-full h-full bg-[#0a0a0a] rounded-[inherit] flex items-center justify-center">
          <svg
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={`${compact ? 'w-4 h-4' : large ? 'w-7 h-7' : 'w-5 h-5'} text-white group-hover:scale-110 transition-transform duration-300`}
          >
            <path
              d="M6 24L12 8L18 24"
              stroke="#22d3ee"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M8.5 18H15.5"
              stroke="#22d3ee"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
            <path
              d="M17 12L26 24M26 12L17 24"
              stroke="#c084fc"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
      <div className="flex flex-col leading-none">
        <span className={`${compact ? 'text-[9px]' : large ? 'text-sm' : 'text-[11px]'} font-black tracking-[0.3em] uppercase text-white group-hover:text-cyan-300 transition-colors`}>
          ALPHAXEN
        </span>
        <span className={`${compact ? 'text-[7px]' : 'text-[8px]'} uppercase tracking-[0.35em] font-black text-white/40 mt-1`}>
          {suffix || 'FONT LAB'}
        </span>
      </div>
    </div>
  );

  if (disableLink) {
    return content;
  }

  return (
    <Link to="/" title="Alphaxen Font Lab" className="inline-flex items-center cursor-pointer">
      {content}
    </Link>
  );
};

export default BrandMark;
