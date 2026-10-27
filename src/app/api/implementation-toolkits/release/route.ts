import { NextRequest, NextResponse } from 'next/server'
import { requireHubSession } from '@/lib/hub/auth-session'
import { canManageCustomers } from '@/lib/hub/permissions'
import { createImplementationToolkitDownloads } from '@/lib/implementation-toolkit-files.server'
import { inquiryEmailButton, inquiryEmailParagraph, inquiryEmailPlainFooter, renderInquiryEmail } from '@/lib/inquiry-email'
import { hubMailConfigured, sendHubMail } from '@/lib/roalla-auth/hub-mail'
import { CONTACT } from '@/lib/site'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function text(value: unknown, max: number) {
  return typeof value === 'string' ? value.trim().slice(0, max) : ''
}

function emailIsValid(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value.length <= 254
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character] || character)
}

export async function POST(request: NextRequest) {
  try {
    const { user } = await requireHubSession()
    if (!canManageCustomers(user.role)) return NextResponse.json({ error: 'Forbidden.' }, { status: 403 })
    if (!hubMailConfigured()) return NextResponse.json({ error: 'Outbound email is not configured.' }, { status: 503 })

    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>
    if (body.toolkit !== 'ei48') return NextResponse.json({ error: 'Unknown toolkit.' }, { status: 400 })
    const recipientName = text(body.recipientName, 100)
    const companyName = text(body.companyName, 160)
    const email = text(body.email, 254).toLowerCase()
    const french = body.language === 'fr'
    if (!recipientName || !emailIsValid(email)) return NextResponse.json({ error: 'Enter a valid recipient name and email.' }, { status: 400 })

    const { downloads } = createImplementationToolkitDownloads(request.nextUrl.origin)
    const greetingText = french ? `Bonjour ${recipientName},` : `Hello ${recipientName},`
    const greeting = french ? `Bonjour ${escapeHtml(recipientName)},` : `Hello ${escapeHtml(recipientName)},`
    const organization = companyName ? (french ? ` pour ${companyName}` : ` for ${companyName}`) : ''
    const intro = french
      ? `Merci pour votre conversation avec ROALLA. Votre trousse de mise en œuvre EI—48${organization} est maintenant prête.`
      : `Thank you for your conversation with ROALLA. Your EI—48 implementation toolkit${organization} is now ready.`
    const safeIntro = escapeHtml(intro)
    const expiry = french
      ? 'Ces liens sécurisés expirent dans 14 jours. Veuillez télécharger et conserver les documents conformément aux politiques de votre organisation.'
      : 'These secure links expire in 14 days. Please download and retain the documents in accordance with your organization’s policies.'
    const footerNote = french
      ? 'Vous recevez ce courriel parce que ROALLA a remis des ressources de mise en œuvre à la suite d’une consultation client.'
      : 'You are receiving this email because ROALLA released implementation resources following a client consultation.'
    const reply = french
      ? 'Répondez à ce courriel si vous souhaitez adapter les ressources à votre organisation.'
      : 'Reply to this email if you would like help tailoring the resources to your organization.'

    const html = renderInquiryEmail({
      title: french ? 'Votre trousse ROALLA EI—48' : 'Your ROALLA EI—48 toolkit',
      preheader: french ? 'Vos ressources de mise en œuvre sont prêtes.' : 'Your implementation resources are ready.',
      eyebrow: 'ROALLA Executive Insights',
      headline: french ? 'Votre trousse est prête' : 'Your toolkit is ready',
      bodyHtml: `${inquiryEmailParagraph(greeting)}${inquiryEmailParagraph(safeIntro)}${downloads.map((download) => inquiryEmailButton(download.url, download.label)).join('')}${inquiryEmailParagraph(expiry)}${inquiryEmailParagraph(reply)}`,
      footerNote,
    })
    const plain = [greetingText, '', intro, '', ...downloads.flatMap((download) => [`${download.label}:`, download.url, '']), expiry, '', reply, '', inquiryEmailPlainFooter(footerNote)].join('\n')
    const mail = await sendHubMail({
      to: email,
      replyTo: CONTACT.email,
      subject: french ? 'Votre trousse ROALLA EI—48 est prête' : 'Your ROALLA EI—48 toolkit is ready',
      html,
      text: plain,
    })
    if (!mail.ok) return NextResponse.json({ error: mail.error || 'The toolkit email could not be sent.' }, { status: 502 })

    return NextResponse.json({ success: true, email })
  } catch (error) {
    console.error('Toolkit release failed', error)
    const unauthorized = error instanceof Error && error.message === 'UNAUTHORIZED'
    return NextResponse.json({ error: unauthorized ? 'Sign in again before releasing the toolkit.' : 'The toolkit could not be released.' }, { status: unauthorized ? 401 : 500 })
  }
}
