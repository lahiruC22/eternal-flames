/**
 * Script to create a user in the database
 * Usage: node --env-file=.env.local scripts/create-user.js "John" "mypassword"
 */

import { getSql } from "../lib/db.js";
import { hashPasscode } from "../lib/auth-helpers.js";

async function createUser(name: string, passcode: string) {
  try {
    // Hash the passcode
    const passcodeHash = await hashPasscode(passcode);
    const sql = getSql();

    // Insert user
    const result = (await sql`
      INSERT INTO users (name, passcode_hash)
      VALUES (${name}, ${passcodeHash})
      RETURNING id, name, created_at
    `) as Array<{ id: number; name: string; created_at: Date }>;

    console.log("✅ User created successfully:");
    console.log(result[0]);
    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating user:", error);
    process.exit(1);
  }
}

// Get arguments
const args = process.argv.slice(2);
if (args.length !== 2) {
  console.error("Usage: node --env-file=.env.local scripts/create-user.js <name> <passcode>");
  process.exit(1);
}

const [name, passcode] = args;
createUser(name, passcode);
