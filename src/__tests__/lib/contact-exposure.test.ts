import { analyzeContactExposure } from "@/lib/contact-exposure/analyze";

const MAILBOX = "sales@example.com";
const PHONE = "(289) 838-5868";

describe("analyzeContactExposure", () => {
  it("reports a mailbox, phone number, and form without returning the details", () => {
    const html = `
      <html><head>
        <script type="application/ld+json">
          {"@type":"Organization","email":"${MAILBOX}","telephone":"+1-289-838-5868"}
        </script>
      </head><body>
        <a href="mailto:${MAILBOX}">${MAILBOX}</a>
        <a href="tel:+12898385868">${PHONE}</a>
        <form action="/contact">
          <input type="text" name="name" />
          <input type="email" name="email" />
          <textarea name="message"></textarea>
          <input type="text" name="website" hidden />
        </form>
      </body></html>`;

    const result = analyzeContactExposure(html);
    const serialized = JSON.stringify(result);

    expect(result.mailboxInSource).toBe(true);
    expect(result.phoneInSource).toBe(true);
    expect(result.contactForm).toBe(true);
    expect(result.signals).toEqual(
      expect.arrayContaining(["plainEmail", "mailto", "schemaEmail", "plainPhone", "telLink", "schemaPhone", "contactForm"]),
    );
    expect(serialized).not.toContain(MAILBOX);
    expect(serialized).not.toContain("289");
  });

  it("treats a scrambled mailbox as hidden from a simple copy", () => {
    const html = `<a href="/cdn-cgi/l/email-protection" class="__cf_email__" data-cfemail="a1c4">[email protected]</a>`;
    const result = analyzeContactExposure(html);

    expect(result.mailboxInSource).toBe(false);
    expect(result.cloudflareObfuscated).toBe(true);
    expect(result.signals).toContain("cloudflareObfuscation");
    expect(result.signals).not.toContain("plainEmail");
  });

  it("treats an address left readable on purpose as exposed", () => {
    const html = `<!--email_off--><a href="mailto:${MAILBOX}">${MAILBOX}</a><!--/email_off-->`;
    const result = analyzeContactExposure(html);

    expect(result.mailboxInSource).toBe(true);
    expect(result.emailLeftReadable).toBe(true);
  });

  it("reads an address written with words or an encoded at-sign", () => {
    const written = analyzeContactExposure("<p>Write sales [at] example [dot] com</p>");
    const encoded = analyzeContactExposure("<p>sales&#64;example.com</p>");

    expect(written.mailboxInSource).toBe(true);
    expect(written.signals).toContain("plainEmail");
    expect(encoded.mailboxInSource).toBe(true);
    expect(JSON.stringify(written)).not.toContain(MAILBOX);
    expect(JSON.stringify(encoded)).not.toContain(MAILBOX);
  });

  it("ignores an address that appears only after a script runs", () => {
    const html = `<html><body><p>Email us</p><script>document.write("${MAILBOX}")</script></body></html>`;
    const result = analyzeContactExposure(html);

    expect(result.mailboxInSource).toBe(false);
    expect(result.signals).not.toContain("plainEmail");
  });

  it("does not treat a search box or a hidden field as a contact form", () => {
    const html = `
      <form role="search"><input type="search" name="q" /></form>
      <form><input type="hidden" name="website" value="" /></form>
      <img src="/image@2x.png" alt="" />
      <p>Updated 2026-10-01</p>`;
    const result = analyzeContactExposure(html);

    expect(result.contactForm).toBe(false);
    expect(result.mailboxInSource).toBe(false);
    expect(result.phoneInSource).toBe(false);
  });

  it("counts a form that collects a reply when no mailbox is published", () => {
    const html = `<form action="/contact"><input name="name" /><textarea name="message"></textarea></form>`;
    const result = analyzeContactExposure(html);

    expect(result.contactForm).toBe(true);
    expect(result.mailboxInSource).toBe(false);
    expect(result.phoneInSource).toBe(false);
  });
});
