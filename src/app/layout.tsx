import type { Metadata } from 'next';
import { Inter, Playfair_Display, Roboto, Outfit, DM_Sans } from 'next/font/google';
import './globals.css';
import { prisma } from '@/lib/prisma';
import SiteLoader from '@/components/SiteLoader';
import { DEFAULT_SEO_DESCRIPTION, DEFAULT_SEO_TITLE, SITE_NAME, SITE_URL } from '@/lib/seo';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair', display: 'swap' });
const roboto = Roboto({ weight: ['400', '500', '700'], subsets: ['latin'], variable: '--font-roboto', display: 'swap' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit', display: 'swap' });
const dmSans = DM_Sans({ weight: ['400', '500', '700'], subsets: ['latin'], variable: '--font-dmsans', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: DEFAULT_SEO_TITLE,
    template: '%s | Andrés Tabla Rico',
  },
  description: DEFAULT_SEO_DESCRIPTION,
  applicationName: SITE_NAME,
  manifest: '/manifest.webmanifest',
  keywords: [
    'Andrés Tabla Rico',
    'educación digital',
    'transformación digital educativa',
    'chatbots educativos',
    'IA en educación',
    'virtualización de programas',
    'consultoría TIC',
  ],
  authors: [{ name: 'Andrés Tabla Rico' }],
  creator: 'Andrés Tabla Rico',
  publisher: 'Andrés Tabla Rico',
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    url: SITE_URL,
    title: DEFAULT_SEO_TITLE,
    description: DEFAULT_SEO_DESCRIPTION,
    locale: 'es_CO',
  },
  twitter: {
    card: 'summary_large_image',
    title: DEFAULT_SEO_TITLE,
    description: DEFAULT_SEO_DESCRIPTION,
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let settings = null;
  try {
    settings = await prisma.siteSettings.findUnique({ where: { id: 'global' } });
  } catch (_error) {
    // Ignore DB error during initial build
  }

  let parsedStyles: any = {
    primaryColor: '#f25c54',
    secondaryColor: '#18181b',
    accentColor: '#6366f1',
    buttonBg: '#f25c54',
    buttonHover: '#d94a42',
    textColor: '#cbd5e1',
    headingColor: '#ffffff',
    fontFamily: 'Inter',
    faviconUrl: '',
    loaderEnabled: true,
  };
  if (settings && settings.globalStyles) {
    try {
      const parsed = JSON.parse(settings.globalStyles);
      parsedStyles = { ...parsedStyles, ...parsed };
    } catch (_error) { }
  }

  let fontClass = inter.variable;
  let fontVar = 'var(--font-inter)';

  if (parsedStyles.fontFamily === 'Roboto') { fontClass = roboto.variable; fontVar = 'var(--font-roboto)'; }
  if (parsedStyles.fontFamily === 'Playfair Display') { fontClass = playfair.variable; fontVar = 'var(--font-playfair)'; }
  if (parsedStyles.fontFamily === 'Outfit') { fontClass = outfit.variable; fontVar = 'var(--font-outfit)'; }
  if (parsedStyles.fontFamily === 'DM Sans') { fontClass = dmSans.variable; fontVar = 'var(--font-dmsans)'; }
  const faviconHref = (parsedStyles.faviconUrl || '').trim() || '/favicon.ico';

  return (
    <html lang="es" className={`${fontClass} scroll-smooth`}>
      <head>
        <link rel="icon" href={faviconHref} />
        <link rel="shortcut icon" href={faviconHref} />
        <link rel="apple-touch-icon" href={faviconHref} />
        <style>{`
          :root {
            --brand:       ${parsedStyles.primaryColor};
            --secondary:   ${parsedStyles.secondaryColor};
            --accent:      ${parsedStyles.accentColor};
            --btn-bg:      ${parsedStyles.buttonBg};
            --btn-hover:   ${parsedStyles.buttonHover};
            --text:        ${parsedStyles.textColor};
            --heading:     ${parsedStyles.headingColor};
            --font-body:   ${fontVar}, sans-serif;
            --font-heading:${fontVar}, serif;
          }
          .text-indigo-600 { color: var(--brand) !important; }
          .bg-indigo-600   { background-color: var(--brand) !important; }
          .border-indigo-600 { border-color: var(--brand) !important; }
          .hover\\:bg-indigo-700:hover { background-color: var(--btn-hover) !important; }
          .hover\\:text-indigo-700:hover { color: var(--btn-hover) !important; }
          /* Button components */
          [data-btn] { background-color: var(--btn-bg); }
          [data-btn]:hover { background-color: var(--btn-hover); }
        `}</style>
      </head>
      <body className="antialiased bg-zinc-950 text-slate-300 font-sans selection:bg-[var(--brand)] selection:text-white relative">
        {parsedStyles.loaderEnabled && <SiteLoader />}
        {children}
      </body>
    </html>
  );
}
