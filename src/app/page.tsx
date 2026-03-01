import { prisma } from '@/lib/prisma';
import HeroBlock from '@/components/HeroBlock';
import ExperienceTimeline from '@/components/ExperienceTimeline';
import BentoGrid from '@/components/BentoGrid';
import { Lock } from 'lucide-react';

export const revalidate = 0; // Force dynamic rendering so edits show immediately

export default async function Home() {
  const profile = await prisma.profile.findFirst();
  const experiences = await prisma.experience.findMany({ orderBy: { order: 'asc' } });
  const educations = await prisma.education.findMany({ orderBy: { order: 'asc' } });
  const publications = await prisma.publication.findMany({ orderBy: { order: 'asc' } });
  const courses = await prisma.course.findMany({ orderBy: { order: 'asc' } });

  if (!profile) return <div className="p-24 text-center font-bold">Iniciando sistema...</div>;

  return (
    <main className="max-w-5xl mx-auto px-6 font-sans">
      <HeroBlock profile={profile} />

      {/* About Section - Glassmorphism Card */}
      <section id="about" className="mt-8 mb-24 relative">
        <div className="absolute inset-0 bg-blue-500/5 blur-3xl rounded-full translate-y-10 -z-10"></div>
        <div className="bg-white/80 backdrop-blur-md border border-white p-8 md:p-12 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-4">
            <span>Perfil Ejecutivo</span>
            <div className="h-[1px] flex-1 bg-slate-200"></div>
          </h3>
          <p className="text-lg md:text-2xl text-slate-700 leading-relaxed font-light">{profile.about}</p>
        </div>
      </section>

      <ExperienceTimeline experiences={experiences} />

      <section id="education" className="mt-32">
        <h3 className="section-title">
          FORMACIÓN ACADÉMICA
        </h3>
        <div className="mt-12">
          {/* Wrapping BentoGrid for Education */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {educations.map((edu) => (
              <div key={edu.id} className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all flex flex-col justify-between">
                <div>
                  <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-widest rounded-full mb-4">{edu.period}</span>
                  <h4 className="text-lg font-bold text-slate-900 leading-snug mb-2">{edu.degree}</h4>
                </div>
                <p className="text-sm text-slate-500 font-medium mt-4">{edu.institution}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="publications" className="mt-32">
        <h3 className="section-title">
          PUBLICACIONES DESTACADAS
        </h3>
        <div className="mt-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {publications.map((pub) => (
              <div key={pub.id} className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-1 transition-transform">
                <div className="text-sm text-slate-700 leading-relaxed font-light" dangerouslySetInnerHTML={{ __html: pub.content }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="courses" className="mt-32 mb-40">
        <h3 className="section-title">
          CURSOS Y DIPLOMADOS RECIENTES
        </h3>
        <div className="mt-12">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {courses.map((course) => (
              <div key={course.id} className="bg-zinc-50 border border-zinc-200 p-6 rounded-3xl text-center hover:bg-black hover:text-white transition-colors group flex items-center justify-center min-h-[120px]">
                <h4 className="font-semibold text-sm group-hover:text-white transition-colors text-slate-800 leading-snug">{course.title}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 py-12 flex flex-col md:flex-row justify-between items-center gap-4 text-sm font-medium text-slate-500">
        <p>© {new Date().getFullYear()} Andrés Tabla Rico. Reservados todos los derechos.</p>
        <a href="/login" className="flex items-center gap-2 hover:text-black transition-colors px-4 py-2 bg-slate-50 rounded-lg">
          <Lock size={14} /> Acceso Directivo (CMS)
        </a>
      </footer>

      {/* Global CSS for section titles used across components */}
      <style dangerouslySetInnerHTML={{
        __html: `
        .section-title {
            font-size: 0.75rem;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            color: #94a3b8; /* slate-400 */
            display: flex;
            align-items: center;
            gap: 1rem;
        }
        .section-title::after {
            content: '';
            flex: 1;
            height: 1px;
            background-color: #e2e8f0; /* slate-200 */
        }
      `}} />
    </main>
  );
}
