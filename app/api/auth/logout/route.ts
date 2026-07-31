import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { getCurrentSession } from "../../../../lib/auth/session";
import { prisma } from "../../../../lib/prisma";

export async function POST() {
  const auth = await getCurrentSession();

  if (auth) {
    await prisma.session.update({
      where: {
        id: auth.session.id,
      },
      data: {
        revokedAt: new Date(),
      },
    });
  }

  const cookieStore = await cookies();

  cookieStore.set("optiflow_session", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: new Date(0),
    path: "/",
  });

  return NextResponse.json({
    success: true,
  });
}