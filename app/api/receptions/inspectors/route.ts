import { NextResponse } from "next/server";

import { getCurrentSession } from "../../../../lib/auth/session";
import { prisma } from "../../../../lib/prisma";

export async function GET() {
  const auth = await getCurrentSession();

  if (!auth) {
    return NextResponse.json(
      {
        error: "Authentification requise.",
      },
      {
        status: 401,
      },
    );
  }

  const memberships =
    await prisma.membership.findMany({
      where: {
        companyId: auth.company.id,
        isActive: true,
        user: {
          isActive: true,
        },
      },

      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },

      orderBy: [
        {
          user: {
            firstName: "asc",
          },
        },
        {
          user: {
            lastName: "asc",
          },
        },
      ],
    });

  return NextResponse.json({
    success: true,

    inspectors: memberships.map(
      (membership) => ({
        membershipId: membership.id,
        userId: membership.user.id,
        firstName: membership.user.firstName,
        lastName: membership.user.lastName,
        role: membership.role,
      }),
    ),
  });
}
