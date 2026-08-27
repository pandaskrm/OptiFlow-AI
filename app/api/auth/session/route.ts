import { NextResponse } from "next/server";

import { getCurrentSession } from "../../../../lib/auth/session";

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

  return NextResponse.json({
    user: {
      id: auth.user.id,
      email: auth.user.email,
      firstName: auth.user.firstName,
      lastName: auth.user.lastName,
    },
    company: {
      id: auth.company.id,
      name: auth.company.name,
    },
    role: auth.membership.role,
  });
}
