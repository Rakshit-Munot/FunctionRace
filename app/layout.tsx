import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'Function Studio — Explore the invisible', description: 'An interactive mathematical universe. Change the rules. Watch the world respond.' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }
