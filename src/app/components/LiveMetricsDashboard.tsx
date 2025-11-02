"use client";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

type MetricSample = { ts: number; value: number };
interface Series {
    name: string;
    unit: string;
    color: string;
    samples: MetricSample[];
    min: number;
    max: number;
}

const INITIAL_SERIES: Series[] = [
    { name: "CPU", unit: "%", color: "#10B981", samples: [], min: 15, max: 85 },
    { name: "Latency", unit: "ms", color: "#F59E0B", samples: [], min: 30, max: 300 },
    { name: "Deploy/s", unit: "ops", color: "#3B82F6", samples: [], min: 0.4, max: 8 },
    { name: "Cost", unit: "$", color: "#EC4899", samples: [], min: 120, max: 300 }
];

export default function LiveMetricsDashboard() {
    const [series, setSeries] = useState<Series[]>(INITIAL_SERIES);
    const [paused, setPaused] = useState(false);
    const tickRef = useRef<number | null>(null);

    useEffect(() => {
        function generate() {
            setSeries(prev => prev.map(s => {
                const value = Number(
                    (s.min + (s.max - s.min) * (0.5 + 0.5 * Math.sin(Date.now() / (2000 + Math.random() * 1500) + s.name.length))).toFixed(2)
                );
                const samples = [...s.samples, { ts: Date.now(), value }].slice(-60); // manter últimos 60 pontos (~1min)
                return { ...s, samples };
            }));
        }
        if (!paused) {
            generate();
            tickRef.current = window.setInterval(generate, 1000);
        }
        return () => {
            if (tickRef.current) window.clearInterval(tickRef.current);
        };
    }, [paused]);

    return (
        <div className="relative z-20 max-w-7xl mx-auto px-6 mt-10">
            <motion.h2
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-4xl font-mono font-bold text-center mb-10 text-primary"
            >
                # Live Infrastructure Metrics
            </motion.h2>
            <div className="flex justify-end mb-4">
                <button
                    onClick={() => setPaused(p => !p)}
                    className="bg-terminal-bg border border-terminal-border hover:border-primary text-light/80 text-xs px-3 py-1 rounded font-mono"
                >
                    {paused ? "resume" : "pause"}
                </button>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {series.map(s => {
                    const current = s.samples[s.samples.length - 1]?.value ?? 0;
                    return (
                        <motion.div
                            key={s.name}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="bg-terminal-bg/50 backdrop-blur-sm border border-terminal-border rounded-lg p-4 flex flex-col"
                            whileHover={{ scale: 1.02 }}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <span className="font-mono text-light text-sm">{s.name}</span>
                                <span className="font-mono text-primary text-xs">{current}{s.unit}</span>
                            </div>
                            <Sparkline samples={s.samples} color={s.color} />
                            <div className="mt-2 text-[10px] text-light/40 font-mono">range {s.min} - {s.max}{s.unit}</div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}

interface SparkProps { samples: MetricSample[]; color: string; }
function Sparkline({ samples, color }: SparkProps) {
    const width = 260;
    const height = 60;
    if (!samples.length) return <div className="h-[60px]" />;
    const min = Math.min(...samples.map(s => s.value));
    const max = Math.max(...samples.map(s => s.value));
    const points = samples.map((s, i) => {
        const x = (i / (samples.length - 1)) * width;
        const y = height - ((s.value - min) / (max - min || 1)) * height;
        return `${x},${y}`;
    }).join(" ");
    const last = samples[samples.length - 1].value;
    return (
        <svg width={width} height={height} className="overflow-visible">
            <polyline
                points={points}
                fill="none"
                stroke={color}
                strokeWidth={2}
                strokeLinejoin="round"
                strokeLinecap="round"
            />
            <circle
                cx={width}
                cy={height - ((last - min) / (max - min || 1)) * height}
                r={3}
                fill={color}
                className="animate-pulse"
            />
        </svg>
    );
}