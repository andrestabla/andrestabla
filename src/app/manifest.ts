import type { MetadataRoute } from 'next';
import { absoluteUrl } from '@/lib/seo';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Andrés Tabla Rico',
        short_name: 'Andrés Tabla',
        description: 'Portafolio oficial sobre educación, innovación digital e inteligencia artificial aplicada.',
        start_url: '/',
        display: 'standalone',
        background_color: '#09090b',
        theme_color: '#f25c54',
        lang: 'es-CO',
        icons: [
            {
                src: absoluteUrl('/favicon.ico'),
                sizes: 'any',
                type: 'image/x-icon',
            },
        ],
    };
}
