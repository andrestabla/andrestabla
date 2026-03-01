import { prisma } from '@/lib/prisma';
import BuilderInspector from './builder-inspector';

export const revalidate = 0;

export default async function AdminPage() {
    // Fetch all CMS data 
    const profile = await prisma.profile.findFirst();
    const experiences = await prisma.experience.findMany({ orderBy: { order: 'asc' } });
    const educations = await prisma.education.findMany({ orderBy: { order: 'asc' } });
    const publications = await prisma.publication.findMany({ orderBy: { order: 'asc' } });
    const courses = await prisma.course.findMany({ orderBy: { order: 'asc' } });

    const initialData = {
        profile,
        experiences,
        educations,
        publications,
        courses
    };

    return (
        <BuilderInspector initialData={initialData} />
    );
}
