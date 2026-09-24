"use client";

import { useLocale } from "next-intl";
import { CONTACT } from "@/lib/site";

type Field = { label: string; hint?: string; value: string };

export default function WorkshopPrintSheet({
  title,
  promise,
  journey,
  fields,
  path,
}: {
  title: string;
  promise: string;
  journey: string;
  fields: Field[];
  path: string;
}) {
  const locale = useLocale();
  const lang = locale === "fr" ? "fr" : "en";
  const pageUrl = `https://www.roalla.com/${lang}${path}`;
  const year = new Date().getFullYear();
  const planLabel = lang === "fr" ? "Plan d’atelier" : "Workshop plan";

  return (
    <>
      <style>{`
        .workshop-print-sheet {
          position: absolute;
          width: 1px;
          height: 1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
        }
        @media print {
          @page { margin: 0; }
          body * { visibility: hidden !important; }
          .fixed { visibility: hidden !important; display: none !important; }
          .workshop-print-sheet,
          .workshop-print-sheet * { visibility: visible !important; }
          .workshop-print-sheet {
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
          .workshop-print-sheet h1,
          .workshop-print-sheet h2 {
            color: #07111f;
            font-family: Sora, Georgia, serif;
          }
        }
      `}</style>
      <article className="workshop-print-sheet" aria-hidden="true">
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
            {journey}
          </p>
        </header>

        <div style={{ flex: 1, padding: "28px 32px 12px" }}>
          <p style={{ margin: 0, fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#007a87" }}>
            {planLabel}
          </p>
          <h1 style={{ margin: "8px 0 0", fontSize: 32, lineHeight: 1.1 }}>{title}</h1>
          <p style={{ margin: "12px 0 0", maxWidth: 640, fontSize: 15, lineHeight: 1.5, color: "#334155" }}>{promise}</p>
          <div style={{ marginTop: 22 }}>
            {fields.map((field, index) => (
              <section key={field.label} style={{ display: "grid", gridTemplateColumns: "42px 1fr", gap: 12, marginTop: 16, paddingTop: 14, borderTop: "1px solid #e2e8f0" }}>
                <p style={{ margin: 0, fontFamily: "Sora, Georgia, serif", fontSize: 18, fontWeight: 700, color: "#f5c518" }}>
                  {String(index + 1).padStart(2, "0")}
                </p>
                <div>
                  <h2 style={{ margin: 0, fontSize: 16 }}>{field.label}</h2>
                  {field.hint ? <p style={{ margin: "4px 0 0", fontSize: 12, color: "#64748b" }}>{field.hint}</p> : null}
                  <p style={{ margin: "10px 0 0", minHeight: 48, padding: "8px 10px", border: "1px solid #e2e8f0", borderLeft: "3px solid #00b4c5", background: "#f8fafc", whiteSpace: "pre-wrap", fontSize: 14, lineHeight: 1.45 }}>
                    {field.value || " "}
                  </p>
                </div>
              </section>
            ))}
          </div>
        </div>

        <footer style={{ marginTop: "auto", padding: "0 32px 18px" }}>
          <div style={{ height: 3, background: "#07111f" }} />
          <div style={{ height: 3, width: 72, background: "#f5c518" }} />
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, marginTop: 10, fontSize: 11, letterSpacing: "0.04em", color: "#334155" }}>
            <span>www.roalla.com</span>
            <span>{CONTACT.email}</span>
            <span>(289) 838-5868</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, marginTop: 6, fontSize: 10, color: "#64748b" }}>
            <span>© {year} Roalla Business Enablement Group</span>
            <span>{pageUrl.replace("https://", "")}</span>
          </div>
        </footer>
      </article>
    </>
  );
}
