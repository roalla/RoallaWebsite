import { containsEmailAddress, emailSafeHtml } from '@/lib/email-markup'

/** Renders text normally, and opts address-bearing text out of Cloudflare's HTML rewrite. */
export default function EmailSafeText({ text }: { text: string }) {
  if (!containsEmailAddress(text)) return text
  return <span dangerouslySetInnerHTML={{ __html: emailSafeHtml(text) }} />
}
