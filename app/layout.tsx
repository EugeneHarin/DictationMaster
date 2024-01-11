import { SpeedInsights } from "@vercel/speed-insights/next"
import '@/app/ui/global.css';
import { inter } from '@/app/ui/fonts'
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s | Dictation Master',
    default: 'Dictation Master',
  },
  description: 'Website to test you skills in writing dictations',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
