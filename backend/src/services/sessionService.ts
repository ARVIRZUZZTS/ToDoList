import type { Session } from "@prisma/client";
import prisma from "../config/db.js";

export async function createSession(
  userId: string,
  sessionId: string,
  tokenHash: string,
  expiresAt: string,
  userAgent?: string,
): Promise<Session> {
  return prisma.session.create({
    data: {
      session_id: sessionId,
      user_id : userId,
      token_hash: tokenHash,
      expires_at: expiresAt,
      user_agent: userAgent ?? null,
    },
  });
}

export async function findSessionBy(
  sessionId: string,
): Promise<Session | null> {
  return prisma.session.findUnique({
    where: {
      session_id:sessionId,
    },
  });
}

export async function revokeSession(sessionId: string): Promise<Session> {
  return prisma.session.update({
    where: {
      session_id: sessionId,
    },
    data: {
      revoked_at: new Date(),
    },
  });
}

export async function revokeAllUserSessions(userId: string): Promise<number> {
  const ans = await prisma.session.updateMany({
    where: {
      user_id: userId,
      revoked_at: null
    },
    data : {
      revoked_at: new Date()
    }
  });
  return ans.count;
}

