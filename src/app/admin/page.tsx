import { prisma } from '@/lib/prisma';
import BuilderWorkspace from './components/BuilderWorkspace';
import { LogOut } from 'lucide-react';
import { redirect } from 'next/navigation';

export const revalidate = 0;

export default async function AdminPage() {

    // Fetch the Home Page and its blocks
    const homePage = await prisma.page.findUnique({
        where: { slug: 'home' },
        include: {
            blocks: {
                orderBy: { order: 'asc' }
            }
        }
    });

    if (!homePage) {
        return <div className="p-12 text-center text-red-500">Error: Base de datos no inicializada (Falta The Home Page).</div>;
    }

    // Fetch Global Settings
    let siteSettings = await prisma.siteSettings.findUnique({ where: { id: 'global' } });
    if (!siteSettings) {
        siteSettings = await prisma.siteSettings.create({
            data: {
                id: 'global',
                title: 'Mi Sitio',
                description: '',
                globalStyles: JSON.stringify({
                    primaryColor: '#4f46e5',
                    fontFamily: 'Inter',
                    logoUrl: '',
                    loaderEnabled: true
                })
            }
        });
    }

    // The Top Navigation Bar for the Admin Route (Full Screen)
    return (
        <div className="h-screen w-full flex flex-col overflow-hidden bg-slate-900 font-sans">

            {/* Top Builder Global Navbar */}
            <header className="h-[50px] bg-[#1a1a1e] border-b border-[#2d2d31] flex items-center justify-between px-4 shrink-0">
                <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]"></div>
                    <h1 className="text-white text-xs font-bold uppercase tracking-widest">Supreme Builder <span className="opacity-40 font-normal">| Elementor Engine</span></h1>
                </div>

                <div className="flex items-center gap-4">
                    <a href="/api/logout" className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-2 hover:text-white transition-colors py-1 px-3 border border-slate-700 rounded-full hover:bg-slate-800">
                        <LogOut size={12} /> Salir
                    </a>
                </div>
            </header>

            {/* The Workspace Area */}
            <div className="flex-1 w-full relative overflow-hidden bg-zinc-100">
                <BuilderWorkspace page={homePage} settings={siteSettings} />
            </div>
        </div>
    );
}
