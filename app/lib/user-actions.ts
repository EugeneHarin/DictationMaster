'use server';

import { AuthError } from 'next-auth';
import { User } from "./definitions";
import { signIn, auth } from '@/auth';
import { sql } from "@vercel/postgres";

export async function authenticateWithCredentials(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', {
      email: formData.get('email'),
      password: formData.get('password'),
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}

export async function getUserRole(id: string) {
  try {
    const user = await sql<User>`SELECT role FROM users WHERE id=${id}`;
    return user.rows[0].role;
  } catch (error) {
    console.error('Failed to fetch user role:', error);
    throw new Error('Failed to fetch user role.');
  }
}

export async function getCurrentUserRole() {
  const session = await auth();
  const userRole: User['role'] = session?.user?.role;
  return userRole;
}

export async function getCurrentUserData() {
  const session = await auth();
  const userData: User = session?.user;
  return userData;
}

export async function authenticateWithGithub() {
  try {
    await signIn('github');
  } catch (error) {
    throw error;
  }
}

export async function getUserByEmail(email: string): Promise<User | undefined> {
  try {
    const user = await sql<User>`SELECT * FROM users WHERE email=${email}`;
    return user.rows[0];
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}
