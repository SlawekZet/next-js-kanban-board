import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';
import { KanbanTaskManagerProvider } from './lib/contexts/KanbanTaskManagerContext';
import { Plus_Jakarta_Sans } from 'next/font/google';

const jakarta = Plus_Jakarta_Sans({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  style: ['normal'],
});

export const metadata: Metadata = {
  title: 'Kanban board',
  description: 'Kanban board written in next.js + React',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${jakarta.className} flex h-screen w-screen justify-center`}
      >
        <KanbanTaskManagerProvider>
          <Providers>{children}</Providers>
        </KanbanTaskManagerProvider>
      </body>
    </html>
  );
}
