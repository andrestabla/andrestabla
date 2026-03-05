import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import GlobalNav from '@/components/GlobalNav';
import BlockRenderer from './components/BlockRenderer';
import AndresAssistant from '@/components/AndresAssistant';
import AnalyticsTracker from '@/components/AnalyticsTracker';
import DataPolicyConsent from '@/components/DataPolicyConsent';
import { absoluteUrl, DEFAULT_SEO_DESCRIPTION, SITE_NAME, SITE_URL } from '@/lib/seo';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await prisma.siteSettings.findFirst({
    select: { title: true, description: true, globalStyles: true },
  });

  const baseTitle = (settings?.title || '').trim() || SITE_NAME;
  const title = `${baseTitle} | Educación, Innovación Digital e IA`;
  const description = (settings?.description || '').trim() || DEFAULT_SEO_DESCRIPTION;
  let image = '/favicon.ico';
  if (settings?.globalStyles) {
    try {
      const parsed = JSON.parse(settings.globalStyles);
      image = (parsed?.logoUrl || parsed?.faviconUrl || image) as string;
    } catch (_error) {
      // Ignore invalid style JSON
    }
  }
  const imageUrl = absoluteUrl(image);

  return {
    title,
    description,
    alternates: {
      canonical: '/',
    },
    openGraph: {
      type: 'website',
      siteName: SITE_NAME,
      url: SITE_URL,
      title,
      description,
      locale: 'es_CO',
      images: [{ url: imageUrl }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default async function Home({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {

  const resolvedSearchParams = await searchParams;
  const isEditor = resolvedSearchParams?.editor === 'true';

  // Fetch SiteConfig for the navigation bar
  // @ts-ignore
  const siteConfig = await prisma.siteSettings.findFirst();
  let parsedStyles: any = {
    footerStyle: 'minimal',
    footerText: 'Powered by NodeBuilder™',
    footerBg: '#09090b',
    footerBorder: '#18181b',
    footerTextColor: '#71717a',
    footerAccentColor: '#f25c54',
  };
  if (siteConfig?.globalStyles) {
    try {
      parsedStyles = { ...parsedStyles, ...JSON.parse(siteConfig.globalStyles) };
    } catch (_error) {
      // Ignore invalid JSON in style payload.
    }
  }

  const footerStyle = parsedStyles.footerStyle || 'minimal';
  const footerText = parsedStyles.footerText || 'Powered by NodeBuilder™';
  const footerBaseStyle = {
    backgroundColor: parsedStyles.footerBg,
    borderColor: parsedStyles.footerBorder,
    color: parsedStyles.footerTextColor,
  };
  const siteTitle = siteConfig?.title || SITE_NAME;
  const siteDescription = siteConfig?.description || DEFAULT_SEO_DESCRIPTION;
  const profileUrl = absoluteUrl('/');
  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Andrés Tabla Rico',
    url: profileUrl,
    image: absoluteUrl(parsedStyles.logoUrl || '/favicon.ico'),
    jobTitle: 'Educador y gerente de proyectos de transformación digital educativa',
    worksFor: {
      '@type': 'Organization',
      name: 'Algoritmo T',
      url: 'https://algoritmot.com/',
    },
    sameAs: [
      'https://www.linkedin.com/in/andr%C3%A9s-tabla-rico/',
      'https://www.andrestabla.com/',
    ],
  };
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteTitle,
    url: profileUrl,
    description: siteDescription,
    inLanguage: 'es-CO',
    publisher: {
      '@type': 'Person',
      name: 'Andrés Tabla Rico',
    },
  };
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Algoritmo T',
    url: 'https://algoritmot.com/',
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      email: 'andrestabla@algoritmot.com',
      areaServed: 'LATAM',
      availableLanguage: ['es', 'en'],
    },
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-slate-300 antialiased selection:bg-[#f25c54] selection:text-white pb-24 relative overflow-x-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      {!isEditor && <DataPolicyConsent />}
      {!isEditor && <AnalyticsTracker />}

      {/* Global Navigation (Hamburger Menu) */}
      <GlobalNav siteConfig={siteConfig} />

      {/* Dynamic Content Engine */}
      {/* @ts-ignore */}
      <BlockRenderer isEditor={isEditor} />

      {/* Footer Element */}
      <footer className="w-full border-t mt-24" style={footerBaseStyle}>
        {footerStyle === 'split' ? (
          <div className="max-w-6xl mx-auto px-6 md:px-12 py-6 flex flex-col gap-2 md:flex-row md:items-center md:justify-between text-xs font-bold uppercase tracking-[0.16em]">
            <span>{siteConfig?.title || 'Andrés Tabla'} &copy; {new Date().getFullYear()}</span>
            <span style={{ color: parsedStyles.footerAccentColor }}>{footerText}</span>
          </div>
        ) : footerStyle === 'centered' ? (
          <div className="text-center px-6 py-10">
            <p className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: parsedStyles.footerAccentColor }}>
              {siteConfig?.title || 'Andrés Tabla'} &copy; {new Date().getFullYear()}
            </p>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] mt-2">{footerText}</p>
          </div>
        ) : (
          <div className="text-center px-6 py-10">
            <p className="text-xs font-bold uppercase tracking-[0.2em]">
              {siteConfig?.title || 'Andrés Tabla'} &copy; {new Date().getFullYear()}
              <span className="mx-2" style={{ color: parsedStyles.footerAccentColor }}>&bull;</span>
              {footerText}
            </p>
          </div>
        )}
      </footer>

      {!isEditor && <AndresAssistant />}
    </div>
  );
}
