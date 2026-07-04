import { authConfigured, roallaAuthClientId, roallaAuthHubUrl, authConfigStatus } from '@/lib/roalla-auth/config'
import { getHubAdminEmailDisplay } from '@/lib/hub/roles'

export const dynamic = 'force-dynamic'

export async function GET() {
  return Response.json({
    authEnabled: authConfigured(),
    authUrl: roallaAuthHubUrl(),
    authClientId: roallaAuthClientId(),
    appName: process.env.APP_NAME || 'Roalla Internal Hub',
    bffMode: true,
    hubAdminEmail: getHubAdminEmailDisplay(),
    configStatus: authConfigStatus(),
  })
}
