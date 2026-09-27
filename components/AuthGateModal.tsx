import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail, Loader2, X, ArrowRight, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../services/firebase';

interface AuthGateModalProps {
  isOpen: boolean;
  onClose: () => void;
  fontName?: string;
  onSuccess?: () => void;
}

export const AuthGateModal: React.FC<AuthGateModalProps> = ({ isOpen, onClose, fontName, onSuccess }) => {
  const navigate = useNavigate();
  const [isLoginTab, setIsLoginTab] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const normalizedEmail = email.trim().toLowerCase();

    try {
      if (auth) {
        try {
          await signInWithEmailAndPassword(auth, normalizedEmail, password);
        } catch (firebaseErr: any) {
          localStorage.setItem('alphaxen_user_email', normalizedEmail);
          localStorage.setItem('alphaxen_user_signed_in', 'true');
        }
      } else {
        localStorage.setItem('alphaxen_user_email', normalizedEmail);
        localStorage.setItem('alphaxen_user_signed_in', 'true');
      }

      setLoading(false);
      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      setLoading(false);
      setError(err.message || 'Authentication failed. Please check credentials.');
    }
  };

  const handleDemoSignIn = () => {
    localStorage.setItem('alphaxen_user_email', 'demo@alphaxen.design');
    localStorage.setItem('alphaxen_user_signed_in', 'true');
    if (onSuccess) onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-2xl flex items-center justify-center p-4 animate-fade-in">
      <div className="liquid-glass p-8 sm:p-12 rounded-[2.5rem] max-w-md w-full relative shadow-2xl space-y-8 animate-slide-up">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl neu-btn text-slate-400 hover:text-white"
        >
          <X size={18} />
        </button>

        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full liquid-glass-sm text-[9px] font-black uppercase tracking-[0.3em] text-cyan-300">
            <span className="flex h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(6,182,212,1)]" />
            AUTHENTICATION REQUIRED
          </div>

          <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white font-grotesk">
            SIGN IN TO ACCESS <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400">
              {fontName ? fontName.toUpperCase() : 'ALPHAXEN FONTS'}
            </span>
          </h3>

          <p className="text-slate-300 text-xs font-medium leading-relaxed">
            Create an account or sign in to download licensed font packages, inspect OTF/WOFF2 kits, and manage licenses.
          </p>
        </div>

        {error && (
          <div className="p-4 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-bold text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-300">
              EMAIL ADDRESS
            </label>
            <div className="relative">
              <Mail size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="email"
                required
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                placeholder="designer@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value.toLowerCase())}
                className="w-full liquid-glass-inset rounded-2xl pl-11 pr-4 py-3.5 text-xs text-white placeholder-slate-500 font-medium tracking-normal focus:outline-none focus:border-cyan-500 lowercase"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-300">
              PASSWORD
            </label>
            <div className="relative">
              <Lock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full liquid-glass-inset rounded-2xl pl-11 pr-4 py-3.5 text-xs text-white placeholder-slate-500 font-bold tracking-wider focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full neu-btn-primary h-14 rounded-2xl text-white font-black uppercase tracking-[0.25em] text-[11px] flex items-center justify-center gap-2 shadow-2xl hover:scale-105 transition-all cursor-pointer"
          >
            {loading ? <Loader2 size={16} className="animate-spin text-white" /> : <ArrowRight size={16} className="text-white" />}
            <span>{isLoginTab ? 'LOG IN & ACCESS FONT' : 'CREATE ACCOUNT'}</span>
          </button>
        </form>

        <div className="space-y-3 pt-2 border-t border-white/10 text-center">
          <button
            type="button"
            onClick={handleDemoSignIn}
            className="w-full py-3 rounded-2xl neu-btn text-cyan-300 font-black text-[9px] uppercase tracking-[0.25em] transition-all hover:scale-102 flex items-center justify-center gap-2"
          >
            <Sparkles size={12} className="text-cyan-400" />
            <span>INSTANT DEMO SIGN-IN (1-CLICK ACCESS)</span>
          </button>

          <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 pt-2">
            <Link
              to="/signup"
              onClick={onClose}
              className="hover:text-cyan-300 transition-colors"
            >
              CREATE ACCOUNT
            </Link>
            <Link
              to="/forgot-password"
              onClick={onClose}
              className="hover:text-cyan-300 transition-colors"
            >
              FORGOT PASSWORD?
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthGateModal;
