import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Lock, Mail, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext.js';
import { Button } from '../components/common/Button.js';
import { Input } from '../components/common/Input.js';
import { HeritageLogo } from '../components/common/HeritageLogo.js';
import { GoogleAuthButton } from '../components/common/GoogleAuthButton.js';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    const success = await login({ email, password });
    setLoading(false);
    if (success) {
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 pt-32 pb-20 space-y-6 min-h-[80vh] flex flex-col justify-center text-[#E5E5E5] bg-transparent">
      {/* Brand Header */}
      <div className="text-center space-y-2 flex flex-col items-center">
        <HeritageLogo size="lg" variant="stacked" />
        <h1 className="text-2xl font-display font-black uppercase text-white pt-2">
          Sign In to Your Account
        </h1>
        <p className="text-xs text-[#888888]">
          Manage your garage, rare parts bounties, and restorer messaging
        </p>
      </div>

      {/* Login Card */}
      <div className="p-6 sm:p-8 rounded-card bg-surface border border-border space-y-6">
        {/* Real Direct Google OAuth Button */}
        <GoogleAuthButton
          text="continue_with"
          onSuccess={() => navigate(from, { replace: true })}
        />

        <div className="flex items-center gap-3">
          <div className="h-px bg-border flex-1" />
          <span className="text-[11px] uppercase font-medium text-text-muted">Or with email</span>
          <div className="h-px bg-border flex-1" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email address *"
            type="email"
            placeholder="restorer@retroparts.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            leftIcon={<Mail className="w-4 h-4 text-text-muted" />}
            required
          />

          <Input
            label="Password *"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            leftIcon={<Lock className="w-4 h-4 text-text-muted" />}
            required
          />

          <div className="flex items-center justify-between text-[13px] text-text-secondary">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded text-accent border-border bg-surface focus:ring-accent"
              />
              <span>Remember me</span>
            </label>
            <span className="text-accent hover:underline cursor-pointer">Forgot password?</span>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full font-medium"
            isLoading={loading}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Sign in
          </Button>
        </form>

        {/* Register Link */}
        <div className="pt-2 text-center text-[13px] text-text-muted">
          Don't have an account yet?{' '}
          <Link to="/register" className="font-medium text-accent hover:underline">
            Register for free
          </Link>
        </div>
      </div>
    </div>
  );
};
