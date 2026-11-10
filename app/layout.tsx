import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';
export const metadata:Metadata={title:'Function Studio — Mathematical Workspace',description:'An interactive mathematical graphing workspace. Write equations, explore functions, and discover relationships.'};
export default function RootLayout({children}:{children:ReactNode}){return <html lang="en"><body>{children}</body></html>}
