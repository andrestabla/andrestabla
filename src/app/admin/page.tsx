import { prisma } from '@/lib/prisma';

export const revalidate = 0; // Disable caching

export default async function AdminDashboard() {
    const profile = await prisma.profile.findFirst();

    return (
        <div>
            <header className="mb-10">
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>Bienvenido, Andrés</h1>
                <p className="text-slate-500 mt-2">Gestiona el contenido de tu portafolio profesional en tiempo real.</p>
            </header>

            <section className="bg-white rounded-2xl border border-[#d2d2d7] p-8 shadow-sm">
                <h2 className="text-xl font-semibold mb-6">Información del Perfil</h2>

                {profile ? (
                    <form className="flex flex-col gap-6" action={async (formData) => {
                        'use server';
                        const { prisma } = await import('@/lib/prisma');
                        await prisma.profile.update({
                            where: { id: profile.id },
                            data: {
                                name: formData.get('name') as string,
                                role: formData.get('role') as string,
                                about: formData.get('about') as string,
                            }
                        });
                    }}>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Nombre Completo</label>
                                <input name="name" defaultValue={profile.name} className="w-full border border-slate-300 rounded-lg p-3 outline-none focus:border-black" />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Cargo / Rol</label>
                                <input name="role" defaultValue={profile.role} className="w-full border border-slate-300 rounded-lg p-3 outline-none focus:border-black" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Acerca de ti (Perfil Ejecutivo)</label>
                            <textarea name="about" defaultValue={profile.about} rows={5} className="w-full border border-slate-300 rounded-lg p-3 outline-none focus:border-black resize-none" />
                        </div>

                        <div className="flex justify-end mt-4">
                            <button type="submit" className="bg-black text-white px-6 py-2.5 rounded-lg font-medium hover:bg-slate-800 transition-colors">Guardar Cambios</button>
                        </div>
                    </form>
                ) : (
                    <p>Cargando información...</p>
                )}
            </section>

            {/* 
        Note to self: In a full production push, we'd add the exact same server-action forms 
        here for Experience, Education, Courses, etc. We're keeping it concise for the supreme MVP.
      */}

            <div className="mt-8 text-center">
                <a href="/" target="_blank" className="text-sm text-slate-500 hover:text-black hover:underline inline-flex items-center gap-1">Ver Sitio Público ↗</a>
            </div>
        </div>
    );
}
