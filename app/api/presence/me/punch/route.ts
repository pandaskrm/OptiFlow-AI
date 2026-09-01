import crypto from "node:crypto";

import { NextResponse } from "next/server";

import { getCurrentSession } from "../../../../../lib/auth/session";
import { prisma } from "../../../../../lib/prisma";

type PunchBody = {
  token?: unknown;
};

function hashToken(token: string) {
  return crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
}

function readToken(
  value: unknown,
) {
  if (typeof value !== "string") {
    return null;
  }

  const token = value.trim();

  if (
    token.length < 20 ||
    token.length > 256
  ) {
    return null;
  }

  return token;
}

function utcDateKey(
  value: Date,
) {
  return value
    .toISOString()
    .slice(0, 10);
}

function utcDayOfWeek(
  value: Date,
) {
  /*
   * PresenceSchedule uses Monday = 1 ... Sunday = 7.
   *
   * We keep this consistent with the current Presence date storage.
   * Company timezone support will replace this UTC helper globally
   * rather than hardcoding LCA-specific timezone logic here.
   */
  const day = value.getUTCDay();

  return day === 0
    ? 7
    : day;
}

export async function POST(
  request: Request,
) {
  try {
    const session =
      await getCurrentSession();

    if (!session) {
      return NextResponse.json(
        {
          error:
            "Authentification requise.",
        },
        {
          status: 401,
        },
      );
    }

    let body: PunchBody;

    try {
      body =
        (await request.json()) as PunchBody;
    }
    catch {
      return NextResponse.json(
        {
          error:
            "Corps de requete invalide.",
        },
        {
          status: 400,
        },
      );
    }

    const token =
      readToken(body.token);

    if (!token) {
      return NextResponse.json(
        {
          error:
            "QR de presence invalide.",
        },
        {
          status: 400,
        },
      );
    }

    const workforce =
      await prisma.workforce.findFirst({
        where: {
          membershipId:
            session.membership.id,
          companyId:
            session.company.id,
          isActive: true,
          onboardingStatus: "ACTIVE",
        },
        select: {
          id: true,
          name: true,
        },
      });

    if (!workforce) {
      return NextResponse.json(
        {
          error:
            "Aucune fiche salarie active n'est liee a ce compte.",
        },
        {
          status: 403,
        },
      );
    }

    const now = new Date();

    const qr =
      await prisma.presenceQrSession.findUnique({
        where: {
          tokenHash:
            hashToken(token),
        },
        select: {
          id: true,
          companyId: true,
          workDate: true,
          type: true,
          validFrom: true,
          validUntil: true,
          isActive: true,
        },
      });

    if (
      !qr ||
      !qr.isActive ||
      qr.companyId !==
        session.company.id
    ) {
      return NextResponse.json(
        {
          error:
            "Ce QR de presence est invalide ou n'est plus actif.",
        },
        {
          status: 400,
        },
      );
    }

    if (
      now < qr.validFrom ||
      now > qr.validUntil
    ) {
      return NextResponse.json(
        {
          error:
            "Ce QR de presence n'est pas valable actuellement.",
        },
        {
          status: 400,
        },
      );
    }

    if (
      qr.type !== "ARRIVAL" &&
      qr.type !== "DEPARTURE"
    ) {
      return NextResponse.json(
        {
          error:
            "Type de QR de presence invalide.",
        },
        {
          status: 400,
        },
      );
    }

    /*
     * Prevent a QR from another work date being used merely because
     * its validity envelope was configured incorrectly.
     */
    const qrDateKey =
      utcDateKey(qr.workDate);

    const nowDateKey =
      utcDateKey(now);

    if (qrDateKey !== nowDateKey) {
      return NextResponse.json(
        {
          error:
            "Ce QR ne correspond pas a la journee de travail actuelle.",
        },
        {
          status: 400,
        },
      );
    }

    const dayOfWeek =
      utcDayOfWeek(qr.workDate);

    const schedule =
      await prisma.presenceSchedule.findFirst({
        where: {
          workforceId:
            workforce.id,
          dayOfWeek,
          isWorkingDay: true,

          AND: [
            {
              OR: [
                {
                  validFrom: null,
                },
                {
                  validFrom: {
                    lte: qr.workDate,
                  },
                },
              ],
            },
            {
              OR: [
                {
                  validUntil: null,
                },
                {
                  validUntil: {
                    gte: qr.workDate,
                  },
                },
              ],
            },
          ],
        },
        orderBy: [
          {
            validFrom: "desc",
          },
          {
            createdAt: "desc",
          },
        ],
        select: {
          id: true,
          morningStart: true,
          morningEnd: true,
          afternoonStart: true,
          afternoonEnd: true,
        },
      });

    if (!schedule) {
      return NextResponse.json(
        {
          error:
            "Aucun horaire de travail n'est planifie pour aujourd'hui.",
        },
        {
          status: 409,
        },
      );
    }

    const expectedPunchType =
      qr.type === "ARRIVAL"
        ? "IN"
        : "OUT";

    /*
     * Reject an accidental duplicate of the same QR action.
     *
     * The raw punch remains immutable once accepted.
     * A future correction goes through PresenceCorrection rather
     * than overwriting this record.
     */
    const existingPunch =
      await prisma.presencePunch.findFirst({
        where: {
          workforceId:
            workforce.id,
          type:
            expectedPunchType,
          punchedAt: {
            gte: qr.validFrom,
            lte: qr.validUntil,
          },
        },
        orderBy: {
          punchedAt: "desc",
        },
        select: {
          id: true,
          punchedAt: true,
        },
      });

    if (existingPunch) {
      return NextResponse.json(
        {
          error:
            expectedPunchType === "IN"
              ? "Votre arrivee est deja enregistree pour aujourd'hui."
              : "Votre depart est deja enregistre pour aujourd'hui.",
          punch: {
            type:
              expectedPunchType,
            punchedAt:
              existingPunch.punchedAt,
          },
        },
        {
          status: 409,
        },
      );
    }

    /*
     * A departure cannot exist without an arrival first.
     */
    if (
      expectedPunchType === "OUT"
    ) {
      const arrival =
        await prisma.presencePunch.findFirst({
          where: {
            workforceId:
              workforce.id,
            type: "IN",
            punchedAt: {
              gte: qr.validFrom,
              lte: qr.validUntil,
            },
          },
          orderBy: {
            punchedAt: "asc",
          },
          select: {
            id: true,
            punchedAt: true,
          },
        });

      if (!arrival) {
        return NextResponse.json(
          {
            error:
              "Aucune arrivee n'a ete enregistree aujourd'hui.",
          },
          {
            status: 409,
          },
        );
      }

      if (
        now <= arrival.punchedAt
      ) {
        return NextResponse.json(
          {
            error:
              "L'heure de depart doit etre posterieure a l'arrivee.",
          },
          {
            status: 409,
          },
        );
      }
    }

    const punch =
      await prisma.$transaction(
        async (transaction) => {
          const created =
            await transaction.presencePunch.create({
              data: {
                workforceId:
                  workforce.id,
                type:
                  expectedPunchType,
                punchedAt:
                  now,
                source:
                  "QR",
                note:
                  `QR:${qr.id}`,
              },
              select: {
                id: true,
                type: true,
                punchedAt: true,
                source: true,
              },
            });

          await transaction.auditLog.create({
            data: {
              companyId:
                session.company.id,
              actorId:
                session.user.id,
              action:
                "PRESENCE_QR_PUNCH",
              entityType:
                "PresencePunch",
              entityId:
                created.id,
              details:
                JSON.stringify({
                  workforceId:
                    workforce.id,
                  qrSessionId:
                    qr.id,
                  qrType:
                    qr.type,
                  punchType:
                    created.type,
                  punchedAt:
                    created.punchedAt.toISOString(),
                }),
            },
          });

          return created;
        },
      );

    return NextResponse.json(
      {
        success: true,

        employee: {
          id:
            workforce.id,
          name:
            workforce.name,
        },

        punch: {
          id:
            punch.id,
          type:
            punch.type,
          punchedAt:
            punch.punchedAt,
          source:
            punch.source,
        },

        schedule: {
          morningStart:
            schedule.morningStart,
          morningEnd:
            schedule.morningEnd,
          afternoonStart:
            schedule.afternoonStart,
          afternoonEnd:
            schedule.afternoonEnd,
        },
      },
      {
        status: 201,
      },
    );
  }
  catch (error) {
    console.error(
      "Presence employee QR punch error:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Impossible d'enregistrer le pointage.",
      },
      {
        status: 500,
      },
    );
  }
}
