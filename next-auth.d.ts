import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      role: 'teacher' | 'student';
    } & DefaultSession['user'];
  }
}
