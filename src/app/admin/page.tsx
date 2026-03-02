import { prisma } from '@/lib/prisma';
import BuilderWorkspace from './components/BuilderWorkspace';

export const revalidate = 0;

export default async function AdminPage() {

    const homePage = await prisma.page.findUnique({
        where: { slug: 'home' },
        include: {
            blocks: { orderBy: { order: 'asc' } }
        }
    });

    if (!homePage) {
        return <div className="p-12 text-center text-red-500">Error: Base de datos no inicializada (Falta The Home Page).</div>;
    }

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

    // Serialize: strip Prisma Date objects (createdAt, updatedAt) which are NOT
    // JSON-serializable across the server→client component boundary.
    const serializedPage = JSON.parse(JSON.stringify(homePage));
    const serializedSettings = JSON.parse(JSON.stringify(siteSettings));

    return (
        <div className="min-h-screen w-full overflow-x-hidden">
            <BuilderWorkspace page={serializedPage} settings={serializedSettings} />
        </div>
    );
}
