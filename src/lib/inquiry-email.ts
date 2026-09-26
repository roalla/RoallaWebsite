import { CONTACT, SITE_URL } from "@/lib/site";

/** Table layout, live text, and one small logo — branded without newsletter tricks. */
const FONT = "Arial, Helvetica, sans-serif";
const LOGO_URL = `${SITE_URL}/email/roalla-mark.png`;
const PHONE_DISPLAY = "(289) 838-5868";
const PHONE_HREF = "tel:+12898385868";
const HOME_URL = SITE_URL;
const PRIVACY_URL = `${SITE_URL}/en/privacy`;
const TERMS_URL = `${SITE_URL}/en/terms`;

export const INQUIRY_EMAIL_CUSTOMER_NOTE =
  "You are receiving this email because you submitted a service inquiry at roalla.com.";

export const INQUIRY_EMAIL_INTERNAL_NOTE =
  "Internal notification for the Roalla sales team, generated from a service inquiry on roalla.com.";

function escapeHtml(value: string): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function inquiryEmailParagraph(html: string): string {
  return `<p style="margin:0 0 16px;font-family:${FONT};font-size:15px;line-height:1.65;color:#334155;">${html}</p>`;
}

export function inquiryEmailButton(
  href: string,
  label: string,
  align: "left" | "center" = "center",
): string {
  const safeHref = escapeHtml(href);
  const safeLabel = escapeHtml(label);
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:4px 0 0;">
      <tr>
        <td align="${align}">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td align="center" bgcolor="#007a87" style="background-color:#007a87;border-radius:4px;">
                <a href="${safeHref}" style="display:inline-block;padding:12px 22px;font-family:${FONT};font-size:14px;line-height:1.2;font-weight:bold;color:#ffffff;text-decoration:none;">${safeLabel}</a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  `.trim();
}

export function inquiryEmailPlainFooter(note: string): string {
  const year = new Date().getFullYear();
  return [
    "",
    "Roalla Business Enablement Group",
    "Burlington, Ontario, Canada",
    PHONE_DISPLAY,
    CONTACT.email,
    HOME_URL,
    "",
    note,
    "",
    `© ${year} Roalla Business Enablement Group. All rights reserved.`,
  ].join("\n");
}

export function renderInquiryEmail(options: {
  title: string;
  preheader: string;
  eyebrow: string;
  headline: string;
  bodyHtml: string;
  footerNote: string;
}): string {
  const year = new Date().getFullYear();
  const title = escapeHtml(options.title);
  const preheader = escapeHtml(options.preheader);
  const eyebrow = escapeHtml(options.eyebrow);
  const headline = escapeHtml(options.headline);
  const footerNote = escapeHtml(options.footerNote);
  const previewPad = "&nbsp;&zwnj;".repeat(8);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="x-apple-disable-message-reformatting">
  <meta name="color-scheme" content="light">
  <meta name="supported-color-schemes" content="light">
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f7fb;word-spacing:normal;">
  <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;font-size:1px;line-height:1px;color:#f4f7fb;opacity:0;">${preheader}${previewPad}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#f4f7fb" style="background-color:#f4f7fb;margin:0;padding:0;">
    <tr>
      <td align="center" style="padding:28px 12px;">
        <!--[if mso]><table role="presentation" align="center" width="600" cellpadding="0" cellspacing="0" border="0"><tr><td><![endif]-->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#ffffff" style="max-width:600px;width:100%;background-color:#ffffff;border:1px solid #e2e8f0;">
          <tr>
            <td bgcolor="#00b4c5" style="background-color:#00b4c5;height:4px;font-size:0;line-height:0;">&nbsp;</td>
          </tr>
          <tr>
            <td bgcolor="#04101f" style="background-color:#04101f;padding:26px 32px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td valign="middle" style="padding-right:14px;">
                    <a href="${HOME_URL}" style="text-decoration:none;">
                      <img src="${LOGO_URL}" width="44" height="44" alt="ROALLA" style="display:block;border:0;outline:none;text-decoration:none;width:44px;height:44px;">
                    </a>
                  </td>
                  <td valign="middle">
                    <p style="margin:0;font-family:${FONT};font-size:18px;line-height:1.1;font-weight:bold;letter-spacing:0.18em;color:#ffffff;">ROALLA</p>
                    <p style="margin:5px 0 0;font-family:${FONT};font-size:12px;line-height:1.4;color:#94a3b8;">Business Enablement Group</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:32px 32px 28px;font-family:${FONT};color:#1e293b;">
              <p style="margin:0 0 8px;font-family:${FONT};font-size:12px;line-height:1.4;letter-spacing:0.08em;text-transform:uppercase;color:#007a87;font-weight:bold;">${eyebrow}</p>
              <h1 style="margin:0 0 20px;font-family:${FONT};font-size:26px;line-height:1.25;font-weight:bold;color:#04101f;">${headline}</h1>
              ${options.bodyHtml}
            </td>
          </tr>
          <tr>
            <td bgcolor="#07111f" style="background-color:#07111f;padding:26px 32px 22px;border-top:3px solid #00b4c5;">
              <p style="margin:0 0 4px;font-family:${FONT};font-size:12px;line-height:1.4;letter-spacing:0.16em;font-weight:bold;color:#ffffff;">ROALLA</p>
              <p style="margin:0 0 12px;font-family:${FONT};font-size:14px;line-height:1.5;color:#e2e8f0;">Roalla Business Enablement Group</p>
              <p style="margin:0 0 12px;font-family:${FONT};font-size:13px;line-height:1.6;color:#94a3b8;">
                Burlington, Ontario, Canada<br>
                <a href="${PHONE_HREF}" style="color:#d7f4f8;text-decoration:none;">${PHONE_DISPLAY}</a>
                &nbsp;&middot;&nbsp;
                <a href="mailto:${CONTACT.email}" style="color:#d7f4f8;text-decoration:none;">${CONTACT.email}</a>
              </p>
              <p style="margin:0 0 12px;font-family:${FONT};font-size:13px;line-height:1.6;">
                <a href="${HOME_URL}" style="color:#8fdbe6;text-decoration:none;">roalla.com</a>
                &nbsp;&middot;&nbsp;
                <a href="${PRIVACY_URL}" style="color:#8fdbe6;text-decoration:none;">Privacy</a>
                &nbsp;&middot;&nbsp;
                <a href="${TERMS_URL}" style="color:#8fdbe6;text-decoration:none;">Terms</a>
              </p>
              <p style="margin:0 0 12px;font-family:${FONT};font-size:12px;line-height:1.5;color:#94a3b8;">Assess · Build · Optimize · Automate · Evolve</p>
              <p style="margin:0 0 12px;font-family:${FONT};font-size:12px;line-height:1.55;color:#94a3b8;">${footerNote}</p>
              <p style="margin:0;font-family:${FONT};font-size:11px;line-height:1.5;color:#64748b;">&copy; ${year} Roalla Business Enablement Group. All rights reserved.</p>
            </td>
          </tr>
        </table>
        <!--[if mso]></td></tr></table><![endif]-->
      </td>
    </tr>
  </table>
</body>
</html>`;
}
