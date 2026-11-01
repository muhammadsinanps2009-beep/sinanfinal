# Newform Restaurant — Deployment & Security Notes

This document provides deployment guidelines, security rule specifications, and instructions for publishing Firebase Security Rules for Firestore and Cloud Storage.

---

## 1. Architecture Overview

- **Frontend**: Vite + React 19 + TypeScript + Tailwind CSS
- **Database**: Cloud Firestore (Enterprise Edition)
- **Authentication**: Firebase Authentication (Google OAuth + Staff access)
- **Media Storage**: Firebase Cloud Storage (`clean-journal-bcxst.firebasestorage.app`)
- **Hosting**: Cloud Run / AI Studio Web Container

---

## 2. Firestore Security Rules (`firestore.rules`)

The security rules for Firestore are deployed in `firestore.rules`:

- **`reservations`**:
  - `create`: Public guests can submit reservations with strict size and field validations.
  - `read, update, delete`: Authenticated staff only (`request.auth != null`).
- **`inquiries`**:
  - `create`: Public guests can submit general and catering messages.
  - `read, update, delete`: Authenticated staff only (`request.auth != null`).
- **`dishes`**:
  - `read`: Public access for all website diners.
  - `write`: Authenticated staff only (`request.auth != null`).
- **`settings` (`settings/site`)**:
  - `read`: Public access for notice banner, hours, phone, address, and socials.
  - `write`: Authenticated staff only (`request.auth != null`).
- **`_connection_test_`**:
  - Handshake connectivity check.

To deploy updated Firestore rules via Firebase CLI:
```bash
firebase deploy --only firestore:rules
```

---

## 3. Firebase Storage Security Rules (`storage.rules`)

Firebase Storage stores dish photography uploaded by staff in the **Menu & Prices** section.

Rules defined in `storage.rules`:
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {

    // Dish photography: Public read, admin-only write, images only, max 1 MB
    match /dishes/{fileName} {
      allow read: if true;
      allow write: if request.auth != null
                   && request.resource.size <= 1048576
                   && request.resource.contentType.matches('image/.*');
    }

    // General media: Public read, admin-only write, images only, max 1 MB
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null
                   && request.resource.size <= 1048576
                   && request.resource.contentType.matches('image/.*');
    }
  }
}
```

### How to Publish `storage.rules`:

#### Option A: Firebase Console (Quickest)
1. Open the [Firebase Console](https://console.firebase.google.com/).
2. Select the project **`clean-journal-bcxst`**.
3. In the left navigation menu, click **Build** > **Storage**.
4. Click on the **Rules** tab.
5. Copy the contents of `/storage.rules` from this repository.
6. Paste them into the editor and click **Publish**.

#### Option B: Firebase CLI
Run the following command from the project root:
```bash
firebase deploy --only storage
```

---

## 4. Production Build Verification

To verify that the application compiles without errors:

```bash
# Type check with strict TypeScript
npm run lint

# Compile production bundle
npm run build
```

During build:
- All static photography in `src/assets/images/` is bundled and hashed in `dist/assets/`.
- Dynamic menu dishes uploaded by staff are stored in Firebase Storage and served live via public HTTPS URLs.
- The public site gracefully falls back to `siteData.ts` if Firestore is empty or when offline, guaranteeing the menu never displays as blank.
