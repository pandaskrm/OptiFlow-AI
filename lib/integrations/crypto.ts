import crypto from "node:crypto";

function getEncryptionKey() {
  const secret =
    process.env.INTEGRATION_ENCRYPTION_KEY ??
    process.env.ERP_ENCRYPTION_KEY;

  if (!secret) {
    throw new Error(
      "INTEGRATION_ENCRYPTION_KEY ou ERP_ENCRYPTION_KEY est absente.",
    );
  }

  return crypto.createHash("sha256").update(secret).digest();
}

export function encryptIntegrationSecret(value: string) {
  const iv = crypto.randomBytes(12);

  const cipher = crypto.createCipheriv(
    "aes-256-gcm",
    getEncryptionKey(),
    iv,
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

export function decryptIntegrationSecret(value: string) {
  const [ivValue, authTagValue, encryptedValue] =
    value.split(".");

  if (!ivValue || !authTagValue || !encryptedValue) {
    throw new Error("Secret d'intégration chiffré invalide.");
  }

  const decipher = crypto.createDecipheriv(
    "aes-256-gcm",
    getEncryptionKey(),
    Buffer.from(ivValue, "base64"),
  );

  decipher.setAuthTag(
    Buffer.from(authTagValue, "base64"),
  );

  const decrypted = Buffer.concat([
    decipher.update(
      Buffer.from(encryptedValue, "base64"),
    ),
    decipher.final(),
  ]);

  return decrypted.toString("utf8");
}
