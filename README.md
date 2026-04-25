# Welcome to your Lovable project

## Firebase setup (for admin dashboard)

1. Install dependency (already added in this project):
   - `npm install firebase`
2. Create a local env file:
   - Copy `.env.example` to `.env`
   - Fill all `VITE_FIREBASE_*` values from Firebase Console -> Project settings -> General.
3. Firebase services are ready from:
   - `src/lib/firebase.ts`
   - exports: `firebaseAuth`, `firebaseDb`, `firebaseStorage`

### Example usage

```ts
import { firebaseAuth, firebaseDb, firebaseStorage } from "@/lib/firebase";
```

### Notes

- Keep `.env` private (already ignored by git).
- For dashboard login, use Firebase Authentication (Email/Password).
- For categories/plats CRUD, use Firestore.
- For category/plat images, use Firebase Storage.

## Public site data (Firestore)

The customer app reads live data from Firestore (not from `src/data/*.json` at runtime). Your co-worker’s admin dashboard should read/write the **same** paths.

| Location | Purpose |
|----------|---------|
| `categories/{categoryId}` | Fields: `name` (map `es` / `ca` / `en`), `image`, `order`, `active`. Document ID = category id (e.g. `cat-1`) so URLs `/category/cat-1` stay valid. |
| `dishes/{dishId}` | Fields: `categoryId`, `name`, `description`, `price`, `allergens`, `active`, `order`. Document ID = dish id (e.g. `dish-1`). |
| `restaurant/main` | Single document: same fields as `src/data/restaurant.json` (name, address, phone, whatsapp, coordinates, googleMapsUrl, openingHours, …). |
| `sliderSlides/{slideId}` | Fields: `url`, `order`, `active`. |

### First-time import from existing JSON

1. Enable Firestore in the Firebase console.
2. Deploy rules (example in repo root `firestore.rules`): public **read**, authenticated **write** for those collections.
3. Create a service account JSON (do not commit it). Set `FIREBASE_SERVICE_ACCOUNT_PATH` to that file.
4. Run: `npm run seed:firestore`

After seeding, the site loads menu + venue + hero slides from Firestore; the JSON files remain only as a backup reference for structure.
