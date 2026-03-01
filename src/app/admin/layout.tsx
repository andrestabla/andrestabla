'use client';

import { useRouter } from 'next/navigation';
import { LogOut, LayoutDashboard, MonitorPlay, PencilRuler } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();

    const handleLogout = async () => {
        await fetch('/api/logout', { method: 'POST' });
        router.push('/login');
        router.refresh();
    };

    return (
        <div className="h-screen w-full bg-[#fbfbfd] flex overflow-hidden font-sans">
            {/* Sidebar Inspector (Left Panel - 30% width roughly) */}
            <aside className="w-[400px] h-full bg-white border-r border-[#d2d2d7] flex flex-col shadow-2xl relative z-10">

                {/* Header */}
                <div className="p-6 border-b border-[#e5e7eb] flex justify-between items-center bg-zinc-50">
                    <div className="flex items-center gap-3">
                        <div className="bg-black text-white p-2 rounded-lg shadow-md"><PencilRuler size={18} /></div>
                        <div>
                            <h2 className="font-bold text-sm tracking-tight text-slate-900 leading-none">CMS Builder Pro</h2>
                            <span className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold mt-1 block">Andrés Tabla Rico</span>
                        </div>
                    </div>
                </div>

                {/* Scrollable Form Content */}
                <div className="flex-1 overflow-y-auto px-4 py-6 custom-scrollbar">
                    {children}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-[#e5e7eb] bg-zinc-50">
                    <button
                        onClick={handleLogout}
                        className="w-full flex justify-center items-center gap-2 text-slate-500 text-xs font-semibold uppercase tracking-wider hover:bg-red-50 hover:text-red-500 py-3 rounded-lg transition-all"
                    >
                        <LogOut size={14} strokeWidth={2.5} /> Cerrar Sesión
                    </button>
                </div>
            </aside>

            {/* Live Preview (Right Panel - Remaining width) */}
            <main className="flex-1 bg-zinc-100 p-4 lg:p-8 flex flex-col relative">
                <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-slate-500 bg-white px-3 py-1.5 rounded-full shadow-sm border border-zinc-200">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        Live Preview
                    </div>
                    <a href="/" target="_blank" className="text-xs text-blue-600 hover:text-blue-800 font-medium">Abrir en Pestaña Nueva ↗</a>
                </div>

                <div className="flex-1 bg-white rounded-2xl border border-zinc-200 shadow-[0_20px_50px_rgba(8,_112,_184,_0.07)] overflow-hidden relative group">
                    <div className="absolute inset-0 pointer-events-none border-4 border-transparent group-hover:border-blue-500/10 transition-colors z-20 rounded-2xl"></div>
                    {/* Iframe pointing to the public route. We use a key to force refresh if needed via state later. */}
                    <iframe
                        src="/"
                        className="w-full h-full border-none"
                        title="Public Site Preview"
                        id="live-preview-iframe"
                    />
                </div>
            </main>

            {/* Custom Scrollbar CSS specifically for the sidebar */}
            <style dangerouslySetInnerHTML={{
                __html: `
        .custom-scrollbar::-webkit-scrollbar {
            width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #d1d5db;
            border-radius: 10px;
        }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb {
            background: #9ca3af;
        }
      `}} />
        </div>
    );
}
