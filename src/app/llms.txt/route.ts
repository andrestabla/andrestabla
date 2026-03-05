import { NextResponse } from 'next/server';
import { absoluteUrl } from '@/lib/seo';

export const revalidate = 3600;

export async function GET() {
    const body = [
        '# Andrés Tabla Rico',
        '',
        'Sitio oficial con trayectoria profesional, artículos y proyectos en educación, transformación digital e IA aplicada.',
        '',
        '## URL canónica',
        `- ${absoluteUrl('/')}`,
        '',
        '## Secciones principales',
        `- Inicio: ${absoluteUrl('/')}`,
        `- Artículos: ${absoluteUrl('/#articulos')}`,
        '',
        '## Perfil',
        '- Andrés Tabla Rico es educador y gerente de proyectos de transformación digital en el sector educativo LATAM.',
        '- Especialidades: virtualización de programas, formación docente, chatbots e inteligencia artificial.',
        '',
        '## Contacto oficial',
        '- Correo: andrestabla@algoritmot.com',
        '- LinkedIn: https://www.linkedin.com/in/andr%C3%A9s-tabla-rico/',
        '- Reunión: https://outlook.office.com/bookwithme/user/9cf8e211b713432295f17969db08b402@algoritmot.com/meetingtype/QqGiY9QzFkWJ6jHF7ep8zA2?bookingcode=24afd783-dc24-4202-8715-50e0cb02248f&anonymous&ismsaljsauthenabled&ep=mLinkFromTile',
        '- WhatsApp: https://wa.me/573213435456',
    ].join('\n');

    return new NextResponse(body, {
        headers: {
            'Content-Type': 'text/plain; charset=utf-8',
            'Cache-Control': 'public, max-age=3600, s-maxage=3600',
        },
    });
}
