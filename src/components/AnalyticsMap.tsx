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

    const validPoints = points.filter(
        p => p.latitude !== null && p.longitude !== null
    );

    return (
        <div className="relative w-full aspect-[2/1] bg-zinc-950 rounded-xl border border-zinc-800 overflow-hidden group">
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
                                    fill="#18181b"
                                    stroke="#27272a"
                                    strokeWidth={0.5}
                                    style={{
                                        default: { outline: 'none' },
                                        hover: { fill: "#27272a", outline: 'none' },
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
                                    stroke="#fff"
                                    strokeWidth={1}
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

            {/* Tooltip */}
            <AnimatePresence>
                {tooltipContent && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute bottom-4 left-4 z-10 px-3 py-1.5 bg-zinc-900/90 backdrop-blur-md border border-zinc-700 rounded-lg shadow-xl text-[10px] font-medium text-zinc-100 uppercase tracking-widest pointer-events-none"
                    >
                        {tooltipContent}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Instructions */}
            <div className="absolute top-4 right-4 text-[9px] uppercase tracking-tighter text-zinc-500 font-bold pointer-events-none opacity-40 group-hover:opacity-100 transition-opacity">
                Doble clic o scroll para zoom · clickable
            </div>
        </div>
    );
}
