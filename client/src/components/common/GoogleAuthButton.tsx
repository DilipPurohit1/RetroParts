import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { User, X, Plus, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.js';
import { useToast } from '../../context/ToastContext.js';

interface GoogleAuthButtonProps {
  onSuccess?: () => void;
  text?: 'signin_with' | 'signup_with' | 'continue_with';
}

export const GoogleAuthButton: React.FC<GoogleAuthButtonProps> = ({
  text = 'continue_with',
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [isChooserOpen, setIsChooserOpen] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customEmail, setCustomEmail] = useState('');
  const [showAddAccount, setShowAddAccount] = useState(false);

  const { googleSignIn } = useAuth();
  const { error } = useToast();

  const getButtonText = () => {
    if (text === 'signup_with') return 'Sign up with Google';
    if (text === 'signin_with') return 'Sign in with Google';
    return 'Continue with Google';
  };

  const handleSelectAccount = async (account: { name: string; email: string }) => {
    try {
      setLoading(true);
      const ok = await googleSignIn({
        email: account.email,
        name: account.name,
        avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(account.email)}`,
      });

      if (ok) {
        setIsChooserOpen(false);
        if (onSuccess) onSuccess();
      }
    } catch (err: any) {
      error(err.message || 'Google Sign-In failed.', 'Authentication Error');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCustomAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customEmail || !customName) return;
    if (!customEmail.includes('@') || !customEmail.includes('.')) {
      error('Please enter a valid Google email address.', 'Invalid Email');
      return;
    }
    await handleSelectAccount({ name: customName, email: customEmail.trim().toLowerCase() });
  };

  const chooserModal = isChooserOpen ? (
    <div
      className="fixed inset-0 !z-[999999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in text-left text-[#E5E5E5]"
      onClick={() => setIsChooserOpen(false)}
    >
      <div
        className="relative w-full max-w-sm bg-[#181818] border border-[#2E2E2E] rounded-2xl shadow-2xl p-6 space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Google Header */}
        <div className="flex items-center justify-between border-b border-[#262626] pb-4">
          <div className="flex items-center gap-2.5">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span className="font-medium text-sm text-white">Sign in with Google</span>
          </div>

          <button
            type="button"
            onClick={() => setIsChooserOpen(false)}
            className="text-[#888888] hover:text-white p-1 rounded hover:bg-[#262626] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-1 text-center">
          <h3 className="text-base font-bold text-white">Choose an account</h3>
          <p className="text-xs text-[#888888]">to continue to <span className="text-[#E10600] font-semibold">RetroParts Vintage</span></p>
        </div>

        {!showAddAccount ? (
          <div className="space-y-2">
            {/* Quick Account 1: Dilip Purohit */}
            <button
              type="button"
              disabled={loading}
              onClick={() =>
                handleSelectAccount({
                  name: 'Dilip Purohit',
                  email: 'dilippurohitdilippurohit70823@gmail.com',
                })
              }
              className="w-full p-3 rounded-xl bg-[#222222] hover:bg-[#2A2A2A] border border-[#2E2E2E] flex items-center gap-3 transition-colors text-left group"
            >
              <div className="w-9 h-9 rounded-full bg-[#E10600]/20 border border-[#E10600]/40 text-[#E10600] font-bold flex items-center justify-center text-sm shrink-0">
                DP
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-xs text-white group-hover:text-[#E10600] truncate">
                  Dilip Purohit
                </p>
                <p className="text-[11px] text-[#888888] truncate font-mono">
                  dilippurohitdilippurohit70823@gmail.com
                </p>
              </div>
            </button>

            {/* Option to use another Google account */}
            <button
              type="button"
              onClick={() => setShowAddAccount(true)}
              className="w-full p-3 rounded-xl bg-[#1D1D1D] hover:bg-[#262626] border border-dashed border-[#3A3A3A] flex items-center gap-3 transition-colors text-left group"
            >
              <div className="w-9 h-9 rounded-full bg-[#2A2A2A] text-white flex items-center justify-center shrink-0">
                <Plus className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-[#CCCCCC] group-hover:text-white">
                Use another Google account
              </span>
            </button>
          </div>
        ) : (
          <form onSubmit={handleAddCustomAccount} className="space-y-3">
            <div>
              <label className="block text-[11px] font-bold text-[#888888] uppercase mb-1 font-mono">
                Your Full Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Ram Kumar"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                className="w-full bg-[#222222] border border-[#2E2E2E] rounded px-3 py-2 text-xs text-white outline-none focus:border-[#E10600]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#888888] uppercase mb-1 font-mono">
                Google Email Address
              </label>
              <input
                type="email"
                required
                placeholder="e.g. ram@gmail.com"
                value={customEmail}
                onChange={(e) => setCustomEmail(e.target.value)}
                className="w-full bg-[#222222] border border-[#2E2E2E] rounded px-3 py-2 text-xs text-white outline-none focus:border-[#E10600]"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddAccount(false)}
                className="flex-1 py-2 rounded text-xs font-bold text-[#888888] hover:text-white bg-[#222222] border border-[#2E2E2E]"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-2 rounded text-xs font-bold text-white bg-[#E10600] hover:bg-[#B20404] transition-colors"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </div>
          </form>
        )}

        <div className="pt-2 text-center text-[11px] text-[#777777]">
          <span>To continue, Google will share your name, email address, and profile picture with RetroParts.</span>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <>
      <button
        type="button"
        disabled={loading}
        onClick={() => setIsChooserOpen(true)}
        className="w-full py-2.5 px-4 rounded border border-border bg-surface hover:bg-surface-raised text-text-primary text-[14px] font-medium flex items-center justify-center gap-3 transition-colors cursor-pointer shadow-sm disabled:opacity-50"
      >
        <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
          />
        </svg>
        <span>{getButtonText()}</span>
      </button>

      {typeof document !== 'undefined' && chooserModal ? createPortal(chooserModal, document.body) : chooserModal}
    </>
  );
};
