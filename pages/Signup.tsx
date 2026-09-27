import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User, Mail, Lock, Eye, EyeOff, Loader2, ArrowLeft,
  Sparkles, ShoppingBag, Layers, ShieldCheck, CheckCircle2, Check,
  KeyRound, Shield, AlertCircle, RefreshCw
} from 'lucide-react';
import BrandMark from '../components/BrandMark';
import PasswordSecurityMeter from '../components/PasswordSecurityMeter';
import { loginUser, validatePasswordComplexity, generate6DigitAuthToken } from '../services/authManager';

export const Signup: React.FC = () => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authPin, setAuthPin] = useState(() => generate6DigitAuthToken());
  const [showPassword, setShowPassword] = useState(false);
  const [accountType, setAccountType] = useState<'buyer' | 'seller'>('buyer');
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();
    if (!fullName.trim() || !normalizedEmail || !password) {
      setError('Please complete all required fields.');
      return;
    }

    const complexity = validatePasswordComplexity(password);
    if (!complexity.isValid) {
      setError(`Password must satisfy all 4 security criteria: ${complexity.missingRequirements.join(', ')}.`);
      return;
    }

    if (!agreeTerms) {
      setError('Please agree to the Alphaxen EULA & Terms of Service.');
      return;
    }

    setError('');
    setLoading(true);

    const user = loginUser(
      normalizedEmail,
      fullName.trim(),
      accountType,
      false, // Starts pending until reviewed or approved
      password,
      authPin,
      true
    );

    setTimeout(() => {
      setLoading(false);
      if (accountType === 'seller') {
        navigate('/seller');
      } else {
        navigate('/buyer');
      }
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#070a13] text-slate-100 flex flex-col justify-center items-center px-4 sm:px-6 py-16 relative overflow-hidden selection:bg-indigo-500/30 font-sans">
      
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[520px] bg-gradient-to-tr from-purple-600/15 via-indigo-600/15 to-cyan-500/10 blur-[150px] -z-10 pointer-events-none" />

      <div className="w-full max-w-lg space-y-8 animate-slide-up relative z-10">
        
        {/* Header Branding */}
        <div className="text-center space-y-3">
          <div className="flex justify-center mb-2">
            <BrandMark mode="large" suffix="JOIN THE ECOSYSTEM" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white font-grotesk">
            Create Your Account
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm font-medium max-w-sm mx-auto leading-relaxed">
            Join thousands of art directors, design studios, and independent type foundries on Alphaxen.
          </p>
        </div>

        {/* Account Role Neomorphic Switcher */}
        <div className="bg-[#050814] p-1.5 rounded-2xl grid grid-cols-2 gap-2 border border-white/20 shadow-inner">
          <button
            type="button"
            onClick={() => setAccountType('buyer')}
            className={`py-3 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
              accountType === 'buyer'
                ? 'neu-btn-primary text-white shadow-lg'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <ShoppingBag size={15} className={accountType === 'buyer' ? 'text-cyan-300' : 'text-slate-400'} />
            <span>Buyer &amp; Studio</span>
          </button>

          <button
            type="button"
            onClick={() => setAccountType('seller')}
            className={`py-3 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
              accountType === 'seller'
                ? 'neu-btn-primary text-white shadow-lg'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Layers size={15} className={accountType === 'seller' ? 'text-purple-300' : 'text-slate-400'} />
            <span>Type Foundry (Seller)</span>
          </button>
        </div>

        {/* Main Obsidian Glass Card */}
        <div className="bg-[#0c101d] border border-white/20 p-8 sm:p-10 rounded-[2.5rem] shadow-2xl space-y-6 relative overflow-hidden">
          
          {error && (
            <div className="p-4 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-200 text-xs font-bold text-center flex items-center justify-center gap-2 animate-fade-in">
              <AlertCircle size={16} className="text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-5">
            {/* Full Name / Studio Name */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-200 flex justify-between">
                <span>{accountType === 'seller' ? 'Foundry / Studio Name' : 'Full Name / Agency'}</span>
                <span className="text-[11px] font-normal text-slate-400">Licensee identifier</span>
              </label>
              <div className="relative group">
                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-cyan-400 transition-colors" />
                <input
                  type="text"
                  required
                  placeholder={accountType === 'seller' ? 'e.g. Apex Type Foundry' : 'e.g. Elena Rostova or Studio Nova'}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-[#050814] border border-white/20 rounded-2xl pl-12 pr-4 py-4 text-sm text-white placeholder-slate-500 font-semibold focus:outline-none focus:border-cyan-500/80 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-200 flex justify-between">
                <span>Email Address</span>
                <span className="text-[11px] font-normal text-slate-400">For perpetual EULA certificates</span>
              </label>
              <div className="relative group">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-cyan-400 transition-colors" />
                <input
                  type="email"
                  required
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                  placeholder="designer@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value.toLowerCase())}
                  className="w-full bg-[#050814] border border-white/20 rounded-2xl pl-12 pr-4 py-4 text-sm text-white placeholder-slate-500 font-semibold focus:outline-none focus:border-cyan-500/80 focus:ring-2 focus:ring-cyan-500/20 transition-all lowercase"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-200 flex justify-between">
                <span>Password (6+ Digits/Letters/Symbols)</span>
                <span className="text-[10px] font-mono text-cyan-400">Word + Num + Symbol</span>
              </label>
              <div className="relative group">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-purple-400 transition-colors" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="e.g. Ax9#b$24"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#050814] border border-white/20 rounded-2xl pl-12 pr-12 py-4 text-sm text-white placeholder-slate-500 font-semibold focus:outline-none focus:border-purple-500/80 focus:ring-2 focus:ring-purple-500/20 transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* Real-time Password Security & Complexity Meter */}
              <PasswordSecurityMeter
                password={password}
                onSelectGenerated={(generated) => setPassword(generated)}
                showGenerator={true}
              />
            </div>

            {/* 6-Digit Cryptographic Auth Token */}
            <div className="p-4 rounded-2xl bg-[#050814] border border-white/15 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <KeyRound size={13} className="text-purple-400" />
                  6-DIGIT QUICK AUTH PIN:
                </span>
                <button
                  type="button"
                  onClick={() => setAuthPin(generate6DigitAuthToken())}
                  className="text-[9px] font-mono text-purple-300 hover:text-white flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw size={10} /> REGENERATE
                </button>
              </div>
              <div className="flex items-center justify-between bg-[#0c101d] border border-white/10 p-3 rounded-xl">
                <span className="font-mono font-black text-base text-cyan-300 tracking-widest">{authPin}</span>
                <span className="text-[9px] font-mono text-slate-400 uppercase">One-touch Fast Login PIN</span>
              </div>
            </div>

            {/* Terms Checkbox */}
            <label className="flex items-start gap-3 text-xs text-slate-300 font-medium cursor-pointer select-none pt-1">
              <div
                onClick={() => setAgreeTerms(!agreeTerms)}
                className={`w-5 h-5 rounded-lg border flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${
                  agreeTerms
                    ? 'bg-cyan-500 border-cyan-400 text-black shadow-md'
                    : 'bg-[#050814] border-white/20'
                }`}
              >
                {agreeTerms && <Check size={13} className="stroke-[3.5px]" />}
              </div>
              <span className="leading-relaxed">
                I agree to the{' '}
                <Link to="/tos" className="text-cyan-400 hover:text-cyan-300 underline font-semibold">
                  Alphaxen Commercial EULA
                </Link>{' '}
                and{' '}
                <Link to="/tos" className="text-cyan-400 hover:text-cyan-300 underline font-semibold">
                  Terms of Service
                </Link>.
              </span>
            </label>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full neu-btn-primary h-14 rounded-2xl font-black uppercase tracking-[0.25em] text-xs text-white shadow-2xl flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer mt-2"
            >
              {loading ? (
                <Loader2 size={18} className="animate-spin text-white" />
              ) : (
                <>
                  <ShieldCheck size={18} />
                  <span>Register as {accountType === 'seller' ? 'Foundry Seller (85%)' : 'Type Buyer'}</span>
                </>
              )}
            </button>
          </form>

          {/* Switch to Login */}
          <div className="text-center pt-2 text-xs text-slate-300 font-medium border-t border-white/10">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-cyan-400 hover:text-cyan-300 font-bold transition-colors underline underline-offset-4"
            >
              Sign In Instead
            </Link>
          </div>
        </div>

        {/* Back to Home Link */}
        <div className="text-center">
          <Link
            to="/"
            className="neu-btn inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-slate-300 hover:text-white transition-all shadow-md hover:scale-105"
          >
            <ArrowLeft size={14} />
            <span>Back to Alphaxen Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
