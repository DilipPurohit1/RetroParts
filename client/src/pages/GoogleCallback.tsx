import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js';
import { useToast } from '../context/ToastContext.js';
import { Loader2 } from 'lucide-react';

export const GoogleCallback: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  const { success, error } = useToast();

  useEffect(() => {
    const handleCallback = async () => {
      const token = searchParams.get('token');
      const errParam = searchParams.get('error');

      if (errParam || !token) {
        error('Google authentication failed or was cancelled.', 'Sign-In Error');
        navigate('/login');
        return;
      }

      try {
        localStorage.setItem('retroparts_token', token);
        await refreshUser();
        success('Signed in successfully with Google!', 'Welcome Back');
        navigate('/dashboard');
      } catch {
        error('Failed to initialize authenticated session.', 'Authentication Error');
        navigate('/login');
      }
    };

    handleCallback();
  }, [searchParams, navigate, refreshUser, success, error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4 p-8">
      <Loader2 className="w-10 h-10 text-retro-red animate-spin" />
      <div className="text-center space-y-1">
        <h2 className="text-lg font-bold text-slate-900 font-display">Authenticating with Google...</h2>
        <p className="text-xs text-slate-500 font-mono">Securing your session with RetroParts access tokens...</p>
      </div>
    </div>
  );
};
