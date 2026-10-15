'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { CONTACT } from '@/lib/site'

type StarterOffer = {
  name: string
  body: string
  timeline: string
}

export default function AssessmentPrintSheet({
  locale,
  score,
  lane,
  action,
  readiness,
  secondary,
  starter,
  recommendations,
  nextSteps,
  direction,
  directionLabels,
}: {
  locale: string
  score: number
  lane: string
  action: string
  readiness: string | null
  secondary: string | null
  starter: StarterOffer
  recommendations: string[]
  nextSteps: string[]
  direction: string[]
  directionLabels: string[]
}) {
  const french = locale === 'fr'
  const lang = french ? 'fr' : 'en'
  const year = new Date().getFullYear()
  const [prepared, setPrepared] = useState('')
  const [mounted, setMounted] = useState(false)

  const copy = french
    ? {
        eyebrow: 'Plan de valeur d’affaires',
        title: 'Votre point de départ recommandé',
        subtitle: 'Un résumé pratique de votre évaluation ROALLA et une direction initiale sur 90 jours.',
        prepared: 'Préparé le',
        score: 'Aperçu de préparation',
        path: 'Voie suggérée',
        action: 'Action recommandée',
        readiness: 'Point de préparation',
        also: 'À considérer aussi',
        starter: 'Point de départ à faible risque',
        recommendations: 'Recommandations clés',
        nextSteps: 'Prochaines étapes',
        direction: 'Direction sur 30, 60 et 90 jours',
        note: 'Ce document fournit une orientation initiale fondée sur vos réponses. La portée, le calendrier et le prix sont confirmés après une revue de pertinence. Aucun résultat n’est garanti.',
        confidential: 'Document préparatoire confidentiel',
        lifecycle: 'Conseiller · Rechercher · Agentique · Construire / Connecter · Améliorer',
      }
    : {
        eyebrow: 'Business Value Blueprint',
        title: 'Your recommended starting point',
        subtitle: 'A practical summary of your ROALLA assessment and an initial 90-day direction.',
        prepared: 'Prepared',
        score: 'Readiness snapshot',
        path: 'Suggested path',
        action: 'Recommended action',
        readiness: 'Readiness consideration',
        also: 'Also consider',
        starter: 'Low-risk starting point',
        recommendations: 'Key recommendations',
        nextSteps: 'Next steps',
        direction: '30, 60, and 90-day direction',
        note: 'This document provides initial direction based on your responses. Scope, timing, and pricing are confirmed after a fit review. Results are not guaranteed.',
        confidential: 'Confidential working document',
        lifecycle: 'Advise · Source · Agentic · Build / Connect · Improve',
      }

  useEffect(() => {
    setMounted(true)
    const now = new Date()
    setPrepared(
      `${copy.prepared} ${now.toLocaleDateString(french ? 'fr-CA' : 'en-CA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })}`,
    )

    const previous = document.title
    const branded = french ? 'ROALLA - Plan de valeur' : 'ROALLA - Business Value Blueprint'
    const onBefore = () => {
      document.title = branded
    }
    const onAfter = () => {
      document.title = previous
    }
    window.addEventListener('beforeprint', onBefore)
    window.addEventListener('afterprint', onAfter)
    return () => {
      window.removeEventListener('beforeprint', onBefore)
      window.removeEventListener('afterprint', onAfter)
      if (document.title === branded) document.title = previous
    }
  }, [copy.prepared, french])

  if (!mounted) return null

  return createPortal(
    <article className="assessment-print-root" aria-hidden="true">
      <style dangerouslySetInnerHTML={{ __html: `
        .assessment-print-root {
          position: absolute;
          width: 1px;
          height: 1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
        }
        @media print {
          @page { size: letter; margin: 0.38in 0.46in; }
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            height: auto !important;
            background: #fff !important;
          }
          body > *:not(.assessment-print-root) { display: none !important; }
          .assessment-print-root {
            position: static !important;
            display: block !important;
            width: 100% !important;
            height: auto !important;
            overflow: visible !important;
            clip: auto !important;
            white-space: normal !important;
            background: #fff !important;
            color: #07111f !important;
            font-family: "Roalla Figtree", Figtree, "Segoe UI", sans-serif !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .assessment-print-root h1,
          .assessment-print-root h2,
          .assessment-print-root h3 {
            color: #07111f;
            font-family: "Roalla Sora", Sora, Georgia, serif;
          }
          .assessment-print-doc {
            width: 100%;
            border-collapse: collapse;
          }
          .assessment-print-doc > thead { display: table-header-group; }
          .assessment-print-doc > tfoot { display: table-footer-group; }
          .assessment-print-keep {
            break-inside: avoid;
            page-break-inside: avoid;
          }
          .assessment-print-root h2,
          .assessment-print-root h3 {
            break-after: avoid;
            page-break-after: avoid;
          }
          .assessment-print-root p,
          .assessment-print-root li {
            orphans: 3;
            widows: 3;
          }
          .assessment-print-root a { color: inherit !important; text-decoration: none !important; }
        }
      ` }} />

      <table className="assessment-print-doc">
        <thead>
          <tr>
            <td style={{ padding: 0, border: 0 }}>
              <header style={{ background: '#07111f', color: '#fff', padding: '14px 20px 12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <img src="/logo.svg" alt="" width={30} height={30} style={{ width: 30, height: 30 }} />
                    <div>
                      <p style={{ margin: 0, fontSize: 14, fontWeight: 800, letterSpacing: '0.24em' }}>ROALLA</p>
                      <p style={{ margin: '2px 0 0', fontSize: 8, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#cbd5e1' }}>Business Enablement Group</p>
                    </div>
                  </div>
                  <p style={{ margin: 0, maxWidth: 330, textAlign: 'right', fontSize: 9, lineHeight: 1.35, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#7fd4de' }}>
                    {copy.lifecycle}
                  </p>
                </div>
                <div style={{ display: 'flex', marginTop: 10 }}>
                  <div style={{ width: 70, height: 3, background: '#f5c518' }} />
                  <div style={{ flex: 1, height: 3, background: '#00b4c5' }} />
                </div>
              </header>
            </td>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td style={{ padding: '20px 22px 16px', border: 0 }}>
              <main>
                <section className="assessment-print-keep">
                  <p style={{ margin: 0, fontSize: 10, fontWeight: 800, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#007a87' }}>{copy.eyebrow}</p>
                  <h1 style={{ margin: '7px 0 0', fontSize: 28, lineHeight: 1.12 }}>{copy.title}</h1>
                  <p style={{ margin: '8px 0 0', maxWidth: 650, fontSize: 13, lineHeight: 1.45, color: '#475569' }}>{copy.subtitle}</p>
                  <p style={{ margin: '7px 0 0', fontSize: 10, color: '#64748b' }} suppressHydrationWarning>{prepared || '\u00a0'}</p>
                </section>

                <section className="assessment-print-keep" style={{ marginTop: 16, display: 'grid', gridTemplateColumns: '0.82fr 1.25fr 1.25fr', gap: 9 }}>
                  <Metric label={copy.score} value={`${score}%`} accent="#f5c518" prominent />
                  <Metric label={copy.path} value={lane} accent="#00b4c5" />
                  <Metric label={copy.action} value={action} accent="#00b4c5" />
                </section>

                {readiness ? (
                  <section className="assessment-print-keep" style={{ marginTop: 9, border: '1px solid #dbe4ea', borderLeft: '4px solid #00b4c5', background: '#f8fafc', padding: '10px 12px' }}>
                    <p style={{ margin: 0, fontSize: 9, fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#007a87' }}>{copy.readiness}</p>
                    <p style={{ margin: '4px 0 0', fontSize: 12, fontWeight: 700, color: '#0f172a' }}>{readiness}</p>
                    {secondary ? <p style={{ margin: '3px 0 0', fontSize: 10, color: '#64748b' }}>{copy.also}: {secondary}</p> : null}
                  </section>
                ) : null}

                <section className="assessment-print-keep" style={{ marginTop: 14, border: '1px solid #eadf9a', background: '#fffbeb', padding: '13px 15px' }}>
                  <p style={{ margin: 0, fontSize: 9, fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#8a5a00' }}>{copy.starter}</p>
                  <h2 style={{ margin: '5px 0 0', fontSize: 18 }}>{starter.name}</h2>
                  <p style={{ margin: '5px 0 0', fontSize: 11, lineHeight: 1.45, color: '#334155' }}>{starter.body}</p>
                  <p style={{ margin: '5px 0 0', fontSize: 10, fontWeight: 700, color: '#334155' }}>{starter.timeline}</p>
                </section>

                <section style={{ marginTop: 16, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                  <PrintList title={copy.recommendations} items={recommendations} accent="#00b4c5" />
                  <PrintList title={copy.nextSteps} items={nextSteps} accent="#f5c518" numbered />
                </section>

                <section className="assessment-print-keep" style={{ marginTop: 17 }}>
                  <h2 style={{ margin: 0, fontSize: 16 }}>{copy.direction}</h2>
                  <div style={{ marginTop: 9, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                    {direction.map((item, index) => (
                      <div key={item} style={{ borderTop: `3px solid ${index === 1 ? '#f5c518' : '#00b4c5'}`, background: '#f8fafc', padding: '10px' }}>
                        <p style={{ margin: 0, fontSize: 8, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#007a87' }}>{directionLabels[index]}</p>
                        <p style={{ margin: '5px 0 0', fontSize: 10, lineHeight: 1.4, color: '#334155' }}>{item}</p>
                      </div>
                    ))}
                  </div>
                </section>

                <p style={{ margin: '14px 0 0', paddingTop: 9, borderTop: '1px solid #e2e8f0', fontSize: 8.5, lineHeight: 1.4, color: '#64748b' }}>{copy.note}</p>
              </main>
            </td>
          </tr>
        </tbody>

        <tfoot>
          <tr>
            <td style={{ padding: '0 22px 3px', border: 0 }}>
              <footer style={{ borderTop: '2px solid #07111f', paddingTop: 7 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, fontSize: 9, color: '#334155' }}>
                  <span style={{ fontWeight: 700 }}>roalla.com</span>
                  <span>{CONTACT.email}</span>
                  <span>{CONTACT.phone}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginTop: 4, fontSize: 8, color: '#64748b' }}>
                  <span suppressHydrationWarning>© {year} Roalla Business Enablement Group</span>
                  <span>{copy.confidential} · roalla.com/{lang}/assessment</span>
                </div>
              </footer>
            </td>
          </tr>
        </tfoot>
      </table>
    </article>,
    document.body,
  )
}

function Metric({ label, value, accent, prominent = false }: { label: string; value: string; accent: string; prominent?: boolean }) {
  return (
    <div style={{ border: '1px solid #dbe4ea', borderTop: `4px solid ${accent}`, background: '#fff', padding: '10px 11px' }}>
      <p style={{ margin: 0, fontSize: 8, fontWeight: 800, letterSpacing: '0.13em', textTransform: 'uppercase', color: '#64748b' }}>{label}</p>
      <p style={{ margin: '5px 0 0', fontSize: prominent ? 23 : 11, lineHeight: 1.25, fontWeight: 800, color: '#07111f' }}>{value}</p>
    </div>
  )
}

function PrintList({ title, items, accent, numbered = false }: { title: string; items: string[]; accent: string; numbered?: boolean }) {
  return (
    <section>
      <h2 style={{ margin: 0, fontSize: 16 }}>{title}</h2>
      <ol style={{ listStyle: 'none', margin: '9px 0 0', padding: 0 }}>
        {items.map((item, index) => (
          <li className="assessment-print-keep" key={item} style={{ display: 'grid', gridTemplateColumns: '24px 1fr', gap: 7, marginTop: index === 0 ? 0 : 7, alignItems: 'start' }}>
            <span style={{ display: 'flex', width: 20, height: 20, alignItems: 'center', justifyContent: 'center', borderRadius: 999, background: accent, color: accent === '#f5c518' ? '#07111f' : '#fff', fontSize: 8, fontWeight: 800 }}>
              {numbered ? index + 1 : '✓'}
            </span>
            <span style={{ paddingTop: 2, fontSize: 10, lineHeight: 1.4, color: '#334155' }}>{item}</span>
          </li>
        ))}
      </ol>
    </section>
  )
}
