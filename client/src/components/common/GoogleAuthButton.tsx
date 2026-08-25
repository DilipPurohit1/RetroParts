import React, { useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext.js';
import { useToast } from '../../context/ToastContext.js';

interface GoogleAuthButtonProps {
  onSuccess?: () => void;
  text?: 'signin_with' | 'signup_with' | 'continue_with';
  onFallbackClick?: () => void;
}

export const GoogleAuthButton: React.FC<GoogleAuthButtonProps> = ({
  onSuccess,
  text = 'continue_with',
  onFallbackClick,
}) => {
  const buttonRef = useRef<HTMLDivElement>(null);
  const { googleSignIn } = useAuth();
  const { success, error } = useToast();

  const handleCredentialResponse = async (response: any) => {
    try {
      if (!response.credential) {
        error('No Google credential returned.', 'Sign-In Error');
        return;
      }

      // Decode the real Google ID Token JWT payload
      const base64Url = response.credential.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      const googleUser = JSON.parse(jsonPayload);

      const realEmail = googleUser.email;
      const realName = googleUser.name || googleUser.given_name || realEmail.split('@')[0];
      const realAvatar = googleUser.picture || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(realEmail)}`;

      const ok = await googleSignIn({
        email: realEmail,
        name: realName,
        avatar: realAvatar,
      });

      if (ok) {
        success(`Welcome, ${realName}! Signed in with Google.`, 'Google Sign-In');
        if (onSuccess) onSuccess();
      }
    } catch (err: any) {
      console.error('Google Sign-In parsing error:', err);
      error('Failed to authenticate Google account.', 'Authentication Error');
    }
  };

  useEffect(() => {
    const clientId =
      import.meta.env.VITE_GOOGLE_CLIENT_ID ||
      '954841961603-o1k8i3b1tflc4u6a8h2p29t3o34t83e8.apps.googleusercontent.com';

    if (window.google?.accounts?.id && buttonRef.current) {
      try {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: handleCredentialResponse,
          auto_select: false,
          cancel_on_tap_outside: true,
        });

        buttonRef.current.innerHTML = '';
        window.google.accounts.id.renderButton(buttonRef.current, {
          theme: 'outline',
          size: 'large',
          type: 'standard',
          shape: 'rectangular',
          text,
          logo_alignment: 'left',
          width: '100%',
        });
      } catch (err) {
        console.warn('Google GSI initialization notice:', err);
      }
    }
  }, [text]);

  return (
    <div className="w-full relative">
      {/* Official Google GSI Render Mount */}
      <div ref={buttonRef} className="w-full flex items-center justify-center min-h-[42px]" />

      {/* Styled Fallback / Trigger Button */}
      <button
        type="button"
        onClick={() => {
          if (window.google?.accounts?.id) {
            window.google.accounts.id.prompt();
          }
          if (onFallbackClick) {
            onFallbackClick();
          }
        }}
        className="w-full py-2.5 px-4 rounded border border-border bg-surface hover:bg-surface-raised text-text-primary text-[14px] font-medium flex items-center justify-center gap-3 transition-colors mt-1"
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
    </div>
  );
};
