import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { storage } from "./storage";
import type { User } from "@shared/schema";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

const isGoogleAuthConfigured = !!(GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET);

if (!isGoogleAuthConfigured) {
  console.warn("⚠️  Google OAuth credentials not configured. Authentication will be disabled.");
  console.warn("   Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to enable Google login.");
}

const REPLIT_DOMAIN = process.env.REPLIT_DOMAINS?.split(',')[0] || 'localhost:5000';
const CALLBACK_URL = REPLIT_DOMAIN.includes('localhost')
  ? `http://${REPLIT_DOMAIN}/api/auth/google/callback`
  : `https://${REPLIT_DOMAIN}/api/auth/google/callback`;

if (isGoogleAuthConfigured) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: GOOGLE_CLIENT_ID!,
        clientSecret: GOOGLE_CLIENT_SECRET!,
        callbackURL: CALLBACK_URL,
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value;
          if (!email) {
            return done(new Error("No email found in Google profile"));
          }

          let user = await storage.getUserByEmail(email);
          
          if (!user) {
            user = await storage.createUser({
              email,
              name: profile.displayName,
              googleId: profile.id,
              picture: profile.photos?.[0]?.value,
            });
          } else if (!user.googleId) {
            user = await storage.updateUser(user.id, {
              googleId: profile.id,
              picture: profile.photos?.[0]?.value,
            });
          }

          done(null, user);
        } catch (error) {
          done(error as Error);
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
    const user = await storage.getUser(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

export { isGoogleAuthConfigured };
export default passport;
