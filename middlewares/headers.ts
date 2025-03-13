import { NextResponse } from 'next/server';
import { MiddlewareFactory } from './pipeline'

export const RequestHeadersMiddleware: MiddlewareFactory =
	(next, context) => (req, event) => {
		const path = req.nextUrl.pathname;
		const isServerAction = req.headers.get('Next-Action') !== null;
		const requestHeaders = new Headers(req.headers)
		requestHeaders.set('x-pathname', path)
		if (isServerAction) {
			// short circuit the middleware pipeline
			// when handling server actions
			return NextResponse.next()
		}

		context.request = { headers: requestHeaders }
		return next(req, event)
	}

RequestHeadersMiddleware.displayName = 'RequestHeadersMiddleware'
