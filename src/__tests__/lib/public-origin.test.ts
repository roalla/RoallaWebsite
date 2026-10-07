import { publicSiteOrigin } from "@/lib/public-origin";

describe("publicSiteOrigin", () => {
  it("replaces an unroutable container address with the public site", () => {
    expect(publicSiteOrigin({
      host: "0.0.0.0:8080",
      origin: "https://0.0.0.0:8080",
    })).toBe("https://www.roalla.com");
  });

  it("uses the forwarded public host when the app is bound internally", () => {
    expect(publicSiteOrigin({
      forwardedHost: "www.roalla.com",
      forwardedProto: "https",
      host: "0.0.0.0:8080",
      origin: "https://0.0.0.0:8080",
    })).toBe("https://www.roalla.com");
  });

  it("keeps a local origin for development", () => {
    expect(publicSiteOrigin({
      host: "localhost:3000",
      origin: "http://localhost:3000",
    })).toBe("http://localhost:3000");
  });
});
