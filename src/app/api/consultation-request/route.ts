import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import {
  buildConsultationEmailSubject,
  buildConsultationSalesEmailHtml,
  buildConsultationSalesEmailText,
  parseConsultationIntent,
  validateConsultationRequest,
  type ConsultationRequestPayload,
} from '@/lib/consultation-request'

const resend = new Resend(process.env.RESEND_API_KEY)

const EMAIL_LABELS: Record<string, string> = {
  emailHeading: 'New Service Inquiry',
  emailIntro: 'A prospective client submitted a service inquiry through the ROALLA website.',
  intent: 'Request type',
  intent_consulting: 'Business consulting',
  intent_website: 'Website project',
  intent_platform: 'Custom platform',
  intent_unsure: 'Not sure yet',
  goal: 'Goal / challenge',
  timeline: 'Timeline',
  timeline_asap: 'As soon as possible',
  timeline_1to3: '1–3 months',
  timeline_3to6: '3–6 months',
  timeline_exploring: 'Just exploring',
  consultingFocus: 'Consulting focus',
  focus_strategy: 'Strategic planning',
  focus_operations: 'Process optimization',
  focus_team: 'Team development',
  focus_data: 'Data & analytics',
  focus_innovation: 'Innovation consulting',
  focus_other: 'Other / multiple areas',
  websiteGoal: 'Website need',
  websiteGoal_new: 'New website',
  websiteGoal_redesign: 'Redesign existing site',
  websiteGoal_conversion: 'Improve conversion & performance',
  hasExistingSite: 'Existing website',
  yesNo_yes: 'Yes',
  yesNo_no: 'No',
  platformType: 'Platform type',
  platform_internal: 'Internal tool / workflow',
  platform_customer: 'Customer-facing application',
  platform_marketplace: 'Marketplace / multi-sided platform',
  platform_other: 'Other / not sure',
  name: 'Name',
  email: 'Email',
  company: 'Company',
  phone: 'Phone',
  notProvided: 'Not provided',
  submittedAt: 'Submitted',
  source: 'Website',
  locale: 'Language',
  userSubject: 'We received your service inquiry',
  userGreeting: 'Thank you for reaching out to ROALLA.',
  userBody:
    'Our team has received your request and will review the details. You can expect a response within one business day.',
  userSignoff: 'Best regards,\nThe ROALLA Team',
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Partial<ConsultationRequestPayload>
    const validationError = validateConsultationRequest(body)
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 })
    }

    const intent = parseConsultationIntent(body.intent)!
    const payload: ConsultationRequestPayload = {
      intent,
      goal: body.goal!.trim(),
      timeline: body.timeline!.trim(),
      consultingFocus: body.consultingFocus?.trim(),
      websiteGoal: body.websiteGoal?.trim(),
      hasExistingSite: body.hasExistingSite?.trim(),
      platformType: body.platformType?.trim(),
      name: body.name!.trim(),
      email: body.email!.trim(),
      company: body.company?.trim(),
      phone: body.phone?.trim(),
      locale: body.locale?.trim(),
    }

    const submittedAt = new Date().toLocaleString('en-CA', {
      timeZone: 'America/Toronto',
      dateStyle: 'medium',
      timeStyle: 'short',
    })
    const origin = request.headers.get('origin') || 'Unknown'
    const subject = buildConsultationEmailSubject(payload.name, payload.intent)
    const text = buildConsultationSalesEmailText(payload, EMAIL_LABELS, submittedAt, origin)
    const html = buildConsultationSalesEmailHtml(payload, EMAIL_LABELS, submittedAt, origin)

    if (process.env.RESEND_API_KEY) {
      try {
        await resend.emails.send({
          from: 'ROALLA Website <noreply@roalla.com>',
          to: ['sales@roalla.com'],
          replyTo: payload.email,
          subject,
          text,
          html,
        })

        await resend.emails.send({
          from: 'ROALLA Business Enablement Group <noreply@roalla.com>',
          to: [payload.email],
          subject: EMAIL_LABELS.userSubject,
          text: `${EMAIL_LABELS.userGreeting}\n\n${EMAIL_LABELS.userBody}\n\n${EMAIL_LABELS.userSignoff}`,
          html: `
            <div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto;">
              <div style="background:linear-gradient(135deg,#00b4c5,#0099a8);padding:28px 24px;border-radius:12px 12px 0 0;color:#fff;text-align:center;">
                <h1 style="margin:0;font-size:24px;">Request Received</h1>
              </div>
              <div style="padding:28px 24px;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 12px 12px;">
                <p style="color:#0f172a;">Dear ${payload.name},</p>
                <p style="color:#475569;line-height:1.6;">${EMAIL_LABELS.userGreeting} ${EMAIL_LABELS.userBody}</p>
                <p style="color:#475569;line-height:1.6;">If your matter is urgent, call us at <strong>(289) 838-5868</strong> or reply to this email.</p>
                <p style="color:#0f172a;margin-top:24px;">Best regards,<br><strong>The ROALLA Team</strong></p>
                <hr style="margin:28px 0;border:none;border-top:1px solid #e2e8f0;">
                <p style="color:#64748b;font-size:13px;margin:0;">ROALLA Business Enablement Group · sales@roalla.com · (289) 838-5868</p>
              </div>
            </div>
          `,
        })
      } catch (emailError) {
        console.error('Consultation request email failed:', emailError)
        return NextResponse.json(
          { error: 'Unable to send your request right now. Please email sales@roalla.com directly.' },
          { status: 502 },
        )
      }
    } else {
      console.log('RESEND_API_KEY not configured. Consultation request:', payload)
    }

    return NextResponse.json({
      success: true,
      message: 'Thank you. Our team will respond within one business day.',
      submissionId: `CR-${Date.now()}`,
    })
  } catch (error) {
    console.error('Consultation request error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
