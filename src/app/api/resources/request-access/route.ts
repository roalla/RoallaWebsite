import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import crypto from 'crypto'
import { prisma } from '@/lib/prisma'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    // Check DATABASE_URL before processing
    const databaseUrl = process.env.DATABASE_URL
    if (!databaseUrl) {
      console.error('❌ DATABASE_URL is not set')
      console.error('Please check Railway Variables - DATABASE_URL is missing')
      return NextResponse.json(
        { error: 'Database configuration error. Please contact support.' },
        { status: 500 }
      )
    }
    
    // Log first 100 chars (without password) for debugging
    const urlPreview = databaseUrl.replace(/:[^:@]+@/, ':****@')
    console.log('DATABASE_URL preview:', urlPreview.substring(0, 100))
    
    if (!databaseUrl.startsWith('postgresql://') && !databaseUrl.startsWith('postgres://')) {
      console.error('❌ Invalid DATABASE_URL format')
      console.error('Current value (first 100 chars):', databaseUrl.substring(0, 100))
      console.error('Expected format: postgresql://user:password@host:port/database')
      console.error('This usually means Railway Variable Reference is not resolving.')
      console.error('Try using individual variable references instead of ${{Postgres.DATABASE_URL}}')
      return NextResponse.json(
        { error: 'Database configuration error. Please contact support.' },
        { status: 500 }
      )
    }
    
    const body = await request.json()
    const { email, name, company, reason } = body

    // Validate required fields
    if (!email || !name) {
      return NextResponse.json(
        { error: 'Email and name are required' },
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

    // Generate access token
    const token = crypto.randomBytes(32).toString('hex')

    // Store access request in database
    let accessRequest
    try {
      accessRequest = await prisma.accessRequest.create({
        data: {
          email,
          name,
          company: company || null,
          reason: reason || null,
          token,
          status: 'pending'
        }
      })
    } catch (dbError: any) {
      console.error('Database error:', dbError)
      console.error('Error code:', dbError?.code)
      console.error('Error message:', dbError?.message)
      console.error('Error meta:', dbError?.meta)
      
      // Check if it's a connection error
      if (dbError?.code === 'P1001' || dbError?.message?.includes('Can\'t reach database')) {
        return NextResponse.json(
          { error: 'Database connection failed. Please try again later.' },
          { status: 503 }
        )
      }
      
      // Check if table doesn't exist
      if (dbError?.code === 'P2021' || dbError?.code === 'P2025') {
        return NextResponse.json(
          { error: 'Database table not found. Please contact support.' },
          { status: 500 }
        )
      }
      
      // Re-throw to be caught by outer catch
      throw dbError
    }

    // Send notification email to admin
    if (process.env.RESEND_API_KEY) {
      try {
        await resend.emails.send({
          from: 'Roalla Website <noreply@roalla.com>',
          to: ['sales@roalla.com'],
          subject: `New Resources Portal Access Request from ${name}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #00b4c5;">New Resources Portal Access Request</h2>
              <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Company:</strong> ${company || 'Not provided'}</p>
                <p><strong>Reason:</strong> ${reason || 'Not provided'}</p>
                <p><strong>Request ID:</strong> ${accessRequest.id}</p>
                <p><strong>Submitted at:</strong> ${new Date().toLocaleString()}</p>
              </div>
              <div style="background: #fff; padding: 20px; border-left: 4px solid #00b4c5; margin: 20px 0;">
                <p><strong>To approve this request, visit:</strong></p>
                <p><a href="${request.headers.get('origin') || 'https://roalla.com'}/api/resources/approve?requestId=${accessRequest.id}&token=${token}" style="color: #00b4c5;">Approve Access Request</a></p>
                <p style="font-size: 12px; color: #666; margin-top: 10px;">Or manually send the access link: ${request.headers.get('origin') || 'https://roalla.com'}/resources/portal?token=${token}&email=${encodeURIComponent(email)}</p>
              </div>
            </div>
          `
        })

        // Send confirmation email to user
        await resend.emails.send({
          from: 'Roalla Business Enablement Group <noreply@roalla.com>',
          to: [email],
          subject: 'Resources Portal Access Request Received',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background: linear-gradient(135deg, #00b4c5, #ffd700); padding: 30px; text-align: center; color: white;">
                <h1 style="margin: 0; font-size: 28px;">Request Received!</h1>
              </div>
              <div style="padding: 30px;">
                <p>Dear ${name},</p>
                <p>Thank you for requesting access to the Roalla Resources Portal. We have received your request and will review it shortly.</p>
                <p>You will receive an email with access instructions within 24 hours once your request has been approved.</p>
                <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <p><strong>Request Details:</strong></p>
                  <p>Email: ${email}</p>
                  <p>Company: ${company || 'Not provided'}</p>
                </div>
                <p>If you have any questions, please don't hesitate to contact us at <strong>sales@roalla.com</strong>.</p>
                <p>Best regards,<br><strong>The Roalla Team</strong></p>
              </div>
            </div>
          `
        })
      } catch (emailError) {
        console.error('Email sending failed:', emailError)
        // Continue even if email fails
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Access request submitted successfully'
    })
  } catch (error: any) {
    console.error('Error processing access request:', error)
    console.error('Error stack:', error?.stack)
    
    // Provide more specific error messages
    if (error?.code === 'P1001') {
      return NextResponse.json(
        { error: 'Database connection failed. Please try again later.' },
        { status: 503 }
      )
    }
    
    if (error?.code === 'P2021' || error?.code === 'P2025') {
      return NextResponse.json(
        { error: 'Database configuration error. Please contact support.' },
        { status: 500 }
      )
    }
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? error?.message : undefined
      },
      { status: 500 }
    )
  }
}
