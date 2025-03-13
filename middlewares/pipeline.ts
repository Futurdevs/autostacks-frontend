import { NextMiddleware, NextResponse } from 'next/server'

/**
 * Factory type for creating middleware functions.
 * Each factory must have a displayName and return a middleware function.
 * @property {string} displayName - Unique identifier for the middleware
 * @param {NextMiddleware} next - The next middleware in the pipeline
 * @param {MiddlewarePipelineContext} context - Shared context between middlewares
 * @returns {NextMiddleware | Promise<NextMiddleware>} - The middleware function
 */
export type MiddlewareFactory = {
	/**
	 * A unique identifier for the middleware
	 */
	displayName: string
	/**
	 * The middleware function
	 * @param {NextMiddleware} next - The next middleware in the pipeline
	 * @param {MiddlewarePipelineContext} context - Shared context between middlewares
	 * @returns {NextMiddleware | Promise<NextMiddleware>} - The middleware function
	 */
	(
		next: NextMiddleware,
		context: MiddlewarePipelineContext
	): NextMiddleware | Promise<NextMiddleware>
}

/**
 * Context object shared between middlewares in the pipeline
 * @property {Object} request - Request-related data
 * @property {Headers} [request.headers] - Optional request headers
 * @property {Object} [user] - Optional user information
 * @property {string} user.id - User identifier
 * @property {boolean} user.isApproved - User approval status
 * @property {any} [other] - Additional context properties
 */
type MiddlewarePipelineContext = {
	/**
	 * Request-related data
	 */
	request: {
		/**
		 * Request headers
		 * @type {Headers}
		 */
		headers?: Headers
	}
	/**
	 * User information
	 */
	user?: {
		/**
		 * User identifier
		 * @type {string}
		 */
		id: string
		/**
		 * User approval status
		 * @type {boolean}
		 */
		isApproved: boolean
	}
	[other: string]: unknown
}

/**
 * Wraps a middleware function with error handling and logging capabilities
 * @param {NextMiddleware} middleware - The middleware to wrap
 * @param {MiddlewarePipelineContext} context - Shared context object
 * @returns {Promise<NextMiddleware>} Wrapped middleware function
 * @throws {Error} If middleware name is not provided
 */
async function middlewareWrapper(
	middleware: NextMiddleware,
	context: MiddlewarePipelineContext
): Promise<NextMiddleware> {
	// @ts-expect-error ...
	const name = middleware.name || middleware.displayName
	if (!name) {
		// middleware name is required
		throw new Error('Middleware name is required')
	}
	const wrapper: NextMiddleware = async (request, event) => {
		try {
			// console.log(`Running middleware ${name}`)
			const result = await middleware(request, event)
			// console.log(`Middleware ${name} completed`)
			return result
		} catch (error) {
			console.error(`Error in middleware ${name}:`, error)
			return NextResponse.next(context.request)
		}
	}
	return wrapper
}

/**
 * Creates a pipeline of middleware functions that execute in sequence.
 * Each middleware in the pipeline:
 * 1. Receives the next middleware as an argument
 * 2. Has access to a shared context object
 * 3. Can modify the request/response or pass it through
 * 4. Is wrapped with error handling
 *
 * Example usage:
 * ```typescript
 * const pipeline = await middlewarePipeline([
 *   authMiddleware,
 *   loggingMiddleware,
 *   rateLimitMiddleware
 * ], 0, { request: { headers: new Headers() } });
 * ```
 *
 * @param {MiddlewareFactory[]} factories - Array of middleware factories to execute
 * @param {number} index - Current position in the middleware chain
 * @param {MiddlewarePipelineContext} context - Shared context between middlewares
 * @returns {Promise<NextMiddleware>} - Combined middleware function
 */
export async function middlewarePipeline(
	factories: MiddlewareFactory[],
	index: number = 0,
	context: MiddlewarePipelineContext = {
		request: {}
	}
): Promise<NextMiddleware> {
	const current = factories[index]
	const factoryName = current?.name || current?.displayName
	if (current) {
		const next = await middlewarePipeline(factories, index + 1, context)
		const middleware = await current(next, context)
		if (!middleware.name) {
			Object.defineProperty(middleware, 'displayName', {
				value: factoryName,
				writable: false,
				enumerable: false,
				configurable: false
			})
		}
		return middlewareWrapper(middleware, context)
	}
	return () => {
		return NextResponse.next(context.request.headers ? context.request : undefined)
	}
}
