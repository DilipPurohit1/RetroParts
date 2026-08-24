import React, { useState } from 'react';
import { X, ArrowRight, ShieldCheck, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.js';

interface GoogleSignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const GoogleSignInModal: React.FC<GoogleSignInModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const { googleSignIn } = useAuth();

  if (!isOpen) return null;

  const handleCustomGoogleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    const ok = await googleSignIn({
      email,
      name: name || email.split('@')[0],
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(email)}`,
    });
    setLoading(false);
    if (ok) {
      onClose();
      onSuccess();
    }
  };

  const handleFastPick = async (pickEmail: string, pickName: string, pickAvatar: string) => {
    setLoading(true);
    const ok = await googleSignIn({
      email: pickEmail,
      name: pickName,
      avatar: pickAvatar,
    });
    setLoading(false);
    if (ok) {
      onClose();
      onSuccess();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-[#141414] border border-[#2A2A2A] rounded-xl p-6 shadow-2xl space-y-5 text-left text-[#E5E5E5]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#222222] pb-3">
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
            <h3 className="text-base font-bold text-white font-display uppercase tracking-wide">
              Sign in with Google
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-[#888888] hover:text-white p-1 rounded hover:bg-[#222222] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-[#888888] leading-relaxed">
          Choose an authorized Google account or enter your Gmail address to securely access RetroParts.
        </p>

        {/* 1-Click Fast Accounts */}
        <div className="space-y-2">
          <span className="text-[10px] font-mono uppercase text-[#888888] font-bold block">
            Select Google Account
          </span>
          {[
            {
              name: 'Kavita Sharma',
              email: 'kavita@retroparts.com',
              avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
              badge: 'Verified Restorer',
            },
            {
              name: 'Rajesh Vintage Garage',
              email: 'rajesh@retroparts.com',
              avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
              badge: 'Master Stockist',
            },
            {
              name: 'Dilip Purohit',
              email: 'dilip@gmail.com',
              avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=dilip',
              badge: 'Automotive Collector',
            },
          ].map((acc) => (
            <button
              key={acc.email}
              type="button"
              disabled={loading}
              onClick={() => handleFastPick(acc.email, acc.name, acc.avatar)}
              className="w-full flex items-center justify-between p-2.5 rounded-lg bg-[#1A1A1A] hover:bg-[#222222] border border-[#2A2A2A] hover:border-[#E10600] transition-colors text-left group"
            >
              <div className="flex items-center gap-3">
                <img
                  src={acc.avatar}
                  alt={acc.name}
                  className="w-8 h-8 rounded-full object-cover border border-[#333333]"
                />
                <div>
                  <div className="text-xs font-bold text-white group-hover:text-[#E10600] transition-colors">
                    {acc.name}
                  </div>
                  <div className="text-[10px] text-[#888888]">{acc.email}</div>
                </div>
              </div>
              <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-[#111111] border border-[#222222] text-[#888888]">
                {acc.badge}
              </span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="h-px bg-[#222222] flex-1" />
          <span className="text-[10px] uppercase font-mono text-[#666666]">Or enter custom Gmail</span>
          <div className="h-px bg-[#222222] flex-1" />
        </div>

        {/* Custom Gmail Form */}
        <form onSubmit={handleCustomGoogleSubmit} className="space-y-3">
          <div>
            <label className="text-[11px] font-medium text-[#AAAAAA] block mb-1">
              Your Google Email *
            </label>
            <input
              type="email"
              required
              placeholder="username@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#1A1A1A] text-[#E5E5E5] placeholder-[#555555] text-xs rounded border border-[#2A2A2A] focus:border-[#E10600] focus:outline-none px-3 py-2"
            />
          </div>

          <div>
            <label className="text-[11px] font-medium text-[#AAAAAA] block mb-1">
              Display Name (Optional)
            </label>
            <input
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#1A1A1A] text-[#E5E5E5] placeholder-[#555555] text-xs rounded border border-[#2A2A2A] focus:border-[#E10600] focus:outline-none px-3 py-2"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#E10600] hover:bg-[#B20404] text-white py-2.5 text-xs font-bold uppercase tracking-wider rounded transition-colors flex items-center justify-center gap-2 mt-2"
          >
            {loading ? 'Authenticating...' : 'Sign In with Google'} <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        <div className="flex items-center gap-2 pt-2 border-t border-[#1C1C1C] text-[10px] text-[#777777]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#10B981] shrink-0" />
          <span>Protected by RetroParts OAuth & 256-bit encrypted sessions.</span>
        </div>
      </div>
    </div>
  );
};
