export default function AdminPage() {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center p-8 animate-in fade-in duration-500">
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 mb-6 shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" /></svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Editor Visual Avanzado (En Construcción)</h2>
            <p className="text-slate-500 max-w-md mx-auto leading-relaxed">
                Estamos migrando la plataforma a una arquitectura de <strong>Visual Builder</strong> basada en JSON (Fase B).
                Muy pronto podrás arrastrar y soltar componentes directamente en este lienzo interactivo.
            </p>
        </div>
    );
}
