const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    console.log('Start seeding...');

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

    // Create Profile
    await prisma.profile.create({
        data: {
            name: 'ANDRÉS TABLA RICO',
            role: 'Directivo de Transformación Digital Educativa | Gerencia de Proyectos TIC | Educación LATAM',
            tagline: 'Hoja de vida - versión directiva (2026)',
            phone: '3213435456',
            email: 'andrestabla@algoritmot.com',
            about: 'Educador y gerente de proyectos de implementación de tecnologías de la información y la comunicación en el sector educativo a nivel LATAM. Amplia experiencia como docente de programas de pregrado y posgrado de manera presencial y mediante entornos virtuales de aprendizaje. Cuenta con trayectoria en investigación, diseño curricular y desarrollo de contenidos educativos.',
        }
    });

    // Create Experiences
    const experiences = [
        { title: 'Director General - Algoritmo T', company: 'Algoritmo T', period: '2020 - PRESENTE | LATAM', description: 'Líder de procesos de transformación digital e implementación de IA/Chatbots.', order: 1 },
        { title: 'Docente Maestría en Educación', company: 'UNIMINUTO', period: '2019 - 2023', description: 'Especialista en modelos e investigación educativa.', order: 2 },
        { title: 'Docente hora cátedra', company: 'Universidad de La Sabana / Istmo Panamá', period: '2018 - 2022', description: 'Análisis de Datos (Atlas.ti) y Conocimiento Científico.', order: 3 },
        { title: 'Líder de Producción', company: 'ILUMNO', period: '2017 - 2018', description: 'Coordinación y asesoría en la producción de más de 400 cursos virtuales.', order: 4 },
    ];
    for (const exp of experiences) {
        await prisma.experience.create({ data: exp });
    }

    // Create Education
    const educations = [
        { degree: 'Doctor en Ciencias de la Educación', institution: 'Universidad de La Plata', period: 'En curso', order: 1 },
        { degree: 'Magíster en Educación', institution: 'Universidad de la Sabana', period: '2016', order: 2 },
        { degree: 'Especialista en Lectura y Escritura', institution: 'Universidad Minuto de Dios', period: '2013', order: 3 },
    ];
    for (const edu of educations) {
        await prisma.education.create({ data: edu });
    }

    // Create Publications
    await prisma.publication.create({
        data: { content: '<strong>Tabla, A. (2023).</strong> La Escuela de Formación y Aprendizaje Docente (EFADs21) de la Universidad de Cundinamarca. Editorial Universidad del Norte.', order: 1 }
    });

    // Create Courses
    await prisma.course.create({ data: { title: 'Inteligencia Artificial para la Educación (2025)', order: 1 } });
    await prisma.course.create({ data: { title: 'Creatividad e innovación educativa (2025)', order: 2 } });

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
