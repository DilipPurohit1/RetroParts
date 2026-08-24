import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail, User, Phone, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext.js';
import { useToast } from '../context/ToastContext.js';
import { Button } from '../components/common/Button.js';
import { Input } from '../components/common/Input.js';
import { HeritageLogo } from '../components/common/HeritageLogo.js';
import { GoogleSignInModal } from '../components/common/GoogleSignInModal.js';

export const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'buyer' | 'seller'>('buyer');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);

  const { register } = useAuth();
  const { error } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) return;

    if (password !== confirmPassword) {
      error('Passwords do not match.', 'Validation Error');
      return;
    }

    if (password.length < 6) {
      error('Password must be at least 6 characters.', 'Validation Error');
      return;
    }

    if (!agreeTerms) {
      error('You must agree to the terms and conditions.', 'Validation Error');
      return;
    }

    setLoading(true);
    const success = await register({
      name,
      email,
      phone,
      password,
      role,
    });
    setLoading(false);
    if (success) {
      navigate('/dashboard');
    }
  };

  const handleGoogleSignup = () => {
    setIsGoogleModalOpen(true);
  };

  return (
    <div className="max-w-lg mx-auto px-4 pt-32 pb-20 space-y-6 min-h-[85vh] flex flex-col justify-center text-[#E5E5E5] bg-transparent">
      {/* Brand Header */}
      <div className="text-center space-y-2 flex flex-col items-center">
        <HeritageLogo size="lg" variant="stacked" />
        <h1 className="text-2xl font-display font-black uppercase text-white pt-2">
          Create Your Enthusiast Account
        </h1>
        <p className="text-xs text-[#888888]">
          Join the dedicated marketplace for rare & vintage automotive spares
        </p>
      </div>

      {/* Registration Card */}
      <div className="p-6 sm:p-8 rounded-card bg-surface border border-border space-y-6">
        {/* Google OAuth Button */}
        <button
          type="button"
          onClick={handleGoogleSignup}
          className="w-full py-2.5 px-4 rounded border border-border bg-surface hover:bg-surface-raised text-text-primary text-[14px] font-medium flex items-center justify-center gap-3 transition-colors"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
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
          <span>Sign up with Google</span>
        </button>

        <div className="flex items-center gap-3">
          <div className="h-px bg-border flex-1" />
          <span className="text-[11px] uppercase font-medium text-text-muted">Or register with email</span>
          <div className="h-px bg-border flex-1" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Account Role Selector */}
          <div className="space-y-1.5">
            <label className="block text-[13px] font-medium text-text-secondary">Account type *</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole('buyer')}
                className={`p-3 rounded border text-[13px] font-medium transition-colors flex flex-col items-center gap-1 ${
                  role === 'buyer'
                    ? 'bg-accent-muted border-accent text-accent'
                    : 'bg-surface-raised border-border text-text-secondary hover:bg-surface hover:text-text-primary'
                }`}
              >
                <span>Classic enthusiast</span>
                <span className="text-[11px] text-text-muted">Buy & request spares</span>
              </button>

              <button
                type="button"
                onClick={() => setRole('seller')}
                className={`p-3 rounded border text-[13px] font-medium transition-colors flex flex-col items-center gap-1 ${
                  role === 'seller'
                    ? 'bg-accent-muted border-accent text-accent'
                    : 'bg-surface-raised border-border text-text-secondary hover:bg-surface hover:text-text-primary'
                }`}
              >
                <span>Stockist / restorer</span>
                <span className="text-[11px] text-text-muted">Sell vintage inventory</span>
              </button>
            </div>
          </div>

          <Input
            label="Full name *"
            type="text"
            placeholder="e.g. Vikramaditya Singh"
            value={name}
            onChange={(e) => setName(e.target.value)}
            leftIcon={<User className="w-4 h-4 text-text-muted" />}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Email address *"
              type="email"
              placeholder="restorer@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail className="w-4 h-4 text-text-muted" />}
              required
            />

            <Input
              label="Phone number"
              type="tel"
              placeholder="+91 98765 43210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              leftIcon={<Phone className="w-4 h-4 text-text-muted" />}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Password *"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftIcon={<Lock className="w-4 h-4 text-text-muted" />}
              required
            />

            <Input
              label="Confirm password *"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              leftIcon={<Lock className="w-4 h-4 text-text-muted" />}
              required
            />
          </div>

          <div className="p-3 rounded bg-surface-raised border border-border flex items-center gap-2.5 text-[12px] text-text-secondary">
            <ShieldCheck className="w-4 h-4 text-verified shrink-0" />
            <span>All buyer transactions are protected under RetroParts Escrow Inspection.</span>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full font-medium"
            isLoading={loading}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Create account
          </Button>
        </form>

        <div className="pt-2 text-center text-[13px] text-text-muted">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-accent hover:underline">
            Sign in here
          </Link>
        </div>
      </div>

      {/* Google Sign In Modal */}
      <GoogleSignInModal
        isOpen={isGoogleModalOpen}
        onClose={() => setIsGoogleModalOpen(false)}
        onSuccess={() => navigate('/dashboard')}
      />
    </div>
  );
};
