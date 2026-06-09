import type { Request, Response, NextFunction } from "express";
import passport from "../strategies/googleStrategy.js";

export function googleAuth(req: Request, res: Response, next: NextFunction) {
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })(req, res, next);
}