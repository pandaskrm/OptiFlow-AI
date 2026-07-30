import crypto from "node:crypto";

function getEncryptionKey() {
  const secret = process.env.ERP_ENCRYPTION_KEY;

  if (!secret) {
    throw new Error("ERP_ENCRYPTION_KEY est absente.");
  }

  return crypto.createHash("sha256").update(secret).digest();
}

export function encryptErpSecret(value: string) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(
    "aes-256-gcm",
    getEncryptionKey(),
    iv
  );

  const encrypted = Buffer.concat([
    cipher.update(value, "utf8"),
    cipher.final(),
  ]);

  const authTag = cipher.getAuthTag();

  return [
    iv.toString("base64"),
    authTag.toString("base64"),
    encrypted.toString("base64"),
  ].join(".");
}