/**
 * Creates/updates the Firebase Auth admin user.
 *
 * PowerShell:
 *   $env:FIREBASE_SERVICE_ACCOUNT_PATH="C:\path\service-account.json"
 *   npm run create:admin
 */

import { readFileSync } from "node:fs";
import admin from "firebase-admin";

const saPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
if (!saPath) {
  console.error("Missing FIREBASE_SERVICE_ACCOUNT_PATH.");
  process.exit(1);
}

const serviceAccount = JSON.parse(readFileSync(saPath, "utf8"));
admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });

const email = "youssef@restaurant-admin.local";
const password = "youssef7363";

try {
  const user = await admin.auth().getUserByEmail(email);
  await admin.auth().updateUser(user.uid, { password });
  console.log(`Updated admin user: ${email}`);
} catch (error) {
  if (error?.code !== "auth/user-not-found") {
    throw error;
  }
  await admin.auth().createUser({
    email,
    password,
    emailVerified: true,
  });
  console.log(`Created admin user: ${email}`);
}
