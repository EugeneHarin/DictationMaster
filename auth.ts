import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { z } from 'zod';
import { getUserByEmail, getUserRole } from './app/lib/user-actions';
import { verifyPassword } from '@/scripts/password-utils';

export const { handlers: { GET, POST }, auth, signIn, signOut } = NextAuth({
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');

      const role = auth?.user?.role;
      if (!role) return false;

      // lock pages for teacher role
      if (
        role == 'teacher' &&
        nextUrl.pathname.endsWith('/start')
      ) return false;

      // lock pages for student role
      if (
        role == 'student' &&
        nextUrl.pathname.endsWith('/students') &&
        nextUrl.pathname.endsWith('/edit') &&
        nextUrl.pathname.endsWith('/create')
      ) return false;


      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        return Response.redirect(new URL('/dashboard/dictations', nextUrl));
      }
      return true;
    },
    async jwt({ token, user }) {
      if(user && user.id) {
        token.role = await getUserRole(user.id);
        token.userId = user.id;
      }
      return token;
    },
    session({ session, token }) {
      session.user.role = token.role;
      session.user.id = token.userId;
      return session;
    },
  },
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'credentials',
      credentials: {},
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await getUserByEmail(email);
          if (!user) return null;
          const storedPassword = user.password;
          const passwordsMatch = verifyPassword(password.normalize('NFKC'), storedPassword.normalize('NFKC'));

          if (passwordsMatch) return user;
        }

        console.log('Invalid credentials');
        return null;
      },
    }),
  ],
});
