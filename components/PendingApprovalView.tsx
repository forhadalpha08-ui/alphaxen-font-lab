import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldAlert, Clock, CheckCircle2, UserCheck, Shield,
  ArrowRight, RefreshCw, Key, ShoppingBag, Layers, Lock, Sparkles, ExternalLink
} from 'lucide-react';
import { UserRecord, approveUser, getCurrentUser } from '../services/authManager';
import BrandMark from './BrandMark';

interface PendingApprovalViewProps {
  user: UserRecord;
  targetRole: 'buyer' | 'seller';
  onApproved?: () => void;
}

export const PendingApprovalView: React.FC<PendingApprovalViewProps> = ({ user, targetRole, onApproved }) => {
  const navigate = useNavigate();
  const [approving, setApproving] = useState(false);
  const [approvedNow, setApprovedNow] = useState(false);

  const handleInstantApprove = () => {
    setApproving(true);
    setTimeout(() => {
      approveUser(user.id);
      setApproving(false);
      setApprovedNow(true);
      if (onApproved) {
        onApproved();
      } else {
        if (targetRole === 'seller' || user.role === 'seller') {
          navigate('/seller');
        } else {
          navigate('/buyer');
        }
      }
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#070a13] text-slate-100 flex flex-col justify-center items-center px-4 sm:px-6 py-16 relative overflow-hidden font-sans selection:bg-purple-500/30">
      
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[450px] bg-gradient-to-tr from-blue-600/15 via-purple-600/15 to-cyan-500/10 blur-[140px] -z-10 pointer-events-none" />

      <div className="w-full max-w-xl space-y-8 animate-slide-up relative z-10">
        
        {/* Header Branding */}
        <div className="text-center space-y-3">
          <div className="flex justify-center mb-2">
            <BrandMark mode="large" suffix="ACCESS VERIFICATION" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white font-grotesk">
            {approvedNow ? 'Access Approved & Unlocked' : 'Curation Review in Progress'}
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm font-medium max-w-md mx-auto leading-relaxed">
            {approvedNow
              ? 'Your permissions have been granted by the Admin Command Console. Welcome to your dedicated workspace.'
              : `Your ${targetRole === 'seller' ? 'Foundry Creator' : 'Font Buyer'} application is undergoing cryptographic security and identity curation review.`}
          </p>
        </div>

        {/* Status Card */}
        <div className="liquid-glass p-8 sm:p-10 rounded-[2.5rem] shadow-2xl space-y-6 relative overflow-hidden border-purple-500/30">
          
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg border ${
              approvedNow
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                : 'bg-purple-500/20 text-purple-300 border-purple-500/40'
            }`}>
              {approvedNow ? <CheckCircle2 size={28} /> : <Clock size={28} className="animate-spin" style={{ animationDuration: '6s' }} />}
            </div>

            <div>
              <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400">
                APPLICATION STATUS
              </div>
              <div className={`text-xl font-black font-grotesk uppercase tracking-tight ${
                approvedNow ? 'text-emerald-400' : 'text-purple-300'
              }`}>
                {approvedNow ? 'STATUS: ACTIVE (APPROVED)' : 'STATUS: PENDING ADMIN APPROVAL'}
              </div>
            </div>
          </div>

          {/* User Record Summary */}
          <div className="liquid-glass-inset p-5 rounded-2xl space-y-3 font-mono text-xs text-slate-300">
            <div className="flex justify-between items-center pb-2 border-b border-white/10">
              <span className="text-slate-400">ACCOUNT NAME:</span>
              <span className="text-white font-bold">{user.name}</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-white/10">
              <span className="text-slate-400">EMAIL:</span>
              <span className="text-cyan-300 font-bold">{user.email}</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-white/10">
              <span className="text-slate-400">TARGET ROLE:</span>
              <span className="text-purple-300 font-bold uppercase">{targetRole} ({user.role})</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">ADMIN CONTROL:</span>
              <span className="text-slate-400">Requires Admin Approval</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-2">
            {!approvedNow ? (
              <>
                <button
                  onClick={handleInstantApprove}
                  disabled={approving}
                  className="w-full neu-btn-primary h-14 rounded-2xl font-black uppercase tracking-[0.2em] text-xs text-white shadow-2xl flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                >
                  {approving ? (
                    <RefreshCw size={16} className="animate-spin text-white" />
                  ) : (
                    <>
                      <Sparkles size={16} className="text-cyan-300" />
                      <span>⚡ Grant Instant Admin Approval</span>
                    </>
                  )}
                </button>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Link
                    to="/admin"
                    className="flex-1 neu-btn h-12 rounded-xl text-[10px] font-black uppercase tracking-wider text-cyan-300 hover:text-white flex items-center justify-center gap-2"
                  >
                    <Shield size={14} />
                    <span>Open Admin Console</span>
                  </Link>

                  <Link
                    to="/shop"
                    className="flex-1 neu-btn h-12 rounded-xl text-[10px] font-black uppercase tracking-wider text-slate-300 hover:text-white flex items-center justify-center gap-2"
                  >
                    <ShoppingBag size={14} />
                    <span>Browse Font Shop</span>
                  </Link>
                </div>
              </>
            ) : (
              <button
                onClick={() => {
                  if (targetRole === 'seller' || user.role === 'seller') {
                    navigate('/seller');
                  } else {
                    navigate('/buyer');
                  }
                }}
                className="w-full neu-btn-cyan h-14 rounded-2xl font-black uppercase tracking-[0.2em] text-xs text-white shadow-2xl flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
              >
                <span>Enter {targetRole === 'seller' ? 'Seller Foundry Studio' : 'Buyer Vault'}</span>
                <ArrowRight size={16} />
              </button>
            )}
          </div>

        </div>

        {/* Back Link */}
        <div className="text-center">
          <Link
            to="/"
            className="text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-white transition-colors"
          >
            ← Return to Home Page
          </Link>
        </div>

      </div>
    </div>
  );
};

export default PendingApprovalView;
