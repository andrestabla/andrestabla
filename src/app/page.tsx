import { prisma } from '@/lib/prisma';
import { Phone, Mail } from 'lucide-react';

export const revalidate = 0; // Disable static caching for real-time updates

export default async function Home() {
  const profile = await prisma.profile.findFirst();
  const experiences = await prisma.experience.findMany({ orderBy: { order: 'asc' } });
  const educations = await prisma.education.findMany({ orderBy: { order: 'asc' } });
  const publications = await prisma.publication.findMany({ orderBy: { order: 'asc' } });
  const courses = await prisma.course.findMany({ orderBy: { order: 'asc' } });

  if (!profile) return <div className="p-10 text-center font-mono">No profile data found. Please seed the database.</div>;

  return (
    <main className="container pb-20">

      {/* Sidebar Nav (Desktop Only) */}
      <nav className="fixed right-10 top-1/2 -translate-y-1/2 hidden md:flex flex-col gap-5 z-50">
        <a href="#hero" className="w-3 h-3 rounded-full border-2 border-slate-300 hover:bg-black hover:border-black transition-all"></a>
        <a href="#profile" className="w-3 h-3 rounded-full border-2 border-slate-300 hover:bg-black hover:border-black transition-all"></a>
        <a href="#experience" className="w-3 h-3 rounded-full border-2 border-slate-300 hover:bg-black hover:border-black transition-all"></a>
        <a href="#education" className="w-3 h-3 rounded-full border-2 border-slate-300 hover:bg-black hover:border-black transition-all"></a>
      </nav>

      {/* Hero Section */}
      <header id="hero" className="min-h-[60vh] flex items-center justify-start py-24">
        <div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-2 text-slate-900" style={{ fontFamily: 'var(--font-heading)' }}>
            {profile.name}
          </h1>
          <h2 className="text-lg text-slate-600 font-medium mb-8 max-w-2xl">{profile.role}</h2>

          <div className="border-l-2 border-black pl-6 mb-10">
            <p className="text-sm text-slate-500 mb-4">{profile.tagline}</p>
            <div className="flex gap-6 text-sm font-medium">
              <a href={`tel:${profile.phone}`} className="flex items-center gap-2 hover:border-b hover:border-black transition-all">
                <Phone size={16} /> {profile.phone}
              </a>
              <a href={`mailto:${profile.email}`} className="flex items-center gap-2 hover:border-b hover:border-black transition-all">
                <Mail size={16} /> {profile.email}
              </a>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <a href="https://algoritmot.com" target="_blank" className="glass-btn">algoritmot.com</a>
            <a href="https://aprenderonline.com.co" target="_blank" className="glass-btn">aprenderonline.com.co</a>
            <a href="https://profetabla.com" target="_blank" className="glass-btn">profetabla.com</a>
          </div>
        </div>
      </header>

      {/* Profile Section */}
      <section id="profile" className="mt-24 pt-8">
        <h3 className="section-title">PERFIL EJECUTIVO</h3>
        <p className="text-lg text-slate-800 leading-relaxed font-light">{profile.about}</p>
      </section>

      {/* Experience Section */}
      <section id="experience" className="mt-24 pt-8">
        <h3 className="section-title">EXPERIENCIA PROFESIONAL</h3>
        <div className="pl-0">
          {experiences.map((exp) => (
            <div key={exp.id} className="mb-14 relative">
              <div className="flex flex-col md:flex-row md:justify-between md:items-baseline mb-3">
                <h4 className="text-xl font-semibold max-w-lg">{exp.title} - {exp.company}</h4>
                <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">{exp.period}</span>
              </div>
              <p className="text-slate-700">{exp.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Education Section */}
      <section id="education" className="mt-24 pt-8">
        <h3 className="section-title">FORMACIÓN ACADÉMICA</h3>
        <div className="overflow-x-auto">
          <table className="premium-table">
            <thead>
              <tr>
                <th>Título</th>
                <th>Año</th>
                <th>Institución</th>
              </tr>
            </thead>
            <tbody>
              {educations.map((edu) => (
                <tr key={edu.id}>
                  <td className="font-medium text-slate-800">{edu.degree}</td>
                  <td className="text-slate-600">{edu.period}</td>
                  <td className="text-slate-600">{edu.institution}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Publications Section */}
      <section id="publications" className="mt-24 pt-8">
        <h3 className="section-title">PUBLICACIONES</h3>
        <div className="flex flex-col gap-4">
          {publications.map((pub) => (
            <div key={pub.id} className="p-6 bg-[#fbfbfd] rounded-xl hover:-translate-y-1 transition-transform border border-[#d2d2d7]" dangerouslySetInnerHTML={{ __html: pub.content }} />
          ))}
        </div>
      </section>

      {/* Courses Section */}
      <section id="courses" className="mt-24 pt-8">
        <h3 className="section-title">CURSOS VIRTUALES (AUTORÍA)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {courses.map((course) => (
            <div key={course.id} className="p-4 bg-[#fbfbfd] rounded-lg border border-[#d2d2d7] text-slate-800 font-medium">
              {course.title}
            </div>
          ))}
        </div>
      </section>

      {/* Footer & Admin Hook */}
      <footer className="mt-32 pt-10 text-center text-sm text-slate-500 pb-10">
        <p>&copy; 2026 Andrés Tabla Rico | Estrategia Digital y Excelencia Educativa</p>
        <a href="/login" className="mt-4 inline-block text-xs uppercase tracking-widest hover:text-black">Administración</a>
      </footer>
    </main>
  );
}
