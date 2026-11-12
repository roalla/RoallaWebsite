import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { Writable } from "node:stream";
import { test } from "node:test";
import { requestHandler } from "../server.mjs";

class MockResponse extends Writable {
  constructor() {
    super();
    this.statusCode = 200;
    this.headers = {};
    this.chunks = [];
  }

  writeHead(status, headers) {
    this.statusCode = status;
    this.headers = Object.fromEntries(Object.entries(headers).map(([key, value]) => [key.toLowerCase(), value]));
    return this;
  }

  _write(chunk, encoding, callback) {
    this.chunks.push(Buffer.from(chunk));
    callback();
  }

  get body() {
    return Buffer.concat(this.chunks).toString("utf8");
  }
}

async function request(url) {
  const response = new MockResponse();
  const finished = new Promise((resolve, reject) => response.once("finish", resolve).once("error", reject));
  requestHandler({ url }, response);
  await finished;
  return response;
}

test("health endpoint reports service status", async () => {
  const response = await request("/_health");
  assert.equal(response.statusCode, 200);
  assert.deepEqual(JSON.parse(response.body), { status: "ok", service: "roalla-insights" });
});

test("root redirects to English while preserving attribution", async () => {
  const response = await request("/?utm_source=test");
  assert.equal(response.statusCode, 302);
  assert.equal(response.headers.location, "/en/?utm_source=test");
});

for (const [path, lang] of [
  ["/en/", "en"],
  ["/fr/", "fr"],
  ["/en/campaigns/visibility-review/", "en"],
  ["/fr/campaigns/visibility-review/", "fr"],
  ["/en/campaigns/ai-employee-readiness/", "en"],
  ["/fr/campaigns/ai-employee-readiness/", "fr"],
  ["/en/privacy/", "en"],
  ["/fr/confidentialite/", "fr"],
  ["/en/preferences/", "en"],
  ["/fr/desabonnement/", "fr"]
]) {
  test(`${path} serves an accessible localized page`, async () => {
    const response = await request(path);
    const html = response.body;
    assert.equal(response.statusCode, 200);
    assert.match(html, new RegExp(`<html lang="${lang}">`));
    assert.match(html, /<main id="main"/);
    assert.match(html, /ROALLA Business Enablement Group/);
    assert.match(html, /\/assets\/roalla-logo\.svg/);
    assert.match(html, /<link rel="canonical"/);
    assert.match(html, /application\/ld\+json/);
  });
}

test("homepage is a photo-led campaign hub with full-tile links", async () => {
  const response = await request("/en/");
  assert.equal(response.statusCode, 200);
  assert.match(response.body, /<a class="campaign-tile home-tile reveal" href="\/en\/campaigns\/visibility-review\/">/);
  assert.match(response.body, /Improve how customers find you online or from AI chats/);
  assert.match(response.body, /AI Employees can help you reduce churn, missed calls, missed opportunities, and abandoned calls/);
  assert.match(response.body, /campaign-tile-cta/);
  assert.match(response.body, /campaign-tile-pill/);
  assert.match(response.body, /Website &amp; AI Visibility|Website & AI Visibility/);
  assert.match(response.body, /AI Employee/);
  assert.match(response.body, /campaign-tile-scenarios/);
  assert.match(response.body, /Customers can(?:'|’|&rsquo;)t find us in search or on maps/);
  assert.match(response.body, /Calls go unanswered after hours and at peak times/);
  assert.match(response.body, /\/en\/campaigns\/ai-employee-readiness\//);
  assert.match(response.body, /\/assets\/campaigns\/visibility-hero\.webp/);
  assert.match(response.body, /\/assets\/campaigns\/ai-employee-hero\.webp/);
  assert.match(response.body, /visibility-hero\.webp\?v=\d+[a-z]/);
  assert.match(response.body, /ai-employee-hero\.webp\?v=\d+[a-z]/);
  assert.doesNotMatch(response.body, /intent=website-ai-visibility-review/);
  assert.doesNotMatch(response.body, /The product portfolio/);
  assert.doesNotMatch(response.body, /11 products/);
  assert.match(response.body, /https:\/\/www\.roallainsights\.com\/en\//);
});

test("visibility campaign uses need-style hero and sales CTAs", async () => {
  const response = await request("/en/campaigns/visibility-review/");
  assert.equal(response.statusCode, 200);
  assert.match(response.body, /campaign-need/);
  assert.match(response.body, /pathway-hero/);
  assert.match(response.body, /All campaigns/);
  assert.match(response.body, /Website &amp; AI Visibility|Website & AI Visibility/);
  assert.match(response.body, /intent=visibility/);
  assert.doesNotMatch(response.body, /intent=website-ai-visibility-review/);
  assert.match(response.body, /button gold pathway-primary/);
  assert.match(response.body, /Check my website/);
  assert.match(response.body, /digital-presence-snapshot/);
  assert.match(response.body, /website-ai-visibility-review/);
  assert.match(response.body, /email-reach-brief/);
  assert.match(response.body, /solutions\/need\/growth-visibility/);
  assert.match(response.body, /visibility-improvement-estimate/);
  assert.match(response.body, /Estimate visibility work/);
  assert.match(response.body, /data-ladder-stepper/);
  assert.match(response.body, /role="tablist"/);
  assert.match(response.body, /button gold ladder-cta/);
  assert.match(response.body, />Back</);
  assert.match(response.body, />Next</);
  assert.match(response.body, /Optional ROALLA working review/);
  assert.doesNotMatch(response.body, /with Steven/);
  assert.match(response.body, /Working call with ROALLA/);
  assert.match(response.body, /pillars-modern/);
  assert.match(response.body, /reveal-on-scroll/);
  assert.match(response.body, /data-deliverables-spotlight/);
  assert.match(response.body, /deliverable-stage/);
  assert.match(response.body, /cta-closer/);
  assert.match(response.body, /Start with ROALLA/);
  assert.doesNotMatch(response.body, /mailto:sales@roalla\.com\?subject=/);
  assert.doesNotMatch(response.body, /Talk with Steven Robin/);
  assert.match(response.body, /See\. Interpret\. Improve/);
  assert.match(response.body, /Sounds familiar/);
  assert.match(response.body, /ChatGPT/);
  assert.match(response.body, /Important emails land in junk/);
  assert.match(response.body, /Email that arrives/);
  assert.match(response.body, /pressure-list/);
  assert.match(response.body, /pressure-tile/);
  assert.match(response.body, /button gold pressure-cta/);
  assert.match(response.body, /Free check on ROALLA\.com/);
  assert.match(response.body, /pressure-sales/);
  assert.match(response.body, /Looking to 2027/);
  assert.match(response.body, /\/assets\/campaigns\/visibility-hero\.webp/);
  assert.match(response.body, /You don(?:'|’|&rsquo;)t need to be technical/);
});

test("AI readiness campaign uses need-style hero and sales CTAs", async () => {
  const response = await request("/en/campaigns/ai-employee-readiness/");
  assert.equal(response.statusCode, 200);
  assert.match(response.body, /campaign-need/);
  assert.match(response.body, /pathway-hero/);
  assert.match(response.body, /All campaigns/);
  assert.match(response.body, /Automate the busy work/);
  assert.match(response.body, /intent=ai-support/);
  assert.match(response.body, /button gold pathway-primary/);
  assert.match(response.body, /See AI Employee/);
  assert.match(response.body, /\/ai-employee/);
  assert.match(response.body, /automation-opportunity-review/);
  assert.match(response.body, /ai-agent-readiness-review/);
  assert.match(response.body, /solutions\/need\/automation-ai/);
  assert.match(response.body, /ladder-band/);
  assert.match(response.body, /data-ladder-stepper/);
  assert.match(response.body, /Talk with ROALLA about fit/);
  assert.doesNotMatch(response.body, /with Steven/);
  assert.match(response.body, /data-deliverables-spotlight/);
  assert.match(response.body, /cta-closer/);
  assert.doesNotMatch(response.body, /mailto:sales@roalla\.com\?subject=/);
  assert.match(response.body, /Sounds familiar/);
  assert.match(response.body, /Callers hang up before anyone can help/);
  assert.match(response.body, /Cover the unanswered calls/);
  assert.match(response.body, /Looking to 2027/);
  assert.match(response.body, /\/assets\/campaigns\/ai-employee-hero\.webp/);
  assert.match(response.body, /See if an AI Employee fits/);
});

test("styles load brand fonts and WCAG-oriented muted token", async () => {
  const css = await readFile(new URL("../src/assets/styles.css", import.meta.url), "utf8");
  assert.match(css, /Roalla Figtree/);
  assert.match(css, /Roalla Sora/);
  assert.match(css, /--muted:\s*#334852/);
  assert.match(css, /--cyan-dark:\s*#005f6c/);
  assert.match(css, /\.campaign-tile-pill/);
  assert.match(css, /\.pathway-hero/);
  assert.match(css, /\.pressure-list/);
  assert.match(css, /\.ladder-band/);
  assert.match(css, /\.ladder-stepper/);
  assert.match(css, /\.pillars-modern/);
  assert.match(css, /\.deliverables-spotlight/);
  assert.match(css, /\.cta-closer/);
  assert.match(css, /\.pressure-tile/);
  assert.match(css, /\.pressure-cta/);
  assert.match(css, /\.pressure-sales/);
  assert.doesNotMatch(css, /\.pressure-proof\s*\{/);
  assert.doesNotMatch(css, /background:\s*#35505a/);
});

test("campaign script supports standard UTM and click identifiers", async () => {
  const script = await readFile(new URL("../src/assets/app.js", import.meta.url), "utf8");
  for (const key of ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid", "msclkid"]) assert.match(script, new RegExp(key));
  assert.match(script, /reveal-on-scroll/);
  assert.match(script, /data-ladder-stepper/);
  assert.match(script, /setStep/);
  assert.match(script, /data-deliverables-spotlight/);
});

test("unknown routes return localized 404 with security headers", async () => {
  const response = await request("/fr/introuvable");
  assert.equal(response.statusCode, 404);
  assert.equal(response.headers["x-content-type-options"], "nosniff");
  assert.match(response.body, /Page introuvable/);
});
