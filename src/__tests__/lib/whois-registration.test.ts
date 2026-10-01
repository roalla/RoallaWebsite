import { parseWhoisComPage } from "@/lib/site-setup/whois";

const page = `
<div class="df-block">
  <div class="df-label">Registered On:</div><div class="df-value">2024-05-17</div>
  <div class="df-label">Expires On:</div><div class="df-value">2027-05-17</div>
  <div class="df-label">Updated On:</div><div class="df-value">2026-08-02</div>
  <div class="df-label">Name Servers:</div><div class="df-value">Malcolm.ns.cloudflare.com<br>veda.ns.cloudflare.com</div>
</div>
<div class="df-block">
  <div class="df-heading">Registrar Information</div>
  <div class="df-label">Registrar:</div><div class="df-value">GoDaddy.com, LLC</div>
  <div class="df-label">Email:</div><div class="df-value">abuse@example.net</div>
</div>
<div class="df-block">
  <div class="df-heading">Registrant Contact</div>
  <div class="df-label">Name:</div><div class="df-value">Registration Private</div>
  <div class="df-label">Organization:</div><div class="df-value">Domains By Proxy, LLC</div>
  <div class="df-label">Street:</div><div class="df-value">100 Secret Street</div>
  <div class="df-label">Email:</div><div class="df-value">hidden@example.net</div>
</div>
<div class="df-block">
  <div class="df-heading">Technical Contact</div>
  <div class="df-label">Name:</div><div class="df-value">Tech Person</div>
  <div class="df-label">Organization:</div><div class="df-value">Tech Org</div>
</div>
`;

describe("parseWhoisComPage", () => {
  it("reads the registrar, dates, name servers, and published registrant", () => {
    const result = parseWhoisComPage(page);

    expect(result).toEqual({
      registrar: "GoDaddy.com, LLC",
      nameservers: ["malcolm.ns.cloudflare.com", "veda.ns.cloudflare.com"],
      registeredOn: "2024-05-17",
      expiresOn: "2027-05-17",
      updatedOn: "2026-08-02",
      registrantName: "Registration Private",
      registrantOrganization: "Domains By Proxy, LLC",
    });
    expect(JSON.stringify(result)).not.toContain("Secret");
    expect(JSON.stringify(result)).not.toContain("hidden@");
    expect(JSON.stringify(result)).not.toContain("Tech Person");
  });

  it("returns null when the page has no registration record", () => {
    expect(parseWhoisComPage("<html><body><h1>Find a domain</h1></body></html>")).toBeNull();
  });
});
