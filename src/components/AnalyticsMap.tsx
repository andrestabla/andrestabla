'use client';

import React, { useState } from 'react';
import {
    ComposableMap,
    Geographies,
    Geography,
    Marker,
    ZoomableGroup
} from 'react-simple-maps';
import { motion, AnimatePresence } from 'framer-motion';

// URL for the world map topojson
const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface GeoPoint {
    key: string;
    city: string;
    country: string;
    latitude: number | null;
    longitude: number | null;
    hits: number;
}

interface AnalyticsMapProps {
    points: GeoPoint[];
}

export default function AnalyticsMap({ points }: AnalyticsMapProps) {
    const [tooltipContent, setTooltipContent] = useState<string | null>(null);
    const [theme, setTheme] = useState<'dark' | 'light'>('light');

    const validPoints = points.filter(
        p => p.latitude !== null && p.longitude !== null
    );

    // Theme-based colors
    const mapColors = {
        dark: {
            bg: "bg-zinc-950",
            land: "#ffffff",
            border: "#e4e4e7",
            hover: "#f4f4f5",
            text: "text-zinc-400",
            tooltipBg: "bg-zinc-900/90",
            tooltipBorder: "border-zinc-700",
            tooltipText: "text-zinc-100"
        },
        light: {
            bg: "bg-zinc-100",
            land: "#e4e4e7",
            border: "#d4d4d8",
            hover: "#d4d4d8",
            text: "text-zinc-400",
            tooltipBg: "bg-white/90",
            tooltipBorder: "border-zinc-200",
            tooltipText: "text-zinc-900"
        }
    };

    const currentTheme = mapColors[theme];

    return (
        <div className={`relative w-full aspect-[2/1] ${currentTheme.bg} rounded-xl border border-zinc-800 overflow-hidden group transition-colors duration-500`}>
            <ComposableMap
                projectionConfig={{
                    rotate: [-10, 0, 0],
                    scale: 147
                }}
                className="w-full h-full"
            >
                <ZoomableGroup zoom={1} minZoom={1} maxZoom={8}>
                    <Geographies geography={geoUrl}>
                        {({ geographies }: { geographies: any[] }) =>
                            geographies.map((geo: any) => (
                                <Geography
                                    key={geo.rsmKey}
                                    geography={geo}
                                    fill={currentTheme.land}
                                    stroke={currentTheme.border}
                                    strokeWidth={0.5}
                                    style={{
                                        default: { outline: 'none' },
                                        hover: { fill: currentTheme.hover, outline: 'none' },
                                        pressed: { outline: 'none' },
                                    }}
                                />
                            ))
                        }
                    </Geographies>

                    {validPoints.map((point) => {
                        const radius = Math.max(3, Math.min(12, 2 + Math.log10(point.hits + 1) * 4));
                        
                        return (
                            <Marker 
                                key={point.key} 
                                coordinates={[point.longitude!, point.latitude!]}
                                onMouseEnter={() => {
                                    setTooltipContent(`${point.city}, ${point.country} (${point.hits} accesos)`);
                                }}
                                onMouseLeave={() => {
                                    setTooltipContent(null);
                                }}
                            >
                                <motion.circle
                                    initial={{ r: 0, opacity: 0 }}
                                    animate={{ r: radius, opacity: 1 }}
                                    fill="#3b82f6"
                                    stroke={theme === 'dark' ? "#fff" : "#1e40af"}
                                    strokeWidth={theme === 'dark' ? 1 : 1.5}
                                    className="cursor-pointer"
                                />
                                <motion.circle
                                    initial={{ r: 0, opacity: 0 }}
                                    animate={{ 
                                        r: radius * 3, 
                                        opacity: [0, 0.4, 0],
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        ease: "easeOut"
                                    }}
                                    fill="#3b82f6"
                                    style={{ pointerEvents: 'none' }}
                                />
                            </Marker>
                        );
                    })}
                </ZoomableGroup>
            </ComposableMap>

            {/* Theme Toggle */}
            <div className="absolute top-4 left-4 z-10 flex gap-1 bg-zinc-900/50 backdrop-blur-sm p-1 rounded-lg border border-zinc-800">
                <button
                    onClick={() => setTheme('dark')}
                    className={`px-2 py-1 rounded text-[9px] uppercase font-bold tracking-widest transition-all ${theme === 'dark' ? 'bg-zinc-100 text-zinc-900' : 'text-zinc-400 hover:text-white'}`}
                >
                    Dark
                </button>
                <button
                    onClick={() => setTheme('light')}
                    className={`px-2 py-1 rounded text-[9px] uppercase font-bold tracking-widest transition-all ${theme === 'light' ? 'bg-zinc-100 text-zinc-900' : 'text-zinc-400 hover:text-white'}`}
                >
                    Light
                </button>
            </div>

            {/* Tooltip */}
            <AnimatePresence>
                {tooltipContent && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className={`absolute bottom-4 left-4 z-10 px-3 py-1.5 ${currentTheme.tooltipBg} backdrop-blur-md border ${currentTheme.tooltipBorder} rounded-lg shadow-xl text-[10px] font-medium ${currentTheme.tooltipText} uppercase tracking-widest pointer-events-none transition-colors duration-500`}
                    >
                        {tooltipContent}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Instructions */}
            <div className={`absolute top-4 right-4 text-[9px] uppercase tracking-tighter ${currentTheme.text} font-bold pointer-events-none opacity-40 group-hover:opacity-100 transition-opacity duration-500`}>
                Doble clic o scroll para zoom · clickable
            </div>
        </div>
    );
}
