import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { storage } from "./storage";
import type { User } from "@shared/schema";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
  throw new Error("Missing Google OAuth credentials");
}

const CALLBACK_URL = process.env.NODE_ENV === "production" 
  ? `${process.env.REPL_SLUG}.repl.co/api/auth/google/callback`
  : "http://localhost:5000/api/auth/google/callback";

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
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

export default passport;
