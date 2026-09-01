import { NextResponse } from "next/server";

import { getCurrentSession } from "../../../../../lib/auth/session";
import { getPresencePlanning } from "../../../../../lib/presence/planning";

export async function GET() {
  const session = await getCurrentSession();

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

  const planning = await getPresencePlanning(
    session.company.id,
    "TEMPORARY",
  );

  return NextResponse.json(planning);
}
