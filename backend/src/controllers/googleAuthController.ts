import type { Request, Response, NextFunction } from "express";
import passport from "../strategies/googleStrategy.js";
import { createToken } from "../services/tokenService.js";
import { createSession } from "../services/sessionService.js";

const FRONTEND_URL = process.env.FRONTEND_URL ?? "";

if(!FRONTEND_URL){
  throw new Error("Falta definir FRONTEND_URL en el .env");
}

export function googleAuth(req: Request, res: Response, next: NextFunction) {
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })(req, res, next);
}

export function googleCallback(req: Request, res: Response, next: NextFunction) {
  passport.authenticate(
    "google",
    { session: false },
    (err: unknown, user: any, info: any) => {
      if (err || !user) {
        const message = info?.message || "googleauth";
        return res.redirect(
          `${FRONTEND_URL}/login?error=${encodeURIComponent(message)}`,
        );
      }

      try {
        const { sessionId, refreshToken, refreshHash, expiresAt } = createToken(
          user.user_id,
        );
        createSession(user.user_id, sessionId, refreshHash, expiresAt);

        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          sameSite: "lax",
          secure: process.env.NODE_ENV === "production",
          maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.redirect(`${FRONTEND_URL}`);
      } catch (error) {
        console.error("Error en callback de Google", error);
        return res.redirect(
          `${FRONTEND_URL}/login?error=googleauth`,
        );
      }
    },
  )(req, res, next);
}