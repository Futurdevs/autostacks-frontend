'use client';

import { Cookies } from 'react-cookie';


// Cookie options
const cookieOptions = {
  path: '/',
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  maxAge: 30 * 24 * 60 * 60, // 30 days
};

// Client-side cookies instance
const clientCookies = new Cookies();

// Set a cookie (client-side only)
export const setCookie = (name: string, value: string): void => {
  clientCookies.set(name, value, cookieOptions);
};

// Get a cookie (works on both client and server)
export const getCookie = (name: string): string | undefined => {
  // Check if we're on the client side
  if (typeof window !== 'undefined') {
    return clientCookies.get(name);
  }
};

// Remove a cookie (client-side only)
export const removeCookie = (name: string): void => {
  clientCookies.remove(name, { path: '/' });
};

// Token-specific functions
export const setAuthToken = (token: string): void => {
  setCookie('auth_token', token);
};

export const getAuthToken = (): string | undefined => {
  return getCookie('auth_token');
};

export const removeAuthToken = (): void => {
  removeCookie('auth_token');
}; 