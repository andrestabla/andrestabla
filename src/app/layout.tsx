import type { Metadata } from 'next';
import { Inter, Playfair_Display, Roboto, Outfit, DM_Sans } from 'next/font/google';
import './globals.css';
import { prisma } from '@/lib/prisma';
import SiteLoader from '@/components/SiteLoader';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair', display: 'swap' });
const roboto = Roboto({ weight: ['400', '500', '700'], subsets: ['latin'], variable: '--font-roboto', display: 'swap' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit', display: 'swap' });
const dmSans = DM_Sans({ weight: ['400', '500', '700'], subsets: ['latin'], variable: '--font-dmsans', display: 'swap' });

export const metadata: Metadata = {
  title: 'Andrés Tabla Rico',
  description: 'Portafolio Ejecutivo y Hoja de Vida',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let settings = null;
  try {
    settings = await prisma.siteSettings.findUnique({ where: { id: 'global' } });
  } catch (e) {
    // Ignore DB error during initial build
  }

  let parsedStyles = { primaryColor: '#4f46e5', fontFamily: 'Inter', loaderEnabled: true };
  if (settings && settings.globalStyles) {
    try { parsedStyles = JSON.parse(settings.globalStyles); } catch (e) { }
  }

  let fontClass = inter.variable;
  let fontVar = 'var(--font-inter)';

  if (parsedStyles.fontFamily === 'Roboto') { fontClass = roboto.variable; fontVar = 'var(--font-roboto)'; }
  if (parsedStyles.fontFamily === 'Playfair Display') { fontClass = playfair.variable; fontVar = 'var(--font-playfair)'; }
  if (parsedStyles.fontFamily === 'Outfit') { fontClass = outfit.variable; fontVar = 'var(--font-outfit)'; }
  if (parsedStyles.fontFamily === 'DM Sans') { fontClass = dmSans.variable; fontVar = 'var(--font-dmsans)'; }

  return (
    <html lang="es" className={`${fontClass} scroll-smooth`}>
      <head>
        <style>{`
                    :root {
                        --brand: ${parsedStyles.primaryColor};
                        --font-body: ${fontVar}, sans-serif;
                        --font-heading: ${fontVar}, serif;
                    }
                    /* For compatibility with existing Tailwind classes */
                    .text-indigo-600 { color: var(--brand) !important; }
                    .bg-indigo-600 { background-color: var(--brand) !important; }
                    .border-indigo-600 { border-color: var(--brand) !important; }
                    /* Ensure hover states adapt if possible, though basic !important helps mostly */
                    .hover\\:bg-indigo-700:hover { background-color: color-mix(in srgb, var(--brand) 85%, black) !important; }
                    .hover\\:text-indigo-700:hover { color: color-mix(in srgb, var(--brand) 85%, black) !important; }
                `}</style>
      </head>
      <body className="antialiased bg-zinc-950 text-slate-300 font-sans selection:bg-[var(--brand)] selection:text-white relative">
        {parsedStyles.loaderEnabled && <SiteLoader />}
        {children}
      </body>
    </html>
  );
}
