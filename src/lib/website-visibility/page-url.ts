function pagePath(url: URL) {
  return url.pathname.replace(/\/+$/, "") || "/";
}

/** True when two addresses are the same public page, ignoring a trailing slash. */
export function isSamePublicPage(left: string, right: string) {
  try {
    const a = new URL(left);
    const b = new URL(right);
    return a.origin === b.origin && pagePath(a) === pagePath(b);
  } catch {
    return left === right;
  }
}
