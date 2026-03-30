import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import BuilderWorkspace from './components/BuilderWorkspace';
import {
    buildArticlePageSlug,
    buildArticlePublicPath,
    extractArticleSlugPart,
    isArticlePageSlug,
} from '@/lib/articlePages';

export const revalidate = 0;

type AdminPageProps = {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function AdminPage({ searchParams }: AdminPageProps) {
    const resolvedSearchParams = await searchParams;
    const slugParam = Array.isArray(resolvedSearchParams?.slug)
        ? resolvedSearchParams.slug[0]
        : resolvedSearchParams?.slug;

    const requestedSlug = typeof slugParam === 'string' && slugParam.trim()
        ? slugParam.trim()
        : 'home';

    const selectedPageSlug =
        requestedSlug === 'home'
            ? 'home'
            : isArticlePageSlug(requestedSlug)
                ? buildArticlePageSlug(extractArticleSlugPart(requestedSlug))
                : 'home';

    let page = await prisma.page.findUnique({
        where: { slug: selectedPageSlug },
        include: {
            blocks: { orderBy: { order: 'asc' } }
        }
    });

    if (!page && isArticlePageSlug(selectedPageSlug)) {
        const requestedArticleSlug = extractArticleSlugPart(selectedPageSlug);
        const slugRedirect = await prisma.articleSlugRedirect.findUnique({
            where: { fromSlug: requestedArticleSlug },
            select: { toSlug: true },
        });

        if (slugRedirect?.toSlug) {
            redirect(`/admin?slug=${encodeURIComponent(buildArticlePageSlug(slugRedirect.toSlug))}`);
        }
    }

    if (!page) {
        return <div className="p-12 text-center text-red-500">Error: La página solicitada no existe o fue reemplazada por otra versión.</div>;
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
    const serializedPage = JSON.parse(JSON.stringify(page));
    const serializedSettings = JSON.parse(JSON.stringify(siteSettings));
    const previewPath = isArticlePageSlug(page.slug)
        ? buildArticlePublicPath(extractArticleSlugPart(page.slug))
        : '/';

    return (
        <div className="min-h-screen w-full overflow-x-hidden">
            <BuilderWorkspace page={serializedPage} settings={serializedSettings} previewPath={previewPath} />
        </div>
    );
}
