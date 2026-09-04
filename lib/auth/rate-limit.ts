import crypto from "node:crypto";

import { prisma } from "../prisma";

type RateLimitOptions = {
  action: string;
  identifier: string;
  limit: number;
  windowMs: number;
};

export type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
};

type RateLimitRow = {
  count: number;
  expiresAt: Date;
};

function hashIdentifier(value: string) {
  return crypto
    .createHash("sha256")
    .update(value)
    .digest("hex");
}

export function getRequestIp(headers: Headers) {
  const forwardedFor = headers.get("x-forwarded-for") ?? "";

  return (
    forwardedFor.split(",")[0]?.trim() ||
    headers.get("x-real-ip")?.trim() ||
    "unknown"
  );
}

export async function consumeRateLimit(
  options: RateLimitOptions,
): Promise<RateLimitResult> {
  const now = new Date();
  const expiresAt = new Date(now.getTime() + options.windowMs);
  const keyHash = hashIdentifier(options.identifier);
  const id = crypto.randomUUID();

  const rows = await prisma.$queryRaw<RateLimitRow[]>`
    INSERT INTO "AuthRateLimit"
      (
        "id",
        "keyHash",
        "action",
        "count",
        "windowStart",
        "expiresAt",
        "createdAt",
        "updatedAt"
      )
    VALUES
      (
        ${id},
        ${keyHash},
        ${options.action},
        1,
        ${now},
        ${expiresAt},
        ${now},
        ${now}
      )
    ON CONFLICT ("keyHash", "action")
    DO UPDATE SET
      "count" =
        CASE
          WHEN "AuthRateLimit"."expiresAt" <= ${now}
            THEN 1
          ELSE "AuthRateLimit"."count" + 1
        END,
      "windowStart" =
        CASE
          WHEN "AuthRateLimit"."expiresAt" <= ${now}
            THEN ${now}
          ELSE "AuthRateLimit"."windowStart"
        END,
      "expiresAt" =
        CASE
          WHEN "AuthRateLimit"."expiresAt" <= ${now}
            THEN ${expiresAt}
          ELSE "AuthRateLimit"."expiresAt"
        END,
      "updatedAt" = ${now}
    RETURNING
      "count",
      "expiresAt"
  `;

  const row = rows[0];

  if (!row) {
    throw new Error("Rate limit counter could not be updated.");
  }

  const allowed = row.count <= options.limit;

  return {
    allowed,
    remaining: Math.max(options.limit - row.count, 0),
    retryAfterSeconds: allowed
      ? 0
      : Math.max(
          Math.ceil(
            (row.expiresAt.getTime() - now.getTime()) / 1000,
          ),
          1,
        ),
  };
}

export async function clearRateLimit(
  action: string,
  identifier: string,
) {
  const keyHash = hashIdentifier(identifier);

  await prisma.authRateLimit.deleteMany({
    where: {
      keyHash,
      action,
    },
  });
}
