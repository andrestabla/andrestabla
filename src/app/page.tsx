import { prisma } from '@/lib/prisma';
import GlobalNav from '@/components/GlobalNav';
import BlockRenderer from './components/BlockRenderer';

export const dynamic = 'force-dynamic';

export default async function Home({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {

  const resolvedSearchParams = await searchParams;
  const isEditor = resolvedSearchParams?.editor === 'true';

  // Fetch SiteConfig for the navigation bar
  // @ts-ignore
  const siteConfig = await prisma.siteSettings.findFirst();

  return (
    <div className="min-h-screen bg-zinc-950 text-slate-300 antialiased selection:bg-[#f25c54] selection:text-white pb-24 relative overflow-x-hidden">

      {/* Global Navigation (Hamburger Menu) */}
      <GlobalNav siteConfig={siteConfig} />

      {/* Dynamic Content Engine */}
      {/* @ts-ignore */}
      <BlockRenderer isEditor={isEditor} />

      {/* Footer Element */}
      <footer className="w-full text-center py-12 border-t border-zinc-900 mt-24">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-700">
          {siteConfig?.title || 'Andrés Tabla'} &copy; {new Date().getFullYear()}
          <span className="mx-2 text-[#f25c54]">&bull;</span>
          Powered by NodeBuilder™
        </p>
      </footer>
    </div>
  );
}
