import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import path from "node:path";

export const IMPLEMENTATION_TOOLKIT_ITEMS = {
  "ei48-executive-guide": {
    label: "Sustainable Performance Executive Guide",
    file: path.join("executive-guides", "sustainable-performance-psychological-wellbeing.pdf"),
    downloadName: "ROALLA_Sustainable_Performance_Executive_Guide_2026.pdf",
  },
  "ei48-manager-playbook": {
    label: "Sustainable Work Manager Playbook",
    file: path.join("implementation-toolkits", "ei48-manager-playbook.pdf"),
    downloadName: "ROALLA_Sustainable_Work_Manager_Playbook_2026.pdf",
  },
  "ei48-employee-toolkit": {
    label: "Personal Work-Life Balance and Recovery Toolkit",
    file: path.join("implementation-toolkits", "ei48-employee-toolkit.pdf"),
    downloadName: "ROALLA_Personal_Work_Life_Balance_and_Recovery_Toolkit_2026.pdf",
  },
} as const;

export type ImplementationToolkitItem = keyof typeof IMPLEMENTATION_TOOLKIT_ITEMS;

const LINK_LIFETIME_MS = 14 * 24 * 60 * 60 * 1000;

function secret() {
  return process.env.IMPLEMENTATION_TOOLKIT_SECRET?.trim()
    || process.env.EXECUTIVE_GUIDE_SECRET?.trim()
    || process.env.AUTH_MAIL_SECRET?.trim()
    || "";
}

function signature(item: ImplementationToolkitItem, expires: number) {
  const key = secret();
  if (!key) throw new Error("Implementation toolkit downloads are not configured.");
  return createHmac("sha256", key).update(`${item}:${expires}`).digest("hex");
}

export function createImplementationToolkitDownloads(origin: string) {
  const expires = Date.now() + LINK_LIFETIME_MS;
  const downloads = (Object.keys(IMPLEMENTATION_TOOLKIT_ITEMS) as ImplementationToolkitItem[]).map((item) => {
    const url = new URL("/api/implementation-toolkits/download", origin);
    url.searchParams.set("item", item);
    url.searchParams.set("expires", String(expires));
    url.searchParams.set("token", signature(item, expires));
    return { item, label: IMPLEMENTATION_TOOLKIT_ITEMS[item].label, url: url.toString() };
  });
  return { downloads, expiresAt: new Date(expires) };
}

export function verifyImplementationToolkitDownload(item: string, expires: number, token: string): item is ImplementationToolkitItem {
  if (!(item in IMPLEMENTATION_TOOLKIT_ITEMS) || !Number.isFinite(expires) || expires < Date.now()) return false;
  try {
    const expected = Buffer.from(signature(item as ImplementationToolkitItem, expires), "hex");
    const received = Buffer.from(token, "hex");
    return expected.length === received.length && timingSafeEqual(expected, received);
  } catch {
    return false;
  }
}

export function implementationToolkitPath(item: ImplementationToolkitItem) {
  return path.join(process.cwd(), "private", IMPLEMENTATION_TOOLKIT_ITEMS[item].file);
}

export function implementationToolkitDownloadName(item: ImplementationToolkitItem) {
  return IMPLEMENTATION_TOOLKIT_ITEMS[item].downloadName;
}
