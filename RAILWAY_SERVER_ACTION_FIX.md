# Fix: "Failed to find Server Action" on Railway

This error usually appears when the browser has a page from an **older or newer deployment** than the server. Next.js uses encrypted Server Action IDs that change between builds; if they don’t match, you see "Failed to find Server Action 'x'".

## Fix: Set a stable encryption key

Set **one fixed encryption key** so all builds and instances use the same Server Action IDs.

### 1. Generate a key (once)

On your machine, in the project directory, run:

```bash
npm run generate:server-action-key
```

Copy the printed value (a long base64 string).

### 2. Add it in Railway

1. Open your **app** service (e.g. RoallaWebsite) in Railway.
2. Go to **Variables**.
3. Add a new variable:
   - **Name:** `NEXT_SERVER_ACTIONS_ENCRYPTION_KEY`
   - **Value:** the base64 string you copied (paste the whole thing, no quotes).
4. Save so Railway redeploys.

### 3. Optional: reduce stale pages

- Do a **hard refresh** in the browser (Ctrl+Shift+R or Cmd+Shift+R) or use a private window.
- After redeploys, avoid keeping the site open for a long time on an old tab; refresh so the page matches the current deployment.

After `NEXT_SERVER_ACTIONS_ENCRYPTION_KEY` is set and the app has redeployed, the "Failed to find Server Action" errors should stop.
