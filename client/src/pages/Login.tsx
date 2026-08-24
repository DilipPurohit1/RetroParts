import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Lock, Mail, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext.js';
import { DEMO_USERS } from '../utils/constants.js';
import { Button } from '../components/common/Button.js';
import { Input } from '../components/common/Input.js';
import { HeritageLogo } from '../components/common/HeritageLogo.js';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);

  const { login, demoLogin } = useAuth();
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

  const handleQuickDemoLogin = async (demoEmail: string) => {
    setLoading(true);
    const success = await demoLogin(demoEmail);
    setLoading(false);
    if (success) {
      navigate(from, { replace: true });
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = '/api/auth/google';
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
        {/* Google OAuth Button */}
        <button
          type="button"
          onClick={handleGoogleLogin}
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
          <span>Continue with Google</span>
        </button>

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

        {/* 1-Click Instant Demo Logins */}
        <div className="pt-4 border-t border-border space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase font-medium text-text-muted flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-accent" /> Instant 1-click demo accounts
            </span>
          </div>

          <div className="space-y-2">
            {DEMO_USERS.map((demo) => (
              <button
                key={demo.email}
                type="button"
                onClick={() => handleQuickDemoLogin(demo.email)}
                disabled={loading}
                className="w-full p-2.5 rounded bg-surface-raised border border-border hover:border-accent hover:bg-surface text-left transition-colors flex items-center justify-between group"
              >
                <div>
                  <span className="text-[13px] font-medium text-text-primary group-hover:text-accent transition-colors">
                    {demo.role}: {demo.name}
                  </span>
                  <p className="text-[11px] text-text-muted line-clamp-1">{demo.desc}</p>
                </div>
                <span className="text-[11px] font-medium text-accent px-2 py-0.5 rounded bg-surface border border-border shrink-0">
                  Login →
                </span>
              </button>
            ))}
          </div>
        </div>

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
