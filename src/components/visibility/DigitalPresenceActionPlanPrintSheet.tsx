"use client";

import { useEffect, useState } from "react";
import { emailSafeHtml } from "@/lib/email-markup";
import { CONTACT } from "@/lib/site";
import type { ScoreName } from "@/lib/website-visibility/pagespeed";

export type PresencePrintMetric = { label: string; value: string };

export type PresencePrintDevice = {
  label: string;
  freshness: string;
  tested: string;
  finalUrl: string;
  scores: Record<ScoreName, number | null>;
  fieldScope?: string;
  fieldMetrics: PresencePrintMetric[];
  labMetrics: PresencePrintMetric[];
  opportunities: Array<{ title: string; detail?: string }>;
};

export type PresencePrintAction = {
  priority: string;
  tone: "now" | "next";
  title: string;
  why: string;
  meta: string;
};

export type PresencePrintModel = {
  website: string;
  lead: string;
  recommendationTitle: string;
  recommendationBody: string;
  errors: string[];
  redirectNote: string;
  phoneGap: string;
  agenticGap: string;
  findingTitle: string;
  findingText: string;
  lighthouse?: string;
  devices: PresencePrintDevice[];
  socialScore: number | null;
  socialChecks: PresencePrintMetric[];
  contactUrl: string;
  contactLines: string[];
  siteSetup: Array<{ id: string; title: string; value: string; note: string }>;
  agenticScore: number | null;
  agenticDevices: Array<{ label: string; score: number }>;
  agenticSignals: Array<PresencePrintMetric & { note: string }>;
  domainChecks: Array<PresencePrintMetric & { short: string; status: string; tone: "pass" | "review" | "gap"; result: string; why: string }>;
  domainName: string;
  actions: PresencePrintAction[];
  actionsEmpty: string;
  humanItems: string[];
  historyChecked: string;
  history: PresencePrintMetric[];
  comparison: {
    url: string;
    rows: Array<{ label: string; yours: string; theirs: string }>;
  } | null;
  labels: {
    executiveTitle: string;
    recommendedTitle: string;
    technicalTitle: string;
    technicalDescription: string;
    fieldTitle: string;
    fieldIntro: string;
    labTitle: string;
    opportunitiesTitle: string;
    tested: string;
    finalUrl: string;
    socialTitle: string;
    socialDescription: string;
    socialScore: string;
    contactTitle: string;
    contactDescription: string;
    setupTitle: string;
    setupDescription: string;
    agenticTitle: string;
    agenticDescription: string;
    domainTitle: string;
    domainWhy: string;
    domainChecked: string;
    actionsTitle: string;
    actionsIntro: string;
    humanTitle: string;
    previousTitle: string;
    previousIntro: string;
    competitorTitle: string;
    yourWebsite: string;
    comparisonWebsite: string;
    methodology: string;
    methodologyBody: string;
    notScored: string;
  };
};

const SCORE_ORDER: ScoreName[] = ["performance", "accessibility", "bestPractices", "seo"];

const chromeCopy = {
  en: {
    headerEyebrow: "Digital presence action plan",
    planLabel: "Action plan",
    prepared: "Prepared",
    scoreLegend: "90 or above is strong. 50 to 89 can improve. Below 50 needs attention first.",
    nextStep: "Next step: request a free review of these results. A ROALLA specialist will explain the main priority.",
    limit: "These checks are a starting point. They do not guarantee search rankings, traffic, or mentions in AI answers.",
  },
  fr: {
    headerEyebrow: "Plan d’action de présence numérique",
    planLabel: "Plan d’action",
    prepared: "Préparé le",
    scoreLegend: "90 ou plus est solide. De 50 à 89, une amélioration est possible. Sous 50, l’attention est prioritaire.",
    nextStep: "Prochaine étape : demandez un examen gratuit de ces résultats. Un spécialiste de ROALLA expliquera la priorité principale.",
    limit: "Ces vérifications sont un point de départ. Elles ne garantissent pas un classement, du trafic ni une mention dans les réponses d’IA.",
  },
} as const;

const tileLabels = {
  en: {
    performance: "Page speed",
    accessibility: "Accessibility",
    bestPractices: "Reliability",
    seo: "Search readiness",
  },
  fr: {
    performance: "Vitesse",
    accessibility: "Accessibilité",
    bestPractices: "Fiabilité",
    seo: "Recherche",
  },
} as const;

function hostnameOf(value: string) {
  try {
    const candidate = /^https?:\/\//i.test(value) ? value : `https://${value}`;
    return new URL(candidate).hostname.replace(/^www\./i, "");
  } catch {
    return value;
  }
}

function scoreColor(value: number) {
  if (value >= 90) return "#047857";
  if (value >= 50) return "#b45309";
  return "#be123c";
}

function ScoreFigure({ value, missing }: { value: number | null; missing: string }) {
  if (value == null) return <span style={{ color: "#64748b", fontWeight: 600 }}>{missing}</span>;
  return <span style={{ color: scoreColor(value), fontWeight: 700 }}>{value}</span>;
}

function SectionHeading({ children }: { children: string }) {
  return (
    <h2
      style={{
        margin: "16px 0 0",
        paddingTop: 10,
        borderTop: "1px solid #e2e8f0",
        fontSize: 15,
        lineHeight: 1.25,
      }}
    >
      {children}
    </h2>
  );
}

export default function DigitalPresenceActionPlanPrintSheet({
  locale,
  model,
}: {
  locale: string;
  model: PresencePrintModel;
}) {
  const lang = locale === "fr" ? "fr" : "en";
  const chrome = chromeCopy[lang];
  const tiles = tileLabels[lang];
  const pageUrl = `https://www.roalla.com/${lang}/tools/digital-presence-snapshot`;
  const websiteLabel = hostnameOf(model.website);
  const [year, setYear] = useState("");
  const [prepared, setPrepared] = useState("");

  useEffect(() => {
    const now = new Date();
    setYear(String(now.getFullYear()));
    setPrepared(
      now.toLocaleDateString(lang === "fr" ? "fr-CA" : "en-CA", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    );
  }, [lang]);

  useEffect(() => {
    const branded = lang === "fr"
      ? `Plan d’action ROALLA — ${websiteLabel}`
      : `ROALLA Action Plan — ${websiteLabel}`;
    const previous = document.title;
    const onBefore = () => {
      document.title = branded;
    };
    const onAfter = () => {
      document.title = previous;
    };
    window.addEventListener("beforeprint", onBefore);
    window.addEventListener("afterprint", onAfter);
    return () => {
      window.removeEventListener("beforeprint", onBefore);
      window.removeEventListener("afterprint", onAfter);
      if (document.title === branded) document.title = previous;
    };
  }, [lang, websiteLabel]);

  const sharedTested = model.devices.length > 0 && model.devices.every((device) => device.tested === model.devices[0].tested)
    ? model.devices[0].tested
    : "";
  const sharedUrl = model.devices.length > 0 && model.devices.every((device) => device.finalUrl === model.devices[0].finalUrl)
    ? model.devices[0].finalUrl
    : "";

  return (
    <article className="presence-print-root" aria-hidden="true">
      <style>{`
        .presence-print-root {
          position: absolute;
          top: 0;
          left: 0;
          width: 1px;
          height: 1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
        }
        @media print {
          @page { size: letter; margin: 0.42in 0.48in; }
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            background: #fff !important;
            height: auto !important;
          }
          body > *:not(.presence-print-root) { display: none !important; }
          .presence-print-root {
            position: static !important;
            display: block !important;
            width: auto !important;
            height: auto !important;
            overflow: visible !important;
            clip: auto !important;
            white-space: normal !important;
            background: #fff;
            color: #07111f;
            font-family: "Roalla Figtree", "Segoe UI", sans-serif;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .presence-print-root h1,
          .presence-print-root h2,
          .presence-print-root h3 {
            color: #07111f;
            font-family: "Roalla Sora", Georgia, serif;
          }
          .presence-print-doc {
            width: 100%;
            border-collapse: collapse;
          }
          .presence-print-doc > thead { display: table-header-group; }
          .presence-print-doc > tfoot { display: table-footer-group; }
          .presence-print-doc > tbody > tr,
          .presence-print-doc > tbody > tr > td {
            break-inside: auto;
            page-break-inside: auto;
          }
          .presence-print-keep {
            break-inside: avoid;
            page-break-inside: avoid;
          }
          .presence-print-root h2,
          .presence-print-root h3 {
            break-after: avoid;
            page-break-after: avoid;
          }
          .presence-print-root p,
          .presence-print-root li {
            orphans: 3;
            widows: 3;
          }
        }
      `}</style>
                <table className="presence-print-doc">
        <thead>
          <tr>
            <td style={{ padding: 0, border: 0 }}>
      <header style={{ background: "#07111f", color: "#fff", padding: "14px 18px 10px" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
                    <p style={{ display: "flex", alignItems: "center", gap: 10, margin: 0, letterSpacing: "0.28em", fontSize: 13, fontWeight: 700 }}>
                      <img src="/logo.svg" alt="" width={28} height={28} style={{ width: 28, height: 28 }} />
                      ROALLA
                    </p>
                    <p style={{ margin: 0, fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "#7fd4de" }}>
                      Business Enablement Group
                    </p>
                  </div>
                  <div style={{ height: 3, width: 72, marginTop: 8, background: "#f5c518" }} />
                  <p style={{ margin: "6px 0 0", fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: "#d7dee7" }}>
                    {chrome.headerEyebrow}
                  </p>
                </header>
            </td>
          </tr>
        </thead>
        <tfoot>
          <tr>
            <td style={{ padding: "8px 0 0", border: 0 }}>
            <footer style={{ padding: "8px 0 0", background: "#fff" }}>
                <div style={{ height: 3, background: "#07111f" }} />
                <div style={{ height: 3, width: 72, background: "#f5c518" }} />
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12, marginTop: 8, fontSize: 11, letterSpacing: "0.04em", color: "#334155", whiteSpace: "nowrap" }}>
                  <span>www.roalla.com</span>
                  <span dangerouslySetInnerHTML={{ __html: emailSafeHtml(CONTACT.email) }} />
                  <span>(289) 838-5868</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12, marginTop: 6, fontSize: 10, color: "#64748b", whiteSpace: "nowrap" }}>
                  <span suppressHydrationWarning>© {year} Roalla Business Enablement Group</span>
                  <span>{pageUrl.replace("https://", "")}</span>
                </div>
            </footer>
            </td>
          </tr>
        </tfoot>
        <tbody>
          <tr>
            <td style={{ padding: "16px 0 4px", border: 0, verticalAlign: "top" }}>
                <p style={{ margin: 0, fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#007a87" }}>
                  {chrome.planLabel}
                </p>
                <h1 style={{ margin: "8px 0 0", fontSize: 28, lineHeight: 1.15 }}>{websiteLabel}</h1>
                <p style={{ margin: "8px 0 0", fontSize: 12, lineHeight: 1.45, color: "#334155", overflowWrap: "anywhere" }}>
                  {model.website}
                </p>
                <p style={{ margin: "6px 0 0", fontSize: 11, color: "#64748b" }} suppressHydrationWarning>
                  {chrome.prepared} {prepared}
                  {sharedTested ? ` · ${model.labels.tested} ${sharedTested}` : ""}
                  {model.lighthouse ? ` · ${model.lighthouse}` : ""}
                </p>
                {sharedUrl && sharedUrl !== model.website ? (
                  <p style={{ margin: "4px 0 0", fontSize: 11, lineHeight: 1.45, color: "#64748b", overflowWrap: "anywhere" }}>
                    {model.labels.finalUrl}: {sharedUrl}
                  </p>
                ) : null}

                <div className="presence-print-keep" style={{ marginTop: 16, display: "grid", gridTemplateColumns: "1.15fr 0.85fr", gap: 12 }}>
                  <div style={{ border: "1px solid #e2e8f0", borderLeft: "4px solid #00b4c5", background: "#f8fafc", padding: "12px 14px" }}>
                    <p style={{ margin: 0, fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#007a87" }}>
                      {model.labels.executiveTitle}
                    </p>
                    <p style={{ margin: "8px 0 0", fontSize: 13, lineHeight: 1.45, color: "#0f172a" }}>{model.lead}</p>
                  </div>
                  <div style={{ border: "1px solid #e2e8f0", borderLeft: "4px solid #f5c518", background: "#fffbeb", padding: "12px 14px" }}>
                    <p style={{ margin: 0, fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#92400e" }}>
                      {model.labels.recommendedTitle}
                    </p>
                    <h2 style={{ margin: "8px 0 0", fontSize: 15, lineHeight: 1.3 }}>{model.recommendationTitle}</h2>
                    <p style={{ margin: "6px 0 0", fontSize: 12, lineHeight: 1.45, color: "#0f172a" }}>{model.recommendationBody}</p>
                  </div>
                </div>

                {model.errors.length ? (
                  <div className="presence-print-keep" style={{ marginTop: 12, border: "1px solid #fcd34d", background: "#fffbeb", padding: "10px 12px" }}>
                    {model.errors.map((error) => (
                      <p key={error} style={{ margin: "4px 0 0", fontSize: 12, lineHeight: 1.45, color: "#92400e" }}>{error}</p>
                    ))}
                  </div>
                ) : null}

                {[model.redirectNote, model.phoneGap, model.agenticGap].filter(Boolean).map((note) => (
                  <p key={note} style={{ margin: "10px 0 0", fontSize: 12, lineHeight: 1.45, color: "#334155" }}>{note}</p>
                ))}

                {model.devices.length ? (
                  <section>
                    <SectionHeading>{model.labels.technicalTitle}</SectionHeading>
                    <p style={{ margin: "4px 0 0", fontSize: 12, lineHeight: 1.45, color: "#64748b" }}>{model.labels.technicalDescription}</p>
                    <table style={{ width: "100%", marginTop: 10, borderCollapse: "collapse", fontSize: 12 }}>
                      <thead>
                        <tr>
                          <th style={{ padding: "6px 8px", borderBottom: "1px solid #e2e8f0", textAlign: "left", fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "#64748b" }}> </th>
                          {model.devices.map((device) => (
                            <th key={device.label} style={{ padding: "6px 8px", borderBottom: "1px solid #e2e8f0", textAlign: "left", fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "#007a87" }}>
                              {device.label}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {SCORE_ORDER.map((name, index) => (
                          <tr key={name} style={{ background: index % 2 === 0 ? "#f8fafc" : "#fff" }}>
                            <th style={{ padding: "7px 8px", textAlign: "left", fontWeight: 600, color: "#0f172a" }}>{tiles[name]}</th>
                            {model.devices.map((device) => (
                              <td key={device.label} style={{ padding: "7px 8px", fontSize: 14 }}>
                                <ScoreFigure value={device.scores[name]} missing={model.labels.notScored} />
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <p style={{ margin: "6px 0 0", fontSize: 10, lineHeight: 1.4, color: "#64748b" }}>{chrome.scoreLegend}</p>
                    <p style={{ margin: "4px 0 0", fontSize: 10, color: "#64748b" }}>
                      {model.devices.map((device) => `${device.label}: ${device.freshness}`).join(" · ")}
                    </p>
                  </section>
                ) : null}

                {(model.socialScore != null || model.agenticScore != null || model.agenticDevices.length > 0) ? (
                  <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: model.socialScore != null && (model.agenticScore != null || model.agenticDevices.length > 0) ? "1fr 1fr" : "1fr", gap: 12 }}>
                    {model.socialScore != null ? (
                      <div className="presence-print-keep" style={{ border: "1px solid #e2e8f0", padding: "12px 14px" }}>
                        <p style={{ margin: 0, fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#007a87" }}>{model.labels.socialScore}</p>
                        <p style={{ margin: "6px 0 0", fontFamily: "Roalla Sora, Georgia, serif", fontSize: 28, lineHeight: 1, fontWeight: 700, color: scoreColor(model.socialScore) }}>
                          {model.socialScore}<span style={{ fontSize: 14, color: "#64748b" }}>/100</span>
                        </p>
                      </div>
                    ) : null}
                    {model.agenticDevices.length || model.agenticScore != null ? (
                      <div className="presence-print-keep" style={{ border: "1px solid #e2e8f0", padding: "12px 14px" }}>
                        <p style={{ margin: 0, fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#007a87" }}>{model.labels.agenticTitle}</p>
                        {model.agenticDevices.length ? (
                          <div style={{ marginTop: 8, display: "grid", gridTemplateColumns: model.agenticDevices.length > 1 ? "1fr 1fr" : "1fr", gap: 8 }}>
                            {model.agenticDevices.map((device) => (
                              <div key={device.label}>
                                <p style={{ margin: 0, fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#64748b" }}>{device.label}</p>
                                <p style={{ margin: "4px 0 0", fontFamily: "Roalla Sora, Georgia, serif", fontSize: 28, lineHeight: 1, fontWeight: 700, color: scoreColor(device.score) }}>
                                  {device.score}<span style={{ fontSize: 14, color: "#64748b" }}>/100</span>
                                </p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p style={{ margin: "6px 0 0", fontFamily: "Roalla Sora, Georgia, serif", fontSize: 28, lineHeight: 1, fontWeight: 700, color: scoreColor(model.agenticScore ?? 0) }}>
                            {model.agenticScore}<span style={{ fontSize: 14, color: "#64748b" }}>/100</span>
                          </p>
                        )}
                      </div>
                    ) : null}
                  </div>
                ) : null}

                {model.findingText ? (
                  <div className="presence-print-keep" style={{ marginTop: 12, border: "1px solid #e2e8f0", borderLeft: "4px solid #00b4c5", background: "#f8fafc", padding: "10px 12px" }}>
                    <p style={{ margin: 0, fontSize: 12, lineHeight: 1.45, color: "#0f172a" }}>
                      <strong>{model.findingTitle}. </strong>{model.findingText}
                    </p>
                  </div>
                ) : null}

                <section>
                  <SectionHeading>{model.labels.actionsTitle}</SectionHeading>
                  <p style={{ margin: "4px 0 0", fontSize: 12, lineHeight: 1.45, color: "#64748b" }}>{model.labels.actionsIntro}</p>
                  {model.actions.length ? model.actions.map((action, index) => {
                    const accent = action.tone === "now" ? "#be123c" : "#b45309";
                    return (
                      <section
                        key={`${action.title}-${index}`}
                        className="presence-print-keep"
                        style={{ display: "grid", gridTemplateColumns: "42px 1fr", gap: 12, marginTop: 12, paddingTop: 10, borderTop: "1px solid #e2e8f0" }}
                      >
                        <p style={{ margin: 0, fontFamily: "Roalla Sora, Georgia, serif", fontSize: 18, fontWeight: 700, color: "#f5c518" }}>
                          {String(index + 1).padStart(2, "0")}
                        </p>
                        <div>
                          <p style={{ margin: 0, fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: accent }}>{action.priority}</p>
                          <h3 style={{ margin: "3px 0 0", fontSize: 14 }}>{action.title}</h3>
                          <p style={{ margin: "4px 0 0", fontSize: 12, lineHeight: 1.45, color: "#334155" }}>{action.why}</p>
                          <p style={{ margin: "6px 0 0", fontSize: 11, color: "#475569" }}>{action.meta}</p>
                        </div>
                      </section>
                    );
                  }) : (
                    <p className="presence-print-keep" style={{ margin: "10px 0 0", padding: "10px 12px", border: "1px solid #a7f3d0", background: "#ecfdf5", fontSize: 12, lineHeight: 1.45, color: "#065f46" }}>
                      {model.actionsEmpty}
                    </p>
                  )}
                </section>

                {model.devices.map((device) => (
                  <section key={device.label}>
                    <SectionHeading>{device.label}</SectionHeading>
                    {!sharedTested || !sharedUrl ? (
                      <p style={{ margin: "4px 0 0", fontSize: 11, lineHeight: 1.45, color: "#64748b", overflowWrap: "anywhere" }}>
                        {!sharedTested ? `${model.labels.tested}: ${device.tested}` : ""}
                        {!sharedTested && !sharedUrl ? " · " : ""}
                        {!sharedUrl ? `${model.labels.finalUrl}: ${device.finalUrl}` : ""}
                      </p>
                    ) : null}
                    {device.fieldMetrics.length ? (
                      <div className="presence-print-keep" style={{ marginTop: 8 }}>
                        <h3 style={{ margin: 0, fontSize: 13 }}>{model.labels.fieldTitle}</h3>
                        <p style={{ margin: "2px 0 0", fontSize: 11, color: "#64748b" }}>
                          {device.fieldScope ?? model.labels.fieldIntro}
                        </p>
                        <div style={{ marginTop: 6, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
                          {device.fieldMetrics.map((metric) => (
                            <div key={metric.label} style={{ border: "1px solid #e2e8f0", background: "#f8fafc", padding: "6px 8px" }}>
                              <p style={{ margin: 0, fontSize: 10, color: "#64748b" }}>{metric.label}</p>
                              <p style={{ margin: "2px 0 0", fontSize: 13, fontWeight: 700 }}>{metric.value}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : null}
                    {device.labMetrics.length ? (
                      <div style={{ marginTop: 8 }}>
                        <h3 style={{ margin: 0, fontSize: 13 }}>{model.labels.labTitle}</h3>
                        <div style={{ marginTop: 6, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                          {device.labMetrics.map((metric) => (
                            <div key={metric.label} className="presence-print-keep" style={{ border: "1px solid #e2e8f0", padding: "6px 8px" }}>
                              <p style={{ margin: 0, fontSize: 10, color: "#64748b" }}>{metric.label}</p>
                              <p style={{ margin: "2px 0 0", fontSize: 13, fontWeight: 700 }}>{metric.value}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : null}
                    {device.opportunities.length ? (
                      <div className="presence-print-keep" style={{ marginTop: 8 }}>
                        <h3 style={{ margin: 0, fontSize: 13 }}>{device.label}: {model.labels.opportunitiesTitle}</h3>
                        <ol style={{ margin: "6px 0 0", padding: 0, listStyle: "none" }}>
                          {device.opportunities.map((opportunity, index) => (
                            <li key={`${opportunity.title}-${index}`} className="presence-print-keep" style={{ display: "grid", gridTemplateColumns: "22px 1fr", gap: 8, marginTop: 6, fontSize: 12, lineHeight: 1.4 }}>
                              <span style={{ fontFamily: "Roalla Sora, Georgia, serif", fontWeight: 700, color: "#007a87" }}>{index + 1}</span>
                              <span>
                                <span style={{ fontWeight: 700, color: "#0f172a" }}>{opportunity.title}</span>
                                {opportunity.detail ? <span style={{ display: "block", color: "#475569" }}>{opportunity.detail}</span> : null}
                              </span>
                            </li>
                          ))}
                        </ol>
                      </div>
                    ) : null}
                  </section>
                ))}

                {model.socialChecks.length ? (
                  <section>
                    <SectionHeading>{model.labels.socialTitle}</SectionHeading>
                    <p style={{ margin: "4px 0 0", fontSize: 12, lineHeight: 1.45, color: "#64748b" }}>{model.labels.socialDescription}</p>
                    <div style={{ marginTop: 8, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                      {model.socialChecks.map((check) => (
                        <div key={check.label} className="presence-print-keep" style={{ border: "1px solid #e2e8f0", padding: "8px 10px" }}>
                          <p style={{ margin: 0, fontSize: 11, lineHeight: 1.35, color: "#334155" }}>{check.label}</p>
                          <p style={{ margin: "3px 0 0", fontSize: 13, fontWeight: 700 }}>{check.value}</p>
                        </div>
                      ))}
                    </div>
                  </section>
                ) : null}

                {model.contactLines.length ? (
                  <section>
                    <SectionHeading>{model.labels.contactTitle}</SectionHeading>
                    <p style={{ margin: "4px 0 0", fontSize: 12, lineHeight: 1.45, color: "#64748b" }}>{model.labels.contactDescription}</p>
                    {model.contactUrl ? (
                      <p style={{ margin: "6px 0 0", fontSize: 11, lineHeight: 1.45, color: "#334155", overflowWrap: "anywhere" }}>
                        {model.labels.finalUrl}: {model.contactUrl}
                      </p>
                    ) : null}
                    <ul style={{ margin: "8px 0 0", padding: 0, listStyle: "none" }}>
                      {model.contactLines.map((line) => (
                        <li key={line} className="presence-print-keep" style={{ marginTop: 6, fontSize: 12, lineHeight: 1.45, color: "#334155" }}>{line}</li>
                      ))}
                    </ul>
                  </section>
                ) : null}

                {model.siteSetup.length ? (
                  <section>
                    <SectionHeading>{model.labels.setupTitle}</SectionHeading>
                    <p style={{ margin: "4px 0 0", fontSize: 12, lineHeight: 1.45, color: "#64748b" }}>{model.labels.setupDescription}</p>
                    <div style={{ marginTop: 8, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                      {model.siteSetup.map((item) => (
                        <div key={item.id} className="presence-print-keep" style={{ border: "1px solid #e2e8f0", background: "#f8fafc", padding: "8px 10px" }}>
                          <p style={{ margin: 0, fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "#64748b" }}>{item.title}</p>
                          <p style={{ margin: "3px 0 0", fontSize: 13, fontWeight: 700 }}>{item.value}</p>
                          <p style={{ margin: "3px 0 0", fontSize: 11, lineHeight: 1.4, color: "#334155" }}>{item.note}</p>
                        </div>
                      ))}
                    </div>
                  </section>
                ) : null}

                {model.domainChecks.length ? (
                  <section>
                    <SectionHeading>{model.labels.domainTitle}</SectionHeading>
                    <p style={{ margin: "4px 0 0", fontSize: 12, lineHeight: 1.45, color: "#64748b" }}>{model.labels.domainChecked} {model.domainName}</p>
                    <p style={{ margin: "6px 0 0", fontSize: 12, lineHeight: 1.45, color: "#334155" }}>{model.labels.domainWhy}</p>
                    <div style={{ marginTop: 8, display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {model.domainChecks.map((check) => {
                        const tone = check.tone === "pass"
                          ? { background: "#ecfdf5", color: "#047857", border: "1px solid #a7f3d0" }
                          : check.tone === "review"
                            ? { background: "#fffbeb", color: "#b45309", border: "1px solid #fde68a" }
                            : { background: "#fff1f2", color: "#be123c", border: "1px solid #fecdd3" };
                        return (
                          <span key={check.short} className="presence-print-keep" style={{ ...tone, borderRadius: 999, padding: "4px 10px", fontSize: 11, fontWeight: 700 }}>
                            {check.short} · {check.status}
                          </span>
                        );
                      })}
                    </div>
                    <div style={{ marginTop: 8, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                      {model.domainChecks.map((check) => (
                        <div key={check.label} className="presence-print-keep" style={{ border: "1px solid #e2e8f0", background: "#f8fafc", padding: "8px 10px" }}>
                          <p style={{ margin: 0, fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "#64748b" }}>{check.label}</p>
                          <p style={{ margin: "3px 0 0", fontSize: 13, fontWeight: 700 }}>{check.status}</p>
                          <p style={{ margin: "3px 0 0", fontSize: 11, lineHeight: 1.4, color: "#0f172a" }}>{check.result}</p>
                          {check.value ? <p style={{ margin: "3px 0 0", fontSize: 10, lineHeight: 1.4, color: "#64748b" }}>{check.value}</p> : null}
                          <p style={{ margin: "3px 0 0", fontSize: 11, lineHeight: 1.4, color: "#334155" }}>{check.why}</p>
                        </div>
                      ))}
                    </div>
                  </section>
                ) : null}

                {model.agenticSignals.length ? (
                  <section>
                    <SectionHeading>{model.labels.agenticTitle}</SectionHeading>
                    <p style={{ margin: "4px 0 0", fontSize: 12, lineHeight: 1.45, color: "#64748b" }}>{model.labels.agenticDescription}</p>
                    <div style={{ marginTop: 8, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                      {model.agenticSignals.map((signal) => (
                        <div key={signal.label} className="presence-print-keep" style={{ border: "1px solid #e2e8f0", background: "#f8fafc", padding: "8px 10px" }}>
                          <p style={{ margin: 0, fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "#64748b" }}>{signal.label}</p>
                          <p style={{ margin: "3px 0 0", fontSize: 13, fontWeight: 700 }}>{signal.value}</p>
                          <p style={{ margin: "3px 0 0", fontSize: 11, lineHeight: 1.4, color: "#334155" }}>{signal.note}</p>
                        </div>
                      ))}
                    </div>
                  </section>
                ) : null}

                <section className="presence-print-keep">
                  <SectionHeading>{model.labels.humanTitle}</SectionHeading>
                  <ul style={{ margin: "8px 0 0", padding: 0, listStyle: "none" }}>
                    {model.humanItems.map((item) => (
                      <li key={item} style={{ display: "grid", gridTemplateColumns: "10px 1fr", gap: 8, marginTop: 6, fontSize: 12, lineHeight: 1.45, color: "#334155" }}>
                        <span style={{ marginTop: 5, width: 6, height: 6, background: "#00b4c5" }} />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </section>

                {model.history.length ? (
                  <section>
                    <SectionHeading>{model.labels.previousTitle}</SectionHeading>
                    <p style={{ margin: "4px 0 0", fontSize: 12, lineHeight: 1.45, color: "#64748b" }}>{model.labels.previousIntro}</p>
                    {model.historyChecked ? <p style={{ margin: "2px 0 0", fontSize: 11, color: "#64748b" }}>{model.historyChecked}</p> : null}
                    <div style={{ marginTop: 8, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                      {model.history.map((row) => (
                        <div key={row.label} className="presence-print-keep" style={{ border: "1px solid #e2e8f0", padding: "8px 10px" }}>
                          <p style={{ margin: 0, fontSize: 10, color: "#64748b" }}>{row.label}</p>
                          <p style={{ margin: "3px 0 0", fontSize: 13, fontWeight: 700 }}>{row.value}</p>
                        </div>
                      ))}
                    </div>
                  </section>
                ) : null}

                {model.comparison ? (
                  <section>
                    <SectionHeading>{model.labels.competitorTitle}</SectionHeading>
                    <p style={{ margin: "4px 0 0", fontSize: 11, color: "#64748b", overflowWrap: "anywhere" }}>{model.comparison.url}</p>
                    <table style={{ width: "100%", marginTop: 8, borderCollapse: "collapse", fontSize: 12 }}>
                      <thead>
                        <tr>
                          <th style={{ padding: "6px 8px", borderBottom: "1px solid #e2e8f0", textAlign: "left" }}> </th>
                          <th style={{ padding: "6px 8px", borderBottom: "1px solid #e2e8f0", textAlign: "left" }}>{model.labels.yourWebsite}</th>
                          <th style={{ padding: "6px 8px", borderBottom: "1px solid #e2e8f0", textAlign: "left" }}>{model.labels.comparisonWebsite}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {model.comparison.rows.map((row) => (
                          <tr key={row.label}>
                            <th style={{ padding: "6px 8px", borderBottom: "1px solid #f1f5f9", textAlign: "left", fontWeight: 600 }}>{row.label}</th>
                            <td style={{ padding: "6px 8px", borderBottom: "1px solid #f1f5f9", fontWeight: 700 }}>{row.yours}</td>
                            <td style={{ padding: "6px 8px", borderBottom: "1px solid #f1f5f9", fontWeight: 700 }}>{row.theirs}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </section>
                ) : null}

                <section className="presence-print-keep" style={{ marginTop: 16 }}>
                  <h2 style={{ margin: 0, fontSize: 13 }}>{model.labels.methodology}</h2>
                  <p style={{ margin: "6px 0 0", fontSize: 10, lineHeight: 1.45, color: "#64748b" }}>{model.labels.methodologyBody}</p>
                  <p style={{ margin: "8px 0 0", fontSize: 10, lineHeight: 1.45, color: "#64748b" }}>{chrome.limit}</p>
                  <p style={{ margin: "10px 0 0", padding: "8px 10px", borderLeft: "3px solid #f5c518", background: "#fffbeb", fontSize: 12, lineHeight: 1.45, color: "#0f172a" }}>
                    {chrome.nextStep}
                  </p>
                </section>
            </td>
          </tr>
        </tbody>
      </table>
    </article>
  );
}
