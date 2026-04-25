/**
 * Uploads bundled JSON menu + site data into Cloud Firestore (one-time or re-run).
 *
 * Prereqs:
 * 1. Firebase project created; Firestore enabled.
 * 2. Download a service account key (Project settings → Service accounts).
 * 3. PowerShell:
 *      $env:FIREBASE_SERVICE_ACCOUNT_PATH="C:\path\to\your-key.json"
 *      npm run seed:firestore
 *
 * Collections written (same shape the public site reads):
 * - categories/{id}
 * - dishes/{id}
 * - restaurant/main
 * - sliderSlides/{id}
 */

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import admin from "firebase-admin";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const saPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
if (!saPath) {
  console.error("Missing env FIREBASE_SERVICE_ACCOUNT_PATH (path to service account JSON).");
  process.exit(1);
}

const serviceAccount = JSON.parse(readFileSync(saPath, "utf8"));
admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
const db = admin.firestore();

const categories = JSON.parse(readFileSync(join(root, "src", "data", "categories.json"), "utf8"));
const dishes = JSON.parse(readFileSync(join(root, "src", "data", "dishes.json"), "utf8"));
const restaurant = JSON.parse(readFileSync(join(root, "src", "data", "restaurant.json"), "utf8"));
const sliderImages = JSON.parse(readFileSync(join(root, "src", "data", "sliderImages.json"), "utf8"));

const BATCH_MAX = 400;

async function run() {
  let batch = db.batch();
  let n = 0;

  const enqueue = async (ref, data) => {
    batch.set(ref, data);
    n++;
    if (n >= BATCH_MAX) {
      await batch.commit();
      batch = db.batch();
      n = 0;
    }
  };

  for (const c of categories) {
    const { id, ...rest } = c;
    await enqueue(db.collection("categories").doc(id), rest);
  }

  for (const d of dishes) {
    const { id, ...rest } = d;
    await enqueue(db.collection("dishes").doc(id), rest);
  }

  await enqueue(db.collection("restaurant").doc("main"), restaurant);

  for (const s of sliderImages) {
    const { id, ...rest } = s;
    await enqueue(db.collection("sliderSlides").doc(id), rest);
  }

  if (n > 0) {
    await batch.commit();
  }

  console.log(
    `Seeded Firestore: ${categories.length} categories, ${dishes.length} dishes, restaurant/main, ${sliderImages.length} slider slides.`
  );
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
