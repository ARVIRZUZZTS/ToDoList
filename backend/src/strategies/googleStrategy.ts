import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import type { Profile, VerifyCallback } from "passport-google-oauth20";
import { findUserByEmail, createGoogleUser } from "../services/userService.js";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID ?? "";
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET ?? "";
const GOOGLE_CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL ?? "";

if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
  throw new Error(
    "GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET deberian estar seteados en el .env",
  );
}

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: GOOGLE_CALLBACK_URL,
    },
    async (
      _accessToken: string,
      _refreshToken: string,
      profile: Profile,
      done: VerifyCallback,
    ) => {
      try {
        const email = profile.emails?.[0]?.value;
        if (!email) {
          return done(new Error("No se pudo obtener el email de Google"));
        }
        let user = await findUserByEmail(email);

        if (user) {
          if (user.password_hash && !user.google_id) {
            return done(null, false, {
              message:
                "Email ya registrado, inicie sesion con correo y contrasena",
            });
          }
        } else {
          user = await createGoogleUser({
            name: profile.displayName,
            email,
            google_id: profile.id,
          });
        }
        return done(null, user);
      } catch (error) {
        return done(error as Error);
      }
    },
  ),
);

export default passport;
