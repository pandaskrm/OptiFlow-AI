import crypto from "node:crypto";

import { NextResponse } from "next/server";

import { getCurrentSession } from "../../../../lib/auth/session";
import { prisma } from "../../../../lib/prisma";
import {
  businessDateFromKey,
  dateKeyInTimeZone,
  normalizeTimeZone,
  zonedDateTimeToUtc,
} from "../../../../lib/presence/timezone";

type QrType = "ARRIVAL" | "DEPARTURE";

type CreateQrBody = {
  type?: unknown;
  workDate?: unknown;
};

const MANAGER_ROLES = new Set([
  "ADMIN",
  "LOGISTICS_MANAGER",
  "TEAM_LEADER",
]);

function hashToken(token: string) {
  return crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
}

function readQrType(value: unknown): QrType | null {
  if (value !== "ARRIVAL" && value !== "DEPARTURE") {
    return null;
  }

  return value;
}

function readWorkDate(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.trim();

  if (!/^\d{4}-\d{2}-\d{2}$/.test(normalized)) {
    return null;
  }

  const date = new Date(`${normalized}T12:00:00.000Z`);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  if (date.toISOString().slice(0, 10) !== normalized) {
    return null;
  }

  return normalized;
}

function dateKeyToDatabaseDate(dateKey: string) {
  return businessDateFromKey(
    dateKey,
  );
}

function buildValidityWindow(
  dateKey: string,
  type: QrType,
  timeZone: string,
) {
  /*
   * The QR belongs to one OrganIA local work date.
   *
   * The database keeps an absolute UTC instant for validity,
   * while the boundaries are calculated from the warehouse
   * timezone. ARRIVAL and DEPARTURE remain separate sessions.
   *
   * Employee schedule validation is still performed when scanned.
   */
  void type;

  return {
    validFrom:
      zonedDateTimeToUtc(
        dateKey,
        "00:00:00",
        timeZone,
      ),

    validUntil:
      zonedDateTimeToUtc(
        dateKey,
        "23:59:59",
        timeZone,
      ),
  };
}

function createPublicToken() {
  return crypto.randomBytes(32).toString("base64url");
}

export async function POST(request: Request) {
  try {
    const session = await getCurrentSession();

    if (!session) {
      return NextResponse.json(
        { error: "Authentification requise." },
        { status: 401 },
      );
    }

    if (!MANAGER_ROLES.has(session.membership.role)) {
      return NextResponse.json(
        {
          error:
            "Vous n'avez pas l'autorisation de generer les QR de presence.",
        },
        { status: 403 },
      );
    }

    let body: CreateQrBody;

    try {
      body = (await request.json()) as CreateQrBody;
    } catch {
      return NextResponse.json(
        { error: "Corps de requete invalide." },
        { status: 400 },
      );
    }

    const type = readQrType(body.type);
    const dateKey = readWorkDate(body.workDate);

    if (!type) {
      return NextResponse.json(
        {
          error:
            "Type QR invalide. Valeurs autorisees : ARRIVAL, DEPARTURE.",
        },
        { status: 400 },
      );
    }

    if (!dateKey) {
      return NextResponse.json(
        {
          error:
            "Date invalide. Format attendu : YYYY-MM-DD.",
        },
        { status: 400 },
      );
    }

    const companyId = session.company.id;

    const warehouse =
      await prisma.warehouse.findFirst({
        where: {
          companyId,
          isActive: true,
        },
        orderBy: {
          createdAt: "asc",
        },
        select: {
          timezone: true,
        },
      });

    const timeZone =
      normalizeTimeZone(
        warehouse?.timezone,
      );

    const todayKey =
      dateKeyInTimeZone(
        new Date(),
        timeZone,
      );

    const todayDate =
      businessDateFromKey(
        todayKey,
      );

    const tomorrowDate =
      new Date(
        todayDate.getTime() +
          24 * 60 * 60 * 1000,
      );

    const tomorrowKey =
      tomorrowDate
        .toISOString()
        .slice(0, 10);

    if (
      dateKey !== todayKey &&
      dateKey !== tomorrowKey
    ) {
      return NextResponse.json(
        {
          error:
            "Un QR Presence peut uniquement etre genere pour aujourd'hui ou demain.",
          allowedDates: {
            today: todayKey,
            tomorrow: tomorrowKey,
          },
        },
        {
          status: 400,
        },
      );
    }

    const workDate =
      dateKeyToDatabaseDate(
        dateKey,
      );

    /*
     * If an active QR already exists for this company/date/type,
     * deactivate it before creating the replacement.
     *
     * This allows safe regeneration if a printed QR is lost
     * or compromised.
     */

    const publicToken = createPublicToken();
    const tokenHash = hashToken(publicToken);
    const tokenHint = publicToken.slice(-6);

    const { validFrom, validUntil } =
      buildValidityWindow(
        dateKey,
        type,
        timeZone,
      );

    const qrSession = await prisma.$transaction(
      async (transaction) => {
        await transaction.presenceQrSession.updateMany({
          where: {
            companyId,
            workDate,
            type,
            isActive: true,
          },
          data: {
            isActive: false,
          },
        });

        const created =
          await transaction.presenceQrSession.create({
            data: {
              companyId,
              workDate,
              type,
              tokenHash,
              tokenHint,
              validFrom,
              validUntil,
              isActive: true,
              createdBy: session.user.id,
            },
          });

        await transaction.auditLog.create({
          data: {
            companyId,
            actorId: session.user.id,
            action: "PRESENCE_QR_CREATED",
            entityType: "PresenceQrSession",
            entityId: created.id,
            details: JSON.stringify({
              workDate: dateKey,
              type,
              validFrom: validFrom.toISOString(),
              validUntil: validUntil.toISOString(),
            }),
          },
        });

        return created;
      },
    );

    /*
     * The raw token is returned ONCE here so the caller can
     * encode it inside the QR image.
     *
     * Only its SHA-256 hash remains in the database.
     */

    return NextResponse.json(
      {
        success: true,
        qr: {
          id: qrSession.id,
          company: {
            id: session.company.id,
            name: session.company.name,
          },
          workDate: dateKey,
          type,
          token: publicToken,
          validFrom: qrSession.validFrom,
          validUntil: qrSession.validUntil,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Presence QR creation error:", error);

    return NextResponse.json(
      {
        error:
          "Impossible de generer le QR de presence.",
      },
      { status: 500 },
    );
  }
}
