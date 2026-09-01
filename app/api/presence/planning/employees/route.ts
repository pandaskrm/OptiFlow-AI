import {
  NextRequest,
  NextResponse,
} from "next/server";

import { getCurrentSession } from "../../../../../lib/auth/session";
import { getPresencePlanning } from "../../../../../lib/presence/planning";

function readPeriod(request: NextRequest) {
  const params =
    request.nextUrl.searchParams;

  const now = new Date();

  const year =
    Number(params.get("year")) ||
    now.getUTCFullYear();

  const monthParam =
    params.get("month");

  const month =
    monthParam === null
      ? undefined
      : Number(monthParam);

  if (
    !Number.isInteger(year) ||
    year < 2020 ||
    year > 2100
  ) {
    return null;
  }

  if (
    month !== undefined &&
    (
      !Number.isInteger(month) ||
      month < 1 ||
      month > 12
    )
  ) {
    return null;
  }

  return {
    year,
    month,
  };
}

export async function GET(
  request: NextRequest,
) {
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

  const period =
    readPeriod(request);

  if (!period) {
    return NextResponse.json(
      {
        error: "INVALID_PERIOD",
      },
      {
        status: 400,
      },
    );
  }

  const planning =
    await getPresencePlanning(
      session.company.id,
      "EMPLOYEES",
      period,
    );

  return NextResponse.json(planning);
}
