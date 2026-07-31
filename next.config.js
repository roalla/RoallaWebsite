const withNextIntl = require("next-intl/plugin")("./src/i18n/request.ts");
const scriptSrc =
  process.env.NODE_ENV === "development"
    ? "script-src 'self' 'unsafe-inline' 'unsafe-eval'"
    : "script-src 'self' 'unsafe-inline'";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  async redirects() {
    const legacyAppRedirects = [
      // Legacy auth → internal hub
      { source: "/login", destination: "/en/hub/login", permanent: false },
      {
        source: "/login/:path*",
        destination: "/en/hub/login",
        permanent: false,
      },
      { source: "/dashboard", destination: "/en/hub", permanent: false },
      { source: "/profile", destination: "/en/hub", permanent: false },
      { source: "/admin", destination: "/en/hub", permanent: false },
      { source: "/admin/:path*", destination: "/en/hub", permanent: false },
      {
        source: "/:locale(en|fr)/login/:path*",
        destination: "/:locale/hub/login",
        permanent: false,
      },
      {
        source: "/:locale(en|fr)/login",
        destination: "/:locale/hub/login",
        permanent: false,
      },
      {
        source: "/:locale(en|fr)/dashboard",
        destination: "/:locale/hub",
        permanent: false,
      },
      {
        source: "/:locale(en|fr)/profile",
        destination: "/:locale/hub",
        permanent: false,
      },
      {
        source: "/:locale(en|fr)/admin/:path*",
        destination: "/:locale/hub",
        permanent: false,
      },
      {
        source: "/:locale(en|fr)/admin",
        destination: "/:locale/hub",
        permanent: false,
      },
      // Internal playbook moved behind auth
      {
        source: "/:locale(en|fr)/private/digital-events-playbook",
        destination: "/:locale/hub/playbooks/digital-events",
        permanent: false,
      },
      {
        source: "/private/digital-events-playbook",
        destination: "/en/hub/playbooks/digital-events",
        permanent: false,
      },
      // Resource hub (legacy client-facing)
      {
        source: "/resources/request/:path*",
        destination: "/en/contact",
        permanent: true,
      },
      {
        source: "/resources/request",
        destination: "/en/contact",
        permanent: true,
      },
      {
        source: "/resources/portal",
        destination: "/en/programs/business-enablement",
        permanent: true,
      },
      {
        source: "/resources",
        destination: "/en/programs/business-enablement",
        permanent: true,
      },
      {
        source: "/resources/:path*",
        destination: "/en/programs/business-enablement",
        permanent: true,
      },
      // Trust centre
      { source: "/trust/:path*", destination: "/en/contact", permanent: true },
      { source: "/trust", destination: "/en/contact", permanent: true },
      // Org share links
      { source: "/p/:slug", destination: "/en", permanent: true },
      {
        source: "/:locale(en|fr)/resources/request/:path*",
        destination: "/:locale/contact",
        permanent: true,
      },
      {
        source: "/:locale(en|fr)/resources/request",
        destination: "/:locale/contact",
        permanent: true,
      },
      {
        source: "/:locale(en|fr)/resources/portal",
        destination: "/:locale/programs/business-enablement",
        permanent: true,
      },
      {
        source: "/:locale(en|fr)/resources/:path*",
        destination: "/:locale/programs/business-enablement",
        permanent: true,
      },
      {
        source: "/:locale(en|fr)/resources",
        destination: "/:locale/programs/business-enablement",
        permanent: true,
      },
      // Programs URL migration
      {
        source: "/services",
        destination: "/en/programs/business-enablement",
        permanent: true,
      },
      {
        source: "/services/workshops",
        destination: "/en/programs/workshops",
        permanent: true,
      },
      {
        source: "/:locale(en|fr)/services",
        destination: "/:locale/programs/business-enablement",
        permanent: true,
      },
      {
        source: "/:locale(en|fr)/services/workshops",
        destination: "/:locale/programs/workshops",
        permanent: true,
      },
      // Digital Enablement service architecture aliases
      {
        source: "/services/apps",
        destination: "/en/services/digital-products",
        permanent: true,
      },
      {
        source: "/services/custom-applications",
        destination: "/en/services/digital-products",
        permanent: true,
      },
      {
        source: "/services/integrations",
        destination: "/en/services/automation",
        permanent: true,
      },
      {
        source: "/services/seo",
        destination: "/en/services/digital-visibility-optimization",
        permanent: true,
      },
      {
        source: "/services/support",
        destination: "/en/services/managed-optimization",
        permanent: true,
      },
      {
        source: "/:locale(en|fr)/services/apps",
        destination: "/:locale/services/digital-products",
        permanent: true,
      },
      {
        source: "/:locale(en|fr)/services/custom-applications",
        destination: "/:locale/services/digital-products",
        permanent: true,
      },
      {
        source: "/:locale(en|fr)/services/integrations",
        destination: "/:locale/services/automation",
        permanent: true,
      },
      {
        source: "/:locale(en|fr)/services/seo",
        destination: "/:locale/services/digital-visibility-optimization",
        permanent: true,
      },
      {
        source: "/:locale(en|fr)/services/support",
        destination: "/:locale/services/managed-optimization",
        permanent: true,
      },
      {
        source: "/:locale(en|fr)/trust/:path*",
        destination: "/:locale/contact",
        permanent: true,
      },
      {
        source: "/:locale(en|fr)/trust",
        destination: "/:locale/contact",
        permanent: true,
      },
    ];

    return [
      ...legacyAppRedirects,
      {
        source: "/digital-creations",
        destination: "/en/services/portfolio",
        permanent: true,
      },
      {
        source: "/:locale(en|fr)/digital-creations",
        destination: "/:locale/services/portfolio",
        permanent: true,
      },
      // Retired product: Business Cocoon case study
      {
        source: "/services/portfolio/business-cocoon",
        destination: "/en/services/portfolio",
        permanent: true,
      },
      {
        source: "/:locale(en|fr)/services/portfolio/business-cocoon",
        destination: "/:locale/services/portfolio",
        permanent: true,
      },
      {
        source: "/founding-client",
        destination: "/en/website-package",
        permanent: true,
      },
      {
        source: "/:locale(en|fr)/founding-client",
        destination: "/:locale/website-package",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "roalla.com" }],
        destination: "https://www.roalla.com/:path*",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/favicon.svg",
        headers: [
          { key: "Cache-Control", value: "public, max-age=0, must-revalidate" },
        ],
      },
      {
        source: "/favicon.ico",
        headers: [
          { key: "Cache-Control", value: "public, max-age=0, must-revalidate" },
        ],
      },
      {
        source: "/apple-touch-icon.png",
        headers: [
          { key: "Cache-Control", value: "public, max-age=0, must-revalidate" },
        ],
      },
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              scriptSrc,
              "style-src 'self' 'unsafe-inline'",
              "frame-src https://www.youtube.com https://www.youtube-nocookie.com https://www.notion.so https://notion.so https://*.notion.site https://v2.notion.so https://v2.notion.site",
              "connect-src 'self' https://sso.roalla.com",
              "img-src 'self' data: https:",
              "font-src 'self'",
              "object-src 'none'",
            ].join("; "),
          },
        ],
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
    ],
    formats: ["image/webp", "image/avif"],
  },
  compress: true,
  poweredByHeader: false,
  generateEtags: false,
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ["lucide-react"],
    instrumentationHook: true,
  },
};

module.exports = withNextIntl(nextConfig);
