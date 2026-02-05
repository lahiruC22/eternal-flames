import bcrypt from "bcryptjs";
import { getSql } from "./db";

interface DbUser {
  id: number;
  name: string;
  passcode_hash: string;
  created_at: Date;
}

/**
 * Verify user credentials against the database
 * @returns User data if valid, null if invalid
 */
export async function verifyUserCredentials(
  name: string,
  passcode: string
): Promise<{ id: string; name: string } | null> {
  try {
    const sql = getSql();
    // Query user by name
    const result = (await sql`
      SELECT id, name, passcode_hash, created_at
      FROM users
      WHERE LOWER(name) = LOWER(${name})
      LIMIT 1
    `) as DbUser[];

    if (result.length === 0) {
      return null;
    }

    const user = result[0];

    // Verify passcode
    const isValid = await bcrypt.compare(passcode, user.passcode_hash);

    if (!isValid) {
      return null;
    }

    // Return user data (excluding password hash)
    return {
      id: user.id.toString(),
      name: user.name,
    };
  } catch (error) {
    console.error("Error verifying user credentials:", error);
    return null;
  }
}

/**
 * Hash a passcode for storage
 * @param passcode Plain text passcode
 * @returns Hashed passcode
 */
export async function hashPasscode(passcode: string): Promise<string> {
  const saltRounds = 10;
  return bcrypt.hash(passcode, saltRounds);
}
