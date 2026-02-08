# Admin Login & Dashboard Setup (Phase 1)

## 1. Environment variables

Add these to **Railway** (and to `.env.local` for local dev):

- **NEXTAUTH_SECRET** – Secret used to sign JWTs. Generate one:
  ```bash
  npm run generate:server-action-key
  ```
  Copy the output and set it as `NEXTAUTH_SECRET`.

- **NEXTAUTH_URL** – Full URL of your app:
  - Production: `https://www.roalla.com` (or your live domain)
  - Local: `http://localhost:3000`

## 2. Database migration

Apply the new auth tables (User, Account, Session, VerificationToken):

```bash
npx prisma migrate dev --name add-auth-models
```

On **Railway**, migrations usually run at deploy (e.g. in `start.sh`). If you added the new models in a new migration, push or deploy so that migration runs.

## 3. Create the first admin user

Run once (with your own email and a strong password):

```bash
# Option A: env vars inline (Unix/Mac)
ADMIN_EMAIL=your@email.com ADMIN_PASSWORD=YourSecurePassword node scripts/create-admin.js

# Option B: use .env.local (create .env.local with ADMIN_EMAIL, ADMIN_PASSWORD, DATABASE_URL)
# Install dotenv: npm install dotenv
node -r dotenv/config scripts/create-admin.js
```

Or add **ADMIN_EMAIL** and **ADMIN_PASSWORD** to Railway, then in Railway’s shell or a one-off run:

```bash
node scripts/create-admin.js
```

Password must be at least 8 characters.

## 4. Sign in and use the admin dashboard

1. Open **/login** on your site (e.g. https://www.roalla.com/login).
2. Sign in with the admin email and password you used in step 3.
3. You’ll be redirected to **/admin** (dashboard).
4. From there you can:
   - **Dashboard** – Counts of pending / approved / rejected requests.
   - **Access requests** – List all requests, filter by status, **Approve** (opens approval link in new tab) or **Reject**.
   - **Approved users** – List of approved portal users.

Only users with **role = admin** can access `/admin`. Creating other admins is done by running the create-admin script again with a different email (or by updating a user’s role in the database).

---

## Troubleshooting: 500 on `/api/auth/session`

If the browser shows **500 (Internal Server Error)** on `GET https://www.roalla.com/api/auth/session` and next-auth reports `CLIENT_FETCH_ERROR`, the app is missing auth config in production.

1. **Set `NEXTAUTH_SECRET`** in Railway (or your host):
   - Generate: `openssl rand -base64 32` or use `npm run generate:server-action-key` and use that value.
   - Add it as an environment variable and redeploy.

2. **Set `NEXTAUTH_URL`** to your public URL, e.g. `https://www.roalla.com` (no trailing slash).

After redeploying, the session endpoint should return 200. If you had left these unset, the code now returns a safe “no session” response so the site still loads; fixing the env vars restores full login/session behavior.
