import React, { Component, ErrorInfo, ReactNode } from 'react';
import { HashRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { RefreshCw, Home, ShoppingBag, AlertTriangle } from 'lucide-react';

import Landing from './pages/Landing';
import Shop from './pages/Shop';
import BuyerPortal from './pages/BuyerPortal';
import SellerPortal from './pages/SellerPortal';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import TOS from './pages/TOS';
import Docs from './pages/Docs';
import Admin from './pages/Admin';
import InstallApp from './pages/InstallApp';
import { soundFx } from './services/soundFx';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class GlobalErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught Alphaxen Error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.hash = '#/';
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0b0e17] text-slate-100 flex flex-col justify-center items-center px-6 py-16 relative overflow-hidden font-sans">
          <div className="liquid-glass p-10 sm:p-12 rounded-[2.5rem] max-w-lg w-full text-center space-y-6 shadow-2xl border-purple-500/40 animate-slide-up">
            <div className="w-16 h-16 rounded-2xl bg-purple-500/20 text-purple-300 border border-purple-500/40 flex items-center justify-center mx-auto shadow-lg">
              <AlertTriangle size={32} />
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl font-black text-white uppercase tracking-tight font-grotesk">
                SESSION RECOVERED
              </h1>
              <p className="text-xs text-slate-300 leading-relaxed font-medium">
                Alphaxen encountered an unexpected state. Click below to restore full viewport telemetry and return to the home marketplace.
              </p>
              {this.state.error && (
                <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-200 font-mono text-[10px] text-left overflow-x-auto max-h-32 custom-scrollbar">
                  <span className="font-bold block text-rose-300">Error: {this.state.error.message}</span>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={this.handleReset}
                className="neu-btn-primary w-full sm:w-auto h-12 px-6 rounded-xl font-black text-xs uppercase tracking-widest text-white flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:scale-105 transition-all"
              >
                <RefreshCw size={14} /> RELOAD WORKSPACE
              </button>

              <a
                href="#/"
                onClick={() => this.setState({ hasError: false })}
                className="neu-btn w-full sm:w-auto h-12 px-6 rounded-xl font-bold text-xs uppercase tracking-widest text-slate-200 hover:text-white flex items-center justify-center gap-2 transition-all"
              >
                <Home size={14} /> HOME
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const App: React.FC = () => {
  React.useEffect(() => {
    soundFx.initGlobalListeners();
  }, []);

  return (
    <GlobalErrorBoundary>
      <HashRouter>
        <Routes>
          {/* Core Alphaxen Font Foundry Pages */}
          <Route path="/" element={<Landing />} />
          
          {/* Font Catalog & Marketplace */}
          <Route path="/shop" element={<Shop />} />
          <Route path="/catalog" element={<Shop />} />
          <Route path="/fonts" element={<Shop />} />
          <Route path="/marketplace" element={<Shop />} />

          {/* Buyer Vault & Dashboard */}
          <Route path="/buyer" element={<BuyerPortal />} />
          <Route path="/dashboard" element={<BuyerPortal />} />
          <Route path="/vault" element={<BuyerPortal />} />
          <Route path="/library" element={<BuyerPortal />} />

          {/* Seller Foundry Studio */}
          <Route path="/seller" element={<SellerPortal />} />
          <Route path="/studio" element={<SellerPortal />} />
          <Route path="/foundry" element={<SellerPortal />} />
          <Route path="/reseller" element={<SellerPortal />} />
          <Route path="/reseller/:hash" element={<SellerPortal />} />

          {/* Documentation, Integration & API */}
          <Route path="/docs" element={<Docs />} />
          <Route path="/documentation" element={<Docs />} />
          <Route path="/api" element={<Docs />} />

          {/* Terms, EULA & Legal */}
          <Route path="/tos" element={<TOS />} />
          <Route path="/terms" element={<TOS />} />
          <Route path="/privacy" element={<TOS />} />
          <Route path="/eula" element={<TOS />} />
          <Route path="/license" element={<TOS />} />

          {/* Authentication Gates */}
          <Route path="/login" element={<Login />} />
          <Route path="/signin" element={<Login />} />
          <Route path="/login/:discordId" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/register" element={<Signup />} />
          <Route path="/signup/:discordId" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ForgotPassword />} />

          {/* Admin Command Console */}
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin-console" element={<Admin />} />

          {/* Universal PWA App Install & Download */}
          <Route path="/install" element={<InstallApp />} />
          <Route path="/download" element={<InstallApp />} />
          <Route path="/app" element={<InstallApp />} />

          {/* Fallback to Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </GlobalErrorBoundary>
  );
};

export default App;
