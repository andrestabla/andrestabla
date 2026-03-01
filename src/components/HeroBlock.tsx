'use client';

import { motion } from 'framer-motion';
import { Phone, Mail } from 'lucide-react';

export default function HeroBlock({ profile }: { profile: any }) {
    return (
        <header id="hero" className="min-h-[70vh] flex items-center justify-start py-24 relative overflow-hidden">
            {/* Abstract Background Elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-slate-100/50 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="w-full"
            >
                <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-4 text-slate-900 leading-[1.1]" style={{ fontFamily: 'var(--font-heading)' }}>
                    {profile.name}
                </h1>

                <motion.h2
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    className="text-xl md:text-2xl text-slate-500 font-medium mb-12 max-w-3xl leading-relaxed tracking-tight"
                >
                    {profile.role}
                </motion.h2>

                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="border-l-4 border-black pl-8 mb-12 relative"
                >
                    <div className="absolute top-0 left-[-2px] w-[4px] h-0 bg-black animate-[growDown_1s_ease-out_forwards]"></div>
                    <p className="text-sm font-semibold uppercase tracking-widest text-slate-400 mb-6">{profile.tagline}</p>
                    <div className="flex flex-col md:flex-row gap-6 text-sm font-medium">
                        <a href={`tel:${profile.phone}`} className="flex items-center gap-2 group hover:text-black transition-colors text-slate-600">
                            <div className="p-2 rounded-full bg-slate-100 group-hover:bg-black group-hover:text-white transition-all"><Phone size={16} /></div>
                            {profile.phone}
                        </a>
                        <a href={`mailto:${profile.email}`} className="flex items-center gap-2 group hover:text-black transition-colors text-slate-600">
                            <div className="p-2 rounded-full bg-slate-100 group-hover:bg-black group-hover:text-white transition-all"><Mail size={16} /></div>
                            {profile.email}
                        </a>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7, duration: 0.8 }}
                    className="flex flex-wrap gap-4"
                >
                    <a href="https://algoritmot.com" target="_blank" className="px-6 py-3 bg-slate-100 rounded-xl hover:bg-black hover:text-white transition-all font-medium text-sm border border-transparent shadow-sm">algoritmot.com</a>
                    <a href="https://aprenderonline.com.co" target="_blank" className="px-6 py-3 bg-slate-100 rounded-xl hover:bg-black hover:text-white transition-all font-medium text-sm border border-transparent shadow-sm">aprenderonline.com.co</a>
                    <a href="https://profetabla.com" target="_blank" className="px-6 py-3 bg-slate-100 rounded-xl hover:bg-black hover:text-white transition-all font-medium text-sm border border-transparent shadow-sm">profetabla.com</a>
                </motion.div>
            </motion.div>

            <style dangerouslySetInnerHTML={{
                __html: `
        @keyframes growDown {
            0% { height: 0; }
            100% { height: 100%; }
        }
      `}} />
        </header>
    );
}
