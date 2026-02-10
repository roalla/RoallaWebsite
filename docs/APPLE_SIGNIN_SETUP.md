# Sign in with Apple – Step-by-step setup

This guide walks you through configuring **Sign in with Apple** for your Roalla site so users can log in with their Apple ID. You need an **Apple Developer account** (paid membership).

---

## What you’ll create

| Item | Used as |
|------|--------|
| **App ID** (with Sign in with Apple) | Primary app that “owns” the web sign-in |
| **Services ID** | This is your `APPLE_ID` (Client ID) in NextAuth |
| **Private key** (.p8) | Used to sign the client secret JWT |
| **Key ID** | Goes into the JWT header |
| **Team ID** | Your Apple Developer Team ID (issuer of the JWT) |
| **Client secret (JWT)** | This is your `APPLE_SECRET` in NextAuth |

---

### I only have a Services ID – why can’t I find an App ID?

Apple uses two different identifier types:

- **App ID** – Used as the “primary” app that owns Sign in with Apple. Required for creating a **Key** (Step 3). The “Primary App ID” dropdown when creating the key shows **App IDs only**, not Services IDs.
- **Services ID** – What you use as the OAuth Client ID (`APPLE_ID`) for your website. You already have this.

**Fix:** Do **Step 1** below to create an **App ID** (it can be web-only; you don’t ship an iOS app). Then in Step 3, the “Primary App ID” dropdown will list that App ID. Use the same App ID in your Services ID configuration (Step 2) under “Primary App ID” so everything is linked.

---

## Step 1: Create an App ID (required)

**Apple requires an App ID before you can create a Key.** The “Primary App ID” dropdown when creating the key lists **App IDs only** (not Services IDs). If you only have a Services ID, create an App ID first—it’s just a container for “Sign in with Apple”; it does not need to be a real iOS/macOS app.

1. Go to [Apple Developer](https://developer.apple.com/account/) → **Certificates, Identifiers & Profiles**.
2. In the sidebar, click **Identifiers**.
3. Click the **+** button (top left).
4. Select **App IDs** (not Services IDs) → **Continue**.
5. Select **App** → **Continue**.
6. Fill in:
   - **Description**: e.g. `Roalla Web`
   - **Bundle ID**: choose **Explicit**, e.g. `com.roalla.website` (use your own reverse-domain; can be similar to your Services ID but different, e.g. `com.roalla.website` for App ID and `com.roalla.website.signin` for Services ID).
7. Under **Capabilities**, enable **Sign in with Apple** (check the box).
8. Click **Continue** → **Register**.

You’ll use this App ID when configuring your **Services ID** (Primary App ID) and when creating the **Key** (Step 3). Without an App ID, the Key’s “Primary App ID” dropdown will be empty.

---

## Step 2: Create a Services ID (this is your Client ID)

If you **already have** a Services ID: open it from the Identifiers list, enable **Sign in with Apple** → **Configure**, and set **Primary App ID** to the App ID you created in Step 1. Then add your domain and return URL below and save.

If you’re creating a new one:

1. Still under **Identifiers**, click **+** again.
2. This time select **Services IDs** → **Continue**.
3. Fill in:
   - **Description**: e.g. `Roalla website sign-in`
   - **Identifier**: e.g. `com.roalla.website.signin` (must be unique; this becomes **APPLE_ID**).
4. Click **Continue** → **Register**.
5. In the list, click your new **Services ID** to configure it.
6. Enable **Sign in with Apple** and click **Configure**.
7. In the configuration modal:
   - **Primary App ID**: Choose the App ID you created in Step 1.
   - **Domains and Subdomains**: Your production domain, e.g. `www.roalla.com` (no `https://`). For local testing Apple does **not** allow `localhost`; you’d need HTTPS and a hostname (see NextAuth docs).
   - **Return URLs**: Add exactly:
     ```text
     https://www.roalla.com/api/auth/callback/apple
     ```
     (Replace with your real `NEXTAUTH_URL` + `/api/auth/callback/apple`.)
8. Click **Save** → **Continue** → **Save**.

Write down the **Services ID** (e.g. `com.roalla.website.signin`). This is **APPLE_ID**.

---

## Step 3: Create a Sign in with Apple private key

**If you don’t see any App ID in the dropdown:** you must complete **Step 1** first. The dropdown shows **App IDs** only (not Services IDs). Create an App ID, then come back to this step.

1. In the sidebar, open **Keys** (under “Certificates, Identifiers & Profiles” or “Keys”).
2. Click **+** to create a new key.
3. **Key Name**: e.g. `Roalla Sign in with Apple`.
4. Enable **Sign in with Apple** and click **Configure**.
5. In **Primary App ID**, select your **App ID** (the one from Step 1, e.g. `Roalla Web` / `com.roalla.website`). This is an **App ID**, not your Services ID. If the list is empty, create an App ID in Step 1 first. → **Save**.
6. Click **Continue** → **Register**.
7. **Download the .p8 file** – you can only do this once. Store it securely (e.g. password manager or secure drive). You’ll need its contents to generate the client secret.
8. On the Keys list you’ll see a **Key ID** (e.g. `ABC123XYZ`). Write it down – this is your **Key ID**.

---

## Step 4: Get your Team ID and Client ID

- **Team ID**: In the top-right of the Apple Developer site (or in [Membership details](https://developer.apple.com/account/#/membership/)), find **Team ID** (e.g. `ABCD1234`).
- **Client ID**: The **Services ID** from Step 2 (e.g. `com.roalla.website.signin`).

You should now have:

- Team ID  
- Key ID  
- Client ID (Services ID)  
- The **.p8 file** (private key) contents  

---

## Step 5: Generate the client secret (JWT)

Apple’s “client secret” must be a **JWT** signed with your .p8 key (ES256). It’s valid for up to 6 months; then you generate a new one.

### Option A: Use the project script (recommended)

1. Install the helper dependency (one-time):
   ```bash
   npm install --save-dev jose
   ```
2. Set the required env vars and run the script from the project root.

   **PowerShell (Windows):**
   ```powershell
   $env:APPLE_TEAM_ID="ABCD1234"
   $env:APPLE_KEY_ID="XYZ789"
   $env:APPLE_CLIENT_ID="com.roalla.website.signin"
   $env:APPLE_PRIVATE_KEY=".\AuthKey_XYZ789.p8"
   npm run gen-apple-secret
   ```

   **CMD (Windows):**
   ```cmd
   set APPLE_TEAM_ID=ABCD1234
   set APPLE_KEY_ID=XYZ789
   set APPLE_CLIENT_ID=com.roalla.website.signin
   set APPLE_PRIVATE_KEY=.\AuthKey_XYZ789.p8
   npm run gen-apple-secret
   ```

   **Bash (macOS/Linux):**
   ```bash
   export APPLE_TEAM_ID=ABCD1234
   export APPLE_KEY_ID=XYZ789
   export APPLE_CLIENT_ID=com.roalla.website.signin
   export APPLE_PRIVATE_KEY=./AuthKey_XYZ789.p8
   npm run gen-apple-secret
   ```

   Replace with your real Team ID, Key ID, Services ID, and path to the downloaded .p8 file. You can also put these in `.env.local` and run `npm run gen-apple-secret`.

3. The script prints a long JWT. Copy it (the whole line, no line breaks).

### Option B: Use an online generator

You can use a generator that takes Team ID, Key ID, Client ID, and .p8 content and outputs the JWT (e.g. [bal.so/apple-gen-secret](https://bal.so/apple-gen-secret) or similar). **Only use trusted tools** and prefer running the script locally if you can.

---

## Step 6: Add environment variables

In `.env` or your host (e.g. Railway):

```env
APPLE_ID=com.roalla.website.signin
APPLE_SECRET=<paste the JWT from Step 5>
```

- **APPLE_ID** = Services ID (Client ID).  
- **APPLE_SECRET** = the JWT you generated (one long string, no quotes or newlines inside it).

Redeploy or restart the app so the new env vars are loaded.

---

## Step 7: Test

1. Open your site’s login page.
2. You should see **Apple** (or “Sign in with Apple”) if the provider is enabled.
3. Click it and complete the Apple sign-in flow.
4. You should be redirected back and logged in.

---

## Important notes

- **HTTPS**: Apple requires HTTPS for the redirect URL (no `http://`).
- **Return URL**: Must match exactly what you set in the Services ID (including trailing slash or not, and domain).
- **JWT expiry**: The client secret JWT expires (e.g. in 6 months). When it does, generate a new one (Step 5) and update `APPLE_SECRET`.
- **Local testing**: Apple does not allow `localhost`. Use a tunnel (e.g. ngrok) with HTTPS and add that domain and return URL in the Services ID configuration.

---

## Quick checklist

- [ ] App ID created with “Sign in with Apple” enabled  
- [ ] Services ID created and configured (domain + return URL)  
- [ ] Private key (.p8) downloaded; Key ID and Team ID noted  
- [ ] Client secret JWT generated and set as `APPLE_SECRET`  
- [ ] `APPLE_ID` and `APPLE_SECRET` set in environment  
- [ ] Return URL in Apple matches `NEXTAUTH_URL` + `/api/auth/callback/apple`  
