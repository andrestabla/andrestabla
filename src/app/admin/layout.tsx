'use client';

import { useRouter } from 'next/navigation';
import { LogOut, LayoutDashboard } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();

    const handleLogout = async () => {
        await fetch('/api/logout', { method: 'POST' });
        router.push('/login');
        router.refresh(); // clear cache
    };

    return (
        <div className="min-h-screen bg-[#fbfbfd] flex flex-col md:flex-row">
            <aside className="w-full md:w-64 bg-white border-r border-[#d2d2d7] p-6 flex flex-col h-auto md:h-screen sticky top-0">
                <div className="flex items-center gap-3 mb-10">
                    <div className="bg-black text-white p-2 rounded-lg"><LayoutDashboard size={20} /></div>
                    <h2 className="font-bold tracking-tight text-slate-900" style={{ fontFamily: 'var(--font-heading)' }}>CMS Executive</h2>
                </div>

                <nav className="flex flex-col gap-2 flex-grow">
                    <div className="px-4 py-2 bg-slate-100 rounded-lg text-sm font-medium text-slate-800">Panel Principal</div>
                </nav>

                <button onClick={handleLogout} className="mt-8 flex items-center gap-2 text-red-500 text-sm font-medium hover:bg-red-50 p-3 rounded-lg transition-colors">
                    <LogOut size={16} /> Cerrar Sesión
                </button>
            </aside>

            <main className="flex-1 p-8 md:p-12 overflow-y-auto">
                <div className="max-w-4xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
