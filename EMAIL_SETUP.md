# Email Setup Guide

## Setting up Email Functionality for Contact Form

The contact form is now configured to send emails to `sales@roalla.com` using Resend. Here's how to set it up:

### 1. Get a Resend API Key

1. Go to [https://resend.com](https://resend.com)
2. Sign up for a free account
3. Navigate to API Keys in your dashboard
4. Create a new API key
5. Copy the API key

### 2. Configure Environment Variables

Create a `.env.local` file in your project root with:

```env
# Resend API Key for email functionality
RESEND_API_KEY=your_resend_api_key_here

# Optional: Custom domain for sending emails
# RESEND_FROM_DOMAIN=roalla.com
```

### 3. For Vercel Deployment

Add the environment variable in your Vercel dashboard:

1. Go to your project in Vercel
2. Navigate to Settings → Environment Variables
3. Add `RESEND_API_KEY` with your API key value
4. Redeploy your project

### 4. Email Flow

When someone submits the contact form:

1. **Sales Team Email**: A detailed email is sent to `sales@roalla.com` with:
   - All form data (name, email, company, phone, service, message, budget, timeline)
   - File attachment information
   - Submission timestamp
   - Website origin

2. **User Confirmation Email**: A professional confirmation email is sent to the user with:
   - Thank you message
   - Submission summary
   - Contact information
   - 24-hour response promise

### 5. Email Templates

The emails use your brand colors:
- Primary: #00b4c5 (blue)
- Secondary: #ffd700 (gold)

### 6. Testing

To test the email functionality:

1. Fill out the contact form on your website
2. Submit the form
3. Check that emails are received at `sales@roalla.com`
4. Verify the user receives a confirmation email

### 7. Troubleshooting

If emails aren't sending:

1. Check that `RESEND_API_KEY` is set correctly
2. Verify the API key is valid in Resend dashboard
3. Check Vercel function logs for errors
4. Ensure `sales@roalla.com` is a valid email address

### 8. Free Tier Limits

Resend's free tier includes:
- 3,000 emails per month
- 100 emails per day
- Perfect for most business websites

### 9. Custom Domain (Optional)

For better deliverability, you can set up a custom domain:

1. Add your domain in Resend dashboard
2. Configure DNS records as instructed
3. Update the `from` email address in the API route

---

**Note**: The contact form will still work and show success messages even if email sending fails, ensuring a good user experience. 