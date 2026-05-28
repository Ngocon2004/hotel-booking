import { openApiDocument } from '@/lib/openapi'

export const dynamic = 'force-static'

export async function GET() {
  return Response.json(openApiDocument, {
    headers: {
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
