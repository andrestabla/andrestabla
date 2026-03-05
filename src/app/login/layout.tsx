import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Acceso Privado | Andrés Tabla Rico',
    robots: {
        index: false,
        follow: false,
        nocache: true,
        noarchive: true,
        nosnippet: true,
    },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
