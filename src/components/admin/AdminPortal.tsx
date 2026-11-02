/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  UtensilsCrossed,
  Settings,
  MessageSquare,
  Calendar,
  Lock,
  LogOut,
  ExternalLink,
  ShieldCheck,
  ArrowLeft,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import {
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { auth, isAuthorizedAdmin, AUTHORIZED_ADMIN_EMAILS } from '../../firebase.ts';
import { useData } from '../../context/DataContext.tsx';
import { AdminMenuSection } from './AdminMenuSection.tsx';
import { AdminSettingsSection } from './AdminSettingsSection.tsx';
import { AdminInquiriesSection } from './AdminInquiriesSection.tsx';
import { AdminBookingsSection } from './AdminBookingsSection.tsx';

type AdminTab = 'menu' | 'settings' | 'inquiries' | 'bookings';

export const AdminPortal: React.FC = () => {
  const { closeAdmin, siteSettings } = useData();

  const [activeTab, setActiveTab] = useState<AdminTab>('menu');
  const [currentUser, setCurrentUser] = useState<User | null>(auth.currentUser);
  const [authLoading, setAuthLoading] = useState(true);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Monitor auth state changes with strict single-email authorization enforcement
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        if (isAuthorizedAdmin(user)) {
          setCurrentUser(user);
          setLoginError(null);
        } else {
          // Reject any unauthorized account immediately and clear session
          await signOut(auth);
          setCurrentUser(null);
          setLoginError('Access denied. This account is not authorized.');
        }
      } else {
        setCurrentUser(null);
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleGoogleLogin = async () => {
    setLoginError(null);
    setIsLoggingIn(true);
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      if (!isAuthorizedAdmin(user)) {
        await signOut(auth);
        setCurrentUser(null);
        setLoginError('Access denied. This account is not authorized.');
      } else {
        setCurrentUser(user);
      }
    } catch (err: unknown) {
      console.error('Firebase Google Sign-In Error:', err);
      const error = err as { code?: string; message?: string };
      const code = error?.code || '';

      if (code === 'auth/unauthorized-domain') {
        setLoginError(
          'This website domain is not authorized in Firebase. Add it under Firebase Console > Authentication > Settings > Authorized domains.'
        );
      } else if (code === 'auth/popup-blocked') {
        setLoginError('The sign-in popup was blocked. Allow popups for this site and try again.');
      } else if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') {
        setLoginError('Sign-in was cancelled.');
      } else if (code === 'auth/network-request-failed') {
        setLoginError('Network error. Check your internet connection and try again.');
      } else if (code === 'auth/operation-not-allowed') {
        setLoginError('Google sign-in is not enabled in Firebase Console > Authentication > Sign-in method.');
      } else if (code === 'auth/too-many-requests') {
        setLoginError('Too many attempts. Please wait a moment and try again.');
      } else if (code === 'auth/internal-error') {
        setLoginError('Internal authentication error. Please try again.');
      } else {
        setLoginError(`Sign-in failed (${code || 'unknown'}).`);
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
    } catch (err) {
      console.error('Sign-out error:', err);
    }
  };

  // 1. Loading Authentication State
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#14110F] text-[#F6EFE3] flex flex-col items-center justify-center p-6">
        <Loader2 className="w-8 h-8 animate-spin text-[#D9A441] mb-3" />
        <p className="font-editorial text-lg tracking-wide">Verifying Staff Credentials & Session...</p>
      </div>
    );
  }

  // 2. Unauthenticated / Unauthorized Login Gate (Never render admin UI for non-admin users)
  if (!currentUser || !isAuthorizedAdmin(currentUser)) {
    return (
      <div className="min-h-screen bg-[#14110F] text-[#F6EFE3] flex flex-col justify-between p-6 film-grain">
        {/* Back to Site Header */}
        <div className="max-w-md mx-auto w-full pt-8 flex items-center justify-between">
          <button
            onClick={closeAdmin}
            className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-[#D9A441] hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Public Site</span>
          </button>
        </div>

        {/* Secure Login Card */}
        <div className="max-w-md mx-auto w-full bg-[#1c1815] rounded-2xl border border-[#D9A441]/30 p-8 shadow-2xl my-auto space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-[#D9A441]/15 text-[#D9A441] rounded-full flex items-center justify-center mx-auto mb-3 border border-[#D9A441]/30">
              <Lock className="w-6 h-6" />
            </div>
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#D9A441] font-bold block">
              Staff & Management Access
            </span>
            <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-[#F6EFE3]">
              NEWFORM PORTAL
            </h1>
            <p className="text-xs text-[#F6EFE3]/70 leading-relaxed font-light">
              Sign in with your authorized Google staff account to manage live menu pricing, table bookings, customer inquiries, and operational site settings.
            </p>
          </div>

          {loginError && (
            <div className="p-3.5 bg-red-950/70 border border-red-500/40 rounded-lg text-xs text-red-200 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span className="leading-relaxed">{loginError}</span>
            </div>
          )}

          <div className="space-y-3 pt-2">
            {/* Primary Google Login with strict popup method */}
            <button
              onClick={handleGoogleLogin}
              disabled={isLoggingIn}
              className="w-full py-3.5 px-4 bg-[#D9A441] hover:bg-[#e6b14d] text-[#14110F] font-bold text-xs uppercase tracking-widest rounded-xl transition-all duration-200 flex items-center justify-center gap-3 cursor-pointer shadow-lg shadow-[#D9A441]/20 active:scale-98 disabled:opacity-50"
            >
              {isLoggingIn ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
              )}
              <span>Sign In with Staff Account</span>
            </button>
          </div>

          <div className="pt-4 border-t border-white/10 text-center space-y-1">
            <p className="text-[11px] text-[#F6EFE3]/50">
              Newform Restaurant Management · Mandayapuram, Kalpetta
            </p>
            <p className="text-[10px] text-[#D9A441]/80 font-mono">
              Authorized Administrator: {AUTHORIZED_ADMIN_EMAILS[0]}
            </p>
          </div>
        </div>

        <div className="text-center text-[11px] text-[#F6EFE3]/40 pb-6">
          © {new Date().getFullYear()} Newform Restaurant. Internal management access only.
        </div>
      </div>
    );
  }

  // 3. Authenticated & Verified Staff Portal (Only renders when isAuthorizedAdmin is true)
  return (
    <div className="min-h-screen bg-[#14110F] text-[#F6EFE3] flex flex-col film-grain">
      {/* Top Staff Navigation Header */}
      <header className="sticky top-0 z-40 bg-[#14110F]/95 backdrop-blur-md border-b border-[#D9A441]/20 py-3.5 px-6 shadow-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Brand & Badge */}
          <div className="flex items-center gap-3">
            <span className="font-editorial text-xl font-bold tracking-[0.16em] text-[#F6EFE3]">
              NEWFORM
            </span>
            <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-[#D9A441]/15 text-[#D9A441] text-[10px] font-bold uppercase tracking-widest border border-[#D9A441]/30">
              Staff Portal
            </span>
          </div>

          {/* User status & Actions */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 text-xs text-[#F6EFE3]/70 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span className="max-w-[200px] truncate">
                {currentUser.email}
              </span>
            </div>

            <button
              onClick={closeAdmin}
              className="px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-[#D9A441] hover:text-[#14110F] text-xs font-medium text-[#F6EFE3] transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <span>View Website</span>
              <ExternalLink className="w-3 h-3" />
            </button>

            <button
              onClick={handleSignOut}
              className="p-1.5 text-[#F6EFE3]/60 hover:text-rose-400 hover:bg-rose-950/40 rounded-full transition-colors cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto w-full px-6 md:px-12 py-8 flex-1 space-y-8">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-white/10">
          <button
            onClick={() => setActiveTab('menu')}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold tracking-wider uppercase transition-all duration-200 flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'menu'
                ? 'bg-[#D9A441] text-[#14110F] shadow-lg shadow-[#D9A441]/20 font-bold -translate-y-0.5'
                : 'bg-[#1c1815] text-[#F6EFE3]/70 hover:text-white hover:bg-white/5 border border-white/5'
            }`}
          >
            <UtensilsCrossed className="w-4 h-4" />
            <span>Menu & Prices</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold tracking-wider uppercase transition-all duration-200 flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'settings'
                ? 'bg-[#D9A441] text-[#14110F] shadow-lg shadow-[#D9A441]/20 font-bold -translate-y-0.5'
                : 'bg-[#1c1815] text-[#F6EFE3]/70 hover:text-white hover:bg-white/5 border border-white/5'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Site Settings</span>
            {siteSettings.noticeBanner && (
              <span className="w-2 h-2 rounded-full bg-[#D9A441] animate-ping" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('inquiries')}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold tracking-wider uppercase transition-all duration-200 flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'inquiries'
                ? 'bg-[#D9A441] text-[#14110F] shadow-lg shadow-[#D9A441]/20 font-bold -translate-y-0.5'
                : 'bg-[#1c1815] text-[#F6EFE3]/70 hover:text-white hover:bg-white/5 border border-white/5'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Guest Inquiries</span>
          </button>

          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold tracking-wider uppercase transition-all duration-200 flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'bookings'
                ? 'bg-[#D9A441] text-[#14110F] shadow-lg shadow-[#D9A441]/20 font-bold -translate-y-0.5'
                : 'bg-[#1c1815] text-[#F6EFE3]/70 hover:text-white hover:bg-white/5 border border-white/5'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Table Bookings</span>
          </button>
        </div>

        {/* Tab Content Display */}
        <div>
          {activeTab === 'menu' && <AdminMenuSection />}
          {activeTab === 'settings' && <AdminSettingsSection />}
          {activeTab === 'inquiries' && <AdminInquiriesSection />}
          {activeTab === 'bookings' && <AdminBookingsSection />}
        </div>
      </div>
    </div>
  );
};
