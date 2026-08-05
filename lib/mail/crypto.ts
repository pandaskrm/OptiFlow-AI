import {
  decryptIntegrationSecret,
  encryptIntegrationSecret,
} from "../integrations/crypto";

export function encryptMailSecret(value: string) {
  return encryptIntegrationSecret(value);
}

export function decryptMailSecret(value: string) {
  return decryptIntegrationSecret(value);
}
