import { NextResponse } from "next/server";

import { getCurrentSession } from "../../../../lib/auth/session";
import { synchronizeMicrosoftMailbox } from "../../../../lib/mail/mailSyncService";

export async function POST() {
  const session = await getCurrentSession();

  if (!session) {
    return NextResponse.json(
      { error: "Non authentifié." },
      { status: 401 },
    );
  }

  if (
    session.membership.role !== "ADMIN" &&
    session.membership.role !== "OWNER" &&
    session.membership.role !== "LOGISTICS_MANAGER"
  ) {
    return NextResponse.json(
      { error: "Droits insuffisants." },
      { status: 403 },
    );
  }

  try {
    const result =
      await synchronizeMicrosoftMailbox({
        companyId: session.company.id,
        actorId: session.user.id,
      });

    return NextResponse.json({
      success: true,
      message:
        result.imported > 0
          ? `${result.imported} nouvel e-mail importé dans OptiFlow AI.`
          : "La boîte est à jour. Aucun nouvel e-mail.",
      result,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Synchronisation impossible.",
      },
      { status: 502 },
    );
  }
}
