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

function initLadderStepper(root) {
  const tabs = [...root.querySelectorAll('[role="tab"]')];
  const panels = [...root.querySelectorAll('[role="tabpanel"]')];
  const prev = root.querySelector("[data-ladder-prev]");
  const next = root.querySelector("[data-ladder-next]");
  const fill = root.querySelector(".ladder-progress-fill");
  if (!tabs.length || !panels.length) return;

  root.setAttribute("data-ladder-ready", "true");
  let index = Math.max(0, tabs.findIndex((tab) => tab.getAttribute("aria-selected") === "true"));

  function setStep(nextIndex) {
    index = Math.max(0, Math.min(tabs.length - 1, nextIndex));
    tabs.forEach((tab, i) => {
      const selected = i === index;
      tab.setAttribute("aria-selected", selected ? "true" : "false");
      tab.tabIndex = selected ? 0 : -1;
      tab.classList.toggle("is-active", selected);
      tab.classList.toggle("is-complete", i < index);
    });
    panels.forEach((panel, i) => {
      const active = i === index;
      panel.classList.toggle("is-active", active);
      panel.hidden = !active;
    });
    if (fill) fill.style.width = tabs.length > 1 ? `${(index / (tabs.length - 1)) * 100}%` : "100%";
    if (prev) prev.disabled = index === 0;
    if (next) next.disabled = false;
  }

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => setStep(Number(tab.dataset.ladderIndex || 0)));
  });
  prev?.addEventListener("click", () => setStep(index - 1));
  next?.addEventListener("click", () => {
    if (index >= tabs.length - 1) {
      const cta = panels[index]?.querySelector(".ladder-cta");
      cta?.focus();
      return;
    }
    setStep(index + 1);
  });

  root.querySelector('[role="tablist"]')?.addEventListener("keydown", (event) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    if (event.key === "Home") setStep(0);
    else if (event.key === "End") setStep(tabs.length - 1);
    else if (event.key === "ArrowLeft") setStep(index - 1);
    else setStep(index + 1);
    tabs[index]?.focus();
  });

  setStep(index);
}

function initDeliverablesSpotlight(root) {
  const items = [...root.querySelectorAll("[data-deliverable-index]")];
  const stageTitle = root.querySelector(".deliverable-stage-title");
  const stageBody = root.querySelector(".deliverable-stage-body");
  const stage = root.querySelector(".deliverable-stage");
  if (!items.length || !stageTitle || !stageBody) return;

  root.setAttribute("data-deliverables-ready", "true");
  let index = 0;
  let timer = null;

  function setActive(nextIndex, animate = true) {
    index = (nextIndex + items.length) % items.length;
    items.forEach((item, i) => {
      const active = i === index;
      item.classList.toggle("is-active", active);
      item.setAttribute("aria-current", active ? "true" : "false");
    });
    const active = items[index];
    const title = active.querySelector("strong")?.textContent || "";
    const body = active.querySelector("p")?.textContent || "";
    stageTitle.textContent = title;
    stageBody.textContent = body;
    if (animate && !reduceMotion && stage) {
      stage.classList.remove("is-popping");
      void stage.offsetWidth;
      stage.classList.add("is-popping");
    }
  }

  function stop() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  }

  function start() {
    stop();
    if (reduceMotion) return;
    timer = setInterval(() => setActive(index + 1), 3500);
  }

  items.forEach((item) => {
    item.addEventListener("click", () => {
      setActive(Number(item.dataset.deliverableIndex || 0));
      start();
    });
  });

  root.addEventListener("keydown", (event) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    setActive(index + (event.key === "ArrowRight" ? 1 : -1));
    start();
  });

  root.addEventListener("pointerenter", stop);
  root.addEventListener("pointerleave", start);
  root.addEventListener("focusin", stop);
  root.addEventListener("focusout", (event) => {
    if (!root.contains(event.relatedTarget)) start();
  });

  setActive(0, false);
  start();
}

document.querySelectorAll("[data-ladder-stepper]").forEach(initLadderStepper);
document.querySelectorAll("[data-deliverables-spotlight]").forEach(initDeliverablesSpotlight);

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
