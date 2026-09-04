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
      user: true,
      membership: {
        include: {
          company: true,
        },
      },
    },
  });

  if (
    !session ||
    session.revokedAt ||
    session.expiresAt <= new Date() ||
    !session.user.isActive ||
    !session.membership.isActive ||
    !session.membership.company.isActive ||
    session.membership.userId !== session.userId
  ) {
    return null;
  }

  return {
    session,
    user: session.user,
    membership: session.membership,
    company: session.membership.company,
  };
}
