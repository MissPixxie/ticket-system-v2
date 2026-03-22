import argon2 from "argon2";

/**
 * Hasha ett plain-text lösenord
 * @param plainPassword - lösenord som ska hash
 * @returns hash
 */
export async function hashPassword(plainPassword: string): Promise<string> {
  return argon2.hash(plainPassword);
}

/**
 * Verifiera ett lösenord mot en hash
 * @param plainPassword - lösenord som användaren skriver
 * @param hashedPassword - hash lagrad i databasen
 * @returns true om lösenordet matchar, annars false
 */

export async function verifyPassword(
  plainPassword: string,
  hashedPassword: string,
): Promise<boolean> {
  return argon2.verify(hashedPassword, plainPassword);
}
