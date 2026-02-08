# Why You Didn't Receive the Admin Email at sales@roalla.com

When someone submits "Request Access", the app sends an email to **sales@roalla.com**. If you didn't receive it, check the following.

---

## 1. RESEND_API_KEY is set (Railway / env)

The app only sends email when **RESEND_API_KEY** is set.

- **Railway:** App service → **Variables** → ensure **RESEND_API_KEY** is set to your Resend API key (starts with `re_`).
- After a deploy, submit a test request and check **Deploy logs** for:
  - `RESEND_API_KEY is not set — admin notification email ... was not sent` → add the key and redeploy.
  - `Admin notification sent to sales@roalla.com` → email was sent (check spam / Resend dashboard).
  - `Resend admin email failed: ...` → see error and Resend dashboard.

---

## 2. Domain verified in Resend

Resend requires the **sending domain** to be verified.

- Log in at [resend.com](https://resend.com) → **Domains**.
- Add and verify **roalla.com** (DNS records as shown by Resend).
- Emails are sent **from** `noreply@roalla.com`; that address must be allowed by your domain verification.

---

## 3. Spam / junk folder

- Check **Spam** or **Junk** for emails from `noreply@roalla.com` or "Roalla Website".
- If you use a catch‑all or alias for sales@roalla.com, check that mailbox too.

---

## 4. Resend dashboard (logs and delivery)

- In Resend: **Emails** or **Logs**.
- Look for the "New Resources Portal Access Request" email:
  - **Sent** → delivery issue (spam, wrong address, or provider).
  - **Failed / Bounced** → note the error (e.g. domain not verified, invalid from/to).

---

## 5. Correct recipient address

The code sends to **sales@roalla.com** (lowercase). If your real address is different (e.g. another mailbox or typo), the email would go to the wrong place. We can change the recipient to another address if you want.

---

## Quick checklist

| Check | Where |
|-------|--------|
| RESEND_API_KEY set | Railway → App → Variables |
| Domain roalla.com verified | Resend → Domains |
| Spam/junk for sales@roalla.com | Your mail client |
| Send attempt and any error | Railway deploy logs + Resend → Emails/Logs |

After fixing (e.g. adding the key or verifying the domain), redeploy and submit another test request. The app now logs clearly whether the admin email was skipped, sent, or failed.
