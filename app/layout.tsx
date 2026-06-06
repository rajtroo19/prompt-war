import type { Metadata, Viewport } from 'next';
import { Bricolage_Grotesque, Instrument_Sans } from 'next/font/google';
import './globals.css';
import { Sidebar } from '@/components/Sidebar';

const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
});

const instrumentSans = Instrument_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'MindPrep — Mental Wellness for Exam Warriors',
  description:
    'Track your mental wellness journey while preparing for NEET, JEE, UPSC, CAT, GATE, CUET and board exams. Daily mood check-ins, AI wellness coach, breathing exercises, and personalized insights.',
  keywords: [
    'mental wellness',
    'exam preparation',
    'NEET',
    'JEE',
    'UPSC',
    'student wellness',
    'mood tracker',
    'stress management',
  ],
  authors: [{ name: 'MindPrep' }],
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  themeColor: '#F5F7FA',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${bricolage.variable} ${instrumentSans.variable}`}>
      <body
        className={`${instrumentSans.className} antialiased`}
        style={{ background: '#F5F7FA', color: '#1E293B' }}
      >
        <div className="app-layout" style={{ display: 'flex', minHeight: '100vh' }}>
          <Sidebar />
          <main
            style={{
              flex: 1,
              minHeight: '100vh',
              overflowY: 'auto',
              paddingBottom: '5rem',
            }}
          >
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
