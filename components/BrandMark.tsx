import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAssetUrl } from '../services/fontData';

type BrandMarkProps = {
  mode?: 'default' | 'compact' | 'large';
  suffix?: string;
  className?: string;
  disableLink?: boolean;
};

const BrandMark: React.FC<BrandMarkProps> = ({ mode = 'default', suffix, className = '', disableLink = false }) => {
  const compact = mode === 'compact';
  const large = mode === 'large';
  const [imgSrc, setImgSrc] = useState<string>(() => getAssetUrl('ax.png'));

  useEffect(() => {
    setImgSrc(getAssetUrl('ax.png'));
  }, []);

  const handleImgError = () => {
    if (imgSrc.startsWith('./')) {
      setImgSrc('/ax.png');
    } else if (imgSrc.startsWith('/')) {
      setImgSrc('ax.png');
    }
  };

  const normalizedSuffix = suffix?.trim().toUpperCase();
  const showCustomBadge = Boolean(normalizedSuffix && normalizedSuffix !== 'FONT LAB' && normalizedSuffix !== 'DEFAULT');

  const content = (
    <div className={`inline-flex items-center gap-3 sm:gap-4 select-none group ${className}`.trim()}>
      <img
        src={imgSrc}
        alt="Alphaxen Font Lab"
        onError={handleImgError}
        className={`w-auto object-contain transition-all duration-300 group-hover:brightness-110 group-hover:scale-[1.03] ${
          compact
            ? 'h-[34px] sm:h-[40px]'
            : large
            ? 'h-[62px] sm:h-[78px]'
            : 'h-[45px] sm:h-[50px]'
        }`}
      />
      {showCustomBadge && (
        <span className="hidden sm:inline-flex items-center px-2.5 py-1 rounded-md text-[9.5px] font-mono font-black tracking-widest bg-white/[0.06] border border-white/10 text-cyan-300 uppercase shadow-sm">
          {suffix}
        </span>
      )}
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
