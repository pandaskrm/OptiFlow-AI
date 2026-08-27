-- AlterTable
ALTER TABLE "MailConnection" ADD COLUMN     "accessTokenEncrypted" TEXT,
ADD COLUMN     "authType" TEXT NOT NULL DEFAULT 'LEGACY',
ADD COLUMN     "oauthScopes" TEXT,
ADD COLUMN     "refreshTokenEncrypted" TEXT,
ADD COLUMN     "tokenExpiresAt" TIMESTAMP(3);
