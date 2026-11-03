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

for (const [path, lang] of [["/en/", "en"], ["/fr/", "fr"], ["/en/privacy/", "en"], ["/fr/confidentialite/", "fr"], ["/en/preferences/", "en"], ["/fr/desabonnement/", "fr"]]) {
  test(`${path} serves an accessible localized page`, async () => {
    const response = await request(path);
    const html = response.body;
    assert.equal(response.statusCode, 200);
    assert.match(html, new RegExp(`<html lang="${lang}">`));
    assert.match(html, /<main id="main">/);
    assert.match(html, /ROALLA Business Enablement Group/);
    assert.match(html, /\/assets\/roalla-logo\.svg/);
    assert.match(html, /<link rel="canonical"/);
    assert.match(html, /application\/ld\+json/);
  });
}

test("campaign script supports standard UTM and click identifiers", async () => {
  const script = await readFile(new URL("../src/assets/app.js", import.meta.url), "utf8");
  for (const key of ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid", "msclkid"]) assert.match(script, new RegExp(key));
});

test("unknown routes return localized 404 with security headers", async () => {
  const response = await request("/fr/introuvable");
  assert.equal(response.statusCode, 404);
  assert.equal(response.headers["x-content-type-options"], "nosniff");
  assert.match(response.body, /Page introuvable/);
});
