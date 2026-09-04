-- Bind every authentication session to one explicit active membership.
-- Existing sessions are backfilled only when their user has exactly
-- one active membership. Migration aborts if any session is ambiguous.

ALTER TABLE "Session"
ADD COLUMN "membershipId" TEXT;

WITH "UniqueActiveMembership" AS (
    SELECT
        "userId",
        MIN("id") AS "membershipId"
    FROM "Membership"
    WHERE "isActive" = true
    GROUP BY "userId"
    HAVING COUNT(*) = 1
)
UPDATE "Session" AS s
SET "membershipId" = u."membershipId"
FROM "UniqueActiveMembership" AS u
WHERE s."userId" = u."userId";

DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM "Session"
        WHERE "membershipId" IS NULL
    ) THEN
        RAISE EXCEPTION
            'Session membership backfill failed: zero or ambiguous active membership';
    END IF;

    IF EXISTS (
        SELECT 1
        FROM "Session" s
        JOIN "Membership" m
          ON m."id" = s."membershipId"
        WHERE m."userId" <> s."userId"
           OR m."isActive" <> true
    ) THEN
        RAISE EXCEPTION
            'Session membership integrity validation failed';
    END IF;
END
$$;

ALTER TABLE "Session"
ALTER COLUMN "membershipId" SET NOT NULL;

CREATE INDEX "Session_membershipId_idx"
ON "Session"("membershipId");

ALTER TABLE "Session"
ADD CONSTRAINT "Session_membershipId_fkey"
FOREIGN KEY ("membershipId")
REFERENCES "Membership"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;