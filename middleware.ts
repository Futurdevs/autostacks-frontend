import { NextRequest, NextMiddleware, NextFetchEvent } from 'next/server'
import { middlewarePipeline } from './middlewares/pipeline'
import { AuthMiddleware } from './middlewares/auth'
import { PublicMiddleware } from './middlewares/public'
import { RequestHeadersMiddleware } from './middlewares/headers'

// Initialize middleware pipeline with shared context
const initMiddleware = async () => {
  // Create a shared context for all middlewares
  const context = {
    request: {
      headers: new Headers()
    }
  }

  // Create the middleware pipeline with our middleware factories
  return await middlewarePipeline(
    [
      PublicMiddleware,
      RequestHeadersMiddleware,
      AuthMiddleware,
    ],
    0,
    context
  )
}

// Initialize the middleware pipeline
let middlewareInstance: NextMiddleware | null = null

export async function middleware(request: NextRequest, event: NextFetchEvent) {
  // Initialize middleware pipeline if not already initialized
  if (!middlewareInstance) {
    middlewareInstance = await initMiddleware()
  }

  // Execute the middleware pipeline
  return middlewareInstance(request, event)
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|logo.svg).*)',
  ],
} 