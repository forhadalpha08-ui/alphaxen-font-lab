import React from 'react';
import { Check, X, Shield, Sparkles, Key, ShieldCheck, Lock } from 'lucide-react';
import { validatePasswordComplexity, generateSecurePassword, PasswordValidationResult } from '../services/authManager';

interface PasswordSecurityMeterProps {
  password: string;
  onSelectGenerated?: (password: string) => void;
  showGenerator?: boolean;
}

export const PasswordSecurityMeter: React.FC<PasswordSecurityMeterProps> = ({
  password,
  onSelectGenerated,
  showGenerator = true
}) => {
  const result: PasswordValidationResult = validatePasswordComplexity(password);

  const requirements = [
    { label: '6+ Digits/Characters', valid: result.isLengthValid },
    { label: 'Words / Letters (a-z, A-Z)', valid: result.hasLetter },
    { label: 'Numbers (0-9)', valid: result.hasNumber },
    { label: 'Special Symbols (!@#$...)', valid: result.hasSymbol }
  ];

  return (
    <div className="space-y-3 pt-1">
      {/* Strength Bar & Label */}
      <div className="space-y-1.5">
        <div className="flex justify-between items-center text-[10px] font-mono uppercase tracking-wider">
          <span className="text-slate-400 font-bold flex items-center gap-1">
            <Lock size={11} className="text-slate-400" />
            PASSWORD COMPLEXITY:
          </span>
          <span
            style={{ color: result.strengthColor }}
            className="font-black px-2 py-0.5 rounded bg-white/5 border border-white/10"
          >
            {result.strengthLabel.toUpperCase()} ({result.score}/4)
          </span>
        </div>

        {/* 4-Segment Bar */}
        <div className="grid grid-cols-4 gap-1.5 h-1.5">
          {[1, 2, 3, 4].map((step) => {
            const isActive = result.score >= step;
            return (
              <div
                key={step}
                style={{
                  backgroundColor: isActive ? result.strengthColor : 'rgba(255, 255, 255, 0.08)',
                  boxShadow: isActive ? `0 0 10px ${result.strengthColor}66` : 'none'
                }}
                className="h-full rounded-full transition-all duration-300"
              />
            );
          })}
        </div>
      </div>

      {/* 4 Policy Badges */}
      <div className="grid grid-cols-2 gap-2">
        {requirements.map((req, idx) => (
          <div
            key={idx}
            className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-[10px] font-mono uppercase transition-all ${
              req.valid
                ? 'bg-purple-500/15 border border-purple-500/40 text-purple-300 font-bold shadow-[0_0_12px_rgba(139,92,246,0.2)]'
                : 'bg-[#0b0e17] border border-white/10 text-slate-400'
            }`}
          >
            {req.valid ? (
              <Check size={12} className="text-purple-400 stroke-[3]" />
            ) : (
              <span className="w-1.5 h-1.5 rounded-full bg-slate-500 mx-0.5" />
            )}
            <span className="truncate">{req.label}</span>
          </div>
        ))}
      </div>

      {/* Auto-Generator Quick Action */}
      {showGenerator && onSelectGenerated && (
        <div className="flex items-center justify-between pt-1">
          <span className="text-[10px] text-slate-400 font-medium">Need a secure compliant password?</span>
          <button
            type="button"
            onClick={() => {
              const generated = generateSecurePassword(8);
              onSelectGenerated(generated);
            }}
            className="neu-btn px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-wider text-purple-300 hover:text-white flex items-center gap-1 cursor-pointer transition-all hover:scale-105"
          >
            <Sparkles size={11} className="text-purple-400" />
            <span>AUTO-GENERATE</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default PasswordSecurityMeter;
