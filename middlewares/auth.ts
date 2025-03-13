import { NextRequest, NextResponse } from "next/server";
import { MiddlewareFactory } from "./pipeline";
import {
  AUTH_PATHS,
  LOGIN_PATH,
  LOGIN_REDIRECT,
  REDIRECT_AUTHENTICATED_USER,
  REDIRECT_PARAM,
} from "./config";
import * as jose from "jose";
import { getServerAuthToken } from "@/lib/server/server-auth";


const jwtSecret = process.env.JWT_SECRET!;
const jwtConfig = {
  secret: new TextEncoder().encode(jwtSecret),
  algorithms: ["HS256"],
};

interface JwtPayload {
  sub: string;
  exp?: number;
}

/**
 * Validates a JWT token using the provided secret
 * @param token The JWT token to validate
 * @returns The decoded payload if valid, null if invalid
 */
export async function verifyToken(token: string): Promise<JwtPayload | null> {
  try {
    const decoded = await jose.jwtVerify<JwtPayload>(token, jwtConfig.secret, {
      algorithms: jwtConfig.algorithms,
    });
    return decoded.payload;
  } catch (error) {
    console.error("JWT verification failed:", error);
    return null;
  }
}


/**
 * Authentication middleware factory
 * Handles authentication checks and redirects
 */
export const AuthMiddleware: MiddlewareFactory = (next) => {
  return async (request: NextRequest, event) => {
    // Get the auth token from cookies
    const token = await getServerAuthToken();
    const tokenPayload = token ? await verifyToken(token) : null;
    const isAuthenticated = !!tokenPayload;
    const { pathname } = request.nextUrl;

    // Check if the current path is an auth path (login, signup, etc.)
    const isAuthPath = AUTH_PATHS.some((path) => pathname === path);

    // If user is authenticated and trying to access auth pages, redirect to dashboard
    if (isAuthenticated && isAuthPath && REDIRECT_AUTHENTICATED_USER) {
      const url = new URL(
        request.nextUrl.searchParams.get(REDIRECT_PARAM) || LOGIN_REDIRECT,
        request.url
      );
      return NextResponse.redirect(url);
    }

    // If user is not authenticated and trying to access a protected route,
    // redirect to login with callback URL
    if (!isAuthenticated && !isAuthPath) {
      // Redirect to login page with the original URL as a callback
      const url = new URL(LOGIN_PATH, request.url);
      const query = request.nextUrl.searchParams.toString();
      // Remove all query params from the URL
      url.searchParams.forEach((value, key, parent) => {
        parent.delete(key);
      });
      const redirectTo = pathname + (query ? encodeURIComponent(`?${query}`) : "");
      url.searchParams.set(REDIRECT_PARAM, redirectTo);
      console.log(`Redirecting to: ${url.toString()}`);
      return NextResponse.redirect(url);
    }

    return next(request, event);
  };
};

AuthMiddleware.displayName = "AuthMiddleware";
