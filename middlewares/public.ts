import { NextResponse } from 'next/server'
import * as config from './config'
import { MiddlewareFactory } from './pipeline'

/**
 * Middleware for public routes.
 *
 * It's used for short-circuiting the middleware pipeline for public routes like static assets.
 * @param next the next middleware
 * @returns
 */
export const PublicMiddleware: MiddlewareFactory = next => {
	return async (req, event) => {
		const path = req.nextUrl.clone().pathname
		// const isApiRoute = path.startsWith('/api')
		// const isAuthPath = config.AUTH_PATHS.some(route =>
		// 	new RegExp(route).test(path)
		// )
		// console.log(`path: ${path}`)
		// console.log(`isApiRoute: ${isApiRoute}`)
		// console.log(`isAuthPath: ${isAuthPath}`)
		if (config.UNPROTECTED_PATHS.some(route => new RegExp(route).test(path))) {
			return NextResponse.next()
		}
		return next(req, event)
	}
}

PublicMiddleware.displayName = 'PublicMiddleware'