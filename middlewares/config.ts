// Unprotected routes
export const UNPROTECTED_PATHS = [
	// metadata routes
	'^/$',
	'/favicon.ico',
	'/sitemap.xml',
	'/robots.txt',
	'/_next/.*',
	'_assets/.*',
	'.*.(png|jpg|jpeg|gif|svg|ico|webp)',
]

export const AUTH_PATHS = ['/login', '/register', '/forgot-password', '/reset-password']

// When an authenticated user tries to access an authentication view
// redirect the to the url specified by LOGIN_REDIRECT
export const REDIRECT_AUTHENTICATED_USER = true

// The view to redirect authenticated users to
export const LOGIN_REDIRECT = '/dashboard'

// The name of the query parameter for redirect
export const REDIRECT_PARAM = 'next'

// The path of the login page
export const LOGIN_PATH = '/login'

// The path of the signup page
export const SIGNUP_PATH = '/signup'