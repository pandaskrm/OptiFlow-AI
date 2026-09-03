import bcrypt from "bcryptjs";

const SALT_ROUNDS = 12;

export const PASSWORD_POLICY_MESSAGE =
  "Le mot de passe doit contenir au minimum 10 caract?res : 1 majuscule, au moins 5 lettres, 2 chiffres et 1 caract?re sp?cial.";

export function isPasswordValid(password: string) {
  const letterCount =
    (password.match(/[A-Za-z?-??-??-?]/g) ?? []).length;

  const digitCount =
    (password.match(/\d/g) ?? []).length;

  return (
    password.length >= 10 &&
    /[A-Z?-??-?]/.test(password) &&
    letterCount >= 5 &&
    digitCount >= 2 &&
    /[^A-Za-z?-??-??-?0-9]/.test(password)
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