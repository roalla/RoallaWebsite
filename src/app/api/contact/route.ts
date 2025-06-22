import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    
    // Extract form data
    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const company = formData.get('company') as string
    const phone = formData.get('phone') as string
    const service = formData.get('service') as string
    const message = formData.get('message') as string
    const budget = formData.get('budget') as string
    const timeline = formData.get('timeline') as string
    const files = formData.getAll('files') as File[]

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Validate message length
    if (message.length < 10) {
      return NextResponse.json(
        { error: 'Message must be at least 10 characters long' },
        { status: 400 }
      )
    }

    // Process files (in a real implementation, you'd upload to cloud storage)
    const fileInfo = files.map(file => ({
      name: file.name,
      size: file.size,
      type: file.type
    }))

    // Create email content for sales team
    const salesEmailContent = `
New Contact Form Submission

Name: ${name}
Email: ${email}
Company: ${company || 'Not provided'}
Phone: ${phone || 'Not provided'}
Service Interest: ${service || 'Not specified'}
Budget Range: ${budget || 'Not specified'}
Timeline: ${timeline || 'Not specified'}

Message:
${message}

Files Attached: ${fileInfo.length > 0 ? fileInfo.map(f => `${f.name} (${f.size} bytes)`).join(', ') : 'None'}

Submitted at: ${new Date().toISOString()}
Website: ${request.headers.get('origin') || 'Unknown'}
    `.trim()

    // Create confirmation email content for the user
    const userEmailContent = `
Dear ${name},

Thank you for reaching out to Roalla Business Enablement Group. We have received your inquiry and will get back to you within 24 hours.

Here's a summary of your submission:

Name: ${name}
Email: ${email}
Company: ${company || 'Not provided'}
Service Interest: ${service || 'Not specified'}
Message: ${message.substring(0, 200)}${message.length > 200 ? '...' : ''}

If you have any urgent questions, please don't hesitate to call us at 289-838-5868.

Best regards,
The Roalla Team
    `.trim()

    // Send email to sales team
    if (process.env.RESEND_API_KEY) {
      try {
        await resend.emails.send({
          from: 'Roalla Website <noreply@roalla.com>',
          to: ['sales@roalla.com'],
          subject: `New Contact Form Submission from ${name}`,
          text: salesEmailContent,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #00b4c5;">New Contact Form Submission</h2>
              <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Company:</strong> ${company || 'Not provided'}</p>
                <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
                <p><strong>Service Interest:</strong> ${service || 'Not specified'}</p>
                <p><strong>Budget Range:</strong> ${budget || 'Not specified'}</p>
                <p><strong>Timeline:</strong> ${timeline || 'Not specified'}</p>
              </div>
              <div style="background: #fff; padding: 20px; border-left: 4px solid #00b4c5; margin: 20px 0;">
                <h3>Message:</h3>
                <p style="white-space: pre-wrap;">${message}</p>
              </div>
              <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <p><strong>Files Attached:</strong> ${fileInfo.length > 0 ? fileInfo.map(f => `${f.name} (${f.size} bytes)`).join(', ') : 'None'}</p>
                <p><strong>Submitted at:</strong> ${new Date().toLocaleString()}</p>
                <p><strong>Website:</strong> ${request.headers.get('origin') || 'Unknown'}</p>
              </div>
            </div>
          `
        })

        // Send confirmation email to the user
        await resend.emails.send({
          from: 'Roalla Business Enablement Group <noreply@roalla.com>',
          to: [email],
          subject: 'Thank you for contacting Roalla Business Enablement Group',
          text: userEmailContent,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background: linear-gradient(135deg, #00b4c5, #ffd700); padding: 30px; text-align: center; color: white;">
                <h1 style="margin: 0; font-size: 28px;">Thank You!</h1>
                <p style="margin: 10px 0 0 0; font-size: 16px;">We've received your inquiry</p>
              </div>
              <div style="padding: 30px;">
                <p>Dear ${name},</p>
                <p>Thank you for reaching out to <strong>Roalla Business Enablement Group</strong>. We have received your inquiry and will get back to you within 24 hours.</p>
                
                <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <h3 style="color: #00b4c5; margin-top: 0;">Submission Summary:</h3>
                  <p><strong>Name:</strong> ${name}</p>
                  <p><strong>Email:</strong> ${email}</p>
                  <p><strong>Company:</strong> ${company || 'Not provided'}</p>
                  <p><strong>Service Interest:</strong> ${service || 'Not specified'}</p>
                  <p><strong>Message:</strong> ${message.substring(0, 200)}${message.length > 200 ? '...' : ''}</p>
                </div>
                
                <p>If you have any urgent questions, please don't hesitate to call us at <strong>289-838-5868</strong>.</p>
                
                <p>Best regards,<br>
                <strong>The Roalla Team</strong></p>
                
                <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
                <p style="color: #6b7280; font-size: 14px;">
                  Roalla Business Enablement Group<br>
                  Phone: 289-838-5868<br>
                  Email: sales@roalla.com
                </p>
              </div>
            </div>
          `
        })

        console.log('Emails sent successfully to sales team and user')
      } catch (emailError) {
        console.error('Email sending failed:', emailError)
        // Continue with the response even if email fails
      }
    } else {
      console.log('RESEND_API_KEY not configured, skipping email sending')
    }

    // Log the submission
    console.log('Contact form submission:', {
      name,
      email,
      company,
      phone,
      service,
      message,
      budget,
      timeline,
      files: fileInfo
    })

    return NextResponse.json(
      { 
        success: true, 
        message: 'Thank you for your message. We will get back to you within 24 hours.',
        submissionId: `CF-${Date.now()}`
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Handle OPTIONS request for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
} 