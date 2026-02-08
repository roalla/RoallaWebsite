# Resources Portal: How to Receive and Manage Access Requests

## How you receive requests

When someone fills out the **Request Access** form on your site:

1. **Database**  
   The request is saved in your PostgreSQL database (table `AccessRequest`) with status `pending`.

2. **Email to you**  
   If `RESEND_API_KEY` is set, an email is sent to **sales@roalla.com** with:
   - Name, email, company, reason
   - Request ID and submission time
   - A one-click **“Approve Access Request”** link

So you receive and manage requests mainly **by email** at sales@roalla.com.

---

## How to approve a request

**Option A: Use the link in the email (recommended)**

1. Open the email from “Roalla Website” with subject *“New Resources Portal Access Request from [Name]”*.
2. Click the link: **“Approve Access Request”** (or open the URL shown in the email).
3. The link goes to:  
   `https://www.roalla.com/api/resources/approve?requestId=...&token=...`
4. When the page loads:
   - The request is marked **approved** in the database.
   - The applicant receives an email with a link to the Resources Portal.
   - You see a confirmation page: “Access Approved! The user has been notified via email.”

**Option B: Approve without the email**

If you have the **request ID** and **token** (e.g. from the database or a copy of the approve URL):

- Open in the browser:  
  `https://www.roalla.com/api/resources/approve?requestId=<REQUEST_ID>&token=<TOKEN>`

Same outcome: request approved, user gets the portal link by email.

---

## How to “manage” requests today

- **Approve:** Use the approve link in the email (or the URL with `requestId` and `token`) as above.
- **Reject:** There is no “Reject” button in the app. You can:
  - Ignore the request, or
  - Reply from sales@roalla.com to decline.
- **View all requests:** There is no admin UI yet. You can:
  - Use **Prisma Studio** (run `npx prisma studio` locally with `DATABASE_URL` set) to view and edit the `AccessRequest` table, or
  - Query the database (e.g. via Railway’s database UI or any PostgreSQL client).

---

## Summary

| Step | What you do |
|------|-------------|
| **Receive** | Check **sales@roalla.com** for “New Resources Portal Access Request” emails. |
| **Approve** | Click **“Approve Access Request”** in that email (or open the approve URL with the same `requestId` and `token`). |
| **After approve** | Applicant gets an email with a link to the portal; you see a success page. |
| **View/manage list** | Use Prisma Studio or the database directly until an admin dashboard is added. |

If you want, we can add a simple **admin page** (e.g. at `/resources/admin`) protected by a secret or password where you can list pending/approved requests and approve or reject from one place.
