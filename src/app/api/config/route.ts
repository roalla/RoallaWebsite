import { authConfigured, roallaAuthClientId, roallaAuthHubUrl } from '@/lib/roalla-auth/config'
import { getHubAdminEmailDisplay } from '@/lib/hub/roles'

export async function GET() {
  return Response.json({
    authEnabled: authConfigured(),
    authUrl: roallaAuthHubUrl(),
    authClientId: roallaAuthClientId(),
    appName: process.env.APP_NAME || 'Roalla Internal Hub',
    bffMode: true,
    hubAdminEmail: getHubAdminEmailDisplay(),
  })
}
