import React from 'react';

export default function MapBlock({ data, isEditor }: { data: any, isEditor?: boolean }) {
    const embedUrl = data.embedUrl || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1m3!1d3976.9254399767666!2d-74.06527502422709!3d4.607386042456076!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e3f99a093ed03af%3A0x67bb481498b89417!2sUniversidad%20de%20los%20Andes!5e0!3m2!1ses!2sco!4v1709400000000!5m2!1ses!2sco";
    const height = data.height || 'h-[400px]';
    const borderRadius = data.borderRadius || 'rounded-2xl';

    return (
        <div className={`w-full ${height} ${borderRadius} overflow-hidden shadow-xl bg-zinc-800 relative`}>
            {isEditor && (
                <div className="absolute inset-0 z-10" title="Interacción deshabilitada en el Editor para facilitar arrastre"></div>
            )}
            <iframe
                src={embedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="filter dark:contrast-125 dark:opacity-80"
            ></iframe>
        </div>
    );
}
