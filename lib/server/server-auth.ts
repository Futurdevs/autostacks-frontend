'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import axios from 'axios';
import { User } from '../auth';

const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL!;

export const getServerCookie = async (name: string): Promise<string | undefined> => {
  const cookieStore = cookies();
  return cookieStore.get(name)?.value;
};

// Get the auth token from cookies on the server
export const getServerAuthToken = async (): Promise<string | undefined> => {
  return await getServerCookie('auth_token');
};

// Check if the user is authenticated on the server
export const isAuthenticated = async (): Promise<boolean> => {
  return !!await getServerAuthToken();
};

// Redirect to login if not authenticated
export const requireAuth = async () => {
  if (!(await isAuthenticated())) {
    redirect('/login');
  }
};

// Get the current user on the server
export const getCurrentUser = async (): Promise<User | null> => {
  const token = await getServerAuthToken();
  
  if (!token) {
    return null;
  }
  
  try {
    const response = await axios.get<User>(`${baseURL}/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    return response.data;
  } catch (error) {
    console.error('Error fetching user data on server:', error);
    return null;
  }
};

// Server action to check authentication and get user data
export async function getAuthStatus() {
  const isAuth = await isAuthenticated();
  const user = isAuth ? await getCurrentUser() : null;
  
  return {
    isAuthenticated: isAuth,
    user,
  };
} 