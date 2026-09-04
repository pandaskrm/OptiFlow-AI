import bcrypt from "bcryptjs";

const SALT_ROUNDS = 12;

export const PASSWORD_POLICY_MESSAGE =
  "Le mot de passe doit contenir au minimum 10 caractères : 1 majuscule, au moins 5 lettres, 2 chiffres et 1 caractère spécial.";

export function isPasswordValid(password: string) {
  const letters = password.match(/\p{L}/gu) ?? [];
  const digits = password.match(/\p{N}/gu) ?? [];

  return (
    password.length >= 10 &&
    /\p{Lu}/u.test(password) &&
    letters.length >= 5 &&
    digits.length >= 2 &&
    /[^\p{L}\p{N}]/u.test(password)
  );
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(
  password: string,
  hash: string
) {
  return bcrypt.compare(password, hash);
}