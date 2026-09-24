import { MetadataRoute } from 'next'

const privatePaths = ['/private/', '/hub/', '/en/hub/', '/fr/hub/', '/en/private/', '/fr/private/']

const aiAgents = [
  'GPTBot',
  'ChatGPT-User',
  'OAI-SearchBot',
  'Google-Extended',
  'GoogleOther',
  'anthropic-ai',
  'ClaudeBot',
  'Claude-SearchBot',
  'Claude-User',
  'PerplexityBot',
  'Perplexity-User',
  'Applebot-Extended',
  'Amazonbot',
  'meta-externalagent',
  'cohere-ai',
  'YouBot',
  'DuckAssistBot',
] as const

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: privatePaths,
      },
      ...aiAgents.map((userAgent) => ({
        userAgent,
        allow: '/',
        disallow: privatePaths,
      })),
    ],
    sitemap: 'https://www.roalla.com/sitemap.xml',
    host: 'https://www.roalla.com',
  }
}
