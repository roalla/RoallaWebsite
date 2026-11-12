const attributionKeys = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid", "msclkid"];
const query = new URLSearchParams(window.location.search);
const incoming = Object.fromEntries(attributionKeys.filter((key) => query.get(key)).map((key) => [key, query.get(key)]));

try {
  const existing = JSON.parse(localStorage.getItem("roalla_attribution") || "{}");
  const attribution = { ...existing, ...incoming };
  if (Object.keys(attribution).length) {
    localStorage.setItem("roalla_attribution", JSON.stringify(attribution));
    document.querySelectorAll("a[data-attribution]").forEach((link) => {
      const target = new URL(link.href);
      Object.entries(attribution).forEach(([key, value]) => target.searchParams.set(key, value));
      target.searchParams.set("ref", "roalla-insights");
      link.href = target.toString();
    });
  }
} catch {
  // The experience remains fully usable when storage is unavailable.
}

document.querySelectorAll("[data-year]").forEach((node) => { node.textContent = new Date().getFullYear(); });

const header = document.querySelector(".site-header");
if (header) {
  const updateHeader = () => header.classList.toggle("is-scrolled", window.scrollY > 10);
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });
}

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if (!reduceMotion) {
  const revealNodes = document.querySelectorAll(".reveal-on-scroll");
  if (revealNodes.length && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.16, rootMargin: "0px 0px -8% 0px" });
    revealNodes.forEach((node) => observer.observe(node));
  } else {
    revealNodes.forEach((node) => node.classList.add("is-visible"));
  }
} else {
  document.querySelectorAll(".reveal-on-scroll").forEach((node) => node.classList.add("is-visible"));
}

const form = document.querySelector("[data-preferences-form]");
if (form) {
  const emailInput = form.querySelector("input[name='email']");
  const requestedEmail = query.get("email");
  if (requestedEmail && emailInput) emailInput.value = requestedEmail;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const language = document.documentElement.lang === "fr" ? "français" : "English";
    const action = form.dataset.action === "unsubscribe" ? "unsubscribe" : String(data.get("frequency") || "update preferences");
    const subject = form.dataset.action === "unsubscribe" ? "ROALLA unsubscribe request" : "ROALLA communication preferences";
    const body = `Request: ${action}\nEmail: ${data.get("email")}\nPreferred language: ${language}\nSource: ROALLA Insights`;
    window.location.href = `mailto:sales@roalla.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    const status = form.querySelector("[role='status']");
    if (status) status.hidden = false;
  });
}
