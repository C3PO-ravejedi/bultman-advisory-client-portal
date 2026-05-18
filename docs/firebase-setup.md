# Firebase Setup Checklist

Project: `bultman-advisory`

1. Create a Firebase Web App and copy config into `.env` using `.env.example`.
2. Enable Firebase Auth providers:
   - Email/password for beta accounts.
   - Google sign-in for staff accounts.
3. Deploy security rules:
   ```bash
   firebase deploy --only firestore:rules,storage --project bultman-advisory
   ```
4. Seed custom claims for roles using an admin script or Cloud Function:
   - `role`: `Owner | Advisor | Associate | Client | External Collaborator`
   - `clientId`: required for Client / External Collaborator users.
5. Create Storage folder convention: `clients/{clientId}/...`.
6. Do not store live bank, tax, or wiring fields until field-level encryption / Secret Manager flow is added.
