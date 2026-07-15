import crypto from "node:crypto";

import { cookies } from "next/headers";

import { prisma } from "../prisma";

function hashToken(token: string) {
  return crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
}

export async function getCurrentSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("optiflow_session")?.value;

  if (!token) {
    return null;
  }

  const tokenHash = hashToken(token);

  const session = await prisma.session.findUnique({
    where: {
      tokenHash,
    },
    include: {
      user: {
        include: {
          memberships: {
            where: {
              isActive: true,
            },
            include: {
              company: true,
            },
          },
        },
      },
    },
  });

  if (
    !session ||
    session.revokedAt ||
    session.expiresAt <= new Date() ||
    !session.user.isActive
  ) {
    return null;
  }

  const membership = session.user.memberships[0];

  if (!membership) {
    return null;
  }

  return {
    session,
    user: session.user,
    membership,
    company: membership.company,
  };
}