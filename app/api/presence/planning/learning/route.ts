import {
  NextResponse,
} from "next/server";

import {
  getCurrentSession,
} from "../../../../../lib/auth/session";

import {
  refreshPresenceScheduleLearning,
} from "../../../../../lib/presence/schedule-learning";

const ALLOWED_ROLES =
  new Set([
    "ADMIN",
    "LOGISTICS_MANAGER",
    "TEAM_LEADER",
  ]);

export async function POST() {
  const session =
    await getCurrentSession();

  if (!session) {
    return NextResponse.json(
      {
        error: "UNAUTHORIZED",
      },
      {
        status: 401,
      },
    );
  }

  if (
    !ALLOWED_ROLES.has(
      session.membership.role,
    )
  ) {
    return NextResponse.json(
      {
        error: "FORBIDDEN",
      },
      {
        status: 403,
      },
    );
  }

  const result =
    await refreshPresenceScheduleLearning(
      session.company.id,
    );

  return NextResponse.json(
    result,
  );
}
