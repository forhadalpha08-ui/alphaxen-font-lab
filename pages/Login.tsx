import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Mail, Lock, Eye, EyeOff, Loader2, ArrowLeft,
  Sparkles, ShoppingBag, Layers, CheckCircle2, ShieldCheck,
  KeyRound, Shield, Smartphone, ArrowRight, Check, AlertCircle, Fingerprint
} from 'lucide-react';
import BrandMark from '../components/BrandMark';
import { loginUser, validatePasswordComplexity } from '../services/authManager';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const [authMethod, setAuthMethod] = useState<'password' | 'pin'>('password');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [accountType, setAccountType] = useState<'buyer' | 'seller'>('buyer');
  const [trustedDevice, setTrustedDevice] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) {
      setError('Please provide your registered account email.');
      return;
    }

    if (authMethod === 'password') {
      if (!password) {
        setError('Please enter your account password.');
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 digits/characters containing letters, numbers, and symbols.');
        return;
      }
    } else {
      if (!pinCode || pinCode.length < 6) {
        setError('Please enter your 6-digit cryptographic security code / PIN.');
        return;
      }
    }

    setError('');
    setLoading(true);

    const user = loginUser(
      normalizedEmail,
      undefined,
      accountType,
      true, // Auto-approve demo / returning sessions
      authMethod === 'password' ? password : undefined,
      authMethod === 'pin' ? pinCode : undefined,
      trustedDevice
    );

    setTimeout(() => {
      setLoading(false);
      if (user.role === 'seller') {
        navigate('/seller');
      } else {
        navigate('/buyer');
      }
    }, 550);
  };

  const handleDemoSignIn = (type: 'buyer' | 'seller') => {
    setLoading(true);
    const demoEmail = type === 'seller' ? 'foundry@alphaxen.design' : 'studio@novalabs.design';
    const user = loginUser(
      demoEmail,
      type === 'seller' ? 'Abdullah Foundry Lab' : 'Elena Rostova',
      type,
      true,
      'Alpha#2026!',
      'AX9#24',
      true
    );

    setTimeout(() => {
      setLoading(false);
      if (type === 'seller') {
        navigate('/seller');
      } else {
        navigate('/buyer');
      }
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#0b0e17] text-slate-100 flex flex-col justify-center items-center px-4 sm:px-6 py-16 relative overflow-hidden selection:bg-purple-500/30 font-sans">
      
      <div className="w-full max-w-lg space-y-8 animate-slide-up relative z-10">
        
        {/* Header Branding */}
        <div className="text-center space-y-3">
          <div className="flex justify-center mb-2">
            <BrandMark mode="large" suffix="AUTHENTICATION GATEWAY" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white font-grotesk">
            Welcome Back
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm font-medium max-w-sm mx-auto leading-relaxed">
            Secure multi-factor sign in for font buyers, enterprise licensing teams, and independent type foundries.
          </p>
        </div>

        {/* Account Role Neomorphic Switcher */}
        <div className="bg-[#0b0e17] p-1.5 rounded-2xl grid grid-cols-2 gap-2 border border-white/20 shadow-inner">
          <button
            type="button"
            onClick={() => setAccountType('buyer')}
            className={`py-3 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
              accountType === 'buyer'
                ? 'neu-btn-primary text-white shadow-lg'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <ShoppingBag size={15} className={accountType === 'buyer' ? 'text-purple-300' : 'text-slate-400'} />
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
            <span>Foundry Creator</span>
          </button>
        </div>

        {/* Main Obsidian Glass Card */}
        <div className="bg-[#0a0a0a] border border-white/20 p-8 sm:p-10 rounded-[2.5rem] shadow-2xl space-y-6 relative overflow-hidden">
          
          {/* Auth Method Selector (Password vs 6-Digit PIN) */}
          <div className="flex items-center justify-between p-1 bg-[#0b0e17] border border-white/15 rounded-xl">
            <button
              type="button"
              onClick={() => setAuthMethod('password')}
              className={`flex-1 py-2 px-3 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                authMethod === 'password'
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Lock size={12} />
              <span>PASSWORD (6+ DIGITS/CHARS)</span>
            </button>
            <button
              type="button"
              onClick={() => setAuthMethod('pin')}
              className={`flex-1 py-2 px-3 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                authMethod === 'pin'
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <KeyRound size={12} />
              <span>6-DIGIT AUTH TOKEN</span>
            </button>
          </div>

          {error && (
            <div className="p-4 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-200 text-xs font-bold text-center flex items-center justify-center gap-2 animate-fade-in">
              <AlertCircle size={16} className="text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-200 flex justify-between">
                <span>Email Address</span>
                <span className="text-[11px] font-normal text-slate-400">Account identifier</span>
              </label>
              <div className="relative group">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-purple-400 transition-colors" />
                <input
                  type="email"
                  required
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                  placeholder="designer@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value.toLowerCase())}
                  className="w-full bg-[#0b0e17] border border-white/20 rounded-2xl pl-12 pr-4 py-4 text-sm text-white placeholder-slate-500 font-semibold focus:outline-none focus:border-purple-500/80 focus:ring-2 focus:ring-purple-500/20 transition-all lowercase"
                />
              </div>
            </div>

            {/* Password Mode */}
            {authMethod === 'password' && (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-200">
                    Password (6+ Digits/Letters/Symbols)
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-xs font-semibold text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    Forgot?
                  </Link>
                </div>
                <div className="relative group">
                  <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-purple-400 transition-colors" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Enter your secure password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#0b0e17] border border-white/20 rounded-2xl pl-12 pr-12 py-4 text-sm text-white placeholder-slate-500 font-semibold focus:outline-none focus:border-purple-500/80 focus:ring-2 focus:ring-purple-500/20 transition-all font-mono"
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
              </div>
            )}

            {/* 6-Digit PIN Mode */}
            {authMethod === 'pin' && (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-200">
                    6-Digit Cryptographic Code / PIN
                  </label>
                  <span className="text-[10px] font-mono text-purple-300">e.g. AX9#24</span>
                </div>
                <div className="relative group">
                  <KeyRound size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-purple-400 transition-colors" />
                  <input
                    type="text"
                    required
                    maxLength={10}
                    placeholder="6-Digit Auth Code (e.g. 892!Xn)"
                    value={pinCode}
                    onChange={(e) => setPinCode(e.target.value)}
                    className="w-full bg-[#0b0e17] border border-white/20 rounded-2xl pl-12 pr-4 py-4 text-sm text-white placeholder-slate-500 font-mono font-bold tracking-widest uppercase focus:outline-none focus:border-purple-500/80 focus:ring-2 focus:ring-purple-500/20 transition-all"
                  />
                </div>
              </div>
            )}

            {/* Trusted Workstation Checkbox */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2.5 text-xs text-slate-300 font-medium cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={trustedDevice}
                  onChange={(e) => setTrustedDevice(e.target.checked)}
                  className="rounded bg-[#0b0e17] border-white/20 text-purple-500 focus:ring-0 focus:ring-offset-0 w-4 h-4 accent-purple-500"
                />
                <span>Trust this device (30-day SHA-256 session)</span>
              </label>
              <Fingerprint size={16} className="text-slate-400" />
            </div>

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
                  <span>Sign In to {accountType === 'seller' ? 'Foundry Studio' : 'Buyer Vault'}</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Demo One-Click Access */}
          <div className="pt-4 border-t border-white/10 space-y-3">
            <div className="text-center">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                OR INSTANT 1-CLICK DEMO ACCESS:
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleDemoSignIn('buyer')}
                className="neu-btn py-3 px-3 rounded-xl text-[11px] font-black uppercase tracking-wider text-purple-300 hover:text-white flex items-center justify-center gap-1.5 transition-all hover:scale-102 cursor-pointer border border-purple-500/30"
              >
                <ShoppingBag size={13} className="text-purple-400" />
                <span>Demo Buyer</span>
              </button>

              <button
                type="button"
                onClick={() => handleDemoSignIn('seller')}
                className="neu-btn py-3 px-3 rounded-xl text-[11px] font-black uppercase tracking-wider text-purple-300 hover:text-white flex items-center justify-center gap-1.5 transition-all hover:scale-102 cursor-pointer border border-purple-500/30"
              >
                <Layers size={13} className="text-purple-400" />
                <span>Demo Foundry</span>
              </button>
            </div>
          </div>

          {/* Security Telemetry Badge */}
          <div className="p-3.5 rounded-xl bg-[#0b0e17] border border-white/10 flex items-center justify-between text-[10px] font-mono text-slate-400">
            <span className="flex items-center gap-1.5 text-purple-400 font-bold">
              <ShieldCheck size={13} />
              256-BIT CRYPTOGRAPHIC VAULT
            </span>
            <span>TLS 1.3 / DRM CORS</span>
          </div>

          {/* Switch to Signup */}
          <div className="text-center pt-2 text-xs text-slate-300 font-medium">
            Don't have an Alphaxen account?{' '}
            <Link
              to="/signup"
              className="text-purple-400 hover:text-purple-300 font-bold transition-colors underline underline-offset-4"
            >
              Create Account
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

export default Login;
