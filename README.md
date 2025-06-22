# Roalla Business Enablement Group Website

A professional consulting website built with Next.js 14, TypeScript, Tailwind CSS, and Framer Motion.

## Features

- **Modern Design**: Clean, professional design with brand colors (blue #00b4c5, gold #ffd700)
- **Responsive**: Fully responsive design that works on all devices
- **Contact Form**: Functional contact form with email notifications
- **Calendly Integration**: Scheduling buttons that open Calendly popup
- **Interactive Assessment**: Business health assessment tool
- **SEO Optimized**: Meta tags, structured data, and performance optimized

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v3
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Email**: Resend
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd RoallaWebsite
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
# Create .env.local file
cp .env.example .env.local
```

4. Configure email functionality (see EMAIL_SETUP.md)

5. Run the development server
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Email Setup

The contact form sends emails to `sales@roalla.com` using Resend. See [EMAIL_SETUP.md](./EMAIL_SETUP.md) for detailed setup instructions.

### Quick Setup:

1. Sign up at [resend.com](https://resend.com)
2. Get your API key
3. Add `RESEND_API_KEY=your_key_here` to `.env.local`
4. For Vercel: Add the environment variable in your Vercel dashboard

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms

The site can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- Render
- AWS Amplify

## Project Structure

```
src/
├── app/                 # Next.js App Router
│   ├── api/            # API routes
│   │   └── contact/    # Contact form endpoint
│   ├── globals.css     # Global styles
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Home page
├── components/         # React components
│   ├── About.tsx       # About section
│   ├── CalendlyButton.tsx # Scheduling button
│   ├── Contact.tsx     # Contact form
│   ├── Footer.tsx      # Footer
│   ├── Header.tsx      # Navigation
│   ├── Hero.tsx        # Hero section
│   ├── InteractiveAssessment.tsx # Assessment tool
│   ├── LoadingSkeleton.tsx # Loading states
│   └── Services.tsx    # Services section
├── lib/               # Utility functions
└── types/             # TypeScript types
```

## Customization

### Brand Colors

Update the brand colors in `tailwind.config.js`:

```js
colors: {
  primary: '#00b4c5',    // Blue
  'primary-dark': '#0099a8',
  'primary-light': '#33c3d1',
  'primary-lighter': '#e6f7f9',
  secondary: '#ffd700',  // Gold
}
```

### Content

- Update business information in components
- Modify services in `Services.tsx`
- Update contact information in `Contact.tsx`
- Customize assessment questions in `InteractiveAssessment.tsx`

## Contact Information

- **Email**: sales@roalla.com
- **Phone**: 289-838-5868
- **Calendly**: https://calendly.com/steven-robin-roalla

## License

This project is private and proprietary to Roalla Business Enablement Group. 