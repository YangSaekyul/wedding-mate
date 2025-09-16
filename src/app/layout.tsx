import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Wedding Mate - 웨딩 플래닝 도구',
  description: '초간단 웨딩 플래닝 도구로 D-Day를 관리하고 계획을 세워보세요.',
  keywords: ['wedding', 'planning', 'dday', 'kakao-login'],
  authors: [{ name: 'Wedding Mate Team' }],
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
