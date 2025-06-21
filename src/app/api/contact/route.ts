import { NextRequest, NextResponse } from 'next/server'

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

    // Create email content
    const emailContent = `
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
    `.trim()

    // In a real implementation, you would:
    // 1. Send email using a service like SendGrid, Mailgun, or AWS SES
    // 2. Store submission in a database
    // 3. Upload files to cloud storage
    // 4. Send confirmation email to the user

    // For now, we'll simulate a successful submission
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

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000))

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