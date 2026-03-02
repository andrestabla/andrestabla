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

    return (
        <div className="min-h-screen w-full overflow-x-hidden">
            <BuilderWorkspace page={homePage} settings={siteSettings} />
        </div>
    );
}
