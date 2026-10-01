import { compactPublicHtml, isPublicIpAddress } from "@/lib/social-presence/safe-html-fetch";

describe("social presence network safety", () => {
  it.each([
    "127.0.0.1",
    "10.0.0.1",
    "172.16.0.1",
    "192.168.1.1",
    "169.254.1.1",
    "100.64.0.1",
    "192.0.2.1",
    "198.51.100.1",
    "203.0.113.1",
    "::1",
    "fc00::1",
    "fe80::1",
    "2001:db8::1",
  ])("rejects non-public address %s", (address) => {
    expect(isPublicIpAddress(address)).toBe(false);
  });

  it.each(["8.8.8.8", "1.1.1.1", "2606:4700:4700::1111"])(
    "accepts public address %s",
    (address) => {
      expect(isPublicIpAddress(address)).toBe(true);
    },
  );

  it("keeps profile links when inline drawings and styles make the page look large", () => {
    const html = `<title>Anchor Point</title><svg><path d="${"M1 ".repeat(200_000)}"/></svg><style>${"a{color:red}".repeat(5000)}</style><a href="https://www.linkedin.com/in/autumbailey/">LinkedIn</a>`;
    const compact = compactPublicHtml(html);
    expect(compact).toContain("https://www.linkedin.com/in/autumbailey/");
    expect(compact).toContain("<title>Anchor Point</title>");
    expect(compact).not.toContain("<svg");
    expect(compact).not.toContain("<style");
    expect(Buffer.byteLength(compact)).toBeLessThan(2_000);
  });
});
