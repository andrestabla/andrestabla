import { useState } from 'react';

export default function GridInspector({ initialData, onSave, isSaving }: { initialData: any, onSave: (data: any) => void, isSaving: boolean }) {
    const [columns, setColumns] = useState(initialData.columns || 2);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ ...initialData, columns: parseInt(columns.toString()) });
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4">

            <div className="bg-slate-50 p-4 border border-slate-200 rounded-xl space-y-4">
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-4 h-4 rounded bg-indigo-500 flex items-center justify-center text-white text-[10px]"><span className="leading-none">&#9638;</span></div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Número de Columnas</label>
                </div>

                <div className="grid grid-cols-4 gap-2">
                    {[1, 2, 3, 4].map(num => (
                        <button
                            key={num}
                            type="button"
                            onClick={() => setColumns(num)}
                            className={`py-3 rounded-lg border ${columns === num ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-bold' : 'border-slate-300 bg-white text-slate-500 hover:border-indigo-400'} transition-all`}
                        >
                            {num}
                        </button>
                    ))}
                </div>
                <p className="text-[10px] text-slate-400 mt-2">Esta sección dividirá el contenido interno en {columns} {columns === 1 ? 'columna' : 'columnas'} equidistantes. Selecciona este bloque en el menú para inyectarle contenido (widgets hijos).</p>
            </div>

            <button type="submit" disabled={isSaving} className="w-full bg-black text-white p-3 rounded-xl font-bold text-xs uppercase hover:bg-slate-800 transition-colors shadow-lg disabled:opacity-50 flex items-center justify-center gap-2">
                {isSaving ? <span className="animate-spin text-lg">⚙</span> : <span>Guardar Layout</span>}
            </button>
        </form>
    );
}
