import React, { useEffect, useRef, useState } from 'react';
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
  const buttonContainerRef = useRef<HTMLDivElement>(null);
  const { googleSignIn } = useAuth();
  const { error, success } = useToast();

  const handleCredentialResponse = async (response: any) => {
    try {
      setLoading(true);
      if (!response.credential) {
        throw new Error('No credential received from Google.');
      }

      // Decode the real Google ID Token JWT
      const base64Url = response.credential.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      const googleUser = JSON.parse(jsonPayload);

      // Authenticate with the user's real personal Google account details
      const ok = await googleSignIn({
        email: googleUser.email,
        name: googleUser.name || googleUser.email.split('@')[0],
        avatar: googleUser.picture,
        sub: googleUser.sub,
      });

      if (ok && onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      console.error('Google Auth Error:', err);
      error(err.message || 'Google authentication failed.', 'Error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initGoogleGSI = () => {
      const clientId =
        import.meta.env.VITE_GOOGLE_CLIENT_ID ||
        '954841961603-o1k8i3b1tflc4u6a8h2p29t3o34t83e8.apps.googleusercontent.com';

      if (typeof window !== 'undefined' && (window as any).google?.accounts?.id) {
        try {
          (window as any).google.accounts.id.initialize({
            client_id: clientId,
            callback: handleCredentialResponse,
            auto_select: false,
            cancel_on_tap_outside: true,
          });

          if (buttonContainerRef.current) {
            buttonContainerRef.current.innerHTML = '';
            (window as any).google.accounts.id.renderButton(buttonContainerRef.current, {
              type: 'standard',
              theme: 'filled_black',
              size: 'large',
              width: '100%',
              text: text === 'signup_with' ? 'signup_with' : 'signin_with',
              shape: 'rectangular',
              logo_alignment: 'left',
            });
          }
        } catch (e) {
          console.warn('Google GSI initialization notice:', e);
        }
      }
    };

    const timer = setTimeout(initGoogleGSI, 300);
    return () => clearTimeout(timer);
  }, [text]);

  const handleManualGoogleClick = async () => {
    try {
      setLoading(true);

      // Trigger Google One-Tap account prompt if available
      if (typeof window !== 'undefined' && (window as any).google?.accounts?.id) {
        (window as any).google.accounts.id.prompt((notification: any) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            console.log('Google One-Tap notification skipped or not displayed');
          }
        });
      }
    } catch (err: any) {
      error(err.message || 'Google Sign-In prompt failed.', 'Error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full space-y-2">
      {/* Official Google GSI Button Container */}
      <div
        ref={buttonContainerRef}
        className="w-full flex justify-center overflow-hidden rounded [&>div]:!w-full [&_iframe]:!w-full"
      />

      {/* Fallback Google Button if GSI iframe is still loading */}
      <noscript>
        <button
          type="button"
          disabled={loading}
          onClick={handleManualGoogleClick}
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
          <span>{loading ? 'Opening Google...' : 'Continue with Google'}</span>
        </button>
      </noscript>
    </div>
  );
};
