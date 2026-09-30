import { emailSafeHtml, protectedMailtoLink } from '@/lib/email-markup'

describe('email markup protected from Cloudflare obfuscation', () => {
  it('wraps a mailto link in the documented email_off markers', () => {
    const html = protectedMailtoLink(
      'sales@roalla.com',
      'inline-flex items-center group',
    )

    expect(html.startsWith('<!--email_off-->')).toBe(true)
    expect(html.endsWith('<!--/email_off-->')).toBe(true)
    expect(html).toContain('href="mailto:sales@roalla.com"')
    expect(html).toContain('>sales@roalla.com</a>')
    expect(html).toContain('<svg')
  })

  it('escapes characters that could break out of the link', () => {
    const html = protectedMailtoLink('a"<b>@x.com', 'class" onclick="alert(1)')

    expect(html).toContain('href="mailto:a&quot;&lt;b&gt;@x.com"')
    expect(html).toContain('class="class&quot; onclick=&quot;alert(1)"')
    expect(html).not.toContain('<b>')
  })

  it('protects an address that appears inside a sentence', () => {
    const html = emailSafeHtml('Questions: sales@roalla.com · (289) 838-5868.')

    expect(html).toBe(
      '<!--email_off-->Questions: sales@roalla.com · (289) 838-5868.<!--/email_off-->',
    )
  })
})
