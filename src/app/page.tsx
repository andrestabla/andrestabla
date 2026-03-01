import { prisma } from '@/lib/prisma';
import BlockRenderer from '@/components/BlockRenderer';
import { Lock } from 'lucide-react';

export const revalidate = 0;

export default async function Home() {
  const homePage = await prisma.page.findUnique({
    where: { slug: 'home' },
    include: {
      blocks: {
        orderBy: { order: 'asc' }
      }
    }
  });

  const siteSettings = await prisma.siteSettings.findUnique({
    where: { id: 'global' }
  });

  if (!homePage) return <div className="p-24 text-center font-bold">Iniciando Constructor... (Ejecuta el seed)</div>;

  return (
    <main className="max-w-5xl mx-auto px-6 font-sans">

      {/* Component Tree Renderer */}
      <div className="flex flex-col gap-12 lg:gap-24 mb-32">
        {homePage.blocks.map((block) => (
          <BlockRenderer key={block.id} block={block} />
        ))}
      </div>

      <footer className="border-t border-slate-200 py-12 flex flex-col md:flex-row justify-between items-center gap-4 text-sm font-medium text-slate-500">
        <p>© {new Date().getFullYear()} {siteSettings?.title || 'Andrés Tabla Rico'}. Reservados todos los derechos.</p>
        <a href="/login" className="flex items-center gap-2 hover:text-black transition-colors px-4 py-2 bg-slate-50 rounded-lg">
          <Lock size={14} /> Entrar al Constructor (CMS)
        </a>
      </footer>

      {/* Global CSS for section titles used across components */}
      <style dangerouslySetInnerHTML={{
        __html: `
        .section-title {
            font-size: 0.75rem;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            color: #94a3b8; /* slate-400 */
            display: flex;
            align-items: center;
            gap: 1rem;
        }
        .section-title::after {
            content: '';
            flex: 1;
            height: 1px;
            background-color: #e2e8f0; /* slate-200 */
        }
      `}} />
    </main>
  );
}
