const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    console.log('Start seeding dynamic Builder DB...');

    const pageCount = await prisma.page.count();
    if (pageCount > 0) {
        console.log('Database already seeded with dynamic pages. Skipping.');
        return;
    }

    // Create Admin User
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await prisma.user.upsert({
        where: { username: 'andres.tabla' },
        update: {},
        create: {
            username: 'andres.tabla',
            password: hashedPassword,
        },
    });

    // Create Site Settings
    await prisma.siteSettings.upsert({
        where: { id: 'global' },
        update: {},
        create: {
            id: 'global',
            title: 'Andrés Tabla Rico | Portafolio',
            description: 'Directivo de Transformación Digital',
            globalStyles: JSON.stringify({
                fontHeading: 'Inter',
                fontBody: 'Outfit',
                primaryColor: '#000000',
                backgroundColor: '#ffffff'
            })
        }
    });

    // Create Main Home Page
    const homePage = await prisma.page.create({
        data: {
            slug: 'home',
            title: 'Inicio',
            isPublished: true,
        }
    });

    // Create Initial Blocks (Replicating the old static design via dynamic blocks)
    const blocksData = [
        {
            type: 'hero',
            data: {
                name: 'ANDRÉS TABLA RICO',
                role: 'Directivo de Transformación Digital Educativa | Gerencia de Proyectos TIC | Educación LATAM',
                tagline: 'Hoja de vida - versión directiva (2026)',
                phone: '3213435456',
                email: 'andrestabla@algoritmot.com',
                links: [
                    { label: 'algoritmot.com', url: 'https://algoritmot.com' },
                    { label: 'aprenderonline.com.co', url: 'https://aprenderonline.com.co' },
                    { label: 'profetabla.com', url: 'https://profetabla.com' }
                ]
            },
            order: 1
        },
        {
            type: 'richtext',
            data: {
                title: 'Perfil Ejecutivo',
                content: 'Educador y gerente de proyectos de implementación de tecnologías de la información y la comunicación en el sector educativo a nivel LATAM. Amplia experiencia como docente de programas de pregrado y posgrado de manera presencial y mediante entornos virtuales de aprendizaje. Cuenta con trayectoria en investigación, diseño curricular y desarrollo de contenidos educativos.'
            },
            order: 2
        },
        {
            type: 'timeline',
            data: {
                title: 'Trayectoria Profesional',
                items: [
                    { id: '1', title: 'Director General - Algoritmo T', subtitle: 'Algoritmo T', meta: '2020 - PRESENTE | LATAM', body: 'Líder de procesos de transformación digital e implementación de IA/Chatbots.' },
                    { id: '2', title: 'Docente Maestría en Educación', subtitle: 'UNIMINUTO', meta: '2019 - 2023', body: 'Especialista en modelos e investigación educativa.' }
                ]
            },
            order: 3
        },
        {
            type: 'bento',
            data: {
                title: 'Formación Académica',
                bentoType: 'education',
                items: [
                    { id: '1', title: 'Doctor en Ciencias de la Educación', subtitle: 'Universidad de La Plata', meta: 'En curso' },
                    { id: '2', title: 'Magíster en Educación', subtitle: 'Universidad de la Sabana', meta: '2016' }
                ]
            },
            order: 4
        }
    ];

    for (const block of blocksData) {
        await prisma.block.create({
            data: {
                pageId: homePage.id,
                type: block.type,
                data: JSON.stringify(block.data),
                order: block.order
            }
        });
    }

    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
