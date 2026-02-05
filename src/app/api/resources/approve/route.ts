import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { accessRequests } from '@/lib/access-requests'

const resend = new Resend(process.env.RESEND_API_KEY)

// Mark route as dynamic
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const requestId = searchParams.get('requestId')
    const token = searchParams.get('token')

    if (!requestId || !token) {
      return NextResponse.json(
        { error: 'Request ID and token are required' },
        { status: 400 }
      )
    }

    const accessRequest = accessRequests.get(requestId)

    if (!accessRequest) {
      return NextResponse.json(
        { error: 'Access request not found' },
        { status: 404 }
      )
    }

    // Verify token matches
    if (accessRequest.token !== token) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    // Approve the request
    accessRequest.status = 'approved'
    accessRequests.set(requestId, accessRequest)

    // Send access email to user
    if (process.env.RESEND_API_KEY) {
      const accessUrl = `${request.headers.get('origin') || 'https://roalla.com'}/resources/portal?token=${accessRequest.token}&email=${encodeURIComponent(accessRequest.email)}`

      try {
        await resend.emails.send({
          from: 'Roalla Business Enablement Group <noreply@roalla.com>',
          to: [accessRequest.email],
          subject: 'Your Resources Portal Access Has Been Approved',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background: linear-gradient(135deg, #00b4c5, #ffd700); padding: 30px; text-align: center; color: white;">
                <h1 style="margin: 0; font-size: 28px;">Access Approved!</h1>
                <p style="margin: 10px 0 0 0; font-size: 16px;">Welcome to the Resources Portal</p>
              </div>
              <div style="padding: 30px;">
                <p>Dear ${accessRequest.name},</p>
                <p>Great news! Your request to access the Roalla Resources Portal has been approved.</p>
                <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
                  <a href="${accessUrl}" style="display: inline-block; background: #00b4c5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 10px 0;">
                    Access Resources Portal
                  </a>
                </div>
                <p style="font-size: 14px; color: #666;">Or copy and paste this link into your browser:</p>
                <p style="font-size: 12px; color: #999; word-break: break-all;">${accessUrl}</p>
                <p style="margin-top: 20px;">This link will remain active for your account. You can bookmark it for future access.</p>
                <p>If you have any questions, please contact us at <strong>sales@roalla.com</strong>.</p>
                <p>Best regards,<br><strong>The Roalla Team</strong></p>
              </div>
            </div>
          `
        })
      } catch (emailError) {
        console.error('Email sending failed:', emailError)
      }
    }

    // Return success page
    const accessUrl = `${request.headers.get('origin') || 'https://roalla.com'}/resources/portal?token=${accessRequest.token}&email=${encodeURIComponent(accessRequest.email)}`
    
    return new NextResponse(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Access Approved</title>
          <meta charset="utf-8">
          <style>
            body {
              font-family: Arial, sans-serif;
              display: flex;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              margin: 0;
              background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            }
            .container {
              background: white;
              padding: 40px;
              border-radius: 12px;
              box-shadow: 0 10px 40px rgba(0,0,0,0.1);
              text-align: center;
              max-width: 500px;
            }
            h1 { color: #00b4c5; margin-bottom: 20px; }
            p { color: #666; line-height: 1.6; }
            .success-icon {
              width: 80px;
              height: 80px;
              background: #10b981;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              margin: 0 auto 20px;
              color: white;
              font-size: 40px;
            }
            a {
              display: inline-block;
              background: #00b4c5;
              color: white;
              padding: 12px 24px;
              text-decoration: none;
              border-radius: 8px;
              margin-top: 20px;
              font-weight: bold;
            }
            a:hover { background: #0099a8; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="success-icon">✓</div>
            <h1>Access Approved!</h1>
            <p>The user has been notified via email and can now access the Resources Portal.</p>
            <a href="${accessUrl}" target="_blank">View Portal</a>
          </div>
        </body>
      </html>
    `, {
      headers: {
        'Content-Type': 'text/html',
      },
    })
  } catch (error) {
    console.error('Error approving access:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
