import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail, User, Phone, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext.js';
import { useToast } from '../context/ToastContext.js';
import { Button } from '../components/common/Button.js';
import { Input } from '../components/common/Input.js';
import { HeritageLogo } from '../components/common/HeritageLogo.js';
import { GoogleAuthButton } from '../components/common/GoogleAuthButton.js';

export const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'buyer' | 'seller'>('buyer');
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [loading, setLoading] = useState(false);

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
        {/* Real Direct Google OAuth Button */}
        <GoogleAuthButton
          text="signup_with"
          onSuccess={() => navigate('/dashboard')}
        />

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

          {/* Terms & Conditions Checkbox */}
          <label className="flex items-start gap-2.5 text-xs text-text-secondary cursor-pointer select-none">
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded border-border bg-surface text-accent focus:ring-accent accent-[#E10600] cursor-pointer"
            />
            <span>
              I agree to the{' '}
              <Link to="/about" className="text-accent underline hover:text-white">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to="/about" className="text-accent underline hover:text-white">
                Privacy Policy
              </Link>
            </span>
          </label>

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
    </div>
  );
};
