'use client'

import { useState } from 'react'

type Props = {
  locale: string
  operatorName: string
}

type FormState = {
  recipientName: string
  companyName: string
  email: string
  language: 'en' | 'fr'
}

const INITIAL_FORM: FormState = {
  recipientName: '',
  companyName: '',
  email: '',
  language: 'en',
}

export default function ToolkitReleaseConsole({ locale, operatorName }: Props) {
  const [form, setForm] = useState<FormState>({ ...INITIAL_FORM, language: locale === 'fr' ? 'fr' : 'en' })
  const [pending, setPending] = useState(false)
  const [confirming, setConfirming] = useState(false)
  const [message, setMessage] = useState<{ tone: 'success' | 'error'; text: string } | null>(null)

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((current) => ({ ...current, [key]: value }))
    setMessage(null)
  }

  async function releaseToolkit() {
    setPending(true)
    setMessage(null)
    try {
      const response = await fetch('/api/implementation-toolkits/release', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ toolkit: 'ei48', ...form }),
      })
      const result = (await response.json().catch(() => ({}))) as { error?: string; email?: string }
      if (!response.ok) throw new Error(result.error || 'The toolkit could not be released.')
      setMessage({
        tone: 'success',
        text: `Toolkit sent to ${result.email || form.email}. The secure download links expire in 14 days.`,
      })
      setForm({ ...INITIAL_FORM, language: form.language })
      setConfirming(false)
    } catch (error) {
      setMessage({ tone: 'error', text: error instanceof Error ? error.message : 'The toolkit could not be released.' })
    } finally {
      setPending(false)
    }
  }

  return (
    <main className="min-h-screen bg-slate-100 text-slate-950">
      <header className="border-b border-white/10 bg-slate-950 text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-5 py-5 sm:px-8">
          <a href="https://sso.roalla.com/home.html" className="flex items-center gap-3" aria-label="Return to Roalla Home">
            <img src="/roalla-logo.svg" alt="" width="38" height="38" className="h-9 w-9" />
            <span className="leading-none"><strong className="block text-lg tracking-[0.18em] text-white">ROALLA</strong><span className="mt-1 block text-xs text-slate-300">Client delivery</span></span>
          </a>
          <div className="text-right text-xs text-slate-300"><span className="block">Signed in</span><strong className="text-white">{operatorName || 'ROALLA operator'}</strong></div>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-7 px-5 py-10 sm:px-8 lg:grid-cols-[minmax(0,1fr)_21rem] lg:py-14">
        <section>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-700">Post-consultation delivery</p>
          <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">Release the complete EI—48 toolkit in one step.</h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">Send the executive guide, manager playbook, and employee toolkit through branded email with secure download links. No legacy Hub customer record is required.</p>

          <form className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8" onSubmit={(event) => { event.preventDefault(); setConfirming(true) }}>
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="grid gap-2 text-sm font-semibold text-slate-800">Recipient name<input required value={form.recipientName} onChange={(event) => update('recipientName', event.target.value)} className="min-h-12 rounded-xl border border-slate-300 px-4 text-base font-normal outline-none focus:border-cyan-700 focus:ring-2 focus:ring-cyan-100" placeholder="Jordan Lee" /></label>
              <label className="grid gap-2 text-sm font-semibold text-slate-800">Company name <span className="font-normal text-slate-500">(optional)</span><input value={form.companyName} onChange={(event) => update('companyName', event.target.value)} className="min-h-12 rounded-xl border border-slate-300 px-4 text-base font-normal outline-none focus:border-cyan-700 focus:ring-2 focus:ring-cyan-100" placeholder="Client organization" /></label>
              <label className="grid gap-2 text-sm font-semibold text-slate-800 sm:col-span-2">Recipient email<input required type="email" value={form.email} onChange={(event) => update('email', event.target.value)} className="min-h-12 rounded-xl border border-slate-300 px-4 text-base font-normal outline-none focus:border-cyan-700 focus:ring-2 focus:ring-cyan-100" placeholder="name@company.ca" /></label>
              <label className="grid gap-2 text-sm font-semibold text-slate-800">Email language<select value={form.language} onChange={(event) => update('language', event.target.value as 'en' | 'fr')} className="min-h-12 rounded-xl border border-slate-300 bg-white px-4 text-base font-normal outline-none focus:border-cyan-700 focus:ring-2 focus:ring-cyan-100"><option value="en">English</option><option value="fr">Français</option></select></label>
            </div>

            {message && <div className={`mt-6 rounded-xl border px-4 py-3 text-sm ${message.tone === 'success' ? 'border-emerald-300 bg-emerald-50 text-emerald-900' : 'border-red-300 bg-red-50 text-red-900'}`} role="status">{message.text}</div>}

            {!confirming ? (
              <button type="submit" className="mt-7 min-h-12 rounded-xl bg-slate-950 px-6 font-semibold text-white transition hover:bg-cyan-800">Review release</button>
            ) : (
              <div className="mt-7 rounded-xl border border-amber-300 bg-amber-50 p-5">
                <p className="font-semibold text-slate-950">Confirm client delivery</p>
                <p className="mt-1 text-sm text-slate-700">Send all three EI—48 resources to <strong>{form.email}</strong>? Links will expire in 14 days.</p>
                <div className="mt-4 flex flex-wrap gap-3"><button type="button" disabled={pending} onClick={() => void releaseToolkit()} className="min-h-11 rounded-lg bg-slate-950 px-5 text-sm font-semibold text-white disabled:opacity-50">{pending ? 'Sending…' : 'Send complete toolkit'}</button><button type="button" disabled={pending} onClick={() => setConfirming(false)} className="min-h-11 rounded-lg border border-slate-300 bg-white px-5 text-sm font-semibold text-slate-800">Go back</button></div>
              </div>
            )}
          </form>
        </section>

        <aside className="space-y-5">
          <div className="rounded-2xl bg-slate-950 p-6 text-white shadow-sm"><p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-300">Included</p><ol className="mt-5 space-y-5"><li><strong className="block">01 · Executive guide</strong><span className="mt-1 block text-sm leading-6 text-slate-300">Leadership context, evidence, governance, and action framework.</span></li><li><strong className="block">02 · Manager playbook</strong><span className="mt-1 block text-sm leading-6 text-slate-300">Practical workload, prioritization, conversation, and escalation tools.</span></li><li><strong className="block">03 · Employee toolkit</strong><span className="mt-1 block text-sm leading-6 text-slate-300">Simple personal planning, recovery, breathing, and mindfulness exercises.</span></li></ol></div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6"><p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-700">Control points</p><ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600"><li>Confirm consent and the correct recipient.</li><li>Do not enter sensitive health or consultation notes.</li><li>Links expire automatically after 14 days.</li><li>ROALLA does not track personal toolkit responses.</li></ul></div>
        </aside>
      </div>
    </main>
  )
}
