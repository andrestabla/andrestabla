'use client';

import { useState } from 'react';
import { UserCircle, Briefcase, GraduationCap, BookOpen, Layers, Save, Trash2, Plus } from 'lucide-react';
import { updateProfile, updateExperience, deleteExperience, addExperience, updateEducation, deleteEducation, addEducation } from './actions';

export default function BuilderInspector({ initialData }: { initialData: any }) {
    const [activeTab, setActiveTab] = useState('profile');
    const [refreshKey, setRefreshKey] = useState(0);

    const tabs = [
        { id: 'profile', icon: UserCircle, label: 'Perfil' },
        { id: 'experience', icon: Briefcase, label: 'Experiencia' },
        { id: 'education', icon: GraduationCap, label: 'Formación' },
    ];

    // Helper macro to reload the iframe on the right side
    const forcePreviewReload = () => {
        const iframe = document.getElementById('live-preview-iframe') as HTMLIFrameElement;
        if (iframe) iframe.src = iframe.src;
    };

    const handleAction = async (actionFn: Function, args: any[]) => {
        await actionFn(...args);
        forcePreviewReload();
    };

    return (
        <div className="flex flex-col gap-6">
            {/* Tabs Navigation */}
            <div className="flex gap-2 border-b border-[#e5e7eb] pb-2">
                {tabs.map(tab => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex-1 flex flex-col items-center gap-1.5 p-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${isActive ? 'bg-black text-white shadow-md' : 'text-slate-500 hover:bg-slate-100'
                                }`}
                        >
                            <Icon size={16} />
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* Pane: PROFILE */}
            {activeTab === 'profile' && (
                <form action={(fd) => handleAction(updateProfile, [initialData.profile.id, fd])} className="flex flex-col gap-4 animate-in fade-in slide-in-from-left-4 duration-300">
                    <InputGroup label="Nombre y Apellidos" name="name" defaultValue={initialData.profile.name} required />
                    <InputGroup label="Cargo Principal" name="role" defaultValue={initialData.profile.role} required />
                    <InputGroup label="Eslogan / Subtítulo" name="tagline" defaultValue={initialData.profile.tagline} />

                    <div className="grid grid-cols-2 gap-4">
                        <InputGroup label="Teléfono" name="phone" defaultValue={initialData.profile.phone} />
                        <InputGroup label="Email" name="email" defaultValue={initialData.profile.email} />
                    </div>

                    <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Perfil Ejecutivo</label>
                        <textarea
                            name="about"
                            defaultValue={initialData.profile.about}
                            rows={6}
                            className="w-full text-sm border border-slate-300 rounded-xl p-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all resize-none shadow-sm"
                        />
                    </div>

                    <SaveButton />
                </form>
            )}

            {/* Pane: EXPERIENCE */}
            {activeTab === 'experience' && (
                <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-left-4 duration-300">
                    {initialData.experiences.map((exp: any) => (
                        <form key={exp.id} action={(fd) => handleAction(updateExperience, [exp.id, fd])} className="bg-white border text-sm border-slate-200 rounded-xl p-4 shadow-sm relative group">
                            <button type="button" onClick={() => handleAction(deleteExperience, [exp.id])} className="absolute top-3 right-3 text-slate-300 hover:text-red-500 transition-colors">
                                <Trash2 size={16} />
                            </button>

                            <div className="grid grid-cols-2 gap-3 mb-3 pr-8">
                                <div>
                                    <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Cargo</label>
                                    <input name="title" defaultValue={exp.title} className="w-full border-b border-transparent hover:border-slate-200 focus:border-blue-500 focus:outline-none transition-colors py-1" />
                                </div>
                                <div>
                                    <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Empresa</label>
                                    <input name="company" defaultValue={exp.company} className="w-full border-b border-transparent hover:border-slate-200 focus:border-blue-500 focus:outline-none transition-colors py-1" />
                                </div>
                            </div>

                            <div className="mb-3">
                                <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Periodo</label>
                                <input name="period" defaultValue={exp.period} className="w-full border-b border-transparent hover:border-slate-200 focus:border-blue-500 focus:outline-none transition-colors py-1" />
                            </div>

                            <div className="mb-4">
                                <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Descripción</label>
                                <textarea name="description" defaultValue={exp.description} rows={3} className="w-full border border-slate-200 rounded-lg p-2 focus:border-blue-500 focus:outline-none transition-colors resize-none text-xs" />
                            </div>

                            <SaveButton small />
                        </form>
                    ))}

                    <button onClick={() => handleAction(addExperience, [])} className="flex items-center justify-center gap-2 border-2 border-dashed border-slate-300 text-slate-500 rounded-xl p-4 hover:border-black hover:text-black transition-all font-medium text-sm">
                        <Plus size={16} /> Añadir Nueva Experiencia
                    </button>
                </div>
            )}

            {/* Pane: EDUCATION (similar structure) */}
            {activeTab === 'education' && (
                <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-left-4 duration-300">
                    {initialData.educations.map((edu: any) => (
                        <form key={edu.id} action={(fd) => handleAction(updateEducation, [edu.id, fd])} className="bg-white border text-sm border-slate-200 rounded-xl p-4 shadow-sm relative">
                            <button type="button" onClick={() => handleAction(deleteEducation, [edu.id])} className="absolute top-4 right-3 text-slate-300 hover:text-red-500 transition-colors">
                                <Trash2 size={16} />
                            </button>

                            <div className="flex flex-col gap-2 pr-8 mb-3">
                                <input name="degree" defaultValue={edu.degree} className="font-semibold border-b border-transparent hover:border-slate-200 focus:border-blue-500 focus:outline-none" placeholder="Título" />
                                <input name="institution" defaultValue={edu.institution} className="text-slate-500 border-b border-transparent hover:border-slate-200 focus:border-blue-500 focus:outline-none" placeholder="Institución" />
                                <input name="period" defaultValue={edu.period} className="text-xs text-slate-400 border-b border-transparent hover:border-slate-200 focus:border-blue-500 focus:outline-none" placeholder="Año / Periodo" />
                            </div>
                            <SaveButton small />
                        </form>
                    ))}

                    <button onClick={() => handleAction(addEducation, [])} className="flex flex-col items-center justify-center gap-1 border-2 border-dashed border-slate-300 text-slate-500 rounded-xl p-4 hover:border-black hover:text-black transition-all font-medium text-sm">
                        <Plus size={18} /> <span className="text-xs">Añadir Formación</span>
                    </button>
                </div>
            )}

        </div>
    );
}

// ----------------- UI Helpers -----------------
function InputGroup({ label, name, defaultValue, required = false }: { label: string, name: string, defaultValue?: string, required?: boolean }) {
    return (
        <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">{label}</label>
            <input
                type="text"
                name={name}
                defaultValue={defaultValue}
                required={required}
                className="text-sm w-full border border-slate-300 rounded-xl p-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all shadow-sm"
            />
        </div>
    );
}

function SaveButton({ small = false }: { small?: boolean }) {
    return (
        <button type="submit" className={`flex items-center justify-center gap-2 bg-black text-white rounded-lg font-medium hover:bg-slate-800 transition-all ${small ? 'p-2 text-xs w-full' : 'p-3 mt-2'}`}>
            <Save size={small ? 14 : 16} /> {small ? 'Actualizar' : 'Guardar Cambios'}
        </button>
    );
}
