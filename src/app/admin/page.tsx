import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import BuilderWorkspace from './components/BuilderWorkspace';
import {
    buildArticlePageSlug,
    buildArticlePublicPath,
    extractArticleSlugPart,
    isArticlePageSlug,
    normalizeSlugPart,
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

    const requestedArticleSlug = isArticlePageSlug(requestedSlug)
        ? extractArticleSlugPart(requestedSlug)
        : '';
    let selectedPageSlug =
        requestedSlug === 'home'
            ? 'home'
            : requestedArticleSlug
                ? buildArticlePageSlug(requestedArticleSlug)
                : 'home';

    if (requestedArticleSlug) {
        let currentSlug = requestedArticleSlug;
        const visited = new Set<string>();

        while (currentSlug && !visited.has(currentSlug)) {
            visited.add(currentSlug);

            const slugRedirect = await prisma.articleSlugRedirect.findUnique({
                where: { fromSlug: currentSlug },
                select: { toSlug: true },
            });
            const redirectedSlug = normalizeSlugPart(slugRedirect?.toSlug || '', '');
            if (!redirectedSlug || redirectedSlug === currentSlug) break;

            currentSlug = redirectedSlug;
        }

        selectedPageSlug = buildArticlePageSlug(currentSlug);
    }

    let page = await prisma.page.findUnique({
        where: { slug: selectedPageSlug },
        include: {
            blocks: { orderBy: { order: 'asc' } }
        }
    });

    if (!page && requestedArticleSlug && selectedPageSlug !== buildArticlePageSlug(requestedArticleSlug)) {
        selectedPageSlug = buildArticlePageSlug(requestedArticleSlug);
        page = await prisma.page.findUnique({
            where: { slug: selectedPageSlug },
            include: {
                blocks: { orderBy: { order: 'asc' } }
            }
        });
    }

    if (page && requestedSlug !== 'home' && requestedSlug !== selectedPageSlug) {
        redirect(`/admin?slug=${encodeURIComponent(selectedPageSlug)}`);
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
