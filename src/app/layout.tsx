import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Synora — Research, connected',
  description: 'A calm workspace for turning your sources into understanding.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
