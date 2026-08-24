import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { User } from '../models/User.js';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || 'mock_google_client_id';
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || 'mock_google_client_secret';
const GOOGLE_CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5000/api/auth/google/callback';

export const setupPassport = () => {
  // Only register GoogleStrategy if client ID is configured
  if (GOOGLE_CLIENT_ID && GOOGLE_CLIENT_ID !== 'your_google_client_id_from_gcp_console.apps.googleusercontent.com') {
    passport.use(
      new GoogleStrategy(
        {
          clientID: GOOGLE_CLIENT_ID,
          clientSecret: GOOGLE_CLIENT_SECRET,
          callbackURL: GOOGLE_CALLBACK_URL,
          scope: ['profile', 'email'],
        },
        async (accessToken, refreshToken, profile, done) => {
          try {
            const email = profile.emails?.[0]?.value?.toLowerCase();
            const googleId = profile.id;
            const name = profile.displayName || `${profile.name?.givenName || ''} ${profile.name?.familyName || ''}`.trim() || 'Retro Enthusiast';
            const avatar = profile.photos?.[0]?.value || '';

            if (!email) {
              return done(new Error('No email found in Google profile'), undefined);
            }

            // 1. Check if user already linked with this googleId
            let user = await User.findOne({ googleId });
            if (user) {
              return done(null, user);
            }

            // 2. Check if user exists with the same email (Account Linking)
            user = await User.findOne({ email });
            if (user) {
              user.googleId = googleId;
              if (user.authProvider === 'local') {
                user.authProvider = 'both';
              }
              if (!user.avatar && avatar) {
                user.avatar = avatar;
              }
              await user.save();
              return done(null, user);
            }

            // 3. Create new Google OAuth user
            const newUser = await User.create({
              name,
              email,
              googleId,
              authProvider: 'google',
              avatar: avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
              role: 'buyer',
            });

            return done(null, newUser);
          } catch (error) {
            return done(error, undefined);
          }
        }
      )
    );
  }

  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });
};
