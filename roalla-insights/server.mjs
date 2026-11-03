import { createServer } from "node:http";
import { createReadStream, existsSync, statSync } from "node:fs";
import { extname, join, normalize, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("./dist", import.meta.url)));

const types = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8"
};

const securityHeaders = {
  "Content-Security-Policy": "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; connect-src 'self'; font-src 'self'; base-uri 'self'; form-action 'self' mailto:; frame-ancestors 'none'; upgrade-insecure-requests",
  "Cross-Origin-Opener-Policy": "same-origin",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY"
};

function send(res, status, body, contentType, extra = {}) {
  res.writeHead(status, {
    ...securityHeaders,
    "Cache-Control": status === 200 ? "public, max-age=300" : "no-store",
    "Content-Type": contentType,
    ...extra
  });
  res.end(body);
}

export function requestHandler(req, res) {
    const url = new URL(req.url ?? "/", "http://localhost");

    if (url.pathname === "/_health") {
      return send(res, 200, JSON.stringify({ status: "ok", service: "roalla-insights" }), types[".json"], { "Cache-Control": "no-store" });
    }

    if (url.pathname === "/") {
      res.writeHead(302, { ...securityHeaders, Location: `/en/${url.search}` });
      return res.end();
    }

    let requestPath;
    try {
      requestPath = decodeURIComponent(url.pathname);
    } catch {
      return send(res, 400, "Bad request", types[".txt"]);
    }

    const relative = normalize(requestPath).replace(/^([/\\])+/, "");
    let filePath = resolve(join(root, relative));
    if (filePath !== root && !filePath.startsWith(`${root}${sep}`)) {
      return send(res, 403, "Forbidden", types[".txt"]);
    }

    if (existsSync(filePath) && statSync(filePath).isDirectory()) filePath = join(filePath, "index.html");
    if (!existsSync(filePath) && !extname(filePath)) filePath = join(filePath, "index.html");

    if (!existsSync(filePath) || !statSync(filePath).isFile()) {
      const locale = requestPath.startsWith("/fr") ? "fr" : "en";
      const notFound = join(root, locale, "404.html");
      res.writeHead(404, { ...securityHeaders, "Cache-Control": "no-store", "Content-Type": types[".html"] });
      return createReadStream(notFound).pipe(res);
    }

    res.writeHead(200, {
      ...securityHeaders,
      "Cache-Control": extname(filePath) === ".html" ? "public, max-age=300" : "public, max-age=86400, immutable",
      "Content-Type": types[extname(filePath)] ?? "application/octet-stream"
    });
    return createReadStream(filePath).pipe(res);
}

export function createAppServer() {
  return createServer(requestHandler);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const port = Number.parseInt(process.env.PORT ?? "3000", 10);
  const server = createAppServer();
  server.listen(port, "0.0.0.0", () => {
    console.log(`ROALLA Insights listening on port ${port}`);
  });
}
