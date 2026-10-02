"use client";

import { useEffect, useState } from "react";
import { emailSafeHtml } from "@/lib/email-markup";
import { CONTACT } from "@/lib/site";

export type CommunicationsPrintField = {
  label: string;
  hint?: string;
  value: string;
  accent?: "gold" | "teal";
};

export default function CommunicationsValueBriefPrintSheet({
  locale,
  eyebrow,
  title,
  subtitle,
  opportunityLabel,
  opportunityValue,
  opportunityNote,
  contextLabel,
  contextValue,
  fields,
  disclaimer,
}: {
  locale: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  opportunityLabel: string;
  opportunityValue: string;
  opportunityNote: string;
  contextLabel: string;
  contextValue: string;
  fields: CommunicationsPrintField[];
  disclaimer: string;
}) {
  const lang = locale === "fr" ? "fr" : "en";
  const pageUrl = `https://www.roalla.com/${lang}/tools/communications-value-brief`;
  const year = new Date().getFullYear();
  const [prepared, setPrepared] = useState("");

  useEffect(() => {
    const now = new Date();
    setPrepared(
      lang === "fr"
        ? `Préparé le ${now.toLocaleDateString("fr-CA", { year: "numeric", month: "long", day: "numeric" })}`
        : `Prepared ${now.toLocaleDateString("en-CA", { year: "numeric", month: "long", day: "numeric" })}`,
    );
  }, [lang]);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .comms-value-print-sheet {
          position: absolute;
          width: 1px;
          height: 1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
        }
        @media print {
          @page { margin: 0; size: letter; }
          body * { visibility: hidden !important; }
          .fixed { visibility: hidden !important; display: none !important; }
          .comms-value-print-sheet,
          .comms-value-print-sheet * { visibility: visible !important; }
          .comms-value-print-sheet {
            position: fixed;
            inset: 0;
            width: auto;
            height: auto;
            overflow: visible;
            clip: auto;
            display: flex;
            flex-direction: column;
            background: #fff;
            color: #07111f;
            font-family: Figtree, "Segoe UI", sans-serif;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .comms-value-print-sheet h1,
          .comms-value-print-sheet h2 {
            color: #07111f;
            font-family: Sora, Georgia, serif;
          }
        }
      ` }} />
      <article className="comms-value-print-sheet" aria-hidden="true">
        <header style={{ background: "#07111f", color: "#fff", padding: "18px 28px 16px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
            <p style={{ display: "flex", alignItems: "center", gap: 10, margin: 0, letterSpacing: "0.28em", fontSize: 13, fontWeight: 700 }}>
              <img src="/logo.svg" alt="" width={28} height={28} style={{ width: 28, height: 28 }} />
              ROALLA
            </p>
            <p style={{ margin: 0, fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "#7fd4de" }}>
              Business Enablement Group
            </p>
          </div>
          <div style={{ height: 3, width: 72, marginTop: 12, background: "#f5c518" }} />
          <p style={{ margin: "10px 0 0", fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: "#d7dee7" }}>
            {eyebrow}
          </p>
        </header>

        <div style={{ flex: 1, padding: "24px 32px 12px" }}>
          <p style={{ margin: 0, fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#007a87" }}>
            {lang === "fr" ? "Fiche de valeur communications" : "Communications Value Brief"}
          </p>
          <h1 style={{ margin: "8px 0 0", fontSize: 28, lineHeight: 1.15 }}>{title}</h1>
          <p style={{ margin: "10px 0 0", maxWidth: 680, fontSize: 14, lineHeight: 1.5, color: "#334155" }}>{subtitle}</p>
          <p style={{ margin: "8px 0 0", fontSize: 11, color: "#64748b" }} suppressHydrationWarning>
            {prepared || "\u00a0"}
          </p>

          <div
            style={{
              marginTop: 18,
              display: "grid",
              gridTemplateColumns: "1.1fr 0.9fr",
              gap: 14,
            }}
          >
            <div
              style={{
                border: "1px solid #e2e8f0",
                borderLeft: "4px solid #00b4c5",
                background: "#f8fafc",
                padding: "14px 16px",
              }}
            >
              <p style={{ margin: 0, fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#007a87" }}>
                {contextLabel}
              </p>
              <p style={{ margin: "8px 0 0", fontSize: 13, lineHeight: 1.45, color: "#0f172a" }}>{contextValue}</p>
            </div>
            <div
              style={{
                background: "#07111f",
                color: "#fff",
                padding: "14px 16px",
              }}
            >
              <p style={{ margin: 0, fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#7fd4de" }}>
                {opportunityLabel}
              </p>
              <p style={{ margin: "8px 0 0", fontFamily: "Sora, Georgia, serif", fontSize: 28, fontWeight: 700, color: "#f5c518" }}>
                {opportunityValue}
              </p>
              <p style={{ margin: "8px 0 0", fontSize: 11, lineHeight: 1.4, color: "#d7dee7" }}>{opportunityNote}</p>
            </div>
          </div>

          <div style={{ marginTop: 18 }}>
            {fields.map((field, index) => {
              const accent = field.accent === "gold" ? "#f5c518" : "#00b4c5";
              return (
                <section
                  key={`${field.label}-${index}`}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "42px 1fr",
                    gap: 12,
                    marginTop: 14,
                    paddingTop: 12,
                    borderTop: "1px solid #e2e8f0",
                  }}
                >
                  <p style={{ margin: 0, fontFamily: "Sora, Georgia, serif", fontSize: 18, fontWeight: 700, color: accent }}>
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <div>
                    <h2 style={{ margin: 0, fontSize: 15 }}>{field.label}</h2>
                    {field.hint ? (
                      <p style={{ margin: "4px 0 0", fontSize: 11, color: "#64748b" }}>{field.hint}</p>
                    ) : null}
                    <p
                      style={{
                        margin: "8px 0 0",
                        padding: "8px 10px",
                        border: "1px solid #e2e8f0",
                        borderLeft: `3px solid ${accent}`,
                        background: "#f8fafc",
                        whiteSpace: "pre-wrap",
                        fontSize: 13,
                        lineHeight: 1.45,
                      }}
                    >
                      {field.value || " "}
                    </p>
                  </div>
                </section>
              );
            })}
          </div>

          <p style={{ margin: "18px 0 0", fontSize: 10, lineHeight: 1.45, color: "#64748b" }}>{disclaimer}</p>
        </div>

        <footer style={{ marginTop: "auto", padding: "0 32px 18px" }}>
          <div style={{ height: 3, background: "#07111f" }} />
          <div style={{ height: 3, width: 72, background: "#f5c518" }} />
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, marginTop: 10, fontSize: 11, letterSpacing: "0.04em", color: "#334155" }}>
            <span>www.roalla.com</span>
            <span dangerouslySetInnerHTML={{ __html: emailSafeHtml(CONTACT.email) }} />
            <span>(289) 838-5868</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, marginTop: 6, fontSize: 10, color: "#64748b" }}>
            <span suppressHydrationWarning>© {year} Roalla Business Enablement Group</span>
            <span>{pageUrl.replace("https://", "")}</span>
          </div>
        </footer>
      </article>
    </>
  );
}
