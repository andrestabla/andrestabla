import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-body', display: 'swap' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-heading', display: 'swap' });

export const metadata: Metadata = {
  title: 'Andrés Tabla Rico',
  description: 'Portafolio Ejecutivo y Hoja de Vida',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${inter.variable} ${playfair.variable} scroll-smooth`}>
      <body className="antialiased bg-zinc-950 text-slate-300 font-sans selection:bg-[#f25c54] selection:text-white">
        {children}
      </body>
    </html>
  );
}
